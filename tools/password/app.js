const length = document.getElementById("length");
const lengthLabel = document.getElementById("lengthLabel");
const up = document.getElementById("up");
const low = document.getElementById("low");
const dig = document.getElementById("dig");
const sym = document.getElementById("sym");
const output = document.getElementById("output");
const meter = document.getElementById("meter");
const caption = document.getElementById("caption");

function charset() {
    let c = "";
    if (up.checked) c += "ABCDEFGHJKLMNPQRSTUVWXYZ";
    if (low.checked) c += "abcdefghijkmnopqrstuvwxyz";
    if (dig.checked) c += "23456789";
    if (sym.checked) c += "!@#$%^&*()-_=+[]{}?";
    if (!c) c = "abcdefghijkmnopqrstuvwxyz";
    return c;
}

function generate() {
    const c = charset();
    const n = parseInt(length.value);
    const buf = new Uint32Array(n);
    crypto.getRandomValues(buf);
    let pwd = Array.from(buf, x => c[x % c.length]).join("");

    // guarantee at least one char from each chosen set
    const sets = [up, low, dig, sym].filter(b => b.checked);
    if (sets.length > 0) {
        const map = { up: "ABCDEFGHJKLMNPQRSTUVWXYZ", low: "abcdefghijkmnopqrstuvwxyz", dig: "23456789", sym: "!@#$%^&*()-_=+[]{}?" };
        const chars = pwd.split("");
        starts: for (let k = n - 1; k >= 0; k--) {
            const needed = sets.filter((b, i) => !Array.from(pwd.slice(0, k)).some(ch => map[b.id].includes(ch)));
            if (!needed.length) { pwd = chars.join(""); break starts; }
            (needed.forEach(need => {
                if (!map[need.id].includes(chars[k])) {
                    chars[k] = map[need.id][buf[k % buf.length] % map[need.id].length];
                }
            }));
        }
        pwd = chars.join("");
    }

    output.textContent = pwd;
    strength(c.length, n);
}

function strength(alphabetSize, n) {
    const entropy = n * Math.log2(alphabetSize || 26);
    const captionMap = lang === "zh"
        ? [["极弱", 0], ["较弱", 25], ["中等", 45], ["良好", 65], ["超强", 80]]
        : [["very weak", 0], ["weak", 25], ["fair", 45], ["good", 65], ["strong", 80]];
    let cls = "strong", text = captionMap[4][0], pct = 100;
    if (entropy < 30) { cls = "weak"; text = captionMap[0][0]; pct = 18; }
    else if (entropy < 45) { cls = "fair"; text = captionMap[1][0]; pct = 35; }
    else if (entropy < 60) { cls = "fair"; text = captionMap[2][0]; pct = 50; }
    else if (entropy < 90) { cls = "good"; text = captionMap[3][0]; pct = 75; }

    meter.className = "fill " + cls;
    meter.style.width = pct + "%";
    caption.textContent = `${t("strength")}: ${text}  ·  ~${Math.round(entropy)} bits`;
}

length.addEventListener("input", () => {
    lengthLabel.textContent = length.value;
    generate();
});
lengthLabel.textContent = length.value;

document.getElementById("generate").addEventListener("click", generate);
document.getElementById("copyOut").addEventListener("click", () => {
    if (output.textContent !== "—") copyText(output.textContent);
});
[up, low, dig, sym].forEach(cb => cb.addEventListener("change", generate));

generate();

window.onLangChange = () => strength(charset().length, parseInt(length.value));