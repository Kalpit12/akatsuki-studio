import { REACH_STORIES, REACH_TOTAL } from "@/data/reachStories";
import { ReachStoryVideo } from "@/components/home/ReachStoryVideo";

function formatViews(value: number): string {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    const rounded =
      millions >= 10
        ? Math.round(millions).toString()
        : millions.toFixed(1).replace(/\.0$/, "");
    return `${rounded}M`;
  }
  if (value >= 1_000) {
    const thousands = value / 1_000;
    const rounded =
      thousands >= 10
        ? Math.round(thousands).toString()
        : thousands.toFixed(1).replace(/\.0$/, "");
    return `${rounded}K`;
  }
  return `${Math.round(value)}`;
}

function StoryCopy({
  story,
  index,
}: {
  story: (typeof REACH_STORIES)[number];
  index: number;
}) {
  return (
    <div className="flex flex-col justify-center lg:col-span-7">
      <p className="font-mono text-xs tracking-[0.2em] text-accent">
        {String(index + 1).padStart(2, "0")} — FILM
      </p>
      <p className="mt-3 font-display text-[clamp(2.5rem,5vw,4rem)] leading-none tracking-tight text-white">
        {formatViews(story.views)}
      </p>
      <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-white/45">
        {story.viewsLabel}
      </p>

      <h3 className="mt-7 font-display text-2xl tracking-tight text-white md:text-3xl">
        {story.title}
      </h3>
      <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
        {story.description}
      </p>
      {story.about ? (
        <div className="mt-5 flex max-w-xl items-stretch gap-4">
          <span className="w-px shrink-0 self-stretch bg-accent" aria-hidden />
          <p className="min-w-0 flex-1 text-sm leading-relaxed text-white/55">
            {story.about}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function StoryFrame({
  story,
  index,
  mediaRight,
}: {
  story: (typeof REACH_STORIES)[number];
  index: number;
  mediaRight: boolean;
}) {
  const video = (
    <ReachStoryVideo
      src={story.video}
      poster={story.poster}
      index={index}
    />
  );
  const copy = <StoryCopy story={story} index={index} />;

  return (
    <article className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-16">
      {mediaRight ? (
        <>
          {copy}
          {video}
        </>
      ) : (
        <>
          {video}
          {copy}
        </>
      )}
    </article>
  );
}

export function ImpactStories() {
  return (
    <section className="relative overflow-hidden border-y border-white/10 py-20 md:py-28">
      <div className="section-padding relative z-10">
        <div className="mb-12 flex flex-col gap-8 border-b border-white/10 pb-10 md:mb-14 md:flex-row md:items-end md:justify-between md:gap-12 md:pb-12">
          <div className="max-w-2xl">
            <p className="label mb-3 text-accent">Reach</p>
            <h2 className="heading-lg text-balance">
              Three stories.{" "}
              <span className="text-accent">2.6 million</span> reasons to keep
              creating.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted md:text-base">
              Some projects do more than look good. They connect, get shared,
              and reach millions.
            </p>
          </div>

          <div className="shrink-0 md:text-right">
            <p className="font-mono text-[10px] tracking-[0.22em] text-accent">
              COMBINED
            </p>
            <p className="mt-1 font-display text-[clamp(2.75rem,6vw,4.5rem)] leading-none tracking-tight text-white">
              {formatViews(REACH_TOTAL.value)}
            </p>
            <p className="mt-2 text-sm text-muted">{REACH_TOTAL.label}</p>
          </div>
        </div>

        <div className="space-y-16 md:space-y-20 lg:space-y-24">
          {REACH_STORIES.map((story, i) => (
            <StoryFrame
              key={story.id}
              story={story}
              index={i}
              mediaRight={i % 2 === 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
