import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import AuthProvider from "@/components/AuthProvider";
import WhatsAppButton from "@/components/WhatsAppButton";
import StarryBackground from "@/components/StarryBackground";

export const metadata = {
  title: "Backpack Junction — Yatra. Adventure. Memories.",
  description:
    "Not just trips. Himalayan stories. Curated yatras, cinematic adventures, and group experiences across the majestic Himalayas.",
  keywords: [
    "Himalayan travel",
    "trek",
    "Kedarnath",
    "Ladakh",
    "Spiti Valley",
    "Kashmir",
    "adventure travel India",
    "group trips Himalayas",
    "spiritual journey India",
    "yatra",
    "backpack junction",
  ],
  openGraph: {
    title: "Backpack Junction — Yatra. Adventure. Memories.",
    description:
      "Curated yatras, cinematic adventures, and group experiences across the majestic Himalayas.",
    type: "website",
    locale: "en_IN",
    siteName: "Backpack Junction",
  },
  twitter: {
    card: "summary_large_image",
    title: "Backpack Junction — Yatra. Adventure. Memories.",
    description: "Not just trips. Himalayan stories.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700&family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased w-full bg-transparent">
        <StarryBackground />
        <AuthProvider>
          <SmoothScroll>{children}</SmoothScroll>
          <WhatsAppButton />
        </AuthProvider>
      </body>
    </html>
  );
}
