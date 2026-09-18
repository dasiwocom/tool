/* Image Resize */
const file = document.getElementById("file");
const mode = document.getElementById("mode");
const width = document.getElementById("width");
const pct = document.getElementById("pct");
const orig = document.getElementById("orig");
const goBtn = document.getElementById("goBtn");
const preview = document.getElementById("preview");
const sizeInfo = document.getElementById("sizeInfo");
const download = document.getElementById("download");

let source = null;
let bw = 0, bh = 0;

mode.addEventListener("change", () => {
    const byW = mode.value === "w";
    width.disabled = !byW;
    pct.disabled = byW;
});
mode.dispatchEvent(new Event("change"));

file.addEventListener("change", () => {
    source = file.files && file.files[0] ? file.files[0] : null;
    if (source) {
        preview.hidden = true;
        sizeInfo.textContent = "";
        download.hidden = true;
        const img = new Image();
        const u = URL.createObjectURL(source);
        img.onload = () => {
            bw = img.naturalWidth;
            bh = img.naturalHeight;
            orig.textContent = source.name + " · " + bw + "×" + bh;
            URL.revokeObjectURL(u);
        };
        img.src = u;
    } else {
        orig.textContent = "";
    }
});

function nameBase(name) {
    return (name || "image").replace(/\.[a-z0-9]+$/i, "");
}

goBtn.addEventListener("click", async () => {
    if (!source) {
        showToast(t("noImage") || "Choose an image first");
        return;
    }
    if (!bw) {
        showToast(t("noImage") || "Image not loaded yet");
        return;
    }
    const byW = mode.value === "w";
    let nw, nh;
    if (byW) {
        nw = Math.max(1, Math.min(16384, Math.round(parseInt(width.value, 10) || bw)));
        nh = Math.round(nw * bh / bw);
    } else {
        const f = (parseInt(pct.value, 10) || 100) / 100;
        nw = Math.max(1, Math.round(bw * f));
        nh = Math.max(1, Math.round(bh * f));
    }

    const bitmap = await createImageBitmap(source);
    const canvas = document.createElement("canvas");
    canvas.width = nw;
    canvas.height = nh;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, 0, 0, nw, nh);
    bitmap.close();

    const url = canvas.toDataURL("image/png");
    preview.src = url;
    preview.hidden = false;
    sizeInfo.textContent = "PNG · " + nw + "×" + nh;

    download.href = url;
    download.download = nameBase(source.name) + "-resized.png";
    download.hidden = false;
});