import { data, useLocation } from "react-router";
import { copy, isEnPath } from "../i18n.js";
import NotFoundContent from "../components/NotFound.jsx";

export function loader() {
  return data(null, 404);
}

export function meta({ location }) {
  const t = copy[isEnPath(location.pathname) ? "en" : "zh"];
  return [{ title: t.notFoundTitle }, { name: "robots", content: "noindex,follow" }];
}

export default function NotFound() {
  const location = useLocation();
  return <NotFoundContent en={isEnPath(location.pathname)} />;
}
