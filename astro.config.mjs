// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import terminalTheme from "./src/lib/shiki-terminal.mjs";

export default defineConfig({
  site: "https://andreighiorghiu.github.io",
  base: "/portfolio-new",
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      theme: terminalTheme,
    },
  },
});
