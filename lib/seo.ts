import type { Metadata } from "next";

export const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://paimadesign.com";

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
    "Luxury Interior Design",
    "Interior Design Services",
    "Interior Designer",
    "Luxury Interior Architecture",
    "Residential Interior Design",
    "Premium Interior Design",
    "Interior Design Kolkata",
    "Luxury Interior Design Kolkata",
    "Interior Design Services India",
    "Luxury Interior Architecture India",
    "Paima Luxury Interiors",
    "Paima Prime Real Estate",
    "Haute Interior Architecture",
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
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
      apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
    },
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

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: "PAIMA",
    legalName: "Paima Luxury Interiors & Prime Real Estate Group",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.svg`,
    description:
      "PAIMA is a haute interior architecture and luxury interior design studio orchestrating bespoke residential interiors, private estates, and luxury penthouses in Kolkata, India, and globally.",
    email: "concierge@paimadesign.com",
    telephone: "+12128904100",
    sameAs: [
      "https://instagram.com/paimarealestate",
      "https://linkedin.com/company/paima-group",
      "https://youtube.com/c/paimaestates",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+12128904100",
      contactType: "customer service",
      email: "concierge@paimadesign.com",
      availableLanguage: ["English", "Hindi", "French"],
    },
  };
}

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "InteriorDesigner",
    "@id": `${BASE_URL}/#localbusiness`,
    name: "Paima Luxury Interiors & Real Estate",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
    url: BASE_URL,
    telephone: "+12128904100",
    email: "concierge@paimadesign.com",
    priceRange: "$$$$$",
    areaServed: [
      {
        "@type": "City",
        name: "Kolkata",
      },
      {
        "@type": "State",
        name: "West Bengal",
      },
      {
        "@type": "Country",
        name: "India",
      },
      {
        "@type": "Country",
        name: "United States",
      },
      {
        "@type": "Country",
        name: "France",
      },
      {
        "@type": "Country",
        name: "Monaco",
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "575 Madison Avenue",
      addressLocality: "New York",
      addressRegion: "NY",
      postalCode: "10022",
      addressCountry: "US",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    sameAs: [
      "https://instagram.com/paimarealestate",
      "https://linkedin.com/company/paima-group",
      "https://youtube.com/c/paimaestates",
    ],
  };
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    url: BASE_URL,
    name: "PAIMA — Luxury Interior Design & Prime Real Estate",
    description:
      "Bespoke interior architecture, residential interior design, and prime real estate acquisition in Kolkata, India, and premier global destinations.",
    publisher: {
      "@id": `${BASE_URL}/#organization`,
    },
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
