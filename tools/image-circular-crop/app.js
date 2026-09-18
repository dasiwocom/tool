/* Circle Crop */
const file = document.getElementById("file");
const fit = document.getElementById("fit");
const size = document.getElementById("size");
const goBtn = document.getElementById("goBtn");
const preview = document.getElementById("preview");
const sizeInfo = document.getElementById("sizeInfo");
const download = document.getElementById("download");

let source = null;

file.addEventListener("change", () => {
    source = file.files && file.files[0] ? file.files[0] : null;
    if (source) {
        preview.hidden = true;
        sizeInfo.textContent = "";
        download.hidden = true;
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
    const out = Math.max(64, Math.min(2048, Math.round(parseInt(size.value, 10) || 512)));
    const bitmap = await createImageBitmap(source);
    const canvas = document.createElement("canvas");
    canvas.width = out;
    canvas.height = out;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(out / 2, out / 2, out / 2, 0, Math.PI * 2);
    ctx.clip();
    const cover = fit.value === "cover";
    const scale = cover ? Math.max(out / bitmap.width, out / bitmap.height) : Math.min(out / bitmap.width, out / bitmap.height);
    const w = bitmap.width * scale, h = bitmap.height * scale;
    ctx.drawImage(bitmap, (out - w) / 2, (out - h) / 2, w, h);
    bitmap.close();

    const url = canvas.toDataURL("image/png");
    preview.src = url;
    preview.hidden = false;
    sizeInfo.textContent = "PNG · background transparent · " + out + "×" + out;

    download.href = url;
    download.download = nameBase(source.name) + "-circle.png";
    download.hidden = false;
});