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
    "image/webp": "webp"
};

format.addEventListener("change", () => {
    qualityWrap.hidden = format.value === "image/png" || format.value === "all";
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

async function convertOne(source, type, q) {
    const bitmap = await createImageBitmap(source);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    canvas.getContext("2d").drawImage(bitmap, 0, 0);
    bitmap.close();
    return new Promise(res => canvas.toBlob(blob => res({ blob, type, ext: TYPE_MAP[type] || "bin" }), type, q));
}

convertBtn.addEventListener("click", async () => {
    if (!source) {
        showToast(t("noImage"));
        return;
    }
    const q = format.value === "image/png" ? undefined : parseInt(quality.value, 10) / 100;

    result.hidden = false;
    down.hidden = true;
    const infoWrap = sizeInfo.parentElement;

    if (format.value === "all") {
        const types = ["image/png", "image/jpeg", "image/webp"];
        const results = await Promise.all(types.map(tp => convertOne(source, tp, tp === "image/png" ? undefined : q)));
        document.getElementById("allLinks")?.remove();
        const wrap = document.createElement("div");
        wrap.id = "allLinks";
        wrap.style.cssText = "display:flex; gap:12px; flex-wrap:wrap; margin-bottom:16px;";
        for (const { blob, ext } of results) {
            const a = document.createElement("a");
            a.className = "btn btn-primary";
            a.href = URL.createObjectURL(blob);
            a.download = `converted.${ext}`;
            a.textContent = `${ext.toUpperCase()} · ${formatSize(blob.size)}`;
            wrap.appendChild(a);
        }
        sizeInfo.textContent = `${results.length} ${t("newSize") || "formats"}`;
        infoWrap.insertBefore(wrap, down);
        return;
    }

    document.getElementById("allLinks")?.remove();
    const type = format.value;
    const { blob, ext } = await convertOne(source, type, q);
    sizeInfo.textContent = ext.toUpperCase() + " · " + formatSize(blob.size);

    if (down.href && down.href.startsWith("blob:")) URL.revokeObjectURL(down.href);
    down.href = URL.createObjectURL(blob);
    down.download = "converted." + ext;
    down.hidden = false;
});