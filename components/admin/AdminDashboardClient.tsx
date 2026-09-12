"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  RefreshCw,
  Trash2,
  Eye,
  ShieldCheck,
  Calendar,
  Clock,
  Mail,
  Phone,
  MapPin,
  X,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  XCircle,
  FileText,
  DollarSign,
  ArrowUpDown,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { BookingRecord, BookingStatus } from "@/lib/db";

interface AdminDashboardClientProps {
  userEmail: string;
}

export function AdminDashboardClient({ userEmail }: AdminDashboardClientProps) {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Controls
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [serviceFilter, setServiceFilter] = useState<string>("ALL");
  const [sortOption, setSortOption] = useState<string>("newest");

  // Detail Modal & Delete Modal State
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const [deletingBooking, setDeletingBooking] = useState<BookingRecord | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (serviceFilter !== "ALL") params.set("service", serviceFilter);
      if (sortOption) params.set("sort", sortOption);

      const res = await fetch(`/api/admin/bookings?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch booking records.");
      }

      setBookings(data.bookings || []);
    } catch (err: any) {
      setError(err.message || "An error occurred while loading dashboard data.");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, serviceFilter, sortOption]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Handle Status Change
  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    setIsUpdatingStatus(bookingId);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update status.");
      }

      // Optimistic update
      setBookings((prev) =>
        prev.map((b) =>
          b.bookingId === bookingId ? { ...b, status: newStatus } : b
        )
      );

      if (selectedBooking && selectedBooking.bookingId === bookingId) {
        setSelectedBooking((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err: any) {
      alert(`Error updating status: ${err.message}`);
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  // Handle Delete Booking
  const handleDeleteConfirm = async () => {
    if (!deletingBooking) return;
    const targetId = deletingBooking.bookingId;

    try {
      const res = await fetch(`/api/admin/bookings/${targetId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete booking.");
      }

      setBookings((prev) => prev.filter((b) => b.bookingId !== targetId));
      if (selectedBooking?.bookingId === targetId) {
        setSelectedBooking(null);
      }
      setDeletingBooking(null);
    } catch (err: any) {
      alert(`Error deleting record: ${err.message}`);
    }
  };

  // Metrics
  const totalCount = bookings.length;
  const newCount = bookings.filter((b) => b.status === "NEW").length;
  const contactedCount = bookings.filter((b) => b.status === "CONTACTED").length;
  const confirmedCount = bookings.filter((b) => b.status === "CONFIRMED").length;
  const completedCount = bookings.filter((b) => b.status === "COMPLETED").length;
  const cancelledCount = bookings.filter((b) => b.status === "CANCELLED").length;

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "NEW":
        return "bg-blue-500/20 text-blue-400 border-blue-500/40";
      case "CONTACTED":
        return "bg-amber-500/20 text-amber-400 border-amber-500/40";
      case "CONFIRMED":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/40";
      case "COMPLETED":
        return "bg-purple-500/20 text-purple-400 border-purple-500/40";
      case "CANCELLED":
        return "bg-red-500/20 text-red-400 border-red-500/40";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/40";
    }
  };

  return (
    <div className="min-h-screen flex flex-col pt-20 pb-16 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto">
      {/* ADMIN HEADER BAR */}
      <header className="fixed top-0 inset-x-0 z-[100] bg-[#161920]/95 backdrop-blur-xl border-b border-[#2D333F] py-3 px-6 sm:px-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#A78D78] text-black font-serif font-black flex items-center justify-center text-sm shadow-md">
            P
          </div>
          <div>
            <h1 className="font-serif text-lg font-bold text-white tracking-wide flex items-center gap-2">
              <span>PAIMA Private Admin Portal</span>
              <span className="px-2 py-0.5 text-[9px] font-sans font-mono uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded">
                VERIFIED ADMIN
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{userEmail}</span>
          </div>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-9 h-9 border border-gray-600 rounded-full",
              },
            }}
          />
        </div>
      </header>

      {/* STATS OVERVIEW CARDS */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-[#1A1D24] border border-[#2D333F] p-5 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">
            TOTAL DOSSIERS
          </span>
          <span className="text-2xl sm:text-3xl font-serif font-extrabold text-white block">
            {totalCount}
          </span>
        </div>

        <div className="bg-[#1A1D24] border border-blue-500/30 p-5 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block">
            NEW UNREAD
          </span>
          <span className="text-2xl sm:text-3xl font-serif font-extrabold text-blue-400 block">
            {newCount}
          </span>
        </div>

        <div className="bg-[#1A1D24] border border-amber-500/30 p-5 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">
            CONTACTED
          </span>
          <span className="text-2xl sm:text-3xl font-serif font-extrabold text-amber-400 block">
            {contactedCount}
          </span>
        </div>

        <div className="bg-[#1A1D24] border border-emerald-500/30 p-5 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">
            CONFIRMED
          </span>
          <span className="text-2xl sm:text-3xl font-serif font-extrabold text-emerald-400 block">
            {confirmedCount}
          </span>
        </div>

        <div className="bg-[#1A1D24] border border-purple-500/30 p-5 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block">
            COMPLETED
          </span>
          <span className="text-2xl sm:text-3xl font-serif font-extrabold text-purple-400 block">
            {completedCount}
          </span>
        </div>

        <div className="bg-[#1A1D24] border border-red-500/30 p-5 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest block">
            CANCELLED
          </span>
          <span className="text-2xl sm:text-3xl font-serif font-extrabold text-red-400 block">
            {cancelledCount}
          </span>
        </div>
      </section>

      {/* CONTROLS BAR: SEARCH, FILTERS, SORTING */}
      <div className="bg-[#161920] border border-[#2D333F] p-4 rounded-2xl mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by patron name, email, phone, booking ID, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0F1115] border border-[#2D333F] pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#A78D78] rounded-xl font-medium"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-[#0F1115] border border-[#2D333F] px-3 py-2 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-400 text-[10px] font-mono uppercase">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#161920]">ALL STATUSES</option>
              <option value="NEW" className="bg-[#161920]">NEW</option>
              <option value="CONTACTED" className="bg-[#161920]">CONTACTED</option>
              <option value="CONFIRMED" className="bg-[#161920]">CONFIRMED</option>
              <option value="COMPLETED" className="bg-[#161920]">COMPLETED</option>
              <option value="CANCELLED" className="bg-[#161920]">CANCELLED</option>
            </select>
          </div>

          {/* Sort Option */}
          <div className="flex items-center gap-1.5 bg-[#0F1115] border border-[#2D333F] px-3 py-2 rounded-xl">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-400 text-[10px] font-mono uppercase">Sort:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="newest" className="bg-[#161920]">Newest First</option>
              <option value="oldest" className="bg-[#161920]">Oldest First</option>
              <option value="preferredDate" className="bg-[#161920]">Preferred Date</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={fetchBookings}
            className="p-2.5 bg-[#0F1115] border border-[#2D333F] text-gray-300 hover:text-white hover:border-[#A78D78] rounded-xl transition-colors"
            title="Refresh Table"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* ERROR DISPLAY */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* BOOKINGS TABLE */}
      <div className="bg-[#161920] border border-[#2D333F] rounded-2xl overflow-hidden shadow-2xl flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#1F232D] text-gray-400 font-mono text-[10px] uppercase border-b border-[#2D333F]">
                <th className="py-3.5 px-4 sm:px-6">Booking ID</th>
                <th className="py-3.5 px-4 sm:px-6">Patron / Customer</th>
                <th className="py-3.5 px-4 sm:px-6">Service &amp; Location</th>
                <th className="py-3.5 px-4 sm:px-6">Preferred Date/Time</th>
                <th className="py-3.5 px-4 sm:px-6">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D333F]/60 text-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-gray-400 font-mono">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#A78D78]" />
                    Loading dossier database records...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-gray-400 font-mono">
                    No booking records found matching your filters.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr
                    key={booking.bookingId}
                    className="hover:bg-[#1A1E27] transition-colors group"
                  >
                    {/* ID */}
                    <td className="py-4 px-4 sm:px-6 font-mono font-bold text-white whitespace-nowrap">
                      {booking.bookingId}
                      {booking.clerkUserId && (
                        <span className="ml-2 text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded">
                          AUTH USER
                        </span>
                      )}
                    </td>

                    {/* Patron Name */}
                    <td className="py-4 px-4 sm:px-6 space-y-0.5">
                      <div className="font-semibold text-white text-sm">{booking.fullName}</div>
                      <div className="text-[11px] text-gray-400 flex items-center gap-2">
                        <span>{booking.email}</span>
                        {booking.phone && <span>&bull; {booking.phone}</span>}
                      </div>
                    </td>

                    {/* Service & Location */}
                    <td className="py-4 px-4 sm:px-6 space-y-0.5">
                      <div className="font-medium text-gray-200">{booking.service}</div>
                      <div className="text-[11px] text-gray-400">{booking.location}</div>
                    </td>

                    {/* Preferred Date & Time */}
                    <td className="py-4 px-4 sm:px-6 space-y-0.5">
                      <div className="font-mono text-gray-200">
                        {booking.preferredDate || "Not Specified"}
                      </div>
                      <div className="text-[11px] text-gray-400">{booking.preferredTime}</div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-4 px-4 sm:px-6">
                      <select
                        value={booking.status}
                        disabled={isUpdatingStatus === booking.bookingId}
                        onChange={(e) =>
                          handleStatusChange(
                            booking.bookingId,
                            e.target.value as BookingStatus
                          )
                        }
                        className={`text-[10px] font-mono uppercase tracking-wider font-extrabold px-3 py-1.5 rounded-lg border focus:outline-none cursor-pointer transition-all ${getStatusBadge(
                          booking.status
                        )}`}
                      >
                        <option value="NEW" className="bg-[#161920] text-blue-400">NEW</option>
                        <option value="CONTACTED" className="bg-[#161920] text-amber-400">CONTACTED</option>
                        <option value="CONFIRMED" className="bg-[#161920] text-emerald-400">CONFIRMED</option>
                        <option value="COMPLETED" className="bg-[#161920] text-purple-400">COMPLETED</option>
                        <option value="CANCELLED" className="bg-[#161920] text-red-400">CANCELLED</option>
                      </select>
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedBooking(booking)}
                          className="p-2 bg-[#212631] text-gray-300 hover:text-white hover:bg-[#2D333F] rounded-lg transition-colors"
                          title="View Full Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingBooking(booking)}
                          className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-colors"
                          title="Delete Booking"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL DRAWER */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="bg-[#161920] border border-[#2D333F] max-w-2xl w-full rounded-2xl shadow-2xl overflow-hidden text-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-[#2D333F] flex items-center justify-between bg-[#1F232D]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#A78D78] block">
                  BOOKING DOSSIER DETAIL
                </span>
                <h3 className="font-serif text-xl text-white font-bold mt-0.5">
                  {selectedBooking.bookingId}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="p-2 text-gray-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Patron & Status Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#0F1115] border border-[#2D333F] rounded-xl">
                <div>
                  <span className="text-[10px] font-mono text-gray-400 block">PATRON NAME</span>
                  <span className="text-base font-bold text-white">{selectedBooking.fullName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-gray-400 block mb-1">STATUS</span>
                  <select
                    value={selectedBooking.status}
                    onChange={(e) =>
                      handleStatusChange(
                        selectedBooking.bookingId,
                        e.target.value as BookingStatus
                      )
                    }
                    className={`text-[10px] font-mono font-extrabold px-3 py-1 rounded border focus:outline-none ${getStatusBadge(
                      selectedBooking.status
                    )}`}
                  >
                    <option value="NEW" className="bg-[#161920]">NEW</option>
                    <option value="CONTACTED" className="bg-[#161920]">CONTACTED</option>
                    <option value="CONFIRMED" className="bg-[#161920]">CONFIRMED</option>
                    <option value="COMPLETED" className="bg-[#161920]">COMPLETED</option>
                    <option value="CANCELLED" className="bg-[#161920]">CANCELLED</option>
                  </select>
                </div>
              </div>

              {/* Grid Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#0F1115] border border-[#2D333F] rounded-xl space-y-1">
                  <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-400" /> EMAIL ADDRESS
                  </span>
                  <a href={`mailto:${selectedBooking.email}`} className="text-xs font-semibold text-blue-400 hover:underline block">
                    {selectedBooking.email}
                  </a>
                </div>

                <div className="p-4 bg-[#0F1115] border border-[#2D333F] rounded-xl space-y-1">
                  <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" /> DIRECT TELEPHONE
                  </span>
                  <a href={`tel:${selectedBooking.phone}`} className="text-xs font-semibold text-gray-200 hover:underline block">
                    {selectedBooking.phone || "Not Provided"}
                  </a>
                </div>
              </div>

              {/* Project & Preferred Date/Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#0F1115] border border-[#2D333F] rounded-xl space-y-1">
                  <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-gray-400" /> SERVICE TYPOLOGY
                  </span>
                  <span className="text-xs font-semibold text-white block">
                    {selectedBooking.service}
                  </span>
                </div>

                <div className="p-4 bg-[#0F1115] border border-[#2D333F] rounded-xl space-y-1">
                  <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" /> PREFERRED DATE &amp; TIME
                  </span>
                  <span className="text-xs font-semibold text-white block">
                    {selectedBooking.preferredDate || "Flexibility Requested"} &bull; {selectedBooking.preferredTime}
                  </span>
                </div>
              </div>

              {/* Investment & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#0F1115] border border-[#2D333F] rounded-xl space-y-1">
                  <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-gray-400" /> INVESTMENT ALLOCATION
                  </span>
                  <span className="text-xs font-semibold text-emerald-400 block">
                    {selectedBooking.budget}
                  </span>
                </div>

                <div className="p-4 bg-[#0F1115] border border-[#2D333F] rounded-xl space-y-1">
                  <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" /> PROPERTY LOCATION
                  </span>
                  <span className="text-xs font-semibold text-white block">
                    {selectedBooking.location}
                  </span>
                </div>
              </div>

              {/* Project Brief */}
              <div className="p-4 bg-[#0F1115] border border-[#2D333F] rounded-xl space-y-2">
                <span className="text-[10px] font-mono text-gray-400 block">
                  PROJECT BRIEF &amp; VISION
                </span>
                <p className="text-xs text-gray-200 leading-relaxed font-sans whitespace-pre-wrap">
                  {selectedBooking.projectDetails}
                </p>
              </div>

              {/* Metadata Footer */}
              <div className="pt-4 border-t border-[#2D333F] text-[10px] font-mono text-gray-500 flex flex-wrap justify-between gap-2">
                <span>Created: {new Date(selectedBooking.createdAt).toLocaleString()}</span>
                <span>Updated: {new Date(selectedBooking.updatedAt).toLocaleString()}</span>
                {selectedBooking.clerkUserId && (
                  <span>Clerk User ID: {selectedBooking.clerkUserId}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingBooking && (
        <div
          className="fixed inset-0 z-[130] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setDeletingBooking(null)}
        >
          <div
            className="bg-[#161920] border border-red-500/40 max-w-md w-full rounded-2xl p-6 space-y-5 text-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-serif text-lg font-bold text-white">
                Confirm Permanent Deletion
              </h3>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Are you sure you want to permanently delete booking{" "}
              <strong className="text-white font-mono">{deletingBooking.bookingId}</strong> submitted by{" "}
              <strong className="text-white">{deletingBooking.fullName}</strong>? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#2D333F]">
              <button
                type="button"
                onClick={() => setDeletingBooking(null)}
                className="px-4 py-2 bg-[#212631] text-gray-300 hover:text-white rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-lg"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
