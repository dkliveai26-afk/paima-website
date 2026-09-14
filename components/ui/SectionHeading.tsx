"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { luxuryEase } from "@/components/animations/MotionDirectional";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
  light?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: SectionHeadingProps) {
  const shouldReduceMotion = useReducedMotion();

  const alignments = {
    left: "text-left items-start",
    center: "text-center items-center mx-auto",
    right: "text-right items-end ml-auto",
  };

  if (shouldReduceMotion) {
    return (
      <div className={cn("flex flex-col mb-12 md:mb-16", alignments[align], className)}>
        {eyebrow && (
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-[2px] bg-black" />
            <span className="text-[11px] font-sans tracking-[0.2em] uppercase font-extrabold text-black">
              {eyebrow}
            </span>
          </div>
        )}
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] text-black">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-4 font-sans text-sm md:text-base max-w-2xl font-semibold leading-relaxed text-black">
            {subtitle}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col mb-12 md:mb-16", alignments[align], className)}>
      {/* Eyebrow Reveal */}
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: luxuryEase }}
          className="flex items-center gap-3 mb-3"
        >
          <span className="w-8 h-[2px] bg-black" />
          <span className="text-[11px] font-sans tracking-[0.2em] uppercase font-extrabold text-black">
            {eyebrow}
          </span>
        </motion.div>
      )}

      {/* Masked Heading Reveal */}
      <div className="overflow-hidden">
        <motion.h2
          initial={{ y: "105%", opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.85, delay: 0.06, ease: luxuryEase }}
          className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] text-black"
        >
          {title}
        </motion.h2>
      </div>

      {/* Subtitle Fade In */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, delay: 0.16, ease: luxuryEase }}
          className="mt-4 font-sans text-sm md:text-base max-w-2xl font-semibold leading-relaxed text-black"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
