export interface Tech {
  name: string;
  description: string;
  level: number; // proficiency, 0–100
  icon: string; // TechIcon key
}

export interface StackCategory {
  id: string;
  title: string;
  icon: string; // section heading icon (Icon.astro key)
  items: Tech[];
}

// Source of truth: Andrei's CV (2025) — 9+ years across web, mobile and desktop.
export const stack: StackCategory[] = [
  {
    id: "languages",
    title: "Languages",
    icon: "code",
    items: [
      {
        name: "TypeScript",
        icon: "ts",
        level: 95,
        description: "Type-safe JavaScript for scalable and maintainable code.",
      },
      {
        name: "JavaScript (ESNext)",
        icon: "js",
        level: 95,
        description: "Modern JavaScript for high-performance applications.",
      },
      {
        name: "SQL",
        icon: "sql",
        level: 80,
        description: "Writing efficient queries and data modeling.",
      },
      {
        name: "PHP",
        icon: "php",
        level: 75,
        description: "Server-side development, plugins and CMS platforms.",
      },
      {
        name: "Rust",
        icon: "rust",
        level: 40,
        description: "Systems programming for performance-critical services.",
      },
    ],
  },
  {
    id: "frontend",
    title: "Frontend",
    icon: "layout",
    items: [
      {
        name: "React",
        icon: "react",
        level: 95,
        description: "UI library for building interactive user interfaces.",
      },
      {
        name: "Next.js",
        icon: "next",
        level: 90,
        description: "React framework for production-ready applications.",
      },
      {
        name: "Vue.js",
        icon: "vue",
        level: 85,
        description: "Progressive framework for building modern SPAs.",
      },
      {
        name: "React Native",
        icon: "react",
        level: 80,
        description: "Cross-platform mobile apps with native performance.",
      },
      {
        name: "SolidJS",
        icon: "solid",
        level: 60,
        description: "Fine-grained reactive UI with a familiar JSX model.",
      },
      {
        name: "Tailwind CSS",
        icon: "tailwind",
        level: 90,
        description: "Utility-first CSS framework for rapid UI development.",
      },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    icon: "server",
    items: [
      {
        name: "Node.js",
        icon: "node",
        level: 95,
        description: "JavaScript runtime for scalable server applications.",
      },
      {
        name: "Express.js",
        icon: "express",
        level: 90,
        description: "Fast, unopinionated web framework for Node.js.",
      },
      {
        name: "Fastify",
        icon: "fastify",
        level: 85,
        description: "Low-overhead Node.js framework built for speed.",
      },
      {
        name: "Hono",
        icon: "hono",
        level: 80,
        description: "Ultralight, standards-based framework for any runtime.",
      },
      {
        name: "GraphQL",
        icon: "graphql",
        level: 75,
        description: "Query language for APIs with powerful and flexible syntax.",
      },
      {
        name: "Laravel",
        icon: "laravel",
        level: 65,
        description: "Batteries-included PHP framework for web platforms.",
      },
    ],
  },
  {
    id: "data-storage",
    title: "Data & Storage",
    icon: "database",
    items: [
      {
        name: "PostgreSQL",
        icon: "postgres",
        level: 85,
        description: "Advanced open-source relational database.",
      },
      {
        name: "MySQL",
        icon: "mysql",
        level: 85,
        description: "Reliable relational database for production workloads.",
      },
      {
        name: "NoSQL Databases",
        icon: "nosql",
        level: 70,
        description: "Document and key/value stores for flexible data models.",
      },
    ],
  },
  {
    id: "devops-cloud",
    title: "DevOps & Cloud",
    icon: "cloud-box",
    items: [
      {
        name: "AWS",
        icon: "aws",
        level: 75,
        description: "EC2, S3 and ECS for cloud-hosted applications.",
      },
      {
        name: "Docker",
        icon: "docker",
        level: 85,
        description: "Containerization for consistent builds and deploys.",
      },
      {
        name: "Nginx",
        icon: "nginx",
        level: 80,
        description: "Reverse proxy, load balancing and static serving.",
      },
      {
        name: "CI/CD Pipelines",
        icon: "cicd",
        level: 85,
        description: "GitLab CI and Jenkins pipelines for fast release cycles.",
      },
      {
        name: "Git",
        icon: "git",
        level: 95,
        description: "Version control and collaborative branching workflows.",
      },
      {
        name: "Sentry",
        icon: "sentry",
        level: 80,
        description: "Error tracking and performance monitoring in production.",
      },
    ],
  },
  {
    id: "tools-utilities",
    title: "Tools & Utilities",
    icon: "zap",
    items: [
      {
        name: "Jest",
        icon: "jest",
        level: 85,
        description: "Unit and integration testing for JavaScript projects.",
      },
      {
        name: "Cypress",
        icon: "cypress",
        level: 75,
        description: "End-to-end testing that runs in the real browser.",
      },
      {
        name: "Electron",
        icon: "electron",
        level: 85,
        description: "Desktop applications built with web technologies.",
      },
      {
        name: "Expo & Capacitor",
        icon: "expo",
        level: 75,
        description: "Shipping cross-platform mobile apps faster.",
      },
      {
        name: "Redux / Zustand / XState",
        icon: "state",
        level: 90,
        description: "Predictable state management, from stores to state machines.",
      },
      {
        name: "WebSockets",
        icon: "websocket",
        level: 80,
        description: "Real-time, bidirectional communication for live apps.",
      },
      {
        name: "FFMPEG & Sharp",
        icon: "media",
        level: 70,
        description: "Robust photo and video processing pipelines.",
      },
      {
        name: "WordPress & WooCommerce",
        icon: "wordpress",
        level: 85,
        description: "Custom plugins, payment and shipping integrations.",
      },
    ],
  },
];

export const totalTechnologies = stack.reduce(
  (sum, category) => sum + category.items.length,
  0,
);

// Most-used share, calibrated from CV emphasis (green-shade donut)
export const mostUsed = [
  { name: "TypeScript", share: 28, color: "#4ade50" },
  { name: "React", share: 20, color: "#7ee787" },
  { name: "Node.js", share: 18, color: "#2f9b38" },
  { name: "Vue.js", share: 12, color: "#1c6f24" },
  { name: "Others", share: 22, color: "#55655a" },
];

export const workflow = [
  {
    icon: "book",
    title: "Plan",
    text: "Define requirements and architecture.",
  },
  {
    icon: "code",
    title: "Build",
    text: "Develop with best practices — Agile & TDD.",
  },
  {
    icon: "shield-check",
    title: "Test",
    text: "Ensure quality and reliability.",
  },
  {
    icon: "zap",
    title: "Deploy",
    text: "Ship fast and monitor everything.",
  },
];
