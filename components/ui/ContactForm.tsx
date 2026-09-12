"use client";

import React, { useState } from "react";
import { Check, Send, AlertCircle, Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "Haute Residential Architecture",
    budget: "$250,000 – $500,000",
    location: "",
    preferredDate: "",
    preferredTime: "10:00 AM",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: formData.projectType,
          budget: formData.budget,
          location: formData.location,
          preferredDate: formData.preferredDate,
          preferredTime: formData.preferredTime,
          projectDetails: formData.message,
          message: formData.message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit booking dossier.");
      }

      setBookingId(data.bookingId);
      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const projectTypes = [
    "Haute Residential Architecture",
    "Historic Villa Restoration",
    "Penthouse Interior Transformation",
    "Luxury Hospitality / Commercial",
    "Art Curation & Spatial FF&E",
  ];

  const budgetRanges = [
    "$100,000 – $250,000",
    "$250,000 – $500,000",
    "$500,000 – $1,000,000",
    "$1,000,000+",
  ];

  const timeOptions = [
    "09:00 AM",
    "10:00 AM",
    "11:30 AM",
    "02:00 PM",
    "04:00 PM",
  ];

  if (submitted) {
    return (
      <div className="bg-[#BEB5A9]/60 p-8 sm:p-12 border border-[#A78D78]/50 shadow-2xl text-center space-y-6 rounded-2xl text-black">
        <div className="w-14 h-14 mx-auto rounded-full bg-[#A78D78] text-black border border-black flex items-center justify-center shadow-lg">
          <Check className="w-6 h-6 text-black" />
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-black font-extrabold block">
            DOSSIER CONFIRMED
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-black font-black">
            Inquiry Received with Distinction
          </h3>
        </div>

        {bookingId && (
          <div className="p-4 bg-[#E1D4C2] border border-black rounded-xl max-w-xs mx-auto space-y-1">
            <span className="text-[9px] font-sans uppercase tracking-[0.2em] text-black/70 font-extrabold block">
              BOOKING REFERENCE NUMBER
            </span>
            <span className="font-mono text-base font-black text-black tracking-wider block">
              {bookingId}
            </span>
          </div>
        )}

        <p className="font-sans text-xs sm:text-sm text-black leading-relaxed font-bold max-w-md mx-auto">
          Thank you, {formData.name || "esteemed patron"}. A senior partner from Paima will review your project dossier and connect with you directly.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setBookingId(null);
            setFormData({
              name: "",
              email: "",
              phone: "",
              projectType: "Haute Residential Architecture",
              budget: "$250,000 – $500,000",
              location: "",
              preferredDate: "",
              preferredTime: "10:00 AM",
              message: "",
            });
          }}
          className="text-xs uppercase tracking-[0.2em] text-black hover:text-[#A78D78] transition-colors duration-300 font-extrabold"
        >
          Submit Another Inquiry &rarr;
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#BEB5A9]/50 p-8 sm:p-12 border border-[#A78D78]/50 shadow-2xl space-y-8 rounded-2xl text-black"
    >
      <div className="border-b border-[#A78D78]/50 pb-4">
        <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-black font-extrabold">
          CONFIDENTIAL CONSULTATION DOSSIER
        </span>
        <h3 className="font-serif text-2xl text-black mt-1 font-bold">
          Initiate Dialogue
        </h3>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-900 rounded-xl text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-700" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Name */}
      <div className="space-y-2">
        <label htmlFor="contact-name" className="text-[10px] uppercase font-sans tracking-[0.18em] text-black font-extrabold block">
          Full Name &amp; Title *
        </label>
        <input
          type="text"
          id="contact-name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-[#E1D4C2] border border-[#A78D78] px-4 py-3 text-xs text-black placeholder:text-black/60 focus:outline-none focus:border-black transition-all duration-300 rounded-lg font-bold"
          placeholder="e.g. Eleanor Vance"
        />
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="contact-email" className="text-[10px] uppercase font-sans tracking-[0.18em] text-black font-extrabold block">
            Email Address *
          </label>
          <input
            type="email"
            id="contact-email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-[#E1D4C2] border border-[#A78D78] px-4 py-3 text-xs text-black placeholder:text-black/60 focus:outline-none focus:border-black transition-all duration-300 rounded-lg font-bold"
            placeholder="patron@domain.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="contact-phone" className="text-[10px] uppercase font-sans tracking-[0.18em] text-black font-extrabold block">
            Direct Telephone
          </label>
          <input
            type="tel"
            id="contact-phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full bg-[#E1D4C2] border border-[#A78D78] px-4 py-3 text-xs text-black placeholder:text-black/60 focus:outline-none focus:border-black transition-all duration-300 rounded-lg font-bold"
            placeholder="+1 (555) 000-0000"
          />
        </div>
      </div>

      {/* Preferred Consultation Date & Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="contact-date" className="text-[10px] uppercase font-sans tracking-[0.18em] text-black font-extrabold flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-black" />
            <span>Preferred Date</span>
          </label>
          <input
            type="date"
            id="contact-date"
            value={formData.preferredDate}
            onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
            className="w-full bg-[#E1D4C2] border border-[#A78D78] px-4 py-3 text-xs text-black focus:outline-none focus:border-black transition-all duration-300 rounded-lg font-bold"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="contact-time" className="text-[10px] uppercase font-sans tracking-[0.18em] text-black font-extrabold flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-black" />
            <span>Preferred Time Slot</span>
          </label>
          <select
            id="contact-time"
            value={formData.preferredTime}
            onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
            className="w-full bg-[#E1D4C2] border border-[#A78D78] px-4 py-3 text-xs text-black focus:outline-none focus:border-black transition-all duration-300 rounded-lg font-bold cursor-pointer"
          >
            {timeOptions.map((t) => (
              <option key={t} value={t} className="bg-[#E1D4C2] text-black font-bold">
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Project Typology */}
      <div className="space-y-2">
        <label className="text-[10px] font-sans uppercase tracking-[0.18em] text-black font-extrabold block">
          Project Typology *
        </label>
        <select
          value={formData.projectType}
          onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
          className="w-full bg-[#E1D4C2] border border-[#A78D78] px-4 py-3 text-xs text-black focus:outline-none focus:border-black transition-all duration-300 cursor-pointer rounded-lg font-bold"
        >
          {projectTypes.map((type) => (
            <option key={type} value={type} className="bg-[#E1D4C2] text-black font-bold">
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Investment Allocation */}
      <div className="space-y-2">
        <label className="text-[10px] font-sans uppercase tracking-[0.18em] text-black font-extrabold block">
          Anticipated Investment Allocation
        </label>
        <div className="grid grid-cols-2 gap-2">
          {budgetRanges.map((b) => (
            <button
              type="button"
              key={b}
              onClick={() => setFormData({ ...formData, budget: b })}
              className={cn(
                "px-3 py-2.5 text-[11px] font-sans transition-all duration-300 text-left border rounded-lg focus:outline-none",
                formData.budget === b
                  ? "bg-[#A78D78] text-black border-black font-extrabold shadow-md"
                  : "bg-[#E1D4C2] text-black border-[#A78D78]/50 hover:border-black font-bold"
              )}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label htmlFor="contact-loc" className="text-[10px] uppercase font-sans tracking-[0.18em] text-black font-extrabold block">
          Property Location
        </label>
        <input
          type="text"
          id="contact-loc"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="w-full bg-[#E1D4C2] border border-[#A78D78] px-4 py-3 text-xs text-black placeholder:text-black/60 focus:outline-none focus:border-black transition-all duration-300 rounded-lg font-bold"
          placeholder="e.g. Tribeca, NY / Saint-Germain, Paris"
        />
      </div>

      {/* Message */}
      <div className="space-y-2">
        <label htmlFor="contact-message" className="text-[10px] uppercase font-sans tracking-[0.18em] text-black font-extrabold block">
          Project Brief &amp; Vision *
        </label>
        <textarea
          id="contact-message"
          rows={4}
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full bg-[#E1D4C2] border border-[#A78D78] px-4 pt-4 pb-2 text-xs text-black placeholder:text-black/60 focus:outline-none focus:border-black transition-all duration-300 resize-none rounded-lg font-bold"
          placeholder="Describe your architectural aspirations, preferred timeline, or material sensibilities..."
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-4 px-8 bg-[#A78D78] text-black hover:bg-[#BEB5A9] text-xs uppercase tracking-[0.2em] font-extrabold transition-all duration-300 flex items-center justify-center gap-3 rounded-full shadow-xl group focus:outline-none border border-black disabled:opacity-50"
      >
        {submitting ? (
          <span>Transmitting Confidential Brief...</span>
        ) : (
          <>
            <span>Submit Dossier For Consideration</span>
            <Send className="w-3.5 h-3.5 text-black transition-transform duration-300 group-hover:translate-x-1" />
          </>
        )}
      </button>

      <p className="text-[10px] text-black text-center font-bold">
        All client correspondence is protected by strict international non-disclosure protocols.
      </p>
    </form>
  );
}
