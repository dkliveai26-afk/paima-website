"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Key, Waves } from "lucide-react";
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
  luxuryEase,
} from "@/components/animations/MotionDirectional";

function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return isClient;
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isDesktop;
}

export function PaimaHomeContent() {
  const topProjects = PROJECTS.slice(0, 3);
  const isClient = useIsClient();
  const isDesktop = useIsDesktop();
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative overflow-hidden bg-[#E1D4C2] text-black">
      {/* ================= HERO COMPONENT (PRESERVED UNTOUCHED) ================= */}
      <LuxuryMinimalistHero />

      {/* ================= FEATURED ESTATES & INTERIORS ================= */}
      <section
        aria-label="Prime Curated Properties"
        className="py-16 sm:py-24 lg:py-32 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <SlideFromLeft>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-[2px] bg-black" />
                <span className="text-[10px] font-sans font-extrabold uppercase tracking-[0.28em] text-black">
                  CURATED MONOGRAPH
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-black tracking-tight break-words">
                Prime Estates &amp; Interiors
              </h2>
              <p className="font-sans text-xs sm:text-sm text-black font-semibold max-w-xl leading-relaxed">
                A selection of landmark residences and private architectural villas sculpted with natural stone, light, and spatial harmony.
              </p>
            </div>
          </SlideFromLeft>

          <SlideFromRight delay={0.15}>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.2em] font-extrabold text-black hover:text-[#A78D78] transition-colors duration-300 pb-2 border-b border-black group min-h-[44px]"
            >
              <span>EXPLORE ALL ESTATES ({PROJECTS.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-black transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </SlideFromRight>
        </div>

        {/* 3-Card Architectural Slide Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {topProjects.map((project, idx) => {
            // Unanimated fallback for SSR / Reduced Motion
            if (!isClient || shouldReduceMotion) {
              return (
                <div key={project.id} className="relative">
                  <article className="group relative bg-[#BEB5A9]/50 border border-[#A78D78]/40 rounded-2xl overflow-hidden shadow-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-black hover:shadow-2xl">
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#E1D4C2]">
                      <Image
                        src={project.image}
                        alt={`${project.title} - ${project.category} luxury architectural property by Paima`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-85" />

                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                        <span className="px-3 py-1 bg-[#E1D4C2] text-[9px] font-sans uppercase tracking-[0.2em] font-extrabold text-black rounded-sm border border-black">
                          {project.category}
                        </span>
                        {project.price && (
                          <span className="px-2.5 py-1 bg-[#E1D4C2] backdrop-blur-md text-[10px] font-serif text-black font-extrabold rounded-sm border border-black">
                            {project.price}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 bg-[#BEB5A9]/70 border-t border-[#A78D78]/50 flex items-center justify-between">
                      <div className="min-w-0 pr-3">
                        <h3 className="font-serif text-lg sm:text-xl text-black font-extrabold truncate">
                          {project.title}
                        </h3>
                        <p className="text-[11px] text-black font-sans tracking-wide uppercase mt-1 font-bold truncate">
                          {project.location} &bull; {project.area}
                        </p>
                      </div>
                      <Link
                        href="/portfolio"
                        className="min-w-[44px] min-h-[44px] rounded-full bg-[#A78D78] text-black hover:bg-[#BEB5A9] hover:text-black transition-colors shadow-md border border-black flex items-center justify-center shrink-0"
                        aria-label={`View ${project.title}`}
                      >
                        <ArrowUpRight className="w-4 h-4 text-black" />
                      </Link>
                    </div>
                  </article>
                </div>
              );
            }

            // Desktop 3-Card Architectural Reveal Motion Settings
            let initialMotion: { x?: string | number; y?: number; opacity: number; scale?: number } = { opacity: 0 };
            let inViewMotion: { x?: string | number; y?: number; opacity: number; scale?: number } = { opacity: 1 };
            let transitionConfig = { duration: 1.15, delay: 0.12, ease: luxuryEase };
            let zIndexClass = "relative z-10";

            if (isDesktop) {
              if (idx === 0) {
                // Left Card: starts offset behind center card, slides LEFT to 0
                initialMotion = { x: "108%", opacity: 0, scale: 0.96 };
                inViewMotion = { x: "0%", opacity: 1, scale: 1 };
                transitionConfig = { duration: 1.15, delay: 0.12, ease: luxuryEase };
                zIndexClass = "relative z-10";
              } else if (idx === 1) {
                // Center Card: Anchor, stays fixed in place, fades & stabilizes
                initialMotion = { opacity: 0, scale: 0.98 };
                inViewMotion = { opacity: 1, scale: 1 };
                transitionConfig = { duration: 0.9, delay: 0.04, ease: luxuryEase };
                zIndexClass = "relative z-20";
              } else if (idx === 2) {
                // Right Card: starts offset behind center card, slides RIGHT to 0
                initialMotion = { x: "-108%", opacity: 0, scale: 0.96 };
                inViewMotion = { x: "0%", opacity: 1, scale: 1 };
                transitionConfig = { duration: 1.15, delay: 0.12, ease: luxuryEase };
                zIndexClass = "relative z-10";
              }
            } else {
              // Mobile / Tablet: Clean vertical fade-up to preserve responsive grid
              initialMotion = { y: 24, opacity: 0 };
              inViewMotion = { y: 0, opacity: 1 };
              transitionConfig = { duration: 0.8, delay: idx * 0.12, ease: luxuryEase };
              zIndexClass = "relative z-10";
            }

            return (
              <motion.div
                key={project.id}
                initial={initialMotion}
                whileInView={inViewMotion}
                viewport={{ once: true, margin: "-40px" }}
                transition={transitionConfig}
                className={zIndexClass}
              >
                <article className="group relative bg-[#BEB5A9]/50 border border-[#A78D78]/40 rounded-2xl overflow-hidden shadow-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-black hover:shadow-2xl">
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#E1D4C2]">
                    <Image
                      src={project.image}
                      alt={`${project.title} - ${project.category} luxury architectural property by Paima`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-85" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                      <span className="px-3 py-1 bg-[#E1D4C2] text-[9px] font-sans uppercase tracking-[0.2em] font-extrabold text-black rounded-sm border border-black">
                        {project.category}
                      </span>
                      {project.price && (
                        <span className="px-2.5 py-1 bg-[#E1D4C2] backdrop-blur-md text-[10px] font-serif text-black font-extrabold rounded-sm border border-black">
                          {project.price}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="p-5 sm:p-6 bg-[#BEB5A9]/70 border-t border-[#A78D78]/50 flex items-center justify-between">
                    <div className="min-w-0 pr-3">
                      <h3 className="font-serif text-lg sm:text-xl text-black font-extrabold truncate">
                        {project.title}
                      </h3>
                      <p className="text-[11px] text-black font-sans tracking-wide uppercase mt-1 font-bold truncate">
                        {project.location} &bull; {project.area}
                      </p>
                    </div>
                    <Link
                      href="/portfolio"
                      className="min-w-[44px] min-h-[44px] rounded-full bg-[#A78D78] text-black hover:bg-[#BEB5A9] hover:text-black transition-colors shadow-md border border-black flex items-center justify-center shrink-0"
                      aria-label={`View ${project.title}`}
                    >
                      <ArrowUpRight className="w-4 h-4 text-black" />
                    </Link>
                  </div>
                </article>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ================= ABOUT US SECTION ================= */}
      <section
        aria-label="About Paima Ethos"
        className="py-16 sm:py-24 lg:py-32 bg-[#BEB5A9]/50 border-y border-[#A78D78]/50 relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
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
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </ParallaxImage>
              </ImageClipReveal>
            </div>

            {/* Right Side Text Slide From Right */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8">
              <SlideFromRight>
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-[2px] bg-black" />
                  <span className="text-[10px] font-sans uppercase tracking-[0.28em] text-black font-extrabold">
                    ABOUT PAIMA GROUP
                  </span>
                </div>
                <h2 className="font-serif text-3xl sm:text-5xl font-bold text-black tracking-tight leading-[1.15] break-words">
                  Subtractive Architecture &amp; <br />
                  <span className="italic text-black">Prime Real Estate Authority.</span>
                </h2>
              </SlideFromRight>

              <SlideFromRight delay={0.15}>
                <p className="font-sans text-xs sm:text-base text-black font-semibold leading-relaxed">
                  Founded to transcend traditional brokerage, Paima merges the highest tiers of luxury real estate representation with bespoke spatial interior architecture. We advise collectors, family offices, and discerning individuals on acquiring, building, and styling exceptional residential properties.
                </p>
              </SlideFromRight>

              <FadeUpBottom delay={0.3}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[#A78D78]/50">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-black">
                      <Key className="w-4 h-4 text-black" />
                      <h3 className="font-serif text-base text-black font-extrabold">Off-Market Access</h3>
                    </div>
                    <p className="text-xs text-black leading-relaxed font-semibold">
                      Confidential access to trophy waterfront villas and unlisted penthouses globally.
                    </p>
                  </div>

                  <div className="space-y-2">
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

              <FadeUpBottom delay={0.45}>
                <div className="pt-2 sm:pt-4">
                  <Link
                    href="/about"
                    className="inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-[#A78D78] text-black hover:bg-[#BEB5A9] hover:text-black text-xs font-sans uppercase tracking-[0.2em] font-extrabold transition-all duration-300 shadow-xl border border-black w-full sm:w-auto min-h-[48px]"
                  >
                    <span>OUR HERITAGE &amp; LEADERSHIP</span>
                    <ArrowUpRight className="w-4 h-4 text-black" />
                  </Link>
                </div>
              </FadeUpBottom>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SERVICES SECTION ================= */}
      <section
        aria-label="Paima Offerings"
        className="py-16 sm:py-24 lg:py-32 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto"
      >
        <div className="mb-12 sm:mb-16">
          <SlideFromLeft>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-[2px] bg-black" />
              <span className="text-[10px] font-sans font-extrabold uppercase tracking-[0.28em] text-black">
                DISCIPLINES &amp; ADVISORY
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-black tracking-tight break-words">
              Core Offerings
            </h2>
            <p className="font-sans text-xs sm:text-sm text-black max-w-xl font-semibold leading-relaxed mt-3">
              From prime real estate acquisitions to full architectural renovations, 3D CGI simulations, and curated fine furnishings.
            </p>
          </SlideFromLeft>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, idx) => (
            <StaggerItem key={service.id}>
              <div className="bg-[#BEB5A9]/50 p-6 sm:p-7 border border-[#A78D78]/50 rounded-2xl shadow-xl hover:border-black transition-all duration-400 h-full flex flex-col justify-between group">
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#E1D4C2] mb-6 rounded-xl">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <span className="text-[9px] font-sans uppercase tracking-[0.2em] text-black font-extrabold block mb-2">
                    {service.tag}
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl text-black font-extrabold mb-3">
                    {service.title}
                  </h3>
                  <p className="font-sans text-xs text-black leading-relaxed font-semibold">
                    {service.shortDescription}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#A78D78]/50 flex items-center justify-between">
                  <Link
                    href="/services"
                    className="text-xs uppercase tracking-[0.18em] font-extrabold text-black hover:text-[#A78D78] transition-colors flex items-center gap-1 min-h-[44px]"
                  >
                    <span>VIEW SCOPE</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-black" />
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
        className="py-16 sm:py-24 lg:py-32 bg-[#BEB5A9]/40 border-t border-[#A78D78]/50 px-4 sm:px-8 lg:px-12"
      >
        <div className="max-w-7xl mx-auto">
          <FadeUpBottom>
            <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16 space-y-3">
              <span className="text-[10px] font-sans font-extrabold uppercase tracking-[0.28em] text-black">
                ENDORSEMENTS
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-black tracking-tight break-words">
                Patron Perspectives
              </h2>
              <p className="font-sans text-xs sm:text-sm text-black font-semibold">
                Reflections from private buyers, collectors, and architectural estate patrons.
              </p>
            </div>
          </FadeUpBottom>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {TESTIMONIALS.map((t, idx) => {
            if (!isClient || shouldReduceMotion) {
              return (
                <div key={t.id} className="h-full">
                  <blockquote className="h-full bg-[#BEB5A9]/60 p-6 sm:p-8 border border-[#A78D78]/50 rounded-2xl shadow-xl flex flex-col justify-between">
                    <div>
                      <span className="font-serif text-4xl sm:text-5xl text-black block mb-3 sm:mb-4 leading-none">
                        &ldquo;
                      </span>
                      <p className="font-serif text-sm sm:text-lg text-black font-semibold leading-relaxed mb-6">
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
                </div>
              );
            }

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: isDesktop ? 36 : 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 1.25,
                  delay: 0.08 + idx * 0.2,
                  ease: luxuryEase,
                }}
                className="h-full"
              >
                <blockquote className="h-full bg-[#BEB5A9]/60 p-6 sm:p-8 border border-[#A78D78]/50 rounded-2xl shadow-xl flex flex-col justify-between">
                  <div>
                    <span className="font-serif text-4xl sm:text-5xl text-black block mb-3 sm:mb-4 leading-none">
                      &ldquo;
                    </span>
                    <p className="font-serif text-sm sm:text-lg text-black font-semibold leading-relaxed mb-6">
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
              </motion.div>
            );
          })}
        </div>
        </div>
      </section>

      {/* ================= PRIVATE CONSULTATION CTA ================= */}
      <section
        aria-label="Private Consultation"
        className="py-16 sm:py-24 lg:py-32 bg-[#BEB5A9] border-t border-[#A78D78]/50 text-black relative overflow-hidden"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center space-y-6 sm:space-y-8 relative z-10">
          <FadeUpBottom>
            <span className="text-[10px] font-sans font-extrabold uppercase tracking-[0.3em] text-black">
              PRIVATE CLIENT CONCIERGE
            </span>
            <h2 className="font-serif text-2xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black mt-3 sm:mt-4 break-words">
              Begin Your Architectural Acquisition
            </h2>
          </FadeUpBottom>

          <FadeUpBottom delay={0.15}>
            <p className="font-sans text-xs sm:text-sm text-black max-w-xl mx-auto font-bold leading-relaxed">
              Whether you wish to acquire an unlisted waterfront estate or commission a turnkey architectural interior transformation, our partners are at your service.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4 pt-6 sm:pt-8">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-[#E1D4C2] text-black hover:bg-[#A78D78] text-xs font-sans uppercase tracking-[0.2em] font-extrabold transition-all duration-300 shadow-xl border border-black w-full sm:w-auto min-h-[48px]"
              >
                <span>PRIVATE INQUIRIES</span>
                <ArrowUpRight className="w-4 h-4 text-black" />
              </Link>
            </div>
          </FadeUpBottom>
        </div>
      </section>
    </div>
  );
}
