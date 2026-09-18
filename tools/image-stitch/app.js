/* Image Stitch */
const file = document.getElementById("file");
const dir = document.getElementById("dir");
const gap = document.getElementById("gap");
const fileList = document.getElementById("fileList");
const goBtn = document.getElementById("goBtn");
const preview = document.getElementById("preview");
const sizeInfo = document.getElementById("sizeInfo");
const download = document.getElementById("download");

let files = [];

file.addEventListener("change", () => {
    files = file.files ? Array.from(file.files) : [];
    fileList.textContent = files.length
        ? files.map(f => f.name).join(" · ") + (files.length > 6 ? " …" : "")
        : "";
    preview.hidden = true;
    sizeInfo.textContent = "";
    download.hidden = true;
});

function nameBase(name) {
    return (name || "image").replace(/\.[a-z0-9]+$/i, "");
}

goBtn.addEventListener("click", async () => {
    if (files.length < 2) {
        showToast(t("stitchNeed") || "Pick at least two images");
        return;
    }
    const g = Math.max(0, Math.min(200, parseInt(gap.value, 10) || 0));
    const horizontal = dir.value === "h";

    const bitmaps = await Promise.all(files.map(f => createImageBitmap(f)));
    const W = bitmaps.map(b => b.width);
    const H = bitmaps.map(b => b.height);
    const canvas = document.createElement("canvas");
    if (horizontal) {
        const maxH = Math.max(...H);
        canvas.width = W.reduce((a, b) => a + b, 0) + g * (bitmaps.length - 1);
        canvas.height = maxH;
    } else {
        const maxW = Math.max(...W);
        canvas.width = maxW;
        canvas.height = H.reduce((a, b) => a + b, 0) + g * (bitmaps.length - 1);
    }
    const ctx = canvas.getContext("2d");
    let off = 0;
    bitmaps.forEach((b, i) => {
        if (horizontal) ctx.drawImage(b, off, (canvas.height - b.height) / 2);
        else ctx.drawImage(b, (canvas.width - b.width) / 2, off);
        off += horizontal ? b.width : b.height;
        off += g;
        b.close();
    });

    const url = canvas.toDataURL("image/png");
    preview.src = url;
    preview.hidden = false;
    sizeInfo.textContent = "PNG · " + canvas.width + "×" + canvas.height;

    download.href = url;
    download.download = "stitch-" + nameBase(files[0].name) + ".png";
    download.hidden = false;
});