/* ==========================================================
   Hash algorithms — pure JS, work offline / file://
   ========================================================== */

/* ---------- MD5 ---------- */
function md5(input) {
    const utf8 = unescape(encodeURIComponent(input));
    const bytes = new Uint8Array(utf8.length + 128);
    for (let i = 0; i < utf8.length; i++) bytes[i] = utf8.charCodeAt(i);
    const originalLength = utf8.length;

    let pos = originalLength;
    bytes[pos++] = 0x80;
    while (pos % 64 !== 56) bytes[pos++] = 0;
    const bitLenLo = (originalLength * 8) >>> 0;
    const bitLenHi = Math.floor(originalLength / 0x20000000) >>> 0;
    for (let i = 0; i < 4; i++) bytes[pos++] = (bitLenLo >>> (8 * i)) & 0xff;
    for (let i = 0; i < 4; i++) bytes[pos++] = (bitLenHi >>> (8 * i)) & 0xff;

    const F = (x, y, z) => (x & y) | (~x & z);
    const G = (x, y, z) => (x & z) | (y & ~z);
    const H = (x, y, z) => x ^ y ^ z;
    const I = (x, y, z) => y ^ (x | ~z);

    const add = (a, b) => {
        const lo = (a & 0xffff) + (b & 0xffff);
        const hi = (a >>> 16) + (b >>> 16) + (lo >>> 16);
        return ((hi & 0xffff) << 16) | (lo & 0xffff);
    };
    const rl = (a, n) => (a << n) | (a >>> (32 - n));

    const KL = [0xd76aa478,0xe8c7b756,0x242070db,0xc1bdceee,0xf57c0faf,0x4787c62a,0xa8304613,0xfd469501,
                0x698098d8,0x8b44f7af,0xffff5bb1,0x895cd7be,0x6b901122,0xfd987193,0xa679438e,0x49b40821,
                0xf61e2562,0xc040b340,0x265e5a51,0xe9b6c7aa,0xd62f105d,0x02441453,0xd8a1e681,0xe7d3fbc8,
                0x21e1cde6,0xc33707d6,0xf4d50d87,0x455a14ed,0xa9e3e905,0xfcefa3f8,0x676f02d9,0x8d2a4c8a,
                0xfffa3942,0x8771f681,0x6d9d6122,0xfde5380c,0xa4beea44,0x4bdecfa9,0xf6bb4b60,0xbebfbc70,
                0x289b7ec6,0xeaa127fa,0xd4ef3085,0x04881d05,0xd9d4d039,0xe6db99e5,0x1fa27cf8,0xc4ac5665,
                0xf4292244,0x432aff97,0xab9423a7,0xfc93a039,0x655b59c3,0x8f0ccc92,0xffeff47d,0x85845dd1,
                0x6fa87e4f,0xfe2ce6e0,0xa3014314,0x4e0811a1,0xf7537e82,0xbd3af235,0x2ad7d2bb,0xeb86d391];
    const SL = [7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,
                5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,
                4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,
                6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21];

    const getWord = (i) => bytes[i] | (bytes[i+1] << 8) | (bytes[i+2] << 16) | (bytes[i+3] << 24);

    let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;

    for (let block = 0; block < pos; block += 64) {
        let a = a0, b = b0, c = c0, d = d0;
        const X = [];
        for (let j = 0; j < 16; j++) X[j] = getWord(block + j * 4);

        for (let j = 0; j < 64; j++) {
            let f;
            if (j < 16) f = F(b, c, d);
            else if (j < 32) f = G(b, c, d);
            else if (j < 48) f = H(b, c, d);
            else f = I(b, c, d);
            const idx = j < 16 ? j :
                        j < 32 ? (5 * j + 1) % 16 :
                        j < 48 ? (3 * j + 5) % 16 :
                        (7 * j) % 16;
            const temp = add(add(add(a, f), KL[j]), X[idx]);
            const rotated = rl(temp, SL[j]);
            a = d; d = c; c = b; b = add(b, rotated);
        }
        a0 = add(a0, a); b0 = add(b0, b); c0 = add(c0, c); d0 = add(d0, d);
    }

    const toHex = (n) => {
        const parts = [];
        for (let i = 0; i < 4; i++) parts.push((n >>> (8 * i)) & 0xff);
        return parts.map(x => x.toString(16).padStart(2, "0")).join("");
    };
    return toHex(a0) + toHex(b0) + toHex(c0) + toHex(d0);
}

/* ---------- SHA-256 ---------- */
const SHA256_K = new Uint32Array([
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
]);

function sha256(input) {
    const bytes = new TextEncoder().encode(input);
    const bitlen = bytes.length * 8;

    const padded = new Uint8Array(((bytes.length + 8) >>> 6 << 6) + 64);
    padded.set(bytes);
    padded[bytes.length] = 0x80;
    const view = new DataView(padded.buffer);
    view.setUint32(padded.length - 4, bitlen >>> 0, false);
    view.setUint32(padded.length - 8, Math.floor(bitlen / 4294967296), false);

    let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a,
        h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;

    const w = new Uint32Array(64);
    for (let i = 0; i < padded.length / 64; i++) {
        for (let j = 0; j < 16; j++) w[j] = view.getUint32(i * 64 + j * 4, false);
        for (let j = 16; j < 64; j++) {
            const s0 = (w[j-15] >>> 7 | w[j-15] << 25) ^ (w[j-15] >>> 18 | w[j-15] << 14) ^ (w[j-15] >>> 3);
            const s1 = (w[j-2] >>> 17 | w[j-2] << 15) ^ (w[j-2] >>> 19 | w[j-2] << 13) ^ (w[j-2] >>> 10);
            w[j] = (w[j-16] + s0 + w[j-7] + s1) >>> 0;
        }
        let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;
        for (let j = 0; j < 64; j++) {
            const S1 = (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7);
            const ch = (e & f) ^ (~e & g);
            const temp1 = (h + S1 + ch + SHA256_K[j] + w[j]) >>> 0;
            const S0 = (a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10);
            const maj = (a & b) ^ (a & c) ^ (b & c);
            const temp2 = (S0 + maj) >>> 0;
            h = g; g = f; f = e; e = (d + temp1) >>> 0;
            d = c; c = b; b = a; a = (temp1 + temp2) >>> 0;
        }
        h0 = (h0 + a) >>> 0; h1 = (h1 + b) >>> 0; h2 = (h2 + c) >>> 0; h3 = (h3 + d) >>> 0;
        h4 = (h4 + e) >>> 0; h5 = (h5 + f) >>> 0; h6 = (h6 + g) >>> 0; h7 = (h7 + h) >>> 0;
    }
    return [h0,h1,h2,h3,h4,h5,h6,h7].map(x => x.toString(16).padStart(8, "0")).join("");
}

/* ---------- SHA-512 (BigInt — exact 64-bit math) ---------- */
const SHA512_K = [
    0x428a2f98d728ae22n,0x7137449123ef65cdn,0xb5c0fbcfec4d3b2fn,0xe9b5dba58189dbbcn,
    0x3956c25bf348b538n,0x59f111f1b605d019n,0x923f82a4af194f9bn,0xab1c5ed5da6d8118n,
    0xd807aa98a3030242n,0x12835b0145706fben,0x243185be4ee4b28cn,0x550c7dc3d5ffb4e2n,
    0x72be5d74f27b896fn,0x80deb1fe3b1696b1n,0x9bdc06a725c71235n,0xc19bf174cf692694n,
    0xe49b69c19ef14ad2n,0xefbe4786384f25e3n,0x0fc19dc68b8cd5b5n,0x240ca1cc77ac9c65n,
    0x2de92c6f592b0275n,0x4a7484aa6ea6e483n,0x5cb0a9dcbd41fbd4n,0x76f988da831153b5n,
    0x983e5152ee66dfabn,0xa831c66d2db43210n,0xb00327c898fb213fn,0xbf597fc7beef0ee4n,
    0xc6e00bf33da88fc2n,0xd5a79147930aa725n,0x06ca6351e003826fn,0x142929670a0e6e70n,
    0x27b70a8546d22ffcn,0x2e1b21385c26c926n,0x4d2c6dfc5ac42aedn,0x53380d139d95b3dfn,
    0x650a73548baf63den,0x766a0abb3c77b2a8n,0x81c2c92e47edaee6n,0x92722c851482353bn,
    0xa2bfe8a14cf10364n,0xa81a664bbc423001n,0xc24b8b70d0f89791n,0xc76c51a30654be30n,
    0xd192e819d6ef5218n,0xd69906245565a910n,0xf40e35855771202an,0x106aa07032bbd1b8n,
    0x19a4c116b8d2d0c8n,0x1e376c085141ab53n,0x2748774cdf8eeb99n,0x34b0bcb5e19b48a8n,
    0x391c0cb3c5c95a63n,0x4ed8aa4ae3418acbn,0x5b9cca4f7763e373n,0x682e6ff3d6b2b8a3n,
    0x748f82ee5defb2fcn,0x78a5636f43172f60n,0x84c87814a1f0ab72n,0x8cc702081a6439ecn,
    0x90befffa23631e28n,0xa4506cebde82bde9n,0xbef9a3f7b2c67915n,0xc67178f2e372532bn,
    0xca273eceea26619cn,0xd186b8c721c0c207n,0xeada7dd6cde0eb1en,0xf57d4f7fee6ed178n,
    0x06f067aa72176fban,0x0a637dc5a2c898a6n,0x113f9804bef90daen,0x1b710b35131c471bn,
    0x28db77f523047d84n,0x32caab7b40c72493n,0x3c9ebe0a15c9bebcn,0x431d67c49c100d4cn,
    0x4cc5d4becb3e42b6n,0x597f299cfc657e2an,0x5fcb6fab3ad6faecn,0x6c44198c4a475817n
];
const MASK64 = 0xffffffffffffffffn;
const MASK32 = 0xffffffffn;

function rotr64(x, n) { return (x >> BigInt(n)) | (x << BigInt(64 - n)); }

function sha512(input) {
    const bytes = new TextEncoder().encode(input);
    const bitlen = bytes.length * 8;
    const padded = new Uint8Array(((bytes.length + 16) >>> 7 << 7) + 128);
    padded.set(bytes);
    padded[bytes.length] = 0x80;
    const view = new DataView(padded.buffer);
    view.setUint32(padded.length - 4, bitlen >>> 0, false);
    view.setUint32(padded.length - 8, Math.floor(bitlen / 4294967296), false);

    let h0 = 0x6a09e667f3bcc908n, h1 = 0xbb67ae8584caa73bn, h2 = 0x3c6ef372fe94f82bn,
        h3 = 0xa54ff53a5f1d36f1n, h4 = 0x510e527fade682d1n, h5 = 0x9b05688c2b3e6c1fn,
        h6 = 0x1f83d9abfb41bd6bn, h7 = 0x5be0cd19137e2179n;

    const w = new Array(80);
    const readWord = (offset) =>
        (BigInt(view.getUint32(offset, false)) << 32n) | BigInt(view.getUint32(offset + 4, false));

    for (let i = 0; i < padded.length / 128; i++) {
        for (let j = 0; j < 16; j++) w[j] = readWord(i * 128 + j * 8);
        for (let j = 16; j < 80; j++) {
            const s0 = rotr64(w[j-15], 1) ^ rotr64(w[j-15], 8) ^ (w[j-15] >> 7n);
            const s1 = rotr64(w[j-2], 19) ^ rotr64(w[j-2], 61) ^ (w[j-2] >> 6n);
            w[j] = (w[j-16] + s0 + w[j-7] + s1) & MASK64;
        }

        let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;
        for (let j = 0; j < 80; j++) {
            const S1 = rotr64(e, 14) ^ rotr64(e, 18) ^ rotr64(e, 41);
            const ch = (e & f) ^ (~e & MASK64 & g);
            const temp1 = (h + S1 + ch + SHA512_K[j] + w[j]) & MASK64;
            const S0 = rotr64(a, 28) ^ rotr64(a, 34) ^ rotr64(a, 39);
            const maj = (a & b) ^ (a & c) ^ (b & c);
            const temp2 = (S0 + maj) & MASK64;
            h = g; g = f; f = e; e = (d + temp1) & MASK64;
            d = c; c = b; b = a; a = (temp1 + temp2) & MASK64;
        }
        h0 = (h0 + a) & MASK64; h1 = (h1 + b) & MASK64; h2 = (h2 + c) & MASK64; h3 = (h3 + d) & MASK64;
        h4 = (h4 + e) & MASK64; h5 = (h5 + f) & MASK64; h6 = (h6 + g) & MASK64; h7 = (h7 + h) & MASK64;
    }

    const toHex64 = (n) => n.toString(16).padStart(16, "0");
    return [h0, h1, h2, h3, h4, h5, h6, h7].map(toHex64).join("");
}

/* ---------- Wire up ---------- */
const input = document.getElementById("input");
const values = {};
document.querySelectorAll(".hash-value").forEach(el => { values[el.dataset.algo] = el; });

(function autoRun() {
    const text = input.value;
    values["MD5"].textContent = text ? md5(text) : "—";
    values["SHA-256"].textContent = text ? sha256(text) : "—";
    values["SHA-512"].textContent = text ? sha512(text) : "—";
    if (text) values["MD5"].textContent = md5(text);
})();

document.querySelectorAll(".hash-value").forEach(el => {
    el.addEventListener("click", () => {
        if (el.textContent !== "—") copyText(el.textContent);
    });
});

input.addEventListener("input", () => {
    const text = input.value;
    values["MD5"].textContent = text ? md5(text) : "—";
    values["SHA-256"].textContent = text ? sha256(text) : "—";
    values["SHA-512"].textContent = text ? sha512(text) : "—";
});

document.getElementById("generate").addEventListener("click", () => {
    input.focus();
});

document.getElementById("clearNoSave").addEventListener("click", () => {
    input.value = "";
    input.dispatchEvent(new Event("input"));
    input.focus();
});

window.onLangChange = () => {};