import { useEffect, useMemo, useRef, useState } from "react";
import {
  Link,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";
import styles from "./styles.css?url";
import { FAVICON } from "./seo.js";
import { copy, fmtTime, isEnPath } from "./i18n.js";
import { CHAPTERS } from "./data/chapters.js";
import { CHAPTERS as CHAPTERS_EN } from "./data/chapters.en.js";

const themeScript = `(function(){
  var root = document.documentElement;
  var saved = localStorage.getItem('transcript-theme');
  var light = saved ? saved === 'light'
    : (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches);
  if (light) root.setAttribute('data-theme', 'light');
})();`;

const fontScript = `(function(){
  var root = document.documentElement;
  var f = localStorage.getItem('transcript-font') || 'hei';
  var fonts = ['hei','kai','song','fangsong'];
  if (fonts.indexOf(f) < 0) f = 'hei';
  if (f !== 'hei') root.setAttribute('data-font', f);
})();`;

export function links() {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "icon", href: FAVICON },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600;700;900&family=IBM+Plex+Mono:wght@400;500;600&display=swap",
    },
  ];
}

const chapterPath = (lang, id) => (lang === "en" ? `/${id}.en` : `/${id}`);

export function Layout({ children }) {
  const location = useLocation();
  const en = isEnPath(location.pathname);
  const t = copy[en ? "en" : "zh"];

  return (
    <html lang={t.lang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Meta / Links 渲染各路由的 meta() 与 links()，缺了它们 title、canonical、
            hreflang、JSON-LD 和样式表全都不会出现在 SSR 的 HTML 里。 */}
        <Meta />
        <Links />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: fontScript }} />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  const location = useLocation();
  const en = isEnPath(location.pathname);
  const t = copy[en ? "en" : "zh"];
  const chapters = en ? CHAPTERS_EN : CHAPTERS;

  const sidebarRef = useRef(null);
  const progressRef = useRef(null);

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [closedParts, setClosedParts] = useState({ 1: false, 2: false });
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    const saved = localStorage.getItem("transcript-theme");
    if (saved) return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  });
  const [font, setFont] = useState(() => {
    if (typeof window === "undefined") return "hei";
    const f = localStorage.getItem("transcript-font") || "hei";
    return ["hei", "kai", "song", "fangsong"].includes(f) ? f : "hei";
  });

  const altPath = useMemo(() => {
    const p = location.pathname;
    if (en) {
      const m = p.match(/^\/(ch\d+)\.en$/);
      return m ? `/${m[1]}` : "/";
    }
    return p === "/" ? "/index.en" : `${p}.en`;
  }, [location.pathname, en]);

  useEffect(() => {
    document.documentElement.lang = t.lang;
  }, [t.lang]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => {
      const el = progressRef.current;
      if (!el) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? window.scrollY / max : 0;
      el.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const active = document.querySelector(".nav-item.active, .home-link.active");
    const sb = sidebarRef.current;
    if (active && sb) {
      const relTop = active.getBoundingClientRect().top - sb.getBoundingClientRect().top;
      sb.scrollTo({ top: Math.max(0, sb.scrollTop + relTop - sb.clientHeight / 2 + active.clientHeight / 2) });
    }
  }, [location.pathname]);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("transcript-theme", next);
    document.documentElement.setAttribute("data-theme", next === "light" ? "light" : "");
    const btn = document.getElementById("themeToggle");
    if (btn) btn.textContent = next === "light" ? "☀" : "☾";
  };

  const toggleFont = () => {
    const fonts = ["hei", "kai", "song", "fangsong"];
    const labels = { hei: "黑", kai: "楷", song: "宋", fangsong: "仿" };
    const next = fonts[(fonts.indexOf(font) + 1) % fonts.length];
    setFont(next);
    localStorage.setItem("transcript-font", next);
    document.documentElement.setAttribute("data-font", next === "hei" ? "" : next);
    const btn = document.getElementById("fontToggle");
    if (btn) btn.textContent = labels[next];
  };

  const q = query.trim().toLowerCase();
  const partChapters = (part) =>
    chapters.filter((c) => c.part === part && (!q || (c.title + c.abstract).toLowerCase().includes(q)));

  return (
    <>
      <div className="watermark">
        <span className="wm1">{t.wm1}</span>
        <span className="wm2">{t.wm2}</span>
      </div>
      <div id="progress" ref={progressRef} />
      <div
        className="mobile-toggle"
        id="mobileToggle"
        onClick={() => setMobileOpen((v) => !v)}
      >
        ☰
      </div>
      {!en && (
        <button
          className="font-toggle"
          id="fontToggle"
          title={t.fontTitle}
          onClick={toggleFont}
        >
          {font === "hei" ? "黑" : font === "kai" ? "楷" : font === "song" ? "宋" : "仿"}
        </button>
      )}
      <Link className="lang-toggle" id="langToggle" to={altPath} title={t.langToggleTitle}>
        {t.langToggleText}
      </Link>
      <button
        className="theme-toggle"
        id="themeToggle"
        title={t.themeTitle}
        onClick={toggleTheme}
      >
        {theme === "light" ? "☀" : "☾"}
      </button>

      <div className={"shell" + (collapsed ? " collapsed" : "") + (mobileOpen ? " mobile-open" : "")}>
        <aside className="sidebar" id="sidebar" ref={sidebarRef}>
          <div className="masthead">
            <div className="masthead-row">
              <div className="seal">{t.seal}</div>
              {/* 侧栏是导航里的站名，不是页面标题：用 h1 会和每页真正的 h1
                  争抢，章节页就变成两个 h1。 */}
              <div className="masthead-title">
                {t.mastheadTitle1}
                <br />
                {t.mastheadTitle2}
              </div>
            </div>
            <p className="sub">{t.mastheadSub}</p>
            <button className="collapse-btn" id="collapseBtn" title={t.collapseTitle} onClick={() => setCollapsed((v) => !v)}>
              ‹
            </button>
          </div>

          <div className="searchwrap">
            <input
              type="text"
              id="searchInput"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
            />
          </div>

          <nav className="toc">
            <NavLink to={en ? "/index.en" : "/"} end className={({ isActive }) => "home-link" + (isActive ? " active" : "")}>
              <span className="ico">◆</span>
              <span className="nav-title-text">{t.homeLink}</span>
            </NavLink>

            {[1, 2].map((part) => (
              <div className={"part-group" + (closedParts[part] && !q ? " closed" : "")} key={part}>
                <div className="part-header" onClick={() => setClosedParts((s) => ({ ...s, [part]: !s[part] }))}>
                  <span className="part-label-text">{part === 1 ? t.part1 : t.part2}</span>
                  <span className="chev">▾</span>
                </div>
                <ul className="chapters">
                  {partChapters(part).map((c) => (
                    <li key={c.id}>
                      <NavLink to={chapterPath(en ? "en" : "zh", c.id)} className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
                        <span className="nav-num">{String(c.num).padStart(2, "0")}</span>
                        <div className="nav-meta">
                          <div className="nav-title-text">{c.title}</div>
                          <div className="nav-time">{fmtTime(c.rawTimestamp)}</div>
                        </div>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <main className="content" id="content">
          <Outlet />
        </main>
      </div>
    </>
  );
}
