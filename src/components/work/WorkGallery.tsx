"use client";

import { cn } from "@/lib/utils";

type WorkGalleryProps = {
  title: string;
  images: string[];
  /** Landscape automotive stills use 16:9; default is 4:3 */
  layout?: "landscape" | "standard";
  className?: string;
  /** Override default "Gallery" label */
  sectionLabel?: string;
  /** Optional heading below the label (client pages) */
  sectionHeading?: string;
};

function WorkGalleryImage({
  src,
  alt,
  layout,
  priority,
}: {
  src: string;
  alt: string;
  layout: "landscape" | "standard";
  priority?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={1600}
      height={layout === "landscape" ? 900 : 1200}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "low"}
      className={cn(
        "h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]",
        layout === "landscape" ? "aspect-video" : "aspect-[4/3]",
      )}
    />
  );
}

export function WorkGallery({
  title,
  images,
  layout = "standard",
  className,
  sectionLabel = "Gallery",
  sectionHeading,
}: WorkGalleryProps) {
  return (
    <section className={cn("section-padding max-md:py-12 py-16", className)}>
      <div
        className={cn(
          "mb-6 flex items-end justify-between gap-4 max-md:mb-5",
          sectionHeading ? "border-b border-white/10 pb-8 md:mb-10" : "md:mb-8",
        )}
      >
        <div>
          <p className={cn("label", sectionHeading && "mb-3 text-accent")}>
            {sectionLabel}
          </p>
          {sectionHeading ? (
            <h2 className="heading-md">{sectionHeading}</h2>
          ) : null}
        </div>
        <p className="font-mono text-[10px] tracking-[0.2em] text-white/45 md:text-xs">
          {String(images.length).padStart(2, "0")} stills
        </p>
      </div>

      <div
        className={cn(
          "grid gap-2 max-md:gap-2 md:gap-3",
          layout === "landscape"
            ? "grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-2 md:grid-cols-2 lg:grid-cols-3 md:gap-4",
        )}
      >
        {images.map((src, i) => (
          <div
            key={src}
            className="group overflow-hidden rounded-sm bg-white/[0.03] ring-1 ring-white/10 transition duration-500 hover:ring-accent/40 max-md:active:ring-accent/40"
          >
            <WorkGalleryImage
              src={src}
              alt={`${title} gallery ${i + 1}`}
              layout={layout}
              priority={i < 2}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
