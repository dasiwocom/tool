const picker = document.getElementById("picker");
const value = document.getElementById("value");
const preview = document.getElementById("preview");
const table = document.getElementById("table");

function hexToRgb(hex) {
    hex = hex.replace(/^#/, "");
    if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
    if (hex.length !== 6) return null;
    const n = parseInt(hex, 16);
    if (isNaN(n)) return null;
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; }
    else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            default: h = ((r - g) / d + 4) / 6;
        }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;
    if (s === 0) { r = g = b = l; }
    else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1; if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function rgbToCmyk(r, g, b) {
    if (r === 0 && g === 0 && b === 0) return { c: 0, m: 0, y: 0, k: 100 };
    let c = 1 - r / 255, m = 1 - g / 255, y = 1 - b / 255;
    const k = Math.min(c, m, y);
    return {
        c: Math.round(((c - k) / (1 - k)) * 100),
        m: Math.round(((m - k) / (1 - k)) * 100),
        y: Math.round(((y - k) / (1 - k)) * 100),
        k: Math.round(k * 100)
    };
}

function parse(input) {
    const s = input.trim();
    if (/^#?[0-9a-f]{3,8}$/i.test(s)) return hexToRgb(s.startsWith("#") ? s : "#" + s);
    let m = s.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (m) return { r: +m[1], g: +m[2], b: +m[3] };
    m = s.match(/hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?/i);
    if (m) return hslToRgb(+m[1], +m[2], +m[3]);
    return null;
}

const toHex = rgb => "#" + [rgb.r, rgb.g, rgb.b].map(x => x.toString(16).padStart(2, "0")).join("");

function update(from) {
    const rgb = from === "picker" ? hexToRgb(picker.value) : parse(value.value);
    if (!rgb) return;
    if (from === "picker") value.value = picker.value;
    else picker.value = toHex(rgb);

    const hex = toHex(rgb).toUpperCase();
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
    preview.style.background = hex;

    const rows = [
        ["HEX", hex],
        ["RGB", `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`],
        ["HSL", `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`],
        ["CMYK", `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`]
    ];
    table.innerHTML = rows.map(([k, v]) =>
        `<tr><td>${k}</td><td>${v}</td></tr>`
    ).join("");
    table.querySelectorAll("td:last-child").forEach(td => {
        td.addEventListener("click", () => copyText(td.textContent));
    });
}

picker.addEventListener("input", () => update("picker"));
value.addEventListener("input", () => update("value"));
update("picker");

window.onLangChange = () => {};