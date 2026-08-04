import { useEffect } from "react";
import { Link, data, useLoaderData, useLocation, useNavigate } from "react-router";
import { MEETING_DATE, SITE, copy, fmtTime, isEnPath } from "../i18n.js";
import { chapterGraph, zhChapterUrl, enChapterUrl } from "../seo.js";
import { CHAPTERS } from "../data/chapters.js";
import { CHAPTERS as CHAPTERS_EN } from "../data/chapters.en.js";
import NotFoundContent from "../components/NotFound.jsx";

export function loader({ params, request }) {
  // loader 的参数是 { request, params, context }，没有 location。
  const en = isEnPath(new URL(request.url).pathname);
  const id = String(params.chapterSlug).replace(/\.en$/, "");
  const chapter = (en ? CHAPTERS_EN : CHAPTERS).find((c) => c.id === id);
  if (!chapter) return data(null, 404);
  return { en, chapter };
}

export function meta({ location, loaderData }) {
  // v8 移除了 MetaArgs.data，改用 loaderData。
  if (!loaderData) {
    const t = copy[isEnPath(location.pathname) ? "en" : "zh"];
    return [{ title: t.notFoundTitle }, { name: "robots", content: "noindex,follow" }];
  }
  const { en, chapter } = loaderData;
  const t = copy[en ? "en" : "zh"];
  const url = en ? enChapterUrl(chapter.id) : zhChapterUrl(chapter.id);
  const title = t.chapterTitle(chapter);
  const desc = t.chapterDesc(chapter);
  return [
    { title },
    { name: "description", content: desc },
    { name: "keywords", content: t.keywords(chapter) },
    { tagName: "link", rel: "canonical", href: url },
    { tagName: "link", rel: "alternate", hrefLang: "zh-Hans", href: zhChapterUrl(chapter.id) },
    { tagName: "link", rel: "alternate", hrefLang: "en", href: enChapterUrl(chapter.id) },
    { tagName: "link", rel: "alternate", hrefLang: "x-default", href: zhChapterUrl(chapter.id) },
    { name: "robots", content: "index,follow,max-snippet:-1,max-image-preview:large" },
    { property: "og:type", content: "article" },
    { property: "og:site_name", content: t.siteName },
    { property: "og:locale", content: en ? "en_US" : "zh_CN" },
    { property: "og:locale:alternate", content: en ? "zh_CN" : "en_US" },
    { property: "og:url", content: url },
    { property: "og:title", content: title },
    { property: "og:description", content: desc },
    { property: "article:published_time", content: MEETING_DATE },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: desc },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@graph": chapterGraph({
          t,
          c: chapter,
          url,
          homeUrl: en ? SITE + "/index.en" : SITE + "/",
          partName: t.partName(chapter.part),
        }),
      },
    },
  ];
}

export default function Chapter() {
  const ld = useLoaderData();
  const location = useLocation();
  const navigate = useNavigate();
  const en = isEnPath(location.pathname);
  const t = copy[en ? "en" : "zh"];
  const list = en ? CHAPTERS_EN : CHAPTERS;

  const chapter = ld ? ld.chapter : null;
  const idx = chapter ? list.findIndex((c) => c.id === chapter.id) : -1;
  const prev = idx > 0 ? list[idx - 1] : null;
  const next = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null;
  const hrefFor = (id) => (en ? `/${id}.en` : `/${id}`);

  useEffect(() => {
    if (!prev && !next) return;
    const onKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "ArrowRight" && next) navigate(hrefFor(next.id));
      if (e.key === "ArrowLeft" && prev) navigate(hrefFor(prev.id));
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [prev, next, en, navigate]);

  if (!ld) {
    return <NotFoundContent en={en} />;
  }

  let body = [];
  let curType = null;
  let buf = [];
  const flush = () => {
    if (!buf.length) return;
    if (curType === "q" || curType === "a") {
      body.push(
        <div className={`qa-block ${curType}`} key={body.length}>
          <div className={`qa-label ${curType}`}>{curType === "q" ? t.qLabel : t.aLabel}</div>
          {buf.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>,
      );
    } else {
      buf.forEach((p, i) =>
        body.push(
          <p key={`${body.length}-${i}`}>{p}</p>,
        ),
      );
    }
    buf = [];
  };
  (chapter.paragraphs || []).forEach((p) => {
    if (p.type !== curType) {
      flush();
      curType = p.type;
    }
    buf.push(p.text);
  });
  flush();

  const footLink = (c, cls, label) =>
    c ? (
      <Link to={hrefFor(c.id)} className={`foot-link ${cls}`}>
        <div className="fl-k">{label}</div>
        <div className="fl-t">{c.title}</div>
      </Link>
    ) : (
      <div className="foot-link foot-empty"></div>
    );

  return (
    <div className="page narrow">
      <div className="crumb">
        <Link to={en ? "/index.en" : "/"}>{t.crumbHome}</Link>
        <span className="sep">/</span>
        <Link to={en ? "/index.en" : "/"}>{t.partName(chapter.part)}</Link>
        <span className="sep">/</span>
        <span>{t.chapterNo(chapter.num)}</span>
      </div>
      <div className="timebadge">
        {t.timeLabel} {chapter.rawTimestamp}
      </div>
      <h1 className="chapter-title">{chapter.title}</h1>
      <p className="chapter-abstract">{chapter.abstract}</p>
      <blockquote className="pullquote">{chapter.quote}</blockquote>
      <div className="prose">{body}</div>
      <div className="chapter-footer">
        {footLink(prev, "prev", t.prev)}
        {footLink(next, "next", t.next)}
      </div>
      <div className="disclaimer">{t.disclaimer}</div>
    </div>
  );
}
