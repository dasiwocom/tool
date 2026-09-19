/* PDF to Word */
if (!window.pdfjsLib) {
    const el = document.getElementById("alert");
    if (el) {
        el.textContent = "PDF engine failed to load - please use a modern browser / PDF 引擎加载失败，请使用新版浏览器";
        el.classList.add("show");
    }
}
pdfjsLib.GlobalWorkerOptions.workerSrc = "../../vendor/pdf.worker.min.js?v=20260919v";

/* ---------- DOM ---------- */
const pdfFile = document.getElementById("pdfFile");
const p2wBtn = document.getElementById("p2wBtn");
const alertBox = document.getElementById("alert");
const resultBox = document.getElementById("resultBox");
const pgCount = document.getElementById("pgCount");
const docSize = document.getElementById("docSize");
const dlBtn = document.getElementById("dlBtn");

let dblob = null;

function showAlert(msg) { alertBox.textContent = msg; alertBox.classList.add("show"); }
function hideAlert() { alertBox.classList.remove("show"); }

function formatSize(b) {
    if (b < 1024) return b + " B";
    if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
    return (b / 1048576).toFixed(2) + " MB";
}

function download(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function baseName(f) {
    return (f.name || "document").replace(/\.pdf$/i, "");
}

/* ---------- helpers for building .docx ---------- */
function escXml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const CONTENT_TYPES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Default Extension="png" ContentType="image/png"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`;

const ROOT_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`;

const DOC_RELS_EMPTY = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>`;

const STYLES_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/>
    <w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="22"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Title">
    <w:name w:val="Title"/>
    <w:basedOn w:val="Normal"/>
    <w:pPr><w:spacing w:after="240"/></w:pPr>
    <w:rPr><w:b/><w:sz w:val="34"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/><w:basedOn w:val="Normal"/>
    <w:pPr><w:spacing w:before="240" w:after="120"/></w:pPr>
    <w:rPr><w:b/><w:sz w:val="30"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="heading 2"/><w:basedOn w:val="Normal"/>
    <w:pPr><w:spacing w:before="200" w:after="100"/></w:pPr>
    <w:rPr><w:b/><w:sz w:val="26"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading3">
    <w:name w:val="heading 3"/><w:basedOn w:val="Normal"/>
    <w:pPr><w:spacing w:before="160" w:after="80"/></w:pPr>
    <w:rPr><w:b/><w:sz w:val="24"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading4">
    <w:name w:val="heading 4"/><w:basedOn w:val="Normal"/>
    <w:pPr><w:spacing w:before="120" w:after="60"/></w:pPr>
    <w:rPr><w:b/><w:i/><w:sz w:val="22"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading5">
    <w:name w:val="heading 5"/><w:basedOn w:val="Normal"/>
    <w:pPr><w:spacing w:before="100" w:after="60"/></w:pPr>
    <w:rPr><w:i/><w:sz w:val="22"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading6">
    <w:name w:val="heading 6"/><w:basedOn w:val="Normal"/>
    <w:pPr><w:spacing w:before="80" w:after="60"/></w:pPr>
    <w:rPr><w:i/><w:sz w:val="20"/></w:rPr>
  </w:style>
</w:styles>`;

function coreXml(name) {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>${escXml(name)}</dc:title>
  <dc:creator>ToolBox</dc:creator>
  <dcterms:created xsi:type="dcterms:W3CDTF">2026-09-19T00:00:00Z</dcterms:created>
</cp:coreProperties>`;
}

const APP_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>ToolBox</Application>
  <DocSecurity>0</DocSecurity>
  <ScaleCrop>false</ScaleCrop>
  <Company>ToolBox</Company>
  <Lines>0</Lines>
  <Paragraphs>0</Paragraphs>
</Properties>`;

const DOC_NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" '
    + 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" '
    + 'xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" '
    + 'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" '
    + 'xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"';

const SECT_PR = `<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr>`;

function paragraph(text) {
    return `<w:p><w:pPr><w:spacing w:line="288" w:lineRule="auto"/></w:pPr><w:r><w:t xml:space="preserve">${escXml(text)}</w:t></w:r></w:p>`;
}

function titleParagraph(text) {
    return `<w:p><w:pPr><w:pStyle w:val="Title"/></w:pPr><w:r><w:t xml:space="preserve">${escXml(text)}</w:t></w:r></w:p>`;
}

const PAGE_BREAK_PARA = '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';

function imageParagraph(image, rid, n) {
    const contentWpt = 595.27 - 144;
    const contentHpt = 841.89 - 144;
    const scale = Math.min(1, contentWpt / image.width, contentHpt / image.height);
    const cx = Math.round(image.width * scale * 12700);
    const cy = Math.round(image.height * scale * 12700);
    return `<w:p>
  <w:r>
    <w:drawing>
      <wp:inline distT="0" distB="0" distL="0" distR="0">
        <wp:extent cx="${cx}" cy="${cy}"/>
        <wp:effectExtent l="0" t="0" r="0" b="0"/>
        <wp:docPr id="${n}" name="page${n}"/>
        <wp:cNvGraphicFramePr><a:graphicFrameLocks noChangeAspect="1"/></wp:cNvGraphicFramePr>
        <a:graphic>
          <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
            <pic:pic>
              <pic:nvPicPr>
                <pic:cNvPr id="${n}" name="page${n}"/>
                <pic:cNvPicPr/>
              </pic:nvPicPr>
              <pic:blipFill>
                <a:blip r:embed="${rid}" cstate="print"/>
                <a:stretch><a:fillRect/></a:stretch>
              </pic:blipFill>
              <pic:spPr>
                <a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm>
                <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
              </pic:spPr>
            </pic:pic>
          </a:graphicData>
        </a:graphic>
      </wp:inline>
    </w:drawing>
  </w:r>
</w:p>`;
}

async function buildDocx(name, lines, images) {
    const zip = new JSZip();
    zip.file("[Content_Types].xml", CONTENT_TYPES);
    zip.file("_rels/.rels", ROOT_RELS);
    zip.file("docProps/core.xml", coreXml(name));
    zip.file("docProps/app.xml", APP_XML);
    zip.file("word/styles.xml", STYLES_XML);

    let body = titleParagraph(name);
    if (images && images.length) {
        const mediaBuffers = await Promise.all(images.map(img => img.blob.arrayBuffer()));
        const docRels = ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'];
        images.forEach((img, i) => {
            const rid = "rIdImg" + (i + 1);
            docRels.push(`<Relationship Id="${rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/page${i + 1}.png"/>`);
            body += imageParagraph(img, rid, i + 1) + PAGE_BREAK_PARA;
        });
        docRels.push("</Relationships>");
        zip.file("word/_rels/document.xml.rels", docRels.join("\n"));
        images.forEach((img, i) => zip.file(`word/media/page${i + 1}.png`, mediaBuffers[i]));
    } else {
        zip.file("word/_rels/document.xml.rels", DOC_RELS_EMPTY);
        (lines || []).forEach((pageLines, i) => {
            if (i > 0) body += PAGE_BREAK_PARA;
            for (const ln of pageLines) {
                if (!ln.trim()) continue;
                body += paragraph(ln);
            }
        });
    }

    const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document ${DOC_NS}><w:body>${body}${SECT_PR}</w:body></w:document>`;
    zip.file("word/document.xml", documentXml);
    return zip.generateAsync({ type: "blob" });
}

async function extractPageLines(pdf) {
    const pages = [];
    for (let n = 1; n <= pdf.numPages; n++) {
        const page = await pdf.getPage(n);
        const tc = await page.getTextContent();
        const groups = [];
        for (const it of tc.items) {
            if (!it.str || !it.str.trim()) continue;
            const y = it.transform[5];
            const x = it.transform[4];
            const h = it.height || 11;
            const w = it.width || (it.str.length * h * 0.5);
            let g = null;
            for (let i = groups.length - 1; i >= 0; i--) {
                const gr = groups[i];
                if (Math.abs(gr.y - y) <= Math.max(h, gr.h) * 0.55) { g = gr; break; }
            }
            if (!g) { g = { y, h, parts: [] }; groups.push(g); }
            g.parts.push({ x, w, s: it.str });
        }
        groups.sort((a, b) => a.y - b.y);
        pages.push(groups.map(g => {
            g.parts.sort((a, b) => a.x - b.x);
            let s = "";
            let prevEnd = null;
            for (const p of g.parts) {
                if (prevEnd != null && (p.x - prevEnd) > Math.max(2, g.h * 0.18) && !/^\s/.test(p.s)) s += " ";
                s += p.s;
                prevEnd = p.x + p.w;
            }
            return s;
        }));
    }
    return pages;
}

async function renderPagesToImages(pdf) {
    const images = [];
    for (let n = 1; n <= pdf.numPages; n++) {
        const page = await pdf.getPage(n);
        const vp = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.floor(vp.width));
        canvas.height = Math.max(1, Math.floor(vp.height));
        await page.render({ canvasContext: canvas.getContext("2d"), viewport: vp }).promise;
        const blob = await new Promise(res => canvas.toBlob(res, "image/png"));
        if (!blob) continue;
        images.push({ blob, width: vp.width, height: vp.height });
    }
    return images;
}

pdfFile.addEventListener("change", () => { resultBox.hidden = true; hideAlert(); });

p2wBtn.addEventListener("click", async () => {
    const src = pdfFile.files && pdfFile.files[0];
    if (!src) { showToast(t("pdfErr")); return; }
    p2wBtn.disabled = true;
    try {
        const buf = await src.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
        const totalPages = pdf.numPages;
        const mode = document.querySelector('input[name="pwMode"]:checked').value;

        let images = null;
        let lines = null;
        if (mode === "image") {
            images = await renderPagesToImages(pdf);
        } else {
            lines = await extractPageLines(pdf);
            if (!lines.length || lines.every(p => p.every(l => !l.trim()))) {
                pdf.destroy();
                showAlert(t("pwEmptyPdf"));
                return;
            }
        }
        pdf.destroy();

        const name = baseName(src);
        dblob = await buildDocx(name, lines, images);
        pgCount.textContent = totalPages;
        docSize.textContent = formatSize(dblob.size);
        resultBox.hidden = false;
        hideAlert();
        showToast(t("pwReady"));
    } catch (e) {
        showAlert(t("pdfErr"));
    } finally {
        p2wBtn.disabled = false;
    }
});

dlBtn.addEventListener("click", () => {
    if (dblob) download(dblob, baseName(pdfFile.files && pdfFile.files[0]) + ".docx");
});

window.onLangChange = function () {};