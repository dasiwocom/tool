/* ==========================================================
   ToolBox — shared app core (theme, language, i18n, helpers)
   Loaded on every page before the page-specific script.
   ========================================================== */

const I18N = {
    /* ---------- Global ---------- */
    siteName: { en: "ToolBox", zh: "工具箱" },
    menu: { en: "Menu", zh: "菜单" },
    tagline: { en: "Practical tools, always at hand.", zh: "实用的工具，随时可用。" },
    home: { en: "Home", zh: "首页" },
    blog: { en: "Blog", zh: "博客" },
    copied: { en: "Copied to clipboard", zh: "已复制到剪贴板" },
    copy: { en: "Copy", zh: "复制" },
    example: { en: "Example", zh: "示例" },
    copyAll: { en: "Copy All", zh: "复制全部" },
    clear: { en: "Clear", zh: "清空" },
    close: { en: "Close", zh: "关闭" },

    heroTitle: { en: "Simple Tools for Anything", zh: "简单好用的全能工具" },
    heroDesc: {
        en: "A growing collection of handy utilities for work and play. Everything runs locally in your browser — nothing is uploaded.",
        zh: "一组持续扩充的多功能小工具，工作生活都用得上。所有处理都在浏览器本地完成，数据不会上传。"
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

    contact: { en: "Contact", zh: "联系我们" },
    contactTitle: { en: "Contact Us", zh: "联系我们" },
    contactDesc: { en: "Questions, feedback, or feature ideas", zh: "问题、反馈或功能建议" },
    emailTitle: { en: "Email", zh: "电子邮件" },
    contactIntro: { en: "Have a question or a feature idea? Drop us a line.", zh: "有问题或功能想法？给我们发封邮件吧。" },
    sendEmail: { en: "Send an email", zh: "发送邮件" },

    privacy: { en: "Privacy Policy", zh: "隐私政策" },
    terms: { en: "Terms of Service", zh: "服务条款" },
    blogTitle: { en: "Blog", zh: "博客" },
    blogDesc: { en: "Notes, tutorials, and updates", zh: "笔记、教程与更新" },
    blogEmpty: { en: "No posts yet — stay tuned.", zh: "暂无文章，敬请期待。" },

    /* ---------- Tool names & descriptions ---------- */
    json: { en: "JSON Formatter", zh: "JSON 格式化" },
    jsonDesc: { en: "Format, minify, and validate JSON with inline error hints and a copy-ready output", zh: "美化、压缩与校验 JSON，实时标注语法错误，一键复制整洁结果" },
    base64: { en: "Base64 Encoder", zh: "Base64 编解码" },
    base64Desc: { en: "Encode and decode Base64 strings safely, with URL-safe mode for seamless sharing", zh: "安全地编码和解码 Base64 字符串，支持 URL 安全模式，结果随手可用" },
    url: { en: "URL Encoder", zh: "URL 编解码" },
    urlDesc: { en: "Percent-encode and decode URL components, handling spaces and Unicode correctly", zh: "对 URL 组件进行百分号编解码，正确转义空格与中文等 Unicode 字符" },
    hash: { en: "Hash Generator", zh: "哈希生成器" },
    hashDesc: { en: "Compute MD5, SHA-1, SHA-256, and SHA-512 hashes instantly for any text", zh: "即时计算任意文本的 MD5、SHA-1、SHA-256 与 SHA-512 哈希值" },
    color: { en: "Color Converter", zh: "颜色转换" },
    colorDesc: { en: "Convert between HEX, RGB, HSL, and named colors with a live preview swatch", zh: "在 HEX、RGB、HSL 与颜色名称之间互转，实时预览转换后的色块" },
    timestamp: { en: "Timestamp Converter", zh: "时间戳转换" },
    timestampDesc: { en: "Convert Unix timestamps and readable dates both ways, in seconds or milliseconds", zh: "Unix 时间戳与可读日期双向转换，兼容秒与毫秒两种单位" },
    uuid: { en: "UUID Generator", zh: "UUID 生成器" },
    uuidDesc: { en: "Generate RFC 4122 v4 UUIDs in bulk, with or without dashes, one click to copy", zh: "批量生成 RFC 4122 v4 UUID，可选带连字符或去掉，单击即可复制" },
    password: { en: "Password Generator", zh: "密码生成器" },
    passwordDesc: { en: "Generate strong random passwords with custom length and charset options", zh: "生成高强度的随机密码，自由调节长度与字符组合规则" },
    stats: { en: "Text Counter", zh: "文本统计" },
    statsDesc: { en: "Count characters, words, sentences, and lines, with Chinese-aware counting", zh: "统计字符、单词、句子与行数，对中文内容同样准确" },
    regex: { en: "Regex Tester", zh: "正则测试" },
    regexDesc: { en: "Test regular expressions live, with match highlighting and detailed results", zh: "实时测试正则表达式，高亮命中结果，清晰展示匹配详情" },
    morse: { en: "Morse Code", zh: "摩尔斯电码" },
    morseDesc: { en: "Convert text to Morse code and back, with audible playback support", zh: "文本与摩尔斯电码互转，支持发声播放，方便练习识听" },
    jwt: { en: "JWT Decoder", zh: "JWT 解码" },
    jwtDesc: { en: "Decode JWT headers and payloads locally, without the token ever leaving your browser", zh: "本地解码 JWT 的头部与负载，令牌全程不会离开浏览器" },

    imageCompress: { en: "Image Compress", zh: "图片压缩" },
    imageCompressDesc: { en: "Shrink image file size while keeping quality, tuning the balance on a slider", zh: "在画质与体积之间自由权衡，用滑块压缩图片的文件大小" },
    imageConvert: { en: "Image Convert", zh: "图片转格式" },
    imageConvertDesc: { en: "Convert images between PNG, JPEG, WebP, AVIF, BMP, and SVG formats instantly", zh: "在 PNG、JPEG、WebP、AVIF、BMP、SVG 等多种格式间即时转换图片" },
    imageSlice: { en: "Image Slice", zh: "图片切割" },
    imageSliceDesc: { en: "Slice one image into an evenly sized grid of tiles for assets or sprites", zh: "把一张图按均匀网格切成多块小图，适合制作素材与雪碧图" },
    sliceCols: { en: "Columns", zh: "列数" },
    sliceRows: { en: "Rows", zh: "行数" },
    sliceBtn: { en: "Slice", zh: "切割" },
    imageCrop: { en: "Image Crop", zh: "图片裁剪" },
    imageCropDesc: { en: "Drag to crop any rectangular region out of an image, then download it", zh: "在图片上拖拽框选任意区域进行裁剪，裁完即可下载" },
    cropHint: { en: "Drag on the image to select an area", zh: "在图片上拖拽选择裁剪区域" },
    cropBtn: { en: "Crop", zh: "裁剪" },
    downloadAll: { en: "Download all", zh: "全部下载" },
    rename: { en: "Bulk Rename", zh: "批量重命名" },
    renameDesc: { en: "Rename files in batches with a rule", zh: "按规则批量重命名文件" },

    textDiff: { en: "Text Diff", zh: "文本对比" },
    textDiffDesc: { en: "Compare two texts line by line and highlight added and removed parts", zh: "逐行对比两段文本，高亮显示新增与删除的内容差异" },
    oldText: { en: "Original", zh: "原文本" },
    newText: { en: "Modified", zh: "修改后" },
    diffGo: { en: "Compare", zh: "对比" },
    diffTooBig: { en: "Input too large to compare", zh: "文本过大，无法对比" },

    lorem: { en: "Lorem Ipsum", zh: "假文生成" },
    loremDesc: { en: "Generate placeholder text in multiple languages for mockups and layouts", zh: "生成多语言的占位假文，用于排版预览与界面原型设计" },
    loremLang: { en: "Language", zh: "语言" },
    loremCount: { en: "Paragraphs", zh: "段落数" },
    loremSentences: { en: "Sentences / para", zh: "每段句子" },
    loremGen: { en: "Generate", zh: "生成" },

    imageFlip: { en: "Image Flip", zh: "图片翻转" },
    imageFlipDesc: { en: "Mirror an image horizontally or vertically, or rotate it by any angle", zh: "将图片水平、垂直镜像，或按任意角度旋转" },
    flipDirection: { en: "Direction", zh: "方向" },
    flipH: { en: "Flip horizontally", zh: "水平翻转" },
    flipV: { en: "Flip vertically", zh: "垂直翻转" },
    flipHV: { en: "Flip both", zh: "水平+垂直" },
    rotateDeg: { en: "Rotate", zh: "旋转" },
    flipGo: { en: "Flip", zh: "翻转" },

    imageResize: { en: "Image Resize", zh: "图片改尺寸" },
    imageResizeDesc: { en: "Resize by width or percentage while keeping proportions, upscale or downscale", zh: "按宽度或百分比调整图片尺寸，保持比例不变，可放大也可缩小" },
    resizeMode: { en: "Mode", zh: "方式" },
    resizeByWidth: { en: "Fit width", zh: "按宽度" },
    resizeByPct: { en: "Percentage", zh: "按百分比" },
    resizeWidth: { en: "Width (px)", zh: "宽度（像素）" },
    resizePct: { en: "Percent", zh: "百分比" },
    resizeGo: { en: "Resize", zh: "改尺寸" },

    imageCircleCrop: { en: "Circle Crop", zh: "圆形裁剪" },
    imageCircleCropDesc: { en: "Crop an image into a circle with a transparent background, ideal for avatars and logos", zh: "把图片裁剪成圆形并导出透明背景，适合做头像与标识" },
    ccropFit: { en: "Source fit", zh: "填充方式" },
    ccropCover: { en: "Fill circle (crop)", zh: "填满圆形（裁切）" },
    ccropContain: { en: "Whole image in", zh: "完整放入" },
    ccropSize: { en: "Output size (px)", zh: "输出尺寸（像素）" },
    ccropGo: { en: "Crop", zh: "裁剪" },

    imageStitch: { en: "Image Stitch", zh: "图片拼接" },
    imageStitchDesc: { en: "Merge several images into one panorama, side by side or stacked vertically", zh: "把多张图片拼成一张全景图，支持横向拼接或纵向堆叠" },
    chooseImages: { en: "Choose images", zh: "选择图片" },
    stitchDir: { en: "Direction", zh: "方向" },
    stitchH: { en: "Side by side", zh: "横向拼接" },
    stitchV: { en: "Stack vertically", zh: "纵向拼接" },
    stitchGap: { en: "Gap (px)", zh: "间距（像素）" },
    stitchGo: { en: "Stitch", zh: "拼接" },
    stitchNeed: { en: "Pick at least two images", zh: "请至少选择两张图片" },

    gifMaker: { en: "GIF Maker", zh: "GIF 生成" },
    gifMakerDesc: { en: "Combine multiple images into an animated GIF, with frame delay control", zh: "将多张图片合成动态的 GIF 动图，可控制每帧之间的间隔时间" },
    gifDelay: { en: "Frame delay (ms)", zh: "帧间隔（毫秒）" },
    gifSize: { en: "Output width (px)", zh: "输出宽度（像素）" },
    gifGo: { en: "Make GIF", zh: "生成 GIF" },
    gifWorking: { en: "Making GIF…", zh: "生成中…" },

    qrcode: { en: "QR Code", zh: "二维码生成" },
    qrcodeDesc: { en: "Generate QR codes for links and text, with selectable error correction levels", zh: "为链接或文本生成二维码，可选不同容错等级保证扫描成功率" },
    qrText: { en: "Text or link", zh: "文本或链接" },
    qrErrLvl: { en: "Error correction", zh: "容错等级" },
    qrSize: { en: "Module (px)", zh: "模块大小（像素）" },
    qrGo: { en: "Generate", zh: "生成" },
    qrEmpty: { en: "Enter text first", zh: "请先输入内容" },

    html2md: { en: "HTML to Markdown", zh: "HTML 转 Markdown" },
    html2mdDesc: { en: "Convert HTML source into clean Markdown, keeping headings, links, lists, tables and code blocks", zh: "把 HTML 源码转换成干净的 Markdown，保留标题、链接、列表、表格与代码块" },

    pdf2img: { en: "PDF to Image", zh: "PDF 转图片" },
    pdf2imgDesc: { en: "Render every page of a PDF as a PNG image, and download pages individually or as a ZIP", zh: "把 PDF 的每一页渲染成 PNG 图片，可单张下载或打包 ZIP 下载" },
    choosePdf: { en: "Choose a PDF file", zh: "选择 PDF 文件" },
    imageWidth: { en: "Output width (px)", zh: "输出宽度（像素）" },
    dlAll: { en: "Download all (ZIP)", zh: "全部下载（ZIP）" },
    pdfErr: { en: "Unable to read this PDF file", zh: "无法读取该 PDF 文件" },
    pdfPages: { en: "pages", zh: "页" },
    pdfDone: { en: "Converted successfully", zh: "转换完成" },

    pdf2word: { en: "PDF to Word", zh: "PDF 转 Word" },
    pdf2wordDesc: { en: "Turn PDF into editable Word documents, as text or page images — all in your browser", zh: "把 PDF 转成可编辑的 Word 文档，可输出可编辑文本或整页图片，全程在浏览器本地完成" },
    pwMode: { en: "Output style", zh: "转换方式" },
    pwText: { en: "Editable text", zh: "可编辑文本" },
    pwTextDesc: { en: "Rebuild paragraphs, fully editable", zh: "重建段落，完全可编辑" },
    pwImage: { en: "Page images", zh: "整页图片" },
    pwImageDesc: { en: "Embed each page as an image, exact look", zh: "逐页嵌入图片，版式完全一致" },
    pwConvertPdf: { en: "Convert to Word", zh: "转为 Word" },
    pwReady: { en: "Word document is ready to download", zh: "Word 文档已生成，可下载" },
    pwEmptyPdf: { en: "No extractable text was found", zh: "未提取到可编辑文字" },

    word2pdf: { en: "Word to PDF", zh: "Word 转 PDF" },
    word2pdfDesc: { en: "Turn Word .docx files into PDF via your browser's print dialog — files never leave your device", zh: "通过浏览器打印对话框把 Word .docx 导出为 PDF，文件不会离开您的设备" },
    pwChooseDocx: { en: "Choose a Word (.docx) file", zh: "选择 Word (.docx) 文件" },
    pwSavePdf: { en: "Save as PDF…", zh: "另存为 PDF…" },
    pwPrintHint: { en: "The preview renders below — click “Save as PDF…” and pick “Save as PDF” as the printer to export.", zh: "下方将生成预览，点击“另存为 PDF…”，把目标打印机选为“另存为 PDF”即可导出。" },
    pwPreview: { en: "Word preview", zh: "Word 预览" },
    pwErrDocx: { en: "Cannot read this file — only .docx is supported", zh: "无法读取该文件 — 仅支持 .docx" },
    pwPreviewReady: { en: "Preview ready — print it as PDF", zh: "预览已生成 — 打印即可导出 PDF" },

    cameraTest: { en: "Camera Test", zh: "摄像头测试" },
    cameraTestDesc: { en: "Access your webcam, list the detected devices and supported resolutions, and test flash / torch support", zh: "调用摄像头，列出检测到的设备与支持的分辨率，并测试闪光灯" },
    camSelect: { en: "Choose a camera", zh: "选择摄像头" },
    camPreview: { en: "Live preview", zh: "实时预览" },
    camStart: { en: "Start camera", zh: "打开摄像头" },
    camStop: { en: "Stop camera", zh: "关闭摄像头" },
    camTorch: { en: "Flashlight", zh: "手电筒" },
    camTorchOn: { en: "On", zh: "开" },
    camTorchOff: { en: "Off", zh: "关" },
    camStatus: { en: "Status", zh: "状态" },
    camRunning: { en: "Camera is running", zh: "摄像头已打开" },
    camStopped: { en: "Camera is stopped", zh: "摄像头已关闭" },
    camNoSupport: { en: "Your browser does not support camera access", zh: "您的浏览器不支持访问摄像头" },
    camDenied: { en: "Camera access was denied — allow it in the browser and try again", zh: "摄像头访问被拒绝，请在浏览器中允许后重试" },
    camNoDevice: { en: "No camera found — connect one and try again", zh: "未检测到摄像头，请连接后重试" },
    camBusy: { en: "Camera is in use by another app", zh: "摄像头正被其他程序占用" },
    camNoTorch: { en: "This camera does not support a flashlight", zh: "此摄像头不支持手电筒/补光灯" },
    camResolutions: { en: "Supported resolutions", zh: "支持的分辨率" },
    camResTest: { en: "Detect resolutions", zh: "检测分辨率" },
    camDetecting: { en: "Detecting…", zh: "检测中…" },
    camNoRes: { en: "Nothing detected — start the camera first", zh: "未检测到结果，请先打开摄像头" },
    camNotStarted: { en: "Flashlight needs a running camera", zh: "测试闪光灯前请先打开摄像头" },

    keyboardTest: { en: "Keyboard Test", zh: "键盘测试" },
    keyboardTestDesc: { en: "Test every key, check rollover, hold states, and inspect the raw key events", zh: "测试每个按键是否正常，检测键位冲突与按住状态，并查看原始按键事件" },
    kbPressed: { en: "Click here, then press any key…", zh: "点击此处后，按下任意键测试…" },
    kbLatest: { en: "Latest event", zh: "最近事件" },
    kbKey: { en: "key", zh: "键值" },
    kbCode: { en: "code", zh: "编码" },
    kbKeyCode: { en: "keyCode", zh: "键码" },
    kbLocation: { en: "location", zh: "位置" },
    kbModifiers: { en: "modifiers", zh: "组合键" },
    kbRepeat: { en: "repeat", zh: "重复" },
    kbHeld: { en: "Keys held", zh: "当前按住" },
    kbLog: { en: "Event log", zh: "事件记录" },
    kbClear: { en: "Clear", zh: "清空" },
    kbLoc0: { en: "Standard", zh: "标准" },
    kbLoc1: { en: "Left", zh: "左侧" },
    kbLoc2: { en: "Right", zh: "右侧" },
    kbLoc3: { en: "Numpad", zh: "小键盘" },

    friendsTitle: { en: "Friends", zh: "友情链接" },
    footerTools: { en: "Popular tools", zh: "常用工具" },
    legal: { en: "Legal", zh: "法律" },
    qqTitle: { en: "QQ", zh: "QQ" },
    qqIntro: { en: "Add us on QQ for a quick chat", zh: "加 QQ 随时联系" },
    qqHint: { en: "Click to copy", zh: "点击复制" },
    copyQQ: { en: "Copy QQ", zh: "复制 QQ" },

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
    direction: { en: "Direction", zh: "方向" },
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
    tsToDate: { en: "Timestamp to Date", zh: "时间戳转日期" },
    dateToTs: { en: "Date to Timestamp", zh: "日期转时间戳" },
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
    textToMorse: { en: "Text to Morse", zh: "文本转摩斯" },
    morseToText: { en: "Morse to Text", zh: "摩斯转文本" },
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
    downloadImg: { en: "Download", zh: "下载" },
    copyFailed: { en: "Copy failed", zh: "复制失败" },
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
            ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5.5"/><path d="M12 5V2.5M12 19V21.5M5 12H2.5M19 12H21.5M7.05 7.05 5.28 5.28M16.95 16.95 18.72 18.72M7.05 16.95 5.28 18.72M16.95 7.05 18.72 5.28"/></svg>'
            : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path transform="translate(-1.171 -1.171) scale(1.0976)" d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"/></svg>';
    }
}

/* ---------- Language ---------- */
function applyLang(next) {
    lang = next || lang;
    storage.set("toolbox-lang", lang);
    document.documentElement.lang = lang;
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
        document.documentElement.classList.remove("i18n-pending");
    })();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
} else {
    boot();
}