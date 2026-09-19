/* Word to PDF (render .docx into a printable preview) */
const docxFile = document.getElementById("docxFile");
const previewShell = document.getElementById("previewShell");
const docPreview = document.getElementById("docPreview");
const printBtn = document.getElementById("printBtn");
const alertBox = document.getElementById("alert");

function showAlert(msg) { alertBox.textContent = msg; alertBox.classList.add("show"); }
function hideAlert() { alertBox.classList.remove("show"); }

function getChildren(el, name) { return [...el.children].filter(c => c.localName === name); }
function getChild(el, name) { return getChildren(el, name)[0] || null; }
function wVal(el) { return el ? el.getAttribute("w:val") || el.getAttribute("val") || "" : ""; }
function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function hasValTrue(el) {
    if (!el) return false;
    const v = el.getAttribute("w:val");
    return v == null || v === "" || v === "true" || v === "1";
}

function runStyle(rPr) {
    const st = { b: false, i: false, u: false, s: false, color: "", size: "", hl: "", sup: false, sub: false };
    if (!rPr) return st;
    st.b = hasValTrue(getChild(rPr, "b"));
    st.i = hasValTrue(getChild(rPr, "i")) || hasValTrue(getChild(rPr, "iCs"));
    st.u = hasValTrue(getChild(rPr, "u"));
    st.s = hasValTrue(getChild(rPr, "strike")) || hasValTrue(getChild(rPr, "dstrike"));
    const c = getChild(rPr, "color"); if (c) st.color = wVal(c);
    const sz = getChild(rPr, "sz"); if (sz) { const v = +wVal(sz); if (v) st.size = Math.round(v / 2) + "pt"; }
    const h = getChild(rPr, "highlight"); if (h) st.hl = wVal(h);
    const va = getChild(rPr, "vertAlign");
    if (va) { const v = wVal(va); if (v === "superscript") st.sup = true; else if (v === "subscript") st.sub = true; }
    return st;
}

function applyRunStyle(html, st) {
    let s = "";
    if (st.color) s += "color:" + st.color + ";";
    if (st.size) s += "font-size:" + st.size + ";";
    if (st.hl) s += "background-color:" + st.hl + ";";
    if (s) html = `<span style="${s}">${html}</span>`;
    if (st.b) html = "<strong>" + html + "</strong>";
    if (st.i) html = "<em>" + html + "</em>";
    if (st.u) html = "<u>" + html + "</u>";
    if (st.s) html = "<s>" + html + "</s>";
    if (st.sup) html = "<sup>" + html + "</sup>";
    if (st.sub) html = "<sub>" + html + "</sub>";
    return html;
}

function imageHtml(runEl, ctx) {
    const blip = runEl.getElementsByTagName("a:blip")[0] || runEl.getElementsByTagName("v:imagedata")[0];
    const rid = blip ? (blip.getAttribute("r:embed") || blip.getAttribute("r:id") || "") : "";
    const url = ctx.medias[rid];
    if (!url) return "";
    let sz = "";
    const ext = runEl.getElementsByTagName("wp:extent")[0];
    if (ext) {
        const cx = +ext.getAttribute("cx");
        const cy = +ext.getAttribute("cy");
        if (cx && cy) sz = `width:${Math.round(cx / 9525)}px;`;
    }
    return `<img src="${url}" alt="" style="max-width:100%;${sz}height:auto;">`;
}

function renderRuns(el, ctx) {
    let inner = "";
    for (const node of el.childNodes) {
        if (node.nodeType !== 1) continue;
        const ln = node.localName;
        if (ln === "r") {
            const st = runStyle(getChild(node, "rPr"));
            let t = "";
            let drawing = "";
            for (const rc of node.children) {
                const rl = rc.localName;
                if (rl === "t") t += rc.textContent;
                else if (rl === "tab") t += "\t";
                else if (rl === "br") { if (rc.getAttribute("w:type") === "page") t += "\u0000PAGE"; else t += "\n"; }
                else if (rl === "cr") t += "\n";
                else if (rl === "noBreakHyphen") t += "-";
                else if (rl === "drawing" || rl === "pict") drawing += imageHtml(rc, ctx);
            }
            if (t) {
                t = t.replace(/\u0000PAGE/g, "");
                t = t.replace(/\t/g, "\u2003\u2003").replace(/\n/g, "<br>");
                inner += applyRunStyle(escapeHtml(t), st);
            }
            inner += drawing;
        } else if (ln === "hyperlink") {
            const rid = node.getAttribute("r:id");
            const anchor = node.getAttribute("w:anchor");
            let innerLink = renderRuns(node, ctx);
            if (rid && ctx.rels[rid]) {
                const r = ctx.rels[rid];
                if (r.mode === "External") {
                    innerLink = `<a href="${escapeHtml(r.target)}" target="_blank" rel="noopener">${innerLink}</a>`;
                }
            } else if (anchor) {
                innerLink = `<a href="#${escapeHtml(anchor)}">${innerLink}</a>`;
            }
            inner += innerLink;
        }
    }
    return inner;
}

function hasPageBreak(el) {
    if (!el) return false;
    if (el.localName === "br" && el.getAttribute("w:type") === "page") return true;
    for (const c of el.children) if (hasPageBreak(c)) return true;
    return false;
}

function listInfo(pPr, ctx) {
    if (!pPr) return { prefix: "", margin: 0 };
    const numPr = getChild(pPr, "numPr");
    if (!numPr) return { prefix: "", margin: 0 };
    const numIdEl = getChild(numPr, "numId");
    if (!numIdEl) return { prefix: "", margin: 0 };
    const numId = wVal(numIdEl);
    const ilvlEl = getChild(numPr, "ilvl");
    const il = ilvlEl ? (+wVal(ilvlEl) || 0) : 0;
    const fmt = ((ctx.numMap || {})[numId] || {})[il] || "decimal";
    ctx.seq[numId + "|" + il] = (ctx.seq[numId + "|" + il] || 0) + 1;
    if (/bullet/i.test(fmt)) {
        return { prefix: (il % 2 ? "–" : "•") + " ", margin: 18 * (il + 1) };
    }
    return { prefix: ctx.seq[numId + "|" + il] + ". ", margin: 18 * (il + 1) };
}

function headingLevel(pPr, styles) {
    if (!pPr) return 0;
    const lvl = getChild(pPr, "outlineLvl");
    if (lvl) {
        const v = +wVal(lvl);
        if (!isNaN(v)) return Math.min(Math.max(v + 1, 1), 6);
    }
    const ps = getChild(pPr, "pStyle");
    if (!ps) return 0;
    const sid = wVal(ps);
    const nm = (styles[sid] && styles[sid].name) || sid || "";
    const m = nm.match(/heading\s*(\d+)/i) || nm.match(/标题\s*(\d+)/);
    if (m) return Math.min(Math.max(+m[1], 1), 6);
    if (/^(heading|title|标题)\s*$/i.test(nm)) return 1;
    return 0;
}

function renderParagraph(pEl, ctx) {
    const pPr = getChild(pEl, "pPr");
    let inner = renderRuns(pEl, ctx);
    const pb = hasPageBreak(pEl);
    if (!inner.trim()) {
        if (pb) return '<div style="page-break-before:always;"></div>';
        return "";
    }

    const h = headingLevel(pPr, ctx.styles);
    const tag = h ? "h" + h : "p";

    const li = listInfo(pPr, ctx);
    let style = "";
    if (li.prefix) style += "margin-left:" + li.margin + "px;";
    const jc = pPr && getChild(pPr, "jc");
    if (jc) {
        const v = wVal(jc);
        if (v === "center" || v === "right" || v === "both") style += "text-align:" + v + ";";
    }
    if (pb) style += "page-break-before:always;";

    const prefix = li.prefix ? `<span style="margin-right:6px;">${escapeHtml(li.prefix)}</span>` : "";
    return `<${tag}${style ? ` style="${style}"` : ""}>${prefix}${inner}</${tag}>`;
}

function renderTable(tbl, ctx) {
    const out = ["<table><tbody>"];
    for (const tr of getChildren(tbl, "tr")) {
        out.push("<tr>");
        for (const tc of getChildren(tr, "tc")) {
            const tcPr = getChild(tc, "tcPr");
            let span = 1;
            if (tcPr) {
                const gs = getChild(tcPr, "gridSpan");
                if (gs) { const v = +wVal(gs); if (v) span = v; }
            }
            const cell = [];
            walkBlocks(tc, cell, ctx);
            out.push(`<td colspan="${span}">${cell.join("") || "&nbsp;"}</td>`);
        }
        out.push("</tr>");
    }
    out.push("</tbody></table>");
    return out.join("");
}

function walkBlocks(container, out, ctx) {
    for (const el of container.children) {
        if (el.nodeType !== 1) continue;
        switch (el.localName) {
            case "p": {
                const h = renderParagraph(el, ctx);
                if (h) out.push(h);
                break;
            }
            case "tbl": out.push(renderTable(el, ctx)); break;
            case "sdt": {
                const c = getChild(el, "sdtContent");
                if (c) walkBlocks(c, out, ctx);
                break;
            }
        }
    }
}

function guessMime(target) {
    const base = target.toLowerCase();
    if (base.endsWith(".jpg") || base.endsWith(".jpeg")) return "image/jpeg";
    if (base.endsWith(".gif")) return "image/gif";
    if (base.endsWith(".svg")) return "image/svg+xml";
    if (base.endsWith(".webp")) return "image/webp";
    if (base.endsWith(".bmp")) return "image/bmp";
    return "image/png";
}

async function parseNumbering(zip) {
    const e = zip.file("word/numbering.xml");
    if (!e) return {};
    const xml = await e.async("string");
    if (!xml) return {};
    const doc = new DOMParser().parseFromString(xml, "application/xml");
    const abstract = {};
    for (const an of getChildren(doc.documentElement, "abstractNum")) {
        const id = an.getAttribute("w:abstractNumId");
        const fmts = {};
        for (const lvl of getChildren(an, "lvl")) {
            const ilvl = +(lvl.getAttribute("w:ilvl") || 0);
            const nf = getChild(lvl, "numFmt");
            fmts[ilvl] = nf ? wVal(nf) || "decimal" : "decimal";
        }
        abstract[id] = fmts;
    }
    const num = {};
    for (const n of getChildren(doc.documentElement, "num")) {
        const numId = n.getAttribute("w:numId");
        const absId = getChild(n, "abstractNumId");
        num[numId] = (absId && abstract[wVal(absId)]) || {};
    }
    return num;
}

async function parseStylesMap(zip) {
    const e = zip.file("word/styles.xml");
    if (!e) return {};
    const xml = await e.async("string");
    if (!xml) return {};
    const doc = new DOMParser().parseFromString(xml, "application/xml");
    const map = {};
    for (const st of getChildren(doc.documentElement, "style")) {
        const id = st.getAttribute("w:styleId");
        const nm = getChild(st, "name");
        map[id] = nm ? nm.getAttribute("w:val") || id : id;
    }
    return map;
}

async function renderDocxToHtml(buffer) {
    const zip = await JSZip.loadAsync(buffer);
    const docEntry = zip.file("word/document.xml");
    if (!docEntry) throw new Error("no-doc");
    const xml = await docEntry.async("string");
    const doc = new DOMParser().parseFromString(xml, "application/xml");

    const rels = {};
    const relsEntry = zip.file("word/_rels/document.xml.rels");
    if (relsEntry) {
        const rxml = await relsEntry.async("string");
        const rdoc = new DOMParser().parseFromString(rxml, "application/xml");
        for (const rel of getChildren(rdoc.documentElement, "Relationship")) {
            rels[rel.getAttribute("Id")] = {
                target: rel.getAttribute("Target") || "",
                mode: rel.getAttribute("TargetMode") || "Internal"
            };
        }
    }

    /* collect referenced media and load as data URLs */
    const targets = {};
    const blips = [];
    try {
        blips.push(...doc.getElementsByTagName("a:blip"));
        const vimgs = doc.getElementsByTagName("v:imagedata") || [];
        for (const im of vimgs) blips.push(im);
    } catch (e) { /* some docs have no drawings */ }

    for (const b of blips) {
        const rid = b.getAttribute("r:embed") || b.getAttribute("r:id") || "";
        if (rid && rels[rid] && !targets[rid]) targets[rid] = rels[rid].target;
    }
    const medias = {};
    await Promise.all(Object.entries(targets).map(async ([rid, target]) => {
        const path = "word/" + (target || "").replace(/^\.\.\//, "");
        const entry = zip.file(path);
        if (!entry) return;
        try {
            const b64 = await entry.async("base64");
            medias[rid] = "data:" + guessMime(target || "") + ";base64," + b64;
        } catch (e) { /* skip broken media */ }
    }));

    const ctx = {
        rels, medias,
        styles: await parseStylesMap(zip),
        numMap: await parseNumbering(zip),
        seq: {}
    };
    const out = [];
    const body = getChild(doc.documentElement, "body");
    if (body) walkBlocks(body, out, ctx);
    return out.join("\n");
}

docxFile.addEventListener("change", async () => {
    const src = docxFile.files && docxFile.files[0];
    previewShell.hidden = true;
    hideAlert();
    if (!src) return;
    docxFile.disabled = true;
    try {
        const buf = await src.arrayBuffer();
        const html = await renderDocxToHtml(buf);
        docPreview.innerHTML = html || "<p style=\"color:#999\"></p>";
        previewShell.hidden = false;
        showToast(t("pwPreviewReady"));
    } catch (e) {
        showAlert(t("pwErrDocx"));
    } finally {
        docxFile.disabled = false;
    }
});

printBtn.addEventListener("click", () => window.print());

window.onLangChange = function () {
    /* list counters are reset per conversion; nothing to re-render here */
};