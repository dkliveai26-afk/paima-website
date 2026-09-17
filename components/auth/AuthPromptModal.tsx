"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, ArrowRight } from "lucide-react";

const SESSION_DISMISSED_KEY = "paima_auth_prompt_dismissed";
const SESSION_START_KEY = "paima_session_start_time";
const DELAY_MS = 8000; // 8 seconds

const EXCLUDED_PREFIXES = ["/sign-in", "/sign-up", "/dilkhush-admin", "/admin"];

export function AuthPromptModal() {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useAuth();
  const prefersReducedMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check if current route is excluded
  const isExcludedRoute = EXCLUDED_PREFIXES.some((prefix) =>
    pathname?.startsWith(prefix)
  );

  const dismissPrompt = useCallback(() => {
    setIsOpen(false);
    try {
      sessionStorage.setItem(SESSION_DISMISSED_KEY, "true");
    } catch {
      // Ignore storage errors in private browsing/sandboxed contexts
    }
  }, []);

  useEffect(() => {
    // If Clerk is still loading, wait
    if (!isLoaded) return;

    // If user is already authenticated, never show
    if (isSignedIn) {
      setIsOpen(false);
      return;
    }

    // If on an excluded route (auth or admin), do not show
    if (isExcludedRoute) {
      setIsOpen(false);
      return;
    }

    // Check if user has already dismissed in this browser session
    try {
      const isDismissed = sessionStorage.getItem(SESSION_DISMISSED_KEY) === "true";
      if (isDismissed) {
        return;
      }

      // Track session start to maintain consistent 8s window across page navigation
      let startTime = sessionStorage.getItem(SESSION_START_KEY);
      if (!startTime) {
        startTime = Date.now().toString();
        sessionStorage.setItem(SESSION_START_KEY, startTime);
      }

      const elapsed = Date.now() - parseInt(startTime, 10);
      const remainingDelay = Math.max(0, DELAY_MS - (isNaN(elapsed) ? 0 : elapsed));

      timerRef.current = setTimeout(() => {
        // Double-check dismissal status and auth state before displaying
        const stillDismissed =
          sessionStorage.getItem(SESSION_DISMISSED_KEY) === "true";
        if (!stillDismissed && !isSignedIn) {
          setIsOpen(true);
        }
      }, remainingDelay);
    } catch {
      // Fallback simple timer if sessionStorage is disabled
      timerRef.current = setTimeout(() => {
        if (!isSignedIn) {
          setIsOpen(true);
        }
      }, DELAY_MS);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isLoaded, isSignedIn, isExcludedRoute]);

  // Handle ESC key to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        dismissPrompt();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, dismissPrompt]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-prompt-title"
          aria-describedby="auth-prompt-desc"
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.05 : 0.3 }}
            onClick={dismissPrompt}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 16, scale: 0.98 }
            }
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 1, y: 0, scale: 1 }
            }
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 12, scale: 0.98 }
            }
            transition={{
              type: "spring",
              damping: 26,
              stiffness: 280,
              mass: 0.8,
            }}
            className="relative w-full max-w-md sm:max-w-lg bg-[#E1D4C2] border border-[#A78D78]/50 rounded-2xl shadow-2xl p-6 sm:p-9 text-[#1A1A1A] overflow-hidden"
          >
            {/* Subtle luxury top decorative accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#BEB5A9] via-[#A78D78] to-[#BEB5A9]" />

            {/* Accessible Close Button */}
            <button
              type="button"
              onClick={dismissPrompt}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-black/70 hover:text-black hover:bg-[#BEB5A9]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-black"
              aria-label="Close authentication prompt"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content Structure */}
            <div className="text-center space-y-3 pt-2 sm:pt-3">
              {/* Eyebrow */}
              <div className="inline-block">
                <span className="text-[10px] sm:text-xs font-sans uppercase tracking-[0.25em] font-extrabold text-black/75 px-3 py-1 bg-[#BEB5A9]/40 border border-[#A78D78]/40 rounded-full">
                  PRIVATE ACCESS
                </span>
              </div>

              {/* Main Heading */}
              <h2
                id="auth-prompt-title"
                className="font-serif text-2xl sm:text-3xl lg:text-[32px] text-black font-bold tracking-tight leading-snug pt-1"
              >
                Enter the PAIMA Circle
              </h2>

              {/* Supporting Copy */}
              <p
                id="auth-prompt-desc"
                className="text-xs sm:text-sm text-black/80 font-sans leading-relaxed max-w-md mx-auto pt-1 pb-2"
              >
                Sign in or create your account to save designs, manage private
                inquiries, and access your personalized PAIMA experience.
              </p>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                {/* Primary Action: SIGN IN */}
                <Link
                  href="/sign-in"
                  onClick={dismissPrompt}
                  className="w-full min-h-[48px] py-3.5 px-6 rounded-full bg-[#1A1A1A] text-[#F5F2EB] hover:bg-black font-sans text-xs uppercase tracking-[0.18em] font-extrabold transition-all duration-200 shadow-md flex items-center justify-center gap-2 group focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                >
                  <span>SIGN IN</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>

                {/* Secondary Action: CREATE ACCOUNT */}
                <Link
                  href="/sign-up"
                  onClick={dismissPrompt}
                  className="w-full min-h-[48px] py-3.5 px-6 rounded-full bg-[#BEB5A9] text-black hover:bg-[#A78D78] font-sans text-xs uppercase tracking-[0.18em] font-extrabold transition-all duration-200 border border-black shadow-sm flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <span>CREATE ACCOUNT</span>
                </Link>

                {/* Tertiary Link: CONTINUE EXPLORING */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={dismissPrompt}
                    className="text-[11px] font-sans uppercase tracking-[0.2em] font-extrabold text-black/60 hover:text-black transition-colors focus:outline-none underline underline-offset-4 decoration-black/30 hover:decoration-black py-1"
                  >
                    CONTINUE EXPLORING
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
