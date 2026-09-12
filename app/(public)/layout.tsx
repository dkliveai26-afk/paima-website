import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-[#E1D4C2] text-black text-xs uppercase tracking-widest border border-black font-extrabold shadow-xl"
      >
        Skip to primary content
      </a>
      <Navbar />
      <main id="main-content" className="relative min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}
