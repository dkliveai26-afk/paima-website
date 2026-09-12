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
        <ClerkProvider
          appearance={{
            elements: {
              card: "bg-[#BEB5A9] border border-[#A78D78] shadow-2xl rounded-2xl text-black",
              headerTitle: "font-serif text-2xl text-black font-extrabold",
              headerSubtitle: "font-sans text-xs text-black font-semibold",
              socialButtonsBlockButton:
                "bg-[#E1D4C2] border border-black text-black hover:bg-[#A78D78] font-bold text-xs uppercase tracking-wider",
              formButtonPrimary:
                "bg-[#A78D78] hover:bg-[#BEB5A9] text-black border border-black font-extrabold text-xs uppercase tracking-[0.18em] rounded-full py-3 transition-all",
              footerActionLink: "text-black underline font-bold hover:text-[#A78D78]",
              avatarBox: "w-9 h-9 border border-black rounded-full shadow-md",
              userButtonPopoverCard:
                "bg-[#BEB5A9] border border-[#A78D78] shadow-2xl rounded-xl text-black",
            },
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
