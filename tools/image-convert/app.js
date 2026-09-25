/* Image Convert */
const dropZone = document.getElementById("dropZone");
const file = document.getElementById("file");
const fileList = document.getElementById("fileList");
const format = document.getElementById("format");
const qualityWrap = document.getElementById("qualityWrap");
const quality = document.getElementById("quality");
const qualityVal = document.getElementById("qualityVal");
const convertBtn = document.getElementById("convert");
const downloadZipBtn = document.getElementById("downloadZip");
const result = document.getElementById("result");
const resultGrid = document.getElementById("resultGrid");
const resultSummary = document.getElementById("resultSummary");

let files = [];

const TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/avif": "avif",
    "image/bmp": "bmp",
    "image/svg+xml": "svg"
};
/* formats that ignore the quality parameter */
const NO_QUALITY = new Set(["image/png", "image/bmp", "image/svg+xml"]);

function isImage(f) {
    return /^image\//.test(f.type) || /\.(png|jpe?g|webp|avif|bmp|svg)$/i.test(f.name);
}

function setFiles(list) {
    const all = Array.from(list || []);
    all.forEach(f => Object.defineProperty(f, "isImage", { value: isImage(f) }));
    files = all.filter(f => f.isImage);
    if (files.length) {
        const summary = files.length + " · " + files.map(f => f.name).join(" · ") + (files.length > 6 ? " …" : "");
        fileList.textContent = summary;
        result.hidden = true;
        resultGrid.innerHTML = "";
        downloadZipBtn.hidden = true;
    } else {
        fileList.textContent = all.length ? "✗" : "";
    }
}

["dragenter", "dragover"].forEach(ev => {
    dropZone.addEventListener(ev, e => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add("dragover");
    });
});
["dragleave", "drop"].forEach(ev => {
    dropZone.addEventListener(ev, e => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove("dragover");
    });
});
dropZone.addEventListener("drop", e => {
    if (e.dataTransfer && e.dataTransfer.files) {
        setFiles(e.dataTransfer.files);
    }
});
dropZone.addEventListener("click", () => file.click());

format.addEventListener("change", () => {
    qualityWrap.hidden = NO_QUALITY.has(format.value);
});
quality.addEventListener("input", () => {
    qualityVal.textContent = quality.value + "%";
});
file.addEventListener("change", () => {
    setFiles(file.files);
});

function formatSize(b) {
    if (b < 1024) return b + " B";
    if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
    return (b / 1048576).toFixed(2) + " MB";
}

async function loadBitmap(source) {
    if (source.type === "image/svg+xml") {
        const url = URL.createObjectURL(source);
        const img = new Image();
        await new Promise((res, rej) => {
            img.onload = res;
            img.onerror = rej;
            img.src = url;
        });
        URL.revokeObjectURL(url);
        let w = img.naturalWidth;
        let h = img.naturalHeight;
        if (!w || !h) { w = 512; h = 512; }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0);
        const bmp = await createImageBitmap(canvas);
        return bmp;
    }
    return createImageBitmap(source);
}

function svgFromCanvas(canvas) {
    const png = canvas.toDataURL("image/png");
    return new Blob(
        ['<svg xmlns="http://www.w3.org/2000/svg" width="' + canvas.width + '" height="' + canvas.height + '" viewBox="0 0 ' + canvas.width + ' ' + canvas.height + '"><image width="' + canvas.width + '" height="' + canvas.height + '" href="' + png + '"/></svg>'],
        { type: "image/svg+xml" }
    );
}

function nameBase(name) {
    return (name || "image").replace(/\.[a-z0-9]+$/i, "");
}

async function convertOne(source, type) {
    const q = NO_QUALITY.has(type) ? undefined : parseInt(quality.value, 10) / 100;
    const bitmap = await loadBitmap(source);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    canvas.getContext("2d").drawImage(bitmap, 0, 0);
    bitmap.close();
    if (type === "image/svg+xml") {
        return { blob: svgFromCanvas(canvas), ext: TYPE_MAP[type] || "bin", w: canvas.width, h: canvas.height };
    }
    const blob = await new Promise(res => canvas.toBlob(res, type, q));
    if (!blob) {
        return null;
    }
    return { blob, ext: TYPE_MAP[type] || "bin", w: canvas.width, h: canvas.height };
}

let lastResults = [];

convertBtn.addEventListener("click", async () => {
    if (!files.length) {
        showToast(t("noImage"));
        return;
    }
    const type = format.value;
    const ext = TYPE_MAP[type] || "bin";
    convertBtn.disabled = true;
    result.hidden = false;
    resultGrid.innerHTML = "";
    lastResults = [];

    let ok = 0;
    let skipped = 0;
    for (const f of files) {
        try {
            const out = await convertOne(f, type);
            if (!out) { skipped++; continue; }
            ok++;
            const name = nameBase(f.name) + "." + out.ext;
            lastResults.push({ blob: out.blob, name, w: out.w, h: out.h, size: out.blob.size });

            const url = URL.createObjectURL(out.blob);
            const cell = document.createElement("div");
            cell.style.cssText = "display:flex; flex-direction:column; gap:8px; align-items:center; text-align:center;";
            const img = document.createElement("img");
            img.src = url;
            img.alt = "";
            img.style.cssText = "max-width:100%; max-height:110px; border-radius:6px; object-fit:contain; background:rgba(0,0,0,.04);";
            const meta = document.createElement("div");
            meta.style.cssText = "font-size:12px; display:flex; flex-direction:column; gap:2px; color:var(--muted, inherit); min-width:0; width:100%;";
            const nm = document.createElement("span");
            nm.textContent = name;
            nm.style.cssText = "overflow:hidden; text-overflow:ellipsis; white-space:nowrap;";
            const sz = document.createElement("span");
            sz.textContent = formatSize(out.blob.size) + " · " + out.w + "×" + out.h;
            const a = document.createElement("a");
            a.href = url;
            a.download = name;
            a.textContent = "Download";
            a.className = "btn btn-sm btn-primary";
            a.style.cssText = "align-self:center;";

            meta.appendChild(nm);
            meta.appendChild(sz);
            cell.appendChild(img);
            cell.appendChild(meta);
            cell.appendChild(a);
            resultGrid.appendChild(cell);
        } catch (err) {
            skipped++;
        }
    }

    convertBtn.disabled = false;
    if (!ok) {
        showToast(t("noImage") + " (" + ext + ")");
        return;
    }
    resultSummary.textContent = ok + " → ." + ext + (skipped ? " · " + skipped + " skipped" : "");
    downloadZipBtn.hidden = false;
});

downloadZipBtn.addEventListener("click", async () => {
    if (!lastResults.length) return;
    const zip = new JSZip();
    lastResults.forEach(r => zip.file(r.name, r.blob));
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "images-" + (TYPE_MAP[format.value] || "convert") + ".zip";
    a.click();
    URL.revokeObjectURL(url);
});