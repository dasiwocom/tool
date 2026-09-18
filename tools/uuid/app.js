const count = document.getElementById("count");
const countLabel = document.getElementById("countLabel");
const list = document.getElementById("list");
let uuids = [];

function makeUUID() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const h = Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
    return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`;
}

function generate() {
    const n = parseInt(count.value);
    uuids = Array.from({ length: n }, makeUUID);
    list.innerHTML = uuids.map((u, i) =>
        `<div class="row"><span class="row-idx">${i + 1}</span><span>${u}</span></div>`
    ).join("");
    list.querySelectorAll(".row span:last-child").forEach((el, i) => {
        el.style.cursor = "pointer";
        el.addEventListener("click", () => copyText(uuids[i]));
    });
}

count.addEventListener("input", () => {
    countLabel.textContent = count.value;
    generate();
});
countLabel.textContent = count.value;

document.getElementById("generate").addEventListener("click", generate);
document.getElementById("copyAll").addEventListener("click", () => {
    if (uuids.length) copyText(uuids.join("\n"));
});

generate();

window.onLangChange = () => {};