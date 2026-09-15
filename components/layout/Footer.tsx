"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUp, ArrowUpRight, Check } from "lucide-react";
import { AGENCY_INFO } from "@/lib/data";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 4000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#BEB5A9]/40 text-black pt-16 sm:pt-20 pb-12 border-t border-[#A78D78]/50 overflow-hidden" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 sm:pb-16 border-b border-[#A78D78]/40">
          <div className="lg:col-span-6 space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.25em] text-black uppercase">
                PAIMA
              </span>
              <span className="text-[9px] sm:text-[10px] font-sans font-extrabold tracking-[0.2em] sm:tracking-[0.25em] text-black uppercase">
                Estates &bull; Interiors
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-3xl md:text-4xl font-normal leading-tight tracking-tight text-black">
              Curating rare architectural sanctuaries and prime waterfront estates worldwide.
            </h2>
            <p className="font-sans text-xs text-black font-semibold leading-relaxed">
              We represent a strictly curated portfolio of prime residential acquisitions and orchestrate bespoke architectural renovations across the globe.
            </p>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-end">
            <div className="bg-[#E1D4C2] p-5 sm:p-8 border border-[#A78D78] rounded-2xl shadow-xl">
              <h3 className="font-serif text-lg sm:text-xl font-bold mb-2 text-black">The Paima Gazette</h3>
              <p className="text-xs text-black font-medium mb-4 sm:mb-6">
                Receive private off-market listings, architectural monographs, and global market intelligence.
              </p>

              <form onSubmit={handleSubmit} className="relative">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    placeholder="Enter private email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-[#E1D4C2] border border-[#A78D78] px-4 py-3 text-xs text-black placeholder:text-black/60 focus:outline-none focus:border-black transition-colors duration-300 rounded-lg font-medium min-h-[44px]"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#A78D78] text-black font-extrabold text-xs uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 rounded-lg hover:bg-[#6E4738] hover:text-black border border-black min-h-[44px] shrink-0"
                  >
                    {subscribed ? (
                      <>
                        <span>Subscribed</span>
                        <Check className="w-3.5 h-3.5 text-black" />
                      </>
                    ) : (
                      <>
                        <span>Join</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-black" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 py-12 sm:py-16 border-b border-[#A78D78]/40">
          <div className="col-span-2 sm:col-span-2">
            <h4 className="text-[10px] font-sans tracking-[0.25em] uppercase text-black font-extrabold mb-4">
              Prime Studio Offices
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {AGENCY_INFO.offices.map((office) => (
                <div key={office.city} className="space-y-1">
                  <p className="text-xs font-serif font-bold text-black">{office.city}</p>
                  <p className="text-[11px] text-black font-medium">{office.address}</p>
                  <p className="text-[11px] text-black/80 font-mono font-semibold">{office.phone}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-sans tracking-[0.25em] uppercase text-black font-extrabold mb-4">
              Directory
            </h4>
            <ul className="space-y-2.5 text-xs text-black font-semibold">
              <li>
                <Link href="/about" className="hover:text-[#A78D78] transition-colors py-1 inline-block">
                  About &amp; Manifesto
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#A78D78] transition-colors py-1 inline-block">
                  Haute Services
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-[#A78D78] transition-colors py-1 inline-block">
                  Estates &amp; Portfolio
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#A78D78] transition-colors py-1 inline-block">
                  Client Concierge
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-sans tracking-[0.25em] uppercase text-black font-extrabold mb-4">
              Disciplines
            </h4>
            <ul className="space-y-2.5 text-xs text-black font-semibold">
              <li>Off-Market Acquisitions</li>
              <li>Prime Residential Estates</li>
              <li>Pool &amp; Villa Architecture</li>
              <li>Historic Renovations</li>
              <li>3D CGI Digital Twins</li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-sans tracking-[0.25em] uppercase text-black font-extrabold mb-4">
              Presence
            </h4>
            <ul className="space-y-2.5 text-xs text-black font-semibold">
              {AGENCY_INFO.socials.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-[#A78D78] transition-colors py-1"
                  >
                    <span>{s.name}</span>
                    <ArrowUpRight className="w-3 h-3 text-black" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-black font-bold text-center sm:text-left">
          <p>&copy; {new Date().getFullYear()} {AGENCY_INFO.legalName}. All rights reserved.</p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6">
            <span className="hover:text-[#A78D78] cursor-pointer transition-colors">
              Privacy Policy
            </span>
            <span className="hover:text-[#A78D78] cursor-pointer transition-colors">
              Terms of Representation
            </span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-black hover:text-[#A78D78] transition-colors pl-3 sm:pl-4 border-l border-[#A78D78]/40 min-h-[44px]"
              aria-label="Scroll back to top of page"
            >
              <span className="uppercase tracking-[0.2em] text-[10px] font-extrabold">Back to top</span>
              <ArrowUp className="w-3.5 h-3.5 text-black" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
