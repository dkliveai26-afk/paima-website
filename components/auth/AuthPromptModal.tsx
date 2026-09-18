"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuth, SignInButton, SignUpButton } from "@clerk/nextjs";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, ArrowRight, ShieldCheck } from "lucide-react";

const SESSION_DISMISSED_KEY = "paima_auth_prompt_dismissed";
const SESSION_START_KEY = "paima_session_start_time";
const DELAY_MS = 8000; // 8 seconds

const EXCLUDED_PREFIXES = ["/sign-in", "/sign-up", "/dilkhush-admin", "/admin"];

function GoogleLogo({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

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
      // Ignore storage errors in sandboxed contexts
    }
  }, []);

  useEffect(() => {
    if (!isLoaded || isSignedIn || isExcludedRoute) {
      setIsOpen(false);
      return;
    }

    try {
      const isDismissed = sessionStorage.getItem(SESSION_DISMISSED_KEY) === "true";
      if (isDismissed) return;

      let startTime = sessionStorage.getItem(SESSION_START_KEY);
      if (!startTime) {
        startTime = Date.now().toString();
        sessionStorage.setItem(SESSION_START_KEY, startTime);
      }

      const elapsed = Date.now() - parseInt(startTime, 10);
      const remainingDelay = Math.max(0, DELAY_MS - (isNaN(elapsed) ? 0 : elapsed));

      timerRef.current = setTimeout(() => {
        const stillDismissed =
          sessionStorage.getItem(SESSION_DISMISSED_KEY) === "true";
        if (!stillDismissed && !isSignedIn) {
          setIsOpen(true);
        }
      }, remainingDelay);
    } catch {
      timerRef.current = setTimeout(() => {
        if (!isSignedIn) setIsOpen(true);
      }, DELAY_MS);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isLoaded, isSignedIn, isExcludedRoute]);

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
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6"
        >
          {/* Translucent Glass Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.05 : 0.3 }}
            onClick={dismissPrompt}
            className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
            aria-hidden="true"
          />

          {/* Translucent Premium Glass Modal Card */}
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
            className="relative w-full max-w-sm sm:max-w-md bg-[#E1D4C2]/95 backdrop-blur-2xl border border-[#A78D78]/60 rounded-3xl shadow-2xl p-6 sm:p-8 text-[#1A1A1A] overflow-hidden"
          >
            {/* Top decorative accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#BEB5A9] via-[#A78D78] to-[#BEB5A9]" />

            {/* Close Button */}
            <button
              type="button"
              onClick={dismissPrompt}
              className="absolute top-4 right-4 p-2 rounded-full text-black/70 hover:text-black hover:bg-[#BEB5A9]/50 transition-colors focus:outline-none"
              aria-label="Close prompt"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content Structure with Minimal Copy */}
            <div className="text-center space-y-3 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#BEB5A9]/40 border border-[#A78D78]/40 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-black" />
                <span className="text-[10px] font-sans uppercase tracking-[0.25em] font-extrabold text-black/80">
                  PRIVATE PATRON ACCESS
                </span>
              </div>

              <h2
                id="auth-prompt-title"
                className="font-serif text-2xl sm:text-3xl text-black font-bold tracking-tight leading-snug"
              >
                Access PAIMA Atelier
              </h2>

              <p className="text-xs text-black/75 font-sans leading-relaxed max-w-xs mx-auto">
                Sign in to save curated designs, request confidential consultations, and access your patron dossier.
              </p>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-3">
                {/* Google Sign-in Option with Official Logo */}
                <SignUpButton mode="modal">
                  <button
                    type="button"
                    onClick={dismissPrompt}
                    className="w-full min-h-[46px] py-2.5 px-4 rounded-xl bg-[#BEB5A9]/50 hover:bg-[#BEB5A9] text-black font-sans text-xs uppercase tracking-wider font-extrabold transition-all duration-200 border border-[#A78D78]/60 shadow-sm flex items-center justify-center gap-2.5 focus:outline-none"
                  >
                    <GoogleLogo className="w-4 h-4" />
                    <span>Continue with Google</span>
                  </button>
                </SignUpButton>

                {/* Primary Action: Get Started */}
                <SignUpButton mode="modal">
                  <button
                    type="button"
                    onClick={dismissPrompt}
                    className="w-full min-h-[46px] py-2.5 px-4 rounded-full bg-[#1A1A1A] hover:bg-black text-[#E1D4C2] font-sans text-xs uppercase tracking-[0.16em] font-extrabold transition-all duration-200 shadow-md flex items-center justify-center gap-2 focus:outline-none"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </SignUpButton>

                {/* Dismiss Link */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={dismissPrompt}
                    className="text-[10px] font-sans uppercase tracking-[0.2em] font-extrabold text-black/60 hover:text-black transition-colors focus:outline-none"
                  >
                    CONTINUE AS GUEST
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
