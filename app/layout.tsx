import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: {
    template: "%s | LandParcel Realtors Luxury Estates",
    default: "LandParcel Realtors | Buy, Rent Luxury Villas, Penthouses & Prime Land Parcels",
  },
  description:
    "Discover verified luxury villas, sea-facing penthouses, gated residential plots, and grade-A commercial real estate across Mumbai, Bangalore, Delhi NCR, Hyderabad, Pune, and Goa.",
  keywords: [
    "Real Estate",
    "Luxury Homes",
    "Villas in Goa",
    "Mumbai Penthouses",
    "Bangalore Apartments",
    "Gated Plots",
    "Commercial Real Estate",
    "RERA Verified Listings",
  ],
  authors: [{ name: "LandParcel Realtors" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://landparcelrealtors.com",
    title: "LandParcel Realtors | Luxury Real Estate & Prime Land",
    description:
      "Explore curated luxury residential & commercial properties with verified RERA titles, interactive 3D tours, and instant visit bookings.",
    siteName: "LandParcel Realtors",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        {/* Leaflet CSS for Map rendering */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-emerald-100 selection:text-emerald-900"
      >
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
