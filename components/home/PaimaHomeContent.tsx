"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Key, Waves, ShieldCheck, Compass, Sparkles } from "lucide-react";
import { PROJECTS, TESTIMONIALS, SERVICES } from "@/lib/data";
import { LuxuryMinimalistHero } from "@/components/home/LuxuryMinimalistHero";
import {
  TextSlideFromTop,
  Element3DReveal,
  FadeUpBottom,
  ImageClipReveal,
  StaggerContainer,
  StaggerItem,
  SlideFromLeft,
  SlideFromRight,
  ParallaxImage,
  MaskedHeadingReveal,
  AnimatedCounter,
  LuxuryMagnetic,
} from "@/components/animations/MotionDirectional";

export function PaimaHomeContent() {
  const topProjects = PROJECTS.slice(0, 3);

  return (
    <div className="relative overflow-hidden bg-[#E1D4C2] text-black">
      {/* ================= HERO COMPONENT (PRESERVED UNTOUCHED) ================= */}
      <LuxuryMinimalistHero />

      {/* ================= ARCHITECTURAL METRICS & AUTHORITY BAR ================= */}
      <section
        aria-label="Studio Authority Milestones"
        className="border-y border-[#A78D78]/50 bg-[#BEB5A9]/40 py-12 px-6 sm:px-8 lg:px-12"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <FadeUpBottom delay={0.05} className="space-y-1">
            <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-black block tracking-tight">
              <AnimatedCounter to={14} suffix="+" />
            </span>
            <span className="text-[10px] font-sans uppercase tracking-[0.25em] font-extrabold text-black">
              Years Heritage
            </span>
          </FadeUpBottom>

          <FadeUpBottom delay={0.12} className="space-y-1">
            <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-black block tracking-tight">
              <AnimatedCounter to={42} suffix="+" />
            </span>
            <span className="text-[10px] font-sans uppercase tracking-[0.25em] font-extrabold text-black">
              Private Estates
            </span>
          </FadeUpBottom>

          <FadeUpBottom delay={0.19} className="space-y-1">
            <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-black block tracking-tight">
              <AnimatedCounter to={4} suffix=" Studios" />
            </span>
            <span className="text-[10px] font-sans uppercase tracking-[0.25em] font-extrabold text-black">
              Milan &bull; Paris &bull; NY &bull; Monaco
            </span>
          </FadeUpBottom>

          <FadeUpBottom delay={0.26} className="space-y-1">
            <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-black block tracking-tight">
              <AnimatedCounter to={100} suffix="%" />
            </span>
            <span className="text-[10px] font-sans uppercase tracking-[0.25em] font-extrabold text-black">
              Bespoke Fabrication
            </span>
          </FadeUpBottom>
        </div>
      </section>

      {/* ================= FEATURED ESTATES & INTERIORS ================= */}
      <section
        aria-label="Prime Curated Properties"
        className="py-24 sm:py-32 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3 max-w-2xl">
            <SlideFromLeft>
              <div className="flex items-center gap-3">
                <span className="w-8 h-[2px] bg-black" />
                <span className="text-[10px] font-sans font-extrabold uppercase tracking-[0.28em] text-black">
                  CURATED MONOGRAPH
                </span>
              </div>
            </SlideFromLeft>
            
            <MaskedHeadingReveal as="h2" className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-black tracking-tight leading-[1.1]">
              Prime Estates &amp; Interiors
            </MaskedHeadingReveal>

            <SlideFromLeft delay={0.12}>
              <p className="font-sans text-xs sm:text-sm text-black font-semibold max-w-xl leading-relaxed">
                A selection of landmark residences and private architectural villas sculpted with natural stone, light, and spatial harmony.
              </p>
            </SlideFromLeft>
          </div>

          <SlideFromRight delay={0.15}>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.2em] font-extrabold text-black hover:text-[#A78D78] transition-colors duration-300 pb-2 border-b border-black group"
            >
              <span>EXPLORE ALL ESTATES ({PROJECTS.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-black transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </SlideFromRight>
        </div>

        {/* Gallery with Staggered 3D Element Reveals */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topProjects.map((project) => (
            <StaggerItem key={project.id}>
              <article className="group relative bg-[#BEB5A9]/50 border border-[#A78D78]/40 rounded-2xl overflow-hidden shadow-xl transition-all duration-500 hover:-translate-y-2 hover:border-black hover:shadow-2xl will-change-transform">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#E1D4C2]">
                  <Image
                    src={project.image}
                    alt={`${project.title} - ${project.category} luxury architectural property by Paima`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-85 transition-opacity duration-500 group-hover:opacity-90" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className="px-3 py-1 bg-[#E1D4C2] text-[9px] font-sans uppercase tracking-[0.2em] font-extrabold text-black rounded-sm border border-black shadow-sm">
                      {project.category}
                    </span>
                    {project.price && (
                      <span className="px-2.5 py-1 bg-[#E1D4C2] backdrop-blur-md text-[10px] font-serif text-black font-extrabold rounded-sm border border-black shadow-sm">
                        {project.price}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-6 bg-[#BEB5A9]/70 border-t border-[#A78D78]/50 flex items-center justify-between transition-colors duration-300 group-hover:bg-[#BEB5A9]">
                  <div>
                    <h3 className="font-serif text-xl text-black font-extrabold">
                      {project.title}
                    </h3>
                    <p className="text-[11px] text-black font-sans tracking-wide uppercase mt-1 font-bold">
                      {project.location} &bull; {project.area}
                    </p>
                  </div>
                  <Link
                    href="/portfolio"
                    className="p-2.5 rounded-full bg-[#A78D78] text-black hover:bg-[#BEB5A9] hover:text-black transition-all duration-300 shadow-md border border-black hover:scale-105"
                    aria-label={`View ${project.title}`}
                  >
                    <ArrowUpRight className="w-4 h-4 text-black transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ================= ABOUT US SECTION ================= */}
      <section
        aria-label="About Paima Ethos"
        className="py-24 sm:py-32 bg-[#BEB5A9]/50 border-y border-[#A78D78]/50 relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Image Mask Reveal with Parallax */}
            <div className="lg:col-span-6 relative">
              <ImageClipReveal>
                <ParallaxImage offset={25}>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl bg-[#E1D4C2] group border border-[#A78D78]/50">
                    <Image
                      src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
                      alt="Paima Architectural Minimalist Villa and Pool"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-105"
                    />
                  </div>
                </ParallaxImage>
              </ImageClipReveal>
            </div>

            {/* Right Side Text Slide From Right */}
            <div className="lg:col-span-6 space-y-8">
              <div>
                <SlideFromRight>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-[2px] bg-black" />
                    <span className="text-[10px] font-sans uppercase tracking-[0.28em] text-black font-extrabold">
                      ABOUT PAIMA GROUP
                    </span>
                  </div>
                </SlideFromRight>
                
                <MaskedHeadingReveal as="h2" className="font-serif text-3xl sm:text-5xl font-bold text-black tracking-tight leading-[1.15]">
                  Subtractive Architecture &amp; <br />
                  <span className="italic text-black">Prime Real Estate Authority.</span>
                </MaskedHeadingReveal>
              </div>

              <SlideFromRight delay={0.15}>
                <p className="font-sans text-sm sm:text-base text-black font-semibold leading-relaxed">
                  Founded to transcend traditional brokerage, Paima merges the highest tiers of luxury real estate representation with bespoke spatial interior architecture. We advise collectors, family offices, and discerning individuals on acquiring, building, and styling exceptional residential properties.
                </p>
              </SlideFromRight>

              <FadeUpBottom delay={0.25}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[#A78D78]/50">
                  <div className="space-y-2 p-4 rounded-xl bg-[#BEB5A9]/40 border border-[#A78D78]/30 transition-all duration-300 hover:border-black">
                    <div className="flex items-center gap-2 text-black">
                      <Key className="w-4 h-4 text-black" />
                      <h3 className="font-serif text-base text-black font-extrabold">Off-Market Access</h3>
                    </div>
                    <p className="text-xs text-black leading-relaxed font-semibold">
                      Confidential access to trophy waterfront villas and unlisted penthouses globally.
                    </p>
                  </div>

                  <div className="space-y-2 p-4 rounded-xl bg-[#BEB5A9]/40 border border-[#A78D78]/30 transition-all duration-300 hover:border-black">
                    <div className="flex items-center gap-2 text-black">
                      <Waves className="w-4 h-4 text-black" />
                      <h3 className="font-serif text-base text-black font-extrabold">Water &amp; Landscape Harmony</h3>
                    </div>
                    <p className="text-xs text-black leading-relaxed font-semibold">
                      Sculpted infinity edges, sunken lounge decks, and seamless indoor-outdoor stone transitions.
                    </p>
                  </div>
                </div>
              </FadeUpBottom>

              <FadeUpBottom delay={0.35}>
                <div className="pt-2">
                  <LuxuryMagnetic strength={10} className="inline-block">
                    <Link
                      href="/about"
                      className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#A78D78] text-black hover:bg-[#BEB5A9] hover:text-black text-xs font-sans uppercase tracking-[0.2em] font-extrabold transition-all duration-300 shadow-xl border border-black hover:scale-102"
                    >
                      <span>OUR HERITAGE &amp; LEADERSHIP</span>
                      <ArrowUpRight className="w-4 h-4 text-black transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Link>
                  </LuxuryMagnetic>
                </div>
              </FadeUpBottom>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SERVICES SECTION ================= */}
      <section
        aria-label="Paima Offerings"
        className="py-24 sm:py-32 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto"
      >
        <div className="mb-16">
          <SlideFromLeft>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-[2px] bg-black" />
              <span className="text-[10px] font-sans font-extrabold uppercase tracking-[0.28em] text-black">
                DISCIPLINES &amp; ADVISORY
              </span>
            </div>
          </SlideFromLeft>
          <MaskedHeadingReveal as="h2" className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-black tracking-tight leading-[1.1]">
            Core Offerings
          </MaskedHeadingReveal>
          <SlideFromLeft delay={0.12}>
            <p className="font-sans text-xs sm:text-sm text-black max-w-xl font-semibold leading-relaxed mt-3">
              From prime real estate acquisitions to full architectural renovations, 3D CGI simulations, and curated fine furnishings.
            </p>
          </SlideFromLeft>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, idx) => (
            <StaggerItem key={service.id}>
              <div className="bg-[#BEB5A9]/50 p-7 border border-[#A78D78]/50 rounded-2xl shadow-xl hover:border-black hover:-translate-y-1.5 transition-all duration-400 h-full flex flex-col justify-between group will-change-transform">
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#E1D4C2] mb-6 rounded-xl">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <span className="text-[9px] font-sans uppercase tracking-[0.2em] text-black font-extrabold block mb-2">
                    {service.tag}
                  </span>
                  <h3 className="font-serif text-xl text-black font-extrabold mb-3">
                    {service.title}
                  </h3>
                  <p className="font-sans text-xs text-black leading-relaxed font-semibold">
                    {service.shortDescription}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#A78D78]/50 flex items-center justify-between">
                  <Link
                    href="/services"
                    className="text-xs uppercase tracking-[0.18em] font-extrabold text-black hover:text-[#A78D78] transition-colors flex items-center gap-1 group/btn"
                  >
                    <span>VIEW SCOPE</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-black transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </Link>
                  <span className="text-[10px] font-mono text-black font-extrabold">0{idx + 1}</span>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ================= TESTIMONIALS SECTION ================= */}
      <section
        aria-label="Client Perspectives"
        className="py-24 sm:py-32 bg-[#BEB5A9]/40 border-t border-[#A78D78]/50 px-4 sm:px-8 lg:px-12"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <SlideFromLeft>
              <span className="text-[10px] font-sans font-extrabold uppercase tracking-[0.28em] text-black">
                ENDORSEMENTS
              </span>
            </SlideFromLeft>
            <MaskedHeadingReveal as="h2" className="font-serif text-3xl sm:text-5xl font-bold text-black tracking-tight">
              Patron Perspectives
            </MaskedHeadingReveal>
            <FadeUpBottom delay={0.12}>
              <p className="font-sans text-xs sm:text-sm text-black font-semibold">
                Reflections from private buyers, collectors, and architectural estate patrons.
              </p>
            </FadeUpBottom>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <StaggerItem key={t.id}>
                <blockquote className="h-full bg-[#BEB5A9]/60 p-8 border border-[#A78D78]/50 rounded-2xl shadow-xl hover:border-black hover:-translate-y-1 transition-all duration-400 flex flex-col justify-between">
                  <div>
                    <span className="font-serif text-5xl text-black block mb-4 leading-none">
                      &ldquo;
                    </span>
                    <p className="font-serif text-base sm:text-lg text-black font-semibold leading-relaxed mb-6">
                      {t.quote}
                    </p>
                  </div>
                  <footer className="pt-4 border-t border-[#A78D78]/50 space-y-1">
                    <cite className="not-italic font-sans text-xs uppercase tracking-[0.18em] font-extrabold text-black block">
                      {t.client}
                    </cite>
                    <p className="text-[11px] text-black font-sans font-bold">
                      {t.title} &bull; {t.location}
                    </p>
                  </footer>
                </blockquote>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ================= PRIVATE CONSULTATION CTA ================= */}
      <section
        aria-label="Private Consultation"
        className="py-24 sm:py-32 bg-[#BEB5A9] border-t border-[#A78D78]/50 text-black relative overflow-hidden"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center space-y-8 relative z-10">
          <div>
            <SlideFromLeft>
              <span className="text-[10px] font-sans font-extrabold uppercase tracking-[0.3em] text-black">
                PRIVATE CLIENT CONCIERGE
              </span>
            </SlideFromLeft>
            <MaskedHeadingReveal as="h2" className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black mt-4">
              Begin Your Architectural Acquisition
            </MaskedHeadingReveal>
          </div>

          <FadeUpBottom delay={0.15}>
            <p className="font-sans text-xs sm:text-sm text-black max-w-xl mx-auto font-bold leading-relaxed">
              Whether you wish to acquire an unlisted waterfront estate or commission a turnkey architectural interior transformation, our partners are at your service.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4 pt-8">
              <LuxuryMagnetic strength={12} className="inline-block">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#E1D4C2] text-black hover:bg-[#A78D78] text-xs font-sans uppercase tracking-[0.2em] font-extrabold transition-all duration-300 shadow-xl border border-black hover:scale-105"
                >
                  <span>PRIVATE INQUIRIES</span>
                  <ArrowUpRight className="w-4 h-4 text-black transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              </LuxuryMagnetic>
            </div>
          </FadeUpBottom>
        </div>
      </section>
    </div>
  );
}
