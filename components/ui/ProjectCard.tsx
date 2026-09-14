"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/data";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  aspectRatio?: "tall" | "square" | "wide";
  priority?: boolean;
}

export function ProjectCard({
  project,
  aspectRatio = "tall",
  priority = false,
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const aspectClasses = {
    tall: "aspect-[3/4]",
    square: "aspect-square",
    wide: "aspect-[16/10]",
  };

  return (
    <article
      className="group relative overflow-hidden bg-[#BEB5A9] border border-[#A78D78] rounded-xl shadow-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-black hover:shadow-2xl will-change-transform"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn("relative w-full overflow-hidden bg-[#BEB5A9]", aspectClasses[aspectRatio])}>
        <Image
          src={project.image}
          alt={`${project.title} - ${project.category} luxury interior by Paima in ${project.location}`}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.04]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#E1D4C2] via-[#E1D4C2]/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-95" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <span className="px-3 py-1 bg-[#E1D4C2]/95 backdrop-blur-md text-[9px] font-sans uppercase tracking-[0.2em] font-extrabold text-black border border-black rounded-sm shadow-sm transition-transform duration-300 group-hover:scale-105">
            {project.category}
          </span>
          <span className="text-[11px] font-sans tracking-widest text-black font-extrabold bg-[#E1D4C2]/80 px-2 py-0.5 border border-black/40 rounded-sm">
            {project.location}
          </span>
        </div>

        {/* Hover-Reveal Spec Drawer */}
        <div className="absolute bottom-0 inset-x-0 p-6 z-10 translate-y-3 opacity-0 transition-all duration-400 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <div className="space-y-2">
            <div className="flex items-baseline justify-between text-black">
              <h3 className="font-serif text-xl sm:text-2xl font-extrabold text-black">
                {project.title}
              </h3>
              <ArrowUpRight className="w-5 h-5 text-black transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>

            <p className="text-xs text-black line-clamp-2 font-bold leading-relaxed">
              {project.description}
            </p>

            <div className="pt-2 flex flex-wrap gap-1.5 border-t border-black/30">
              {project.materials.slice(0, 3).map((mat) => (
                <span
                  key={mat}
                  className="text-[9px] uppercase tracking-wider text-black font-extrabold bg-[#E1D4C2] px-2 py-0.5 border border-black rounded-xs"
                >
                  {mat}
                </span>
              ))}
              <span className="text-[9px] uppercase tracking-wider text-black bg-[#A78D78] font-extrabold px-2 py-0.5 border border-black rounded-xs">
                {project.area}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Static Sub-Bar */}
      <div className="p-4 flex items-center justify-between bg-[#E1D4C2] border-t border-[#A78D78] transition-colors duration-300 group-hover:bg-[#E1D4C2]/90">
        <div>
          <h4 className="font-serif text-lg text-black font-extrabold tracking-tight">
            {project.title}
          </h4>
          <p className="text-[11px] text-black font-sans font-bold tracking-wide uppercase mt-0.5">
            {project.location} &bull; {project.year}
          </p>
        </div>
        <Link
          href={`/portfolio?highlight=${project.slug}`}
          className="text-[11px] font-sans uppercase tracking-[0.18em] text-black hover:text-[#6E4738] transition-colors flex items-center gap-1 font-extrabold group/link"
        >
          <span>View</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-black transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
        </Link>
      </div>
    </article>
  );
}
