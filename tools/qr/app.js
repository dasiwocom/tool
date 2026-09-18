/* QR Code — local encoder (qrcode.js), 100% in-browser */
const text = document.getElementById("text");
const ecl = document.getElementById("ecl");
const scale = document.getElementById("scale");
const genBtn = document.getElementById("genBtn");
const downBtn = document.getElementById("downBtn");
const canvas = document.getElementById("canvas");
const sizeInfo = document.getElementById("sizeInfo");

function render() {
    const s = text.value;
    if (!s) {
        showToast(t("qrEmpty") || "Enter text first");
        return;
    }
    let matrix;
    try {
        matrix = QRCode.encode(s, { ecc: ecl.value });
    } catch (e) {
        showToast(e && e.message ? e.message : "Text too long");
        return;
    }
    const n = matrix.length;
    const m = Math.max(2, Math.min(24, parseInt(scale.value, 10) || 8));
    const quiet = m * 4;
    canvas.width = n * m + quiet * 2;
    canvas.height = canvas.width;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            if (matrix[r][c]) ctx.fillRect(quiet + c * m, quiet + r * m, m, m);
        }
    }
    sizeInfo.textContent = "QR · " + n + "×" + n + " · version " + (n - 17) / 4;
    downBtn.hidden = false;
}

genBtn.addEventListener("click", render);
downBtn.addEventListener("click", () => {
    downBtn.href = canvas.toDataURL("image/png");
    downBtn.download = "qrcode.png";
});

text.addEventListener("input", () => {
    /* live regen on typed text */
    clearTimeout(render._t);
    render._t = setTimeout(render, 350);
});

render();