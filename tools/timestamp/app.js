const nowTs = document.getElementById("nowTs");
const nowDate = document.getElementById("nowDate");
const tsInput = document.getElementById("tsInput");
const tsOutput = document.getElementById("tsOutput");
const dtInput = document.getElementById("dtInput");
const dtOutput = document.getElementById("dtOutput");
const unitBtns = document.querySelectorAll("#tsUnit button");

function tick() {
    const nowSec = Math.floor(Date.now() / 1000);
    nowTs.textContent = nowSec;
    nowDate.textContent = new Date().toLocaleString() + "  ·  " +
        (lang === "zh" ? "时间戳也会每秒更新" : "seconds auto-refresh");
}
tick();
setInterval(tick, 1000);

unitBtns.forEach(btn => btn.addEventListener("click", () => {
    unitBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    convert();
}));

tsInput.addEventListener("input", convert);

function convert() {
    const v = parseInt(tsInput.value);
    if (isNaN(v)) { tsOutput.textContent = "—"; return; }
    const mult = parseInt(document.querySelector("#tsUnit .active").dataset.mult);
    const d = new Date(mult === 1000 ? v : v * 1000);
    if (isNaN(d.getTime())) { tsOutput.textContent = t("invalidDate"); return; }
    tsOutput.textContent = d.toLocaleString();
    tsOutput.style.cursor = "pointer";
    tsOutput.onclick = () => copyText(String(v));
}

document.getElementById("dtConvert").addEventListener("click", () => {
    const d = new Date(dtInput.value);
    if (isNaN(d.getTime())) { dtOutput.textContent = t("invalidDate"); return; }
    const sec = Math.floor(d.getTime() / 1000);
    dtOutput.textContent = `seconds: ${sec}\nmilliseconds: ${d.getTime()}`;
    dtOutput.style.cursor = "pointer";
    dtOutput.onclick = () => copyText(String(sec));
});

dtInput.value = new Date(Date.now() - Date.now() % 60000).toISOString().slice(0, 16);

window.onLangChange = () => {
    nowDate.textContent = new Date().toLocaleString() +
        (lang === "zh" ? "  ·  时间戳也会每秒更新" : "  ·  seconds auto-refresh");
};