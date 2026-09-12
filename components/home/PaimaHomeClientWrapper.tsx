"use client";

import dynamic from "next/dynamic";
import React from "react";

const PaimaHomeContent = dynamic(
  () => import("./PaimaHomeContent").then((mod) => mod.PaimaHomeContent),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-atelier-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="font-serif text-3xl font-bold tracking-[0.2em] text-black animate-pulse">
            PAIMA
          </span>
          <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-black font-extrabold">
            Estates &bull; Interiors
          </span>
        </div>
      </div>
    ),
  }
);

export function PaimaHomeClientWrapper() {
  return <PaimaHomeContent />;
}
