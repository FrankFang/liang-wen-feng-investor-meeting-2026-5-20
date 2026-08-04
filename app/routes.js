import { index, route } from "@react-router/dev/routes";

export default [
  index("./routes/home.jsx", { id: "home-zh" }),
  route("index.en", "./routes/home.jsx", { id: "home-en" }),
  route(":chapterSlug", "./routes/chapter.jsx", { id: "chapter" }),
  route("sitemap.xml", "./routes/sitemap.jsx", { id: "sitemap" }),
  route("robots.txt", "./routes/robots.jsx", { id: "robots" }),
  route("*", "./routes/not-found.jsx", { id: "not-found" }),
];
