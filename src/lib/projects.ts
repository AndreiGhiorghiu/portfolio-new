export interface ProjectTag {
  icon: string; // TechIcon key
  label: string;
}

export interface Project {
  id: string;
  title: string;
  year: string;
  featured?: boolean;
  categories: string[]; // filter keys
  description: string;
  tags: ProjectTag[];
  thumb: "diagram" | "network" | "menu" | "scene" | "kit" | "quest" | "blocks" | "impulse";
  live?: string;
  caseStudy?: string;
  code?: string;
  note?: string; // shown when there are no public links
}

export const filters = [
  { key: "all", label: "All" },
  { key: "full-stack", label: "Full-Stack" },
  { key: "backend", label: "Backend" },
  { key: "frontend", label: "Frontend" },
  { key: "3d", label: "3D / Creative" },
];

export const projects: Project[] = [
  {
    id: "agent-marketplace",
    title: "Agent Marketplace",
    year: "2026",
    featured: true,
    categories: ["full-stack", "backend"],
    description:
      "A message-oriented agent architecture: one endpoint, typed messages, capability-checked workers, stateless encrypted sessions and a YAML rules engine.",
    tags: [
      { icon: "ts", label: "TypeScript" },
      { icon: "vue", label: "Vue.js" },
      { icon: "hono", label: "Hono" },
      { icon: "sql", label: "SQLite" },
    ],
    thumb: "diagram",
    live: "https://agent-marketplace.andrei-ghiorghiu.dev",
    caseStudy: "/docs/overview/high-level-overview/",
  },
  {
    id: "family-quest",
    title: "Family Quest",
    year: "2026",
    categories: ["full-stack", "backend"],
    description:
      "Family chores-and-rewards app with two faces — a playful child mode and a parent dashboard — sharing one state through pure reducers, an /io message hub and offline-first optimistic sync.",
    tags: [
      { icon: "react", label: "React 18" },
      { icon: "ts", label: "TypeScript" },
      { icon: "hono", label: "Hono" },
      { icon: "sql", label: "SQLite" },
    ],
    thumb: "quest",
    live: "https://family-quest.andrei-ghiorghiu.dev",
    note: "Personal prototype",
  },
  {
    id: "codequest",
    title: "Tiny Coder",
    year: "2026",
    categories: ["frontend", "full-stack"],
    description:
      "A bilingual browser game teaching kids aged 3+ the first ideas of programming — block programs guide a tiny robot to its star across three worlds. Offline-first, original SVG art, Rust /io backend.",
    tags: [
      { icon: "react", label: "React" },
      { icon: "ts", label: "TypeScript" },
      { icon: "rust", label: "Rust" },
      { icon: "sql", label: "SQLite" },
    ],
    thumb: "blocks",
    live: "https://codequest.andrei-ghiorghiu.dev",
    note: "Personal project",
  },
  {
    id: "dan-cruceanu",
    title: "Psychology Practice Platform",
    year: "2026",
    categories: ["full-stack", "frontend"],
    description:
      "Bilingual site for a psychotherapy practice — procedural 3D neuron-brain hero, Notion-powered blog, and a hardened SMTP contact API.",
    tags: [
      { icon: "react", label: "React" },
      { icon: "three", label: "Three.js" },
      { icon: "tailwind", label: "Tailwind" },
      { icon: "notion", label: "Notion API" },
    ],
    thumb: "network",
    live: "https://dan-cruceanu.andrei-ghiorghiu.dev",
    note: "Client work",
  },
  {
    id: "dan-cruceanu-3d",
    title: "Journey of an Impulse",
    year: "2026",
    categories: ["frontend", "3d"],
    description:
      "Scroll-driven 3D companion to the psychotherapy site — the visitor travels the brain as a nerve impulse, unwinding cold tangled knots of anxiety and fear into warm golden light.",
    tags: [
      { icon: "react", label: "React" },
      { icon: "three", label: "Three.js" },
      { icon: "gsap", label: "GSAP" },
      { icon: "ts", label: "TypeScript" },
    ],
    thumb: "impulse",
    live: "https://dan-cruceanu-3d.andrei-ghiorghiu.dev",
    note: "Client work",
  },
  {
    id: "coffee-menu",
    title: "Aristo Café Digital Menu",
    year: "2026",
    categories: ["full-stack", "frontend"],
    description:
      "Digital menu for a Romanian coffee shop — categories, offers and prices managed from Notion, served through a cached Express API. Deployed to production.",
    tags: [
      { icon: "react", label: "React 19" },
      { icon: "js", label: "JavaScript" },
      { icon: "express", label: "Express" },
      { icon: "notion", label: "Notion API" },
    ],
    thumb: "menu",
    note: "Client work",
  },
  {
    id: "destine-3d",
    title: "Destine 3D Story",
    year: "2026",
    categories: ["frontend", "3d"],
    description:
      "A scroll-driven 3D storytelling experience for an insurance broker — procedural house, trees and character rendered with React Three Fiber and GSAP.",
    tags: [
      { icon: "react", label: "React" },
      { icon: "three", label: "Three.js" },
      { icon: "gsap", label: "GSAP" },
      { icon: "ts", label: "TypeScript" },
    ],
    thumb: "scene",
    live: "https://destine-3d.andrei-ghiorghiu.dev",
    note: "Client work",
  },
  {
    id: "destine-broker",
    title: "Destine Broker",
    year: "2026",
    categories: ["frontend"],
    description:
      "Marketing site for an insurance broker — insurance catalog, FAQ and blog, built on a typed content layer designed as a future headless-CMS contract.",
    tags: [
      { icon: "react", label: "React" },
      { icon: "ts", label: "TypeScript" },
      { icon: "vite", label: "Vite" },
    ],
    thumb: "kit",
    live: "https://destine-broker.andrei-ghiorghiu.dev",
    note: "Client work",
  },
];
