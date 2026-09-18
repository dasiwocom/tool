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

const TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/avif": "avif",
    "image/bmp": "bmp"
};
/* formats that ignore the quality parameter */
const NO_QUALITY = new Set(["image/png", "image/bmp"]);

format.addEventListener("change", () => {
    qualityWrap.hidden = NO_QUALITY.has(format.value);
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

async function convertOne(source, type) {
    const q = NO_QUALITY.has(type) ? undefined : parseInt(quality.value, 10) / 100;
    const bitmap = await createImageBitmap(source);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    canvas.getContext("2d").drawImage(bitmap, 0, 0);
    bitmap.close();
    const blob = await new Promise(res => canvas.toBlob(res, type, q));
    if (!blob) {
        showToast(t("noImage") + " (" + (TYPE_MAP[type] || type) + ")"); /* unsupported target */
        return null;
    }
    return { blob, ext: TYPE_MAP[type] || "bin" };
}

convertBtn.addEventListener("click", async () => {
    if (!source) {
        showToast(t("noImage"));
        return;
    }
    const type = format.value;
    const out = await convertOne(source, type);
    if (!out) return;

    sizeInfo.textContent = out.ext.toUpperCase() + " · " + formatSize(out.blob.size);

    if (down.href && down.href.startsWith("blob:")) URL.revokeObjectURL(down.href);
    down.href = URL.createObjectURL(out.blob);
    down.download = "converted." + out.ext;
    result.hidden = false;
});