export interface NavItem {
  title: string;
  slug: string;
}

export interface NavGroup {
  title: string;
  icon: string;
  items: NavItem[];
}

export const nav: NavGroup[] = [
  {
    title: "System Overview",
    icon: "target",
    items: [
      { title: "Introduction", slug: "overview/introduction" },
      { title: "High Level Overview", slug: "overview/high-level-overview" },
      { title: "Core Principles", slug: "overview/core-principles" },
      { title: "Tech Stack", slug: "overview/tech-stack" },
    ],
  },
  {
    title: "Frontend",
    icon: "layout",
    items: [
      { title: "Application Shell", slug: "frontend/application-shell" },
      { title: "State Management", slug: "frontend/state-management" },
      { title: "Routing", slug: "frontend/routing" },
      { title: "UI / Design System", slug: "frontend/ui-design-system" },
    ],
  },
  {
    title: "Backend",
    icon: "server",
    items: [
      { title: "API Layer", slug: "backend/api-layer" },
      { title: "Business Logic", slug: "backend/business-logic" },
      { title: "Data Access Layer", slug: "backend/data-access-layer" },
      { title: "Authentication", slug: "backend/authentication" },
    ],
  },
  {
    title: "Infrastructure",
    icon: "cloud-box",
    items: [
      { title: "Cloud Architecture", slug: "infrastructure/cloud-architecture" },
      { title: "CI / CD Pipeline", slug: "infrastructure/ci-cd-pipeline" },
      { title: "Monitoring & Logs", slug: "infrastructure/monitoring-logs" },
      { title: "Security", slug: "infrastructure/security" },
    ],
  },
  {
    title: "Examples",
    icon: "code-box",
    items: [
      { title: "API Examples", slug: "examples/api-examples" },
      { title: "Code Snippets", slug: "examples/code-snippets" },
      { title: "Data Models", slug: "examples/data-models" },
    ],
  },
];

/** Flat ordered list used for prev/next pagination. */
export const flatNav: (NavItem & { group: string })[] = nav.flatMap((group) =>
  group.items.map((item) => ({ ...item, group: group.title })),
);

export function docUrl(slug: string): string {
  return `${import.meta.env.BASE_URL}/docs/${slug}/`;
}

export function findBySlug(slug: string) {
  const index = flatNav.findIndex((item) => item.slug === slug);
  return {
    index,
    item: index >= 0 ? flatNav[index] : undefined,
    prev: index > 0 ? flatNav[index - 1] : undefined,
    next: index >= 0 && index < flatNav.length - 1 ? flatNav[index + 1] : undefined,
  };
}

export function groupOf(slug: string): NavGroup | undefined {
  return nav.find((group) => group.items.some((item) => item.slug === slug));
}
