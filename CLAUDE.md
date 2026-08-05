# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Terminal-green (hacker-theme) portfolio site for Andrei Ghiorghiu, built with Astro 7 + MDX and hand-rolled CSS (no CSS framework, no UI library). The Architecture section is a full documentation site explaining the `../agent-marketplace` project; the Stack, About, Projects and Contact pages are driven by data files and the user's CV.

## Commands

There are no tests and no linter. `npm run build` is the verification gate — run it after changes. A `.claude/launch.json` config named `portfolio-dev` exists for browser preview.

## Architecture

**Two sources of truth drive everything; keep them in sync:**

1. `src/lib/nav.ts` — the docs sidebar tree, page ordering, prev/next pagination, and search index all derive from it. Adding a doc page = create `src/content/docs/<group>/<slug>.mdx` **and** add the entry to `nav.ts`. The entry `slug` must equal the MDX file path (without extension), because `getStaticPaths` uses collection entry IDs while nav links are built from `nav.ts`.
2. Per-page data modules in `src/lib/` — `stack.ts` (Tech Stack page) and `projects.ts` (Projects page). Cards, summary counts, filters and totals render from these; edit data, not markup.

**Docs pipeline:** `src/content.config.ts` defines the `docs` collection (frontmatter: `title`, `description`, `badges?`, `status?`). `src/pages/docs/[...slug].astro` renders every entry through `src/layouts/DocsLayout.astro` (3/2/1-column responsive shell: sidebar / article / TOC+tech-stack rail). Frontmatter `status: proposed` renders the amber "Proposed adaptation" banner — used for Infrastructure pages describing designs that are not actually deployed. MDX pages import interactive components directly (`CodeTabs`, `ResponsePanel`, `ArchDiagram`, `PrincipleCards`).

**Standalone pages** carry their own scoped styles and small vanilla `<script>` islands. There is no client framework — interactivity is plain DOM scripts; keep it that way.

**Design system:** all visual values live in `src/styles/tokens.css` custom properties; `utilities.css` has the shared `.label`, `.panel`, `.dotted-bg`, `.cursor` (blinking `_`) helpers; `code.css` styles all Shiki output (line numbers via CSS counters). Syntax highlighting uses the custom theme in `src/lib/shiki-terminal.mjs`, wired both into `astro.config.mjs` (markdown fences) and passed explicitly to `<Code>` inside `CodeTabs`/`ResponsePanel`.

**Icons:** `src/components/Icon.astro` (stroke/brand UI icons) and `src/components/TechIcon.astro` (colored tech tiles: letter badges + hand-drawn glyphs). Add new keys to these maps rather than inlining SVGs. Project card thumbnails are hand-drawn SVG variants in `ProjectThumb.astro` — the site deliberately uses stylized graphics, not screenshots.

**Search:** the ⌘K modal (`SearchModal.astro`) builds its index at build time from docs frontmatter + `nav.ts` groups. No Pagefind — it was deliberately dropped.

## Content rules

- **The CV is the source of truth** for Stack/About/Contact facts (`~/Library/Mobile Documents/com~apple~CloudDocs/Andrei Ghiorghiu_Web Developer_2025.pdf`; extract text with python3 + pypdf — pdftotext is not installed). Do not invent skills, employers, stats or contact details; mockups the user provides may contain fictional placeholder content that must be replaced with CV facts.
- **The docs describe `../agent-marketplace` truthfully.** Quote real code from that repo (its `ARCHITECTURE.md` is the narrative source). Anything not actually built (cloud, CI/CD, monitoring) stays under `status: proposed`.
- **No fake links.** Project cards render `code`/`caseStudy` links only when URLs exist in `projects.ts`; otherwise they show a "// Client work" label. Social URLs in `Header.astro`/`contact.astro` and `site` in `astro.config.mjs` are still unverified placeholders.
- Design mockup source images tend to land in `~/Downloads/Generated image 1 (N).png`; convert assets with `sips` into `public/images/`.

## Server / deploys

The site is live at https://andrei-ghiorghiu.dev (Vultr VPS `root@64.177.116.163`, key-based SSH works). `deploy/deploy.sh` redeploys the portfolio; `deploy/deploy-project.sh <name> <dir> [--port --proxy --start --env --spa]` deploys any other project to `<name>.andrei-ghiorghiu.dev` (server layout `/var/www/apps/<name>/{app,data}`, systemd unit `app-<name>`, per-subdomain certbot cert; wildcard DNS `*` → the server already exists). The nginx vhost files in `deploy/` are the canonical copies — edit locally, scp to the server, `nginx -t && systemctl reload nginx`. Visit stats: nginx JSON log + `/stats/` dashboard (basic auth) — see `deploy/visits-log.conf` and `deploy/stats.html`.

## Verifying visual changes

Match the established look against the user's mockups at three widths: ~1440 (desktop, 3-column), ~900 (tablet, 2-column), 375 (mobile: hamburger drawer, stacked layouts). Breakpoints are consistently 1279/1199, 899/767, and 519px across pages.
