import { createContext } from "react-router";

/** loader / action 里用 context.get(cloudflareContext) 取 { env, ctx }。 */
export const cloudflareContext = createContext();
