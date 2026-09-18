/* QR Code generator — compact implementation of Nayuki's algorithm (MIT).
 * Versions 1-10, byte mode only, ECC levels L/M/Q/H.
 * Returns a 2D 0/1 module matrix (no quiet zone). */

"use strict";

const QR = (() => {
    const P0 = 0x11D;

    /* RS block structure [count, total, data] per version, indexed [ver-1][lvl] */
    const RS_BLOCKS = [
        [[[1,26,19]],[[1,26,16]],[[1,26,13]],[[1,26,9]]],
        [[[1,44,34]],[[1,44,28]],[[1,44,22]],[[1,44,16]]],
        [[[1,70,55]],[[1,70,44]],[[2,35,17]],[[2,35,13]]],
        [[[1,100,80]],[[2,50,32]],[[2,50,24]],[[4,25,9]]],
        [[[1,134,108]],[[2,67,43]],[[2,33,15],[2,34,16]],[[2,33,11],[2,34,12]]],
        [[[2,86,68]],[[4,43,27]],[[4,43,19]],[[4,43,15]]],
        [[[2,98,78]],[[4,49,31]],[[2,32,14],[4,33,15]],[[4,39,13],[1,40,14]]],
        [[[2,121,97]],[[2,60,38],[2,61,39]],[[4,40,18],[2,41,19]],[[4,40,14],[2,41,15]]],
        [[[2,146,116]],[[3,58,36],[2,59,37]],[[4,36,16],[4,37,17]],[[4,36,12],[4,37,13]]],
        [[[2,86,68],[2,87,69]],[[4,69,43],[1,70,44]],[[6,43,19],[2,44,20]],[[6,43,15],[2,44,16]]]
    ];
    const ALIGN = {
        1: [], 2: [6,18], 3: [6,22], 4: [6,26], 5: [6,30], 6: [6,34],
        7: [6,22,38], 8: [6,24,42], 9: [6,26,46], 10: [6,28,50]
    };

    let EXP = null, LOG = null;
    function ensureGF() {
        if (EXP) return;
        EXP = new Array(512); LOG = new Array(256).fill(-1);
        let x = 1;
        for (let i = 0; i < 255; i++) {
            EXP[i] = x; LOG[x] = i;
            x <<= 1;
            if (x & 0x100) x ^= P0;
        }
        for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
    }
    function gfMul(a, b) {
        if (a === 0 || b === 0) return 0;
        return EXP[LOG[a] + LOG[b]];
    }

    function rsDivisor(degree) {
        let result = [1];
        for (let i = 0; i < degree; i++) {
            const p = result;
            const next = new Array(p.length + 1).fill(0);
            for (let j = 0; j < p.length; j++) {
                next[j] ^= p[j];
                next[j + 1] ^= gfMul(p[j], EXP[i]);
            }
            result = next;
        }
        return result;
    }

    function rsRemainder(data, divisor) {
        const res = new Array(divisor.length).fill(0);
        for (const b of data) {
            const factor = b ^ res.shift();
            res.push(0);
            for (let i = 1; i < divisor.length; i++) {
                res[i - 1] = res[i - 1] ^ (factor === 0 ? 0 : gfMul(factor, divisor[i]));
            }
        }
        return res.slice(0, divisor.length - 1);
    }

    function rawModules(ver) { return (16 * ver + 128) * ver + 64; }
    function dataCodewordCount(ver, lvl) {
        return RS_BLOCKS[ver - 1][lvl].reduce((a, g) => a + g[0] * g[2], 0);
    }
    function blockConf(ver, lvl) {
        const out = [];
        for (const [count, total, data] of RS_BLOCKS[ver - 1][lvl])
            for (let i = 0; i < count; i++) out.push({ total, dlen: data, elen: total - data });
        return out;
    }

    function encode(text, opts) {
        opts = opts || {};
        const lvl = { L: 0, M: 1, Q: 2, H: 3 }[opts.ecc || "M"];
        if (lvl === undefined) throw new Error("bad ecc");
        ensureGF();

        const data = Array.from(new TextEncoder().encode(String(text)));
        let ver = 0;
        for (let v = 1; v <= 10; v++) {
            const charBits = v <= 9 ? 8 : 16;
            const need = 4 + charBits + data.length * 8 + 4;
            if (need <= dataCodewordCount(v, lvl) * 8) { ver = v; break; }
        }
        if (!ver) throw new Error("too long");

        const conf = blockConf(ver, lvl);
        const capacityBits = dataCodewordCount(ver, lvl) * 8;
        const charBits = ver <= 9 ? 8 : 16;

        const bits = [];
        const pushBits = (val, len) => { for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1); };
        pushBits(0x4, 4);
        pushBits(data.length, charBits);
        for (const b of data) pushBits(b, 8);
        const term = Math.min(3, capacityBits - bits.length);
        for (let i = 0; i < term; i++) bits.push(0);
        while (bits.length % 8 !== 0) bits.push(0);
        let padFlips = 0;
        while (bits.length < capacityBits) {
            pushBits(padFlips & 1 ? 0x11 : 0xEC, 8);
            padFlips++;
        }

        const cw = [];
        for (let i = 0; i < bits.length; i += 8) {
            let b = 0;
            for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j];
            cw.push(b);
        }

        const blocks = [];
        let pos = 0;
        for (const b of conf) {
            blocks.push({ d: cw.slice(pos, pos + b.dlen), elen: b.elen });
            pos += b.dlen;
        }
        for (const b of blocks) {
            const divisor = rsDivisor(b.elen);
            b.e = rsRemainder(b.d, divisor);
        }

        const result = [];
        const dataBlocks = blocks.map(b => b.d);
        const maxD = Math.max(...dataBlocks.map(b => b.length));
        for (let i = 0; i < maxD; i++) for (const b of dataBlocks) if (i < b.length) result.push(b[i]);
        const maxE = Math.max(...blocks.map(b => b.e.length));
        for (let i = 0; i < maxE; i++) for (const b of blocks) if (i < b.e.length) result.push(b.e[i]);

        const size = ver * 4 + 17;
        const mod = Array.from({ length: size }, () => new Array(size).fill(0));
        const isFn = Array.from({ length: size }, () => new Array(size).fill(false));
        const setFn = (r, c, v) => { mod[r][c] = v ? 1 : 0; isFn[r][c] = true; };

        (function drawFuncs() {
            const finder = (r, c) => {
                for (let dr = -1; dr <= 7; dr++) {
                    for (let dc = -1; dc <= 7; dc++) {
                        const rr = r + dr, cc = c + dc;
                        if (rr < 0 || rr >= size || cc < 0 || cc >= size) continue;
                        const inR = dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6;
                        const dark = inR && (dr === 0 || dr === 6 || dc === 0 || dc === 6 ||
                            (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4));
                        setFn(rr, cc, dark);
                    }
                }
            };
            finder(0, 0);
            finder(size - 7, 0);
            finder(0, size - 7);
            for (const ay of ALIGN[ver]) {
                for (const ax of ALIGN[ver]) {
                    if (isFn[ay][ax]) continue;
                    for (let dr = -2; dr <= 2; dr++) {
                        for (let dc = -2; dc <= 2; dc++) {
                            setFn(ay + dr, ax + dc, Math.max(Math.abs(dr), Math.abs(dc)) !== 1);
                        }
                    }
                }
            }
            for (let i = 8; i < size - 8; i++) {
                if (!isFn[i][6]) setFn(i, 6, i % 2 === 0);
                if (!isFn[6][i]) setFn(6, i, i % 2 === 0);
            }
            setFn(size - 8, 8, 1);
            /* pre-mark format info cells so data placement skips them (matches python setup_type_info) */
            for (let i = 0; i < 15; i++) {
                /* vertical copy (column 8) */
                if (i < 6) isFn[i][8] = true;
                else if (i < 8) isFn[i + 1][8] = true;
                else isFn[size - 15 + i][8] = true;
                /* horizontal copy (row 8) */
                if (i < 8) isFn[8][size - 1 - i] = true;
                else if (i < 9) isFn[8][15 - i - 1 + 1] = true;
                else isFn[8][15 - i - 1] = true;
            }
            if (size >= 45) {
                let vbits = ver << 12;
                let poly = 0x1F25;
                for (let i = 17; i >= 12; i--) if ((vbits >>> i) & 1) vbits ^= poly << (i - 12);
                vbits = (ver << 12) | vbits;
                for (let i = 0; i < 18; i++) {
                    const bit = (vbits >>> i) & 1;
                    const a = size - 11 + (i % 3);
                    const b = Math.floor(i / 3);
                    setFn(a, b, bit);
                    setFn(b, a, bit);
                }
            }
        })();

        const getBit = i => i < result.length * 8 ? ((result[i >> 3] >>> (7 - (i & 7))) & 1) : 0;
        let bitIndex = 0;
        for (let right = size - 1; right >= 1; right -= 2) {
            if (right === 6) right = 5;
            for (let vert = 0; vert < size; vert++) {
                for (let j = 0; j < 2; j++) {
                    const x = right - j;
                    const upward = ((right + 1) & 2) === 0;
                    const y = upward ? size - 1 - vert : vert;
                    if (!isFn[y][x] && bitIndex < result.length * 8) {
                        mod[y][x] = getBit(bitIndex);
                        bitIndex++;
                    }
                }
            }
        }

        const maskFns = [
            (i, j) => (i + j) % 2 === 0,
            (i, j) => i % 2 === 0,
            (i, j) => j % 3 === 0,
            (i, j) => (i + j) % 3 === 0,
            (i, j) => ((i >> 1) + Math.floor(j / 3)) % 2 === 0,
            (i, j) => ((i * j) % 2) + ((i * j) % 3) === 0,
            (i, j) => (((i * j) % 2) + ((i * j) % 3)) % 2 === 0,
            (i, j) => ((((i + j) % 2) + ((i * j) % 3)) % 2) === 0
        ];

        const drawFormat = (m, mask) => {
            const eccInd = { 0: 1, 1: 0, 2: 3, 3: 2 }[lvl]; /* L,M,Q,H -> format indicator bits */
            const bits = ((eccInd << 3) | mask);
            let rem = bits;
            for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
            const fbits = ((bits << 10) | rem) ^ 0x5412;
            /* vertical copy (column 8) */
            for (let i = 0; i < 15; i++) {
                const bit = (fbits >>> i) & 1;
                if (i < 6) m[i][8] = bit;
                else if (i < 8) m[i + 1][8] = bit;
                else m[size - 15 + i][8] = bit;
            }
            /* horizontal copy (row 8) */
            for (let i = 0; i < 15; i++) {
                const bit = (fbits >>> i) & 1;
                if (i < 8) m[8][size - 1 - i] = bit;
                else if (i < 9) m[8][15 - i - 1 + 1] = bit;
                else m[8][15 - i - 1] = bit;
            }
        };

        const penalty = (m) => {
            let score = 0;
            for (let r = 0; r < size; r++) {
                let run = 1, cur = m[r][0];
                for (let c = 1; c < size; c++) {
                    if (m[r][c] === cur) { run++; if (run === 5) score += 3; else if (run > 5) score += 1; }
                    else { run = 1; cur = m[r][c]; }
                }
            }
            for (let c = 0; c < size; c++) {
                let run = 1, cur = m[0][c];
                for (let r = 1; r < size; r++) {
                    if (m[r][c] === cur) { run++; if (run === 5) score += 3; else if (run > 5) score += 1; }
                    else { run = 1; cur = m[r][c]; }
                }
            }
            for (let r = 0; r < size - 1; r++) {
                for (let c = 0; c < size - 1; c++) {
                    if (m[r][c] === m[r][c + 1] && m[r][c] === m[r + 1][c] && m[r][c] === m[r + 1][c + 1]) score += 3;
                }
            }
            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size - 6; c++) {
                    if (m[r][c] && !m[r][c + 1] && m[r][c + 2] && m[r][c + 3] && m[r][c + 4] && !m[r][c + 5] && m[r][c + 6]) score += 40;
                }
                for (let c = 0; c < size - 6; c++) {
                    if (!m[r][c] && m[r][c + 1] && !m[r][c + 2] && !m[r][c + 3] && !m[r][c + 4] && m[r][c + 5] && !m[r][c + 6]) score += 40;
                }
            }
            for (let c = 0; c < size; c++) {
                for (let r = 0; r < size - 6; r++) {
                    if (m[r][c] && !m[r + 1][c] && m[r + 2][c] && m[r + 3][c] && m[r + 4][c] && !m[r + 5][c] && m[r + 6][c]) score += 40;
                }
                for (let r = 0; r < size - 6; r++) {
                    if (!m[r][c] && m[r + 1][c] && !m[r + 2][c] && !m[r + 3][c] && !m[r + 4][c] && m[r + 5][c] && !m[r + 6][c]) score += 40;
                }
            }
            let dark = 0;
            for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) dark += m[r][c];
            const percent = Math.round(dark * 100 / (size * size));
            const delta = Math.max(Math.abs(percent - 50) / 5, (100 - percent - 50) / 5);
            score += Math.floor(delta) * 10;
            return score;
        };

        let best = null;
        const allMs = [];
        for (let mask = 0; mask < 8; mask++) {
            const f = maskFns[mask];
            const m = mod.map(r => r.slice());
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    if (!isFn[i][j] && f(i, j)) m[i][j] ^= 1;
                }
            }
            drawFormat(m, mask);
            const s = penalty(m);
            allMs.push({ mask, m });
            if (!best || s < best.s) best = { s, m, mask };
        }

        if (opts.allMasks) return allMs.map(x => ({ mask: x.mask, matrix: x.m }));
        if (opts.debug) return { matrix: best.m, isFn, cw: result, mask: best.mask };

        return best.m;
    }

    return { encode };
})();

if (typeof module !== "undefined" && typeof module.exports !== "undefined") module.exports = QR;
if (typeof window !== "undefined") window.QR = QR;
if (typeof window !== "undefined") window.QRCode = QR;