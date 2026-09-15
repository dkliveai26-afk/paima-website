import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { constructMetadata } from "@/lib/seo";
import { TIMELINE } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  SlideFromLeft,
  SlideFromRight,
  FadeUpBottom,
  StaggerContainer,
  StaggerItem,
  ParallaxImage,
  TextSlideFromTop,
  SlowCardReveal,
} from "@/components/animations/MotionDirectional";
import { Compass, Hammer, Layers, Sparkles, VolumeX } from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "About Paima | Luxury Interior Design Studio & Architectural Heritage",
  description:
    "Discover Paima's philosophy of subtractive luxury, rare artisanal materials, and architectural silence across Kolkata, India, Paris, New York, and Monaco.",
  path: "/about",
  keywords: [
    "About Paima Interior Design",
    "Luxury Interior Designer Kolkata",
    "Subtractive Interior Architecture",
    "Luxury Residential Interior Design India",
    "Artisanal Stonemasonry & Joinery",
  ],
});

export default function AboutPage() {
  return (
    <article className="pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto text-black bg-[#E1D4C2]">
      {/* MANIFESTO HEADER - APP-STYLE GROUPED CARD */}
      <section aria-label="Manifesto Header" className="mb-14 sm:mb-20 lg:mb-28">
        <SlideFromLeft>
          <div className="bg-[#BEB5A9]/50 border border-[#A78D78]/60 p-6 sm:p-12 lg:p-14 rounded-2xl sm:rounded-3xl shadow-xl space-y-6 sm:space-y-8 backdrop-blur-sm">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-[2px] bg-black" />
                <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-black font-extrabold">
                  MANIFESTO &amp; ORIGINS
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-6xl lg:text-7xl font-bold text-black tracking-tight leading-[1.1] max-w-5xl break-words">
                The Synthesis of Architecture, <br />
                <span className="italic text-black">Silence, and Matter.</span>
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 pt-6 sm:pt-8 border-t border-[#A78D78]/50 items-start">
              <div className="lg:col-span-4">
                <span className="px-3 py-1 bg-[#E1D4C2] border border-black text-[10px] font-sans uppercase tracking-[0.25em] text-black font-extrabold rounded-sm shadow-sm inline-block">
                  FOUNDATIONAL DOGMA
                </span>
              </div>
              <div className="lg:col-span-8">
                <p className="font-serif text-lg sm:text-2xl text-black font-bold leading-relaxed">
                  We believe interior architecture should not shout. In an age of sensory overload, true luxury is the quiet dignity of uncluttered space, where natural shadows move across textured stone, and every breath feels unhurried.
                </p>
              </div>
            </div>
          </div>
        </SlideFromLeft>
      </section>

      {/* =========================================================================
          EDITORIAL PILLARS & CARDS SYSTEM (6 REFINED ARCHITECTURAL BLOCKS)
          ========================================================================= */}
      <section aria-label="Paima Editorial Cards System" className="mb-16 sm:mb-28 lg:mb-40">
        <SectionHeading
          eyebrow="PILLARS OF ARCHITECTURAL EXECUTION"
          title="Curated Design Discipline"
          subtitle="Six foundational tenets guiding every residential acquisition, interior renovation, and spatial composition."
          align="left"
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 mt-8 sm:mt-12">
          {/* 1. STUDIO PHILOSOPHY (HERO WIDE CARD - SPAN 7) */}
          <SlideFromLeft delay={0.1} className="md:col-span-7">
            <div className="group relative bg-[#BEB5A9]/70 border border-[#A78D78]/60 rounded-2xl overflow-hidden shadow-xl hover:-translate-y-1.5 transition-all duration-500 hover:border-black hover:shadow-2xl flex flex-col justify-between h-full">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#E1D4C2]">
                <Image
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
                  alt="Studio Philosophy - Architectural Minimalist Living Space"
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3.5 py-1.5 bg-[#E1D4C2] text-black text-[9px] font-sans uppercase tracking-[0.25em] font-extrabold border border-black rounded-sm shadow-sm">
                    01 &bull; STUDIO PHILOSOPHY
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                <h3 className="font-serif text-xl sm:text-3xl text-black font-extrabold tracking-tight">
                  Subtractive Architecture &amp; Spatial Restraint
                </h3>
                <p className="font-sans text-xs sm:text-sm text-black font-bold leading-relaxed">
                  Rather than decorating surface area, we carve away excess. By prioritizing spatial volume, clean geometries, and honest materiality, our interiors cultivate deep emotional tranquility.
                </p>
                <div className="pt-2 border-t border-[#A78D78]/40 flex items-center justify-between text-[11px] sm:text-xs text-black font-mono font-extrabold">
                  <span>MILAN &bull; PARIS &bull; MONACO &bull; NY</span>
                  <Compass className="w-4 h-4 text-black" />
                </div>
              </div>
            </div>
          </SlideFromLeft>

          {/* 2. DESIGN APPROACH (MEDIUM CARD - SPAN 5) */}
          <SlideFromRight delay={0.2} className="md:col-span-5">
            <div className="group relative bg-[#BEB5A9]/70 border border-[#A78D78]/60 rounded-2xl overflow-hidden shadow-xl hover:-translate-y-1.5 transition-all duration-500 hover:border-black hover:shadow-2xl flex flex-col justify-between h-full">
              <div className="relative aspect-square w-full overflow-hidden bg-[#E1D4C2]">
                <Image
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
                  alt="Design Approach - Sculptural Marble & Proportions"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3.5 py-1.5 bg-[#E1D4C2] text-black text-[9px] font-sans uppercase tracking-[0.25em] font-extrabold border border-black rounded-sm shadow-sm">
                    02 &bull; DESIGN APPROACH
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-3">
                <h3 className="font-serif text-xl sm:text-2xl text-black font-extrabold tracking-tight">
                  Proportion &amp; Light Modulation
                </h3>
                <p className="font-sans text-xs text-black font-bold leading-relaxed">
                  Light is our primary medium. We align sightlines to capture golden morning rays and dusk gradients across brushed limestone walls.
                </p>
                <div className="pt-2 border-t border-[#A78D78]/40 flex items-center justify-between text-[11px] sm:text-xs text-black font-mono font-extrabold">
                  <span>NATURAL ILLUMINATION</span>
                  <Sparkles className="w-4 h-4 text-black" />
                </div>
              </div>
            </div>
          </SlideFromRight>

          {/* 3. CRAFTSMANSHIP (CARD - SPAN 4) */}
          <SlowCardReveal delay={0.1} className="md:col-span-4">
            <div className="group relative bg-[#BEB5A9]/60 p-6 sm:p-8 border border-[#A78D78]/50 rounded-2xl shadow-xl hover:-translate-y-1.5 transition-all duration-500 hover:border-black hover:shadow-2xl flex flex-col justify-between h-full space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-black font-extrabold">
                    03 &bull; CRAFTSMANSHIP
                  </span>
                  <Hammer className="w-4 h-4 text-black" />
                </div>
                <h3 className="font-serif text-lg sm:text-2xl text-black font-extrabold">
                  Master Stonemasonry &amp; Joinery
                </h3>
                <p className="font-sans text-xs text-black font-bold leading-relaxed">
                  We collaborate exclusively with third-generation European artisans. Every travertine slab is hand-honed and grain-matched across uninterrupted kitchen islands.
                </p>
              </div>
              <div className="pt-4 border-t border-[#A78D78]/40 text-[11px] font-mono text-black font-extrabold">
                Hand-cut Roman Travertine &bull; Fluted Oak
              </div>
            </div>
          </SlowCardReveal>

          {/* 4. MATERIAL INTELLIGENCE (CARD - SPAN 4) */}
          <SlowCardReveal delay={0.24} className="md:col-span-4">
            <div className="group relative bg-[#BEB5A9]/60 p-6 sm:p-8 border border-[#A78D78]/50 rounded-2xl shadow-xl hover:-translate-y-1.5 transition-all duration-500 hover:border-black hover:shadow-2xl flex flex-col justify-between h-full space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-black font-extrabold">
                    04 &bull; MATERIAL INTELLIGENCE
                  </span>
                  <Layers className="w-4 h-4 text-black" />
                </div>
                <h3 className="font-serif text-lg sm:text-2xl text-black font-extrabold">
                  Organic Textures &amp; Tactility
                </h3>
                <p className="font-sans text-xs text-black font-bold leading-relaxed">
                  Materials should never impersonate. We celebrate raw tactile authenticity: cool honed marble, warm patinated brass, and unrefined linen upholstery.
                </p>
              </div>
              <div className="pt-4 border-t border-[#A78D78]/40 text-[11px] font-mono text-black font-extrabold">
                Unpolished Brass &bull; Belgian Linen
              </div>
            </div>
          </SlowCardReveal>

          {/* 5. SPATIAL EXPERIENCE (CARD - SPAN 4) */}
          <SlowCardReveal delay={0.38} className="md:col-span-4">
            <div className="group relative bg-[#BEB5A9]/60 p-6 sm:p-8 border border-[#A78D78]/50 rounded-2xl shadow-xl hover:-translate-y-1.5 transition-all duration-500 hover:border-black hover:shadow-2xl flex flex-col justify-between h-full space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-black font-extrabold">
                    05 &bull; SPATIAL EXPERIENCE
                  </span>
                  <VolumeX className="w-4 h-4 text-black" />
                </div>
                <h3 className="font-serif text-lg sm:text-2xl text-black font-extrabold">
                  Acoustic Serenity &amp; Flow
                </h3>
                <p className="font-sans text-xs text-black font-bold leading-relaxed">
                  A truly luxurious home possesses acoustic softness. We integrate acoustic sub-wall backing and hidden micro-perforated timber ceilings for sanctuary-like quietness.
                </p>
              </div>
              <div className="pt-4 border-t border-[#A78D78]/40 text-[11px] font-mono text-black font-extrabold">
                Concealed Acoustic Backing &bull; Low Reverberation
              </div>
            </div>
          </SlowCardReveal>

          {/* 6. ATTENTION TO DETAIL (HERO BOTTOM CARD - SPAN 12) */}
          <SlowCardReveal delay={0.2} className="md:col-span-12">
            <div className="group relative bg-[#BEB5A9] border border-[#A78D78] p-6 sm:p-12 rounded-2xl shadow-xl hover:-translate-y-1.5 transition-all duration-500 hover:border-black hover:shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="px-3.5 py-1.5 bg-[#E1D4C2] text-black text-[9px] font-sans uppercase tracking-[0.25em] font-extrabold border border-black rounded-sm shadow-sm inline-block">
                  06 &bull; ATTENTION TO DETAIL
                </span>
                <h3 className="font-serif text-2xl sm:text-4xl text-black font-extrabold tracking-tight">
                  Millimeter Precision &amp; Invisible Architecture
                </h3>
                <p className="font-sans text-xs sm:text-sm text-black font-bold leading-relaxed">
                  True elegance resides in what is unseen: shadowline baseboards, flush frameless door reveals, floor-recessed curtain tracks, and concealed HVAC diffusers integrated into stone joints.
                </p>
                <div className="pt-2 sm:pt-4 flex flex-wrap gap-2 sm:gap-3">
                  <span className="px-2.5 sm:px-3 py-1 bg-[#E1D4C2] text-black text-[9px] sm:text-[10px] font-sans uppercase tracking-wider font-extrabold border border-black">
                    Flush Door Reveals
                  </span>
                  <span className="px-2.5 sm:px-3 py-1 bg-[#E1D4C2] text-black text-[9px] sm:text-[10px] font-sans uppercase tracking-wider font-extrabold border border-black">
                    Shadowline Skirting
                  </span>
                  <span className="px-2.5 sm:px-3 py-1 bg-[#E1D4C2] text-black text-[9px] sm:text-[10px] font-sans uppercase tracking-wider font-extrabold border border-black">
                    Concealed Linear Diffusers
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 relative aspect-[16/10] overflow-hidden rounded-xl bg-[#E1D4C2] border border-[#A78D78]">
                <Image
                  src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80"
                  alt="Attention to Detail - Flush Architectural Detailing"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>
            </div>
          </SlowCardReveal>
        </div>
      </section>

      {/* TIMELINE SECTION */}
      <section aria-label="Chronological Timeline" className="mb-16 sm:mb-28 lg:mb-40">
        <SectionHeading
          eyebrow="MILESTONES &amp; LEGACY"
          title="A Decade of Architectural Evolution"
          subtitle="From our beginnings in Milan to orchestrating private estates across four continents."
          align="center"
        />

        <div className="relative max-w-4xl mx-auto mt-10 sm:mt-16">
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#A78D78]/50 -translate-x-1/2" />

          <div className="space-y-6 sm:space-y-16">
            {TIMELINE.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <SlowCardReveal key={item.year} delay={0.12 * idx}>
                  <div
                    className={`relative flex flex-col md:flex-row items-start ${
                      isEven ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    <div className="w-full md:w-[45%] bg-[#BEB5A9]/60 p-6 sm:p-8 border border-[#A78D78]/50 rounded-2xl shadow-xl hover:border-black transition-all duration-400 hover:-translate-y-1">
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <span className="font-serif text-xl sm:text-2xl font-black text-black">
                          {item.year}
                        </span>
                        <span className="px-2.5 py-0.5 bg-[#E1D4C2] border border-black text-[9px] font-sans uppercase tracking-widest text-black font-extrabold rounded-sm">
                          {item.milestone}
                        </span>
                      </div>
                      <h3 className="font-serif text-base sm:text-lg text-black mb-2 font-black">
                        {item.title}
                      </h3>
                      <p className="font-sans text-xs text-black leading-relaxed font-semibold">
                        {item.description}
                      </p>
                    </div>

                    <div className="hidden md:flex absolute left-1/2 top-8 -translate-x-1/2 w-7 h-7 rounded-full bg-[#E1D4C2] border border-black items-center justify-center z-10">
                      <span className="w-2 h-2 rounded-full bg-black" />
                    </div>
                  </div>
                </SlowCardReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="pt-6 sm:pt-12 text-center">
        <TextSlideFromTop>
          <div className="p-8 sm:p-16 bg-[#BEB5A9] text-black border border-[#A78D78] max-w-3xl mx-auto space-y-6 rounded-2xl shadow-2xl">
            <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-black font-extrabold">
              NEXT STEP
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-black font-extrabold break-words">
              Collaborate on Your Next Spatial Masterpiece
            </h2>
            <p className="font-sans text-xs sm:text-sm text-black max-w-md mx-auto font-bold leading-relaxed">
              We look forward to understanding your aspirations, lifestyle, and architectural preferences.
            </p>
            <div className="pt-2 sm:pt-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-[#E1D4C2] text-black hover:bg-[#A78D78] text-xs font-sans uppercase tracking-[0.2em] font-extrabold transition-all duration-300 shadow-xl border border-black w-full sm:w-auto min-h-[48px]"
              >
                <span>SCHEDULE PRIVATE CONSULTATION &rarr;</span>
              </Link>
            </div>
          </div>
        </TextSlideFromTop>
      </section>
    </article>
  );
}
