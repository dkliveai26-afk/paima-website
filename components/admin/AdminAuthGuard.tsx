"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Loader2, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";

// ─── Left Brand Panel ─────────────────────────────────────────────────────────
function BrandPanel() {
  return (
    <div className="relative hidden lg:flex flex-col items-center justify-center w-[46%] min-h-screen bg-[#F2EBE1] overflow-hidden shrink-0">
      {/* Architectural grid lines — subtle SVG overlay */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.18] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {/* Vertical lines */}
        {[10, 25, 40, 55, 70, 85].map((x) => (
          <line key={`v${x}`} x1={`${x}%`} y1="0" x2={`${x}%`} y2="100%" stroke="#8C6A55" strokeWidth="0.7" />
        ))}
        {/* Horizontal lines */}
        {[8, 20, 35, 50, 65, 80, 93].map((y) => (
          <line key={`h${y}`} x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`} stroke="#8C6A55" strokeWidth="0.7" />
        ))}
        {/* Diagonal accent */}
        <line x1="0" y1="100%" x2="100%" y2="0" stroke="#A78D78" strokeWidth="0.5" opacity="0.4" />
      </svg>

      {/* Marble-like warm texture gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#EDE4D9]/60 via-transparent to-[#D8C5B0]/30 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-12 space-y-8">
        {/* Logo */}
        <div className="w-56">
          <Image
            src="/logo.svg"
            alt="Paima"
            width={224}
            height={56}
            priority
            className="w-full h-auto"
          />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 w-44">
          <div className="flex-1 h-px bg-[#A78D78]/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#A78D78]/80" />
          <div className="flex-1 h-px bg-[#A78D78]/60" />
        </div>

        {/* Subtitle */}
        <div className="space-y-2">
          <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-[#8C6A55] font-bold">
            Private Executive Portal
          </p>
          <p className="text-xs text-[#A08060] max-w-[200px] leading-relaxed">
            Restricted administrative access for authorized personnel only.
          </p>
        </div>

        {/* Corner decorative lines */}
        <div className="absolute bottom-10 left-10 opacity-30">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <line x1="0" y1="40" x2="0" y2="0" stroke="#8C6A55" strokeWidth="1.5" />
            <line x1="0" y1="0" x2="40" y2="0" stroke="#8C6A55" strokeWidth="1.5" />
          </svg>
        </div>
        <div className="absolute top-10 right-10 opacity-30 rotate-180">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <line x1="0" y1="40" x2="0" y2="0" stroke="#8C6A55" strokeWidth="1.5" />
            <line x1="0" y1="0" x2="40" y2="0" stroke="#8C6A55" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      {/* Bottom attribution */}
      <p className="absolute bottom-8 left-0 right-0 text-center text-[9px] font-mono uppercase tracking-[0.3em] text-[#A08060]/60">
        Paima Atelier © {new Date().getFullYear()}
      </p>
    </div>
  );
}

// ─── Sign-In Form Panel ────────────────────────────────────────────────────────
function SignInPanel() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid admin credentials.");
      } else {
        router.refresh(); // Reload to hit layout.tsx and get true for isAuthorized
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-8 py-16 min-h-screen lg:min-h-0">
      <div className="w-full max-w-sm space-y-8 animate-[fadeUp_0.35s_ease_both]">
        {/* Mobile-only logo */}
        <div className="flex lg:hidden flex-col items-center gap-3 pb-2">
          <Image src="/logo.svg" alt="Paima" width={140} height={36} priority className="h-auto" />
          <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#8C6A55]">
            Private Executive Portal
          </p>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-[#1C1614]">Sign in</h1>
          <p className="text-xs text-[#7D6B64] leading-relaxed">
            Authorized administrator credentials required.
          </p>
        </div>

        {/* Custom Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-[#7D6B64]">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F7F2EA] border border-[#E5D5C5] text-[#1C1614] rounded-xl py-3 px-4 text-sm focus:border-[#B3877F] focus:ring-0 outline-none transition-all"
                placeholder="admin@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-[#7D6B64]">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F7F2EA] border border-[#E5D5C5] text-[#1C1614] rounded-xl py-3 px-4 text-sm focus:border-[#B3877F] focus:ring-0 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-100 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs font-mono text-red-800 leading-tight">
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1C1614] hover:bg-[#2D2326] text-[#FDFBF7] font-bold text-xs uppercase tracking-[0.2em] rounded-xl py-3.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            <span>{loading ? "Verifying..." : "Sign In"}</span>
          </button>
        </form>

        {/* Footer */}
        <div className="pt-4 border-t border-[#EDE4D9]">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-mono text-[#7D6B64] hover:text-[#4A3B36] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to public website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main AdminAuthGuard Export ────────────────────────────────────────────────
export function AdminAuthGuard({
  children,
  isAuthorized,
}: {
  children: React.ReactNode;
  isAuthorized: boolean;
}) {
  const Shell = ({ right }: { right: React.ReactNode }) => (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#FDFBF7]">
      <BrandPanel />
      <div className="flex flex-col flex-1">{right}</div>
    </div>
  );

  if (!isAuthorized) {
    return (
      <Shell
        right={
          <>
            <style>{`
              @keyframes fadeUp {
                from { opacity: 0; transform: translateY(12px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
            <SignInPanel />
          </>
        }
      />
    );
  }

  // ── Authorized → render admin dashboard ──
  return <>{children}</>;
}
