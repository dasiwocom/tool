/* Home page: search filter + keyboard shortcut */
const search = document.getElementById("search");
const cards = [...document.querySelectorAll(".tool-card")];

search.addEventListener("input", () => {
    const q = search.value.trim().toLowerCase();
    let any = false;
    cards.forEach(card => {
        const key = card.dataset.tool;
        const ns = [key, t(key).toLowerCase(), t(key + "Desc").toLowerCase()];
        const visible = !q || ns.some(v => v.includes(q) || v.replace(/\s/g, "").includes(q.replace(/\s/g, "")));
        card.classList.toggle("hidden", !visible);
        if (visible) any = true;
    });
    let noRes = document.querySelector(".no-results");
    if (!any && q) {
        if (!noRes) {
            noRes = document.createElement("div");
            noRes.className = "no-results";
            document.querySelector("#grid").appendChild(noRes);
        }
        noRes.textContent = t("noResults");
    } else if (noRes) {
        noRes.remove();
    }
});

document.addEventListener("keydown", e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        search.focus();
    }
});