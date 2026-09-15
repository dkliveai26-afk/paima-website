import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import PaimaConcierge from "@/components/ui/PaimaConcierge";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScroll>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-[#E1D4C2] text-black text-xs uppercase tracking-widest border border-black font-extrabold shadow-xl"
      >
        Skip to primary content
      </a>
      <Navbar />
      <main id="main-content" className="relative min-h-screen w-full max-w-full overflow-x-clip">
        {children}
      </main>
      <Footer />
      <PaimaConcierge />
    </SmoothScroll>
  );
}
