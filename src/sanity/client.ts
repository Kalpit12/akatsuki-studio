import { createClient } from "next-sanity";
import { projects } from "@/data/projects";
import type { Project } from "@/data/projects";

export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: process.env.NODE_ENV === "production",
};

export const sanityClient = createClient({
  ...sanityConfig,
  token: process.env.SANITY_API_TOKEN,
});

const PROJECTS_QUERY = `*[_type == "project"] | order(year desc) {
  "slug": slug.current,
  title,
  client,
  category,
  industry,
  year,
  excerpt,
  coverVideo,
  coverImage,
  heroVideo,
  challenge,
  direction,
  results,
  credits,
  gallery,
  featured
}`;

/** Fetch projects from Sanity when configured, otherwise use local data */
export async function getProjects(): Promise<Project[]> {
  if (!sanityConfig.projectId) return projects;
  try {
    return await sanityClient.fetch<Project[]>(PROJECTS_QUERY);
  } catch {
    return projects;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const all = await getProjects();
  return all.find((p) => p.slug === slug);
}
