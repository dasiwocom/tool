/* Image Convert */
const file = document.getElementById("file");
const format = document.getElementById("format");
const qualityWrap = document.getElementById("qualityWrap");
const quality = document.getElementById("quality");
const qualityVal = document.getElementById("qualityVal");
const convertBtn = document.getElementById("convert");
const result = document.getElementById("result");
const sizeInfo = document.getElementById("sizeInfo");
const down = document.getElementById("download");

let source = null;

format.addEventListener("change", () => {
    qualityWrap.hidden = format.value === "image/png";
});
quality.addEventListener("input", () => {
    qualityVal.textContent = quality.value + "%";
});
file.addEventListener("change", () => {
    source = file.files && file.files[0] ? file.files[0] : null;
    if (source) result.hidden = true;
});

function formatSize(b) {
    if (b < 1024) return b + " B";
    if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
    return (b / 1048576).toFixed(2) + " MB";
}

function extFor(type) {
    return type === "image/png" ? "png" : type === "image/webp" ? "webp" : "jpg";
}

convertBtn.addEventListener("click", async () => {
    if (!source) {
        showToast(t("noImage"));
        return;
    }
    const type = format.value;
    const q = type === "image/png" ? undefined : parseInt(quality.value, 10) / 100;

    const bitmap = await createImageBitmap(source);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    canvas.getContext("2d").drawImage(bitmap, 0, 0);
    bitmap.close();

    const output = await new Promise(res => canvas.toBlob(res, type, q));
    sizeInfo.textContent = extFor(type).toUpperCase() + " · " + formatSize(output.size);

    if (down.href) URL.revokeObjectURL(down.href);
    down.href = URL.createObjectURL(output);
    down.download = "converted." + extFor(type);
    result.hidden = false;
});