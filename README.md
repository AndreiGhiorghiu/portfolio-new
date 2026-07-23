# Portfolio — Architecture Docs

A documentation-style portfolio site for **Andrei Ghiorghiu** with a
terminal-green theme. The docs explain the architecture of the
[agent-marketplace](../agent-marketplace) project — a message-oriented,
full-stack TypeScript system — page by page, with real code from the
repository.

## Stack

- **[Astro](https://astro.build)** — static site, MDX content collections
- **Shiki** — syntax highlighting with a custom terminal-green theme
  (`src/lib/shiki-terminal.mjs`)
- **JetBrains Mono** via Fontsource
- Plain hand-rolled CSS (`src/styles/`) — no CSS framework
- Small vanilla-JS islands: code tabs, ⌘K search, mobile drawer, TOC tracking

## Development

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static output in dist/
npm run preview
```

## Structure

```
src/
  lib/nav.ts            sidebar tree + page order (single source of truth)
  layouts/              Base, DocsLayout (3/2/1-column shell), StubLayout
  components/           Header, SidebarNav, CodeTabs, ArchDiagram, SearchModal, …
  content/docs/         19 MDX pages: overview / frontend / backend / infrastructure / examples
  pages/                docs/[...slug] renderer + projects/stack/about/contact stubs
  styles/               tokens.css (design system), base, utilities, code
```

Pages carry frontmatter (`title`, `description`, `badges`, `status`). Setting
`status: proposed` renders the amber "proposed adaptation" banner used by the
Infrastructure section.

## Adding a page

1. Create `src/content/docs/<group>/<slug>.mdx` with frontmatter.
2. Add the entry to `src/lib/nav.ts` — sidebar, prev/next pagination and
   search pick it up automatically.
