"use client";

import React, { useState, useEffect } from "react";
import {
  Layers,
  Search,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Trash2,
  Plus,
  X,
  MapPin,
  Calendar,
  Mail,
  Phone,
  DollarSign,
  User,
  ExternalLink,
  RefreshCw,
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

export function BookingsManagement() {
  const { showToast, refreshStats } = useAdmin();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const [bookingToDelete, setBookingToDelete] = useState<BookingRecord | null>(null);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);

  // New booking form state
  const [newForm, setNewForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    service: "Haute Architectural Interior",
    budget: "$250,000 – $500,000",
    location: "",
    preferredDate: "",
    preferredTime: "10:00 AM",
    projectDetails: "",
    isVip: false,
  });

  const [errorState, setErrorState] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    setErrorState(false);
    try {
      const url = new URL("/api/admin/bookings", window.location.origin);
      if (search) url.searchParams.set("search", search);
      if (statusFilter !== "ALL") url.searchParams.set("status", statusFilter);
      if (sortBy) url.searchParams.set("sort", sortBy);

      const res = await fetch(url.toString());
      if (!res.ok) {
        setErrorState(true);
        if (res.status === 401 || res.status === 403) {
          showToast("Session Notice", "Your executive session may have expired. Please refresh or authenticate again.", "error");
        } else {
          showToast("Notice", "Unable to load data right now. Please try again.", "error");
        }
        return;
      }
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err: any) {
      console.error("Fetch bookings error:", err);
      setErrorState(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [search, statusFilter, sortBy]);

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status: newStatus }),
      });

      if (!res.ok) {
        showToast("Error", "Status update failed", "error");
        return;
      }

      setBookings((prev) =>
        prev.map((b) => (b.bookingId === bookingId ? { ...b, status: newStatus } : b))
      );
      if (selectedBooking && selectedBooking.bookingId === bookingId) {
        setSelectedBooking((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
      showToast("Status Updated", `Booking ${bookingId} marked as ${newStatus}.`, "success");
      refreshStats();
    } catch (err: any) {
      showToast("Error", "Status update failed", "error");
    }
  };

  const handleDeleteBooking = async () => {
    if (!bookingToDelete) return;
    try {
      const res = await fetch(`/api/admin/bookings?bookingId=${bookingToDelete.bookingId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        showToast("Error", "Delete failed", "error");
        return;
      }

      setBookings((prev) => prev.filter((b) => b.bookingId !== bookingToDelete.bookingId));
      if (selectedBooking?.bookingId === bookingToDelete.bookingId) {
        setSelectedBooking(null);
      }
      showToast("Deleted", `Booking ${bookingToDelete.bookingId} has been purged.`, "success");
      setBookingToDelete(null);
      refreshStats();
    } catch (err: any) {
      showToast("Error", "Delete failed", "error");
    }
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newForm),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        showToast("Error", err.error || "Failed to create booking", "error");
        return;
      }

      showToast("Created", "New client dossier registered.", "success");
      setIsNewBookingModalOpen(false);
      setNewForm({
        fullName: "",
        email: "",
        phone: "",
        service: "Haute Architectural Interior",
        budget: "$250,000 – $500,000",
        location: "",
        preferredDate: "",
        preferredTime: "10:00 AM",
        projectDetails: "",
        isVip: false,
      });
      fetchBookings();
      refreshStats();
    } catch (err: any) {
      showToast("Error", "Failed to create booking", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E5D5C5]">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#B3877F]" />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#B3877F] font-bold">
              COMMISSION DOSSIERS
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1C1614] mt-1">
            Bookings &amp; Inquiries Management
          </h2>
          <p className="text-xs text-[#5D4A44] mt-0.5">
            Real client requests, architectural briefs, budgets, and scheduling.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchBookings}
            className="px-3.5 py-2 rounded-xl bg-[#F7F2EA] hover:bg-[#F2E8E3] text-[#4A3B36] text-xs font-semibold border border-[#E5D5C5] flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#B3877F]" : "text-[#B3877F]"}`} />
            <span>Sync</span>
          </button>

          <button
            type="button"
            onClick={() => setIsNewBookingModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#1C1614] text-[#FDFBF7] text-xs font-bold shadow-md hover:bg-[#2D2326] transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Register Dossier</span>
          </button>
        </div>
      </div>

      {/* 2. SEARCH & FILTER TOOLBAR */}
      <div className="p-4 rounded-2xl bg-[#F7F2EA] border border-[#E5D5C5] flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7D6B64]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name, email, phone, or dossier ID..."
            className="w-full bg-[#FDFBF7] border border-[#E5D5C5] rounded-xl pl-10 pr-4 py-2 text-xs text-[#1C1614] placeholder-[#7D6B64] outline-none focus:border-[#B3877F] transition-all"
          />
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#7D6B64] uppercase">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#FDFBF7] border border-[#E5D5C5] text-[#1C1614] text-xs rounded-xl px-3 py-2 outline-none focus:border-[#B3877F] cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">New Inquiries</option>
              <option value="CONTACTED">Contacted</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#7D6B64] uppercase">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#FDFBF7] border border-[#E5D5C5] text-[#1C1614] text-xs rounded-xl px-3 py-2 outline-none focus:border-[#B3877F] cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="preferredDate">Preferred Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. BOOKINGS TABLE */}
      <div className="rounded-2xl bg-[#F7F2EA] border border-[#E5D5C5] overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-xs text-[#7D6B64] font-mono">
            Loading dossiers from database...
          </div>
        ) : errorState ? (
          <div className="py-16 px-4 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#EAD8D3] border border-[#D8C5BD] flex items-center justify-center text-[#4A3B36]">
              <AlertCircle className="w-6 h-6 text-[#B3877F]" />
            </div>
            <div>
              <p className="text-base font-bold text-[#1C1614]">Data Service Temporarily Unavailable</p>
              <p className="text-xs text-[#7D6B64] mt-1 max-w-sm mx-auto">
                Unable to load data right now. Please try again.
              </p>
            </div>
            <button
              type="button"
              onClick={fetchBookings}
              className="px-4 py-2 rounded-xl bg-[#1C1614] hover:bg-[#2D2326] text-[#FDFBF7] text-xs font-bold transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#B3877F]" />
              <span>Retry</span>
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#F2E8E3] border border-[#E5D5C5] flex items-center justify-center text-[#7D6B64]">
              <Layers className="w-7 h-7 text-[#B3877F]" />
            </div>
            <div>
              <p className="text-base font-bold text-[#1C1614]">No booking records found</p>
              <p className="text-xs text-[#7D6B64] mt-1 max-w-sm mx-auto">
                {search || statusFilter !== "ALL"
                  ? "No results match your active search or filter criteria."
                  : "New inquiries submitted from the Contact page will automatically appear here."}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E5D5C5] bg-[#FDFBF7] text-[10px] font-mono text-[#7D6B64] uppercase tracking-wider">
                  <th className="p-4 font-semibold">Dossier ID &amp; Date</th>
                  <th className="p-4 font-semibold">Client Name &amp; Contact</th>
                  <th className="p-4 font-semibold">Requested Service</th>
                  <th className="p-4 font-semibold">Budget &amp; Location</th>
                  <th className="p-4 font-semibold">Preferred Schedule</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5D5C5]">
                {bookings.map((b) => {
                  const badge = STATUS_BADGES[b.status] || STATUS_BADGES.NEW;
                  return (
                    <tr key={b.bookingId} className="hover:bg-[#F2E8E3] transition-colors group">
                      {/* ID & Date */}
                      <td className="p-4">
                        <span className="font-mono font-bold text-[#4A3B36] text-xs">
                          {b.bookingId}
                        </span>
                        <p className="text-[10px] font-mono text-[#7D6B64] mt-0.5">
                          {new Date(b.createdAt).toLocaleDateString()}
                        </p>
                      </td>

                      {/* Client */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-[#1C1614]">{b.fullName}</p>
                          {b.isVip && (
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#EAD8D3] text-[#4A3B36] border border-[#D8C5BD]">
                              VIP
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#5D4A44] mt-0.5">{b.email}</p>
                        {b.phone && <p className="text-[10px] font-mono text-[#7D6B64]">{b.phone}</p>}
                      </td>

                      {/* Service */}
                      <td className="p-4 text-[#5D4A44]">
                        <p className="font-medium text-[#1C1614]">{b.service}</p>
                      </td>

                      {/* Budget & Location */}
                      <td className="p-4">
                        <p className="font-mono font-bold text-[#4A3B36]">{b.budget}</p>
                        <p className="text-[10px] text-[#7D6B64] mt-0.5">{b.location}</p>
                      </td>

                      {/* Schedule */}
                      <td className="p-4 font-mono text-[11px] text-[#5D4A44]">
                        <p className="text-[#1C1614]">{b.preferredDate || "Not Specified"}</p>
                        <p className="text-[10px] text-[#7D6B64]">{b.preferredTime || ""}</p>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <select
                          value={b.status}
                          onChange={(e) =>
                            handleStatusChange(b.bookingId, e.target.value as BookingStatus)
                          }
                          className="bg-[#FDFBF7] border border-[#E5D5C5] text-[#1C1614] text-[11px] rounded-lg px-2.5 py-1.5 outline-none focus:border-[#B3877F] cursor-pointer"
                        >
                          <option value="NEW">NEW INQUIRY</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedBooking(b)}
                            title="View Full Dossier"
                            className="p-1.5 rounded-lg bg-[#FDFBF7] hover:bg-[#F2E8E3] text-[#4A3B36] transition-colors cursor-pointer border border-[#E5D5C5]"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setBookingToDelete(b)}
                            title="Purge Dossier"
                            className="p-1.5 rounded-lg bg-[#FDFBF7] hover:bg-red-50 text-[#7D6B64] hover:text-red-500 transition-colors cursor-pointer border border-[#E5D5C5]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. DETAIL DRAWER MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-[#F7F2EA] border border-[#E5D5C5] rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E5D5C5]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#B3877F] font-bold">
                  CLIENT DOSSIER DETAILS
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#1C1614]">
                  {selectedBooking.fullName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="p-2 rounded-xl bg-[#F2E8E3] text-[#7D6B64] hover:text-[#1C1614]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-[#FDFBF7] border border-[#E5D5C5] space-y-1">
                <span className="text-[10px] font-mono text-[#7D6B64] uppercase">Dossier ID</span>
                <p className="font-mono font-bold text-[#4A3B36]">{selectedBooking.bookingId}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#FDFBF7] border border-[#E5D5C5] space-y-1">
                <span className="text-[10px] font-mono text-[#7D6B64] uppercase">Service Type</span>
                <p className="font-bold text-[#1C1614]">{selectedBooking.service}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#FDFBF7] border border-[#E5D5C5] space-y-1">
                <span className="text-[10px] font-mono text-[#7D6B64] uppercase">Email Contact</span>
                <p className="font-bold text-[#1C1614]">{selectedBooking.email}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#FDFBF7] border border-[#E5D5C5] space-y-1">
                <span className="text-[10px] font-mono text-[#7D6B64] uppercase">Phone Number</span>
                <p className="font-mono text-[#1C1614]">{selectedBooking.phone || "Not Provided"}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#FDFBF7] border border-[#E5D5C5] space-y-1">
                <span className="text-[10px] font-mono text-[#7D6B64] uppercase">Budget Allocation</span>
                <p className="font-mono font-bold text-[#4A3B36]">{selectedBooking.budget}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#FDFBF7] border border-[#E5D5C5] space-y-1">
                <span className="text-[10px] font-mono text-[#7D6B64] uppercase">Property Location</span>
                <p className="font-bold text-[#1C1614]">{selectedBooking.location}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#FDFBF7] border border-[#E5D5C5] space-y-1 sm:col-span-2">
                <span className="text-[10px] font-mono text-[#7D6B64] uppercase">
                  Preferred Consultation Slot
                </span>
                <p className="font-mono text-[#1C1614]">
                  {selectedBooking.preferredDate} at {selectedBooking.preferredTime || "10:00 AM"}
                </p>
              </div>
            </div>

            {/* Brief / Message */}
            <div className="p-4 rounded-xl bg-[#FDFBF7] border border-[#E5D5C5] space-y-2">
              <span className="text-[10px] font-mono text-[#7D6B64] uppercase font-bold block">
                Architectural Brief &amp; Project Description
              </span>
              <p className="text-xs text-[#5D4A44] leading-relaxed whitespace-pre-wrap">
                {selectedBooking.projectDetails || selectedBooking.message || "No additional brief details submitted."}
              </p>
            </div>

            {/* Status Update in Modal */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E5D5C5]">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#7D6B64]">Status:</span>
                <select
                  value={selectedBooking.status}
                  onChange={(e) =>
                    handleStatusChange(selectedBooking.bookingId, e.target.value as BookingStatus)
                  }
                  className="bg-[#FDFBF7] border border-[#E5D5C5] text-[#1C1614] text-xs rounded-xl px-3 py-1.5 outline-none focus:border-[#B3877F]"
                >
                  <option value="NEW">NEW INQUIRY</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 rounded-xl bg-[#FDFBF7] hover:bg-[#F2E8E3] text-[#4A3B36] text-xs font-bold border border-[#E5D5C5]"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. DELETE CONFIRMATION MODAL */}
      {bookingToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-[#FDFBF7] border border-red-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-500">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg font-bold text-[#1C1614]">
              Purge Booking Dossier?
            </h4>
            <p className="text-xs text-[#5D4A44]">
              Are you sure you wish to permanently delete dossier{" "}
              <strong className="text-[#4A3B36]">{bookingToDelete.bookingId}</strong> for{" "}
              <strong className="text-[#4A3B36]">{bookingToDelete.fullName}</strong>? This action is irreversible.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setBookingToDelete(null)}
                className="px-4 py-2 rounded-xl bg-[#F7F2EA] hover:bg-[#F2E8E3] border border-[#E5D5C5] text-[#1C1614] text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteBooking}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. NEW BOOKING MANUAL REGISTRATION MODAL */}
      {isNewBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-[#F7F2EA] border border-[#E5D5C5] rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5D5C5]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#B3877F] font-bold">
                  MANUAL ENTRY
                </span>
                <h3 className="font-serif text-xl font-bold text-[#1C1614]">
                  Register Client Dossier
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewBookingModalOpen(false)}
                className="p-2 rounded-xl bg-[#F2E8E3] text-[#7D6B64] hover:text-[#1C1614]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-[#7D6B64]">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newForm.fullName}
                    onChange={(e) => setNewForm({ ...newForm, fullName: e.target.value })}
                    className="w-full bg-[#FDFBF7] border border-[#E5D5C5] rounded-xl px-3 py-2 text-[#1C1614] outline-none focus:border-[#B3877F]"
                    placeholder="e.g. Lady Vivienne Montgomery"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-[#7D6B64]">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newForm.email}
                    onChange={(e) => setNewForm({ ...newForm, email: e.target.value })}
                    className="w-full bg-[#FDFBF7] border border-[#E5D5C5] rounded-xl px-3 py-2 text-[#1C1614] outline-none focus:border-[#B3877F]"
                    placeholder="v.montgomery@domain.com"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-[#7D6B64]">Phone</label>
                  <input
                    type="text"
                    value={newForm.phone}
                    onChange={(e) => setNewForm({ ...newForm, phone: e.target.value })}
                    className="w-full bg-[#FDFBF7] border border-[#E5D5C5] rounded-xl px-3 py-2 text-[#1C1614] outline-none focus:border-[#B3877F]"
                    placeholder="+1 (212) 555-0199"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-[#7D6B64]">Service</label>
                  <select
                    value={newForm.service}
                    onChange={(e) => setNewForm({ ...newForm, service: e.target.value })}
                    className="w-full bg-[#FDFBF7] border border-[#E5D5C5] rounded-xl px-3 py-2 text-[#1C1614] outline-none focus:border-[#B3877F]"
                  >
                    <option value="Haute Architectural Interior">Haute Architectural Interior</option>
                    <option value="Historic Villa Restoration">Historic Villa Restoration</option>
                    <option value="Penthouse Interior Transformation">Penthouse Interior Transformation</option>
                    <option value="Luxury Hospitality / Commercial">Luxury Hospitality / Commercial</option>
                    <option value="Art Curation & Spatial FF&E">Art Curation &amp; Spatial FF&amp;E</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-[#7D6B64]">Budget</label>
                  <input
                    type="text"
                    value={newForm.budget}
                    onChange={(e) => setNewForm({ ...newForm, budget: e.target.value })}
                    className="w-full bg-[#FDFBF7] border border-[#E5D5C5] rounded-xl px-3 py-2 text-[#1C1614] outline-none focus:border-[#B3877F]"
                    placeholder="$500,000 – $1,000,000"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-[#7D6B64]">Property Location</label>
                  <input
                    type="text"
                    value={newForm.location}
                    onChange={(e) => setNewForm({ ...newForm, location: e.target.value })}
                    className="w-full bg-[#FDFBF7] border border-[#E5D5C5] rounded-xl px-3 py-2 text-[#1C1614] outline-none focus:border-[#B3877F]"
                    placeholder="Monaco, New York, Paris..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-[#7D6B64]">Preferred Date</label>
                  <input
                    type="date"
                    value={newForm.preferredDate}
                    onChange={(e) => setNewForm({ ...newForm, preferredDate: e.target.value })}
                    className="w-full bg-[#FDFBF7] border border-[#E5D5C5] rounded-xl px-3 py-2 text-[#1C1614] outline-none focus:border-[#B3877F]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-[#7D6B64]">Preferred Time</label>
                  <input
                    type="text"
                    value={newForm.preferredTime}
                    onChange={(e) => setNewForm({ ...newForm, preferredTime: e.target.value })}
                    className="w-full bg-[#FDFBF7] border border-[#E5D5C5] rounded-xl px-3 py-2 text-[#1C1614] outline-none focus:border-[#B3877F]"
                    placeholder="10:00 AM EST"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-[#7D6B64]">Project Brief</label>
                <textarea
                  rows={3}
                  value={newForm.projectDetails}
                  onChange={(e) => setNewForm({ ...newForm, projectDetails: e.target.value })}
                  className="w-full bg-[#FDFBF7] border border-[#E5D5C5] rounded-xl px-3 py-2 text-[#1C1614] outline-none focus:border-[#B3877F]"
                  placeholder="Details regarding property dimensions, aesthetic direction, stone finishes..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5D5C5]">
                <button
                  type="button"
                  onClick={() => setIsNewBookingModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#FDFBF7] hover:bg-[#F2E8E3] border border-[#E5D5C5] text-[#1C1614] text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1C1614] text-[#FDFBF7] text-xs font-bold shadow-md hover:bg-[#2D2326]"
                >
                  Register Dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
