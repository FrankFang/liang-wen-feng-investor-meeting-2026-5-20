import { createRequestHandler, RouterContextProvider } from "react-router";

import { cloudflareContext } from "../app/cloudflare.js";

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

export default {
  async fetch(request, env, ctx) {
    // React Router 8 起 context 必须是 RouterContextProvider 实例，传普通对象会 500。
    const routerContext = new RouterContextProvider();
    routerContext.set(cloudflareContext, { env, ctx });
    return requestHandler(request, routerContext);
  },
};
