const input = document.getElementById("input");
const out = id => document.getElementById(id);

function update() {
    const s = input.value;
    if (!s) {
        ["chars", "words", "lines", "nospace", "cjk", "bytes"].forEach(id => out(id).textContent = "0");
        return;
    }
    out("chars").textContent = Array.from(s).length;
    out("words").textContent = s.trim() ? s.trim().split(/\s+/).length : 0;
    out("lines").textContent = s.split("\n").length;
    out("nospace").textContent = s.replace(/\s/g, "").length;
    const cjk = s.match(/[\u4e00-\u9fff]/g);
    out("cjk").textContent = cjk ? cjk.length : 0;
    out("bytes").textContent = new TextEncoder().encode(s).length;
}

input.addEventListener("input", update);
document.getElementById("clearNoSave").addEventListener("click", () => {
    input.value = "";
    update();
    input.focus();
});

update();

window.onLangChange = () => update();