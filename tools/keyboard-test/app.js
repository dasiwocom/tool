const ROWS = [
    [
        ["Escape", "Esc", 1], ["F1", "F1", 1], ["F2", "F2", 1], ["F3", "F3", 1],
        ["F4", "F4", 1], ["F5", "F5", 1], ["F6", "F6", 1], ["F7", "F7", 1],
        ["F8", "F8", 1], ["F9", "F9", 1], ["F10", "F10", 1], ["F11", "F11", 1],
        ["F12", "F12", 1], ["PrintScreen", "PrtSc", 1], ["ScrollLock", "ScrLk", 1], ["Pause", "Pause", 1]
    ],
    [
        ["Backquote", "`", 1], ["Digit1", "1", 1], ["Digit2", "2", 1], ["Digit3", "3", 1],
        ["Digit4", "4", 1], ["Digit5", "5", 1], ["Digit6", "6", 1], ["Digit7", "7", 1],
        ["Digit8", "8", 1], ["Digit9", "9", 1], ["Digit0", "0", 1], ["Minus", "-", 1],
        ["Equal", "=", 1], ["Backspace", "\u232b", 2]
    ],
    [
        ["Tab", "Tab", 1.5], ["KeyQ", "Q", 1], ["KeyW", "W", 1], ["KeyE", "E", 1],
        ["KeyR", "R", 1], ["KeyT", "T", 1], ["KeyY", "Y", 1], ["KeyU", "U", 1],
        ["KeyI", "I", 1], ["KeyO", "O", 1], ["KeyP", "P", 1], ["BracketLeft", "[", 1],
        ["BracketRight", "]", 1], ["Backslash", "\\", 1.5]
    ],
    [
        ["CapsLock", "Caps", 1.8], ["KeyA", "A", 1], ["KeyS", "S", 1], ["KeyD", "D", 1],
        ["KeyF", "F", 1], ["KeyG", "G", 1], ["KeyH", "H", 1], ["KeyJ", "J", 1],
        ["KeyK", "K", 1], ["KeyL", "L", 1], ["Semicolon", ";", 1], ["Quote", "'", 1],
        ["Enter", "\u21b5", 2.2]
    ],
    [
        ["ShiftLeft", "Shift", 2.3], ["KeyZ", "Z", 1], ["KeyX", "X", 1],
        ["KeyC", "C", 1], ["KeyV", "V", 1], ["KeyB", "B", 1], ["KeyN", "N", 1],
        ["KeyM", "M", 1], ["Comma", ",", 1], ["Period", ".", 1], ["Slash", "/", 1],
        ["ShiftRight", "Shift", 2.8]
    ],
    [
        ["ControlLeft", "Ctrl", 1.3], ["MetaLeft", "\u229e", 1.3], ["AltLeft", "Alt", 1.3],
        ["Space", "Space", 6.4], ["AltRight", "Alt", 1.3], ["MetaRight", "\u229e", 1.3],
        ["ContextMenu", "\u2263", 1.3], ["ControlRight", "Ctrl", 1.3]
    ]
];

const container = document.getElementById("keyboard");
const byCode = {};
ROWS.forEach(row => {
    const r = document.createElement("div");
    r.className = "kb-row";
    row.forEach(([code, label, w]) => {
        const k = document.createElement("kbd");
        k.className = "key";
        k.style.flexGrow = w;
        k.style.flexBasis = "0";
        k.textContent = label;
        k.dataset.code = code;
        r.appendChild(k);
        byCode[code] = k;
    });
    container.appendChild(r);
});

const heldSet = new Set();
const heldEl = document.getElementById("held");
const logEl = document.getElementById("log");
const evKey = document.getElementById("evKey");
const evCode = document.getElementById("evCode");
const evKeyCode = document.getElementById("evKeyCode");
const evLoc = document.getElementById("evLoc");
const evMods = document.getElementById("evMods");
const evRepeat = document.getElementById("evRepeat");

const LOC = ["kbLoc0", "kbLoc1", "kbLoc2", "kbLoc3"];

function modsOf(e) {
    const list = [];
    if (e.ctrlKey) list.push("Ctrl");
    if (e.shiftKey) list.push("Shift");
    if (e.altKey) list.push("Alt");
    if (e.metaKey) list.push("Meta");
    return list.length ? list.join("+") : "\u2014";
}

function keyDisplay(e) {
    if (e.key === " ") return "Space";
    if (e.key === "") return "\u2026";
    return e.key;
}

function codeFor(e) {
    return e.code || e.key;
}

function mark(code, on) {
    const el = byCode[code];
    if (el) el.classList.toggle("pressed", on);
}

function renderHeld() {
    heldEl.innerHTML = "";
    heldSet.forEach(code => {
        const chip = document.createElement("span");
        chip.className = "chip";
        const el = byCode[code];
        chip.textContent = (el ? el.textContent : code);
        heldEl.appendChild(chip);
    });
}

function addHeld(code) { heldSet.add(code); renderHeld(); }
function removeHeld(code) { heldSet.delete(code); renderHeld(); }

function updateEvent(e) {
    evKey.textContent = keyDisplay(e);
    evCode.textContent = e.code || e.key;
    evKeyCode.textContent = e.keyCode != null ? String(e.keyCode) : "\u2014";
    evLoc.textContent = t(LOC[e.location] || "kbLoc0") + " (" + e.location + ")";
    evMods.textContent = modsOf(e);
    evRepeat.textContent = e.repeat ? "\u2713" : "\u2014";
}

function logEvent(e, dir) {
    const row = document.createElement("div");
    row.className = "row";
    const idx = document.createElement("span");
    idx.className = "row-idx";
    idx.textContent = dir === "keydown" ? "\u2193" : "\u2191";
    row.appendChild(idx);
    const name = document.createElement("span");
    name.textContent = (e.code || e.key) + " (" + keyDisplay(e) + ") \u00b7 " + modsOf(e);
    if (e.repeat) name.textContent += " \u00d7";
    row.appendChild(name);
    logEl.prepend(row);
    while (logEl.children.length > 40) logEl.lastChild.remove();
}

function handleDown(e) {
    e.preventDefault();
    addHeld(codeFor(e));
    mark(codeFor(e), true);
    updateEvent(e);
    logEvent(e, "keydown");
}

function handleUp(e) {
    removeHeld(codeFor(e));
    mark(codeFor(e), false);
    updateEvent(e);
    logEvent(e, "keyup");
}

function resetAll() {
    heldSet.clear();
    renderHeld();
    Object.keys(byCode).forEach(code => byCode[code].classList.remove("pressed"));
}

window.addEventListener("keydown", handleDown);
window.addEventListener("keyup", handleUp);
window.addEventListener("blur", resetAll);
document.getElementById("clearLog").addEventListener("click", () => { logEl.innerHTML = ""; });

window.onLangChange = () => {};