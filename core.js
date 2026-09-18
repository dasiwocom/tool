/* ==========================================================
   ToolBox — shared app core (theme, language, i18n, helpers)
   Loaded on every page before the page-specific script.
   ========================================================== */

const I18N = {
    /* ---------- Global ---------- */
    siteName: { en: "ToolBox", zh: "工具箱" },
    tagline: { en: "Simple tools, crafted for developers.", zh: "为开发者打造的简洁工具集。" },
    home: { en: "Home", zh: "首页" },
    copied: { en: "Copied to clipboard", zh: "已复制到剪贴板" },
    copy: { en: "Copy", zh: "复制" },
    copyAll: { en: "Copy All", zh: "复制全部" },
    clear: { en: "Clear", zh: "清空" },
    close: { en: "Close", zh: "关闭" },

    heroTitle: { en: "Simple Tools for Developers", zh: "开发者常用工具" },
    heroDesc: {
        en: "A curated collection of tiny utilities. Everything runs locally in your browser — nothing is uploaded.",
        zh: "一组精挑细选的小工具。所有处理都在浏览器本地完成，数据不会上传。"
    },
    searchPlaceholder: { en: "Search tools…", zh: "搜索工具…" },
    noResults: { en: "No matching tools found", zh: "未找到匹配的工具" },
    footer: {
        en: "All processing happens in your browser · No data leaves your device",
        zh: "所有处理均在浏览器本地完成 · 数据不会离开您的设备"
    },
    selected: { en: "selected", zh: "已选择" },

    changelog: { en: "Changelog", zh: "更新日志" },
    changelogTitle: { en: "Changelog", zh: "更新日志" },
    changelogDesc: { en: "What's new in ToolBox", zh: "工具箱的更新记录" },
    latest: { en: "latest", zh: "最新" },

    download: { en: "Download", zh: "下载" },
    downloadTitle: { en: "Download ToolBox", zh: "下载工具箱" },
    downloadDesc: { en: "Desktop apps for Windows, macOS, and Linux", zh: "支持 Windows、macOS 与 Linux 的桌面应用" },
    dlAppTitle: { en: "ToolBox Desktop", zh: "工具箱桌面版" },
    dlAppDesc: {
        en: "A native desktop wrapper around the same tools, packaged for offline use.",
        zh: "基于同一套工具的桌面端封装，打包后可离线使用。"
    },
    dlComingSoon: { en: "Coming soon", zh: "即将推出" },
    dlNow: { en: "The desktop app is in development. For now, every tool already runs right here in your browser — nothing to install.", zh: "桌面端正在开发中。目前所有工具都可以直接在浏览器里使用，无需安装。" },

    /* ---------- Tool names & descriptions ---------- */
    json: { en: "JSON Formatter", zh: "JSON 格式化" },
    jsonDesc: { en: "Prettify, minify, and validate JSON", zh: "格式化、压缩与校验 JSON 数据" },
    base64: { en: "Base64 Encoder", zh: "Base64 编解码" },
    base64Desc: { en: "Encode and decode Base64 safely", zh: "安全地编码和解码 Base64 字符串" },
    url: { en: "URL Encoder", zh: "URL 编解码" },
    urlDesc: { en: "Encode and decode URL components", zh: "编码和解码 URL 组件" },
    hash: { en: "Hash Generator", zh: "哈希生成器" },
    hashDesc: { en: "MD5, SHA-256, and SHA-512 hashes", zh: "计算 MD5、SHA-256、SHA-512 哈希" },
    color: { en: "Color Converter", zh: "颜色转换" },
    colorDesc: { en: "Convert between color formats", zh: "在多种颜色格式之间互转" },
    timestamp: { en: "Timestamp Converter", zh: "时间戳转换" },
    timestampDesc: { en: "Unix time and dates, both ways", zh: "Unix 时间戳与日期互转" },
    uuid: { en: "UUID Generator", zh: "UUID 生成器" },
    uuidDesc: { en: "Generate v4 UUIDs in bulk", zh: "批量生成 v4 UUID" },
    password: { en: "Password Generator", zh: "密码生成器" },
    passwordDesc: { en: "Create strong random passwords", zh: "生成高强度的随机密码" },
    stats: { en: "Text Counter", zh: "文本统计" },
    statsDesc: { en: "Count characters, words, and lines", zh: "统计字符、单词和行数" },
    regex: { en: "Regex Tester", zh: "正则测试" },
    regexDesc: { en: "Live pattern matching with highlight", zh: "实时匹配并高亮测试正则" },
    morse: { en: "Morse Code", zh: "摩尔斯电码" },
    morseDesc: { en: "Convert between text and Morse", zh: "文本与摩尔斯电码互转" },
    jwt: { en: "JWT Decoder", zh: "JWT 解码" },
    jwtDesc: { en: "Inspect token headers and payloads", zh: "查看 JWT 的头部与负载" },

    imageCompress: { en: "Image Compress", zh: "图片压缩" },
    imageCompressDesc: { en: "Shrink image file size without quality loss", zh: "在保证画质的前提下压缩图片体积" },
    imageConvert: { en: "Image Convert", zh: "图片转格式" },
    imageConvertDesc: { en: "Convert images between PNG, JPEG, and WebP", zh: "在 PNG、JPEG、WebP 之间互转图片" },
    rename: { en: "Bulk Rename", zh: "批量重命名" },
    renameDesc: { en: "Rename files in batches with a rule", zh: "按规则批量重命名文件" },

    /* ---------- Tool pages ---------- */
    input: { en: "Input", zh: "输入" },
    output: { en: "Output", zh: "输出" },
    prettify: { en: "Prettify", zh: "格式化" },
    minify: { en: "Minify", zh: "压缩" },
    format: { en: "Format", zh: "格式化" },
    validate: { en: "Validate", zh: "校验" },
    convert: { en: "Convert", zh: "转换" },
    generate: { en: "Generate", zh: "生成" },
    encode: { en: "Encode", zh: "编码" },
    decode: { en: "Decode", zh: "解码" },
    invalidJSON: { en: "Invalid JSON", zh: "无效的 JSON" },
    fill: { en: "Fill with sample data", zh: "填入示例数据" },
    sampleJSON: {
        en: '{\n  "name": "ToolBox",\n  "count": 42,\n  "tags": ["json", "tools"],\n  "active": true\n}',
        zh: '{\n  "名称": "工具箱",\n  "数量": 42,\n  "标签": ["json", "工具"],\n  "启用": true\n}'
    },

    charset: { en: "Character set", zh: "字符集" },
    algorithm: { en: "Algorithm", zh: "算法" },
    textInput: { en: "Text to hash", zh: "待哈希的文本" },
    hashes: { en: "Hashes", zh: "哈希结果" },
    clickToCopy: { en: "Click to copy", zh: "点击复制" },

    pickColor: { en: "Color", zh: "颜色" },
    colorInput: { en: "HEX, RGB, or HSL value", zh: "HEX、RGB 或 HSL 值" },
    colorHint: {
        en: "Type a value like #6366f1, rgb(99,102,241), or hsl(239,84%,67%)",
        zh: "输入如 #6366f1、rgb(99,102,241) 或 hsl(239,84%,67%) 的值"
    },

    nowTimestamp: { en: "Current time", zh: "当前时间" },
    tsToDate: { en: "Timestamp → Date", zh: "时间戳 → 日期" },
    dateToTs: { en: "Date → Timestamp", zh: "日期 → 时间戳" },
    timestampUnit: { en: "Seconds", zh: "秒" },
    invalidDate: { en: "Invalid date", zh: "无效的日期" },

    countUUID: { en: "Number of UUIDs", zh: "生成数量" },
    uuidResult: { en: "Generated IDs", zh: "生成的 UUID" },
    never: { en: "HTTP", zh: "HTTP" },

    pwdLength: { en: "Length", zh: "密码长度" },
    includeUpper: { en: "Uppercase (A–Z)", zh: "大写字母 (A–Z)" },
    includeLower: { en: "Lowercase (a–z)", zh: "小写字母 (a–z)" },
    includeDigits: { en: "Digits (0–9)", zh: "数字 (0–9)" },
    includeSymbols: { en: "Symbols (!@#$…)", zh: "符号 (!@#$…)" },
    pwdResult: { en: "Generated password", zh: "生成的密码" },
    strength: { en: "Strength", zh: "强度" },
    weak: { en: "Weak", zh: "较弱" },
    fair: { en: "Fair", zh: "中等" },
    good: { en: "Good", zh: "良好" },
    strong: { en: "Strong", zh: "超强" },

    statChars: { en: "Characters", zh: "字符数" },
    statWords: { en: "Words", zh: "单词数" },
    statLines: { en: "Lines", zh: "行数" },
    statNonSpace: { en: "Non-space", zh: "非空字符" },
    statCJK: { en: "Chinese chars", zh: "中文字符" },
    statBytes: { en: "UTF-8 bytes", zh: "UTF-8 字节" },

    pattern: { en: "Pattern", zh: "表达式" },
    flags: { en: "Flags", zh: "修饰符" },
    testString: { en: "Test string", zh: "测试文本" },
    matches: { en: "matches", zh: "个匹配" },
    noMatches: { en: "No match", zh: "无匹配" },
    groups: { en: "groups", zh: "个分组" },

    morseDirection: { en: "Direction", zh: "转换方向" },
    textToMorse: { en: "Text → Morse", zh: "文本 → 摩斯" },
    morseToText: { en: "Morse → Text", zh: "摩斯 → 文本" },
    morseNote: {
        en: "Letters are separated by a space, words by a slash ( / ).",
        zh: "字母之间用空格分隔，单词之间用斜杠 ( / ) 分隔。"
    },

    jwtInput: { en: "Paste token…", zh: "粘贴 Token…" },
    jwtSample: { en: "Use sample token", zh: "使用示例 Token" },
    header: { en: "Header", zh: "头部" },
    payload: { en: "Payload", zh: "负载" },
    invalidJWT: { en: "Invalid JWT token", zh: "无效的 JWT Token" },
    notExpired: { en: "Valid", zh: "有效" },
    expired: { en: "Expired", zh: "已过期" },
    noExpiry: { en: "No expiration", zh: "未设置过期时间" },
    signed: { en: "Token is signed", zh: "Token 已签名" },
    unsigned: { en: "Token is NOT signed", zh: "Token 未签名" },

    /* ---------- Image tools ---------- */
    chooseImage: { en: "Choose an image", zh: "选择图片" },
    dropImage: { en: "or drag & drop it here", zh: "或将图片拖拽到这里" },
    quality: { en: "Quality", zh: "质量" },
    compressBtn: { en: "Compress", zh: "压缩" },
    originalSize: { en: "Original", zh: "原始大小" },
    newSize: { en: "Compressed", zh: "压缩后" },
    savedPercent: { en: "saved", zh: "省了" },
    noImage: { en: "Please choose an image first", zh: "请先选择一张图片" },
    toolResult: { en: "Result", zh: "结果" },
    outputFormat: { en: "Output format", zh: "输出格式" },
    convertBtn: { en: "Convert", zh: "转换" },

    /* ---------- Bulk rename ---------- */
    fileLines: { en: "File names — one per line", zh: "文件名，每行一个" },
    prefix: { en: "Prefix", zh: "前缀" },
    suffix: { en: "Suffix", zh: "后缀" },
    startNum: { en: "Start number", zh: "起始序号" },
    padNum: { en: "Zero padding", zh: "补零位数" },
    renameRule: { en: "Renaming rule", zh: "重命名规则" },
    newNames: { en: "New names", zh: "新文件名" },
    renamePreview: { en: "Preview", zh: "预览" },
    inputEmpty: { en: "Enter at least one file name", zh: "请至少输入一个文件名" },
};

const storage = (() => {
    try {
        const k = window.localStorage;
        return { get: k.getItem.bind(k), set: k.setItem.bind(k) };
    } catch { return { get: () => null, set: () => {} }; }
})();

let lang = storage.get("toolbox-lang") || "zh";

function t(key) {
    const entry = I18N[key];
    if (!entry) return key;
    return entry[lang] || entry.en;
}

/* ---------- Theme ---------- */
let theme = storage.get("toolbox-theme") || "light";

function applyTheme(next) {
    theme = next || theme;
    document.documentElement.dataset.theme = theme;
    storage.set("toolbox-theme", theme);
    const icon = document.getElementById("themeIcon");
    if (icon) {
        icon.innerHTML = theme === "dark"
            ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4.5"/><path stroke-linecap="round" d="M12 2.5v2M12 19.5v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2.5 12h2M19.5 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
            : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"/></svg>';
    }
}

/* ---------- Language ---------- */
function applyLang(next) {
    lang = next || lang;
    storage.set("toolbox-lang", lang);
    const btn = document.getElementById("langToggle");
    if (btn) btn.querySelector(".btn-label").textContent = lang === "zh" ? "English" : "中文";

    document.querySelectorAll("[data-i18n]").forEach(el => {
        el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        el.placeholder = t(el.dataset.i18nPlaceholder);
    });
    document.querySelectorAll("[data-i18n-title]").forEach(el => {
        el.title = t(el.dataset.i18nTitle);
    });

    const head = document.querySelector(".tool-head");
    if (head && head.dataset.toolKey) {
        head.querySelector("h1").textContent = t(head.dataset.toolKey);
        head.querySelector("p").textContent = t(head.dataset.toolKey + "Desc");
        document.title = t(head.dataset.toolKey) + " · " + t("siteName");
    }

    const pageCtx = window.onLangChange;
    if (typeof pageCtx === "function") pageCtx(lang);
}

/* ---------- Toast & copy ---------- */
let toastTimer = null;
function showToast(localizedMsg, icon) {
    let toast = document.getElementById("toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.className = "toast";
        document.body.appendChild(toast);
    }
    toast.textContent = (icon ? icon + " " : "") + (localizedMsg || t("copied"));
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function copyText(text) {
    const done = () => showToast(t("copied"));
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
    } else {
        fallbackCopy(text, done);
    }
}

function fallbackCopy(text, done) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch {}
    ta.remove();
    done();
}

/* ---------- Init (core.js may load in <head>; boot after DOM ready) ---------- */
function boot() {
    applyTheme();
    applyLang();
    
    document.getElementById("themeToggle").addEventListener("click", () => {
        applyTheme(theme === "light" ? "dark" : "light");
    });
    
    document.getElementById("langToggle").addEventListener("click", () => {
        applyLang(lang === "zh" ? "en" : "zh");
    });
    
    /* ---------- Mobile drawer menu ---------- */
    const menuToggle = document.getElementById("menuToggle");
    const drawer = document.getElementById("drawer");
    if (menuToggle && drawer) {
        const openDrawer = () => {
            drawer.classList.add("open");
            drawer.setAttribute("aria-hidden", "false");
            menuToggle.setAttribute("aria-expanded", "true");
            document.body.style.overflow = "hidden";
        };
        const closeDrawer = () => {
            drawer.classList.remove("open");
            drawer.setAttribute("aria-hidden", "true");
            menuToggle.setAttribute("aria-expanded", "false");
            document.body.style.overflow = "";
        };
        menuToggle.addEventListener("click", () => {
            drawer.classList.contains("open") ? closeDrawer() : openDrawer();
        });
        drawer.querySelectorAll("[data-close-drawer]").forEach(el => el.addEventListener("click", closeDrawer));
        document.addEventListener("keydown", e => { if (e.key === "Escape") closeDrawer(); });
        window.addEventListener("resize", () => {
            if (window.innerWidth > 640) closeDrawer();
        });
    }
    
    /* ---------- Build badge (permanent version marker) ---------- */
    (function () {
        const cs = getComputedStyle(document.documentElement);
        const build = (cs.getPropertyValue("--build") || "").replace(/["']/g, "").trim();
        const badge = (cs.getPropertyValue("--badge-text") || "").replace(/["']/g, "").trim() || build;
        const el = document.createElement("div");
        el.className = "build-badge";
        if (!build) el.classList.add("stale");
        el.textContent = build ? badge : "STALE — reload without cache";
        document.body.appendChild(el);
    })();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
} else {
    boot();
}