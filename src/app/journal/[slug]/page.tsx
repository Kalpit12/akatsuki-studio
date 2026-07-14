import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatJournalDate, getJournalPost, journalPosts } from "@/data/journal";
import { MagneticButton } from "@/components/ui/MagneticButton";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return journalPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getJournalPost(slug);
  if (!post) return { title: "Journal" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function JournalArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getJournalPost(slug);
  if (!post) notFound();

  return (
    <article className="pt-28 pb-28 md:pt-36 md:pb-36">
      <div className="section-padding mb-10 md:mb-14">
        <Link
          href="/journal"
          className="label link-underline mb-8 inline-flex text-muted hover:text-accent"
        >
          ← Journal
        </Link>
        <p className="label mb-4">
          <span className="text-accent">{post.category}</span>
          <span className="text-white/30"> · </span>
          {formatJournalDate(post.date)}
          <span className="text-white/30"> · </span>
          {post.readTime}
        </p>
        <h1 className="heading-xl max-w-4xl text-balance">{post.title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{post.excerpt}</p>
      </div>

      <div className="section-padding mb-14 md:mb-20">
        <div className="relative aspect-[16/9] overflow-hidden border border-white/10 md:aspect-[21/9]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image}
            alt=""
            className="h-full w-full object-cover"
            aria-hidden
          />
          <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-accent via-accent/40 to-transparent" />
        </div>
      </div>

      <div className="section-padding grid gap-12 lg:grid-cols-12">
        <div className="max-w-2xl space-y-6 text-base leading-relaxed text-muted md:text-lg lg:col-span-8">
          <p>
            At Akatsuki, every brief starts with the same question: what does this
            need to make someone do — book a room, book a test drive, or believe the
            brand enough to choose it?
          </p>
          <p>
            {post.excerpt} This piece walks through how we approach that problem on
            the floor in Westlands — from first immersion to the cut that ships.
          </p>
          <p>
            Pretty frames are table stakes. The work that moves hospitality and
            automotive brands is the work that connects craft to demand.
          </p>
        </div>
        <aside className="lg:col-span-4">
          <div className="border border-white/10 p-6 md:p-8 lg:sticky lg:top-32">
            <p className="label mb-4 text-accent">Next step</p>
            <p className="mb-6 font-display text-xl text-white">
              Have a property or a launch that needs to land?
            </p>
            <MagneticButton href="/contact">Start a project →</MagneticButton>
          </div>
        </aside>
      </div>
    </article>
  );
}
