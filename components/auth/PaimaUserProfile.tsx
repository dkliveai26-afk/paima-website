"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useUser, useClerk } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, LogOut, ChevronRight, User as UserIcon } from "lucide-react";

export function PaimaUserProfile() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { openUserProfile, signOut } = useClerk();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isLoaded || !isSignedIn || !user) {
    return null;
  }

  const fullName = user.fullName || user.username || "Client Patron";
  const primaryEmail = user.primaryEmailAddress?.emailAddress || "";
  const imageUrl = user.imageUrl;

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Profile Trigger Avatar Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-10 h-10 rounded-full border border-black/80 bg-[#BEB5A9] overflow-hidden shadow-md hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Open user profile menu"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={fullName}
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#A78D78] text-[#1A1A1A] font-bold text-sm uppercase">
            {fullName.charAt(0) || <UserIcon className="w-4 h-4" />}
          </div>
        )}
      </button>

      {/* Luxury Translucent Glass Profile Dropdown (Matches Reference Image 3) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="absolute right-0 mt-3 w-72 sm:w-80 z-[150] rounded-2xl bg-[#E1D4C2]/90 backdrop-blur-2xl border border-[#A78D78]/50 shadow-2xl p-4 text-[#1A1A1A] overflow-hidden"
          >
            {/* Top User Info Section */}
            <div className="flex items-center gap-3 pb-3.5 border-b border-[#A78D78]/35">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border border-black/70 bg-[#BEB5A9] shrink-0 shadow-sm">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={fullName}
                    width={44}
                    height={44}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#A78D78] text-black font-bold text-base uppercase">
                    {fullName.charAt(0)}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[#1A1A1A] truncate leading-tight">
                  {fullName}
                </p>
                {primaryEmail && (
                  <p className="text-xs text-[#4A4743] truncate font-medium mt-0.5">
                    {primaryEmail}
                  </p>
                )}
              </div>
            </div>

            {/* Menu Navigation Items */}
            <div className="py-2 space-y-1">
              {/* Manage account */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  openUserProfile();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-[#1A1A1A] hover:bg-[#BEB5A9]/50 active:bg-[#BEB5A9]/80 transition-colors duration-150 focus:outline-none"
              >
                <Settings className="w-4 h-4 text-[#1A1A1A] shrink-0" />
                <span>Manage account</span>
              </button>

              {/* Sign out */}
              <button
                type="button"
                onClick={async () => {
                  setIsOpen(false);
                  await signOut();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-[#1A1A1A] hover:bg-[#BEB5A9]/50 active:bg-[#BEB5A9]/80 transition-colors duration-150 focus:outline-none"
              >
                <LogOut className="w-4 h-4 text-[#1A1A1A] shrink-0" />
                <span>Sign out</span>
              </button>
            </div>

            {/* Bottom Accent Status Pill: Secure & Connected (Matches Image 3) */}
            <div className="pt-2 border-t border-[#A78D78]/35">
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#BEB5A9]/40 border border-[#A78D78]/40 text-[#1A1A1A] transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="text-[11px] font-bold text-[#1A1A1A]">
                    Secure &amp; Connected
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#4A4743]" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
