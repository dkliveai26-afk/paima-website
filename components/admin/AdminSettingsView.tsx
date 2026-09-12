"use client";

import React, { useState } from "react";
import {
  Settings,
  User,
  Bell,
  Sliders,
  Shield,
  Clock,
  Save,
  CheckCircle2,
  Lock,
  Globe,
  SlidersHorizontal,
  Mail,
  Smartphone,
  Layers,
  Sparkles,
} from "lucide-react";
import { useAdmin } from "./AdminLayoutShell";

type SettingsTab =
  | "PROFILE"
  | "PREFERENCES"
  | "NOTIFICATIONS"
  | "BOOKINGS"
  | "SECURITY";

export function AdminSettingsView() {
  const { showToast } = useAdmin();
  const [activeTab, setActiveTab] = useState<SettingsTab>("PROFILE");

  // Profile Form State
  const [profile, setProfile] = useState({
    fullName: "Dilkhush Kumar",
    email: "d.klive.ai26@gmail.com",
    title: "Principal Architect & Studio Director",
    phone: "+33 1 42 68 00 00",
    timezone: "Europe/Paris (CET)",
    bio: "Supervising high-end private residences, prime estate acquisitions, and bespoke architectural interior staging across Europe, Americas, and Asia.",
  });

  // Notification Preferences State
  const [notifications, setNotifications] = useState({
    emailNewInquiry: true,
    emailStatusChange: true,
    smsVipAlert: true,
    dailyDigest: false,
    calendarReminderMinutes: "30",
  });

  // Booking System Settings State
  const [bookingConfig, setBookingConfig] = useState({
    consultationLeadDays: "3",
    consultationDurationHours: "2",
    autoAcknowledge: true,
    allowWeekendSlots: false,
    maxConcurrentInquiries: "10",
    primaryCurrency: "USD ($)",
  });

  // Preferences State
  const [preferences, setPreferences] = useState({
    density: "comfortable",
    defaultTab: "overview",
    themeAccent: "gold",
  });

  // Security State
  const [securitySettings, setSecuritySettings] = useState({
    enforce2FA: true,
    ipWhitelist: false,
    sessionTimeoutHours: "12",
  });

  const handleSave = (section: string) => {
    showToast(
      "Settings Saved",
      `${section} settings have been updated successfully (UI Prototype).`,
      "success"
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#1E232E]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-wide">
            Settings &amp; Preferences
          </h2>
          <p className="text-xs text-gray-400 font-sans mt-0.5">
            Configure private administrator profile, notifications, booking rules, and security.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-[#161B23] border border-[#262F3F] text-gray-300">
            Clerk Authentication Connected
          </span>
        </div>
      </div>

      {/* 2. TABBED SETTINGS CONTAINER */}
      <div className="bg-[#12161F] border border-[#1E2533] rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        {/* LEFT NAV TABS */}
        <div className="md:col-span-4 lg:col-span-3 border-r border-[#1E2533] p-4 bg-[#0F1217] space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 font-bold px-3 block mb-2">
            ADMIN CONFIGURATION
          </span>

          {[
            { id: "PROFILE", label: "Admin Profile", icon: User },
            { id: "PREFERENCES", label: "Console Preferences", icon: SlidersHorizontal },
            { id: "NOTIFICATIONS", label: "Alerts & Notifications", icon: Bell },
            { id: "BOOKINGS", label: "Booking System Rules", icon: Clock },
            { id: "SECURITY", label: "Security & Access", icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${
                  isActive
                    ? "bg-[#1E2533] text-white font-semibold border border-[#2D374B] shadow-inner"
                    : "text-gray-400 hover:text-white hover:bg-[#161B23]"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-[#D4AF37]" : "text-gray-400"
                  }`}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* RIGHT CONTENT PANEL */}
        <div className="md:col-span-8 lg:col-span-9 p-6 overflow-y-auto">
          {/* TAB 1: PROFILE */}
          {activeTab === "PROFILE" && (
            <div className="space-y-5 animate-in fade-in">
              <div className="pb-3 border-b border-[#1E2533]">
                <h3 className="text-base font-bold text-white font-serif">
                  Administrator Profile
                </h3>
                <p className="text-xs text-gray-400 font-sans mt-0.5">
                  Update your contact card and credentials displayed across the private dashboard.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1E2533] to-[#2E394E] border border-[#3E4C66] text-[#D4AF37] font-mono text-xl font-bold flex items-center justify-center shadow-lg">
                  DK
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {profile.fullName}
                  </h4>
                  <p className="text-xs text-[#D4AF37] font-mono">{profile.title}</p>
                  <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                    {profile.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-[11px] font-mono text-gray-300 block mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) =>
                      setProfile({ ...profile, fullName: e.target.value })
                    }
                    className="w-full bg-[#181E29] border border-[#283244] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-gray-300 block mb-1">
                    Email Address (Admin Designated)
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className="w-full bg-[#181E29] border border-[#283244] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-gray-300 block mb-1">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    value={profile.title}
                    onChange={(e) =>
                      setProfile({ ...profile, title: e.target.value })
                    }
                    className="w-full bg-[#181E29] border border-[#283244] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-gray-300 block mb-1">
                    Direct Phone Line
                  </label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    className="w-full bg-[#181E29] border border-[#283244] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-gray-300 block mb-1">
                  Executive Studio Bio
                </label>
                <textarea
                  rows={3}
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  className="w-full bg-[#181E29] border border-[#283244] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleSave("Profile")}
                  className="bg-gradient-to-r from-[#D4AF37] to-[#B38F2B] hover:from-[#E5C358] hover:to-[#C29E37] text-black font-bold text-xs px-4 py-2 rounded-xl shadow flex items-center gap-1.5 transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PREFERENCES */}
          {activeTab === "PREFERENCES" && (
            <div className="space-y-5 animate-in fade-in">
              <div className="pb-3 border-b border-[#1E232E]">
                <h3 className="text-base font-bold text-white font-serif">
                  Console Preferences
                </h3>
                <p className="text-xs text-gray-400 font-sans mt-0.5">
                  Customize the layout density, default entry view, and visual tokens.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#181E29] border border-[#283244]">
                  <div>
                    <span className="font-semibold text-white block">
                      Table Density
                    </span>
                    <span className="text-gray-400 text-[11px]">
                      Control the vertical spacing of booking and customer tables
                    </span>
                  </div>
                  <select
                    value={preferences.density}
                    onChange={(e) =>
                      setPreferences({ ...preferences, density: e.target.value })
                    }
                    className="bg-[#12161F] border border-[#2D384D] rounded-lg px-2.5 py-1 text-xs text-white"
                  >
                    <option value="comfortable">Comfortable</option>
                    <option value="compact">Compact</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#181E29] border border-[#283244]">
                  <div>
                    <span className="font-semibold text-white block">
                      Primary Currency Format
                    </span>
                    <span className="text-gray-400 text-[11px]">
                      Display monetary amounts in USD ($), EUR (€), or GBP (£)
                    </span>
                  </div>
                  <select
                    value={bookingConfig.primaryCurrency}
                    onChange={(e) =>
                      setBookingConfig({
                        ...bookingConfig,
                        primaryCurrency: e.target.value,
                      })
                    }
                    className="bg-[#12161F] border border-[#2D384D] rounded-lg px-2.5 py-1 text-xs text-white"
                  >
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                    <option>CHF (Fr.)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleSave("Preferences")}
                  className="bg-gradient-to-r from-[#D4AF37] to-[#B38F2B] text-black font-bold text-xs px-4 py-2 rounded-xl shadow flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Preferences</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: NOTIFICATIONS */}
          {activeTab === "NOTIFICATIONS" && (
            <div className="space-y-5 animate-in fade-in">
              <div className="pb-3 border-b border-[#1E232E]">
                <h3 className="text-base font-bold text-white font-serif">
                  Alerts &amp; Notification Rules
                </h3>
                <p className="text-xs text-gray-400 font-sans mt-0.5">
                  Manage real-time communication channels for incoming private client inquiries.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  {
                    key: "emailNewInquiry",
                    label: "Email Alert on New Booking Intake",
                    desc: "Receive instant email dispatched to admin address when client submits an inquiry",
                  },
                  {
                    key: "emailStatusChange",
                    label: "Booking Status Updates Digest",
                    desc: "Notify admin team when appointment is confirmed or completed",
                  },
                  {
                    key: "smsVipAlert",
                    label: "VIP Client Priority SMS Alert",
                    desc: "Send high-priority SMS ping for projects with budgets exceeding $500,000",
                  },
                  {
                    key: "dailyDigest",
                    label: "Morning Studio Briefing Digest (08:00 CET)",
                    desc: "Consolidated morning summary of scheduled site surveys and inquiries",
                  },
                ].map((item) => {
                  const isChecked = (notifications as any)[item.key];

                  return (
                    <div
                      key={item.key}
                      onClick={() =>
                        setNotifications({
                          ...notifications,
                          [item.key]: !isChecked,
                        })
                      }
                      className="flex items-center justify-between p-3.5 rounded-xl bg-[#181E29] border border-[#283244] cursor-pointer hover:border-[#3A4860] transition-colors"
                    >
                      <div>
                        <span className="font-semibold text-white block">
                          {item.label}
                        </span>
                        <span className="text-gray-400 text-[11px]">
                          {item.desc}
                        </span>
                      </div>

                      <div
                        className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${
                          isChecked ? "bg-[#D4AF37]" : "bg-gray-700"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full bg-black absolute top-0.5 transition-transform ${
                            isChecked ? "left-5" : "left-0.5"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleSave("Notifications")}
                  className="bg-gradient-to-r from-[#D4AF37] to-[#B38F2B] text-black font-bold text-xs px-4 py-2 rounded-xl shadow flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Notification Rules</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: BOOKING RULES */}
          {activeTab === "BOOKINGS" && (
            <div className="space-y-5 animate-in fade-in">
              <div className="pb-3 border-b border-[#1E232E]">
                <h3 className="text-base font-bold text-white font-serif">
                  Booking System Rules
                </h3>
                <p className="text-xs text-gray-400 font-sans mt-0.5">
                  Define consultation lead times, appointment durations, and scheduling parameters.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-[11px] font-mono text-gray-300 block mb-1">
                    Minimum Advance Notice (Days)
                  </label>
                  <input
                    type="number"
                    value={bookingConfig.consultationLeadDays}
                    onChange={(e) =>
                      setBookingConfig({
                        ...bookingConfig,
                        consultationLeadDays: e.target.value,
                      })
                    }
                    className="w-full bg-[#181E29] border border-[#283244] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-gray-300 block mb-1">
                    Default Consultation Slot (Hours)
                  </label>
                  <input
                    type="number"
                    value={bookingConfig.consultationDurationHours}
                    onChange={(e) =>
                      setBookingConfig({
                        ...bookingConfig,
                        consultationDurationHours: e.target.value,
                      })
                    }
                    className="w-full bg-[#181E29] border border-[#283244] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div
                  onClick={() =>
                    setBookingConfig({
                      ...bookingConfig,
                      autoAcknowledge: !bookingConfig.autoAcknowledge,
                    })
                  }
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#181E29] border border-[#283244] cursor-pointer"
                >
                  <div>
                    <span className="font-semibold text-white block">
                      Automated Client Intake Acknowledgment
                    </span>
                    <span className="text-gray-400 text-[11px]">
                      Send automated concierge email confirmation immediately upon submission
                    </span>
                  </div>
                  <div
                    className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${
                      bookingConfig.autoAcknowledge ? "bg-[#D4AF37]" : "bg-gray-700"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full bg-black absolute top-0.5 transition-transform ${
                        bookingConfig.autoAcknowledge ? "left-5" : "left-0.5"
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleSave("Booking Rules")}
                  className="bg-gradient-to-r from-[#D4AF37] to-[#B38F2B] text-black font-bold text-xs px-4 py-2 rounded-xl shadow flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Booking Rules</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: SECURITY */}
          {activeTab === "SECURITY" && (
            <div className="space-y-5 animate-in fade-in">
              <div className="pb-3 border-b border-[#1E232E]">
                <h3 className="text-base font-bold text-white font-serif">
                  Security &amp; Clerk Authentication Status
                </h3>
                <p className="text-xs text-gray-400 font-sans mt-0.5">
                  Route protection, authentication tokens, and session integrity.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">
                    Clerk Authentication Shield Ready
                  </h4>
                  <p className="text-[11px] text-gray-300 leading-relaxed mt-0.5">
                    The private admin route structure is prepared to integrate with Clerk server-side verification in the next backend phase without touching public components.
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#181E29] border border-[#283244]">
                  <div>
                    <span className="font-semibold text-white block">
                      Enforce Multi-Factor Authentication (MFA)
                    </span>
                    <span className="text-gray-400 text-[11px]">
                      Require hardware key or TOTP code upon admin dashboard sign-in
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#181E29] border border-[#283244]">
                  <div>
                    <span className="font-semibold text-white block">
                      Admin Session Inactivity Timeout
                    </span>
                    <span className="text-gray-400 text-[11px]">
                      Automatically lock console after 12 hours of inactivity
                    </span>
                  </div>
                  <span className="font-mono text-gray-300 text-xs">12 Hours</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleSave("Security")}
                  className="bg-gradient-to-r from-[#D4AF37] to-[#B38F2B] text-black font-bold text-xs px-4 py-2 rounded-xl shadow flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Security Policy</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
