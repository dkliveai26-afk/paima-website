"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  ChevronRight,
  UserCheck,
  MapPin,
  Mail,
  Phone,
  Activity,
  AlertCircle,
  RefreshCw,
  Plus,
  SlidersHorizontal,
} from "lucide-react";
import { useAdmin } from "./AdminLayoutShell";
import { BookingRecord, BookingStatus } from "@/lib/db-server";

const STATUS_BADGES: Record<
  BookingStatus,
  { label: string; badgeClass: string; dotClass: string }
> = {
  NEW: {
    label: "NEW INQUIRY",
    badgeClass: "bg-[#EAD8D3] text-[#4A3B36] border-[#D8C5BD]",
    dotClass: "bg-[#B3877F]",
  },
  CONTACTED: {
    label: "CONTACTED",
    badgeClass: "bg-[#F2E8E3] text-[#5D4A44] border-[#E5D5C5]",
    dotClass: "bg-[#7D6B64]",
  },
  CONFIRMED: {
    label: "CONFIRMED",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-500",
  },
  COMPLETED: {
    label: "COMPLETED",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
    dotClass: "bg-purple-500",
  },
  CANCELLED: {
    label: "CANCELLED",
    badgeClass: "bg-red-50 text-red-700 border-red-200",
    dotClass: "bg-red-500",
  },
};

export function DashboardOverview() {
  const { showToast, refreshStats, adminUser } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    newInquiries: 0,
    confirmedConsultations: 0,
    completedProjects: 0,
    totalCustomers: 0,
    unreadMessagesCount: 0,
    totalMessages: 0,
    unreadMessages: 0,
    readMessages: 0,
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [errorState, setErrorState] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setErrorState(false);
    try {
      const [bookingsRes, statsRes, actRes] = await Promise.all([
        fetch("/api/admin/bookings?sort=newest"),
        fetch("/api/admin/stats"),
        fetch("/api/admin/activity"),
      ]);

      if (!bookingsRes.ok || !statsRes.ok || !actRes.ok) {
        setErrorState(true);
        if (bookingsRes.status === 401 || bookingsRes.status === 403 || statsRes.status === 401 || statsRes.status === 403 || actRes.status === 401 || actRes.status === 403) {
          showToast("Session Notice", "Your executive session may have expired. Please refresh or authenticate again.", "error");
        } else {
          showToast("Notice", "Unable to load data right now. Please try again.", "error");
        }
        return;
      }

      const bookingsData = await bookingsRes.json();
      const statsData = await statsRes.json();
      const actData = await actRes.json();

      setBookings(bookingsData.bookings || []);
      setStats(statsData.stats || {});
      setActivities(actData.activities || []);
    } catch (err) {
      console.error("Dashboard data load error:", err);
      setErrorState(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setBookings((prev) =>
        prev.map((b) => (b.bookingId === bookingId ? { ...b, status: newStatus } : b))
      );
      showToast("Status Updated", `Booking ${bookingId} marked as ${newStatus}.`, "success");
      refreshStats();
      loadData();
    } catch (err: any) {
      showToast("Update Failed", err.message || "Could not update status", "error");
    }
  };

  const upcomingConsultations = bookings
    .filter((b) => b.preferredDate && b.status !== "CANCELLED")
    .slice(0, 4);

  return (
    <div className="space-y-8">
      {/* 1. WELCOME HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E5D5C5]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B3877F]" />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#B3877F] font-bold">
              ATELIER EXECUTIVE CONSOLE
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1614] mt-1">
            Welcome, {adminUser?.fullName || "Administrator"}
          </h2>
          <p className="text-xs text-[#5D4A44] mt-1">
            Real-time control room for private architectural commissions, clients, and consultations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-[#F7F2EA] hover:bg-[#F2E8E3] text-[#4A3B36] text-xs font-semibold border border-[#E5D5C5] flex items-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#B3877F]" : "text-[#B3877F]"}`} />
            <span>Sync Data</span>
          </button>

          <Link
            href="/dilkhush-admin/bookings"
            className="px-4 py-2 rounded-xl bg-[#1C1614] text-[#FDFBF7] text-xs font-bold shadow-md hover:bg-[#2D2326] transition-all flex items-center gap-2"
          >
            <span>Manage All Bookings</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {errorState && (
        <div className="p-6 rounded-2xl bg-[#F7F2EA] border border-[#E5D5C5] text-center space-y-3 shadow-sm">
          <div className="w-10 h-10 mx-auto rounded-full bg-[#EAD8D3] border border-[#D8C5BD] flex items-center justify-center text-[#4A3B36]">
            <AlertCircle className="w-5 h-5 text-[#B3877F]" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-[#1C1614]">
              Data Service Temporarily Unavailable
            </h3>
            <p className="text-xs text-[#7D6B64] mt-0.5 max-w-md mx-auto">
              Unable to load data right now. Please try again.
            </p>
          </div>
          <div>
            <button
              type="button"
              onClick={loadData}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-[#1C1614] hover:bg-[#2D2326] text-[#FDFBF7] text-xs font-bold transition-all shadow-md inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#B3877F]" : "text-[#B3877F]"}`} />
              <span>Retry</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. REAL KPIS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Bookings */}
        <div className="p-5 rounded-2xl bg-[#F7F2EA] border border-[#E5D5C5] relative overflow-hidden group hover:border-[#D8C5BD] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#7D6B64] font-bold">
              Total Dossiers
            </span>
            <div className="p-2 rounded-xl bg-[#F2E8E3] text-[#4A3B36]">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-[#1C1614] mt-3">
            {stats.totalBookings}
          </p>
          <p className="text-[11px] text-[#7D6B64] mt-1">
            Real inquiries registered in database
          </p>
        </div>

        {/* New Inquiries */}
        <div className="p-5 rounded-2xl bg-[#F7F2EA] border border-[#E5D5C5] relative overflow-hidden group hover:border-[#D8C5BD] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#4A3B36] font-bold">
              New Inquiries
            </span>
            <div className="p-2 rounded-xl bg-[#EAD8D3] text-[#4A3B36] border border-[#D8C5BD]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-[#4A3B36] mt-3">
            {stats.newInquiries}
          </p>
          <p className="text-[11px] text-[#7D6B64] mt-1">
            Awaiting executive review
          </p>
        </div>

        {/* Confirmed Consultations */}
        <div className="p-5 rounded-2xl bg-[#F7F2EA] border border-[#E5D5C5] relative overflow-hidden group hover:border-[#D8C5BD] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-bold">
              Confirmed
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-emerald-800 mt-3">
            {stats.confirmedConsultations}
          </p>
          <p className="text-[11px] text-[#7D6B64] mt-1">
            Scheduled consultations on calendar
          </p>
        </div>

        {/* Completed Commissions */}
        <div className="p-5 rounded-2xl bg-[#F7F2EA] border border-[#E5D5C5] relative overflow-hidden group hover:border-[#D8C5BD] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-purple-700 font-bold">
              Completed
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-purple-800 mt-3">
            {stats.completedProjects}
          </p>
          <p className="text-[11px] text-[#7D6B64] mt-1">
            Delivered architectural projects
          </p>
        </div>
      </div>

      {/* 2b. ENQUIRY / MESSAGES KPI ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Contact Enquiries */}
        <div className="p-5 rounded-2xl bg-[#F7F2EA] border border-[#E5D5C5] relative overflow-hidden group hover:border-[#D8C5BD] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#7D6B64] font-bold">
              Total Enquiries
            </span>
            <div className="p-2 rounded-xl bg-[#F2E8E3] text-[#4A3B36]">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-[#1C1614] mt-3">
            {stats.totalMessages}
          </p>
          <p className="text-[11px] text-[#7D6B64] mt-1">
            Contact form submissions in database
          </p>
        </div>

        {/* Unread Enquiries */}
        <div className="p-5 rounded-2xl bg-[#F7F2EA] border border-[#E5D5C5] relative overflow-hidden group hover:border-[#D8C5BD] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#4A3B36] font-bold">
              Unread
            </span>
            <div className="p-2 rounded-xl bg-[#EAD8D3] text-[#4A3B36] border border-[#D8C5BD]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-[#4A3B36] mt-3">
            {stats.unreadMessages}
          </p>
          <p className="text-[11px] text-[#7D6B64] mt-1">
            Awaiting admin review
          </p>
        </div>

        {/* Read Enquiries */}
        <div className="p-5 rounded-2xl bg-[#F7F2EA] border border-[#E5D5C5] relative overflow-hidden group hover:border-[#D8C5BD] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-bold">
              Read
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-emerald-800 mt-3">
            {stats.readMessages}
          </p>
          <p className="text-[11px] text-[#7D6B64] mt-1">
            Reviewed contact enquiries
          </p>
        </div>
      </div>

      {/* 3. MAIN DASHBOARD CONTENT (2 COLUMNS: RECENT BOOKINGS + UPCOMING & ACTIVITY) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: RECENT BOOKINGS TABLE */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-6 rounded-2xl bg-[#F7F2EA] border border-[#E5D5C5] space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5D5C5]">
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-[#B3877F]" />
                <h3 className="font-serif text-base font-bold text-[#1C1614]">
                  Recent Client Dossiers
                </h3>
              </div>
              <Link
                href="/dilkhush-admin/bookings"
                className="text-xs font-mono text-[#B3877F] hover:text-[#4A3B36] flex items-center gap-1 transition-colors"
              >
                <span>View Full List ({bookings.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-[#7D6B64] font-mono">
                Loading dossiers from database...
              </div>
            ) : bookings.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#F2E8E3] border border-[#D8C5BD] flex items-center justify-center text-[#7D6B64]">
                  <Layers className="w-6 h-6 text-[#B3877F]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1C1614]">No bookings recorded yet</p>
                  <p className="text-xs text-[#7D6B64] mt-0.5">
                    Submissions from the public Contact page will appear here immediately.
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E5D5C5] text-[10px] font-mono text-[#7D6B64] uppercase tracking-wider">
                      <th className="pb-3 font-semibold">Client &amp; ID</th>
                      <th className="pb-3 font-semibold">Service</th>
                      <th className="pb-3 font-semibold">Budget</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Quick Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5D5C5]">
                    {bookings.slice(0, 6).map((b) => {
                      const badge = STATUS_BADGES[b.status] || STATUS_BADGES.NEW;
                      return (
                        <tr key={b.bookingId} className="hover:bg-[#F2E8E3] transition-colors group">
                          <td className="py-3.5 pr-3">
                            <p className="font-bold text-[#1C1614]">{b.fullName}</p>
                            <p className="text-[10px] font-mono text-[#B3877F]">{b.bookingId}</p>
                          </td>
                          <td className="py-3.5 pr-3 text-[#5D4A44]">
                            <p className="truncate max-w-[160px]">{b.service}</p>
                            <p className="text-[10px] text-[#7D6B64]">{b.location}</p>
                          </td>
                          <td className="py-3.5 pr-3 font-mono text-[#4A3B36]">
                            {b.budget}
                          </td>
                          <td className="py-3.5 pr-3">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${badge.badgeClass}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${badge.dotClass}`} />
                              {badge.label}
                            </span>
                          </td>
                          <td className="py-3.5 text-right">
                            <select
                              value={b.status}
                              onChange={(e) =>
                                handleUpdateStatus(b.bookingId, e.target.value as BookingStatus)
                              }
                              className="bg-[#FDFBF7] border border-[#E5D5C5] text-[#1C1614] text-[11px] rounded-lg px-2 py-1 outline-none focus:border-[#B3877F] cursor-pointer"
                            >
                              <option value="NEW">NEW</option>
                              <option value="CONTACTED">CONTACTED</option>
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="COMPLETED">COMPLETED</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: UPCOMING CONSULTATIONS + AUDIT FEED */}
        <div className="lg:col-span-4 space-y-6">
          {/* Upcoming Consultations */}
          <div className="p-6 rounded-2xl bg-[#F7F2EA] border border-[#E5D5C5] space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5D5C5]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#B3877F]" />
                <h3 className="font-serif text-sm font-bold text-[#1C1614]">
                  Upcoming Consultations
                </h3>
              </div>
              <Link
                href="/dilkhush-admin/calendar"
                className="text-[11px] font-mono text-[#B3877F] hover:text-[#4A3B36]"
              >
                Calendar &rarr;
              </Link>
            </div>

            {upcomingConsultations.length === 0 ? (
              <p className="text-xs text-[#7D6B64] py-4 text-center">
                No scheduled consultations yet.
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingConsultations.map((c) => (
                  <div
                    key={c.bookingId}
                    className="p-3 rounded-xl bg-[#F2E8E3] border border-[#E5D5C5] flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#1C1614] truncate">
                        {c.fullName}
                      </p>
                      <p className="text-[10px] text-[#5D4A44] truncate">{c.service}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[11px] font-mono font-bold text-[#4A3B36]">
                        {c.preferredDate}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Administrative Activity */}
          <div className="p-6 rounded-2xl bg-[#F7F2EA] border border-[#E5D5C5] space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5D5C5]">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#B3877F]" />
                <h3 className="font-serif text-sm font-bold text-[#1C1614]">
                  Recent Audit Activity
                </h3>
              </div>
              <Link
                href="/dilkhush-admin/activity"
                className="text-[11px] font-mono text-[#B3877F] hover:text-[#4A3B36]"
              >
                Full Audit &rarr;
              </Link>
            </div>

            {activities.length === 0 ? (
              <p className="text-xs text-[#7D6B64] py-4 text-center">
                No audit activity logged yet.
              </p>
            ) : (
              <div className="space-y-3">
                {activities.slice(0, 4).map((act) => (
                  <div
                    key={act.id}
                    className="p-2.5 rounded-xl bg-[#F2E8E3] border border-[#E5D5C5] space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-[#B3877F] font-bold">{act.action}</span>
                      <span className="text-[#7D6B64]">
                        {new Date(act.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#1C1614] leading-tight">
                      {act.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
