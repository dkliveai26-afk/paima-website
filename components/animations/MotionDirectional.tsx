"use client";

import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Luxury Architectural Easing Curves & Springs
export const luxuryEase = [0.16, 1, 0.3, 1] as const;
export const architecturalEase = [0.22, 1, 0.36, 1] as const;
export const smoothGentleEase = [0.25, 0.1, 0.25, 1] as const;

export const springTransition = {
  type: "spring" as const,
  stiffness: 85,
  damping: 20,
  mass: 0.8,
};

export const gentleSpring = {
  type: "spring" as const,
  stiffness: 75,
  damping: 22,
};

interface DirectionalProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  duration?: number;
  viewportOnce?: boolean;
}

/**
 * SSR-safe client mount hook:
 * Guarantees that static SSR HTML is 100% visible immediately (NO BLANK SCREENS),
 * while client-side hydration triggers the smooth luxury animation.
 */
function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return isClient;
}

/* =========================================================================
   1. DIRECTIONAL SLIDES (LEFT, RIGHT, TOP, BOTTOM)
   ========================================================================= */

export function SlideFromLeft({
  children,
  delay = 0,
  className = "",
  distance = 32,
  duration = 0.8,
}: DirectionalProps & { distance?: number | string }) {
  const shouldReduceMotion = useReducedMotion();
  const isClient = useIsClient();

  if (shouldReduceMotion || !isClient) {
    return <div className={className}>{children}</div>;
  }

  const offset = typeof distance === "number" ? -distance : `-${distance}`;

  return (
    <motion.div
      initial={{ opacity: 0, x: offset }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration, delay, ease: luxuryEase }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideFromRight({
  children,
  delay = 0,
  className = "",
  distance = 32,
  duration = 0.8,
}: DirectionalProps & { distance?: number | string }) {
  const shouldReduceMotion = useReducedMotion();
  const isClient = useIsClient();

  if (shouldReduceMotion || !isClient) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: distance }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration, delay, ease: luxuryEase }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeUpBottom({
  children,
  delay = 0,
  className = "",
  duration = 0.8,
  distance = 24,
}: DirectionalProps & { distance?: number }) {
  const shouldReduceMotion = useReducedMotion();
  const isClient = useIsClient();

  if (shouldReduceMotion || !isClient) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration, delay, ease: luxuryEase }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function TextSlideFromTop({
  children,
  delay = 0,
  className = "",
  duration = 0.8,
  distance = 20,
}: DirectionalProps & { distance?: number }) {
  const shouldReduceMotion = useReducedMotion();
  const isClient = useIsClient();

  if (shouldReduceMotion || !isClient) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration, delay, ease: luxuryEase }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function DropFromTop(props: DirectionalProps) {
  return <TextSlideFromTop {...props} />;
}

/* =========================================================================
   2. MASKED REVEALS & SEQUENCED TYPOGRAPHY
   ========================================================================= */

export function MaskedHeadingReveal({
  children,
  delay = 0,
  className = "",
  duration = 0.85,
}: DirectionalProps) {
  const shouldReduceMotion = useReducedMotion();
  const isClient = useIsClient();

  if (shouldReduceMotion || !isClient) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "105%", opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{ duration, delay, ease: luxuryEase }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* =========================================================================
   3. 3D & DEPTH CARD REVEALS
   ========================================================================= */

export function Element3DReveal({
  children,
  delay = 0,
  className = "",
  duration = 0.8,
}: DirectionalProps) {
  const shouldReduceMotion = useReducedMotion();
  const isClient = useIsClient();

  if (shouldReduceMotion || !isClient) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 22, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration, delay, ease: luxuryEase }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function CardDropFromTop(props: DirectionalProps) {
  return <Element3DReveal {...props} />;
}

/* =========================================================================
   4. IMAGE REVEALS (CLIP-PATH & SCALE)
   ========================================================================= */

export function ScaleInImage({
  children,
  delay = 0,
  className = "",
  duration = 0.85,
}: DirectionalProps) {
  const shouldReduceMotion = useReducedMotion();
  const isClient = useIsClient();

  if (shouldReduceMotion || !isClient) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration, delay, ease: luxuryEase }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ImageClipReveal({
  children,
  delay = 0,
  className = "",
  duration = 0.9,
}: DirectionalProps) {
  const shouldReduceMotion = useReducedMotion();
  const isClient = useIsClient();

  if (shouldReduceMotion || !isClient) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, clipPath: "inset(5% 0% 5% 0% round 1rem)" }}
      whileInView={{ opacity: 1, clipPath: "inset(0% 0% 0% 0% round 1rem)" }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration, ease: luxuryEase, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ParallaxImage({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
  offset?: number;
}) {
  return <div className={`overflow-hidden ${className}`}>{children}</div>;
}

/* =========================================================================
   5. STAGGER CONTAINERS & ITEMS
   ========================================================================= */

export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.1,
  delayChildren = 0.05,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  delayChildren?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const isClient = useIsClient();

  if (shouldReduceMotion || !isClient) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-30px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const isClient = useIsClient();

  if (shouldReduceMotion || !isClient) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.985 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.75, ease: luxuryEase },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* =========================================================================
   6. PAGE TRANSITIONS (SSR-SAFE PASS-THROUGH)
   ========================================================================= */

export function PageTransitionWrapper({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

