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
import { PaimaAuthProvider } from "@/components/auth/PaimaAuthContext";
import { PaimaAuthModal } from "@/components/auth/PaimaAuthModal";

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
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: "#000000",
              colorBackground: "transparent",
              borderRadius: "1rem",
              fontFamily: "var(--font-sans), Inter, sans-serif",
            },
            elements: {
              modalBackdrop: "bg-black/60 backdrop-blur-md",
              modalContent: "bg-transparent shadow-none border-none p-0 flex items-center justify-center",
              cardBox: "shadow-2xl rounded-3xl overflow-hidden max-w-md w-full",
              card: "bg-[#E1D4C2]/95 backdrop-blur-2xl border border-[#A78D78]/60 shadow-2xl rounded-3xl p-6 sm:p-8 text-black",
              headerTitle: "font-serif text-2xl sm:text-3xl font-bold text-black tracking-tight",
              headerSubtitle: "text-xs font-sans text-black/75 tracking-normal mt-1 font-medium",
              socialButtonsBlockButton: "bg-[#BEB5A9]/50 hover:bg-[#BEB5A9] border border-[#A78D78]/60 text-black font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all h-12 shadow-sm flex items-center justify-center gap-2",
              socialButtonsBlockButtonText: "font-sans font-bold text-xs uppercase tracking-wider text-black",
              socialButtonsProviderIcon__google: "w-5 h-5",
              dividerLine: "bg-[#A78D78]/40",
              dividerText: "text-[10px] font-sans uppercase tracking-widest text-black/60 font-extrabold",
              formFieldLabel: "text-[10px] font-sans uppercase tracking-[0.16em] font-extrabold text-black",
              formFieldInput: "bg-[#E1D4C2] border border-[#A78D78] focus:border-black text-black text-xs font-bold rounded-xl h-11 transition-all",
              formButtonPrimary: "bg-[#1A1A1A] hover:bg-black text-[#E1D4C2] font-sans text-xs uppercase tracking-[0.18em] font-extrabold rounded-full h-12 shadow-lg transition-all border border-black",
              footerActionLink: "text-black font-bold hover:underline",
              footerActionText: "text-xs text-black/70",
              footer: "border-t border-[#A78D78]/30 pt-4",
              identityPreviewText: "text-xs text-black font-bold",
              identityPreviewEditButton: "text-black hover:underline",
            },
          }}
        >
          <PaimaAuthProvider>
            <WelcomeEmailTrigger />
            {children}
            <PaimaAuthModal />
          </PaimaAuthProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
