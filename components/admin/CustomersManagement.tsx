"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  Eye,
  X,
  DollarSign,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import {
  INITIAL_CUSTOMERS,
  Customer,
  INITIAL_BOOKINGS,
  Booking,
} from "./admin-mock-data";
import { useAdmin } from "./AdminLayoutShell";

const CUSTOMER_STATUS_STYLES: Record<
  Customer["status"],
  { badge: string; dot: string }
> = {
  "VIP Client": {
    badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    dot: "bg-amber-400",
  },
  "Active Client": {
    badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    dot: "bg-emerald-400",
  },
  "New Lead": {
    badge: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    dot: "bg-blue-400",
  },
  Archived: {
    badge: "bg-gray-500/15 text-gray-400 border-gray-500/30",
    dot: "bg-gray-400",
  },
};

export function CustomersManagement() {
  const { showToast } = useAdmin();
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"RECENT" | "BOOKINGS" | "BUDGET">("RECENT");

  // Filter logic
  const filteredCustomers = customers
    .filter((c) => {
      if (statusFilter !== "ALL" && c.status !== statusFilter) return false;
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(query);
        const matchesEmail = c.email.toLowerCase().includes(query);
        const matchesLoc = c.location.toLowerCase().includes(query);
        const matchesPhone = c.phone.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesLoc && !matchesPhone) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "BOOKINGS") {
        return b.totalBookings - a.totalBookings;
      }
      if (sortBy === "RECENT") {
        return (
          new Date(b.latestBookingDate).getTime() -
          new Date(a.latestBookingDate).getTime()
        );
      }
      return 0;
    });

  // Find associated bookings for the customer
  const getCustomerBookings = (customerEmail: string): Booking[] => {
    return INITIAL_BOOKINGS.filter(
      (b) => b.clientEmail.toLowerCase() === customerEmail.toLowerCase()
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#1E232E]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-wide">
            Customer Directory
          </h2>
          <p className="text-xs text-gray-400 font-sans mt-0.5">
            Manage high-net-worth private clientele, historical estate engagements, and records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161B23] border border-[#262F3F] text-[11px] font-mono text-gray-300">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            Strict Confidentiality
          </span>
        </div>
      </div>

      {/* 2. CONTROLS BAR: SEARCH, FILTERS, SORT */}
      <div className="bg-[#12161F] border border-[#1E2533] p-4 rounded-2xl shadow-lg space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* SEARCH INPUT */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clientele by name, email, city, phone..."
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
              <option value="ALL">All Client Tiers</option>
              <option value="VIP Client">VIP Clients</option>
              <option value="Active Client">Active Clients</option>
              <option value="New Lead">New Leads</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          {/* SORT */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-[#181E29] border border-[#263143] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="RECENT">Sort: Recent Activity</option>
              <option value="BOOKINGS">Sort: Most Bookings</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. CUSTOMER TABLE */}
      <div className="bg-[#12161F] border border-[#1E2533] rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#0D1016] text-[10px] font-mono uppercase tracking-wider text-gray-400 border-b border-[#1E2533]">
              <tr>
                <th className="py-3.5 px-4 font-bold">Client Profile</th>
                <th className="py-3.5 px-4 font-bold hidden sm:table-cell">
                  Location
                </th>
                <th className="py-3.5 px-4 font-bold">Total Bookings</th>
                <th className="py-3.5 px-4 font-bold hidden md:table-cell">
                  Portfolio Scope / LTV
                </th>
                <th className="py-3.5 px-4 font-bold hidden lg:table-cell">
                  Latest Engagement
                </th>
                <th className="py-3.5 px-4 font-bold">Tier / Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181F2B]">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center text-gray-400 font-sans">
                    <Users className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-white">
                      No customers found
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      No records match the current search or status filter.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const style = CUSTOMER_STATUS_STYLES[cust.status];

                  return (
                    <tr
                      key={cust.id}
                      className="hover:bg-[#161B24] transition-colors group"
                    >
                      {/* CLIENT PROFILE */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#1D2533] border border-[#2E3B52] text-[#D4AF37] font-mono text-xs font-bold flex items-center justify-center flex-shrink-0 shadow-inner">
                            {cust.avatar}
                          </div>
                          <div>
                            <div className="font-semibold text-white group-hover:text-[#D4AF37] transition-colors">
                              {cust.name}
                            </div>
                            <div className="text-[11px] text-gray-400 font-mono">
                              {cust.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* LOCATION */}
                      <td className="py-3.5 px-4 hidden sm:table-cell text-gray-300">
                        <span className="inline-flex items-center gap-1 text-[11px]">
                          <MapPin className="w-3 h-3 text-gray-500" />
                          {cust.location}
                        </span>
                      </td>

                      {/* TOTAL BOOKINGS */}
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        <span className="px-2 py-0.5 rounded-lg bg-[#181E29] border border-[#263143]">
                          {cust.totalBookings} Project{cust.totalBookings > 1 ? "s" : ""}
                        </span>
                      </td>

                      {/* PORTFOLIO SCOPE / LTV */}
                      <td className="py-3.5 px-4 hidden md:table-cell font-mono font-semibold text-emerald-400">
                        {cust.totalBudget}
                      </td>

                      {/* LATEST ENGAGEMENT */}
                      <td className="py-3.5 px-4 hidden lg:table-cell text-gray-300">
                        <div className="text-[11px] text-gray-200 truncate max-w-[160px]">
                          {cust.latestService}
                        </div>
                        <div className="text-[10px] text-gray-500 font-mono">
                          {cust.latestBookingDate}
                        </div>
                      </td>

                      {/* TIER / STATUS */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider border ${style.badge}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                          {cust.status}
                        </span>
                      </td>

                      {/* ACTION BUTTON */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedCustomer(cust)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-[#1D2433] hover:bg-[#283246] text-gray-200 hover:text-white text-xs font-mono transition-colors border border-[#2B364A]"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Dossier</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-[#1E2533] flex items-center justify-between text-xs font-mono text-gray-400">
          <span>
            Total VIP &amp; Active Clients:{" "}
            <strong className="text-white">{customers.length}</strong>
          </span>
          <span className="text-[11px]">Private Registry</span>
        </div>
      </div>

      {/* 4. CUSTOMER PROFILE DOSSIER DRAWER */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedCustomer(null)}
          />
          <div className="relative w-full max-w-xl h-full bg-[#12161F] border-l border-[#232B3A] shadow-2xl z-10 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
            {/* DRAWER HEADER */}
            <div className="p-5 border-b border-[#232B3A] bg-[#0E1117] flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#1E2533] to-[#2E394E] border border-[#3E4C66] text-[#D4AF37] font-mono text-sm font-bold flex items-center justify-center">
                  {selectedCustomer.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#D4AF37]">
                      {selectedCustomer.id}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-full border font-bold ${
                        CUSTOMER_STATUS_STYLES[selectedCustomer.status].badge
                      }`}
                    >
                      {selectedCustomer.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-serif mt-0.5">
                    {selectedCustomer.name}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#1A202C]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* DRAWER BODY */}
            <div className="flex-1 p-5 overflow-y-auto space-y-6 text-xs font-sans">
              {/* CONTACT DETAILS */}
              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-bold mb-2">
                  CLIENT CONTACT &amp; LOCATION
                </h4>
                <div className="bg-[#161B24] border border-[#263143] rounded-xl p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-gray-500" />
                      Email
                    </span>
                    <a
                      href={`mailto:${selectedCustomer.email}`}
                      className="font-mono text-[#D4AF37] hover:underline"
                    >
                      {selectedCustomer.email}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-gray-500" />
                      Direct Telephone
                    </span>
                    <a
                      href={`tel:${selectedCustomer.phone}`}
                      className="font-mono text-gray-200 hover:underline"
                    >
                      {selectedCustomer.phone}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-500" />
                      Primary Residences
                    </span>
                    <span className="text-gray-200">{selectedCustomer.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-500" />
                      Client Since
                    </span>
                    <span className="font-mono text-gray-400">
                      {selectedCustomer.joinedDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* CLIENT METRICS */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#161B24] border border-[#263143]">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">
                    TOTAL COMMISSIONS
                  </span>
                  <span className="text-xl font-bold font-serif text-white mt-1 block">
                    {selectedCustomer.totalBookings} Completed / Active
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#161B24] border border-[#263143]">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">
                    ESTIMATED LIFETIME VALUE
                  </span>
                  <span className="text-xl font-bold font-serif text-emerald-400 mt-1 block">
                    {selectedCustomer.totalBudget}
                  </span>
                </div>
              </div>

              {/* BOOKING HISTORY */}
              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-bold mb-2">
                  ASSOCIATED INQUIRIES &amp; BOOKINGS
                </h4>
                <div className="space-y-2">
                  {getCustomerBookings(selectedCustomer.email).map((bk) => (
                    <div
                      key={bk.id}
                      className="p-3 rounded-xl bg-[#161B24] border border-[#263143] space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-white text-xs">
                          {bk.id} • {bk.service}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-300">
                          {bk.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400">
                        {bk.propertyType} — {bk.location}
                      </p>
                      <div className="text-[10px] font-mono text-gray-500">
                        Scheduled: {bk.preferredDate} ({bk.preferredTime})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* DRAWER FOOTER */}
            <div className="p-4 border-t border-[#232B3A] bg-[#0E1117] flex items-center justify-between flex-shrink-0">
              <button
                type="button"
                onClick={() =>
                  showToast(
                    "Email Drafted",
                    `Direct VIP outreach generated for ${selectedCustomer.email}`
                  )
                }
                className="px-3.5 py-2 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-xs font-mono font-bold transition-all"
              >
                Draft Direct Message
              </button>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 rounded-xl bg-[#1E2533] hover:bg-[#283246] text-white text-xs font-mono font-semibold"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
