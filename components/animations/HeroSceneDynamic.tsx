"use client";

import dynamic from "next/dynamic";
import React from "react";

// Dynamically import Three.js Canvas to prevent SSR issues with WebGL context
const HeroScene3D = dynamic(
  () => import("./HeroScene3D").then((mod) => mod.HeroScene3D),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-20 h-20 rounded-full border border-atelier-border animate-pulse" />
      </div>
    ),
  }
);

export function HeroSceneDynamic() {
  return <HeroScene3D />;
}
