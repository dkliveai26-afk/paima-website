"use client";

import React from "react";
import { motion } from "framer-motion";

export function ScrollIndicator() {
  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight * 0.9,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToNext}
      aria-label="Scroll down to explore featured works"
      className="group flex flex-col items-center gap-3 transition-opacity duration-300 hover:opacity-100 focus:outline-none"
    >
      <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-atelier-muted group-hover:text-atelier-gold transition-colors duration-300">
        Scroll To Explore
      </span>

      <div className="w-[1px] h-12 bg-atelier-border relative overflow-hidden">
        <motion.div
          animate={{
            y: [-48, 48],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-full h-1/2 bg-atelier-dark"
        />
      </div>
    </button>
  );
}
