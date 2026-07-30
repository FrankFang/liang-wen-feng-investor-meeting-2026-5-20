#!/usr/bin/env node
/**
 * 构建 .deploy/：
 *   - 两个 SPA 首页（注入 JSON-LD 与静态章节索引页脚）
 *   - 19 × 2 个静态章节页（每页独立 title/description/H1/正文/JSON-LD）
 *   - sitemap.xml / robots.txt
 *
 * 静态章节页是给搜索引擎的主入口：SPA 用 hash 路由（#/ch1），爬虫不会把它当独立
 * URL，而百度等爬虫根本不执行 JS，只靠 SPA 就等于全站只有一页正文。
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const OUT = path.join(ROOT, '.deploy');
const SITE = 'https://liangwenfeng.art';
const MEETING_DATE = '2026-05-20';
const BUILD_DATE = new Date().toISOString().slice(0, 10);

// ---------------------------------------------------------------- 工具函数

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/** JSON-LD 内联到 <script> 里，必须避免 </script> 与 HTML 注释序列提前闭合。 */
const jsonld = (obj) => JSON.stringify(obj, null, 2)
  .replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');

/** 截断成适合 SERP 摘要的长度，尽量断在标点处。 */
function clamp(text, max) {
  const t = String(text).replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const stop = Math.max(
    cut.lastIndexOf('。'), cut.lastIndexOf('；'), cut.lastIndexOf('，'),
    cut.lastIndexOf('. '), cut.lastIndexOf(', ')
  );
  return (stop > max * 0.6 ? cut.slice(0, stop + 1) : cut).trim() + '…';
}

function loadChapters(file) {
  const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
  return new Function(src + '; return CHAPTERS;')();
}

/** 从 SPA 首页里抽出 <style>…</style> 的内容，章节页内联复用同一套设计。 */
function extractStyle(html) {
  const m = html.match(/<style>([\s\S]*?)<\/style>/);
  if (!m) throw new Error('未能从首页提取 <style>');
  return m[1];
}

// ---------------------------------------------------------------- 文案

const L = {
  zh: {
    lang: 'zh-CN', ogLocale: 'zh_CN', ogLocaleAlt: 'en_US',
    homeHref: './', homeUrl: SITE + '/',
    // Cloudflare Pages 会把 /x.html 308 到 /x，所以对外 URL 一律不带扩展名，
    // 只有写盘的文件名保留 .html。
    chapterHref: (id) => id,
    chapterUrl: (id) => `${SITE}/${id}`,
    chapterFile: (id) => `${id}.html`,
    altChapterHref: (id) => `${id}.en`,
    siteName: '梁文锋投资者交流会实录',
    crumbHome: '首页',
    part: (p) => (p === 1 ? 'Part 1 · 主题分享' : 'Part 2 · 投资人问答'),
    chapterNo: (n) => `第 ${n} 章`,
    timeLabel: '录音时间点',
    qLabel: '投资人提问',
    aLabel: '梁文锋回应',
    prev: '← 上一章', next: '下一章 →',
    openInGuide: '在分章导读版中打开本章',
    langToggle: { text: 'EN', href: 'index.en', title: 'Switch to English' },
    themeTitle: '切换亮 / 暗主题',
    fontToggle: true,
    title: (c) => `${c.title}｜梁文锋投资者交流会实录 第${c.num}章`,
    desc: (c) => clamp(`${c.abstract}梁文锋原话：“${c.quote}”本章出自 2026 年 5 月 20 日 DeepSeek 创始人梁文锋投资者交流会会议录音逐字稿。`, 150),
    keywords: (c) => `梁文锋,梁文锋专访,梁文锋采访,梁文锋${c.title.split(/[：:，,、]/)[0]},DeepSeek,投资者交流会,会议录音,录音文字稿,逐字稿,全文实录`,
    footerHeading: '全部章节 · 梁文锋投资者交流会逐字稿目录',
    footerLead: '2026 年 5 月 20 日，DeepSeek 创始人梁文锋在投资者交流会上做了约 3 小时 44 分钟的分享与问答。以下是这份会议录音逐字稿的完整章节目录，每章都是一个可单独阅读的页面。',
    footerPart: (p) => (p === 1 ? 'Part 1 · 主题分享（第 1–12 章）' : 'Part 2 · 投资人问答（第 13–19 章）'),
    footerMeta: `本稿由语音识别自动转写并经 AI 整理，未区分说话人；章节标题、摘要与逻辑流程图为编者归纳。个别专有名词与数字可能存在识别误差，请以原录音为准。 · <a href="index.en">English version</a>`,
    disclaimer: '本稿由语音识别自动转写并经 AI 整理，未区分说话人，章节标题、摘要与逻辑流程图为编者归纳，用于辅助阅读；个别专有名词与数字可能存在识别误差，请以原录音为准。梁文锋在会中提示部分数字与情况较为敏感，请勿对外传播或录屏分享。',
    homeTitle: '梁文锋专访实录：DeepSeek 投资者交流会录音全文（2026.5.20）',
    homeDesc: 'DeepSeek 创始人梁文锋 2026 年 5 月 20 日投资者交流会专访录音逐字稿全文，3 小时 44 分钟会议录音完整整理为 19 章。',
    articleName: '梁文锋 2026 投资者交流会录音逐字稿全文',
    introHeading: '关于这份梁文锋访谈录音文字稿',
    introParas: [
      '2026 年 5 月 20 日，DeepSeek 创始人梁文锋出席了一场面向投资人的交流会。本站收录的是这场会议录音的完整逐字稿：音频总时长约 3 小时 44 分钟，整理为 19 章，前 12 章是梁文锋的主题分享，后 7 章是投资人现场提问与他的回应实录。',
      '它不是一篇媒体专访，而是一场内部交流会的录音整理，因此内容比公开采访更直接：梁文锋在会上解释了 DeepSeek 为什么坚持开源、模型定价为什么定在「十个月回本、约六倍利润」的位置、从 CoT 到 Agent 再到持续学习的技术阶梯怎么走、和海外头部实验室的差距到底是不是只剩算力、国产芯片绕开 CUDA 护城河的窗口期还有多久，以及一家「没有组织、只有愿景」的公司是怎么被组织起来的。',
      '全文按主题拆章，每一章都是一个可以单独阅读和分享的页面；下方是完整章节目录，也可以在顶部的分章导读版里带着逻辑脉络图通读。',
    ],
    introFacts: [
      ['会议时间', '2026 年 5 月 20 日'],
      ['音频时长', '约 3 小时 44 分钟'],
      ['发言人', '梁文锋（DeepSeek 创始人）'],
      ['形式', '投资者交流会 · 主题分享 + 现场问答'],
      ['整理方式', '语音识别自动转写 · AI 校订分章'],
      ['篇幅', '19 章 · 中英双语'],
    ],
    notFoundTitle: '页面不存在 · 梁文锋投资者交流会实录',
    notFoundHeading: '这一页不在这份逐字稿里',
    notFoundBody: '你访问的地址不存在，可能是链接拼错或已经失效。这份录音稿共 19 章，下方是完整目录。',
    notFoundHome: '回到首页',
  },
  en: {
    lang: 'en-US', ogLocale: 'en_US', ogLocaleAlt: 'zh_CN',
    homeHref: 'index.en', homeUrl: SITE + '/index.en',
    chapterHref: (id) => `${id}.en`,
    chapterUrl: (id) => `${SITE}/${id}.en`,
    chapterFile: (id) => `${id}.en.html`,
    altChapterHref: (id) => id,
    siteName: 'Liang Wenfeng Investor Meeting Transcript',
    crumbHome: 'Home',
    part: (p) => (p === 1 ? 'Part 1 - Prepared Remarks' : 'Part 2 - Investor Q&A'),
    chapterNo: (n) => `Chapter ${n}`,
    timeLabel: 'Recording timestamp',
    qLabel: 'Investor question',
    aLabel: 'Liang Wenfeng responds',
    prev: '<- Previous', next: 'Next ->',
    openInGuide: 'Open this chapter in the guided reader',
    langToggle: { text: '中', href: './', title: '切换到中文' },
    themeTitle: 'Toggle light / dark theme',
    fontToggle: false,
    title: (c) => `${c.title} | Liang Wenfeng Investor Meeting, Ch. ${c.num}`,
    desc: (c) => clamp(`${c.abstract} From the May 20, 2026 investor meeting recording of DeepSeek founder Liang Wenfeng.`, 160),
    keywords: (c) => `Liang Wenfeng,Liang Wenfeng interview,Liang Wenfeng transcript,DeepSeek,investor meeting,meeting recording,full transcript`,
    footerHeading: 'All chapters - Liang Wenfeng investor meeting transcript',
    footerLead: 'On May 20, 2026, DeepSeek founder Liang Wenfeng spoke and took questions for roughly 3 hours and 44 minutes. Below is the complete chapter index of that meeting recording; each chapter is a standalone page.',
    footerPart: (p) => (p === 1 ? 'Part 1 - Prepared Remarks (Ch. 1-12)' : 'Part 2 - Investor Q&A (Ch. 13-19)'),
    footerMeta: `This transcript was produced by automatic speech recognition and edited with AI; speakers are not separately labelled, and chapter titles and summaries are editorial. Names and figures may contain recognition errors. · <a href="./">中文版</a>`,
    disclaimer: 'This transcript was produced by automatic speech recognition and edited with AI. Speakers are not separately labelled; chapter titles, summaries and the argument map are editorial aids. Names and figures may contain recognition errors — refer to the original recording. Liang Wenfeng noted during the meeting that some figures are sensitive; please do not redistribute.',
    homeTitle: 'Liang Wenfeng Interview Transcript: DeepSeek Investor Meeting (May 20, 2026)',
    homeDesc: 'Full transcript of DeepSeek founder Liang Wenfeng\'s May 20, 2026 investor meeting — a 3-hour-44-minute recording organized into 19 chapters.',
    articleName: 'Liang Wenfeng 2026 Investor Meeting - Full Transcript',
    introHeading: 'About this Liang Wenfeng meeting transcript',
    introParas: [
      'On May 20, 2026, DeepSeek founder Liang Wenfeng spoke at a meeting with investors. This site holds the complete transcript of that meeting recording: roughly 3 hours and 44 minutes of audio, organized into 19 chapters — the first 12 are his prepared remarks, the last 7 are the live investor Q&A.',
      'This is not a press interview but an edited recording of a closed-door meeting, which makes it more direct than most public interviews. Liang Wenfeng explains why DeepSeek stays committed to open source, why pricing is set at "ten months to break even, about six times cost", how the technology ladder runs from CoT to agents to continual learning, whether the gap to the leading overseas labs really comes down to compute alone, how long the window stays open for domestic chips to work around the CUDA moat, and how a company with "no organization, only a vision" holds itself together.',
      'The transcript is split by topic, and every chapter is a page you can read and share on its own. The full chapter index is below; you can also read it in the guided reader with the argument map.',
    ],
    introFacts: [
      ['Date', 'May 20, 2026'],
      ['Audio length', 'approx. 3h 44m'],
      ['Speaker', 'Liang Wenfeng, founder of DeepSeek'],
      ['Format', 'Investor meeting - prepared remarks + live Q&A'],
      ['Method', 'Automatic speech recognition, AI-edited into chapters'],
      ['Length', '19 chapters, Chinese and English'],
    ],
    notFoundTitle: 'Page not found - Liang Wenfeng Investor Meeting Transcript',
    notFoundHeading: 'This page is not part of the transcript',
    notFoundBody: 'The address you followed does not exist — it may be mistyped or out of date. The transcript has 19 chapters; the full index is below.',
    notFoundHome: 'Back to the homepage',
  },
};

// ---------------------------------------------------------------- 结构化数据

const PERSON = {
  '@type': 'Person',
  name: '梁文锋',
  alternateName: ['Liang Wenfeng', '梁文峰'],
  jobTitle: 'Founder & CEO',
  worksFor: { '@type': 'Organization', name: 'DeepSeek', alternateName: '深度求索' },
};

const PUBLISHER = { '@type': 'Organization', name: 'liangwenfeng.art', url: SITE + '/' };

function articleNode(t, { url, headline, description, part, chapters }) {
  return {
    '@type': 'Article',
    '@id': url + '#article',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    headline,
    description,
    inLanguage: t.lang,
    datePublished: MEETING_DATE,
    dateModified: BUILD_DATE,
    author: PUBLISHER,
    publisher: PUBLISHER,
    about: [PERSON, { '@type': 'Organization', name: 'DeepSeek', alternateName: '深度求索' }],
    isBasedOn: {
      '@type': 'Event',
      name: t.lang === 'zh-CN' ? '梁文锋投资者交流会' : 'Liang Wenfeng investor meeting',
      startDate: MEETING_DATE,
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: { '@type': 'Place', name: t.lang === 'zh-CN' ? '未公开' : 'Undisclosed' },
      performer: PERSON,
    },
    ...(part ? { articleSection: part } : {}),
    ...(chapters ? { hasPart: chapters } : {}),
  };
}

function breadcrumbNode(t, items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem', position: i + 1, name: it.name, item: it.url,
    })),
  };
}

// ---------------------------------------------------------------- 页面片段

function proseHTML(t, paragraphs) {
  let out = '';
  let type = null;
  let buf = [];
  const label = (ty) =>
    ty === 'q' ? `<div class="qa-label q">${esc(t.qLabel)}</div>`
    : ty === 'a' ? `<div class="qa-label a">${esc(t.aLabel)}</div>` : '';
  const flush = () => {
    if (!buf.length) return;
    const ps = buf.map((x) => `<p>${esc(x)}</p>`).join('\n');
    out += (type === 'q' || type === 'a')
      ? `<div class="qa-block ${type}">${label(type)}${ps}</div>\n`
      : ps + '\n';
    buf = [];
  };
  (paragraphs || []).forEach((p) => {
    if (p.type !== type) { flush(); type = p.type; }
    buf.push(p.text);
  });
  flush();
  return out;
}

/**
 * 首页专用的静态导语。SPA 的 hero 是 JS 渲染的，不执行 JS 的爬虫（百度、
 * 多数社交抓取器）看首页时只剩导航壳子，这段是它们能读到的首页正文。
 */
function seoIntro(t) {
  return `<section class="seo-intro">
  <div class="seo-footer-inner">
    <h2>${esc(t.introHeading)}</h2>
${t.introParas.map((p) => `    <p>${esc(p)}</p>`).join('\n')}
    <dl class="seo-facts">
${t.introFacts.map(([k, v]) => `      <div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('\n')}
    </dl>
  </div>
</section>`;
}

function seoFooter(t, chapters) {
  const list = (part) => chapters.filter((c) => c.part === part).map((c) => `
      <li><a href="${t.chapterHref(c.id)}"><span class="sl-t"><span class="sl-n">${String(c.num).padStart(2, '0')}</span>${esc(c.title)}</span><span class="sl-a">${esc(c.abstract)}</span></a></li>`).join('');
  return `<footer class="seo-footer">
  <div class="seo-footer-inner">
    <h2>${esc(t.footerHeading)}</h2>
    <p class="seo-lead">${esc(t.footerLead)}</p>
    <div class="seo-part">${esc(t.footerPart(1))}</div>
    <ol class="seo-list">${list(1)}
    </ol>
    <div class="seo-part">${esc(t.footerPart(2))}</div>
    <ol class="seo-list">${list(2)}
    </ol>
    <p class="seo-meta">${t.footerMeta}</p>
  </div>
</footer>`;
}

function toggles(t, langHref = t.langToggle.href) {
  const font = t.fontToggle
    ? `<button class="font-toggle" id="fontToggle" title="切换字体">黑</button>\n` : '';
  return `${font}<a class="lang-toggle" id="langToggle" href="${langHref}" title="${esc(t.langToggle.title)}">${t.langToggle.text}</a>
<button class="theme-toggle" id="themeToggle" title="${esc(t.themeTitle)}">☾</button>`;
}

/** 章节页脚本：只保留主题 / 字体偏好与阅读进度条，与 SPA 用同一批 localStorage 键。 */
function chapterScript(withFont) {
  return `<script>
(function(){
  var root = document.documentElement;
  var themeToggle = document.getElementById('themeToggle');
  function applyTheme(theme){
    if(theme === 'light'){ root.setAttribute('data-theme','light'); themeToggle.textContent = '☀'; }
    else { root.removeAttribute('data-theme'); themeToggle.textContent = '☾'; }
  }
  var prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  applyTheme(localStorage.getItem('transcript-theme') || (prefersLight ? 'light' : 'dark'));
  themeToggle.addEventListener('click', function(){
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    localStorage.setItem('transcript-theme', next);
    applyTheme(next);
  });
${withFont ? `
  var fonts = ['hei','kai','song','fangsong'];
  var labels = {hei:'黑',kai:'楷',song:'宋',fangsong:'仿'};
  var names = {hei:'黑体',kai:'楷体',song:'宋体',fangsong:'仿宋'};
  var fontToggle = document.getElementById('fontToggle');
  function normalizeFont(f){ return fonts.indexOf(f) >= 0 ? f : 'hei'; }
  function applyFont(f){
    var cur = normalizeFont(f);
    if(cur === 'hei') root.removeAttribute('data-font'); else root.setAttribute('data-font', cur);
    var next = fonts[(fonts.indexOf(cur) + 1) % fonts.length];
    fontToggle.textContent = labels[cur];
    fontToggle.title = '当前：' + names[cur] + '，点击切换到' + names[next];
  }
  applyFont(localStorage.getItem('transcript-font') || 'hei');
  fontToggle.addEventListener('click', function(){
    var cur = normalizeFont(localStorage.getItem('transcript-font') || 'hei');
    var next = fonts[(fonts.indexOf(cur) + 1) % fonts.length];
    localStorage.setItem('transcript-font', next);
    applyFont(next);
  });
` : ''}
  var progress = document.getElementById('progress');
  function updateProgress(){
    var max = root.scrollHeight - window.innerHeight;
    var ratio = max > 0 ? window.scrollY / max : 0;
    progress.style.transform = 'scaleX(' + Math.min(1, Math.max(0, ratio)) + ')';
  }
  window.addEventListener('scroll', updateProgress, {passive:true});
  updateProgress();
})();
</script>`;
}

const CHAPTER_CSS = `
/* ---- 静态章节页专用 ---- */
.chapter-page{ position:relative; z-index:1; }
.chapter-page .page{ max-width:var(--content-max); margin:0 auto; padding:64px 32px 96px; }
.open-in-guide{
  display:inline-block; margin-top:34px; font-family:var(--mono); font-size:14px;
  color:var(--gold); text-decoration:none; border-bottom:1px dashed var(--line-strong);
  padding-bottom:3px;
}
.open-in-guide:hover{ color:var(--gold-bright); border-bottom-color:var(--gold); }
.chapter-page .crumb a{ text-decoration:none; }
@media (max-width:900px){ .chapter-page .page{ padding:76px 22px 72px; } }
`;

function chapterPage(t, c, prev, next, chapters) {
  const url = t.chapterUrl(c.id);
  const title = t.title(c);
  const desc = t.desc(c);
  const graph = [
    articleNode(t, { url, headline: c.title, description: desc, part: t.part(c.part) }),
    breadcrumbNode(t, [
      { name: t.crumbHome, url: t.homeUrl },
      { name: t.part(c.part), url: t.homeUrl },
      { name: c.title, url },
    ]),
  ];
  return `<!doctype html>
<html lang="${t.lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="keywords" content="${esc(t.keywords(c))}">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="zh-Hans" href="${SITE}/${c.id}">
<link rel="alternate" hreflang="en" href="${SITE}/${c.id}.en">
<link rel="alternate" hreflang="x-default" href="${SITE}/${c.id}">
<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large">
<meta property="og:type" content="article">
<meta property="og:site_name" content="${esc(t.siteName)}">
<meta property="og:locale" content="${t.ogLocale}">
<meta property="og:locale:alternate" content="${t.ogLocaleAlt}">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="article:published_time" content="${MEETING_DATE}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<link rel="icon" href="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20100%20100'%3E%3Ctext%20y='.9em'%20font-size='90'%3E%F0%9F%93%BC%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600;700;900&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
<noscript><link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600;700;900&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet"></noscript>
<style>${t.__style}${CHAPTER_CSS}</style>
<script type="application/ld+json">
${jsonld({ '@context': 'https://schema.org', '@graph': graph })}
</script>
</head>
<body>

<div class="watermark"><span class="wm1">${t.lang === 'zh-CN' ? '机密档案 · 机密档案 · 机密档案' : 'CONFIDENTIAL · CONFIDENTIAL'}</span><span class="wm2">CONFIDENTIAL · CONFIDENTIAL</span></div>
<div id="progress"></div>
${toggles(t, t.altChapterHref(c.id))}

<article class="chapter-page">
  <div class="page">
    <nav class="crumb">
      <a href="${t.homeHref}">${esc(t.crumbHome)}</a><span class="sep">/</span>
      <a href="${t.homeHref}">${esc(t.part(c.part))}</a><span class="sep">/</span>
      <span>${esc(t.chapterNo(c.num))}</span>
    </nav>
    <div class="timebadge">${esc(t.timeLabel)} ${esc(c.rawTimestamp)}</div>
    <h1 class="chapter-title">${esc(c.title)}</h1>
    <p class="chapter-abstract">${esc(c.abstract)}</p>
    <blockquote class="pullquote">${esc(c.quote)}</blockquote>
    <div class="prose">
${proseHTML(t, c.paragraphs)}    </div>

    <div class="chapter-footer">
      ${prev ? `<a class="foot-link prev" href="${t.chapterHref(prev.id)}"><div class="fl-k">${esc(t.prev)}</div><div class="fl-t">${esc(prev.title)}</div></a>` : '<div class="foot-link foot-empty"></div>'}
      ${next ? `<a class="foot-link next" href="${t.chapterHref(next.id)}"><div class="fl-k">${esc(t.next)}</div><div class="fl-t">${esc(next.title)}</div></a>` : '<div class="foot-link foot-empty"></div>'}
    </div>

    <a class="open-in-guide" href="${t.homeHref}#/${c.id}">${esc(t.openInGuide)} →</a>

    <div class="disclaimer">${esc(t.disclaimer)}</div>
  </div>
</article>

${seoFooter(t, chapters)}

${chapterScript(t.fontToggle)}
</body>
</html>
`;
}

// ---------------------------------------------------------------- 404

/**
 * Cloudflare Pages 只有在存在 404.html 时才会对未匹配路径返回真正的 404；
 * 缺了它，任意路径都会以 200 返回首页，Google 会判成 soft 404 并可能收录
 * 无限多个重复 URL。这个页面同时给读者一份可点的章节目录。
 */
function notFoundPage(t, chapters) {
  return `<!doctype html>
<html lang="${t.lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(t.notFoundTitle)}</title>
<meta name="robots" content="noindex,follow">
<link rel="icon" href="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20100%20100'%3E%3Ctext%20y='.9em'%20font-size='90'%3E%F0%9F%93%BC%3C/text%3E%3C/svg%3E">
<style>${t.__style}${CHAPTER_CSS}</style>
</head>
<body>

<div class="watermark"><span class="wm1">${t.lang === 'zh-CN' ? '机密档案 · 机密档案 · 机密档案' : 'CONFIDENTIAL · CONFIDENTIAL'}</span><span class="wm2">CONFIDENTIAL · CONFIDENTIAL</span></div>

<article class="chapter-page">
  <div class="page">
    <div class="timebadge">404</div>
    <h1 class="chapter-title">${esc(t.notFoundHeading)}</h1>
    <p class="chapter-abstract">${esc(t.notFoundBody)}</p>
    <a class="open-in-guide" href="${t.homeHref}">${esc(t.notFoundHome)} →</a>
  </div>
</article>

${seoFooter(t, chapters)}
</body>
</html>
`;
}

// ---------------------------------------------------------------- 首页注入

function homePage(t, html, chapters) {
  const graph = [
    {
      '@type': 'WebSite',
      '@id': SITE + '/#website',
      url: SITE + '/',
      name: t.siteName,
      inLanguage: t.lang,
      publisher: PUBLISHER,
    },
    articleNode(t, {
      url: t.homeUrl,
      headline: t.articleName,
      description: t.homeDesc,
      chapters: chapters.map((c) => ({
        '@type': 'Article',
        '@id': t.chapterUrl(c.id) + '#article',
        url: t.chapterUrl(c.id),
        name: c.title,
        headline: c.title,
        description: c.abstract,
        position: c.num,
      })),
    }),
    PERSON,
    {
      '@type': 'ItemList',
      name: t.footerHeading,
      numberOfItems: chapters.length,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      itemListElement: chapters.map((c) => ({
        '@type': 'ListItem', position: c.num, name: c.title, url: t.chapterUrl(c.id),
      })),
    },
    breadcrumbNode(t, [{ name: t.crumbHome, url: t.homeUrl }]),
  ];
  const out = html
    .replace('<!--SEO_JSONLD-->', `<script type="application/ld+json">\n${jsonld({ '@context': 'https://schema.org', '@graph': graph })}\n</script>`)
    .replace('<!--SEO_FOOTER-->', seoIntro(t) + '\n\n' + seoFooter(t, chapters));
  if (out.includes('<!--SEO_')) throw new Error('首页 SEO 占位符未全部替换');
  return out;
}

// ---------------------------------------------------------------- sitemap / robots

function sitemap(zhChapters) {
  const entry = (loc, alts, priority, changefreq) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${BUILD_DATE}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${alts.map(([hl, href]) => `    <xhtml:link rel="alternate" hreflang="${hl}" href="${href}"/>`).join('\n')}
  </url>`;

  const homeAlts = [['zh-Hans', SITE + '/'], ['en', SITE + '/index.en'], ['x-default', SITE + '/']];
  const urls = [
    entry(SITE + '/', homeAlts, '1.0', 'weekly'),
    entry(SITE + '/index.en', homeAlts, '0.9', 'weekly'),
  ];
  for (const c of zhChapters) {
    const zh = `${SITE}/${c.id}`;
    const en = `${SITE}/${c.id}.en`;
    const alts = [['zh-Hans', zh], ['en', en], ['x-default', zh]];
    urls.push(entry(zh, alts, '0.8', 'monthly'));
    urls.push(entry(en, alts, '0.7', 'monthly'));
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
}

const ROBOTS = `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;

// ---------------------------------------------------------------- 主流程

function main() {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  const zhHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const enHtml = fs.readFileSync(path.join(ROOT, 'index.en.html'), 'utf8');
  const zhChapters = loadChapters('chapters.js');
  const enChapters = loadChapters('chapters.en.js');

  if (zhChapters.length !== enChapters.length) {
    throw new Error(`中英章节数不一致：${zhChapters.length} vs ${enChapters.length}`);
  }

  L.zh.__style = extractStyle(zhHtml);
  L.en.__style = extractStyle(enHtml);

  const write = (name, content) => {
    fs.writeFileSync(path.join(OUT, name), content);
    return name;
  };

  // 原样搬运的数据文件
  for (const f of ['chapters.js', 'chapters.en.js']) {
    fs.copyFileSync(path.join(ROOT, f), path.join(OUT, f));
  }

  write('index.html', homePage(L.zh, zhHtml, zhChapters));
  write('index.en.html', homePage(L.en, enHtml, enChapters));

  for (const [t, list] of [[L.zh, zhChapters], [L.en, enChapters]]) {
    list.forEach((c, i) => {
      write(t.chapterFile(c.id), chapterPage(t, c, list[i - 1], list[i + 1], list));
    });
  }

  write('404.html', notFoundPage(L.zh, zhChapters));
  write('sitemap.xml', sitemap(zhChapters));
  write('robots.txt', ROBOTS);

  const files = fs.readdirSync(OUT);
  const bytes = files.reduce((n, f) => n + fs.statSync(path.join(OUT, f)).size, 0);
  console.log(`✓ 构建完成：${files.length} 个文件 / ${(bytes / 1024 / 1024).toFixed(2)} MB → .deploy/`);
  console.log(`  中文章节页 ${zhChapters.length} 个，英文章节页 ${enChapters.length} 个，sitemap 收录 ${zhChapters.length * 2 + 2} 个 URL`);
}

main();
