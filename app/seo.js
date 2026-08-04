import { SITE, MEETING_DATE } from "./i18n.js";

const PERSON = {
  "@type": "Person",
  name: "梁文锋",
  alternateName: ["Liang Wenfeng", "梁文峰"],
  jobTitle: "Founder & CEO",
  worksFor: { "@type": "Organization", name: "DeepSeek", alternateName: "深度求索" },
};

const PUBLISHER = { "@type": "Organization", name: "liangwenfeng.art", url: SITE + "/" };

/** JSON-LD 内联到 <script> 里，必须避免 </script> 与 HTML 注释序列提前闭合。 */
export function jsonld(obj) {
  return JSON.stringify(obj, null, 2)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

function articleNode({ url, headline, description, part, chapters, lang }) {
  return {
    "@type": "Article",
    "@id": url + "#article",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    headline,
    description,
    inLanguage: lang,
    datePublished: MEETING_DATE,
    dateModified: MEETING_DATE,
    author: PUBLISHER,
    publisher: PUBLISHER,
    about: [PERSON, { "@type": "Organization", name: "DeepSeek", alternateName: "深度求索" }],
    isBasedOn: {
      "@type": "Event",
      name: lang === "zh-CN" ? "梁文锋投资者交流会" : "Liang Wenfeng investor meeting",
      startDate: MEETING_DATE,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: { "@type": "Place", name: lang === "zh-CN" ? "未公开" : "Undisclosed" },
      performer: PERSON,
    },
    ...(part ? { articleSection: part } : {}),
    ...(chapters ? { hasPart: chapters } : {}),
  };
}

function breadcrumbNode(items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

/** 首页：WebSite + Article(hasPart) + Person + ItemList + Breadcrumb */
export function homeGraph({ t, url, chapters }) {
  return [
    {
      "@type": "WebSite",
      "@id": SITE + "/#website",
      url: SITE + "/",
      name: t.siteName,
      inLanguage: t.lang,
      publisher: PUBLISHER,
    },
    articleNode({
      url,
      headline: t.articleName,
      description: t.homeDesc,
      lang: t.lang,
      chapters: chapters.map((c) => ({
        "@type": "Article",
        "@id": chapterUrl(c.id) + "#article",
        url: chapterUrl(c.id),
        name: c.title,
        headline: c.title,
        description: c.abstract,
        position: c.num,
      })),
    }),
    PERSON,
    {
      "@type": "ItemList",
      name: t.footerHeading,
      numberOfItems: chapters.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: chapters.map((c) => ({
        "@type": "ListItem",
        position: c.num,
        name: c.title,
        url: chapterUrl(c.id),
      })),
    },
    breadcrumbNode([{ name: t.crumbHome, url: url }]),
  ];
}

/** 章节页：Article + Breadcrumb */
export function chapterGraph({ t, c, url, homeUrl, partName }) {
  return [
    articleNode({
      url,
      headline: c.title,
      description: t.chapterDesc(c),
      part: partName,
      lang: t.lang,
    }),
    breadcrumbNode([
      { name: t.crumbHome, url: homeUrl },
      { name: partName, url: homeUrl },
      { name: c.title, url },
    ]),
  ];
}

export const zhChapterUrl = (id) => `${SITE}/${id}`;
export const enChapterUrl = (id) => `${SITE}/${id}.en`;

export function sitemapXml(chapters) {
  const entry = (loc, alts, priority, changefreq) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${MEETING_DATE}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${alts.map(([hl, href]) => `    <xhtml:link rel="alternate" hreflang="${hl}" href="${href}"/>`).join("\n")}
  </url>`;

  const homeAlts = [["zh-Hans", SITE + "/"], ["en", SITE + "/index.en"], ["x-default", SITE + "/"]];
  const urls = [
    entry(SITE + "/", homeAlts, "1.0", "weekly"),
    entry(SITE + "/index.en", homeAlts, "0.9", "weekly"),
  ];
  for (const c of chapters) {
    const zh = `${SITE}/${c.id}`;
    const en = `${SITE}/${c.id}.en`;
    const alts = [["zh-Hans", zh], ["en", en], ["x-default", zh]];
    urls.push(entry(zh, alts, "0.8", "monthly"));
    urls.push(entry(en, alts, "0.7", "monthly"));
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;
}

export const ROBOTS_TXT = `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;

export const FAVICON =
  "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20100%20100'%3E%3Ctext%20y='.9em'%20font-size='90'%3E%F0%9F%93%BC%3C/text%3E%3C/svg%3E";
