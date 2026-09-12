"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  MapPin,
  DollarSign,
  Phone,
  Mail,
  X,
  Layers,
} from "lucide-react";
import {
  INITIAL_BOOKINGS,
  INITIAL_KPIS,
  Booking,
  BookingStatus,
} from "./admin-mock-data";
import { useAdmin } from "./AdminLayoutShell";

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; badgeClass: string; dotClass: string }
> = {
  NEW: {
    label: "NEW INQUIRY",
    badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    dotClass: "bg-amber-400",
  },
  CONTACTED: {
    label: "CONTACTED",
    badgeClass: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    dotClass: "bg-blue-400",
  },
  CONFIRMED: {
    label: "CONFIRMED",
    badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    dotClass: "bg-emerald-400",
  },
  COMPLETED: {
    label: "COMPLETED",
    badgeClass: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    dotClass: "bg-purple-400",
  },
  CANCELLED: {
    label: "CANCELLED",
    badgeClass: "bg-red-500/15 text-red-400 border-red-500/30",
    dotClass: "bg-red-400",
  },
};

export function DashboardOverview() {
  const { showToast } = useAdmin();
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Filtered recent bookings
  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === "ALL") return true;
    return b.status === statusFilter;
  });

  const handleUpdateStatus = (bookingId: string, newStatus: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: newStatus,
              updatedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
            }
          : b
      )
    );
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    showToast(
      "Status Updated",
      `Booking ${bookingId} marked as ${newStatus}.`,
      "success"
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP TITLE & INTRO */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#1E232E]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-wide">
            Dashboard
          </h2>
          <p className="text-xs text-gray-400 font-sans mt-0.5">
            Overview of your private inquiries and project activity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161B23] border border-[#262F3F] text-[11px] font-mono text-gray-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live System Active
          </span>
        </div>
      </div>

      {/* 2. OVERVIEW KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL BOOKINGS */}
        <div className="bg-[#12161F] border border-[#1E2533] hover:border-[#2C374D] p-5 rounded-2xl shadow-lg transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-full blur-2xl group-hover:bg-[#D4AF37]/10 transition-all pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#A0A6B5] font-bold">
              TOTAL BOOKINGS
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#1A202C] text-[#D4AF37] flex items-center justify-center border border-[#2A3447]">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-serif">
              {INITIAL_KPIS.totalBookings.value}
            </span>
            <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              {INITIAL_KPIS.totalBookings.change}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1 font-sans">
            {INITIAL_KPIS.totalBookings.period}
          </p>
        </div>

        {/* NEW INQUIRIES */}
        <div className="bg-[#12161F] border border-[#1E2533] hover:border-amber-500/30 p-5 rounded-2xl shadow-lg transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#A0A6B5] font-bold">
              NEW INQUIRIES
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-serif">
              {INITIAL_KPIS.newInquiries.value}
            </span>
            <span className="text-[11px] font-mono text-amber-400 font-semibold px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
              {INITIAL_KPIS.newInquiries.change}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1 font-sans">
            {INITIAL_KPIS.newInquiries.period}
          </p>
        </div>

        {/* CONFIRMED */}
        <div className="bg-[#12161F] border border-[#1E2533] hover:border-emerald-500/30 p-5 rounded-2xl shadow-lg transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#A0A6B5] font-bold">
              CONFIRMED
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-serif">
              {INITIAL_KPIS.confirmedProjects.value}
            </span>
            <span className="text-[11px] font-mono text-emerald-400 font-semibold">
              {INITIAL_KPIS.confirmedProjects.change}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1 font-sans">
            {INITIAL_KPIS.confirmedProjects.period}
          </p>
        </div>

        {/* COMPLETED */}
        <div className="bg-[#12161F] border border-[#1E2533] hover:border-purple-500/30 p-5 rounded-2xl shadow-lg transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#A0A6B5] font-bold">
              COMPLETED
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-serif">
              {INITIAL_KPIS.completedEstates.value}
            </span>
            <span className="text-[11px] font-mono text-purple-400 font-semibold">
              99.4% CSAT
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1 font-sans">
            {INITIAL_KPIS.completedEstates.period}
          </p>
        </div>
      </div>

      {/* 3. RECENT BOOKINGS SECTION */}
      <div className="bg-[#12161F] border border-[#1E2533] rounded-2xl shadow-xl overflow-hidden">
        {/* SECTION HEADER */}
        <div className="p-4 sm:p-5 border-b border-[#1E2533] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white font-serif">
                Recent Bookings
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1E2533] text-gray-300">
                {filteredBookings.length} Inquiries
              </span>
            </div>
            <p className="text-xs text-gray-400 font-sans mt-0.5">
              Direct consultations &amp; project appointments requested by private clients.
            </p>
          </div>

          {/* STATUS FILTER PILLS & VIEW ALL LINK */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-[#181E29] border border-[#263143] rounded-xl p-0.5">
              {["ALL", "NEW", "CONTACTED", "CONFIRMED"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`text-[10px] font-mono px-2.5 py-1 rounded-lg transition-all font-bold ${
                    statusFilter === filter
                      ? "bg-[#252E3E] text-white shadow-sm"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <Link
              href="/dilkhush-admin/bookings"
              className="inline-flex items-center gap-1 text-xs font-mono text-[#D4AF37] hover:text-[#F3D77B] px-3 py-1.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 transition-colors"
            >
              <span>View all bookings</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#0D1016] text-[10px] font-mono uppercase tracking-wider text-gray-400 border-b border-[#1E2533]">
              <tr>
                <th className="py-3.5 px-4 font-bold">Booking ID</th>
                <th className="py-3.5 px-4 font-bold">Client</th>
                <th className="py-3.5 px-4 font-bold hidden md:table-cell">
                  Service
                </th>
                <th className="py-3.5 px-4 font-bold hidden lg:table-cell">
                  Preferred Date
                </th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold hidden sm:table-cell">
                  Created
                </th>
                <th className="py-3.5 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181F2B]">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-400 font-sans">
                    <p className="text-sm font-semibold">No bookings found</p>
                    <p className="text-xs text-gray-500 mt-1">
                      No records match the current status filter.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredBookings.slice(0, 5).map((booking) => {
                  const statusConf = STATUS_CONFIG[booking.status];

                  return (
                    <tr
                      key={booking.id}
                      className="hover:bg-[#161B24] transition-colors group"
                    >
                      {/* ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-white text-xs">
                        <span className="group-hover:text-[#D4AF37] transition-colors">
                          {booking.id}
                        </span>
                        {booking.isVip && (
                          <span className="ml-1.5 inline-block text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            VIP
                          </span>
                        )}
                      </td>

                      {/* CLIENT */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">
                          {booking.clientName}
                        </div>
                        <div className="text-[11px] text-gray-400 font-mono">
                          {booking.clientEmail}
                        </div>
                      </td>

                      {/* SERVICE */}
                      <td className="py-3.5 px-4 hidden md:table-cell">
                        <span className="inline-block max-w-[180px] truncate text-gray-200">
                          {booking.service}
                        </span>
                        <div className="text-[10px] text-gray-500 truncate">
                          {booking.propertyType}
                        </div>
                      </td>

                      {/* PREFERRED DATE */}
                      <td className="py-3.5 px-4 hidden lg:table-cell font-mono text-gray-300">
                        <div>{booking.preferredDate}</div>
                        <div className="text-[10px] text-gray-500">
                          {booking.preferredTime}
                        </div>
                      </td>

                      {/* STATUS BADGE */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider border ${statusConf.badgeClass}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${statusConf.dotClass}`}
                          />
                          {statusConf.label}
                        </span>
                      </td>

                      {/* CREATED */}
                      <td className="py-3.5 px-4 hidden sm:table-cell font-mono text-[11px] text-gray-400">
                        {booking.createdAt}
                      </td>

                      {/* ACTION */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedBooking(booking)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1D2433] hover:bg-[#283246] text-gray-200 hover:text-white text-xs font-mono transition-colors border border-[#2B364A]"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. LOWER ACTIVITY & QUICK CALENDAR OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* PIPELINE & SERVICE BREAKDOWN */}
        <div className="bg-[#12161F] border border-[#1E2533] p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E2533]">
            <h4 className="text-xs font-mono uppercase tracking-[0.15em] text-gray-300 font-bold">
              Inquiry Pipeline Volume
            </h4>
            <span className="text-[10px] font-mono text-[#D4AF37] font-bold">
              {INITIAL_KPIS.pipelineValue}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {[
              {
                service: "Haute Architectural Interior",
                percentage: 42,
                color: "bg-[#D4AF37]",
              },
              {
                service: "Private Residence Renovation",
                percentage: 28,
                color: "bg-emerald-400",
              },
              {
                service: "Luxury Penthouse Staging",
                percentage: 18,
                color: "bg-blue-400",
              },
              {
                service: "Bespoke Estate Advisory",
                percentage: 12,
                color: "bg-purple-400",
              },
            ].map((item) => (
              <div key={item.service} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-300 truncate max-w-[200px]">
                    {item.service}
                  </span>
                  <span className="font-mono text-gray-400 font-semibold">
                    {item.percentage}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#181E29] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* UPCOMING SITE VISITS */}
        <div className="bg-[#12161F] border border-[#1E2533] p-5 rounded-2xl shadow-lg lg:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E2533]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
              <h4 className="text-xs font-mono uppercase tracking-[0.15em] text-gray-300 font-bold">
                Upcoming Consultations &amp; Site Surveys
              </h4>
            </div>
            <Link
              href="/dilkhush-admin/calendar"
              className="text-[10px] font-mono text-[#D4AF37] hover:underline"
            >
              Calendar Schedule →
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-[#161B24] border border-[#232B3A] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#D4AF37] font-bold">
                  SEP 24 • 14:30 CET
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  NEW
                </span>
              </div>
              <p className="text-xs font-bold text-white">
                Avenue Montaigne Triplex Survey
              </p>
              <p className="text-[11px] text-gray-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gray-500" /> Paris, 8th Arr.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#161B24] border border-[#232B3A] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#D4AF37] font-bold">
                  SEP 28 • 10:00 EST
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  CONTACTED
                </span>
              </div>
              <p className="text-xs font-bold text-white">
                57th St Duplex Staging Walkthrough
              </p>
              <p className="text-[11px] text-gray-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gray-500" /> NYC Billionaires&apos; Row
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. BOOKING DETAIL MODAL / DRAWER */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedBooking(null)}
          />
          <div className="relative bg-[#12161F] border border-[#252E3E] rounded-2xl max-w-2xl w-full p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            {/* MODAL HEADER */}
            <div className="flex items-start justify-between pb-4 border-b border-[#252E3E]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#D4AF37]">
                    {selectedBooking.id}
                  </span>
                  {selectedBooking.isVip && (
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      VIP Client
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white font-serif mt-0.5">
                  {selectedBooking.clientName}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider border ${
                    STATUS_CONFIG[selectedBooking.status].badgeClass
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      STATUS_CONFIG[selectedBooking.status].dotClass
                    }`}
                  />
                  {STATUS_CONFIG[selectedBooking.status].label}
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* MODAL BODY */}
            <div className="py-4 space-y-5 text-xs">
              {/* CLIENT INFORMATION */}
              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-bold mb-2">
                  CLIENT INFORMATION
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#181E29] border border-[#263143] rounded-xl p-3">
                  <div>
                    <span className="text-gray-400 text-[10px] block">Name</span>
                    <span className="font-semibold text-white">
                      {selectedBooking.clientName}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block">Email</span>
                    <span className="font-mono text-gray-200">
                      {selectedBooking.clientEmail}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block">Phone</span>
                    <span className="font-mono text-gray-200">
                      {selectedBooking.clientPhone}
                    </span>
                  </div>
                </div>
              </div>

              {/* PROJECT INFORMATION */}
              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-bold mb-2">
                  PROJECT INFORMATION
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#181E29] border border-[#263143] rounded-xl p-3">
                  <div>
                    <span className="text-gray-400 text-[10px] block">Service</span>
                    <span className="font-semibold text-white">
                      {selectedBooking.service}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block">
                      Property / Project Type
                    </span>
                    <span className="font-semibold text-white">
                      {selectedBooking.propertyType}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block">Location</span>
                    <span className="text-gray-200">{selectedBooking.location}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block">
                      Budget &amp; Area
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {selectedBooking.budget} • {selectedBooking.squareFootage}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block">
                      Preferred Date &amp; Time
                    </span>
                    <span className="font-mono text-gray-200">
                      {selectedBooking.preferredDate} ({selectedBooking.preferredTime})
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block">
                      Created Timestamp
                    </span>
                    <span className="font-mono text-gray-400">
                      {selectedBooking.createdAt}
                    </span>
                  </div>
                </div>
              </div>

              {/* MESSAGE / INQUIRY */}
              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-bold mb-2">
                  PROJECT INQUIRY / SCOPE
                </h4>
                <div className="bg-[#181E29] border border-[#263143] rounded-xl p-3.5 text-gray-200 leading-relaxed font-sans">
                  {selectedBooking.message}
                </div>
              </div>

              {/* STATUS UPDATE CONTROLS (UI ONLY) */}
              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 font-bold mb-2">
                  ADMIN STATUS ACTIONS (UI SIMULATION)
                </h4>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedBooking.id, "CONTACTED")}
                    className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-mono font-bold transition-all"
                  >
                    Mark Contacted
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedBooking.id, "CONFIRMED")}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold transition-all"
                  >
                    Confirm Booking
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedBooking.id, "COMPLETED")}
                    className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono font-bold transition-all"
                  >
                    Mark Completed
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedBooking.id, "CANCELLED")}
                    className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-mono font-bold transition-all"
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="pt-3 border-t border-[#252E3E] flex items-center justify-between">
              <span className="text-[10px] font-mono text-gray-500">
                Updated: {selectedBooking.updatedAt}
              </span>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 rounded-xl bg-[#1E2533] text-gray-300 hover:text-white text-xs font-mono"
              >
                Close Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
