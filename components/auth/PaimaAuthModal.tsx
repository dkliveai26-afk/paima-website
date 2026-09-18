"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useClerk } from "@clerk/nextjs";
import { X, Mail, ChevronRight, Lock, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import { usePaimaAuth } from "@/components/auth/PaimaAuthContext";

function GoogleLogo({ className = "w-5 h-5" }: { className?: string }) {
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

function PaimaMonogram({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="46" stroke="#1A1A1A" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
      <path
        d="M32 72V28C32 28 42 22 56 28C70 34 70 52 54 54C42 55.5 32 54 32 54"
        stroke="#1A1A1A"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M44 38C50 36 60 38 60 46C60 54 50 56 44 54"
        stroke="#1A1A1A"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PaimaAuthModal() {
  const { isAuthModalOpen, closeAuthModal } = usePaimaAuth();
  const prefersReducedMotion = useReducedMotion();
  const clerk = useClerk();

  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reset internal state when modal opens/closes
  useEffect(() => {
    if (isAuthModalOpen) {
      setShowEmailForm(false);
      setEmail("");
      setPassword("");
      setErrorMessage(null);
      setLoading(false);
    }
  }, [isAuthModalOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  // Google OAuth flow
  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setLoading(true);
    try {
      closeAuthModal();
      clerk.openSignUp({
        fallbackRedirectUrl: window.location.href,
      });
    } catch (err: any) {
      console.warn("Google OAuth trigger:", err);
      clerk.openSignUp();
    } finally {
      setLoading(false);
    }
  };

  // Email Sign In / Sign Up flow
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      closeAuthModal();
      clerk.openSignIn({
        initialValues: { emailAddress: email.trim() },
        fallbackRedirectUrl: window.location.href,
      });
    } catch (err: any) {
      setErrorMessage(err?.message || "Unable to proceed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="paima-auth-title"
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
        >
          {/* Subtle Translucent Backdrop with Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.05 : 0.25 }}
            onClick={closeAuthModal}
            className="absolute inset-0 bg-black/50 backdrop-blur-md cursor-pointer"
            aria-hidden="true"
          />

          {/* Translucent Luxury Glass Authentication Modal Card */}
          <motion.div
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 20, scale: 0.97 }
            }
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 1, y: 0, scale: 1 }
            }
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 15, scale: 0.97 }
            }
            transition={{
              type: "spring",
              damping: 28,
              stiffness: 300,
              mass: 0.8,
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-[#E1D4C2]/85 backdrop-blur-2xl border border-[#A78D78]/50 shadow-2xl rounded-3xl p-7 sm:p-9 text-[#1A1A1A] overflow-hidden"
          >
            {/* Top Close Button */}
            <button
              type="button"
              onClick={closeAuthModal}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-black/60 hover:text-black hover:bg-[#BEB5A9]/50 transition-colors focus:outline-none"
              aria-label="Close authentication window"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header with PAIMA Logo Monogram */}
            <div className="text-center space-y-2 pt-1">
              <div className="flex justify-center mb-1">
                <PaimaMonogram className="w-10 h-10 text-black opacity-90" />
              </div>

              <h2
                id="paima-auth-title"
                className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-bold tracking-tight"
              >
                Welcome Back
              </h2>

              <p className="text-xs sm:text-sm text-[#4A4743] font-sans font-medium">
                Sign in to continue to Paima
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-900 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-700" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Authentication Options */}
            <div className="mt-6 space-y-3.5">
              {/* Primary: Continue with Google (Matching Reference Exact Layout) */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full h-12 px-4 rounded-2xl bg-[#F5F2EB]/95 hover:bg-white text-[#1A1A1A] font-sans text-xs sm:text-sm font-bold transition-all duration-200 border border-[#A78D78]/40 shadow-sm flex items-center justify-center gap-3 active:scale-[0.99] focus:outline-none"
              >
                <GoogleLogo className="w-5 h-5 shrink-0" />
                <span>Continue with Google</span>
              </button>

              {/* Minimal Divider: — or — */}
              <div className="flex items-center gap-3 py-1">
                <div className="h-[1px] flex-1 bg-[#A78D78]/30" />
                <span className="text-[11px] font-sans text-[#736B63] lowercase font-medium">
                  or
                </span>
                <div className="h-[1px] flex-1 bg-[#A78D78]/30" />
              </div>

              {/* Email Option */}
              {!showEmailForm ? (
                <button
                  type="button"
                  onClick={() => setShowEmailForm(true)}
                  className="w-full h-12 px-4 rounded-2xl bg-[#BEB5A9]/35 hover:bg-[#BEB5A9]/60 text-[#1A1A1A] font-sans text-xs sm:text-sm font-bold transition-all duration-200 border border-[#A78D78]/40 flex items-center justify-between focus:outline-none"
                >
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-black" />
                    <span>Continue with email</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-black/60" />
                </button>
              ) : (
                <form onSubmit={handleEmailSubmit} className="space-y-3">
                  <div>
                    <label className="text-[10px] uppercase font-sans tracking-[0.16em] font-extrabold text-[#1A1A1A] block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      autoFocus
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full bg-[#F5F2EB]/95 border border-[#A78D78]/60 focus:border-black rounded-xl px-4 py-2.5 text-xs text-[#1A1A1A] placeholder:text-black/40 focus:outline-none font-medium h-11 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-sans tracking-[0.16em] font-extrabold text-[#1A1A1A] block mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full bg-[#F5F2EB]/95 border border-[#A78D78]/60 focus:border-black rounded-xl px-4 py-2.5 text-xs text-[#1A1A1A] placeholder:text-black/40 focus:outline-none font-medium h-11 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-full bg-[#1A1A1A] hover:bg-black text-[#E1D4C2] font-sans text-xs uppercase tracking-[0.18em] font-extrabold transition-all duration-200 shadow-lg flex items-center justify-center gap-2 focus:outline-none border border-black disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Connecting...</span>
                    ) : (
                      <>
                        <span>CONTINUE</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Bottom Trust Badge: 🔒 Secure • Fast • Trusted */}
            <div className="pt-6 flex items-center justify-center gap-2 text-[10px] sm:text-[11px] font-sans font-bold text-[#4A4743]">
              <Lock className="w-3 h-3 text-[#4A4743]" />
              <span>Secure &bull; Fast &bull; Trusted</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
