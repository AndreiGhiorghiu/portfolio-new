import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const docs = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/docs" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    badges: z.array(z.string()).optional(),
    status: z.enum(["current", "proposed"]).default("current"),
  }),
});

export const collections = { docs };
