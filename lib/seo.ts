import type { Metadata } from "next";

export const BASE_URL = "https://paimadesign.com";

interface PageSeoProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  keywords?: string[];
  type?: "website" | "article";
}

export function constructMetadata({
  title,
  description,
  path = "",
  image = "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
  keywords = [],
  type = "website",
}: PageSeoProps): Metadata {
  const fullTitle = `${title} | PAIMA — Luxury Interior Design & Prime Real Estate`;
  const url = `${BASE_URL}${path}`;

  const defaultKeywords = [
    "Paima Luxury Interiors",
    "Paima Prime Real Estate",
    "Bel-Air Luxury Estates",
    "Haute Interior Architecture",
    "Modern Villa with Pool",
    "Monaco Luxury Penthouses",
    "Private Estate Acquisition",
    "Manhattan Sky Residences",
    "Turnkey Architectural Renovation",
  ];

  return {
    title: fullTitle,
    description,
    keywords: Array.from(new Set([...defaultKeywords, ...keywords])),
    authors: [{ name: "Paima Luxury Group" }],
    creator: "Paima",
    publisher: "Paima Luxury Interiors & Real Estate",
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: "PAIMA",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${title} - Paima Luxury Interiors & Prime Real Estate`,
        },
      ],
      locale: "en_US",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
      creator: "@paimarealestate",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Paima Luxury Interiors & Prime Real Estate",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
    "@id": "https://paimadesign.com/#organization",
    url: "https://paimadesign.com",
    telephone: "+12128904100",
    email: "concierge@paimadesign.com",
    priceRange: "$$$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "575 Madison Avenue",
      addressLocality: "New York",
      addressRegion: "NY",
      postalCode: "10022",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 40.7618,
      longitude: -73.9723,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    sameAs: [
      "https://instagram.com",
      "https://linkedin.com",
      "https://youtube.com",
    ],
  };
}
