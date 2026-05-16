import { destinations as staticDestinations } from "@/data/destinations";
import DestinationPage from "./DestinationPage";
import { notFound } from "next/navigation";

// Allow dynamic routes for DB-added destinations not in static params
export const dynamicParams = true;

export async function generateStaticParams() {
  return staticDestinations.map((d) => ({ slug: d.id }));
}

// Disable static caching so admin updates reflect instantly
export const revalidate = 0;

async function getDestination(slug) {
  // First check API/DB for the latest values
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

  // Fallback to static if not found in DB
  let dest = staticDestinations.find((d) => d.id === slug);
  if (dest) return dest;

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
