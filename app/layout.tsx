import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import {
  constructMetadata,
  generateOrganizationSchema,
  generateLocalBusinessSchema,
  generateWebSiteSchema,
} from "@/lib/seo";
import { WelcomeEmailTrigger } from "@/components/auth/WelcomeEmailTrigger";

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
  title: "Paima | Luxury Interior Design, Architecture & Prime Real Estate",
  description:
    "Award-winning haute interior architecture and luxury interior design studio orchestrating bespoke residential interiors, private estates, and luxury penthouses in Kolkata, India, and premier global locations.",
  path: "/",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgSchema = generateOrganizationSchema();
  const localBusinessSchema = generateLocalBusinessSchema();
  const websiteSchema = generateWebSiteSchema();

  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="font-sans antialiased bg-[#E1D4C2] text-black selection:bg-black selection:text-[#E1D4C2]">
        <ClerkProvider>
          <WelcomeEmailTrigger />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
