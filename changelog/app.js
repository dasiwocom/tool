/* Timeline — chronological (latest first) */
const VERSIONS = [
    {
        v: "1.4",
        date: "2026-09-18",
        latest: true,
        title: {
            en: "Contact page · new image tools · more convert formats",
            zh: "联系页 · 图片新工具 · 更多转格式"
        },
        items: {
            en: [
                "New Contact page and a Contact link in the top nav, drawer and footer",
                "New tools: Image Slice (cut an image into a grid) and Image Crop (drag to select a region)",
                "Image Convert gained AVIF and BMP targets — five output formats in total",
                "Download page now lists Android alongside Windows, macOS and Linux",
                "Fixed first-frame language flash and mobile horizontal drift"
            ],
            zh: [
                "新增「联系我们」页，顶部导航 / 抽屉 / 页脚新增「联系我们」入口",
                "新增工具：图片切割（把一张图切成网格）与图片裁剪（拖拽选择区域）",
                "「图片转格式」新增 AVIF / BMP 格式，加上 PNG、JPEG、WebP 共五种",
                "下载页在 Windows / macOS / Linux 之外新增 Android 平台",
                "修复首帧语言闪屏与移动端横向漂移"
            ]
        }
    },
    {
        v: "1.3",
        date: "2026-09-18",
        latest: false,
        title: {
            en: "New tools · Download page · mobile polish",
            zh: "新工具 · 下载页 · 移动端打磨"
        },
        items: {
            en: [
                "New tools: Image Compress, Image Convert and Bulk Rename (all local, in-browser)",
                "New Download page placeholder for the upcoming desktop apps (Windows / macOS / Linux)",
                "Hamburger menu moved to the far right, Download link added to the top nav, drawer and footer",
                "Instant theme switching and further mobile performance tuning"
            ],
            zh: [
                "新增工具：图片压缩、图片转格式、批量重命名（全部本地处理）",
                "新增「下载」页，预留即将推出的桌面应用（Windows / macOS / Linux）",
                "汉堡菜单按钮移到右上角，顶部导航 / 抽屉 / 页脚新增「下载」入口",
                "主题切换瞬时完成，继续优化移动端性能"
            ]
        }
    },
    {
        v: "1.2",
        date: "2026-09-18",
        latest: false,
        title: {
            en: "Independent pages · minimal design",
            zh: "独立页面 · 极简设计"
        },
        items: {
            en: [
                "Each tool is now its own page under /tools, with a unified header, footer and tool shell",
                "Rebuilt the visual style from scratch around an Apple-inspired, distraction-free minimal theme",
                "Persistent dark / light themes and an English / 中文 language switch on every page",
                "Added a dedicated Changelog page with this release timeline",
                "All hash algorithms (MD5 · SHA-256 · SHA-512) now run in pure JavaScript, so the site works fully offline"
            ],
            zh: [
                "每个工具的独立页面上线，统一头部、尾部与页面骨架",
                "视觉风格全面重构为苹果式极简、无干扰的主题",
                "每个页面支持深浅色主题切换与中英文切换（自动记忆）",
                "新增独立的「更新日志」页面，用时间线记录每次更新",
                "MD5 / SHA-256 / SHA-512 哈希全部改为纯 JavaScript 实现，可完全离线运行"
            ]
        }
    },
    {
        v: "1.1",
        date: "2026-09-18",
        latest: false,
        title: {
            en: "Formatting & UX improvements",
            zh: "体验与细节优化"
        },
        items: {
            en: [
                "Unified input/output styling and keyboard-friendly focus states",
                "Added copy-to-clipboard everywhere with a lightweight toast confirmation"
            ],
            zh: [
                "统一输入 / 输出区域样式，优化键盘焦点状态",
                "全站支持一键复制，并带有轻量提示反馈"
            ]
        }
    },
    {
        v: "1.0",
        date: "2026-09-18",
        latest: false,
        title: {
            en: "Initial release — 12 tools",
            zh: "初始版本 — 12 个工具"
        },
        items: {
            en: [
                "JSON Formatter · Base64 · URL · Hash · Color · Timestamp",
                "UUID · Password · Text Counter · Regex · Morse · JWT",
                "One-page prototype archive of the very first build"
            ],
            zh: [
                "JSON 格式化 · Base64 · URL · 哈希 · 颜色 · 时间戳",
                "UUID · 密码 · 文本统计 · 正则 · 摩斯 · JWT",
                "最初单页原型的历史存档"
            ]
        }
    }
];

const timeline = document.getElementById("timeline");

function render() {
    timeline.innerHTML = VERSIONS.map(item => {
        const list = item.items[lang] || item.items.en;
        const title = item.title[lang] || item.title.en;
        return `
            <div class="timeline-item${item.latest ? " latest" : ""}">
                <div class="meta">
                    <span class="version">${item.v}</span>
                    ${item.latest ? `<span class="badge-new">${t("latest")}</span>` : ""}
                    <span class="date">${item.date}</span>
                </div>
                <div class="title">${title}</div>
                <ul>${list.map(li => `<li>${li}</li>`).join("")}</ul>
            </div>
        `;
    }).join("");
}

render();
window.onLangChange = render;