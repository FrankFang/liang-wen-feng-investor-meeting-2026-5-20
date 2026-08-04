export const SITE = "https://liangwenfeng.art";
export const MEETING_DATE = "2026-05-20";

export const isEnPath = (pathname) => pathname === "/index.en" || /\.en$/.test(pathname);

export function fmtTime(raw) {
  if (!raw) return "";
  const parts = raw.split(":").map(Number);
  if (parts.length === 3) {
    const [h, m] = parts;
    return h > 0 ? `${h}:${String(m).padStart(2, "0")}` : `0:${String(m).padStart(2, "0")}`;
  }
  return raw;
}

export const copy = {
  zh: {
    lang: "zh-CN",
    siteName: "梁文锋投资者交流会实录",
    wm1: "机密档案 · 机密档案 · 机密档案",
    wm2: "CONFIDENTIAL · CONFIDENTIAL",
    seal: "梁",
    mastheadTitle1: "梁文锋",
    mastheadTitle2: "投资者交流会",
    mastheadSub: "2026.05.20 · 录音逐字稿 · 分章导读",
    collapseTitle: "折叠 / 展开导航",
    searchPlaceholder: "搜索章节…（如“开源”“芯片”）",
    homeLink: "首页 · 逻辑全览",
    part1: "Part 1 · 主题分享",
    part2: "Part 2 · 投资人问答",
    partName: (p) => (p === 1 ? "Part 1 · 主题分享" : "Part 2 · 投资人问答"),
    langToggleText: "EN",
    langToggleTitle: "Switch to English",
    themeTitle: "切换亮 / 暗主题",
    fontTitle: "切换字体",
    kicker: "录音逐字稿 · 内部整理",
    heroHTML: "做一点<em>对人类有用</em>的事，<br>然后保持<em>克制</em>。",
    heroDesc:
      "这是 DeepSeek 创始人梁文锋在 2026 年 5 月 20 日投资者交流会上的完整发言与问答记录。音频《deepseek 0520.m4a》，总时长约 3 小时 44 分钟。本页将逐字稿拆分为 19 个章节，方便分主题阅读；下方是全篇论证脉络的可视化梳理。",
    filecard: [
      ["音频时长", "约 3 小时 44 分钟"],
      ["整理方式", "语音识别自动转写 · AI 整理分章"],
      ["说话人", "未区分说话人 · 以内容语境归类"],
    ],
    introHeading: "关于这份梁文锋访谈录音文字稿",
    introParas: [
      "2026 年 5 月 20 日，DeepSeek 创始人梁文锋出席了一场面向投资人的交流会。本站收录的是这场会议录音的完整逐字稿：音频总时长约 3 小时 44 分钟，整理为 19 章，前 12 章是梁文锋的主题分享，后 7 章是投资人现场提问与他的回应实录。",
      "它不是一篇媒体专访，而是一场内部交流会的录音整理，因此内容比公开采访更直接：梁文锋在会上解释了 DeepSeek 为什么坚持开源、模型定价为什么定在「十个月回本、约六倍利润」的位置、从 CoT 到 Agent 再到持续学习的技术阶梯怎么走、和海外头部实验室的差距到底是不是只剩算力、国产芯片绕开 CUDA 护城河的窗口期还有多久，以及一家「没有组织、只有愿景」的公司是怎么被组织起来的。",
      "全文按主题拆章，每一章都是一个可以单独阅读和分享的页面；下方是完整章节目录，也可以在顶部的分章导读版里带着逻辑脉络图通读。",
    ],
    introFacts: [
      ["会议时间", "2026 年 5 月 20 日"],
      ["音频时长", "约 3 小时 44 分钟"],
      ["发言人", "梁文锋（DeepSeek 创始人）"],
      ["形式", "投资者交流会 · 主题分享 + 现场问答"],
      ["整理方式", "语音识别自动转写 · AI 校订分章"],
      ["篇幅", "19 章 · 中英双语"],
    ],
    figNum: "FIG.1",
    figTitle: "全篇逻辑流程",
    figSub:
      "从“愿景”出发，“克制”是贯穿全场的方法论；技术上沿着一级级台阶走向 AGI；资源差距靠工程手段消解；商业化被有意放在次要位置；最终胜负手落在成本、时间与体验三点上。",
    idxPart1: "Part 1 · 主题分享（19 章中的第 1–12 章）",
    idxPart2: "Part 2 · 投资人问答（第 13–19 章）",
    disclaimer:
      "本稿由语音识别自动转写并经 AI 整理，未区分说话人，章节标题、摘要与逻辑流程图为编者归纳，用于辅助阅读；个别专有名词与数字可能存在识别误差，请以原录音为准。梁文锋在会中提示部分数字与情况较为敏感，请勿对外传播或录屏分享。",
    flowHTML: `
    <div class="flow-scroll">
      <svg viewBox="0 0 1400 800" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--gold)"></path>
          </marker>
          <marker id="arrowRed" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--stamp-bright)"></path>
          </marker>
          <linearGradient id="panelGrad" x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stop-color="var(--panel)"></stop>
            <stop offset="100%" stop-color="var(--panel-alt)"></stop>
          </linearGradient>
        </defs>

        <!-- row1 connectors -->
        <path class="flowline animated" marker-end="url(#arrow)" d="M340,115 L376,115"></path>
        <path class="flowline animated" marker-end="url(#arrow)" d="M680,115 L716,115"></path>
        <path class="flowline animated" marker-end="url(#arrow)" d="M1020,115 L1056,115"></path>

        <!-- serpentine connector row1->row2 -->
        <path class="flowline animated" marker-end="url(#arrow)" d="M1210,185 C1210,260 190,255 190,326"></path>

        <!-- row2 connectors -->
        <path class="flowline animated" marker-end="url(#arrow)" d="M340,395 L376,395"></path>
        <path class="flowline animated" marker-end="url(#arrow)" d="M680,395 L716,395"></path>
        <path class="flowline animated" marker-end="url(#arrow)" d="M1020,395 L1056,395"></path>

        <!-- row2 -> medallion -->
        <path class="flowline animated" marker-end="url(#arrow)" d="M1140,465 C1140,540 850,560 770,585"></path>

        <!-- direct organization -> medallion (dashed, secondary thread) -->
        <path class="flowline dashed" marker-end="url(#arrowRed)" d="M1330,185 C1380,320 1380,520 800,640"></path>
        <text class="flow-annot" x="1310" y="270" text-anchor="middle">团队稳定</text>
        <text class="flow-annot" x="1310" y="284" text-anchor="middle">→ 一定能做成</text>

        <!-- Row 1 nodes -->
        <foreignObject x="40" y="50" width="300" height="130">
          <div xmlns="http://www.w3.org/1999/xhtml" class="flow-card">
            <div class="fc-tag">01 出发点</div>
            <h3>愿景</h3>
            <p>怀着善意做事，不是以商业利益最大化为方式组织公司；愿景驱动，而非规章与 KPI。</p>
          </div>
        </foreignObject>

        <foreignObject x="380" y="50" width="300" height="130">
          <div xmlns="http://www.w3.org/1999/xhtml" class="flow-card">
            <div class="fc-tag">02 方法论</div>
            <h3>克制</h3>
            <p>AI 的利益太大，独占者必被历史抛弃；越克制，越可能做成。这是一种商业上的战略。</p>
          </div>
        </foreignObject>

        <foreignObject x="720" y="50" width="300" height="130">
          <div xmlns="http://www.w3.org/1999/xhtml" class="flow-card">
            <div class="fc-tag">03 商业实践</div>
            <h3>开源与定价</h3>
            <p>十个月回本、约六倍合理利润；开源与商业化在此前提下并不冲突。</p>
          </div>
        </foreignObject>

        <foreignObject x="1060" y="50" width="300" height="130">
          <div xmlns="http://www.w3.org/1999/xhtml" class="flow-card">
            <div class="fc-tag">04 组织基石</div>
            <h3>共识与团队稳定</h3>
            <p>公司靠共识决策，没有强组织；唯一不可退让的核心利益，是保持团队的稳定性。</p>
          </div>
        </foreignObject>

        <!-- Row 2 nodes -->
        <foreignObject x="40" y="330" width="300" height="130">
          <div xmlns="http://www.w3.org/1999/xhtml" class="flow-card">
            <div class="fc-tag">05 技术路线</div>
            <h3>技术阶梯</h3>
            <p>每一步都基于前一步，没有白走的路。</p>
            <div class="chips"><span>CoT</span><span>Agent</span><span>持续学习</span><span>奇点</span><span>具身</span></div>
          </div>
        </foreignObject>

        <foreignObject x="380" y="330" width="300" height="130">
          <div xmlns="http://www.w3.org/1999/xhtml" class="flow-card">
            <div class="fc-tag">06 现实约束</div>
            <h3>资源是唯一差距</h3>
            <p>算力落后但生态可追：TileLang 瓦解 CUDA 护城河，国产芯片差的只是产能。</p>
          </div>
        </foreignObject>

        <foreignObject x="720" y="330" width="300" height="130">
          <div xmlns="http://www.w3.org/1999/xhtml" class="flow-card">
            <div class="fc-tag">07 商业定位</div>
            <h3>C 端 / B 端是副产品</h3>
            <p>不追求做下一个字节；C 端、B 端都是通往 AGI 路上“顺手捡的芝麻”。</p>
          </div>
        </foreignObject>

        <foreignObject x="1060" y="330" width="300" height="130">
          <div xmlns="http://www.w3.org/1999/xhtml" class="flow-card">
            <div class="fc-tag">08 行业判断</div>
            <h3>终局三要素</h3>
            <p>模型差距终将收敛，胜负只看成本、时间、体验；暴利不符合客观规律。</p>
          </div>
        </foreignObject>

        <!-- medallion -->
        <circle cx="700" cy="650" r="98" fill="url(#panelGrad)" stroke="var(--gold)" stroke-width="1.4"></circle>
        <circle cx="700" cy="650" r="112" fill="none" stroke="var(--line-strong)" stroke-width="1" stroke-dasharray="2 6"></circle>
        <foreignObject x="602" y="552" width="196" height="196">
          <div xmlns="http://www.w3.org/1999/xhtml" class="medallion-card">
            <div class="m-kicker">终极目标</div>
            <h3>AGI</h3>
            <p>由很多东西组成的渐进过程，没有临界点，但会越来越快。</p>
          </div>
        </foreignObject>
      </svg>
    </div>`,
    crumbHome: "首页",
    chapterNo: (n) => `第 ${n} 章`,
    timeLabel: "录音时间点",
    qLabel: "投资人提问",
    aLabel: "梁文锋回应",
    prev: "← 上一章",
    next: "下一章 →",
    notFoundTitle: "页面不存在 · 梁文锋投资者交流会实录",
    notFoundHeading: "这一页不在这份逐字稿里",
    notFoundBody: "你访问的地址不存在，可能是链接拼错或已经失效。这份录音稿共 19 章，下方是完整目录。",
    notFoundHome: "回到首页",
    homeTitle: "梁文锋专访实录：DeepSeek 投资者交流会录音全文（2026.5.20）",
    homeDesc:
      "DeepSeek 创始人梁文锋 2026 年 5 月 20 日投资者交流会专访录音逐字稿全文，3 小时 44 分钟会议录音完整整理为 19 章。",
    homeKeywords:
      "梁文锋,梁文锋专访,梁文锋采访,梁文锋访谈,梁文锋演讲实录,梁文锋投资者交流会,DeepSeek,DeepSeek 创始人,会议录音,录音文字稿,逐字稿,全文实录,AGI,开源大模型,国产芯片",
    articleName: "梁文锋 2026 投资者交流会录音逐字稿全文",
    chapterTitle: (c) => `${c.title}｜梁文锋投资者交流会实录 第${c.num}章`,
    chapterDesc: (c) =>
      clamp(`${c.abstract}梁文锋原话：“${c.quote}”本章出自 2026 年 5 月 20 日 DeepSeek 创始人梁文锋投资者交流会会议录音逐字稿。`, 150),
    keywords: (c) =>
      `梁文锋,梁文锋专访,梁文锋采访,梁文锋${c.title.split(/[：:，,、]/)[0]},DeepSeek,投资者交流会,会议录音,录音文字稿,逐字稿,全文实录`,
    footerHeading: "全部章节 · 梁文锋投资者交流会逐字稿目录",
    footerLead:
      "2026 年 5 月 20 日，DeepSeek 创始人梁文锋在投资者交流会上做了约 3 小时 44 分钟的分享与问答。以下是这份会议录音逐字稿的完整章节目录，每章都是一个可单独阅读的页面。",
    footerPart: (p) => (p === 1 ? "Part 1 · 主题分享（第 1–12 章）" : "Part 2 · 投资人问答（第 13–19 章）"),
  },
  en: {
    lang: "en-US",
    siteName: "Liang Wenfeng Investor Meeting Transcript",
    wm1: "CONFIDENTIAL FILE - CONFIDENTIAL FILE",
    wm2: "CONFIDENTIAL - CONFIDENTIAL",
    seal: "LW",
    mastheadTitle1: "Liang Wenfeng",
    mastheadTitle2: "Investor Meeting",
    mastheadSub: "May 20, 2026 - Audio transcript - Chapter guide",
    collapseTitle: "Collapse / expand navigation",
    searchPlaceholder: "Search chapters... e.g. open source, chips",
    homeLink: "Home - Argument Map",
    part1: "Part 1 - Prepared Remarks",
    part2: "Part 2 - Investor Q&A",
    partName: (p) => (p === 1 ? "Part 1 - Prepared Remarks" : "Part 2 - Investor Q&A"),
    langToggleText: "中",
    langToggleTitle: "切换到中文",
    themeTitle: "Toggle light / dark theme",
    fontTitle: "切换字体",
    kicker: "Audio transcript - Internal notes",
    heroHTML:
      "Do something <em>useful for humanity</em>,<br>and practice <em>restraint</em>.",
    heroDesc:
      "This is the full remarks and Q&A transcript from DeepSeek founder Liang Wenfeng's investor meeting on May 20, 2026. The audio file, <i>deepseek 0520.m4a</i>, runs about 3 hours and 44 minutes. This page divides the transcript into 19 chapters for easier topic-by-topic reading; below is a visual map of the argument across the full session.",
    filecard: [
      ["Audio length", "About 3 hr 44 min"],
      ["Method", "ASR transcript - AI chaptering"],
      ["Speakers", "Not diarized - Classified by context"],
    ],
    introHeading: "About this Liang Wenfeng meeting transcript",
    introParas: [
      "On May 20, 2026, DeepSeek founder Liang Wenfeng spoke at a meeting with investors. This site holds the complete transcript of that meeting recording: roughly 3 hours and 44 minutes of audio, organized into 19 chapters — the first 12 are his prepared remarks, the last 7 are the live investor Q&A.",
      "This is not a press interview but an edited recording of a closed-door meeting, which makes it more direct than most public interviews. Liang Wenfeng explains why DeepSeek stays committed to open source, why pricing is set at \"ten months to break even, about six times cost\", how the technology ladder runs from CoT to agents to continual learning, whether the gap to the leading overseas labs really comes down to compute alone, how long the window stays open for domestic chips to work around the CUDA moat, and how a company with \"no organization, only a vision\" holds itself together.",
      "The transcript is split by topic, and every chapter is a page you can read and share on its own. The full chapter index is below; you can also read it in the guided reader with the argument map.",
    ],
    introFacts: [
      ["Date", "May 20, 2026"],
      ["Audio length", "approx. 3h 44m"],
      ["Speaker", "Liang Wenfeng, founder of DeepSeek"],
      ["Format", "Investor meeting - prepared remarks + live Q&A"],
      ["Method", "Automatic speech recognition, AI-edited into chapters"],
      ["Length", "19 chapters, Chinese and English"],
    ],
    figNum: "FIG.1",
    figTitle: "Argument Flow",
    figSub:
      "The talk begins with \"vision,\" while \"restraint\" serves as the method running through the session. Technically, the path climbs step by step toward AGI; resource gaps are narrowed through engineering; commercialization is deliberately kept secondary; and the endgame comes down to cost, timing, and experience.",
    idxPart1: "Part 1 - Prepared Remarks (Chapters 1-12 of 19)",
    idxPart2: "Part 2 - Investor Q&A (Chapters 13-19)",
    disclaimer:
      "This transcript was generated by automatic speech recognition and organized with AI. Speakers are not separately identified. Chapter titles, summaries, and the argument map are editorial aids for reading. Some proper nouns and figures may contain recognition errors; the original audio should be treated as authoritative. Liang Wenfeng noted during the meeting that some numbers and details are sensitive; please do not distribute externally or share screen recordings.",
    flowHTML: `
    <div class="flow-scroll">
      <svg viewBox="0 0 1400 800" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--gold)"></path>
          </marker>
          <marker id="arrowRed" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--stamp-bright)"></path>
          </marker>
          <linearGradient id="panelGrad" x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stop-color="var(--panel)"></stop>
            <stop offset="100%" stop-color="var(--panel-alt)"></stop>
          </linearGradient>
        </defs>

        <!-- row1 connectors -->
        <path class="flowline animated" marker-end="url(#arrow)" d="M340,115 L376,115"></path>
        <path class="flowline animated" marker-end="url(#arrow)" d="M680,115 L716,115"></path>
        <path class="flowline animated" marker-end="url(#arrow)" d="M1020,115 L1056,115"></path>

        <!-- serpentine connector row1->row2 -->
        <path class="flowline animated" marker-end="url(#arrow)" d="M1210,185 C1210,260 190,255 190,326"></path>

        <!-- row2 connectors -->
        <path class="flowline animated" marker-end="url(#arrow)" d="M340,395 L376,395"></path>
        <path class="flowline animated" marker-end="url(#arrow)" d="M680,395 L716,395"></path>
        <path class="flowline animated" marker-end="url(#arrow)" d="M1020,395 L1056,395"></path>

        <!-- row2 -> medallion -->
        <path class="flowline animated" marker-end="url(#arrow)" d="M1140,465 C1140,540 850,560 770,585"></path>

        <!-- direct organization -> medallion (dashed, secondary thread) -->
        <path class="flowline dashed" marker-end="url(#arrowRed)" d="M1330,185 C1380,320 1380,520 800,640"></path>
        <text class="flow-annot" x="1310" y="270" text-anchor="middle">Team stability</text>
        <text class="flow-annot" x="1310" y="284" text-anchor="middle">-> makes AGI possible</text>

        <!-- Row 1 nodes -->
        <foreignObject x="40" y="50" width="300" height="160">
          <div xmlns="http://www.w3.org/1999/xhtml" class="flow-card">
            <div class="fc-tag">01 Starting Point</div>
            <h3>Vision</h3>
            <p>Act with goodwill, not around maximizing commercial gain; the company is organized by vision, not rules or KPIs.</p>
          </div>
        </foreignObject>

        <foreignObject x="380" y="50" width="300" height="160">
          <div xmlns="http://www.w3.org/1999/xhtml" class="flow-card">
            <div class="fc-tag">02 Method</div>
            <h3>Restraint</h3>
            <p>The upside of AI is too large to monopolize. The more restrained you are, the likelier you are to succeed.</p>
          </div>
        </foreignObject>

        <foreignObject x="720" y="50" width="300" height="160">
          <div xmlns="http://www.w3.org/1999/xhtml" class="flow-card">
            <div class="fc-tag">03 Commercial Practice</div>
            <h3>Open Source and Pricing</h3>
            <p>A ten-month payback and roughly sixfold reasonable profit; on that basis, open source and commercialization do not conflict.</p>
          </div>
        </foreignObject>

        <foreignObject x="1060" y="50" width="300" height="160">
          <div xmlns="http://www.w3.org/1999/xhtml" class="flow-card">
            <div class="fc-tag">04 Organizational Base</div>
            <h3>Consensus and Stability</h3>
            <p>Decisions rely on consensus rather than a rigid organization. The one non-negotiable core interest is team stability.</p>
          </div>
        </foreignObject>

        <!-- Row 2 nodes -->
        <foreignObject x="40" y="330" width="300" height="160">
          <div xmlns="http://www.w3.org/1999/xhtml" class="flow-card">
            <div class="fc-tag">05 Technical Path</div>
            <h3>The Technology Ladder</h3>
            <p>Each step builds on the one before it; none of the work is wasted.</p>
            <div class="chips"><span>CoT</span><span>Agent</span><span>Continuous learning</span><span>Singularity</span><span>Embodiment</span></div>
          </div>
        </foreignObject>

        <foreignObject x="380" y="330" width="300" height="160">
          <div xmlns="http://www.w3.org/1999/xhtml" class="flow-card">
            <div class="fc-tag">06 Real-World Constraint</div>
            <h3>Resources Are the Gap</h3>
            <p>Compute lags, but the ecosystem can catch up: TileLang erodes CUDA's moat, while domestic Chinese chips mainly lack capacity.</p>
          </div>
        </foreignObject>

        <foreignObject x="720" y="330" width="300" height="160">
          <div xmlns="http://www.w3.org/1999/xhtml" class="flow-card">
            <div class="fc-tag">07 Business Positioning</div>
            <h3>Consumer and Enterprise Are Byproducts</h3>
            <p>The goal is not to become the next ByteDance; consumer and enterprise products are incidental gains on the road to AGI.</p>
          </div>
        </foreignObject>

        <foreignObject x="1060" y="330" width="300" height="160">
          <div xmlns="http://www.w3.org/1999/xhtml" class="flow-card">
            <div class="fc-tag">08 Industry View</div>
            <h3>Three Endgame Factors</h3>
            <p>Model gaps will eventually narrow. The contest comes down to cost, timing, and experience; windfall margins are not sustainable.</p>
          </div>
        </foreignObject>

        <!-- medallion -->
        <circle cx="700" cy="650" r="98" fill="url(#panelGrad)" stroke="var(--gold)" stroke-width="1.4"></circle>
        <circle cx="700" cy="650" r="112" fill="none" stroke="var(--line-strong)" stroke-width="1" stroke-dasharray="2 6"></circle>
        <foreignObject x="602" y="552" width="196" height="196">
          <div xmlns="http://www.w3.org/1999/xhtml" class="medallion-card">
            <div class="m-kicker">Ultimate Goal</div>
            <h3>AGI</h3>
            <p>A gradual process made of many parts, with no sharp threshold, but accelerating over time.</p>
          </div>
        </foreignObject>
      </svg>
    </div>`,
    crumbHome: "Home",
    chapterNo: (n) => `Chapter ${n}`,
    timeLabel: "Audio timestamp",
    qLabel: "Investor Question",
    aLabel: "Liang Wenfeng",
    prev: "<- Previous",
    next: "Next ->",
    notFoundTitle: "Page not found - Liang Wenfeng Investor Meeting Transcript",
    notFoundHeading: "This page is not part of the transcript",
    notFoundBody:
      "The address you followed does not exist — it may be mistyped or out of date. The transcript has 19 chapters; the full index is below.",
    notFoundHome: "Back to the homepage",
    homeTitle: "Liang Wenfeng Interview Transcript: DeepSeek Investor Meeting (May 20, 2026)",
    homeDesc:
      "Full transcript of DeepSeek founder Liang Wenfeng's May 20, 2026 investor meeting — a 3-hour-44-minute recording organized into 19 chapters.",
    homeKeywords:
      "Liang Wenfeng,Liang Wenfeng interview,Liang Wenfeng transcript,DeepSeek,DeepSeek founder,investor meeting,meeting recording,full transcript,AGI,open source LLM,Chinese AI chips",
    articleName: "Liang Wenfeng 2026 Investor Meeting - Full Transcript",
    chapterTitle: (c) => `${c.title} | Liang Wenfeng Investor Meeting, Ch. ${c.num}`,
    chapterDesc: (c) =>
      clamp(`${c.abstract} From the May 20, 2026 investor meeting recording of DeepSeek founder Liang Wenfeng.`, 160),
    keywords: (c) =>
      `Liang Wenfeng,Liang Wenfeng interview,Liang Wenfeng transcript,DeepSeek,investor meeting,meeting recording,full transcript`,
    footerHeading: "All chapters - Liang Wenfeng investor meeting transcript",
    footerLead:
      "On May 20, 2026, DeepSeek founder Liang Wenfeng spoke and took questions for roughly 3 hours and 44 minutes. Below is the complete chapter index of that meeting recording; each chapter is a standalone page.",
    footerPart: (p) => (p === 1 ? "Part 1 - Prepared Remarks (Ch. 1-12)" : "Part 2 - Investor Q&A (Ch. 13-19)"),
  },
};

function clamp(text, max) {
  const t = String(text).replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const stop = Math.max(
    cut.lastIndexOf("。"),
    cut.lastIndexOf("；"),
    cut.lastIndexOf("，"),
    cut.lastIndexOf(". "),
    cut.lastIndexOf(", "),
  );
  return (stop > max * 0.6 ? cut.slice(0, stop + 1) : cut).trim() + "…";
}
