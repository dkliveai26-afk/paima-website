"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import { PROJECTS, type Project } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Element3DReveal, luxuryEase } from "@/components/animations/MotionDirectional";

const CATEGORIES = ["All", "Minimalist", "Modern", "Vintage", "Penthouse"] as const;

export function PortfolioMasonry() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects =
    activeCategory === "All"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <div className="bg-[#E1D4C2] text-black">
      {/* ================= CATEGORY FILTERS BAR ================= */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-12 border-b border-[#A78D78]/50">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "relative px-5 py-2.5 text-[11px] font-sans uppercase tracking-[0.18em] transition-all duration-300 rounded-full border focus:outline-none will-change-transform",
                  isActive
                    ? "bg-[#A78D78] text-black border-black font-extrabold shadow-md scale-105"
                    : "bg-[#BEB5A9]/60 text-black border-[#A78D78]/50 hover:border-black hover:bg-[#BEB5A9] font-bold hover:scale-102"
                )}
              >
                <span>{cat}</span>
                <span className="ml-2 text-[9px] font-mono opacity-80">
                  ({cat === "All" ? PROJECTS.length : PROJECTS.filter((p) => p.category === cat).length})
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-[11px] font-sans tracking-[0.18em] uppercase text-black font-extrabold">
          Displaying {filteredProjects.length} Architectural Commissions
        </div>
      </div>

      {/* ================= MASONRY GRID WITH 3D REVEAL ================= */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredProjects.map((project, idx) => {
            const aspectPattern =
              idx % 3 === 0 ? "aspect-[3/4]" : idx % 3 === 1 ? "aspect-[4/5]" : "aspect-[1/1]";

            return (
              <Element3DReveal key={project.id} delay={0.07 * idx}>
                <article
                  className="group relative bg-[#BEB5A9]/60 overflow-hidden rounded-2xl border border-[#A78D78]/50 hover:-translate-y-1.5 hover:border-black transition-all duration-500 cursor-pointer shadow-xl hover:shadow-2xl will-change-transform"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className={cn("relative w-full overflow-hidden bg-[#E1D4C2]", aspectPattern)}>
                    <Image
                      src={project.image}
                      alt={`${project.title} - ${project.category} luxury interior architecture by Paima`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.04]"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#E1D4C2] via-transparent to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-95" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                      <span className="px-3 py-1 bg-[#E1D4C2] text-[9px] font-sans uppercase tracking-[0.2em] text-black font-extrabold rounded-sm border border-black shadow-sm">
                        {project.category}
                      </span>
                      <span className="text-[10px] font-mono text-black bg-[#E1D4C2] px-2 py-0.5 rounded-sm border border-black font-extrabold">
                        {project.year}
                      </span>
                    </div>

                    {/* Hover Info Drawer */}
                    <div className="absolute bottom-0 inset-x-0 p-6 z-10 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 bg-gradient-to-t from-[#E1D4C2] via-[#E1D4C2]/95 to-transparent pt-12 text-black">
                      <div className="flex items-baseline justify-between mb-2">
                        <h3 className="font-serif text-2xl font-extrabold text-black">{project.title}</h3>
                        <ArrowUpRight className="w-5 h-5 text-black transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </div>

                      <div className="flex items-center gap-2 text-black text-xs mb-3 font-extrabold">
                        <MapPin className="w-3.5 h-3.5 text-black" />
                        <span>{project.location}</span>
                        <span className="text-black/40">&bull;</span>
                        <span>{project.area}</span>
                      </div>

                      <p className="text-xs text-black line-clamp-2 font-bold mb-3 leading-relaxed">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 border-t border-black/30 pt-3">
                        {project.materials.map((m) => (
                          <span
                            key={m}
                            className="text-[9px] uppercase tracking-wider text-black bg-[#BEB5A9] px-2 py-0.5 font-extrabold rounded-xs border border-black"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-5 bg-[#BEB5A9]/70 border-t border-[#A78D78]/50 flex items-center justify-between transition-colors duration-300 group-hover:bg-[#BEB5A9]">
                    <div>
                      <h4 className="font-serif text-base text-black font-extrabold group-hover:text-black transition-colors duration-300">
                        {project.title}
                      </h4>
                      <p className="text-[10px] text-black uppercase font-sans tracking-wide mt-0.5 font-bold">
                        {project.location} &bull; {project.area}
                      </p>
                    </div>
                    <span className="text-[10px] font-sans uppercase tracking-[0.18em] text-black font-extrabold flex items-center gap-1 transition-colors duration-300 group-hover:translate-x-0.5">
                      <span>Details</span>
                      <span className="transition-transform group-hover:translate-x-1 duration-300">&rarr;</span>
                    </span>
                  </div>
                </article>
              </Element3DReveal>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* ================= DETAIL MODAL OVERLAY ================= */}
      <AnimatePresence>
        {selectedProject && (
          <div
            className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 lg:p-12"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: luxuryEase }}
              className="bg-[#E1D4C2] border border-[#A78D78] max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative rounded-2xl text-black"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[16/9] w-full bg-[#E1D4C2]">
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 bg-[#A78D78] hover:bg-[#BEB5A9] text-black px-4 py-2 text-xs uppercase tracking-[0.2em] font-extrabold transition-all duration-300 rounded-full shadow-lg border border-black hover:scale-105"
                >
                  Close &times;
                </button>
              </div>

              <div className="p-8 sm:p-10 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#A78D78]/50 pb-6">
                  <div>
                    <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-black font-extrabold">
                      {selectedProject.category} &bull; {selectedProject.year}
                    </span>
                    <h3 className="font-serif text-3xl sm:text-4xl text-black mt-1 font-bold">
                      {selectedProject.title}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-black block font-bold">{selectedProject.location}</span>
                    <span className="text-sm font-serif text-black font-bold">{selectedProject.area}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-4">
                    <h4 className="text-xs font-sans uppercase tracking-[0.18em] text-black font-extrabold">
                      Architectural Narrative
                    </h4>
                    <p className="font-sans text-sm text-black leading-relaxed font-semibold">
                      {selectedProject.description}
                    </p>
                  </div>

                  <div className="space-y-4 bg-[#BEB5A9]/60 p-6 border border-[#A78D78]/50 rounded-xl">
                    <h4 className="text-xs font-sans uppercase tracking-[0.18em] text-black font-extrabold">
                      Material Specifications
                    </h4>
                    <ul className="space-y-2">
                      {selectedProject.materials.map((m) => (
                        <li key={m} className="text-xs text-black font-bold flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-black" />
                          {m}
                        </li>
                      ))}
                    </ul>
                    <div className="pt-4 border-t border-[#A78D78]/50 text-[11px] text-black font-extrabold">
                      Lead Architect: {selectedProject.architect}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
