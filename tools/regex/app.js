const pattern = document.getElementById("pattern");
const text = document.getElementById("text");
const view = document.getElementById("view");
const info = document.getElementById("info");
const flags = { g: true, i: false, m: false, s: false, u: false };

document.querySelectorAll(".flag-row input").forEach(cb => {
    cb.addEventListener("change", () => {
        flags[cb.id.replace("f-", "")] = cb.checked;
        update();
    });
});

function delay(fn, ms) { clearTimeout(delay._t); delay._t = setTimeout(fn, ms); }

function update() {
    delay(() => {
        const pat = pattern.value;
        const str = text.value;
        const infoKey = info.textContent;
        if (!pat) {
            view.textContent = str;
            info.textContent = "";
            return;
        }
        let flagStr = Object.entries(flags).filter(([, v]) => v).map(([k]) => k).join("");
        try {
            const re = new RegExp(pat, flagStr);
            const matches = [];
            let m;
            if (flagStr.includes("g")) {
                while ((m = re.exec(str)) !== null) {
                    matches.push({ value: m[0], index: m.index });
                    if (m.index === re.lastIndex) re.lastIndex++;
                }
            } else {
                m = re.exec(str);
                if (m) matches.push({ value: m[0], index: m.index });
            }

            if (!matches.length) {
                view.innerHTML = escapeHtml(str) || "&nbsp;";
                info.textContent = t("noMatches");
                return;
            }
            let html = "";
            let last = 0;
            matches.forEach(mo => {
                html += escapeHtml(str.slice(last, mo.index));
                html += `<mark>${escapeHtml(mo.value)}</mark>`;
                last = mo.index + mo.value.length;
            });
            html += escapeHtml(str.slice(last));
            view.innerHTML = html || "&nbsp;";
            info.textContent = `${matches.length} ${t("matches")}`;
        } catch (e) {
            view.innerHTML = escapeHtml(str) || "&nbsp;";
            info.textContent = e.message;
        }
    }, 120);
}

function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

pattern.addEventListener("input", update);
text.addEventListener("input", update);

text.value = "Contact: dev@toolbox.io or support@example.com — try me!";

update();

window.onLangChange = () => update();