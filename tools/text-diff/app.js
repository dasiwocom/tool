/* Text Diff — Myers O(ND) line diff */
const oldText = document.getElementById("oldText");
const newText = document.getElementById("newText");
const diffBtn = document.getElementById("diffBtn");
const out = document.getElementById("out");

/* Myers diff: return ops of {type:'eq'|'del'|'ins', line} for old/new alignment */
function myers(a, b) {
    const n = a.length, m = b.length;
    if (n + m > 20000) throw new Error("too-large");
    const max = n + m;
    const v = new Int32Array(2 * max + 1);
    const trace = [];
    let offset = max;
    v[offset + 1] = 0;
    let found = -1, d;
    outer:
    for (d = 0; d <= max; d++) {
        const snapshot = new Int32Array(v);
        trace.push(snapshot);
        for (let k = -d; k <= d; k += 2) {
            let x;
            if (k === -d || (k !== d && v[offset + k - 1] < v[offset + k + 1])) {
                x = v[offset + k + 1];
            } else {
                x = v[offset + k - 1] + 1;
            }
            let y = x - k;
            while (x < n && y < m && a[x] === b[y]) { x++; y++; }
            v[offset + k] = x;
            if (x >= n && y >= m) { found = d; break outer; }
        }
    }
    const ops = [];
    let x = n, y = m;
    for (d = found; d > 0; d--) {
        const prev = trace[d];
        const k = x - y;
        const prevK = (k === -d || (k !== d && prev[offset + k - 1] < prev[offset + k + 1])) ? k + 1 : k - 1;
        const prevX = prev[offset + prevK];
        const prevY = prevX - prevK;
        while (x > prevX && y > prevY) { ops.push({ t: 0, l: a[x - 1] }); x--; y--; }
        if (x === prevX) { ops.push({ t: 2, l: b[y - 1] }); y--; }
        else { ops.push({ t: 1, l: a[x - 1] }); x--; }
    }
    while (x > 0 && y > 0) { ops.push({ t: 0, l: a[x - 1] }); x--; y--; }
    while (x > 0) { ops.push({ t: 1, l: a[x - 1] }); x--; }
    while (y > 0) { ops.push({ t: 2, l: b[y - 1] }); y--; }
    ops.reverse();
    return ops;
}

function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function lineHtml(l, type) {
    const cls = type === 0 ? "deq" : type === 1 ? "ddel" : "dins";
    const sign = type === 0 ? " " : type === 1 ? "-" : "+";
    return `<div class="dl ${cls}"><span class="ds">${sign}</span><span class="dt">${esc(l) || "&nbsp;"}</span></div>`;
}

diffBtn.addEventListener("click", () => {
    const a = oldText.value.replace(/\r\n?/g, "\n").split("\n");
    const b = newText.value.replace(/\r\n?/g, "\n").split("\n");
    if (a.length === 1 && a[0] === "" && b.length === 1 && b[0] === "") {
        out.innerHTML = "<div class='dl deq'><span class='ds'> </span><span class='dt'>OK</span></div>";
        return;
    }
    let ops;
    try {
        ops = myers(a, b);
    } catch (e) {
        showToast(t("diffTooBig") || "Input too large");
        return;
    }
    let html = "";
    let ins = 0, del = 0;
    const wrap = ops.length < 2000;
    for (const op of ops) {
        if (op.t === 1) del++;
        if (op.t === 2) ins++;
        html += lineHtml(op.l, op.t);
    }
    if (wrap) out.innerHTML = html;
    else out.textContent = ops.map(o => (o.t === 1 ? "-" : o.t === 2 ? "+" : " ") + " " + o.l).join("\n");
});