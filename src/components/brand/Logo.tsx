import Link from "next/link";
import { cn } from "@/lib/utils";

export const LOGO_SRC = "/brand/akatsuki-logo.png?v=2";

type LogoProps = {
  className?: string;
  href?: string | null;
  priority?: boolean;
};

export function Logo({ className, href = "/", priority }: LogoProps) {
  const image = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_SRC}
      alt="Akatsuki Studio"
      width={308}
      height={89}
      decoding="async"
      loading={priority ? "eager" : "lazy"}
      className={cn("h-auto w-auto object-contain", className)}
    />
  );

  if (!href) return image;

  return (
    <Link href={href} data-magnetic className="inline-block" aria-label="Akatsuki Studio home">
      {image}
    </Link>
  );
}
