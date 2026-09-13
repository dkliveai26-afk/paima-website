"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  Type,
  Layers,
  Sparkles,
  RotateCcw,
  Download,
  Check,
  Eye,
  Compass,
  Wand2,
  ArrowUpRight,
  Maximize2,
  X,
  Share2,
  Copy,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// 1. CURATED PALETTES
// ============================================================================
export interface PaletteToken {
  id: string;
  name: string;
  tagline: string;
  bg: string;
  surface: string;
  accent: string;
  textPrimary: string;
  textMuted: string;
  border: string;
  highlight: string;
}

export const PALETTES: PaletteToken[] = [
  {
    id: "paima-original",
    name: "PAIMA Original",
    tagline: "Signature Warm Sand Monograph",
    bg: "#E1D4C2",
    surface: "#BEB5A9",
    accent: "#A78D78",
    textPrimary: "#000000",
    textMuted: "#3D352E",
    border: "#A78D78",
    highlight: "#1F1A14",
  },
  {
    id: "ivory-editorial",
    name: "Ivory Editorial",
    tagline: "High-Light Parisian Residence",
    bg: "#F9F6F0",
    surface: "#EFE9DF",
    accent: "#D4C5B2",
    textPrimary: "#1C1917",
    textMuted: "#6C6358",
    border: "#D6CBBA",
    highlight: "#2D2620",
  },
  {
    id: "warm-earth",
    name: "Warm Earth",
    tagline: "Organic Mediterranean Sanctuary",
    bg: "#2D241E",
    surface: "#3D322A",
    accent: "#C89B7B",
    textPrimary: "#F5EFE9",
    textMuted: "#BCAEA4",
    border: "#524338",
    highlight: "#E6A984",
  },
  {
    id: "soft-blush",
    name: "Soft Blush",
    tagline: "Tactile Rose & Terracotta Monolith",
    bg: "#F7F2EF",
    surface: "#EBDDD7",
    accent: "#C99B8B",
    textPrimary: "#2A211F",
    textMuted: "#6E5D57",
    border: "#DBC8C0",
    highlight: "#8A4F41",
  },
  {
    id: "stone-bronze",
    name: "Stone & Bronze",
    tagline: "Brutalist Mineral Estate",
    bg: "#1E2022",
    surface: "#2B2D31",
    accent: "#B8860B",
    textPrimary: "#F0F2F5",
    textMuted: "#9BA0A8",
    border: "#3F434A",
    highlight: "#DAA520",
  },
  {
    id: "monochrome",
    name: "Monochrome",
    tagline: "Architectural Noir Studio",
    bg: "#121212",
    surface: "#1E1E1E",
    accent: "#FFFFFF",
    textPrimary: "#F5F5F5",
    textMuted: "#888888",
    border: "#333333",
    highlight: "#CCCCCC",
  },
  {
    id: "midnight-luxury",
    name: "Midnight Luxury",
    tagline: "Harbor Penthouse Twilight",
    bg: "#0D1117",
    surface: "#161B22",
    accent: "#CCA43B",
    textPrimary: "#EDF2F7",
    textMuted: "#8B949E",
    border: "#30363D",
    highlight: "#E5C158",
  },
];

// ============================================================================
// 2. CURATED TYPOGRAPHY PAIRINGS
// ============================================================================
export interface TypographyOption {
  id: string;
  name: string;
  headerClass: string;
  subtitleClass: string;
  bodyClass: string;
  badge: string;
  sampleHeader: string;
  description: string;
}

export const TYPOGRAPHY_OPTIONS: TypographyOption[] = [
  {
    id: "editorial-serif",
    name: "Editorial Serif",
    headerClass: "font-serif font-bold tracking-tight",
    subtitleClass: "font-serif italic font-normal",
    bodyClass: "font-sans text-sm leading-relaxed",
    badge: "Playfair / Inter",
    sampleHeader: "Bespoke Spatial Monograph",
    description: "Classic high-contrast serif headers paired with delicate italic subheadings.",
  },
  {
    id: "modern-luxury",
    name: "Modern Luxury",
    headerClass: "font-sans font-extrabold uppercase tracking-[0.18em]",
    subtitleClass: "font-sans font-semibold uppercase tracking-[0.25em]",
    bodyClass: "font-sans text-xs tracking-wider uppercase leading-relaxed",
    badge: "Inter Black / Mono",
    sampleHeader: "BESPOKE SPATIAL MONOGRAPH",
    description: "Geometry-driven sans-serif with expanded tracking for high-fashion elegance.",
  },
  {
    id: "architectural-minimal",
    name: "Architectural Minimal",
    headerClass: "font-mono font-bold tracking-widest uppercase",
    subtitleClass: "font-mono font-medium tracking-[0.2em] uppercase",
    bodyClass: "font-mono text-xs leading-relaxed",
    badge: "Technical Blueprint Mono",
    sampleHeader: "MONOGRAPH // SPATIAL ARCHITECTURE",
    description: "Crisp grid-aligned technical typography inspired by precision architectural plans.",
  },
  {
    id: "contemporary-classic",
    name: "Contemporary Classic",
    headerClass: "font-serif font-normal tracking-normal",
    subtitleClass: "font-sans font-light tracking-widest uppercase",
    bodyClass: "font-sans text-sm font-normal leading-relaxed",
    badge: "Harmonious Serif & Sans",
    sampleHeader: "Haute Interior Architecture",
    description: "Perfect equilibrium between classical proportions and contemporary legibility.",
  },
];

// ============================================================================
// 3. DESIGN MOODS
// ============================================================================
export interface MoodOption {
  id: string;
  name: string;
  borderStyle: string;
  shadowStyle: string;
  roundedStyle: string;
  accentElement: string;
  description: string;
}

export const MOOD_OPTIONS: MoodOption[] = [
  {
    id: "minimal",
    name: "Minimal",
    borderStyle: "border",
    shadowStyle: "shadow-none",
    roundedStyle: "rounded-none",
    accentElement: "Thin architectural hairline rules",
    description: "Pure geometric clarity with razor-sharp borders and minimal visual friction.",
  },
  {
    id: "warm",
    name: "Warm",
    borderStyle: "border border-opacity-70",
    shadowStyle: "shadow-xl shadow-black/10",
    roundedStyle: "rounded-2xl",
    accentElement: "Soft ambient illumination",
    description: "Curved contours, gentle warmth, and tactile spatial harmony.",
  },
  {
    id: "contemporary",
    name: "Contemporary",
    borderStyle: "border-2",
    shadowStyle: "shadow-md",
    roundedStyle: "rounded-lg",
    accentElement: "Bold framing geometry",
    description: "Confident structural lines, high-contrast borders, and sculptural presence.",
  },
  {
    id: "sophisticated",
    name: "Sophisticated",
    borderStyle: "border backdrop-blur-xl",
    shadowStyle: "shadow-2xl",
    roundedStyle: "rounded-3xl",
    accentElement: "Glassmorphic surfaces & metallic sheen",
    description: "Layered glass translucent cards with subtle metallic highlight borders.",
  },
  {
    id: "dramatic",
    name: "Dramatic",
    borderStyle: "border-t-4 border-b-2",
    shadowStyle: "shadow-2xl shadow-black/50",
    roundedStyle: "rounded-md",
    accentElement: "Deep contrast shadow play",
    description: "High impact focal points, dramatic structural framing, and intense luxury presence.",
  },
];

// Sample spatial items for the preview
const SAMPLE_SPATIAL_WORKS = [
  {
    title: "Le Monolithe Penthouse",
    location: "Monaco Harbor &bull; 850m\u00B2",
    category: "PENTHOUSE",
    year: "2025",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    desc: "Floating travertine volumes over Mediterranean waters with seamless panoramic glazing.",
  },
  {
    title: "Villa d'Ivry Pavilion",
    location: "Paris XVIe &bull; 1,200m\u00B2",
    category: "RESIDENCE",
    year: "2024",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
    desc: "Restored Haussmannian salon infused with minimalist bronze architectural millwork.",
  },
  {
    title: "Tribeca Sky Sanctuary",
    location: "New York &bull; 620m\u00B2",
    category: "PENTHOUSE",
    year: "2025",
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1200&auto=format&fit=crop",
    desc: "Double-height atrium featuring hand-fluted smoked oak and sculptural spiral stairs.",
  },
];

export interface AIDesignResult {
  suggestedPaletteId: string;
  suggestedTypographyId: string;
  suggestedMoodId: string;
  title: string;
  conceptSummary: string;
  materialMood: string;
  lightingCharacter: string;
  furnitureDirection: string;
  atmosphere: string;
  imageUrl: string;
  userPrompt: string;
  generatedAt: string;
}

export function PaimaDesignTool() {
  // State
  const [activePalette, setActivePalette] = useState<PaletteToken>(PALETTES[0]);
  const [activeTypography, setActiveTypography] = useState<TypographyOption>(TYPOGRAPHY_OPTIONS[0]);
  const [activeMood, setActiveMood] = useState<MoodOption>(MOOD_OPTIONS[0]);

  // AI Assistant State
  const [promptInput, setPromptInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<AIDesignResult | null>(null);

  // Modals & Share
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Active Tab in Mobile Controls
  const [controlTab, setControlTab] = useState<"palette" | "type" | "mood" | "ai">("palette");

  // Load saved state on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("paima_design_studio_state");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.paletteId) {
          const foundP = PALETTES.find((p) => p.id === parsed.paletteId);
          if (foundP) setActivePalette(foundP);
        }
        if (parsed.typographyId) {
          const foundT = TYPOGRAPHY_OPTIONS.find((t) => t.id === parsed.typographyId);
          if (foundT) setActiveTypography(foundT);
        }
        if (parsed.moodId) {
          const foundM = MOOD_OPTIONS.find((m) => m.id === parsed.moodId);
          if (foundM) setActiveMood(foundM);
        }
        if (parsed.aiResult) {
          setAiResult(parsed.aiResult);
        }
      }
    } catch (e) {
      console.warn("Could not parse saved design studio state", e);
    }
  }, []);

  // Save state on change
  useEffect(() => {
    try {
      localStorage.setItem(
        "paima_design_studio_state",
        JSON.stringify({
          paletteId: activePalette.id,
          typographyId: activeTypography.id,
          moodId: activeMood.id,
          aiResult,
        })
      );
    } catch (e) {
      console.warn("Could not save design studio state", e);
    }
  }, [activePalette, activeTypography, activeMood, aiResult]);

  // Reset to PAIMA Original
  const handleReset = () => {
    setActivePalette(PALETTES[0]);
    setActiveTypography(TYPOGRAPHY_OPTIONS[0]);
    setActiveMood(MOOD_OPTIONS[0]);
    setAiResult(null);
    setAiError(null);
    setPromptInput("");
  };

  // Generate AI Direction via real server endpoint
  const handleGenerateAI = async (customPrompt?: string) => {
    const textToSubmit = customPrompt || promptInput;
    if (!textToSubmit || !textToSubmit.trim()) return;

    setIsGenerating(true);
    setAiError(null);

    try {
      const res = await fetch("/api/design-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToSubmit,
          currentPalette: activePalette.name,
          currentTypography: activeTypography.name,
          currentMood: activeMood.name,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Unable to generate the design direction right now. Please try again.");
      }

      setAiResult(data.data);

      // Auto apply suggested palette/type/mood if returned
      if (data.data.suggestedPaletteId) {
        const foundP = PALETTES.find((p) => p.id === data.data.suggestedPaletteId);
        if (foundP) setActivePalette(foundP);
      }
      if (data.data.suggestedTypographyId) {
        const foundT = TYPOGRAPHY_OPTIONS.find((t) => t.id === data.data.suggestedTypographyId);
        if (foundT) setActiveTypography(foundT);
      }
      if (data.data.suggestedMoodId) {
        const foundM = MOOD_OPTIONS.find((m) => m.id === data.data.suggestedMoodId);
        if (foundM) setActiveMood(foundM);
      }
    } catch (err: any) {
      console.error("AI Generation Error:", err);
      setAiError(err.message || "Unable to generate the design direction right now. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Export JSON Monograph Spec
  const handleCopySpec = () => {
    const spec = {
      studio: "PAIMA Atelier Interactive Design Monograph",
      createdAt: new Date().toISOString(),
      palette: { id: activePalette.id, name: activePalette.name, hex: activePalette },
      typography: { id: activeTypography.id, name: activeTypography.name },
      mood: { id: activeMood.id, name: activeMood.name },
      aiDirection: aiResult || "None generated",
    };
    navigator.clipboard.writeText(JSON.stringify(spec, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const samplePrompts = [
    "Warm modern luxury apartment with natural stone and soft lighting.",
    "Parisian penthouse with smoked oak, patinated bronze and quiet courtyard views.",
    "Brutalist coastal villa with honed travertine, warm sand tones and minimalist glass.",
    "Midnight harbor lounge with dark marble, brass diffusers and velvety atmosphere.",
  ];

  return (
    <div
      className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-12 transition-colors duration-700 ease-out"
      style={{
        backgroundColor: activePalette.bg,
        color: activePalette.textPrimary,
      }}
    >
      {/* TOP BRAND HEADER */}
      <div className="max-w-7xl mx-auto mb-10 pb-6 border-b transition-colors duration-500" style={{ borderColor: activePalette.border }}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-[2px] transition-colors duration-500" style={{ backgroundColor: activePalette.textPrimary }} />
              <span className="text-[10px] font-sans uppercase tracking-[0.3em] font-extrabold" style={{ color: activePalette.textMuted }}>
                PAIMA ATELIER &bull; BESPOKE DESIGN STUDIO
              </span>
            </div>
            <h1 className={cn("text-3xl sm:text-5xl lg:text-6xl transition-all duration-500", activeTypography.headerClass)}>
              Interactive <span className="italic font-normal">Design Monograph.</span>
            </h1>
            <p className={cn("mt-3 max-w-2xl text-xs sm:text-sm transition-all duration-500", activeTypography.bodyClass)} style={{ color: activePalette.textMuted }}>
              Experiment with curated spatial palettes, typography pairings, and design directions in real time. Use our server-side Gemini AI assistant to translate architectural visions into custom monographs.
            </p>
          </div>

          {/* QUICK TOOL BAR CONTROLS */}
          <div className="flex items-center flex-wrap gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-xs font-sans uppercase tracking-[0.18em] font-bold transition-all duration-300 hover:scale-[1.02]"
              style={{
                borderColor: activePalette.border,
                backgroundColor: activePalette.surface,
                color: activePalette.textPrimary,
              }}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET TO ORIGINAL</span>
            </button>

            <button
              type="button"
              onClick={() => setShowExportModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-sans uppercase tracking-[0.18em] font-extrabold transition-all duration-300 shadow-md hover:scale-[1.02]"
              style={{
                backgroundColor: activePalette.accent,
                color: "#FFFFFF",
                border: `1px solid ${activePalette.border}`,
              }}
            >
              <Download className="w-3.5 h-3.5" />
              <span>EXPORT DESIGN SPEC</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN STUDIO WORKSPACE */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ================================================================== */}
        {/* LEFT / MOBILE CONTROL PANEL (4 COLS ON DESKTOP)                     */}
        {/* ================================================================== */}
        <aside className="lg:col-span-4 space-y-6">
          <div
            className={cn(
              "p-6 transition-all duration-500",
              activeMood.borderStyle,
              activeMood.shadowStyle,
              activeMood.roundedStyle
            )}
            style={{
              backgroundColor: activePalette.surface,
              borderColor: activePalette.border,
            }}
          >
            {/* Control Panel Tabs */}
            <div className="flex items-center justify-between border-b pb-4 mb-6" style={{ borderColor: activePalette.border }}>
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4" style={{ color: activePalette.highlight }} />
                <h2 className="text-xs font-sans uppercase tracking-[0.2em] font-extrabold">
                  DESIGN CONTROLS
                </h2>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded" style={{ backgroundColor: activePalette.bg, color: activePalette.textMuted }}>
                LIVE TOKENS
              </span>
            </div>

            {/* Selector Category Selector Buttons */}
            <div className="grid grid-cols-4 gap-1 p-1 rounded-xl mb-6" style={{ backgroundColor: activePalette.bg }}>
              {[
                { id: "palette", label: "PALETTE", icon: Palette },
                { id: "type", label: "TYPE", icon: Type },
                { id: "mood", label: "MOOD", icon: Layers },
                { id: "ai", label: "AI", icon: Sparkles },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = controlTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setControlTab(tab.id as any)}
                    className={cn(
                      "flex flex-col items-center justify-center py-2 px-1 rounded-lg text-[10px] font-sans uppercase tracking-wider font-extrabold transition-all duration-300",
                      isActive ? "shadow-sm" : "opacity-70 hover:opacity-100"
                    )}
                    style={{
                      backgroundColor: isActive ? activePalette.surface : "transparent",
                      color: activePalette.textPrimary,
                    }}
                  >
                    <Icon className="w-3.5 h-3.5 mb-1" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT 1: PALETTES */}
            {controlTab === "palette" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-sans uppercase tracking-widest font-extrabold" style={{ color: activePalette.textMuted }}>
                    CURATED PALETTES ({PALETTES.length})
                  </span>
                </div>
                <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                  {PALETTES.map((p) => {
                    const isSelected = activePalette.id === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setActivePalette(p)}
                        className={cn(
                          "w-full text-left p-3.5 rounded-xl border transition-all duration-300 group flex items-center justify-between",
                          isSelected ? "ring-2 ring-offset-2 ring-black" : "hover:border-black/50"
                        )}
                        style={{
                          backgroundColor: p.surface,
                          borderColor: isSelected ? p.highlight : p.border,
                          color: p.textPrimary,
                        }}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-sans font-bold uppercase tracking-wider">{p.name}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-black" />}
                          </div>
                          <p className="text-[10px] font-sans mt-0.5 opacity-80">{p.tagline}</p>
                        </div>

                        {/* Swatches */}
                        <div className="flex items-center -space-x-1.5 shrink-0 ml-3">
                          <span className="w-4 h-4 rounded-full border border-black/20" style={{ backgroundColor: p.bg }} />
                          <span className="w-4 h-4 rounded-full border border-black/20" style={{ backgroundColor: p.surface }} />
                          <span className="w-4 h-4 rounded-full border border-black/20" style={{ backgroundColor: p.accent }} />
                          <span className="w-4 h-4 rounded-full border border-black/20" style={{ backgroundColor: p.textPrimary }} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: TYPOGRAPHY */}
            {controlTab === "type" && (
              <div className="space-y-3">
                <span className="text-xs font-sans uppercase tracking-widest font-extrabold block mb-2" style={{ color: activePalette.textMuted }}>
                  TYPOGRAPHY SYSTEMS ({TYPOGRAPHY_OPTIONS.length})
                </span>
                <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                  {TYPOGRAPHY_OPTIONS.map((t) => {
                    const isSelected = activeTypography.id === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setActiveTypography(t)}
                        className={cn(
                          "w-full text-left p-4 rounded-xl border transition-all duration-300",
                          isSelected ? "ring-2 ring-offset-2 ring-black" : "hover:border-black/50"
                        )}
                        style={{
                          backgroundColor: activePalette.bg,
                          borderColor: isSelected ? activePalette.highlight : activePalette.border,
                        }}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-sans uppercase tracking-wider font-extrabold">{t.name}</span>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded border" style={{ borderColor: activePalette.border, color: activePalette.textMuted }}>
                            {t.badge}
                          </span>
                        </div>
                        <p className={cn("text-base my-2", t.headerClass)}>
                          {t.sampleHeader}
                        </p>
                        <p className="text-[11px] font-sans opacity-80 leading-relaxed" style={{ color: activePalette.textMuted }}>
                          {t.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: DESIGN MOOD */}
            {controlTab === "mood" && (
              <div className="space-y-3">
                <span className="text-xs font-sans uppercase tracking-widest font-extrabold block mb-2" style={{ color: activePalette.textMuted }}>
                  DESIGN MOOD &amp; FRAME ({MOOD_OPTIONS.length})
                </span>
                <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                  {MOOD_OPTIONS.map((m) => {
                    const isSelected = activeMood.id === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setActiveMood(m)}
                        className={cn(
                          "w-full text-left p-4 rounded-xl border transition-all duration-300",
                          isSelected ? "ring-2 ring-offset-2 ring-black" : "hover:border-black/50"
                        )}
                        style={{
                          backgroundColor: activePalette.bg,
                          borderColor: isSelected ? activePalette.highlight : activePalette.border,
                        }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-sans uppercase tracking-wider font-extrabold">{m.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <p className="text-[10px] font-sans uppercase tracking-widest mb-2" style={{ color: activePalette.accent }}>
                          {m.accentElement}
                        </p>
                        <p className="text-[11px] font-sans opacity-80 leading-relaxed" style={{ color: activePalette.textMuted }}>
                          {m.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: GEMINI AI ASSISTANT */}
            {controlTab === "ai" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Wand2 className="w-4 h-4" style={{ color: activePalette.accent }} />
                  <span className="text-xs font-sans uppercase tracking-widest font-extrabold">
                    GEMINI AI DESIGN DIRECTION
                  </span>
                </div>

                <p className="text-xs leading-relaxed" style={{ color: activePalette.textMuted }}>
                  Describe your architectural vision below. Our server-side Gemini AI engine will generate a bespoke design monograph, select optimal tokens, and generate a real AI interior visual.
                </p>

                <div className="space-y-2">
                  <textarea
                    rows={3}
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder="e.g. Warm modern luxury apartment with natural stone, soft lighting and a calm atmosphere..."
                    className="w-full p-3 rounded-xl text-xs font-sans border focus:outline-none transition-all duration-300 resize-none"
                    style={{
                      backgroundColor: activePalette.bg,
                      borderColor: activePalette.border,
                      color: activePalette.textPrimary,
                    }}
                  />

                  {/* Sample prompt chips */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-sans uppercase tracking-wider font-bold block opacity-70">
                      OR TRY A QUICK INSPIRATION PROMPT:
                    </span>
                    <div className="flex flex-col gap-1.5">
                      {samplePrompts.map((sp, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setPromptInput(sp);
                            handleGenerateAI(sp);
                          }}
                          className="text-left text-[10px] font-sans p-2 rounded-lg border transition-all duration-300 hover:opacity-100 opacity-80"
                          style={{
                            backgroundColor: activePalette.bg,
                            borderColor: activePalette.border,
                          }}
                        >
                          &ldquo;{sp}&rdquo;
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {aiError && (
                  <div className="p-3 rounded-xl text-xs bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300">
                    {aiError}
                  </div>
                )}

                <button
                  type="button"
                  disabled={isGenerating || !promptInput.trim()}
                  onClick={() => handleGenerateAI()}
                  className="w-full py-3.5 rounded-xl font-sans text-xs uppercase tracking-[0.2em] font-extrabold flex items-center justify-center gap-2.5 transition-all duration-300 shadow-lg disabled:opacity-50 hover:scale-[1.01]"
                  style={{
                    backgroundColor: activePalette.accent,
                    color: "#FFFFFF",
                    border: `1px solid ${activePalette.border}`,
                  }}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>GENERATING AI DIRECTION...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>GENERATE DESIGN DIRECTION</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* ACTIVE TOKEN SUMMARY CARD */}
          <div
            className="p-5 rounded-2xl border space-y-3"
            style={{
              backgroundColor: activePalette.surface,
              borderColor: activePalette.border,
            }}
          >
            <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: activePalette.border }}>
              <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-extrabold" style={{ color: activePalette.textMuted }}>
                ACTIVE DESIGN SPECIFICATION
              </span>
              <Info className="w-3.5 h-3.5" style={{ color: activePalette.textMuted }} />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-sans uppercase tracking-wider">
              <div className="p-2 rounded-lg border" style={{ backgroundColor: activePalette.bg, borderColor: activePalette.border }}>
                <span className="block opacity-60 text-[9px] mb-0.5">PALETTE</span>
                <span className="font-bold truncate block">{activePalette.name}</span>
              </div>

              <div className="p-2 rounded-lg border" style={{ backgroundColor: activePalette.bg, borderColor: activePalette.border }}>
                <span className="block opacity-60 text-[9px] mb-0.5">TYPE</span>
                <span className="font-bold truncate block">{activeTypography.name}</span>
              </div>

              <div className="p-2 rounded-lg border" style={{ backgroundColor: activePalette.bg, borderColor: activePalette.border }}>
                <span className="block opacity-60 text-[9px] mb-0.5">MOOD</span>
                <span className="font-bold truncate block">{activeMood.name}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* ================================================================== */}
        {/* RIGHT / MAIN LIVE PREVIEW AREA (8 COLS ON DESKTOP)                 */}
        {/* ================================================================== */}
        <main className="lg:col-span-8 space-y-8">
          
          {/* 1. LIVE DESIGN CANVAS HEADER */}
          <section
            className={cn(
              "p-8 sm:p-12 transition-all duration-500 relative overflow-hidden",
              activeMood.borderStyle,
              activeMood.shadowStyle,
              activeMood.roundedStyle
            )}
            style={{
              backgroundColor: activePalette.surface,
              borderColor: activePalette.border,
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-[2px]" style={{ backgroundColor: activePalette.textPrimary }} />
              <span className="text-[10px] font-sans uppercase tracking-[0.28em] font-extrabold" style={{ color: activePalette.textMuted }}>
                PREVIEW WORKSPACE &bull; {activePalette.name.toUpperCase()}
              </span>
            </div>

            <h2 className={cn("text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6 transition-all duration-500", activeTypography.headerClass)}>
              Architectural <br />
              <span className={activeTypography.subtitleClass}>Spatial Harmony.</span>
            </h2>

            <p className={cn("max-w-2xl text-sm sm:text-base font-medium leading-relaxed transition-all duration-500 mb-8", activeTypography.bodyClass)} style={{ color: activePalette.textMuted }}>
              Every residence is a bespoke synthesis of its architectural context, geographic atmosphere, and the patron&apos;s personal narrative. The live preview reflects your selected color tokens, typography hierarchy, and frame mood without page reload.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                className="px-8 py-3.5 rounded-full text-xs font-sans uppercase tracking-[0.2em] font-extrabold transition-all duration-300 shadow-lg hover:scale-[1.02]"
                style={{
                  backgroundColor: activePalette.accent,
                  color: "#FFFFFF",
                  border: `1px solid ${activePalette.border}`,
                }}
              >
                EXPLORE SPATIAL SPECIFICATIONS
              </button>

              <button
                type="button"
                className="px-6 py-3.5 rounded-full text-xs font-sans uppercase tracking-[0.2em] font-extrabold border transition-all duration-300 hover:opacity-80"
                style={{
                  borderColor: activePalette.border,
                  backgroundColor: activePalette.bg,
                  color: activePalette.textPrimary,
                }}
              >
                REQUEST CONSULTATION &rarr;
              </button>
            </div>
          </section>

          {/* 2. REAL GEMINI AI GENERATED RESULT CARD (IF ACTIVE) */}
          <AnimatePresence>
            {aiResult && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className={cn(
                  "p-6 sm:p-8 border-2 transition-all duration-500 space-y-6 relative overflow-hidden",
                  activeMood.shadowStyle,
                  activeMood.roundedStyle
                )}
                style={{
                  backgroundColor: activePalette.surface,
                  borderColor: activePalette.highlight,
                }}
              >
                <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: activePalette.border }}>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 animate-pulse" style={{ color: activePalette.highlight }} />
                    <span className="text-xs font-sans uppercase tracking-[0.25em] font-extrabold">
                      GEMINI AI DESIGN MONOGRAPH
                    </span>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full border" style={{ borderColor: activePalette.border }}>
                    GENERATED REAL AI RESULT
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* AI Generated Image Visual */}
                  <div className="md:col-span-5 relative group rounded-2xl overflow-hidden border aspect-[4/3]" style={{ borderColor: activePalette.border }}>
                    <Image
                      src={aiResult.imageUrl}
                      alt={aiResult.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setZoomImage(aiResult.imageUrl)}
                        className="px-4 py-2 bg-white/90 text-black text-xs font-sans uppercase tracking-widest font-extrabold rounded-full shadow-xl flex items-center gap-1.5"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>ZOOM VISUAL</span>
                      </button>
                    </div>
                  </div>

                  {/* AI Design Description & Rationale */}
                  <div className="md:col-span-7 space-y-4">
                    <h3 className={cn("text-2xl sm:text-3xl font-bold", activeTypography.headerClass)}>
                      {aiResult.title}
                    </h3>

                    <p className={cn("text-xs sm:text-sm leading-relaxed opacity-90", activeTypography.bodyClass)}>
                      {aiResult.conceptSummary}
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] font-sans">
                      <div className="p-3 rounded-xl border" style={{ backgroundColor: activePalette.bg, borderColor: activePalette.border }}>
                        <span className="font-extrabold block uppercase tracking-wider mb-1 opacity-70">MATERIALS</span>
                        <span className="leading-snug block">{aiResult.materialMood}</span>
                      </div>

                      <div className="p-3 rounded-xl border" style={{ backgroundColor: activePalette.bg, borderColor: activePalette.border }}>
                        <span className="font-extrabold block uppercase tracking-wider mb-1 opacity-70">LIGHTING</span>
                        <span className="leading-snug block">{aiResult.lightingCharacter}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* 3. LIVE SPATIAL RESIDENCE CARDS GRID */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-sans uppercase tracking-[0.2em] font-extrabold" style={{ color: activePalette.textMuted }}>
                SAMPLE SPATIAL RESIDENCES IN THIS MONOGRAPH ({SAMPLE_SPATIAL_WORKS.length})
              </h3>
              <span className="text-[10px] font-sans uppercase tracking-widest font-semibold" style={{ color: activePalette.textMuted }}>
                FILTERED BY ACTIVE TOKEN SYSTEM
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SAMPLE_SPATIAL_WORKS.map((work, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "p-5 transition-all duration-500 flex flex-col justify-between group",
                    activeMood.borderStyle,
                    activeMood.shadowStyle,
                    activeMood.roundedStyle
                  )}
                  style={{
                    backgroundColor: activePalette.surface,
                    borderColor: activePalette.border,
                  }}
                >
                  <div className="space-y-4">
                    {/* Image */}
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden border" style={{ borderColor: activePalette.border }}>
                      <Image
                        src={work.image}
                        alt={work.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full text-[9px] font-sans uppercase tracking-widest font-extrabold bg-black/75 text-white backdrop-blur-md">
                        {work.category}
                      </div>
                      <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full text-[9px] font-mono font-bold bg-white/90 text-black">
                        {work.year}
                      </div>
                    </div>

                    <div>
                      <h4 className={cn("text-lg font-bold transition-all duration-300", activeTypography.headerClass)}>
                        {work.title}
                      </h4>
                      <span className="text-[10px] font-sans uppercase tracking-wider font-semibold block mt-0.5 opacity-70">
                        {work.location}
                      </span>
                    </div>

                    <p className={cn("text-xs leading-relaxed opacity-85", activeTypography.bodyClass)} style={{ color: activePalette.textMuted }}>
                      {work.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t flex items-center justify-between" style={{ borderColor: activePalette.border }}>
                    <span className="text-[10px] font-sans uppercase tracking-widest font-extrabold opacity-75">
                      VIEW MONOGRAPH
                    </span>
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. LIVE MATERIAL & PALETTE TOKEN INSPECTOR */}
          <section
            className={cn(
              "p-6 sm:p-8 transition-all duration-500 space-y-6",
              activeMood.borderStyle,
              activeMood.shadowStyle,
              activeMood.roundedStyle
            )}
            style={{
              backgroundColor: activePalette.surface,
              borderColor: activePalette.border,
            }}
          >
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: activePalette.border }}>
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                <h3 className="text-xs font-sans uppercase tracking-[0.2em] font-extrabold">
                  ACTIVE CENTRALIZED TOKEN INSPECTOR
                </h3>
              </div>
              <span className="text-[10px] font-mono uppercase opacity-70">
                SYSTEM VARS &bull; CSS COMPLIANT
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "BACKGROUND", hex: activePalette.bg },
                { label: "SURFACE", hex: activePalette.surface },
                { label: "ACCENT", hex: activePalette.accent },
                { label: "PRIMARY TEXT", hex: activePalette.textPrimary },
              ].map((token, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border flex flex-col justify-between space-y-3"
                  style={{
                    backgroundColor: activePalette.bg,
                    borderColor: activePalette.border,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-sans uppercase tracking-wider font-extrabold opacity-70">
                      {token.label}
                    </span>
                    <span className="w-3.5 h-3.5 rounded-full border border-black/30" style={{ backgroundColor: token.hex }} />
                  </div>

                  <span className="font-mono text-xs font-bold uppercase tracking-wider">
                    {token.hex}
                  </span>
                </div>
              ))}
            </div>
          </section>

        </main>
      </div>

      {/* ================================================================== */}
      {/* EXPORT / SAVE DESIGN SPEC MODAL                                    */}
      {/* ================================================================== */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#E1D4C2] text-black max-w-xl w-full p-8 rounded-3xl border border-black shadow-2xl space-y-6 relative"
            >
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Download className="w-5 h-5 text-[#A78D78]" />
                  <span className="text-xs font-sans uppercase tracking-[0.2em] font-extrabold">
                    EXPORT PAIMA DESIGN SPECIFICATION
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold">
                  Custom Monograph Summary
                </h3>
              </div>

              <div className="bg-[#BEB5A9]/50 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-[#A78D78] max-h-60">
                <pre>{JSON.stringify(
                  {
                    studio: "PAIMA Atelier Interactive Design Monograph",
                    createdAt: new Date().toISOString(),
                    palette: { name: activePalette.name, bg: activePalette.bg, accent: activePalette.accent },
                    typography: { name: activeTypography.name },
                    mood: { name: activeMood.name },
                    aiDirection: aiResult ? { title: aiResult.title, summary: aiResult.conceptSummary } : "None generated",
                  },
                  null,
                  2
                )}</pre>
              </div>

              <div className="flex items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleCopySpec}
                  className="flex-1 py-3 bg-[#A78D78] text-black text-xs font-sans uppercase tracking-[0.2em] font-extrabold rounded-full border border-black flex items-center justify-center gap-2 hover:bg-[#BEB5A9] transition-all"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? "COPIED TO CLIPBOARD!" : "COPY SPEC JSON"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowExportModal(false)}
                  className="px-6 py-3 border border-black text-black text-xs font-sans uppercase tracking-[0.2em] font-extrabold rounded-full hover:bg-black/5 transition-all"
                >
                  CLOSE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================================================================== */}
      {/* IMAGE ZOOM MODAL                                                   */}
      {/* ================================================================== */}
      <AnimatePresence>
        {zoomImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomImage(null)}
            className="fixed inset-0 z-[250] bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 cursor-pointer"
          >
            <div className="relative max-w-5xl w-full aspect-[16/10] rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
              <Image src={zoomImage} alt="AI Visual" fill className="object-cover" unoptimized />
              <button
                type="button"
                onClick={() => setZoomImage(null)}
                className="absolute top-4 right-4 p-3 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
