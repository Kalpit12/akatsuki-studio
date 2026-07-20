import { clientRoster } from "@/data/clients";
import { PORTFOLIO_PATH } from "@/lib/constants";
import { getClientWork } from "@/data/clientFilms";
import { getProject, type FilmOrientation } from "@/data/projects";

export type HomeWorkCard = {
  key: string;
  title: string;
  subtitle: string;
  href: string;
  poster: string;
  /** Full cover film (portfolio / deep link) */
  video?: string;
  /** Lightweight hover preview for the homepage Work grid */
  hoverVideo?: string;
  orientation: FilmOrientation;
};

/** Curated homepage work grid — order and membership */
export const HOME_WORK_ORDER = [
  "tvs",
  "connect-coffee-museum",
  "kyra-platinum-imports",
  "slate",
  "inti",
  "bambino",
  "mara-enkaji",
  "autobox-motors",
  "craydel-kenya",
  "elias-jewelers",
  "posh-autobody",
  "durham-school",
  "keystone-dental",
  "macaash-investments",
  "stiltz-homelift",
] as const;

export type HomeWorkSlug = (typeof HOME_WORK_ORDER)[number];

/** Short compressed hover cuts — regenerate with `node scripts/generate-work-previews.mjs` */
export function workHoverPreviewPath(slug: string) {
  return `/work-previews/${slug}.mp4`;
}

function buildCardForClient(client: (typeof clientRoster)[number]): HomeWorkCard | null {
  const project = client.workSlug ? getProject(client.workSlug) : undefined;
  const work = getClientWork(client.slug);

  const href = `${PORTFOLIO_PATH}/${client.slug}`;
  const title = client.workTitle ?? client.name;
  const subtitle = client.detail;
  let poster: string | undefined;
  let video: string | undefined;
  let orientation: FilmOrientation = "vertical";

  if (project) {
    poster = project.coverImage;
    video = project.coverVideo;
    orientation = project.coverOrientation ?? "vertical";
  } else if (work) {
    poster =
      work.heroPoster ?? work.heroImage ?? work.films[0]?.poster;
    video = work.heroVideo ?? work.films[0]?.video;
    orientation = work.heroOrientation ?? "vertical";
  }

  if (!poster) return null;

  const hasHoverPreview = (HOME_WORK_ORDER as readonly string[]).includes(
    client.slug,
  );

  return {
    key: client.slug,
    title,
    subtitle,
    href,
    poster,
    video,
    hoverVideo: hasHoverPreview ? workHoverPreviewPath(client.slug) : video,
    orientation,
  };
}

/** Clients with cover media for the homepage work stack, in curated order. */
export function getHomeWorkCards(): HomeWorkCard[] {
  const bySlug = new Map<string, HomeWorkCard>();

  for (const client of clientRoster) {
    const card = buildCardForClient(client);
    if (card) bySlug.set(client.slug, card);
  }

  return HOME_WORK_ORDER.map((slug) => bySlug.get(slug)).filter(
    (card): card is HomeWorkCard => card != null,
  );
}
