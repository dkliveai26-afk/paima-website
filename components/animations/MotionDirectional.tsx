"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

// High-End Fluid Spring Physics
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
 * REQUIREMENT #4: TEXT ANIMATION (Text smoothly reveals into view on scroll)
 */
export function TextSlideFromTop({
  children,
  delay = 0,
  className = "",
  viewportOnce = true,
}: DirectionalProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: viewportOnce, margin: "-50px" }}
      transition={{ ...springTransition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Legacy DropFromTop alias maintaining TextSlideFromTop physics
 */
export function DropFromTop(props: DirectionalProps) {
  return <TextSlideFromTop {...props} />;
}

/**
 * REQUIREMENT #5 & #3: 3D-STYLE ELEMENT & CARD SCROLL REVEAL (Cards & components drop smoothly from above)
 */
export function Element3DReveal({
  children,
  delay = 0,
  className = "",
  viewportOnce = true,
}: DirectionalProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -35,
        scale: 0.98,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{ once: viewportOnce, margin: "-50px" }}
      transition={{ ...springTransition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * REQUIREMENT #5: CARD DROP FROM TOP
 */
export function CardDropFromTop(props: DirectionalProps) {
  return <Element3DReveal {...props} />;
}

/**
 * Slides in seamlessly from the Left
 */
export function SlideFromLeft({
  children,
  delay = 0,
  className = "",
  distance = 50,
  viewportOnce = true,
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
      viewport={{ once: viewportOnce, margin: "-50px" }}
      transition={{ ...springTransition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Slides in seamlessly from the Right
 */
export function SlideFromRight({
  children,
  delay = 0,
  className = "",
  distance = 50,
  viewportOnce = true,
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
      viewport={{ once: viewportOnce, margin: "-50px" }}
      transition={{ ...springTransition, delay }}
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
}: DirectionalProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: viewportOnce, margin: "-50px" }}
      transition={{ ...springTransition, delay }}
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
}: DirectionalProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: viewportOnce, margin: "-50px" }}
      transition={{ ...springTransition, delay }}
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
  staggerDelay = 0.1,
  delayChildren = 0.05,
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
      viewport={{ once: true, margin: "-50px" }}
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
        hidden: { opacity: 0, y: 30, scale: 0.97 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: springTransition,
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Image Clip Reveal (Vertical mask reveal effect on scroll)
 */
export function ImageClipReveal({
  children,
  delay = 0,
  className = "",
  viewportOnce = true,
}: DirectionalProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, clipPath: "inset(8% 0% 8% 0% round 1rem)" }}
      whileInView={{ opacity: 1, clipPath: "inset(0% 0% 0% 0% round 1rem)" }}
      viewport={{ once: viewportOnce, margin: "-50px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
