import { destinations as staticDestinations } from "@/data/destinations";
import DestinationPage from "./DestinationPage";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return staticDestinations.map((d) => ({ slug: d.id }));
}

async function getDestination(slug) {
  // First check static
  let dest = staticDestinations.find((d) => d.id === slug);
  if (dest) return dest;

  // Otherwise check API/DB (runs on server, requires absolute URL if using fetch, 
  // but since we're in Server Components, it's better to just hit the DB directly or use absolute URL.
  // We'll use the DB directly to avoid absolute URL issues in Next.js Server Components.
  try {
    const connectToDatabase = (await import('@/lib/mongodb')).default;
    const Destination = (await import('@/models/Destination')).default;
    await connectToDatabase();
    const dbDest = await Destination.findOne({ id: slug });
    if (dbDest) {
      return JSON.parse(JSON.stringify(dbDest));
    }
  } catch (error) {
    console.error("Error fetching destination from DB:", error);
  }
  return null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const dest = await getDestination(slug);
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
  const dest = await getDestination(slug);
  if (!dest) notFound();
  return <DestinationPage destination={dest} />;
}
