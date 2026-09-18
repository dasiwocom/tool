/* Bulk Rename */
const linesEl = document.getElementById("lines");
const ruleEl = document.getElementById("rule");
const prefixEl = document.getElementById("prefix");
const suffixEl = document.getElementById("suffix");
const startEl = document.getElementById("start");
const padEl = document.getElementById("pad");
const list = document.getElementById("list");
const result = document.getElementById("result");

let names = [];

function splitExt(name) {
    const i = name.lastIndexOf(".");
    return i >= 0 ? [name.slice(0, i), name.slice(i)] : [name, ""];
}

function generate() {
    const raw = linesEl.value.split("\n").map(l => l.trim()).filter(Boolean);
    if (!raw.length) {
        showToast(t("inputEmpty"));
        return;
    }
    const prefix = prefixEl.value;
    const suffix = suffixEl.value;
    const start = Math.max(0, parseInt(startEl.value, 10) || 0);
    const pad = Math.max(0, parseInt(padEl.value, 10) || 0);

    names = raw.map((name, i) => {
        const [base, ext] = splitExt(name);
        if (ruleEl.value === "sequential") {
            const num = String(start + i).padStart(pad, "0");
            return prefix + num + suffix + ext;
        }
        return prefix + base + suffix + ext;
    });

    list.innerHTML = names.map((n, i) =>
        `<div class="row"><span class="row-idx">${i + 1}</span><span>${n}</span></div>`
    ).join("");
    list.querySelectorAll(".row span:last-child").forEach((el, i) => {
        el.style.cursor = "pointer";
        el.addEventListener("click", () => copyText(names[i]));
    });
    result.hidden = false;
}

document.getElementById("generate").addEventListener("click", generate);
document.getElementById("copyAll").addEventListener("click", () => {
    if (names.length) copyText(names.join("\n"));
});

window.onLangChange = () => {};