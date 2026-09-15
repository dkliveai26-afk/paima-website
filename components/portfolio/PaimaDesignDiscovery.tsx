"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Heart,
  RotateCcw,
  X,
  ArrowUpRight,
  TrendingUp,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DesignItem } from "@/lib/db-designs";

// Filter Options
const ROOM_TYPES = [
  "Bedroom",
  "Living Room",
  "Kitchen",
  "Dining Room",
  "Bathroom",
  "Home Office",
  "Lounge",
  "Outdoor",
];

const PALETTES = [
  { name: "Ivory", colors: ["#F9F6F0", "#EFE9DF", "#D4C5B2"] },
  { name: "Warm Beige", colors: ["#E1D4C2", "#BEB5A9", "#A78D78"] },
  { name: "Earth", colors: ["#2D241E", "#3D322A", "#C89B7B"] },
  { name: "Soft Blush", colors: ["#F7F2EF", "#EBDDD7", "#C99B8B"] },
  { name: "Stone", colors: ["#1E2022", "#2B2D31", "#9BA0A8"] },
  { name: "Bronze", colors: ["#2B2A27", "#4A433A", "#B8860B"] },
  { name: "Monochrome", colors: ["#121212", "#1E1E1E", "#FFFFFF"] },
  { name: "Dark Luxury", colors: ["#0D1117", "#161B22", "#CCA43B"] },
];

const VERIFIED_FALLBACKS = [
  "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
];

import { luxuryEase } from "@/components/animations/MotionDirectional";

// Motion Variants for Slow Luxury Staggered Upward Reveal
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 1.15,
      ease: luxuryEase,
    },
  },
  exit: {
    opacity: 0,
    y: 15,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

export function PaimaDesignDiscovery() {
  // Selections State (Defaults: Bedroom + Warm Beige)
  const [selectedRoom, setSelectedRoom] = useState("Bedroom");
  const [selectedPalette, setSelectedPalette] = useState("Warm Beige");
  const [sortBy, setSortBy] = useState<"featured" | "most-loved">("featured");

  // Data & Loading State
  const [designs, setDesigns] = useState<DesignItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [selectedDesign, setSelectedDesign] = useState<DesignItem | null>(null);

  // Unique session token for duplicate-like prevention
  const [sessionToken, setSessionToken] = useState("");

  useEffect(() => {
    let token = localStorage.getItem("paima_session_token");
    if (!token) {
      token = "sess_" + Math.random().toString(36).substring(2, 15);
      localStorage.setItem("paima_session_token", token);
    }
    setSessionToken(token);

    try {
      const savedLikes = localStorage.getItem("paima_user_likes");
      if (savedLikes) {
        setUserLikes(JSON.parse(savedLikes));
      }
    } catch (e) {
      console.warn("Could not parse saved user likes", e);
    }
  }, []);

  // Fetch 20+ designs whenever space or palette changes
  const fetchDesigns = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("roomType", selectedRoom);
      params.set("palette", selectedPalette);
      if (sortBy) params.set("sortBy", sortBy);

      const res = await fetch(`/api/designs?${params.toString()}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        setDesigns(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch designs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesigns();
  }, [selectedRoom, selectedPalette, sortBy]);

  // Handle image load error seamlessly
  const handleImageError = (designId: string) => {
    setFailedImages((prev) => ({ ...prev, [designId]: true }));
  };

  // Handle Like Action with real DB persistence
  const handleLike = async (e: React.MouseEvent, designId: string) => {
    e.stopPropagation();

    setDesigns((prev) =>
      prev.map((d) => {
        if (d.id === designId) {
          const isLiked = !!userLikes[designId];
          return {
            ...d,
            likes: isLiked ? Math.max(0, d.likes - 1) : d.likes + 1,
          };
        }
        return d;
      })
    );

    const newLikedState = !userLikes[designId];
    const updatedLikes = { ...userLikes, [designId]: newLikedState };
    setUserLikes(updatedLikes);
    localStorage.setItem("paima_user_likes", JSON.stringify(updatedLikes));

    try {
      const res = await fetch("/api/designs/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ designId, sessionToken }),
      });

      const data = await res.json();
      if (data.success && typeof data.likes === "number") {
        setDesigns((prev) =>
          prev.map((d) => (d.id === designId ? { ...d, likes: data.likes } : d))
        );
        if (selectedDesign && selectedDesign.id === designId) {
          setSelectedDesign((prev) => (prev ? { ...prev, likes: data.likes } : null));
        }
      }
    } catch (err) {
      console.error("Like action error:", err);
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedRoom("Bedroom");
    setSelectedPalette("Warm Beige");
    setSortBy("featured");
  };

  return (
    <div className="min-h-screen bg-[#E1D4C2] text-black pt-24 sm:pt-28 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-12 selection:bg-black selection:text-[#E1D4C2]">
      {/* BRAND HERO HEADER */}
      <div className="max-w-7xl mx-auto mb-8 sm:mb-10 pb-6 sm:pb-8 border-b border-[#A78D78]/50">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-[2px] bg-black" />
              <span className="text-[10px] font-sans uppercase tracking-[0.3em] font-extrabold text-black">
                PAIMA ATELIER &bull; SPATIAL DESIGN DISCOVERY
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-black leading-[1.1] break-words">
              Discover Spatial <br />
              <span className="italic font-normal">Architecture &amp; Palettes.</span>
            </h1>
            <p className="mt-3 max-w-2xl font-sans text-xs sm:text-sm font-medium text-black/80 leading-relaxed">
              Select your space typology and preferred material palette to explore over 20 matching luxury interior concepts. Click any concept to view full material specifications or like designs to influence popularity rankings.
            </p>
          </div>

          {/* QUICK RESET CONTROL */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-black bg-[#BEB5A9]/50 text-black hover:bg-[#BEB5A9] text-xs font-sans uppercase tracking-[0.18em] font-extrabold transition-all duration-300 shadow-sm w-full sm:w-auto min-h-[44px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET SELECTIONS</span>
            </button>
          </div>
        </div>
      </div>

      {/* DISCOVERY CONTROL STEPS */}
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 mb-10 sm:mb-12">
        {/* STEP 1: ROOM / SPACE SELECTION */}
        <section className="bg-[#BEB5A9]/40 p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#A78D78]/40 shadow-sm space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-black text-[#E1D4C2] text-[10px] font-mono font-bold flex items-center justify-center">
                1
              </span>
              <h2 className="text-xs font-sans uppercase tracking-[0.2em] font-extrabold text-black">
                CHOOSE SPACE / ROOM TYPOLOGY
              </h2>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-black/70 font-bold">
              ACTIVE: {selectedRoom.toUpperCase()}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {ROOM_TYPES.map((room) => {
              const isActive = selectedRoom === room;
              return (
                <button
                  key={room}
                  type="button"
                  onClick={() => setSelectedRoom(room)}
                  className={cn(
                    "px-3.5 sm:px-4 py-2.5 rounded-full text-xs font-sans uppercase tracking-[0.15em] font-extrabold transition-all duration-300 border min-h-[44px]",
                    isActive
                      ? "bg-black text-[#E1D4C2] border-black shadow-md scale-[1.02]"
                      : "bg-[#E1D4C2]/80 text-black border-[#A78D78]/60 hover:bg-[#BEB5A9] hover:border-black"
                  )}
                >
                  {room}
                </button>
              );
            })}
          </div>
        </section>

        {/* STEP 2: PALETTE SELECTION */}
        <section className="bg-[#BEB5A9]/40 p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#A78D78]/40 shadow-sm space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-black text-[#E1D4C2] text-[10px] font-mono font-bold flex items-center justify-center">
                2
              </span>
              <h2 className="text-xs font-sans uppercase tracking-[0.2em] font-extrabold text-black">
                CHOOSE CURATED PALETTE
              </h2>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-black/70 font-bold">
              ACTIVE: {selectedPalette.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3 pt-1">
            {PALETTES.map((pal) => {
              const isActive = selectedPalette === pal.name;
              return (
                <button
                  key={pal.name}
                  type="button"
                  onClick={() => setSelectedPalette(pal.name)}
                  className={cn(
                    "p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-1.5 sm:gap-2 text-center min-h-[58px]",
                    isActive
                      ? "bg-black text-[#E1D4C2] border-black shadow-md ring-2 ring-black ring-offset-2 ring-offset-[#E1D4C2] scale-[1.02]"
                      : "bg-[#E1D4C2]/80 text-black border-[#A78D78]/60 hover:bg-[#BEB5A9] hover:border-black"
                  )}
                >
                  <div className="flex items-center -space-x-1">
                    {pal.colors.map((c, i) => (
                      <span
                        key={i}
                        className="w-3.5 h-3.5 rounded-full border border-black/20"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-sans uppercase tracking-wider font-extrabold truncate w-full">
                    {pal.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* MATCHING DESIGNS GALLERY GRID */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* BAR: MATCH COUNT & SORTING */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#A78D78]/40">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-black">
              {selectedRoom} &bull; {selectedPalette} Concepts ({designs.length})
            </h3>
            <p className="text-xs font-sans text-black/70">
              Showing 20+ matching design monograph items from the PAIMA database catalog.
            </p>
          </div>

          {/* Sort By Controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-sans uppercase tracking-wider font-extrabold text-black/70">
              SORT BY:
            </span>
            <button
              type="button"
              onClick={() => setSortBy("featured")}
              className={cn(
                "px-3.5 py-2 rounded-full text-xs font-sans uppercase tracking-wider font-extrabold transition-all border min-h-[38px]",
                sortBy === "featured"
                  ? "bg-black text-[#E1D4C2] border-black"
                  : "bg-[#BEB5A9]/40 text-black border-[#A78D78] hover:bg-[#BEB5A9]"
              )}
            >
              FEATURED
            </button>
            <button
              type="button"
              onClick={() => setSortBy("most-loved")}
              className={cn(
                "px-3.5 py-2 rounded-full text-xs font-sans uppercase tracking-wider font-extrabold transition-all border flex items-center gap-1.5 min-h-[38px]",
                sortBy === "most-loved"
                  ? "bg-black text-[#E1D4C2] border-black"
                  : "bg-[#BEB5A9]/40 text-black border-[#A78D78] hover:bg-[#BEB5A9]"
              )}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>MOST LOVED</span>
            </button>
          </div>
        </div>

        {/* LOADING INDICATOR */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-black border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-sans uppercase tracking-widest font-extrabold text-black/60">
              LOADING MATCHING MONOGRAPH CONCEPTS...
            </p>
          </div>
        ) : designs.length === 0 ? (
          <div className="py-16 text-center bg-[#BEB5A9]/30 rounded-3xl border border-[#A78D78]/40 space-y-4">
            <Info className="w-8 h-8 text-[#A78D78] mx-auto" />
            <h4 className="font-serif text-xl font-bold">No concepts found</h4>
            <p className="text-xs font-sans text-black/70 max-w-md mx-auto">
              No design monograph items match this exact combination. Try resetting filters.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-6 py-2.5 rounded-full bg-[#A78D78] text-black text-xs font-sans uppercase tracking-widest font-extrabold border border-black shadow-md hover:bg-[#BEB5A9] min-h-[44px]"
            >
              RESET FILTERS
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedRoom}-${selectedPalette}-${sortBy}`}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {designs.map((design, idx) => {
                const isLiked = !!userLikes[design.id];
                const hasFailed = !!failedImages[design.id];

                // Reliable fallback image if specific URL encounters network/CORS error
                const displayImage = hasFailed
                  ? VERIFIED_FALLBACKS[idx % VERIFIED_FALLBACKS.length]
                  : design.image;

                return (
                  <motion.div
                    key={design.id}
                    variants={cardVariants}
                    onClick={() => setSelectedDesign(design)}
                    className="group relative bg-[#BEB5A9]/40 rounded-2xl sm:rounded-3xl overflow-hidden border border-[#A78D78]/50 hover:border-black transition-all duration-500 hover:shadow-2xl cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      {/* IMAGE CONTAINER */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#BEB5A9]">
                        <Image
                          src={displayImage}
                          alt={design.title}
                          fill
                          loading="lazy"
                          onError={() => handleImageError(design.id)}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        {/* LIKE BUTTON */}
                        <button
                          type="button"
                          onClick={(e) => handleLike(e, design.id)}
                          className={cn(
                            "absolute top-3 right-3 min-w-[44px] min-h-[44px] p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md z-10",
                            isLiked
                              ? "bg-black text-red-500 border-black"
                              : "bg-[#E1D4C2]/80 text-black border-[#A78D78] hover:bg-black hover:text-white"
                          )}
                          aria-label="Like design"
                        >
                          <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
                          <span className="text-[10px] font-mono font-bold text-current">
                            {design.likes}
                          </span>
                        </button>
                      </div>

                      {/* CONTENT DETAILS */}
                      <div className="p-5 sm:p-6 space-y-3">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[9px] font-sans uppercase tracking-wider font-extrabold">
                          <span className="px-2.5 py-1 rounded-full bg-[#E1D4C2] border border-[#A78D78]">
                            {design.roomType}
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-[#E1D4C2] border border-[#A78D78]">
                            {design.palette}
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-[#E1D4C2] border border-[#A78D78]">
                            {design.style}
                          </span>
                        </div>

                        <h4 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-black group-hover:text-black/80 transition-colors">
                          {design.title}
                        </h4>

                        <p className="font-sans text-xs text-black/80 leading-relaxed line-clamp-2">
                          {design.description}
                        </p>
                      </div>
                    </div>

                    {/* BOTTOM ACTION BAR */}
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-2 flex items-center justify-between border-t border-[#A78D78]/30">
                      <span className="text-[10px] font-sans uppercase tracking-widest font-extrabold text-black/70">
                        EXPLORE DETAILS
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-black transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* DESIGN DETAIL MODAL */}
      <AnimatePresence>
        {selectedDesign && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedDesign(null)}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#E1D4C2] text-black max-w-3xl w-full rounded-2xl sm:rounded-3xl border border-black shadow-2xl overflow-hidden relative my-4 sm:my-8 max-h-[92vh] overflow-y-auto"
            >
              {/* CLOSE BUTTON */}
              <button
                type="button"
                onClick={() => setSelectedDesign(null)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-black/80 text-white hover:bg-black transition-colors"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>

              {/* MODAL IMAGE */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-black/10">
                <Image
                  src={
                    failedImages[selectedDesign.id]
                      ? VERIFIED_FALLBACKS[0]
                      : selectedDesign.image
                  }
                  alt={selectedDesign.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* MODAL CONTENT */}
              <div className="p-5 sm:p-8 space-y-5 sm:space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#A78D78]/50 pb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[9px] font-sans uppercase tracking-wider font-extrabold mb-2">
                      <span className="px-3 py-1 rounded-full bg-[#BEB5A9] border border-black">
                        {selectedDesign.roomType}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-[#BEB5A9] border border-black">
                        {selectedDesign.palette}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-[#BEB5A9] border border-black">
                        {selectedDesign.style}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl sm:text-3xl font-bold">
                      {selectedDesign.title}
                    </h3>
                  </div>

                  {/* LIKE BUTTON IN MODAL */}
                  <button
                    type="button"
                    onClick={(e) => handleLike(e, selectedDesign.id)}
                    className={cn(
                      "px-5 py-2.5 rounded-full border text-xs font-sans uppercase tracking-widest font-extrabold flex items-center gap-2 transition-all shadow-md min-h-[44px]",
                      userLikes[selectedDesign.id]
                        ? "bg-black text-red-500 border-black"
                        : "bg-[#BEB5A9] text-black border-black hover:bg-black hover:text-white"
                    )}
                  >
                    <Heart className={cn("w-4 h-4", userLikes[selectedDesign.id] && "fill-current")} />
                    <span>{selectedDesign.likes} LIKES</span>
                  </button>
                </div>

                <p className="font-sans text-xs sm:text-sm font-medium leading-relaxed text-black/90">
                  {selectedDesign.description}
                </p>

                {/* MATERIALS SPECIFICATIONS */}
                {selectedDesign.materials && selectedDesign.materials.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-sans uppercase tracking-[0.2em] font-extrabold text-black/70">
                      SPATIAL MATERIAL SPECIFICATIONS
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedDesign.materials.map((mat, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 rounded-xl bg-[#BEB5A9]/60 border border-[#A78D78] text-xs font-sans font-bold text-black"
                        >
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
