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
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-[100] transition-all duration-500",
          isScrolled
            ? "py-3 bg-[#E1D4C2]/95 backdrop-blur-xl border-b border-[#A78D78]/40 shadow-md"
            : "py-5 bg-gradient-to-b from-[#E1D4C2]/95 via-[#E1D4C2]/50 to-transparent"
        )}
      >
        <nav
          aria-label="Global Persistent Navigation Bar"
          className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between"
        >
          {/* ================= LEFT NODE: BRAND LOGO (DROP FROM TOP) ================= */}
          <motion.div
            initial={{ opacity: 0, y: -35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0 }}
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
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </Link>
          </motion.div>

          {/* ================= CENTER NODE: CORE NAVIGATIONAL LINKS (DROP FROM TOP WITH STAGGER) ================= */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
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
                      "relative py-1 font-sans text-xs uppercase tracking-[0.2em] transition-colors duration-300 group",
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
          <motion.div
            initial={{ opacity: 0, y: -35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.28 }}
            className="flex items-center gap-3 sm:gap-4"
          >
            {/* WHEN SIGNED OUT */}
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="hidden lg:inline-flex items-center text-xs font-sans uppercase tracking-[0.18em] font-extrabold text-black hover:text-[#A78D78] transition-colors py-2 px-3 focus:outline-none"
                >
                  SIGN IN
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="hidden sm:inline-flex items-center px-4 py-2 rounded-full border border-black bg-[#BEB5A9] text-black hover:bg-[#A78D78] text-xs font-sans uppercase tracking-[0.18em] font-extrabold transition-all shadow-sm focus:outline-none"
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

            {/* PRESERVED CTA: PRIVATE INQUIRIES */}
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#A78D78] text-black hover:bg-[#BEB5A9] hover:text-black text-xs font-sans uppercase tracking-[0.18em] font-extrabold transition-all duration-300 group shadow-md border border-black shrink-0"
            >
              <span>PRIVATE INQUIRIES</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-black transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            {/* Mobile Drawer Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-black hover:opacity-80 focus:outline-none"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </motion.div>
        </nav>
      </header>

      {/* ================= MOBILE DRAWER ================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={springTransition}
            className="fixed inset-0 z-[90] bg-[#E1D4C2]/98 backdrop-blur-2xl flex flex-col justify-between p-8 pt-28 md:hidden text-black overflow-y-auto"
          >
            <div className="flex flex-col space-y-6">
              <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-black font-extrabold">
                NAVIGATION
              </span>
              {NAV_LINKS.map((link, idx) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * idx, ...springTransition }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "font-serif text-2xl sm:text-3xl tracking-wide block transition-colors duration-300",
                      pathname === link.href
                        ? "text-black font-extrabold"
                        : "text-black/80 hover:text-black"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="pt-8 border-t border-[#A78D78]/40 space-y-4">
              <Show when="signed-out">
                <div className="flex flex-col gap-3">
                  <SignInButton mode="modal">
                    <button
                      type="button"
                      className="w-full py-3.5 bg-[#BEB5A9] text-black text-center text-xs uppercase tracking-[0.2em] font-extrabold rounded-full border border-black"
                    >
                      SIGN IN
                    </button>
                  </SignInButton>

                  <SignUpButton mode="modal">
                    <button
                      type="button"
                      className="w-full py-3.5 bg-[#A78D78] text-black text-center text-xs uppercase tracking-[0.2em] font-extrabold rounded-full shadow-lg border border-black"
                    >
                      CREATE ACCOUNT
                    </button>
                  </SignUpButton>
                </div>
              </Show>

              <Show when="signed-in">
                <div className="flex items-center gap-3 p-3 bg-[#BEB5A9]/50 border border-[#A78D78] rounded-xl">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10 border border-black rounded-full shadow-md",
                      },
                    }}
                  />
                  <span className="text-xs font-sans uppercase tracking-wider font-extrabold text-black">
                    Your Profile &amp; Settings
                  </span>
                </div>
              </Show>

              <p className="text-xs text-black font-semibold leading-relaxed pt-2">
                Manhattan &bull; Monaco &bull; Paris &bull; Los Angeles
                <br />
                concierge@paimadesign.com
              </p>
              <Link
                href="/contact"
                className="w-full py-3.5 bg-[#A78D78] text-black text-center text-xs uppercase tracking-[0.2em] font-extrabold flex items-center justify-center gap-2 rounded-full shadow-lg border border-black"
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
