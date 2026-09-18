/* GIF Maker — uses local GIFEncoder (gif-enc.js), 100% in-browser */
const file = document.getElementById("file");
const delay = document.getElementById("delay");
const width = document.getElementById("width");
const fileList = document.getElementById("fileList");
const goBtn = document.getElementById("goBtn");
const preview = document.getElementById("preview");
const sizeInfo = document.getElementById("sizeInfo");
const download = document.getElementById("download");

let files = [];

file.addEventListener("change", () => {
    files = file.files ? Array.from(file.files).slice(0, 80) : [];
    fileList.textContent = files.length
        ? files.map(f => f.name).join(" · ") + (files.length > 5 ? " …" : "")
        : "";
    preview.hidden = true;
    sizeInfo.textContent = "";
    download.hidden = true;
});

function formatSize(b) {
    if (b < 1024) return b + " B";
    if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
    return (b / 1048576).toFixed(2) + " MB";
}

goBtn.addEventListener("click", async () => {
    if (!files.length) {
        showToast(t("noImage") || "Choose images first");
        return;
    }
    const outW = Math.max(8, Math.min(1024, Math.round(parseInt(width.value, 10) || 320)));
    const delayCs = Math.max(2, Math.min(300, Math.round((parseInt(delay.value, 10) || 150) / 10)));

    goBtn.disabled = true;
    const old = goBtn.textContent;
    goBtn.textContent = t("gifWorking") || "Making GIF…";
    try {
        const frames = await Promise.all(files.map(async f => {
            const bitmap = await createImageBitmap(f);
            const scale = outW / bitmap.width;
            const w = outW;
            const h = Math.max(1, Math.round(bitmap.height * scale));
            const canvas = document.createElement("canvas");
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext("2d");
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(bitmap, 0, 0, w, h);
            bitmap.close();
            const ctx2 = canvas.getContext("2d");
            const data = ctx2.getImageData(0, 0, w, h);
            return { data, width: w, height: h, delayCs };
        }));

        const buf = GIFEncoder.encode(frames);
        const blob = new Blob([buf], { type: "image/gif" });
        const url = URL.createObjectURL(blob);

        preview.src = url;
        preview.hidden = false;
        sizeInfo.textContent = "GIF · " + frames[0].width + "×" + frames[0].height + " · " + formatSize(blob.size);

        download.href = url;
        download.download = "animation.gif";
        download.hidden = false;
    } catch (e) {
        showToast(e && e.message ? e.message : "Failed");
    } finally {
        goBtn.disabled = false;
        goBtn.textContent = old;
    }
});