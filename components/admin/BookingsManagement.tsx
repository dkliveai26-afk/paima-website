"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Plus,
  Download,
  Calendar,
  Layers,
  MapPin,
  DollarSign,
  Phone,
  Mail,
  Send,
  Trash2,
  RefreshCw,
} from "lucide-react";
import {
  INITIAL_BOOKINGS,
  Booking,
  BookingStatus,
  ServiceType,
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

export function BookingsManagement() {
  const { showToast, openNewInquiryModal } = useAdmin();
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [serviceFilter, setServiceFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"NEWEST" | "OLDEST" | "DATE">("NEWEST");

  // Multi selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Admin note input in drawer
  const [adminNoteInput, setAdminNoteInput] = useState("");

  // Filter logic
  const filteredBookings = bookings
    .filter((b) => {
      // Status filter
      if (statusFilter !== "ALL" && b.status !== statusFilter) return false;
      // Service filter
      if (serviceFilter !== "ALL" && b.service !== serviceFilter) return false;
      // Search query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesName = b.clientName.toLowerCase().includes(query);
        const matchesEmail = b.clientEmail.toLowerCase().includes(query);
        const matchesId = b.id.toLowerCase().includes(query);
        const matchesLoc = b.location.toLowerCase().includes(query);
        const matchesProp = b.propertyType.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesId && !matchesLoc && !matchesProp) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "NEWEST") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "OLDEST") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === "DATE") {
        return new Date(a.preferredDate).getTime() - new Date(b.preferredDate).getTime();
      }
      return 0;
    });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredBookings.map((b) => b.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

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
    showToast("Status Updated", `Booking ${bookingId} transitioned to ${newStatus}.`);
  };

  const handleAddAdminNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminNoteInput.trim() || !selectedBooking) return;

    const updatedNotes = [...(selectedBooking.notes || []), adminNoteInput.trim()];
    setBookings((prev) =>
      prev.map((b) =>
        b.id === selectedBooking.id ? { ...b, notes: updatedNotes } : b
      )
    );
    setSelectedBooking({ ...selectedBooking, notes: updatedNotes });
    setAdminNoteInput("");
    showToast("Note Added", "Internal architectural memo saved to booking record.");
  };

  const handleBulkStatusChange = (status: BookingStatus) => {
    if (selectedIds.length === 0) return;
    setBookings((prev) =>
      prev.map((b) => (selectedIds.includes(b.id) ? { ...b, status } : b))
    );
    showToast(
      "Bulk Update",
      `Updated ${selectedIds.length} bookings to ${status}.`
    );
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#1E232E]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-wide">
            Booking Management
          </h2>
          <p className="text-xs text-gray-400 font-sans mt-0.5">
            Filter, inspect, and update private consultation and architecture bookings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openNewInquiryModal}
            className="bg-gradient-to-r from-[#D4AF37] to-[#B38F2B] hover:from-[#E5C358] hover:to-[#C29E37] text-black font-bold text-xs px-3.5 py-2 rounded-xl shadow flex items-center gap-1.5 transition-all font-sans"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Create Booking</span>
          </button>
        </div>
      </div>

      {/* 2. CONTROLS BAR: SEARCH, FILTERS, SORT */}
      <div className="bg-[#12161F] border border-[#1E2533] p-4 rounded-2xl shadow-lg space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* SEARCH INPUT */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client, email, booking ID, location..."
              className="w-full bg-[#181E29] border border-[#263143] rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* STATUS FILTER */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#181E29] border border-[#263143] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">New Inquiries</option>
              <option value="CONTACTED">Contacted</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* SERVICE FILTER */}
          <div className="md:col-span-2">
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full bg-[#181E29] border border-[#263143] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="ALL">All Services</option>
              <option value="Haute Architectural Interior">Haute Interior</option>
              <option value="Private Residence Renovation">Private Renovation</option>
              <option value="Luxury Penthouse Staging">Penthouse Staging</option>
              <option value="Bespoke Estate Advisory">Estate Advisory</option>
              <option value="Prime Commercial & Hospitality">Commercial</option>
            </select>
          </div>

          {/* SORT */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-[#181E29] border border-[#263143] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="NEWEST">Sort: Newest</option>
              <option value="OLDEST">Sort: Oldest</option>
              <option value="DATE">Sort: Preferred Date</option>
            </select>
          </div>
        </div>

        {/* BULK ACTIONS TOOLBAR (WHEN SELECTED) */}
        {selectedIds.length > 0 && (
          <div className="pt-3 border-t border-[#1E2533] flex flex-wrap items-center justify-between gap-2 animate-in fade-in">
            <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-mono">
              <span className="font-bold">{selectedIds.length}</span> bookings selected
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-gray-400">Bulk action:</span>
              <button
                type="button"
                onClick={() => handleBulkStatusChange("CONTACTED")}
                className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 text-xs font-mono hover:bg-blue-500/20 transition-all"
              >
                Mark Contacted
              </button>
              <button
                type="button"
                onClick={() => handleBulkStatusChange("CONFIRMED")}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-mono hover:bg-emerald-500/20 transition-all"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="px-2 py-1 rounded-lg text-gray-400 hover:text-white text-xs"
              >
                Deselect
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. BOOKINGS TABLE */}
      <div className="bg-[#12161F] border border-[#1E2533] rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#0D1016] text-[10px] font-mono uppercase tracking-wider text-gray-400 border-b border-[#1E2533]">
              <tr>
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredBookings.length > 0 &&
                      selectedIds.length === filteredBookings.length
                    }
                    onChange={handleSelectAll}
                    className="rounded border-[#2D384D] bg-[#181E29] text-[#D4AF37] focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4 font-bold">Booking ID</th>
                <th className="py-3.5 px-4 font-bold">Client</th>
                <th className="py-3.5 px-4 font-bold hidden md:table-cell">
                  Service &amp; Scope
                </th>
                <th className="py-3.5 px-4 font-bold hidden lg:table-cell">
                  Location
                </th>
                <th className="py-3.5 px-4 font-bold hidden sm:table-cell">
                  Preferred Schedule
                </th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181F2B]">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-14 text-center text-gray-400 font-sans">
                    <Layers className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-white">
                      No matching bookings found
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Try adjusting your search query, status, or service filters.
                    </p>
                    {(searchQuery || statusFilter !== "ALL" || serviceFilter !== "ALL") && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setStatusFilter("ALL");
                          setServiceFilter("ALL");
                        }}
                        className="mt-3 text-xs font-mono text-[#D4AF37] hover:underline"
                      >
                        Clear all filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => {
                  const statusConf = STATUS_CONFIG[booking.status];
                  const isSelected = selectedIds.includes(booking.id);

                  return (
                    <tr
                      key={booking.id}
                      className={`hover:bg-[#161B24] transition-colors group ${
                        isSelected ? "bg-[#181F2D]" : ""
                      }`}
                    >
                      {/* CHECKBOX */}
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(booking.id)}
                          className="rounded border-[#2D384D] bg-[#181E29] text-[#D4AF37] focus:ring-0 cursor-pointer"
                        />
                      </td>

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

                      {/* SERVICE & SCOPE */}
                      <td className="py-3.5 px-4 hidden md:table-cell">
                        <span className="inline-block max-w-[200px] truncate text-gray-200">
                          {booking.service}
                        </span>
                        <div className="text-[10px] text-gray-500 truncate">
                          {booking.propertyType} • {booking.budget}
                        </div>
                      </td>

                      {/* LOCATION */}
                      <td className="py-3.5 px-4 hidden lg:table-cell text-gray-300">
                        <span className="inline-flex items-center gap-1 text-[11px] truncate max-w-[180px]">
                          <MapPin className="w-3 h-3 text-gray-500 flex-shrink-0" />
                          {booking.location}
                        </span>
                      </td>

                      {/* PREFERRED SCHEDULE */}
                      <td className="py-3.5 px-4 hidden sm:table-cell font-mono text-gray-300">
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

                      {/* ACTION BUTTON */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedBooking(booking)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-[#1D2433] hover:bg-[#283246] text-gray-200 hover:text-white text-xs font-mono transition-colors border border-[#2B364A]"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* TABLE FOOTER SUMMARY */}
        <div className="p-4 border-t border-[#1E2533] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs font-mono text-gray-400">
          <span>
            Showing <strong className="text-white">{filteredBookings.length}</strong> of{" "}
            {bookings.length} total bookings
          </span>
          <span className="text-[11px]">
            Production UI View • Real-time mock state
          </span>
        </div>
      </div>

      {/* 4. COMPREHENSIVE BOOKING DETAIL DRAWER / MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedBooking(null)}
          />
          <div className="relative w-full max-w-xl h-full bg-[#12161F] border-l border-[#232B3A] shadow-2xl z-10 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
            {/* DRAWER HEADER */}
            <div className="p-5 border-b border-[#232B3A] bg-[#0E1117] flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1D2533] border border-[#2D394E] text-[#D4AF37] font-mono text-sm font-bold flex items-center justify-center">
                  {selectedBooking.id.substring(3)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#D4AF37]">
                      {selectedBooking.id}
                    </span>
                    {selectedBooking.isVip && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        VIP
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white font-serif">
                    {selectedBooking.clientName}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#1A202C]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* DRAWER BODY */}
            <div className="flex-1 p-5 overflow-y-auto space-y-6 text-xs font-sans">
              {/* STATUS INDICATOR & STATUS SELECTOR */}
              <div className="p-4 rounded-xl bg-[#161B24] border border-[#263143] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold">
                    CURRENT STATUS
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider border ${
                      STATUS_CONFIG[selectedBooking.status].badgeClass
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        STATUS_CONFIG[selectedBooking.status].dotClass
                      }`}
                    />
                    {STATUS_CONFIG[selectedBooking.status].label}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#232B3A]">
                  {(["CONTACTED", "CONFIRMED", "COMPLETED", "CANCELLED"] as BookingStatus[]).map(
                    (st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleUpdateStatus(selectedBooking.id, st)}
                        className={`px-2 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all border ${
                          selectedBooking.status === st
                            ? "bg-[#2A3447] text-white border-[#3F4F6D] shadow-inner"
                            : "bg-[#181E29] text-gray-400 border-[#232B3A] hover:text-white hover:bg-[#1F2633]"
                        }`}
                      >
                        {st}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* CLIENT INFORMATION */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-bold">
                  CLIENT INFORMATION
                </h4>
                <div className="bg-[#161B24] border border-[#263143] rounded-xl p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Full Name</span>
                    <span className="font-semibold text-white">
                      {selectedBooking.clientName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Email Address</span>
                    <a
                      href={`mailto:${selectedBooking.clientEmail}`}
                      className="font-mono text-[#D4AF37] hover:underline"
                    >
                      {selectedBooking.clientEmail}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Direct Phone</span>
                    <a
                      href={`tel:${selectedBooking.clientPhone}`}
                      className="font-mono text-gray-200 hover:underline"
                    >
                      {selectedBooking.clientPhone}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Primary Location</span>
                    <span className="text-gray-200">{selectedBooking.location}</span>
                  </div>
                </div>
              </div>

              {/* PROJECT INFORMATION */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-bold">
                  PROJECT INFORMATION
                </h4>
                <div className="bg-[#161B24] border border-[#263143] rounded-xl p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Haute Service</span>
                    <span className="font-semibold text-white">
                      {selectedBooking.service}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Property / Estate Type</span>
                    <span className="text-white font-medium">
                      {selectedBooking.propertyType}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Square Footage</span>
                    <span className="font-mono text-gray-200">
                      {selectedBooking.squareFootage || "Not specified"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Estimated Budget</span>
                    <span className="font-mono text-emerald-400 font-bold text-xs">
                      {selectedBooking.budget}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Preferred Date &amp; Time</span>
                    <span className="font-mono text-gray-200">
                      {selectedBooking.preferredDate} ({selectedBooking.preferredTime})
                    </span>
                  </div>
                </div>
              </div>

              {/* MESSAGE / INQUIRY */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-bold">
                  CLIENT INQUIRY &amp; SCOPE
                </h4>
                <div className="bg-[#161B24] border border-[#263143] rounded-xl p-3.5 text-gray-200 leading-relaxed font-sans">
                  {selectedBooking.message}
                </div>
              </div>

              {/* INTERNAL ADMIN NOTES */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 font-bold">
                  INTERNAL ARCHITECTURAL MEMOS
                </h4>

                {selectedBooking.notes && selectedBooking.notes.length > 0 ? (
                  <div className="space-y-1.5">
                    {selectedBooking.notes.map((note, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-[#181E29] border border-[#283244] text-[11px] text-gray-300 font-mono"
                      >
                        • {note}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-gray-500 italic">
                    No private admin notes recorded yet.
                  </p>
                )}

                <form onSubmit={handleAddAdminNote} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={adminNoteInput}
                    onChange={(e) => setAdminNoteInput(e.target.value)}
                    placeholder="Add confidential note or follow-up task..."
                    className="flex-1 bg-[#181E29] border border-[#283244] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-[#252E3E] hover:bg-[#323D52] text-[#D4AF37] rounded-xl border border-[#3A4860] font-mono text-xs font-bold"
                  >
                    Add
                  </button>
                </form>
              </div>

              {/* BOOKING METADATA */}
              <div className="pt-2 border-t border-[#232B3A] text-[10px] font-mono text-gray-500 space-y-1">
                <div>Created: {selectedBooking.createdAt}</div>
                <div>Last Modified: {selectedBooking.updatedAt}</div>
              </div>
            </div>

            {/* DRAWER FOOTER */}
            <div className="p-4 border-t border-[#232B3A] bg-[#0E1117] flex items-center justify-between flex-shrink-0">
              <span className="text-[10px] font-mono text-gray-400">
                Booking ID: {selectedBooking.id}
              </span>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 rounded-xl bg-[#1E2533] hover:bg-[#283246] text-white text-xs font-mono font-semibold"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
