/* Image Convert */
const file = document.getElementById("file");
const fileList = document.getElementById("fileList");
const format = document.getElementById("format");
const qualityWrap = document.getElementById("qualityWrap");
const quality = document.getElementById("quality");
const qualityVal = document.getElementById("qualityVal");
const convertBtn = document.getElementById("convert");
const result = document.getElementById("result");
const resultGrid = document.getElementById("resultGrid");

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

format.addEventListener("change", () => {
    qualityWrap.hidden = NO_QUALITY.has(format.value);
});
quality.addEventListener("input", () => {
    qualityVal.textContent = quality.value + "%";
});
file.addEventListener("change", () => {
    files = file.files ? Array.from(file.files) : [];
    if (files.length) {
        fileList.textContent = files.length + " · " +
            files.map(f => f.name).join(" · ") + (files.length > 6 ? " …" : "");
        result.hidden = true;
        resultGrid.innerHTML = "";
    } else {
        fileList.textContent = "";
    }
});

function formatSize(b) {
    if (b < 1024) return b + " B";
    if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
    return (b / 1048576).toFixed(2) + " MB";
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

    let ok = 0;
    for (const f of files) {
        const out = await convertOne(f, type);
        if (!out) continue;
        ok++;

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
        nm.textContent = nameBase(f.name) + "." + out.ext;
        nm.style.cssText = "overflow:hidden; text-overflow:ellipsis; white-space:nowrap;";
        const sz = document.createElement("span");
        sz.textContent = formatSize(out.blob.size) + " · " + out.w + "×" + out.h;
        const a = document.createElement("a");
        a.href = url;
        a.download = nameBase(f.name) + "." + out.ext;
        a.textContent = "Download";
        a.className = "btn btn-sm btn-primary";
        a.style.cssText = "align-self:center;";

        meta.appendChild(nm);
        meta.appendChild(sz);
        cell.appendChild(img);
        cell.appendChild(meta);
        cell.appendChild(a);
        resultGrid.appendChild(cell);
    }

    convertBtn.disabled = false;
    if (!ok) {
        showToast(t("noImage") + " (" + ext + ")");
        return;
    }
});