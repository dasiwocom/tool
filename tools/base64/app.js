const input = document.getElementById("input");
const output = document.getElementById("output");
const alertBox = document.getElementById("alert");
const segBtns = document.querySelectorAll("#direction button");

segBtns.forEach(btn => btn.addEventListener("click", () => {
    segBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
}));

document.getElementById("convert").addEventListener("click", () => {
    if (!input.value) { output.value = ""; return; }
    const mode = document.querySelector("#direction .active").dataset.mode;
    try {
        output.value = mode === "encode"
            ? btoa(unescape(encodeURIComponent(input.value)))
            : decodeURIComponent(escape(atob(input.value)));
        hideAlert();
    } catch (e) {
        showAlert(e.message);
        output.value = "";
    }
});

document.getElementById("copyOut").addEventListener("click", () => {
    if (output.value) copyText(output.value);
});

function showAlert(msg) { alertBox.textContent = msg; alertBox.classList.add("show"); }
function hideAlert() { alertBox.classList.remove("show"); }

window.onLangChange = () => {};