/* Image Compress */
const file = document.getElementById("file");
const quality = document.getElementById("quality");
const qualityVal = document.getElementById("qualityVal");
const compressBtn = document.getElementById("compress");
const result = document.getElementById("result");
const sizeOriginal = document.getElementById("sizeOriginal");
const sizeNew = document.getElementById("sizeNew");
const sizeSaved = document.getElementById("sizeSaved");
const down = document.getElementById("download");
const preview = document.getElementById("preview");

let source = null;

quality.addEventListener("input", () => {
    qualityVal.textContent = quality.value + "%";
});

file.addEventListener("change", () => {
    source = file.files && file.files[0] ? file.files[0] : null;
    if (source) { result.hidden = true; preview.hidden = true; }
});

function formatSize(b) {
    if (b < 1024) return b + " B";
    if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
    return (b / 1048576).toFixed(2) + " MB";
}

compressBtn.addEventListener("click", async () => {
    if (!source) {
        showToast(t("noImage"));
        return;
    }
    const q = parseInt(quality.value, 10) / 100;
    let type = source.type;
    if (type !== "image/jpeg" && type !== "image/webp") type = "image/jpeg";

    const bitmap = await createImageBitmap(source);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    canvas.getContext("2d").drawImage(bitmap, 0, 0);
    bitmap.close();

    const output = await new Promise(res => canvas.toBlob(res, type, q));
    const saved = (1 - output.size / source.size) * 100;

    sizeOriginal.textContent = formatSize(source.size);
    sizeNew.textContent = formatSize(output.size);
    sizeSaved.textContent = (saved >= 0 ? "-" : "+") + Math.abs(saved).toFixed(1) + "%";

    if (down.href) URL.revokeObjectURL(down.href);
    const url = URL.createObjectURL(output);
    down.href = url;
    const dot = type.lastIndexOf("/");
    down.download = "compressed." + (type.slice(dot + 1) === "jpeg" ? "jpg" : type.slice(dot + 1));
    preview.src = url;
    preview.hidden = false;
    result.hidden = false;
});