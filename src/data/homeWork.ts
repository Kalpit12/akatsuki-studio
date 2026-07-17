import { clientRoster } from "@/data/clients";
import { getClientWork } from "@/data/clientFilms";
import { getProject } from "@/data/projects";

export type HomeWorkCard = {
  key: string;
  title: string;
  subtitle: string;
  href: string;
  poster: string;
  video?: string;
};

/** Clients with a published work or client page and cover media for the homepage stack. */
export function getHomeWorkCards(): HomeWorkCard[] {
  const cards: HomeWorkCard[] = [];

  for (const client of clientRoster) {
    const project = client.workSlug ? getProject(client.workSlug) : undefined;
    const work = getClientWork(client.slug);

    let href: string | undefined;
    let title = client.workTitle ?? client.name;
    let subtitle = client.detail;
    let poster: string | undefined;
    let video: string | undefined;

    if (project) {
      href = `/work/${project.slug}`;
      title = project.title;
      subtitle = project.client;
      poster = project.coverImage;
      video = project.coverVideo;
    } else if (work) {
      href = `/clients/${client.slug}`;
      title = client.name;
      poster =
        work.heroPoster ??
        work.heroImage ??
        work.films[0]?.poster;
      video = work.heroVideo ?? work.films[0]?.video;
    }

    if (!href || !poster) continue;

    cards.push({
      key: client.slug,
      title,
      subtitle,
      href,
      poster,
      video,
    });
  }

  return cards;
}
