"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  RefreshCw,
  Eye,
  ExternalLink,
} from "lucide-react";
import { useAdmin } from "./AdminLayoutShell";
import { CustomerSummary } from "@/lib/db-server";

export function CustomersManagement() {
  const { showToast } = useAdmin();
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerSummary | null>(null);

  const [errorState, setErrorState] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    setErrorState(false);
    try {
      const res = await fetch("/api/admin/customers");
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
      setCustomers(data.customers || []);
    } catch (err: any) {
      console.error("Fetch customers error:", err);
      setErrorState(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E5D5C5]">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#B3877F]" />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#B3877F] font-bold">
              PATRON &amp; CLIENT DIRECTORY
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1C1614] mt-1">
            Client Dossiers &amp; Patrons
          </h2>
          <p className="text-xs text-[#5D4A44] mt-0.5">
            Verified private clients and patrons automatically recorded from authentic booking submissions.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchCustomers}
          className="px-3.5 py-2 rounded-xl bg-[#F7F2EA] hover:bg-[#F2E8E3] text-[#4A3B36] text-xs font-semibold border border-[#E5D5C5] flex items-center gap-2 transition-all cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#B3877F]" : "text-[#B3877F]"}`} />
          <span>Sync Directory</span>
        </button>
      </div>

      {/* 2. SEARCH TOOLBAR */}
      <div className="p-4 rounded-2xl bg-[#F7F2EA] border border-[#E5D5C5] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7D6B64]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patrons by name, email, phone, location..."
            className="w-full bg-[#FDFBF7] border border-[#E5D5C5] rounded-xl pl-10 pr-4 py-2 text-xs text-[#1C1614] placeholder-[#7D6B64] outline-none focus:border-[#B3877F]"
          />
        </div>

        <span className="text-xs font-mono text-[#7D6B64] self-end sm:self-auto">
          Showing {filteredCustomers.length} verified {filteredCustomers.length === 1 ? "patron" : "patrons"}
        </span>
      </div>

      {/* 3. CUSTOMER GRID / CARDS */}
      {loading ? (
        <div className="py-20 text-center text-xs text-[#7D6B64] font-mono">
          Loading patron profiles from database...
        </div>
      ) : errorState ? (
        <div className="rounded-2xl bg-[#F7F2EA] border border-[#E5D5C5] p-12 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#EAD8D3] border border-[#D8C5BD] flex items-center justify-center text-[#4A3B36]">
            <Users className="w-6 h-6 text-[#B3877F]" />
          </div>
          <h3 className="text-base font-bold text-[#1C1614]">Data Service Temporarily Unavailable</h3>
          <p className="text-xs text-[#7D6B64] max-w-sm mx-auto">
            Unable to load data right now. Please try again.
          </p>
          <div>
            <button
              type="button"
              onClick={fetchCustomers}
              className="px-4 py-2 rounded-xl bg-[#1C1614] text-[#FDFBF7] text-xs font-bold shadow-md hover:bg-[#2D2326] transition-all inline-flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#B3877F]" />
              <span>Retry</span>
            </button>
          </div>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="rounded-2xl bg-[#F7F2EA] border border-[#E5D5C5] p-12 text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#F2E8E3] border border-[#E5D5C5] flex items-center justify-center text-[#7D6B64]">
            <Users className="w-7 h-7 text-[#B3877F]" />
          </div>
          <h3 className="text-base font-bold text-[#1C1614]">No client records yet</h3>
          <p className="text-xs text-[#7D6B64] max-w-sm mx-auto">
            When clients submit architectural consultation requests through the website, their verified dossiers will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCustomers.map((client) => (
            <div
              key={client.email}
              className="rounded-2xl bg-[#FDFBF7] border border-[#E5D5C5] p-5 space-y-4 hover:border-[#D8C5BD] transition-all group relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-[#F2E8E3] border border-[#E5D5C5] flex items-center justify-center text-[#4A3B36] font-serif font-bold text-base shrink-0">
                    {client.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-serif text-base font-bold text-[#1C1614] truncate group-hover:text-[#4A3B36] transition-colors">
                      {client.name}
                    </h4>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#7D6B64] block truncate">
                      {client.id}
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#EAD8D3] text-[#4A3B36] border border-[#D8C5BD] shrink-0">
                  {client.status}
                </span>
              </div>

              {/* Contact Details */}
              <div className="space-y-1.5 pt-2 border-t border-[#E5D5C5] text-xs">
                <div className="flex items-center gap-2 text-[#5D4A44]">
                  <Mail className="w-3.5 h-3.5 text-[#B3877F] shrink-0" />
                  <span className="truncate">{client.email}</span>
                </div>
                {client.phone !== "Unspecified" && (
                  <div className="flex items-center gap-2 text-[#5D4A44]">
                    <Phone className="w-3.5 h-3.5 text-[#B3877F] shrink-0" />
                    <span className="font-mono text-[11px]">{client.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-[#5D4A44]">
                  <MapPin className="w-3.5 h-3.5 text-[#B3877F] shrink-0" />
                  <span className="truncate">{client.location}</span>
                </div>
              </div>

              {/* Commission Stats */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E5D5C5] text-xs">
                <div className="p-2 rounded-xl bg-[#F7F2EA] border border-[#E5D5C5]">
                  <span className="text-[9px] font-mono uppercase text-[#7D6B64] block">Dossiers</span>
                  <span className="font-bold text-[#1C1614]">{client.totalBookings} Total</span>
                </div>
                <div className="p-2 rounded-xl bg-[#F7F2EA] border border-[#E5D5C5]">
                  <span className="text-[9px] font-mono uppercase text-[#7D6B64] block">Latest Inquired</span>
                  <span className="font-mono text-[11px] text-[#4A3B36] truncate block">
                    {client.latestBookingDate}
                  </span>
                </div>
              </div>

              {/* Latest Service */}
              <div className="pt-2 border-t border-[#E5D5C5] flex items-center justify-between text-[11px]">
                <span className="text-[#7D6B64] truncate max-w-[200px]">
                  {client.latestService}
                </span>
                <span className="font-mono font-bold text-[#4A3B36]">
                  {client.totalBudget}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
