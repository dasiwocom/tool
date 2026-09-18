/* Image Crop */
const fileInput = document.getElementById("file");
const stageWrap = document.getElementById("stageWrap");
const stage = document.getElementById("stage");
const stageImg = document.getElementById("stageImg");
const cropBox = document.getElementById("cropBox");
const cropX = document.getElementById("cropX");
const cropY = document.getElementById("cropY");
const cropW = document.getElementById("cropW");
const cropH = document.getElementById("cropH");
const cropBtn = document.getElementById("cropBtn");
const cropResult = document.getElementById("cropResult");
const preview = document.getElementById("preview");
const down = document.getElementById("download");

let img = null;
let dragging = false;
let startX = 0;
let startY = 0;

function rect() {
    return {
        x: Math.max(0, parseFloat(cropX.value) || 0),
        y: Math.max(0, parseFloat(cropY.value) || 0),
        w: Math.max(1, parseFloat(cropW.value) || 1),
        h: Math.max(1, parseFloat(cropH.value) || 1)
    };
}

function displayRect() {
    if (!img) return;
    const sx = img.naturalWidth / stageImg.clientWidth;
    const sy = img.naturalHeight / stageImg.clientHeight;
    const r = rect();
    cropBox.style.left = r.x / sx + "px";
    cropBox.style.top = r.y / sy + "px";
    cropBox.style.width = Math.min(r.w / sx, stageImg.clientWidth - r.x / sx) + "px";
    cropBox.style.height = Math.min(r.h / sy, stageImg.clientHeight - r.y / sy) + "px";
    cropBox.style.display = "block";
}

function applyRect(px, py, pw, ph) {
    const sx = img.naturalWidth / stageImg.clientWidth;
    const sy = img.naturalHeight / stageImg.clientHeight;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    let x = Math.round(Math.min(px, pw) * sx);
    let y = Math.round(Math.min(py, ph) * sy);
    const w = Math.round(Math.abs(pw - px) * sx);
    const h = Math.round(Math.abs(ph - py) * sy);
    cropX.value = x;
    cropY.value = y;
    cropW.value = Math.min(w, iw - x);
    cropH.value = Math.min(h, ih - y);
    displayRect();
}

fileInput.addEventListener("change", () => {
    const f = fileInput.files && fileInput.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    img = new Image();
    img.onload = () => {
        stageImg.src = img.src;
        stageWrap.hidden = false;
        cropResult.hidden = true;
        cropBox.style.display = "none";
        cropX.value = 0;
        cropY.value = 0;
        cropW.value = img.naturalWidth;
        cropH.value = img.naturalHeight;
        requestAnimationFrame(displayRect);
    };
    img.src = url;
});

stage.addEventListener("mousedown", e => {
    dragging = true;
    const r = stageImg.getBoundingClientRect();
    startX = e.clientX - r.left;
    startY = e.clientY - r.top;
    e.preventDefault();
});

window.addEventListener("mousemove", e => {
    if (!dragging) return;
    const r = stageImg.getBoundingClientRect();
    const cx = Math.min(Math.max(e.clientX - r.left, 0), r.width);
    const cy = Math.min(Math.max(e.clientY - r.top, 0), r.height);
    applyRect(startX, startY, cx, cy);
});

window.addEventListener("mouseup", () => { dragging = false; });

[cropX, cropY, cropW, cropH].forEach(el => el.addEventListener("input", displayRect));

cropBtn.addEventListener("click", () => {
    if (!img) {
        showToast(t("noImage"));
        return;
    }
    const r = rect();
    const x = Math.round(Math.min(r.x, img.naturalWidth - 1));
    const y = Math.round(Math.min(r.y, img.naturalHeight - 1));
    const w = Math.round(Math.min(r.w, img.naturalWidth - x));
    const h = Math.round(Math.min(r.h, img.naturalHeight - y));
    if (w < 1 || h < 1) {
        showToast(t("noImage"));
        return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d").drawImage(img, x, y, w, h, 0, 0, w, h);
    const url = canvas.toDataURL("image/png");
    preview.src = url;

    if (down.href && down.href.startsWith("data:image")) URL.revokeObjectURL(down.href);
    preview.href = url;
    down.href = url;
    down.download = "cropped.png";
    cropResult.hidden = false;
});