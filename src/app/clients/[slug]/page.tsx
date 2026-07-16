import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { clientRoster } from "@/data/clients";
import { getClientWork, getClientWorkSlugs } from "@/data/clientFilms";
import { ClientPageContent } from "@/components/clients/ClientPageContent";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getClientWorkSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const client = clientRoster.find((c) => c.slug === slug);
  const work = getClientWork(slug);
  if (!client || !work) return { title: "Client Not Found" };
  return {
    title: client.name,
    description: work.excerpt,
  };
}

export default async function ClientWorkPage({ params }: Props) {
  const { slug } = await params;
  const client = clientRoster.find((c) => c.slug === slug);
  const work = getClientWork(slug);
  if (!client || !work) notFound();

  return (
    <div className="pt-28 md:pt-36">
      <ClientPageContent client={client} work={work} />
    </div>
  );
}
