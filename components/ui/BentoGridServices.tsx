"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { SERVICES, type Service } from "@/lib/data";
import { cn } from "@/lib/utils";
import { SlideFromLeft, SlideFromRight, luxuryEase } from "@/components/animations/MotionDirectional";

export function BentoGridServices() {
  const [expandedId, setExpandedId] = useState<string | null>(SERVICES[0].id);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-black">
      {SERVICES.map((service: Service, idx: number) => {
        const isExpanded = expandedId === service.id;
        const RevealComponent = idx % 2 === 0 ? SlideFromLeft : SlideFromRight;

        return (
          <RevealComponent key={service.id} delay={0.08 * idx} className={cn("w-full", service.span)}>
            <motion.div
              layout
              className={cn(
                "group relative bg-[#BEB5A9]/60 border border-[#A78D78]/50 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between shadow-xl hover:shadow-2xl h-full will-change-transform",
                isExpanded ? "ring-2 ring-black" : "hover:border-black"
              )}
            >
              {/* Background Image */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#E1D4C2]">
                <Image
                  src={service.image}
                  alt={`${service.title} - Paima Haute Services`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#E1D4C2] via-transparent to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-95" />

                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 bg-[#E1D4C2] text-[9px] font-sans uppercase tracking-[0.2em] text-black font-extrabold rounded-sm border border-black shadow-sm">
                    {service.tag}
                  </span>
                </div>

                <div className="absolute bottom-4 left-6 right-6 z-10">
                  <h3 className="font-serif text-2xl sm:text-3xl text-black font-extrabold tracking-tight">
                    {service.title}
                  </h3>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
                <div>
                  <p className="font-sans text-xs sm:text-sm text-black leading-relaxed font-bold mb-6">
                    {service.shortDescription}
                  </p>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: luxuryEase }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 border-t border-[#A78D78]/50 space-y-3 mb-6">
                          <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-black font-extrabold block">
                            Scope &amp; Deliverables
                          </span>
                          {service.details.map((detail, dIdx) => (
                            <div key={dIdx} className="flex items-start gap-2.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-black mt-0.5 shrink-0" />
                              <span className="text-xs text-black font-bold leading-relaxed">
                                {detail}
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Expand Toggle */}
                <div className="pt-4 flex items-center justify-between border-t border-[#A78D78]/50">
                  <button
                    type="button"
                    onClick={() => toggleExpand(service.id)}
                    className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.18em] text-black hover:text-[#A78D78] font-extrabold transition-colors duration-300 focus:outline-none group/btn"
                    aria-expanded={isExpanded}
                  >
                    <span>{isExpanded ? "Collapse Scope" : "Expand Scope & Process"}</span>
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 text-black transition-transform duration-300",
                        isExpanded ? "rotate-180" : "rotate-0 group-hover/btn:translate-y-0.5"
                      )}
                    />
                  </button>

                  <span className="text-[10px] font-mono text-black font-extrabold">
                    0{SERVICES.findIndex((s) => s.id === service.id) + 1}
                  </span>
                </div>
              </div>
            </motion.div>
          </RevealComponent>
        );
      })}
    </div>
  );
}
