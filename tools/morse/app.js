const MORSE = {
    'A':'.-','B':'-...','C':'-.-.','D':'-..','E':'.','F':'..-.','G':'--.','H':'....','I':'..','J':'.---',
    'K':'-.-','L':'.-..','M':'--','N':'-.','O':'---','P':'.--.','Q':'--.-','R':'.-.','S':'...','T':'-',
    'U':'..-','V':'...-','W':'.--','X':'-..-','Y':'-.--','Z':'--..',
    '0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....',
    '6':'-....','7':'--...','8':'---..','9':'----.',
    '.':'.-.-.-',',':'--..--','?':'..--..','!':'-.-.--','/':'-..-.','(': '-.--.',')':'-.--.-',
    '&':'.-...',':':'---...',';':'-.-.-.','=':'-...-','+':'.-.-.','-':'-....-','_':'..--.-',
    '"':'.-..-.',"'":'.----.','$':'...-..-','@':'.--.-.'
};
const REV = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));

const input = document.getElementById("input");
const output = document.getElementById("output");
const segBtns = document.querySelectorAll("#direction button");

segBtns.forEach(btn => btn.addEventListener("click", () => {
    segBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
}));

document.getElementById("convert").addEventListener("click", () => {
    const mode = document.querySelector("#direction .active").dataset.mode;
    if (!input.value) { output.value = ""; return; }
    if (mode === "encode") {
        output.value = input.value.toUpperCase().split("").map(ch => {
            if (ch === " ") return "/";
            return MORSE[ch] || "?";
        }).filter(Boolean).join(" ");
    } else {
        output.value = input.value.trim().split(/\s*\/\s*/).map(word =>
            word.split(/\s+/).map(code => REV[code] || "?").join("")
        ).join(" ");
    }
});

document.getElementById("copyOut").addEventListener("click", () => {
    if (output.value) copyText(output.value);
});

window.onLangChange = () => {};