// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import terminalTheme from "./src/lib/shiki-terminal.mjs";

export default defineConfig({
  site: "https://andreighiorghiu.dev",
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
