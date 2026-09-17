"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, ArrowUpRight, Compass } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import PaimaConcierge from "@/components/ui/PaimaConcierge";

export default function NotFound() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.08,
        delayChildren: prefersReducedMotion ? 0 : 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 24,
        stiffness: 200,
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#E1D4C2] text-black selection:bg-black selection:text-[#E1D4C2] overflow-x-hidden">
      <Navbar />

      <main
        id="main-content"
        className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-28 sm:py-36 relative overflow-hidden"
      >
        {/* Background Architectural Monogram / 404 Watermark */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        >
          <span className="font-serif text-[140px] sm:text-[220px] md:text-[300px] lg:text-[360px] font-bold text-black/[0.04] tracking-widest leading-none translate-y-4">
            404
          </span>
        </div>

        {/* Foreground Content Card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-2xl mx-auto text-center space-y-6 sm:space-y-8"
        >
          {/* Eyebrow Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-sans uppercase tracking-[0.3em] font-extrabold text-black/80 px-4 py-1.5 bg-[#BEB5A9]/50 border border-[#A78D78]/50 rounded-full shadow-sm">
              <Compass className="w-3.5 h-3.5 text-black/70" />
              <span>PAIMA / 404</span>
            </span>
          </motion.div>

          {/* Main Serif Heading */}
          <motion.div variants={itemVariants} className="space-y-2">
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-black font-bold tracking-tight leading-tight">
              Page Not Found
            </h1>
            <div className="w-12 h-0.5 bg-[#A78D78] mx-auto rounded-full" />
          </motion.div>

          {/* Supporting Text */}
          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base md:text-lg text-black/80 font-sans max-w-md sm:max-w-lg mx-auto leading-relaxed font-medium"
          >
            The page you&apos;re looking for doesn&apos;t exist or may have moved.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 max-w-md mx-auto"
          >
            {/* Primary Action: RETURN HOME */}
            <Link
              href="/"
              className="w-full sm:w-auto min-h-[48px] px-7 py-3.5 rounded-full bg-[#1A1A1A] text-[#F5F2EB] hover:bg-black font-sans text-xs uppercase tracking-[0.2em] font-extrabold transition-all duration-200 shadow-md flex items-center justify-center gap-2 group focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
              <span>RETURN HOME</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            {/* Secondary Action: EXPLORE DESIGN STUDIO */}
            <Link
              href="/portfolio"
              className="w-full sm:w-auto min-h-[48px] px-7 py-3.5 rounded-full bg-[#BEB5A9] text-black hover:bg-[#A78D78] font-sans text-xs uppercase tracking-[0.2em] font-extrabold transition-all duration-200 border border-black shadow-sm flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-black"
            >
              <span>EXPLORE DESIGN STUDIO</span>
              <ArrowUpRight className="w-4 h-4 text-black" />
            </Link>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
      <PaimaConcierge />
    </div>
  );
}
