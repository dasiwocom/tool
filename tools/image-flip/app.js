/* Image Flip */
const file = document.getElementById("file");
const mode = document.getElementById("mode");
const rot = document.getElementById("rot");
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
    const bitmap = await createImageBitmap(source);
    const rotDeg = parseInt(rot.value, 10);
    const h = mode.value === "h" || mode.value === "hv";
    const v = mode.value === "v" || mode.value === "hv";
    const swap = rotDeg === 90 || rotDeg === 270;
    const canvas = document.createElement("canvas");
    canvas.width = swap ? bitmap.height : bitmap.width;
    canvas.height = swap ? bitmap.width : bitmap.height;
    const ctx = canvas.getContext("2d");
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rotDeg * Math.PI / 180);
    ctx.scale(h ? -1 : 1, v ? -1 : 1);
    ctx.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2);
    bitmap.close();

    const url = canvas.toDataURL("image/png");
    preview.src = url;
    preview.hidden = false;
    sizeInfo.textContent = "PNG · " + canvas.width + "×" + canvas.height;

    download.href = url;
    download.download = nameBase(source.name) + "-flipped.png";
    download.hidden = false;
});