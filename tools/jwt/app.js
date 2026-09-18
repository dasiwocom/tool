const input = document.getElementById("input");
const alertBox = document.getElementById("alert");
const result = document.getElementById("result");

const SAMPLE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE3MDAwODk2MDB9.c2p2x9rDQ9XzQd0B1nS7y-4wAeYUbT8jcZ0Rf8g3HhY";

function decodePart(str) {
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";
    const bin = atob(base64);
    let utf8 = "";
    for (let i = 0; i < bin.length; i++) {
        utf8 += String.fromCharCode(bin.charCodeAt(i));
    }
    return decodeURIComponent(escape(utf8));
}

function section(label, json) {
    const wrap = document.createElement("div");
    wrap.className = "section";
    const head = document.createElement("div");
    head.className = "section-label";
    const span = document.createElement("span");
    span.textContent = label;
    const copy = document.createElement("button");
    copy.className = "btn-ghost";
    copy.textContent = "Copy";
    copy.addEventListener("click", () => copyText(JSON.stringify(json, null, 2)));
    head.append(span, copy);
    const block = document.createElement("div");
    block.className = "json-block";
    block.textContent = JSON.stringify(json, null, 2);
    wrap.append(head, block);
    return wrap;
}

function decode() {
    alertBox.classList.remove("show");
    result.innerHTML = "";
    const token = input.value.trim();
    const parts = token.split(".");
    if (parts.length !== 3) {
        showAlert(t("invalidJWT") + " — expected 3 parts, got " + parts.length);
        return;
    }
    try {
        const header = JSON.parse(decodePart(parts[0]));
        const payload = JSON.parse(decodePart(parts[1]));
        result.appendChild(section(t("header"), header));
        result.appendChild(section(t("payload"), payload));

        // Expiry + signature info
        const meta = document.createElement("div");
        meta.className = "section";
        const rows = [];
        rows.push(`<div style="margin-bottom:6px;">${
            parts[2] ? "✓ " + t("signed") : "✗ " + t("unsigned")
        }</div>`);
        if (payload.iat) {
            rows.push(`<div style="margin-bottom:6px;color:var(--text-secondary);font-size:13px;">
                <strong style="color:var(--text);">iat</strong> · ${new Date(payload.iat * 1000).toLocaleString()}</div>`);
        }
        if (payload.exp) {
            const isExpired = Math.floor(Date.now() / 1000) > payload.exp;
            const state = isExpired ? t("expired") : t("notExpired");
            rows.push(`<div style="color:var(--text-secondary);font-size:13px;">
                <strong style="color:var(--text);">exp</strong> · ${new Date(payload.exp * 1000).toLocaleString()} — <strong style="color:${isExpired ? "var(--danger)" : "var(--success)"};">${state}</strong></div>`);
        }
        if (!payload.exp && !payload.iat) {
            rows.push(`<div style="color:var(--text-muted);font-size:13px;">${t("noExpiry")}</div>`);
        }
        const box = document.createElement("div");
        box.className = "result";
        box.style.fontFamily = "var(--font)";
        box.innerHTML = rows.join("");
        meta.appendChild(box);
        result.appendChild(meta);
    } catch (e) {
        showAlert(t("invalidJWT") + ": " + e.message);
    }
}

function showAlert(msg) { alertBox.textContent = msg; alertBox.classList.add("show"); }

document.getElementById("decode").addEventListener("click", decode);
document.getElementById("sample").addEventListener("click", () => {
    input.value = SAMPLE;
    decode();
});

window.onLangChange = () => {};