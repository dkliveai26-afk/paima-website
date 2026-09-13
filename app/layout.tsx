import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { constructMetadata, generateLocalBusinessSchema } from "@/lib/seo";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = constructMetadata({
  title: "Paima | Haute Architecture & Luxury Real Estate",
  description:
    "Award-winning interior architecture and prime real estate studio orchestrating private residences, collector estates, and luxury penthouses across Paris, New York, Monaco, and Los Angeles.",
  path: "/",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schemaMarkup = generateLocalBusinessSchema();

  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />
      </head>
      <body className="font-sans antialiased bg-[#E1D4C2] text-black selection:bg-black selection:text-[#E1D4C2]">
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
