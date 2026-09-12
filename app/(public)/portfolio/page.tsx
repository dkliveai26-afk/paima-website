import type { Metadata } from "next";
import Link from "next/link";
import { constructMetadata } from "@/lib/seo";
import { PortfolioMasonry } from "@/components/ui/PortfolioMasonry";
import { TextSlideFromTop } from "@/components/animations/MotionDirectional";

export const metadata: Metadata = constructMetadata({
  title: "Estates & Portfolio Monograph | Paima",
  description:
    "Explore the Paima monograph: a curated compendium of high-end penthouses, trophy waterfront villas, and contemporary architectural residences.",
  path: "/portfolio",
});

export default function PortfolioPage() {
  return (
    <div className="pt-36 pb-24 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto text-black bg-[#E1D4C2]">
      {/* HEADER */}
      <section aria-label="Portfolio Introduction" className="mb-16">
        <TextSlideFromTop>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[2px] bg-black" />
            <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-black font-extrabold">
              PERMANENT WORKS &amp; COMMISSIONS
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-black tracking-tight leading-[1.1] max-w-4xl">
            Selected Monograph <br />
            <span className="italic text-black">Of Spatial Works.</span>
          </h1>

          <p className="mt-6 font-sans text-sm sm:text-base text-black max-w-2xl font-semibold leading-relaxed">
            Every residence is a bespoke synthesis of its architectural context, geographic atmosphere, and the patron&apos;s personal narrative. Filter by spatial typology below.
          </p>
        </TextSlideFromTop>
      </section>

      {/* MASONRY GRID & FILTERS */}
      <section aria-label="Portfolio Grid">
        <PortfolioMasonry />
      </section>

      {/* BOTTOM ENGAGEMENT */}
      <section className="mt-28 text-center pt-16 border-t border-[#A78D78]/50">
        <TextSlideFromTop>
          <div className="max-w-2xl mx-auto space-y-6">
            <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-black font-extrabold">
              CONFIDENTIAL MONOGRAPH
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-black font-bold">
              Request Our Unlisted Collector Folio
            </h2>
            <p className="font-sans text-xs sm:text-sm text-black font-semibold leading-relaxed">
              Due to strict non-disclosure agreements with private collectors and family offices, our most monumental off-market acquisitions are presented exclusively during private consultations.
            </p>
            <div className="pt-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#A78D78] text-black hover:bg-[#BEB5A9] text-xs font-sans uppercase tracking-[0.2em] font-extrabold transition-all duration-300 shadow-xl border border-black"
              >
                <span>REQUEST PRIVATE PORTFOLIO ACCESS</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </TextSlideFromTop>
      </section>
    </div>
  );
}
