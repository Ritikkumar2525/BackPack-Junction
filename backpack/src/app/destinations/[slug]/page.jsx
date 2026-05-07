import { destinations } from "@/data/destinations";
import DestinationPage from "./DestinationPage";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.id }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const dest = destinations.find((d) => d.id === slug);
  if (!dest) return {};
  return {
    title: `${dest.name} — ${dest.tagline} | BackPack`,
    description: dest.description,
    openGraph: {
      title: `${dest.name} — ${dest.tagline}`,
      description: dest.description,
      images: [dest.image],
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const dest = destinations.find((d) => d.id === slug);
  if (!dest) notFound();
  return <DestinationPage destination={dest} />;
}
