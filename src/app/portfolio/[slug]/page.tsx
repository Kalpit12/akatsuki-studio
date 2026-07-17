import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { clientRoster } from "@/data/clients";
import {
  getClientWork,
  getClientWorkSlugs,
  type ClientWork,
} from "@/data/clientFilms";
import { getProject } from "@/data/projects";
import { ClientPageContent } from "@/components/clients/ClientPageContent";

type Props = { params: Promise<{ slug: string }> };

function workFromProject(clientSlug: string, workSlug: string): ClientWork | null {
  const project = getProject(workSlug);
  if (!project) return null;

  return {
    slug: clientSlug,
    heroVideo: project.heroVideo ?? project.coverVideo,
    heroPoster: project.coverImage,
    heroOrientation: project.coverOrientation,
    excerpt: project.excerpt,
    films:
      project.films?.map((film) => ({
        video: film.video,
        poster: film.poster,
        label: film.label,
      })) ?? [],
    gallery: project.gallery.length > 0 ? project.gallery : undefined,
  };
}

export async function generateStaticParams() {
  const slugs = new Set(getClientWorkSlugs());
  for (const client of clientRoster) {
    if (client.workSlug) slugs.add(client.slug);
  }
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const client = clientRoster.find((c) => c.slug === slug);
  const work =
    getClientWork(slug) ??
    (client?.workSlug ? workFromProject(slug, client.workSlug) : null);
  if (!client || !work) return { title: "Not Found" };
  return {
    title: client.name,
    description: work.excerpt,
  };
}

export default async function PortfolioClientPage({ params }: Props) {
  const { slug } = await params;
  const client = clientRoster.find((c) => c.slug === slug);
  const work =
    getClientWork(slug) ??
    (client?.workSlug ? workFromProject(slug, client.workSlug) : null);
  if (!client || !work) notFound();

  return (
    <div>
      <ClientPageContent client={client} work={work} />
    </div>
  );
}
