const video = document.getElementById("video");
const placeholder = document.getElementById("videoPlaceholder");
const select = document.getElementById("deviceSelect");
const startBtn = document.getElementById("startBtn");
const torchBtn = document.getElementById("torchBtn");
const alertBox = document.getElementById("alert");
const statusEl = document.getElementById("status");
const resBtn = document.getElementById("resBtn");
const resList = document.getElementById("resList");

let stream = null;
let torchOn = false;

function showAlert(msg) { alertBox.textContent = msg; alertBox.classList.add("show"); }
function hideAlert() { alertBox.classList.remove("show"); }
function showStatus(msg) { statusEl.textContent = msg; }

function hasMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.enumerateDevices && navigator.mediaDevices.getUserMedia);
}

async function refreshDevices(preferred) {
    if (!hasMedia()) { showAlert(t("camNoSupport")); return; }
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cams = devices.filter(d => d.kind === "videoinput");
        select.innerHTML = "";
        if (!cams.length) {
            select.appendChild(new Option(t("camNoDevice"), ""));
            select.disabled = true;
        } else {
            select.disabled = false;
            cams.forEach((d, i) => {
                const label = d.label || ("Camera " + (i + 1));
                const opt = new Option(label, d.deviceId);
                if (preferred && d.deviceId === preferred) opt.selected = true;
                select.appendChild(opt);
            });
        }
    } catch (e) {
        showAlert(e.message || String(e));
    }
}

function camErrorText(e) {
    const name = e && e.name;
    if (name === "NotAllowedError" || name === "PermissionDeniedError") return t("camDenied");
    if (name === "NotFoundError" || name === "DevicesNotFoundError") return t("camNoDevice");
    if (name === "NotReadableError" || name === "AbortError" || name === "TrackStartError") return t("camBusy");
    if (name === "OverconstrainedError") return t("camBusy");
    return (e && e.message) || String(e);
}

function updateStartLabel() {
    startBtn.textContent = stream ? t("camStop") : t("camStart");
    startBtn.classList.toggle("btn-primary", !stream);
    startBtn.classList.toggle("btn-secondary", !!stream);
}

function setBusy(on) {
    startBtn.disabled = on;
    resBtn.disabled = on;
}

async function startCamera() {
    if (!hasMedia()) { showAlert(t("camNoSupport")); return; }
    stopCamera(true);
    const constraints = {
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
    };
    if (select.value) constraints.video.deviceId = { exact: select.value };
    setBusy(true);
    try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        await video.play().catch(() => {});
        hideAlert();
        torchOn = false;
        torchBtn.textContent = t("camTorch");
        torchBtn.disabled = false;
        showStatus(t("camRunning") + " · " + video.videoWidth + "\u00d7" + video.videoHeight);
        placeholder.style.display = "none";
        updateStartLabel();
    } catch (e) {
        showAlert(camErrorText(e));
    } finally {
        setBusy(false);
    }
}

function stopCamera(silent) {
    if (stream) { stream.getTracks().forEach(tr => tr.stop()); stream = null; }
    video.srcObject = null;
    torchOn = false;
    torchBtn.disabled = true;
    torchBtn.textContent = t("camTorch");
    placeholder.style.display = "";
    if (!silent) showStatus(t("camStopped"));
    updateStartLabel();
}

async function toggleTorch() {
    if (!stream || !stream.getVideoTracks().length) {
        showAlert(t("camNotStarted"));
        return;
    }
    const track = stream.getVideoTracks()[0];
    let supported = false;
    try {
        const caps = track.getCapabilities ? track.getCapabilities() : null;
        supported = !!(caps && caps.torch);
    } catch (_) { supported = false; }
    if (!supported) { showAlert(t("camNoTorch")); return; }
    torchOn = !torchOn;
    try {
        await track.applyConstraints({ advanced: [{ torch: torchOn }] });
        torchBtn.textContent = t("camTorch") + " · " + (torchOn ? t("camTorchOn") : t("camTorchOff"));
    } catch (e) {
        torchOn = !torchOn;
        showAlert(e.message || String(e));
    }
}

const CANDIDATES = [
    { width: 3840, height: 2160 }, { width: 2560, height: 1440 },
    { width: 1920, height: 1080 }, { width: 1600, height: 1200 },
    { width: 1280, height: 1024 }, { width: 1280, height: 720 },
    { width: 960, height: 540 }, { width: 800, height: 600 },
    { width: 640, height: 480 }, { width: 480, height: 360 },
    { width: 320, height: 240 }
];

async function detectResolutions() {
    if (!hasMedia()) { showAlert(t("camNoSupport")); return; }
    resBtn.disabled = true;
    resBtn.textContent = t("camDetecting");
    resList.innerHTML = "";
    hideAlert();
    const results = [];
    for (const c of CANDIDATES) {
        let ok = false;
        try {
            const s = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: select.value ? { exact: select.value } : undefined, width: { exact: c.width }, height: { exact: c.height } },
                audio: false
            });
            ok = !!s.getVideoTracks().length;
            s.getTracks().forEach(tr => tr.stop());
        } catch (_) { ok = false; }
        if (ok) results.push(c.width + "\u00d7" + c.height);
    }
    resBtn.disabled = false;
    resBtn.textContent = t("camResTest");
    if (!results.length) {
        const empty = document.createElement("div");
        empty.className = "row";
        empty.textContent = t("camNoRes");
        empty.style.opacity = "0.55";
        resList.appendChild(empty);
        return;
    }
    results.forEach(r => {
        const row = document.createElement("div");
        row.className = "row";
        row.textContent = r;
        resList.appendChild(row);
    });
}

startBtn.addEventListener("click", () => { stream ? stopCamera() : startCamera(); });
torchBtn.addEventListener("click", toggleTorch);
resBtn.addEventListener("click", detectResolutions);

refreshDevices();
navigator.mediaDevices && navigator.mediaDevices.addEventListener("devicechange", () => refreshDevices(select.value));

window.onLangChange = () => {
    updateStartLabel();
    torchBtn.textContent = t("camTorch") + (torchOn ? " · " + t("camTorchOn") : "");
    if (resBtn.disabled) resBtn.textContent = t("camDetecting");
    else resBtn.textContent = t("camResTest");
};