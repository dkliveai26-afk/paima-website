"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

/**
 * LUXURY MINIMALIST ARCHITECTURAL HERO (DARK BLACK TYPOGRAPHY & PERFECT VISIBILITY)
 *
 * VISIBILITY RULE:
 * - Logo remains untouched.
 * - Display heading "Crafted for Living", description, and CTA button are dark black.
 * - Bottom warm light gradient overlay (from-[#E1D4C2]/95 via-[#E1D4C2]/60 to-transparent) guarantees 100% legibility.
 */

export function LuxuryMinimalistHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse Parallax Tracking for Expensive Fluid Feel
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springPhysics = { damping: 26, stiffness: 85, mass: 0.8 };
  const smoothMouseX = useSpring(mouseX, springPhysics);
  const smoothMouseY = useSpring(mouseY, springPhysics);

  // Parallax Depth Transforms
  const bgX = useTransform(smoothMouseX, [-1, 1], [-6, 6]);
  const bgY = useTransform(smoothMouseY, [-1, 1], [-4, 4]);

  const leftPanelX = useTransform(smoothMouseX, [-1, 1], [-14, 14]);
  const leftPanelY = useTransform(smoothMouseY, [-1, 1], [-7, 7]);

  const rightCabinetsX = useTransform(smoothMouseX, [-1, 1], [-12, 12]);
  const rightCabinetsY = useTransform(smoothMouseY, [-1, 1], [-7, 7]);

  const islandX = useTransform(smoothMouseX, [-1, 1], [-20, 20]);
  const islandY = useTransform(smoothMouseY, [-1, 1], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const normalizedX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const normalizedY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseX.set(normalizedX);
    mouseY.set(normalizedY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // =========================================================================
  // STAGGERED CINEMATIC ENTRANCE VARIANTS (PRESERVED)
  // =========================================================================

  const backgroundVariants: Variants = {
    initial: {
      opacity: 0,
      scale: 1.04,
    },
    animate: {
      opacity: 1,
      scale: 1.0,
      transition: {
        duration: 1.0,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const leftPanelVariants: Variants = {
    initial: {
      opacity: 0,
      x: -70,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.35,
        duration: 0.9,
        type: "spring",
        stiffness: 80,
        damping: 20,
      },
    },
  };

  const rightCabinetsVariants: Variants = {
    initial: {
      opacity: 0,
      x: 70,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.35,
        duration: 0.9,
        type: "spring",
        stiffness: 80,
        damping: 20,
      },
    },
  };

  const islandVariants: Variants = {
    initial: {
      opacity: 0,
      y: -120,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5,
        duration: 1.1,
        type: "spring",
        stiffness: 75,
        damping: 16,
        mass: 0.9,
      },
    },
  };

  const bottomContentVariants: Variants = {
    initial: {
      opacity: 0,
      y: 25,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 1.1,
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="Paima Luxury Architectural Hero - Crafted for Living"
      className="relative w-full h-[100svh] min-h-[560px] sm:min-h-[700px] max-h-[1100px] overflow-hidden select-none bg-[#E1D4C2] flex flex-col justify-end"
    >
      {/* =========================================================================
          LAYER 1: BACKGROUND ROOM ARCHITECTURE (z-0)
          ========================================================================= */}
      <motion.div
        variants={backgroundVariants}
        initial="initial"
        animate="animate"
        style={{ x: bgX, y: bgY }}
        className="absolute inset-0 pointer-events-none z-0"
      >
        <Image
          src="/images/hero/clean_kitchen_empty_bg.jpg"
          alt="Paima Luxury Architectural Room Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-[0.96]"
        />
      </motion.div>

      {/* =========================================================================
          LAYER 2: PERIPHERAL SIDE CABINETS & ARCHITECTURAL PANELS (z-10)
          ========================================================================= */}
      {/* LEFT PANEL */}
      <motion.div
        variants={leftPanelVariants}
        initial="initial"
        animate="animate"
        style={{ x: leftPanelX, y: leftPanelY }}
        className="absolute inset-0 pointer-events-none z-10"
      >
        <Image
          src="/images/hero/clean_layer_left_panel.png"
          alt="Paima Left Architectural Window Panel"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-[0.96]"
        />
      </motion.div>

      {/* RIGHT SIDE CABINETS */}
      <motion.div
        variants={rightCabinetsVariants}
        initial="initial"
        animate="animate"
        style={{ x: rightCabinetsX, y: rightCabinetsY }}
        className="absolute inset-0 pointer-events-none z-10"
      >
        <Image
          src="/images/hero/clean_layer_right_cabinets.png"
          alt="Paima Right Cabinet Architecture"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-[0.96]"
        />
      </motion.div>

      {/* =========================================================================
          LAYER 3: CENTRAL FOCAL POINT - CENTER TABLE / ISLAND (z-20)
          ========================================================================= */}
      <motion.div
        variants={islandVariants}
        initial="initial"
        animate="animate"
        style={{ x: islandX, y: islandY }}
        className="absolute inset-0 pointer-events-none z-20"
      >
        <Image
          src="/images/hero/clean_layer_island.png"
          alt="Paima Central Kitchen Island Focal Point"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-[0.96]"
        />
      </motion.div>

      {/* Ambient Subtle Warm Vignette Overlay across all layers for unified lighting */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#E1D4C2]/30 via-transparent to-transparent pointer-events-none z-25" />

      {/* =========================================================================
          HERO UI: CLEAN CINEMATIC FLOATING EXPLORE CTA (z-30)
          - All text removed so architectural image is the primary focal point
          - "EXPLORE" CTA button cleanly placed at bottom-right on desktop, centered on mobile
          ========================================================================= */}
      <motion.div
        variants={bottomContentVariants}
        initial="initial"
        animate="animate"
        className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pb-8 sm:pb-16 pt-8 flex justify-center sm:justify-end pointer-events-auto"
      >
        <Link
          href="/portfolio"
          id="hero-explore-cta"
          className="group inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-[#A78D78] text-black hover:bg-[#BEB5A9] hover:text-black font-sans text-xs sm:text-sm font-extrabold tracking-[0.2em] uppercase shadow-2xl transition-all duration-300 hover:scale-105 shrink-0 focus:outline-none border border-black min-h-[48px] w-full max-w-[280px] sm:w-auto"
        >
          <span>EXPLORE</span>
          <ArrowUpRight className="w-4 h-4 text-black transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </motion.div>
    </section>
  );
}
