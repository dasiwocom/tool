const input = document.getElementById("input");
const output = document.getElementById("output");
const alertBox = document.getElementById("alert");

function showAlert(msg) { alertBox.textContent = msg; alertBox.classList.add("show"); }
function hideAlert() { alertBox.classList.remove("show"); }

const td = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    emDelimiter: "*",
    bulletListMarker: "-",
    hr: "---"
});
td.use(turndownPluginGfm.gfm);
td.remove(["script", "style", "noscript", "template", "meta", "link"]);

const SAMPLE = `<h1>Getting Started</h1>
<p>Welcome to the <strong>HTML to Markdown</strong> converter. It keeps <a href="https://example.com">links</a> and <code>inline code</code> intact.</p>
<h2>Features</h2>
<ul>
  <li>Headings</li>
  <li>Lists with <em>emphasis</em></li>
  <li>Tables</li>
</ul>
<ol>
  <li>First</li>
  <li>Second</li>
</ol>
<blockquote><p>This is a blockquote.</p></blockquote>
<pre><code class="language-js">const a = 1;
console.log(a);</code></pre>
<h2>Pricing</h2>
<table>
  <thead><tr><th>Plan</th><th>Price</th></tr></thead>
  <tbody>
    <tr><td>Basic</td><td>$0</td></tr>
    <tr><td>Pro</td><td>$9</td></tr>
  </tbody>
</table>
<hr>
<p>Done — <s>old</s>, <u>new</u>, and <mark>marked</mark>.</p>`;

document.getElementById("example").addEventListener("click", () => { input.value = SAMPLE; });

document.getElementById("convert").addEventListener("click", () => {
    if (!input.value.trim()) { output.value = ""; return; }
    try {
        output.value = td.turndown(input.value);
        hideAlert();
    } catch (e) {
        showAlert(e.message);
        output.value = "";
    }
});

document.getElementById("copyOut").addEventListener("click", () => {
    if (output.value) copyText(output.value);
});

window.onLangChange = () => {};