import { Link } from "react-router";
import { copy, isEnPath } from "../i18n.js";
import { CHAPTERS } from "../data/chapters.js";
import { CHAPTERS as CHAPTERS_EN } from "../data/chapters.en.js";

export default function NotFoundContent({ en }) {
  const t = copy[en ? "en" : "zh"];
  const chapters = en ? CHAPTERS_EN : CHAPTERS;
  const hrefFor = (id) => (en ? `/${id}.en` : `/${id}`);

  const list = (part) =>
    chapters
      .filter((c) => c.part === part)
      .map((c) => (
        <li key={c.id}>
          <Link to={hrefFor(c.id)}>
            <span className="sl-t">
              <span className="sl-n">{String(c.num).padStart(2, "0")}</span>
              {c.title}
            </span>
            <span className="sl-a">{c.abstract}</span>
          </Link>
        </li>
      ));

  return (
    <>
      <div className="page narrow">
        <div className="timebadge">404</div>
        <h1 className="chapter-title">{t.notFoundHeading}</h1>
        <p className="chapter-abstract">{t.notFoundBody}</p>
        <Link className="open-in-guide" to={en ? "/index.en" : "/"}>
          {t.notFoundHome} →
        </Link>
      </div>

      <footer className="seo-footer">
        <div className="seo-footer-inner">
          <h2>{t.footerHeading}</h2>
          <p className="seo-lead">{t.footerLead}</p>
          <div className="seo-part">{t.footerPart(1)}</div>
          <ol className="seo-list">{list(1)}</ol>
          <div className="seo-part">{t.footerPart(2)}</div>
          <ol className="seo-list">{list(2)}</ol>
          <p className="seo-meta">{t.disclaimer}</p>
        </div>
      </footer>
    </>
  );
}
