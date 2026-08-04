import { sitemapXml } from "../seo.js";
import { CHAPTERS } from "../data/chapters.js";

export function loader() {
  return new Response(sitemapXml(CHAPTERS), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
