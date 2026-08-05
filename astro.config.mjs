// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import terminalTheme from "./src/lib/shiki-terminal.mjs";

export default defineConfig({
  site: "https://andrei-ghiorghiu.dev",
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      theme: terminalTheme,
    },
  },
  redirects: {
    "/": "/docs/overview/high-level-overview",
    "/docs": "/docs/overview/high-level-overview",
    "/architecture": "/docs/overview/high-level-overview",
  },
});
