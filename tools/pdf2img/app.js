/* PDF to Image */
if (!window.pdfjsLib) {
    const el = document.getElementById("alert");
    if (el) {
        el.textContent = "PDF engine failed to load - please use a modern browser / PDF 引擎加载失败，请使用新版浏览器";
        el.classList.add("show");
    }
}
pdfjsLib.GlobalWorkerOptions.workerSrc = "../../vendor/pdf.worker.min.js?v=20260919v";

const file = document.getElementById("file");
const widthRange = document.getElementById("width");
const widthVal = document.getElementById("widthVal");
const convertBtn = document.getElementById("convert");
const alertBox = document.getElementById("alert");
const result = document.getElementById("result");
const pageCount = document.getElementById("pageCount");
const sizeInfo = document.getElementById("sizeInfo");
const pagesEl = document.getElementById("pages");
const dlAll = document.getElementById("dlAll");

let source = null;
let pageBlobs = [];

function showAlert(msg) { alertBox.textContent = msg; alertBox.classList.add("show"); }
function hideAlert() { alertBox.classList.remove("show"); }

function formatSize(b) {
    if (b < 1024) return b + " B";
    if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
    return (b / 1048576).toFixed(2) + " MB";
}

file.addEventListener("change", () => {
    source = file.files && file.files[0] ? file.files[0] : null;
    if (source) { result.hidden = true; hideAlert(); }
});

widthRange.addEventListener("input", () => {
    widthVal.textContent = widthRange.value + "px";
});

convertBtn.addEventListener("click", async () => {
    if (!source) { showToast(t("pdfErr")); return; }
    convertBtn.disabled = true;
    try {
        const buf = await source.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
        const total = pdf.numPages;
        const first = await pdf.getPage(1);
        const base = first.getViewport({ scale: 1 });
        const target = parseInt(widthRange.value, 10) || 1440;
        const scale = target / base.width;

        pageBlobs = [];
        pagesEl.innerHTML = "";
        let totalBytes = 0;

        for (let i = 1; i <= total; i++) {
            const page = i === 1 ? first : await pdf.getPage(i);
            const vp = page.getViewport({ scale });
            const canvas = document.createElement("canvas");
            canvas.width = Math.max(1, Math.floor(vp.width));
            canvas.height = Math.max(1, Math.floor(vp.height));
            await page.render({ canvasContext: canvas.getContext("2d"), viewport: vp }).promise;
            const blob = await new Promise(res => canvas.toBlob(res, "image/png"));
            pageBlobs.push(blob);
            totalBytes += blob.size;

            const url = URL.createObjectURL(blob);
            const item = document.createElement("div");
            item.className = "pdf-page";
            const img = document.createElement("img");
            img.src = url;
            img.alt = "page " + i;
            const link = document.createElement("a");
            link.href = url;
            link.download = "page-" + i + ".png";
            link.textContent = "PNG · " + i;
            item.appendChild(img);
            item.appendChild(link);
            pagesEl.appendChild(item);
        }

        pdf.destroy();
        pageCount.textContent = total;
        sizeInfo.textContent = formatSize(totalBytes);
        result.hidden = false;
        hideAlert();
        showToast(t("pdfDone"));
    } catch (e) {
        showAlert(t("pdfErr"));
        pageBlobs = [];
    } finally {
        convertBtn.disabled = false;
    }
});

dlAll.addEventListener("click", async () => {
    if (!pageBlobs.length) return;
    const zip = new JSZip();
    pageBlobs.forEach((b, i) => zip.file("page-" + (i + 1) + ".png", b));
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pdf-pages.zip";
    a.click();
    URL.revokeObjectURL(url);
});

window.onLangChange = () => {};