#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ToolBox blog builder.

Data layout (all under blog/_posts/):
  posts.json            metadata: slug, tool, date, titles, descs
  <slug>.zh.html        Chinese article body (HTML)
  <slug>.en.html        English article body (HTML)

Generates:
  blog/<slug>/index.html   standalone SEO post page (unique title/desc/H1)
  blog/index.html          post listing (preserves header/footer chrome elsewhere)

Run:  python3 blog/build.py
To add a post: add an entry to posts.json + write the two body files, then re-run.
"""

import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BLOG = os.path.join(ROOT, "blog")
POSTS = os.path.join(BLOG, "_posts")
VERSION = "20260919u"

PRE = """<script>
(function(){try{
  var t=localStorage.getItem("toolbox-theme");
  var l=localStorage.getItem("toolbox-lang");
  var d=document.documentElement;
  if(t==="dark"){d.setAttribute("data-theme","dark")}
  if(l==="en"||l==="zh"){d.setAttribute("lang",l)}
  if(l!=="en"){d.classList.add("i18n-pending")}
}catch(e){}})();
setTimeout(function(){try{document.documentElement.classList.remove("i18n-pending")}catch(e){}},1500);
</script>"""

FAVICON = ("<link rel=\"icon\" href=\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' "
           "viewBox='0 0 32 32'><rect x='5' y='5' width='22' height='22' rx='6' fill='%230071e3'/></svg>\">")


def chrome(rel):
    """Header/footer/drawer templates. rel is the relative prefix to site root."""
    return {
        "head": f"""<!DOCTYPE html>
<html lang="zh" data-theme="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
{PRE}
<title>{{TITLE}} · ToolBox</title>
<meta name="description" content="{{DESC}}">
{FAVICON}
<script src="{rel}core.js?v={VERSION}"></script>
<link rel="stylesheet" href="{rel}styles.css?v={VERSION}">
</head>
<body>

<header class="site-header">
    <div class="header-inner">
        <a class="brand" href="{rel}index.html">
            <span data-i18n="siteName">ToolBox</span>
        </a>
        <nav class="site-nav">
            <a href="{rel}index.html" data-i18n="home">Home</a>
            <a href="{rel}changelog/index.html" data-i18n="changelog">Changelog</a>
            <a href="{rel}download/index.html" data-i18n="download">Download</a>
            <a href="{rel}blog/index.html" class="active" data-i18n="blog">Blog</a>
            <a href="{rel}contact/index.html" data-i18n="contact">Contact</a>
        </nav>
        <div class="header-actions">
            <button id="langToggle" class="icon-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3.5 12h17M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z"/></svg>
                <span class="btn-label">English</span>
            </button>
            <button id="themeToggle" class="icon-btn"><span id="themeIcon"></span></button>
            <button id="menuToggle" class="icon-btn menu-btn" aria-label="Menu" aria-expanded="false" data-i18n-title="menu" title="Menu">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16M4 12h16M4 20h16"/></svg>
                <span class="btn-label"></span>
            </button>
        </div>
    </div>
</header>
""",
        "foot": f"""
<footer class="site-footer">
    <div class="footer-inner">
        <div class="footer-grid">
            <div class="footer-col footer-brand-col">
                <div class="footer-brand"><span data-i18n="siteName">ToolBox</span></div>
                <p class="footer-tagline" data-i18n="footer">All processing happens in your browser</p>
                <div class="footer-friend">
                    <a href="#" aria-label="GitHub"><svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg></a>
                    <a href="#" aria-label="Twitter"><svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg></a>
                    <a href="#" aria-label="RSS"><svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg></a>
                </div>
            </div>
            <div class="footer-col">
                <h4 data-i18n="footerTools">Popular tools</h4>
                <a href="{rel}tools/json/index.html">JSON</a>
                <a href="{rel}tools/base64/index.html">Base64</a>
                <a href="{rel}tools/url/index.html">URL</a>
                <a href="{rel}tools/qr/index.html">QR</a>
                <a href="{rel}tools/uuid/index.html">UUID</a>
            </div>
            <div class="footer-col">
                <h4 data-i18n="friendsTitle">Friends</h4>
                <a href="#">Dasiwo</a>
                <a href="#">Eine</a>
                <a href="#">MDN</a>
            </div>
            <div class="footer-col">
                <h4 data-i18n="legal">Legal</h4>
                <a href="#" data-i18n="privacy">Privacy Policy</a>
                <a href="#" data-i18n="terms">Terms of Service</a>
            </div>
        </div>
        <div class="footer-bottom">
            <p class="footer-note">© 2026 ToolBox</p>
        </div>
    </div>
</footer>
<div class="toast" id="toast"></div>
<div class="drawer" id="drawer" aria-hidden="true">
    <div class="drawer-backdrop" data-close-drawer></div>
    <div class="drawer-panel" role="dialog" aria-modal="true" aria-label="Menu">
        <div class="drawer-head">
            <a class="brand" href="{rel}index.html">
                <span data-i18n="siteName">ToolBox</span>
            </a>
            <button class="drawer-close" data-close-drawer>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
            </button>
        </div>
        <nav class="drawer-nav">
            <a href="{rel}index.html" data-i18n="home">Home</a>
            <a href="{rel}changelog/index.html" data-i18n="changelog">Changelog</a>
            <a href="{rel}download/index.html" data-i18n="download">Download</a>
            <a href="{rel}blog/index.html" class="active" data-i18n="blog">Blog</a>
            <a href="{rel}contact/index.html" data-i18n="contact">Contact</a>
        </nav>
        <div class="drawer-foot" data-i18n="footer"></div>
    </div>
</div>

</body>
</html>
""",
    }


def read_body(slug, lang):
    p = os.path.join(POSTS, f"{slug}.{lang}.html")
    if not os.path.exists(p):
        raise SystemExit(f"missing body: {p}")
    with open(p, encoding="utf8") as f:
        return f.read().strip()


def build_posts():
    with open(os.path.join(POSTS, "posts.json"), encoding="utf8") as f:
        posts = json.load(f)
    for p in posts:
        rel = "../../"
        c = chrome(rel)
        body_zh = read_body(p["slug"], "zh")
        body_en = read_body(p["slug"], "en")
        head = c["head"].replace("{TITLE}", p["title"]["zh"]).replace("{DESC}", p["desc"]["en"])
        html = (head
                + f"""
<main class="tool-page">
    <div class="tool-head">
        <nav class="breadcrumbs">
            <a href="../../blog/index.html" data-i18n="blog">Blog</a>
            <span class="crumb-sep">›</span>
            <span class="lang-zh">{p["title"]["zh"]}</span><span class="lang-en">{p["title"]["en"]}</span>
        </nav>
        <h1 class="lang-zh">{p["title"]["zh"]}</h1>
        <h1 class="lang-en">{p["title"]["en"]}</h1>
        <p class="post-meta">ToolBox Blog · {p["date"]}</p>
    </div>

    <section class="section">
        <article class="post-body">
            <div class="lang-zh">{body_zh}</div>
            <div class="lang-en">{body_en}</div>
        </article>
        <div class="post-cta">
            <a class="btn btn-primary" href="../../tools/{p["tool"]}/index.html"><span class="lang-en">Open the tool</span><span class="lang-zh">打开工具</span></a>
        </div>
    </section>
</main>
"""
                + c["foot"])
        outdir = os.path.join(BLOG, p["slug"])
        os.makedirs(outdir, exist_ok=True)
        with open(os.path.join(outdir, "index.html"), "w", encoding="utf8") as f:
            f.write(html)
        print("wrote", f"blog/{p['slug']}/index.html")
    return posts


def build_index(posts):
    cards = "\n".join(f"""
            <a class="tool-card post-card" href="{p['slug']}/index.html">
                <h3 class="lang-zh">{p['title']['zh']}</h3>
                <h3 class="lang-en">{p['title']['en']}</h3>
                <p class="post-card-desc lang-zh">{p['desc']['zh']}</p>
                <p class="post-card-desc lang-en">{p['desc']['en']}</p>
                <p class="post-card-meta">{p['date']} · Blog</p>
            </a>""" for p in posts)
    c = chrome("../")
    index = c["head"].replace("{TITLE}", "Blog").replace("{DESC}", "ToolBox blog — in-depth guides for every utility")
    index += f"""
<main class="tool-page">
    <div class="tool-head">
        <h1 data-i18n="blogTitle">Blog</h1>
        <p data-i18n="blogDesc">Notes, tutorials, and updates</p>
    </div>

    <section class="section">
        <div class="grid" id="blog-grid">
            {cards}
    </div>
    </section>
</main>
"""
    index += c["foot"]
    with open(os.path.join(BLOG, "index.html"), "w", encoding="utf8") as f:
        f.write(index)
    print("wrote blog/index.html")


if __name__ == "__main__":
    posts = build_posts()
    build_index(posts)