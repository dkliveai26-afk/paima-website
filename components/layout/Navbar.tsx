"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "HOME", href: "/" },
  { label: "ABOUT", href: "/about" },
  { label: "SERVICES", href: "/services" },
  { label: "DESIGN STUDIO", href: "/portfolio" },
  { label: "CONTACT", href: "/contact" },
];

const springTransition = {
  type: "spring" as const,
  stiffness: 90,
  damping: 20,
};

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open to prevent background scrolling
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-[100] transition-all duration-500",
          isScrolled
            ? "py-3 bg-[#E1D4C2]/95 backdrop-blur-xl border-b border-[#A78D78]/40 shadow-md"
            : "py-3.5 sm:py-5 bg-transparent border-b border-transparent shadow-none"
        )}
      >
        <nav
          aria-label="Global Persistent Navigation Bar"
          className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between"
        >
          {/* ================= LEFT NODE: BRAND LOGO (DROP FROM TOP) ================= */}
          <motion.div
            initial={{ opacity: 0, y: -35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0 }}
            className="shrink-0"
          >
            <Link
              href="/"
              className="flex items-center transition-opacity duration-300 hover:opacity-95 focus:outline-none"
              aria-label="Paima Home"
            >
              <Image
                src="/logo.svg"
                alt="Paima Luxury Interiors & Real Estate"
                width={180}
                height={48}
                priority
                className="h-9 sm:h-12 w-auto object-contain"
              />
            </Link>
          </motion.div>

          {/* ================= CENTER NODE: CORE NAVIGATIONAL LINKS (DROP FROM TOP WITH STAGGER) ================= */}
          {/* gap-5 at md, gap-7 at lg, gap-9 at xl — gives nav room to breathe without overflow */}
          <div className="hidden md:flex items-center gap-5 lg:gap-7 xl:gap-9">
            {NAV_LINKS.map((link, idx) => {
              const isActive = pathname === link.href;
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -35 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    ...springTransition,
                    delay: 0.08 + idx * 0.04,
                  }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      // whitespace-nowrap prevents "DESIGN\nSTUDIO" wrapping
                      "relative py-1 font-sans text-xs uppercase tracking-[0.2em] transition-colors duration-300 group whitespace-nowrap",
                      isActive
                        ? "text-black font-extrabold"
                        : "text-black/90 font-bold hover:text-black"
                    )}
                  >
                    <span>{link.label}</span>

                    {/* Active Underline Indicator */}
                    {isActive ? (
                      <motion.span
                        layoutId="paimaActiveNav"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-black"
                        transition={springTransition}
                      />
                    ) : (
                      <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* ================= RIGHT NODE: AUTH CONTROLS + PRIVATE INQUIRIES (DROP FROM TOP) ================= */}
          {/* shrink-0 prevents this section from being compressed by the center nav */}
          <motion.div
            initial={{ opacity: 0, y: -35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.28 }}
            className="flex items-center gap-2 lg:gap-3 shrink-0"
          >
            {/* WHEN SIGNED OUT */}
            <Show when="signed-out">
              {/* SIGN IN: xl+ only — avoids crowding at 1024-1279px */}
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="hidden xl:inline-flex items-center text-xs font-sans uppercase tracking-[0.18em] font-extrabold text-black hover:text-[#A78D78] transition-colors py-2 px-3 focus:outline-none whitespace-nowrap"
                >
                  SIGN IN
                </button>
              </SignInButton>

              {/* CREATE ACCOUNT: lg+ — visible from 1024px, nowrap prevents vertical break */}
              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="hidden lg:inline-flex items-center px-4 py-2 rounded-full border border-black bg-[#BEB5A9] text-black hover:bg-[#A78D78] text-xs font-sans uppercase tracking-[0.18em] font-extrabold transition-all shadow-sm focus:outline-none whitespace-nowrap"
                >
                  CREATE ACCOUNT
                </button>
              </SignUpButton>
            </Show>

            {/* WHEN SIGNED IN */}
            <Show when="signed-in">
              <div className="flex items-center gap-2">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox:
                        "w-9 h-9 border border-black rounded-full shadow-md hover:scale-105 transition-transform",
                    },
                  }}
                />
              </div>
            </Show>

            {/* PRESERVED CTA: PRIVATE INQUIRIES — shrink-0 + whitespace-nowrap keeps it on one line */}
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center gap-2 px-4 lg:px-5 py-2.5 rounded-full bg-[#A78D78] text-black hover:bg-[#BEB5A9] hover:text-black text-xs font-sans uppercase tracking-[0.18em] font-extrabold transition-all duration-300 group shadow-md border border-black shrink-0 whitespace-nowrap"
            >
              <span>PRIVATE INQUIRIES</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-black transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            {/* Mobile Drawer Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full p-2 text-black bg-[#BEB5A9]/40 border border-[#A78D78]/50 hover:bg-[#BEB5A9] active:scale-95 transition-all focus:outline-none"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </motion.div>
        </nav>
      </header>

      {/* ================= MOBILE FULLSCREEN APP-STYLE DRAWER ================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={springTransition}
            className="fixed inset-0 z-[120] bg-[#E1D4C2]/98 backdrop-blur-2xl flex flex-col justify-between p-5 sm:p-8 pt-6 md:hidden text-black overflow-y-auto"
          >
            {/* Top Bar with Brand and Close */}
            <div className="flex items-center justify-between pb-4 border-b border-[#A78D78]/40 shrink-0">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center"
              >
                <Image
                  src="/logo.svg"
                  alt="Paima"
                  width={140}
                  height={36}
                  className="h-8 w-auto object-contain"
                />
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-[#BEB5A9]/60 border border-black p-2 text-black active:scale-95 transition-all focus:outline-none"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col space-y-2 py-6">
              <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-black/70 font-extrabold px-3 mb-2">
                STUDIO DIRECTORY
              </span>
              {NAV_LINKS.map((link, idx) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * idx, ...springTransition }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between px-3.5 py-3.5 rounded-xl text-lg sm:text-2xl font-serif tracking-wide transition-all duration-300 min-h-[48px]",
                        isActive
                          ? "bg-[#BEB5A9] text-black font-extrabold border border-black shadow-sm"
                          : "text-black/90 hover:bg-[#BEB5A9]/50 hover:text-black"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono font-extrabold text-black/60">
                          0{idx + 1}
                        </span>
                        <span>{link.label}</span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 opacity-70" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Auth & Concierge Actions */}
            <div className="pt-6 border-t border-[#A78D78]/40 space-y-3.5 shrink-0 pb-[calc(env(safe-area-inset-bottom,0px)+1rem)]">
              <Show when="signed-out">
                <div className="grid grid-cols-2 gap-2.5">
                  <SignInButton mode="modal">
                    <button
                      type="button"
                      className="w-full py-3 bg-[#BEB5A9] text-black text-center text-xs uppercase tracking-[0.16em] font-extrabold rounded-full border border-black min-h-[44px]"
                    >
                      SIGN IN
                    </button>
                  </SignInButton>

                  <SignUpButton mode="modal">
                    <button
                      type="button"
                      className="w-full py-3 bg-[#A78D78] text-black text-center text-xs uppercase tracking-[0.16em] font-extrabold rounded-full shadow-md border border-black min-h-[44px]"
                    >
                      REGISTER
                    </button>
                  </SignUpButton>
                </div>
              </Show>

              <Show when="signed-in">
                <div className="flex items-center gap-3 p-3 bg-[#BEB5A9]/60 border border-[#A78D78] rounded-xl">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-9 h-9 border border-black rounded-full shadow-md",
                      },
                    }}
                  />
                  <span className="text-xs font-sans uppercase tracking-wider font-extrabold text-black">
                    Your Profile &amp; Settings
                  </span>
                </div>
              </Show>

              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 bg-[#A78D78] text-black text-center text-xs uppercase tracking-[0.2em] font-extrabold flex items-center justify-center gap-2 rounded-full shadow-lg border border-black min-h-[48px]"
              >
                <span>PRIVATE INQUIRIES</span>
                <ArrowUpRight className="w-4 h-4 text-black" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
