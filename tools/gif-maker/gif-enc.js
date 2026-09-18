/* Tiny GIF89a encoder — 256-color, LZW, multi-frame. No dependencies.
   Frames: { data: ImageData-like {data,width,height}, delayCs (1/100s) } */
(function (global) {
    "use strict";

    const MIN_CODE_SIZE = 8; /* 256-entry color table */

    function buildPalette(frames) {
        /* alpha<128 -> transparent slot 0 */
        const counts = new Map();
        for (const f of frames) {
            const d = f.data;
            for (let i = 0; i < d.length; i += 4) {
                if (d[i + 3] < 128) continue;
                const c = ((d[i] << 16) | (d[i + 1] << 8) | d[i + 2]) & 0xFFFFFF;
                counts.set(c, (counts.get(c) || 0) + 1);
            }
        }
        const arr = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
        const palette = [new Uint8Array([0, 0, 0])]; /* slot 0 reserved: transparent */
        for (const [c] of arr) {
            if (palette.length >= 256) break;
            palette.push(new Uint8Array([c >> 16 & 255, c >> 8 & 255, c & 255]));
        }
        /* map color -> index */
        const map = new Map();
        for (let i = 1; i < palette.length; i++) {
            map.set(palette[i][0] << 16 | palette[i][1] << 8 | palette[i][2], i);
        }
        return { palette, map };
    }

    function indexFrame(frame, palette, map) {
        const n = frame.width * frame.height;
        const idx = new Uint8Array(n);
        let transparentUsed = false;
        const d = frame.data;
        for (let i = 0, j = 0; i < n; i++, j += 4) {
            if (d[j + 3] < 128) { idx[i] = 0; transparentUsed = true; continue; }
            const c = ((d[j] << 16) | (d[j + 1] << 8) | d[j + 2]) & 0xFFFFFF;
            let k = map.get(c);
            if (k === undefined) k = nearest(palette, d[j], d[j + 1], d[j + 2]);
            idx[i] = k;
        }
        return { idx, transparentUsed };
    }

    function nearest(palette, r, g, b) {
        let best = 0, bd = Infinity;
        for (let i = 1; i < palette.length; i++) {
            const dr = palette[i][0] - r, dg = palette[i][1] - g, db = palette[i][2] - b;
            const dist = dr * dr + dg * dg + db * db;
            if (dist < bd) { bd = dist; best = i; }
            if (bd === 0) break;
        }
        return best;
    }

    /* GIF LZW data (payload only, no sub-block framing) */
    function lzwEncode(data) {
        const ncolors = MIN_CODE_SIZE;
        const clearCode = 1 << ncolors;                   /* 256 */
        const endCode = clearCode + 1;                    /* 257 */
        const firstCode = endCode + 1;                    /* 258 */
        const dict = new Map();
        let next = firstCode;
        let codeSize = ncolors + 1;                       /* 9 */
        let out = [];
        let bits = 0, bitbuf = 0;

        function writeCode(code) {
            bitbuf |= code << bits;
            bits += codeSize;
            while (bits >= 8) { out.push(bitbuf & 255); bitbuf >>>= 8; bits -= 8; }
        }
        function reset() {
            dict.clear();
            next = firstCode;
            codeSize = ncolors + 1;
        }

        if (data.length === 0) return out;
        writeCode(clearCode);
        let current = data[0];
        for (let i = 1; i < data.length; i++) {
            const c = data[i];
            const key = (current << 8) | c;
            if (dict.has(key)) { current = key; continue; }
            writeCode(current);
            if (next < 4096) {
                dict.set(key, next++);
                if (next === (1 << codeSize) && codeSize < 12) codeSize++;
            } else {
                writeCode(clearCode);
                reset();
            }
            current = c;
        }
        writeCode(current);
        writeCode(endCode);
        if (bits > 0) out.push(bitbuf & 255);
        return out;
    }

    function encode(frames) {
        if (!frames.length) throw new Error("no-frames");
        const width = frames[0].width, height = frames[0].height;
        const { palette, map } = buildPalette(frames);
        const indexed = frames.map(f => indexFrame(f, palette, map));
        const ncolors = Math.max(1, Math.ceil(Math.log2(palette.length)));
        const colorTableSize = Math.pow(2, ncolors);
        const haveTransparent = indexed.some(f => f.transparentUsed);

        const out = [];
        out.push(...ascii("GIF89a"));
        push16(out, width); push16(out, height);
        out.push(0xF3); /* GCT present, 8-bit, sort off */
        out.push(0); out.push(0);
        for (let i = 0; i < colorTableSize; i++) {
            const c = palette[i] || new Uint8Array(3);
            out.push(c[0], c[1], c[2]);
        }

        indexed.forEach(f => {
            out.push(0x21, 0xF9, 4);
            out.push(haveTransparent ? 0x09 : 0x00);
            push16(out, Math.max(1, f.delayCs | 0));
            out.push(0, 0);
            out.push(0x2C);
            push16(out, 0); push16(out, 0);
            push16(out, width); push16(out, height);
            out.push(0);
            out.push(ncolors);
            const payload = lzwEncode(f.idx);
            for (let i = 0; i < payload.length; i += 254) {
                out.push(Math.min(254, payload.length - i));
                for (let j = 0; j < 254 && i + j < payload.length; j++) out.push(payload[i + j]);
            }
            out.push(0);
        });

        out.push(0x3B);
        return new Uint8Array(out);
    }

    function push16(arr, v) { arr.push(v & 255, (v >> 8) & 255); }
    function ascii(s) { return Array.from(s, c => c.charCodeAt(0)); }

    const api = { encode };
    if (typeof module !== "undefined" && module.exports) module.exports = api;
    else global.GIFEncoder = api;
})(typeof self !== "undefined" ? self : this);