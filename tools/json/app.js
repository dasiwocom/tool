const input = document.getElementById("input");
const output = document.getElementById("output");
const alertBox = document.getElementById("alert");

document.getElementById("prettify").addEventListener("click", () => run(true));
document.getElementById("minify").addEventListener("click", () => run(false));

document.getElementById("copyOut").addEventListener("click", () => {
    if (output.value) copyText(output.value);
});
document.getElementById("clearOut").addEventListener("click", () => {
    input.value = "";
    output.value = "";
    alertBox.classList.remove("show");
    input.focus();
});

document.getElementById("fillSample").addEventListener("click", () => {
    input.value = t("sampleJSON");
    run(true);
});

function run(pretty) {
    if (!input.value.trim()) { output.value = ""; hideAlert(); return; }
    try {
        const obj = JSON.parse(input.value);
        output.value = pretty ? JSON.stringify(obj, null, 4) : JSON.stringify(obj);
        hideAlert();
    } catch (e) {
        showAlert(t("invalidJSON") + ": " + e.message);
        output.value = "";
    }
}

function showAlert(msg) { alertBox.textContent = msg; alertBox.classList.add("show"); }
function hideAlert() { alertBox.classList.remove("show"); }

window.onLangChange = () => { run(true); };