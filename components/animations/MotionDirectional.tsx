"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useReducedMotion, useScroll, useTransform, useInView } from "framer-motion";

// Luxury Architectural Easing Curves & Springs
export const luxuryEase = [0.16, 1, 0.3, 1] as const;
export const architecturalEase = [0.22, 1, 0.36, 1] as const;

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

export const luxuryTransition = {
  duration: 0.85,
  ease: luxuryEase,
};

interface DirectionalProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  duration?: number;
  viewportOnce?: boolean;
}

/**
 * TEXT ANIMATION: Reveals from top (-y to 0) with refined luxury curve
 */
export function TextSlideFromTop({
  children,
  delay = 0,
  className = "",
  viewportOnce = true,
  duration = 0.8,
}: DirectionalProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: viewportOnce, margin: "-40px" }}
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

/**
 * MASKED HEADING REVEAL: Premium editorial text mask reveal
 * Words/lines rise smoothly from an overflow-hidden bounding box
 */
export function MaskedHeadingReveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "h2",
  viewportOnce = true,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  viewportOnce?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: "105%", opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: viewportOnce, margin: "-30px" }}
        transition={{ duration: 0.9, delay, ease: luxuryEase }}
      >
        <Tag className={className}>{children}</Tag>
      </motion.div>
    </div>
  );
}

/**
 * ARCHITECTURAL 3D / CARD SCROLL REVEAL
 */
export function Element3DReveal({
  children,
  delay = 0,
  className = "",
  viewportOnce = true,
  duration = 0.85,
}: DirectionalProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 28,
        scale: 0.985,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{ once: viewportOnce, margin: "-40px" }}
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

/**
 * Slides in seamlessly from Left (-x to 0)
 */
export function SlideFromLeft({
  children,
  delay = 0,
  className = "",
  distance = 36,
  viewportOnce = true,
  duration = 0.85,
}: DirectionalProps & { distance?: number | string }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: typeof distance === "number" ? -distance : `-${distance}`,
      }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: viewportOnce, margin: "-40px" }}
      transition={{ duration, delay, ease: luxuryEase }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Slides in seamlessly from Right (+x to 0)
 */
export function SlideFromRight({
  children,
  delay = 0,
  className = "",
  distance = 36,
  viewportOnce = true,
  duration = 0.85,
}: DirectionalProps & { distance?: number | string }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: typeof distance === "number" ? distance : distance,
      }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: viewportOnce, margin: "-40px" }}
      transition={{ duration, delay, ease: luxuryEase }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Fade Up From Bottom (+y to 0)
 */
export function FadeUpBottom({
  children,
  delay = 0,
  className = "",
  viewportOnce = true,
  duration = 0.85,
}: DirectionalProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: viewportOnce, margin: "-40px" }}
      transition={{ duration, delay, ease: luxuryEase }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Image Card Scale In with Perspective Reveal
 */
export function ScaleInImage({
  children,
  delay = 0,
  className = "",
  viewportOnce = true,
  duration = 0.9,
}: DirectionalProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: viewportOnce, margin: "-40px" }}
      transition={{ duration, delay, ease: luxuryEase }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger Container for Grids
 */
export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.09,
  delayChildren = 0.04,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  delayChildren?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
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

/**
 * Stagger Item
 */
export function StaggerItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24, scale: 0.985 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.8, ease: luxuryEase },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Image Clip Reveal (Refined curtain/mask reveal on scroll)
 */
export function ImageClipReveal({
  children,
  delay = 0,
  className = "",
  viewportOnce = true,
  duration = 0.95,
}: DirectionalProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, clipPath: "inset(8% 0% 8% 0% round 1rem)" }}
      whileInView={{ opacity: 1, clipPath: "inset(0% 0% 0% 0% round 1rem)" }}
      viewport={{ once: viewportOnce, margin: "-40px" }}
      transition={{ duration, ease: luxuryEase, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Scroll-Linked Parallax Wrapper for Editorial Imagery
 */
export function ParallaxImage({
  children,
  className = "",
  offset = 20,
}: {
  children: React.ReactNode;
  className?: string;
  offset?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [-offset, offset]
  );

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}

/**
 * REFINED MAGNETIC BUTTON / ELEMENT HOVER INTERACTION
 * Responds subtly to cursor movement without jumping
 */
export function LuxuryMagnetic({
  children,
  className = "",
  strength = 12,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = ((clientX - (left + width / 2)) / (width / 2)) * strength;
    const y = ((clientY - (top + height / 2)) / (height / 2)) * strength;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 180, damping: 18, mass: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * NUMERICAL STATISTIC COUNTER
 * Smooth count-up on scroll view
 */
export function AnimatedCounter({
  from = 0,
  to,
  duration = 1.6,
  prefix = "",
  suffix = "",
  className = "",
}: {
  from?: number;
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [count, setCount] = useState(from);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!inView || shouldReduceMotion) {
      setCount(to);
      return;
    }

    let start = from;
    const end = to;
    const startTime = performance.now();
    const durationMs = duration * 1000;

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Quintic ease out
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const currentVal = Math.round(start + (end - start) * easeProgress);

      setCount(currentVal);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }, [inView, from, to, duration, shouldReduceMotion]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

/**
 * LUXURY PAGE TRANSITION WRAPPER
 */
export function PageTransitionWrapper({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: luxuryEase }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
