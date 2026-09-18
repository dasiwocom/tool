/* Image Slice */
const fileInput = document.getElementById("file");
const colsInput = document.getElementById("cols");
const rowsInput = document.getElementById("rows");
const sliceBtn = document.getElementById("sliceBtn");
const tileGrid = document.getElementById("tileGrid");

let img = null;

fileInput.addEventListener("change", () => {
    const f = fileInput.files && fileInput.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    img = new Image();
    img.onload = () => {
        tileGrid.innerHTML = "";
    };
    img.src = url;
});

sliceBtn.addEventListener("click", () => {
    if (!img) {
        showToast(t("noImage"));
        return;
    }
    const cols = Math.min(16, Math.max(1, parseInt(colsInput.value, 10) || 2));
    const rows = Math.min(16, Math.max(1, parseInt(rowsInput.value, 10) || 2));
    colsInput.value = cols;
    rowsInput.value = rows;

    const tw = Math.floor(img.naturalWidth / cols);
    const th = Math.floor(img.naturalHeight / rows);
    if (tw < 1 || th < 1) {
        showToast(t("noImage"));
        return;
    }

    tileGrid.innerHTML = "";
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const canvas = document.createElement("canvas");
            canvas.width = tw;
            canvas.height = th;
            canvas.getContext("2d").drawImage(img, c * tw, r * th, tw, th, 0, 0, tw, th);

            const a = document.createElement("a");
            a.href = canvas.toDataURL("image/png");
            a.download = `tile_${r + 1}_${c + 1}.png`;

            const thumb = document.createElement("canvas");
            thumb.className = "crop-thumb";
            thumb.style.cssText = "width:100%; height:auto; border-radius:6px; display:block; background:var(--surface-2);";
            const max = 280;
            const scale = Math.min(1, max / tw, max / th);
            thumb.width = Math.max(1, Math.round(tw * scale));
            thumb.height = Math.max(1, Math.round(th * scale));
            thumb.getContext("2d").drawImage(canvas, 0, 0, thumb.width, thumb.height);

            const cap = document.createElement("div");
            cap.className = "tile-cap";
            cap.textContent = `${r + 1},${c + 1}`;

            const cell = document.createElement("div");
            cell.style.cssText = "display:flex; flex-direction:column; gap:6px;";
            cell.appendChild(thumb);
            cell.appendChild(cap);
            a.appendChild(cell);
            tileGrid.appendChild(a);
        }
    }
});