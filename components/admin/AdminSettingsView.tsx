"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  MapPin,
  Save,
  CheckCircle2,
  ShieldCheck,
  Building,
  Mail,
  Phone,
  Clock,
  RefreshCw,
  User,
  Compass,
} from "lucide-react";
import { useAdmin } from "./AdminLayoutShell";
import { SiteSettingsRecord } from "@/lib/db-server";

export function AdminSettingsView() {
  const { showToast, adminUser } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettingsRecord>({
    studioName: "PAIMA Architectural Studio",
    legalName: "Paima Luxury Interiors & Prime Real Estate Group",
    tagline: "Ultra-Prime Real Estate & Bespoke Spatial Architecture",
    email: "concierge@paimadesign.com",
    phone: "+1 (212) 890-4100",
    primaryAddress: "575 Madison Avenue, Upper East Side, New York, NY 10022",
    city: "New York",
    state: "NY",
    country: "United States",
    latitude: 40.7614,
    longitude: -73.9719,
    zoom: 16,
    operatingHours: "Monday – Friday • 09:00 – 18:00 EST / CET",
    updatedAt: "",
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      const data = await res.json();
      if (data.settings) {
        setSettings(data.settings);
      }
    } catch (err: any) {
      showToast("Error", err.message || "Failed to load studio settings", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error("Failed to save settings");

      const data = await res.json();
      setSettings(data.settings);
      showToast("Settings Saved", "Studio contact & map settings updated successfully.", "success");
    } catch (err: any) {
      showToast("Save Error", err.message || "Could not save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E5D5C5]">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#B3877F]" />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#B3877F] font-bold">
              SYSTEM CONFIGURATION
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1C1614] mt-1">
            Studio, Location &amp; Map Settings
          </h2>
          <p className="text-xs text-[#5D4A44] mt-0.5">
            Manage primary studio coordinates, contact records, and administrative security credentials.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchSettings}
          className="px-3.5 py-2 rounded-xl bg-[#F7F2EA] hover:bg-[#F2E8E3] text-[#4A3B36] text-xs font-semibold border border-[#E5D5C5] flex items-center gap-2 transition-all cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#B3877F]" : "text-[#B3877F]"}`} />
          <span>Reload</span>
        </button>
      </div>

      {/* 2. MAIN FORM */}
      <form onSubmit={handleSave} className="space-y-8">
        {/* SECTION A: STUDIO CONTACT & LEGAL */}
        <div className="p-6 rounded-2xl bg-[#F7F2EA] border border-[#E5D5C5] space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#E5D5C5]">
            <Building className="w-4 h-4 text-[#B3877F]" />
            <h3 className="font-serif text-base font-bold text-[#1C1614]">
              Studio Identity &amp; Contact Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-[#7D6B64]">Studio Brand Name</label>
              <input
                type="text"
                value={settings.studioName}
                onChange={(e) => setSettings({ ...settings, studioName: e.target.value })}
                className="w-full bg-[#FDFBF7] border border-[#E5D5C5] rounded-xl px-3.5 py-2.5 text-[#1C1614] outline-none focus:border-[#B3877F]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-[#7D6B64]">Direct Inquiries Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full bg-[#FDFBF7] border border-[#E5D5C5] rounded-xl px-3.5 py-2.5 text-[#1C1614] outline-none focus:border-[#B3877F]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-[#7D6B64]">Telephone Hotline</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full bg-[#FDFBF7] border border-[#E5D5C5] rounded-xl px-3.5 py-2.5 text-[#1C1614] outline-none focus:border-[#B3877F]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-[#7D6B64]">Operating Hours</label>
              <input
                type="text"
                value={settings.operatingHours}
                onChange={(e) => setSettings({ ...settings, operatingHours: e.target.value })}
                className="w-full bg-[#FDFBF7] border border-[#E5D5C5] rounded-xl px-3.5 py-2.5 text-[#1C1614] outline-none focus:border-[#B3877F]"
              />
            </div>
          </div>
        </div>

        {/* SECTION B: STUDIO LOCATION & GOOGLE MAPS SETTINGS */}
        <div className="p-6 rounded-2xl bg-[#F7F2EA] border border-[#E5D5C5] space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#E5D5C5]">
            <MapPin className="w-4 h-4 text-[#B3877F]" />
            <h3 className="font-serif text-base font-bold text-[#1C1614]">
              Primary Studio Location &amp; Map Coordinates
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[10px] font-mono uppercase text-[#7D6B64]">Primary Street Address</label>
              <input
                type="text"
                value={settings.primaryAddress}
                onChange={(e) => setSettings({ ...settings, primaryAddress: e.target.value })}
                className="w-full bg-[#FDFBF7] border border-[#E5D5C5] rounded-xl px-3.5 py-2.5 text-[#1C1614] outline-none focus:border-[#B3877F]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-[#7D6B64]">City</label>
              <input
                type="text"
                value={settings.city}
                onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                className="w-full bg-[#FDFBF7] border border-[#E5D5C5] rounded-xl px-3.5 py-2.5 text-[#1C1614] outline-none focus:border-[#B3877F]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-[#7D6B64]">Country</label>
              <input
                type="text"
                value={settings.country}
                onChange={(e) => setSettings({ ...settings, country: e.target.value })}
                className="w-full bg-[#FDFBF7] border border-[#E5D5C5] rounded-xl px-3.5 py-2.5 text-[#1C1614] outline-none focus:border-[#B3877F]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-[#7D6B64]">
                Google Maps Latitude
              </label>
              <input
                type="number"
                step="0.000001"
                value={settings.latitude}
                onChange={(e) => setSettings({ ...settings, latitude: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#FDFBF7] border border-[#E5D5C5] rounded-xl px-3.5 py-2.5 text-[#1C1614] outline-none focus:border-[#B3877F]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-[#7D6B64]">
                Google Maps Longitude
              </label>
              <input
                type="number"
                step="0.000001"
                value={settings.longitude}
                onChange={(e) => setSettings({ ...settings, longitude: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#FDFBF7] border border-[#E5D5C5] rounded-xl px-3.5 py-2.5 text-[#1C1614] outline-none focus:border-[#B3877F]"
              />
            </div>
          </div>
        </div>

        {/* SECTION C: AUTHENTICATED ADMINISTRATOR ACCOUNT & SECURITY */}
        <div className="p-6 rounded-2xl bg-[#F7F2EA] border border-[#E5D5C5] space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#E5D5C5]">
            <ShieldCheck className="w-4 h-4 text-[#B3877F]" />
            <h3 className="font-serif text-base font-bold text-[#1C1614]">
              Executive Administrator Account (Clerk Security)
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-[#FDFBF7] border border-[#E5D5C5]">
            {adminUser?.imageUrl ? (
              <img
                src={adminUser.imageUrl}
                alt=""
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-2xl object-cover border border-[#E5D5C5]"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-[#F2E8E3] border border-[#E5D5C5] flex items-center justify-center text-[#4A3B36] font-serif text-xl font-bold">
                {adminUser?.fullName?.charAt(0) || "A"}
              </div>
            )}

            <div className="space-y-1 text-xs">
              <p className="font-serif text-base font-bold text-[#1C1614]">
                {adminUser?.fullName || "Designated Administrator"}
              </p>
              <p className="font-mono text-[#4A3B36]">
                {adminUser?.userEmail || "Administrator"}
              </p>
              <div className="flex items-center gap-2 text-[10px] font-mono text-[#7D6B64] pt-1">
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  CLERK AUTHENTICATED
                </span>
                <span>User ID: {adminUser?.userId || "clerk_user_id"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-[#1C1614] text-[#FDFBF7] hover:bg-[#2D2326] text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Persisting Settings..." : "Save Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
