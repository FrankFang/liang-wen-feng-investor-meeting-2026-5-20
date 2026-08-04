import { Link, useLocation } from "react-router";
import { MEETING_DATE, SITE, copy, fmtTime, isEnPath } from "../i18n.js";
import { homeGraph, zhChapterUrl, enChapterUrl } from "../seo.js";
import { CHAPTERS } from "../data/chapters.js";
import { CHAPTERS as CHAPTERS_EN } from "../data/chapters.en.js";

export function loader({ location }) {
  const en = isEnPath(location.pathname);
  return { en, chapters: en ? CHAPTERS_EN : CHAPTERS, t: copy[en ? "en" : "zh"] };
}

export function meta({ location, data }) {
  const { en, chapters, t } = data;
  const url = en ? SITE + "/index.en" : SITE + "/";
  const title = t.homeTitle;
  const desc = t.homeDesc;
  return [
    { title },
    { name: "description", content: desc },
    { name: "keywords", content: t.homeKeywords },
    { tagName: "link", rel: "canonical", href: url },
    { tagName: "link", rel: "alternate", hrefLang: "zh-Hans", href: SITE + "/" },
    { tagName: "link", rel: "alternate", hrefLang: "en", href: SITE + "/index.en" },
    { tagName: "link", rel: "alternate", hrefLang: "x-default", href: SITE + "/" },
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
        "@graph": homeGraph({ t, url, chapters }),
      },
    },
  ];
}

export default function Home({ loaderData }) {
  const { en, chapters, t } = loaderData;
  const location = useLocation();
  const part1 = chapters.filter((c) => c.part === 1);
  const part2 = chapters.filter((c) => c.part === 2);
  const hrefFor = (id) => (en ? `/${id}.en` : `/${id}`);

  const idxCard = (c) => (
    <Link to={hrefFor(c.id)} className="idx-card" key={c.id}>
      <div className="idx-top">
        <span className="idx-num">{String(c.num).padStart(2, "0")}</span>
        <span className="idx-time">{fmtTime(c.rawTimestamp)}</span>
      </div>
      <h4>{c.title}</h4>
    </Link>
  );

  return (
    <div className="page">
      <section className="hero">
        <div className="kicker">{t.kicker}</div>
        <h1 dangerouslySetInnerHTML={{ __html: t.heroHTML }} />
        <p className="desc" dangerouslySetInnerHTML={{ __html: t.heroDesc }} />
        <div className="filecard">
          {t.filecard.map(([b, s]) => (
            <div key={b}>
              <b>{b}</b>
              <span>{s}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="seo-intro">
        <div className="seo-footer-inner">
          <h2>{t.introHeading}</h2>
          {t.introParas.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <dl className="seo-facts">
            {t.introFacts.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section style={{ marginTop: 56 }}>
        <div className="section-heading">
          <span className="num">{t.figNum}</span>
          <h2>{t.figTitle}</h2>
        </div>
        <p className="section-sub">{t.figSub}</p>
        <div dangerouslySetInnerHTML={{ __html: t.flowHTML }} />
      </section>

      <section>
        <div className="idx-part-title">{t.idxPart1}</div>
        <div className="idx-grid">{part1.map(idxCard)}</div>
        <div className="idx-part-title">{t.idxPart2}</div>
        <div className="idx-grid">{part2.map(idxCard)}</div>
      </section>

      <div className="disclaimer">{t.disclaimer}</div>
    </div>
  );
}
