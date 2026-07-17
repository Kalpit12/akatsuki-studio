type ServiceMediaProps = {
  src: string;
  alt: string;
};

export function ServiceMedia({ src, alt }: ServiceMediaProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover"
      loading="lazy"
      decoding="async"
      sizes="(min-width: 1024px) 50vw, 100vw"
    />
  );
}
