"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Bed, Bath, Waves, Maximize2, ShieldCheck, MapPin } from "lucide-react";
import { springTransition } from "@/components/animations/MotionDirectional";
import { HERO_ESTATE } from "@/lib/data";

export function PaimaLayeredHero() {
  return (
    <section
      aria-label="Paima Layered Hero"
      className="relative min-h-[92vh] sm:min-h-screen pt-28 sm:pt-32 pb-16 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto flex flex-col justify-between overflow-hidden"
    >
      {/* =========================================================================
          LAYER 0 (z-0): MASSIVE BOLD "PAIMA" WATERMARK TYPOGRAPHY
          Animates dropping in from the TOP (y: -100 to y: 0) and sits BEHIND the house.
          ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springTransition, delay: 0.1 }}
        className="absolute top-16 sm:top-12 left-0 right-0 z-0 flex justify-center pointer-events-none select-none overflow-hidden"
      >
        <span className="font-serif font-black text-[22vw] tracking-tighter leading-none text-black/[0.06] sm:text-black/[0.08] uppercase whitespace-nowrap">
          PAIMA
        </span>
      </motion.div>

      {/* Hero Headline & Subtitle (Drop from top) */}
      <div className="relative z-20 max-w-3xl mb-8 sm:mb-12">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springTransition, delay: 0.15 }}
          className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-[#BEB5A9] border border-[#A78D78] shadow-sm mb-4"
        >
          <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
          <span className="text-[10px] font-sans font-extrabold uppercase tracking-[0.25em] text-black">
            Haute Interior Architecture &bull; Prime Estates
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springTransition, delay: 0.25 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.08] tracking-tight text-black"
        >
          Bespoke Living <br />
          <span className="italic font-bold text-black">
            At The Horizon of Luxury.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springTransition, delay: 0.35 }}
          className="mt-4 font-sans text-sm sm:text-base text-black font-semibold leading-relaxed max-w-xl"
        >
          Paima orchestrates rare off-market residential acquisitions and transforms spaces with subtractive minimalist architecture, honed travertine, and private infinity pools.
        </motion.p>
      </div>

      {/* =========================================================================
          LAYER 1 (z-10) & LAYER 2 (z-20) LAYERED SHOWCASE CONTAINER
          ========================================================================= */}
      <div className="relative w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* =====================================================================
              MIDDLE LAYER (z-10): REAL LUXURY MODERN HOUSE WITH POOL IMAGE
              Slides in smoothly from the LEFT side (x: -100vw to x: 0)
              ===================================================================== */}
          <motion.div
            initial={{ opacity: 0, x: "-100vw" }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...springTransition, delay: 0.25 }}
            className="lg:col-span-8 relative z-10 w-full"
          >
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden shadow-2xl bg-[#E1D4C2] group">
              <Image
                src={HERO_ESTATE.image}
                alt="Luxury modern architectural villa with infinity pool - Paima Featured Estate"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 70vw"
                className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
              />

              {/* Ambient lighting gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#E1D4C2] via-[#E1D4C2]/40 to-transparent" />

              {/* Top estate status tag */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
                <span className="px-3.5 py-1.5 bg-[#E1D4C2]/95 backdrop-blur-md text-[10px] font-sans uppercase tracking-widest font-extrabold text-black shadow-md border border-black">
                  Prime Portfolio Featured
                </span>
                <span className="px-3 py-1 bg-[#E1D4C2] backdrop-blur-md text-[10px] font-sans uppercase tracking-widest text-black font-extrabold border border-black">
                  {HERO_ESTATE.location}
                </span>
              </div>

              {/* Bottom image caption */}
              <div className="absolute bottom-6 left-6 right-6 z-20 text-black">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                  <div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-black">
                      {HERO_ESTATE.title}
                    </h2>
                    <p className="text-xs text-black font-bold mt-1 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-black" />
                      {HERO_ESTATE.specs}
                    </p>
                  </div>
                  <span className="font-serif text-xl sm:text-2xl font-extrabold text-black">
                    {HERO_ESTATE.price}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* =====================================================================
              FOREGROUND / FLOATING LAYER (z-20): GLASSMORPHISM PROPERTY DETAIL CARDS
              Positioned on the right side overlapping the main image, sliding from RIGHT
              ===================================================================== */}
          <div className="lg:col-span-4 relative z-20 lg:-ml-12 space-y-4">
            {/* Main Floating Glassmorphic Estate Card */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...springTransition, delay: 0.45 }}
              className="bg-[#BEB5A9]/95 backdrop-blur-xl p-6 sm:p-7 border border-[#A78D78] shadow-2xl space-y-4 text-black"
            >
              <div className="flex items-center justify-between border-b border-black/20 pb-3">
                <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-black font-extrabold">
                  Architectural Dossier
                </span>
                <span className="w-2 h-2 rounded-full bg-black" />
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-xl text-black font-extrabold">
                  Turnkey Villa Architecture
                </h3>
                <p className="text-xs text-black font-bold leading-relaxed">
                  Engineered with cantilevered concrete terraces, seamless glass corner walls, and an 85-ft heated infinity pool.
                </p>
              </div>

              {/* Key Features Icons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 p-2 bg-[#E1D4C2] border border-[#A78D78]">
                  <Waves className="w-4 h-4 text-black" />
                  <span className="text-[11px] font-sans text-black font-bold">
                    Infinity Pool
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-[#E1D4C2] border border-[#A78D78]">
                  <Maximize2 className="w-4 h-4 text-black" />
                  <span className="text-[11px] font-sans text-black font-bold">
                    14,500 Sq.Ft
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-[#E1D4C2] border border-[#A78D78]">
                  <Bed className="w-4 h-4 text-black" />
                  <span className="text-[11px] font-sans text-black font-bold">
                    6 Master Suites
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-[#E1D4C2] border border-[#A78D78]">
                  <ShieldCheck className="w-4 h-4 text-black" />
                  <span className="text-[11px] font-sans text-black font-bold">
                    Private Gate
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Link
                  href="/portfolio"
                  className="w-full py-3 bg-[#A78D78] hover:bg-[#BEB5A9] text-black text-xs uppercase tracking-widest font-extrabold flex items-center justify-center gap-2 transition-all duration-300 shadow-md group border border-black"
                >
                  <span>Explore Estate Details</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-black transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </motion.div>

            {/* Secondary Floating Micro-Card: Material Truth */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...springTransition, delay: 0.6 }}
              className="bg-[#BEB5A9] text-black p-4 sm:p-5 shadow-xl border border-black flex items-center justify-between"
            >
              <div>
                <p className="text-[10px] font-sans uppercase tracking-widest text-black font-extrabold">
                  Material Palette
                </p>
                <p className="text-xs text-black font-bold mt-0.5">
                  Honed Roman Travertine &bull; Fluted Oak
                </p>
              </div>
              <Link
                href="/contact"
                className="text-[11px] uppercase tracking-widest text-black hover:text-[#6E4738] font-extrabold flex items-center gap-1 transition-colors duration-300"
              >
                Inquire
                <ArrowUpRight className="w-3 h-3 text-black" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Sub-Bar: Quick Metrics (Fade up from bottom) */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springTransition, delay: 0.65 }}
        className="pt-10 mt-8 border-t border-[#A78D78]/50 grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left z-20"
      >
        <div>
          <span className="font-serif text-2xl sm:text-3xl font-extrabold text-black">
            $1.8B+
          </span>
          <p className="text-[10px] font-sans uppercase tracking-widest text-black font-bold mt-0.5">
            Prime Assets Curated
          </p>
        </div>
        <div>
          <span className="font-serif text-2xl sm:text-3xl font-extrabold text-black">
            140+
          </span>
          <p className="text-[10px] font-sans uppercase tracking-widest text-black font-bold mt-0.5">
            Turnkey Residences
          </p>
        </div>
        <div>
          <span className="font-serif text-2xl sm:text-3xl font-extrabold text-black">
            32
          </span>
          <p className="text-[10px] font-sans uppercase tracking-widest text-black font-bold mt-0.5">
            International Laurels
          </p>
        </div>
        <div>
          <span className="font-serif text-2xl sm:text-3xl font-extrabold text-black">
            4 Global
          </span>
          <p className="text-[10px] font-sans uppercase tracking-widest text-black font-bold mt-0.5">
            New York &bull; Monaco &bull; Paris &bull; LA
          </p>
        </div>
      </motion.div>
    </section>
  );
}
