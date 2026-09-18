/* Lorem Ipsum Generator */
const langSel = document.getElementById("lang");
const count = document.getElementById("count");
const sent = document.getElementById("sent");
const genBtn = document.getElementById("genBtn");
const copyBtn = document.getElementById("copyBtn");
const out = document.getElementById("outWrap");

const LATIN = ["lorem","ipsum","dolor","sit","amet","consectetur","adipiscing","elit","sed","do","eiusmod","tempor","incididunt","ut","labore","et","dolore","magna","aliqua","enim","ad","minim","veniam","quis","nostrud","exercitation","ullamco","laboris","nisi","aliquip","ex","ea","commodo","consequat","duis","aute","irure","in","reprehenderit","voluptate","velit","esse","cillum","fugiat","nulla","pariatur","excepteur","sint","occaecat","cupidatat","non","proident","sunt","culpa","qui","officia","deserunt","mollit","anim","id","est","laborum"];
const LOREM_ZH = "天地玄黄宇宙洪荒日月盈昃辰宿列张寒来暑往秋收冬藏闰余成岁律吕调阳云腾致雨露结为霜金生丽水玉出昆冈剑号巨阙珠称夜光果珍李柰菜重芥姜海咸河淡鳞潜羽翔龙师火帝鸟官人皇始制文字乃服衣裳推位让国有虞陶唐吊民伐罪周发殷汤坐朝问道垂拱平章爱育黎首臣伏戎羌遐迩一体率宾归王鸣凤在竹白驹食场化被草木赖及万方盖此身发四大五常恭惟鞠养岂敢毁伤女慕贞洁男效才良知过必改得能莫忘罔谈彼短靡恃己长信使可覆器欲难量墨悲丝染诗赞羔羊景行维贤克念作圣德建名立形端表正空谷传声虚堂习听祸因恶积福缘善庆尺璧非宝寸阴是竞资父事君曰严与敬孝当竭力忠则尽命临深履薄夙兴温凊似兰斯馨如松之盛川流不息渊澄取映容止若思言辞安定笃初诚美慎终宜令荣业所基籍甚无竟学优登仕摄职从政存以甘棠去而益咏乐殊贵贱礼别尊卑";

function rand(max) { return Math.random() * max | 0; }
function pick(arr) { return arr[rand(arr.length)]; }

function makeSentence(l) {
    if (l === "zh") {
        const n = 12 + rand(18);
        let s = "";
        for (let i = 0; i < n; i++) s += LOREM_ZH[rand(LOREM_ZH.length)];
        return s + "。";
    }
    const n = 6 + rand(10);
    let s = "";
    for (let i = 0; i < n; i++) {
        if (i) s += " ";
        s += pick(LATIN);
    }
    return s.charAt(0).toUpperCase() + s.slice(1) + ".";
}

genBtn.addEventListener("click", () => {
    let body = "";
    const paras = Math.min(20, Math.max(1, parseInt(count.value, 10) || 3));
    const sents = Math.min(15, Math.max(3, parseInt(sent.value, 10) || 8));
    for (let p = 0; p < paras; p++) {
        const s = [];
        for (let i = 0; i < sents; i++) s.push(makeSentence(langSel.value));
        body += s.join(" ") + "\n\n";
    }
    out.textContent = body.trim();
});

copyBtn.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(out.textContent);
        showToast(t("copied") || "Copied");
    } catch (e) {
        showToast(t("copyFailed") || "Copy failed");
    }
});

genBtn.click();