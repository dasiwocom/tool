/* Bulk Rename */
const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("file");
const fileList = document.getElementById("fileList");
const preview = document.getElementById("preview");
const list = document.getElementById("list");
const copyAllBtn = document.getElementById("copyAll");
const downloadBtn = document.getElementById("downloadRenamed");
const ruleEl = document.getElementById("rule");
const prefixEl = document.getElementById("prefix");
const suffixEl = document.getElementById("suffix");
const startEl = document.getElementById("start");
const padEl = document.getElementById("pad");
const numRow = document.getElementById("numRow");

let files = [];
let inputs = [];

function splitExt(name) {
    const i = name.lastIndexOf(".");
    return i >= 0 ? [name.slice(0, i), name.slice(i)] : [name, ""];
}

function freshNames() {
    const prefix = prefixEl.value;
    const suffix = suffixEl.value;
    const start = Math.max(0, parseInt(startEl.value, 10) || 0);
    const pad = Math.max(0, parseInt(padEl.value, 10) || 0);
    return files.map((f, i) => {
        const [base, ext] = splitExt(f.name);
        if (ruleEl.value === "sequential") {
            const num = String(start + i).padStart(pad, "0");
            return prefix + num + suffix + ext;
        }
        if (ruleEl.value === "concat") return prefix + suffix + ext;
        return prefix + base + suffix + ext;
    });
}

function applyRule() {
    if (!files.length) return;
    list.innerHTML = "";
    inputs = [];
    freshNames().forEach((name, i) => {
        const row = document.createElement("div");
        row.className = "row";

        const idx = document.createElement("span");
        idx.className = "row-idx";
        idx.textContent = String(i + 1);

        const old = document.createElement("span");
        old.className = "old-name";
        old.textContent = files[i].name;
        old.title = files[i].name;

        const arrow = document.createElement("span");
        arrow.className = "arrow";
        arrow.textContent = "→";

        const input = document.createElement("input");
        input.type = "text";
        input.className = "new-name code";
        input.value = name;
        input.spellcheck = false;
        inputs.push(input);

        row.append(idx, old, arrow, input);
        list.appendChild(row);
    });
    preview.hidden = false;
    copyAllBtn.hidden = false;
    downloadBtn.hidden = false;
}

function setFiles(all) {
    files = Array.from(all || []);
    if (files.length) {
        const shown = files.slice(0, 6).map(f => f.name).join(" · ");
        fileList.textContent = files.length + " " + t("selected") + " · " + shown + (files.length > 6 ? " …" : "");
        applyRule();
    } else {
        fileList.textContent = "";
        preview.hidden = true;
        list.innerHTML = "";
        inputs = [];
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
    if (e.dataTransfer && e.dataTransfer.files) setFiles(e.dataTransfer.files);
});
dropZone.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", () => setFiles(fileInput.files));

/* Rule changes re-generate the preview live; cell edits are kept until you
   change a rule control or hit "Apply rule" again. */
ruleEl.addEventListener("change", () => {
    numRow.style.display = ruleEl.value === "sequential" ? "grid" : "none";
    applyRule();
});
[prefixEl, suffixEl].forEach(el => el.addEventListener("input", applyRule));
/* number inputs: listen for both typing and commit (spinner arrows / blur) */
[startEl, padEl].forEach(el => {
    el.addEventListener("input", applyRule);
    el.addEventListener("change", applyRule);
});
document.getElementById("generate").addEventListener("click", () => {
    if (!files.length) showToast(t("chooseFirst"));
    else applyRule();
});

copyAllBtn.addEventListener("click", () => {
    if (inputs.length) copyText(inputs.map(i => i.value).join("\n"));
});

/* New names must be unique inside the ZIP — suffix duplicates on collision */
function uniqueNames(items) {
    const seen = new Map();
    return items.map(name => {
        if (!seen.has(name)) { seen.set(name, 1); return name; }
        const [base, ext] = splitExt(name);
        let n = seen.get(name) + 1;
        let next = base + " (" + n + ")" + ext;
        while (seen.has(next)) { n++; next = base + " (" + n + ")" + ext; }
        seen.set(name, n);
        seen.set(next, 1);
        return next;
    });
}

downloadBtn.addEventListener("click", async () => {
    const paired = [];
    inputs.forEach((input, i) => {
        const name = input.value.trim();
        if (name && i < files.length && files[i]) paired.push({ file: files[i], name });
    });
    if (!paired.length) {
        showToast(t("noFiles"));
        return;
    }
    const zip = new JSZip();
    uniqueNames(paired.map(p => p.name)).forEach((n, i) => zip.file(n, paired[i].file));
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "renamed-files.zip";
    a.click();
    URL.revokeObjectURL(url);
});

window.onLangChange = () => {};