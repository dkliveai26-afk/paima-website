"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Layers,
  CheckCircle2,
  RefreshCw,
  User,
  ExternalLink,
} from "lucide-react";
import { useAdmin } from "./AdminLayoutShell";
import { BookingRecord, BookingStatus } from "@/lib/db-server";

export function CalendarScheduler() {
  const { showToast } = useAdmin();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const [errorState, setErrorState] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    setErrorState(false);
    try {
      const res = await fetch("/api/admin/bookings");
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
      console.error("Fetch calendar error:", err);
      setErrorState(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Group bookings by date string (YYYY-MM-DD)
  const bookingsByDate: Record<string, BookingRecord[]> = {};
  for (const b of bookings) {
    if (b.preferredDate) {
      // normalize date string
      const dateKey = b.preferredDate.split("T")[0];
      if (!bookingsByDate[dateKey]) bookingsByDate[dateKey] = [];
      bookingsByDate[dateKey].push(b);
    }
  }

  // Days array for current month grid
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    days.push({ day: d, dateStr });
  }

  const selectedDayBookings = bookingsByDate[selectedDate] || [];

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E5D5C5]">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-[#B3877F]" />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#B3877F] font-bold">
              CONSULTATION SCHEDULE
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1C1614] mt-1">
            Private Calendar &amp; Consultations
          </h2>
          <p className="text-xs text-[#5D4A44] mt-0.5">
            Confirmed consultations and preferred appointment requests from active dossiers.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchBookings}
          className="px-3.5 py-2 rounded-xl bg-[#F7F2EA] hover:bg-[#F2E8E3] text-[#4A3B36] text-xs font-semibold border border-[#E5D5C5] flex items-center gap-2 transition-all cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#B3877F]" : "text-[#B3877F]"}`} />
          <span>Sync Calendar</span>
        </button>
      </div>

      {/* 2. CALENDAR GRID + DAY DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Monthly Calendar View */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#F7F2EA] border border-[#E5D5C5] space-y-6">
          {/* Month Navigator Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-[#1C1614]">
              {monthNames[month]} {year}
            </h3>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevMonth}
                className="p-2 rounded-xl bg-[#FDFBF7] hover:bg-[#F2E8E3] text-[#4A3B36] border border-[#E5D5C5] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const now = new Date();
                  setCurrentDate(now);
                  setSelectedDate(now.toISOString().split("T")[0]);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#FDFBF7] hover:bg-[#F2E8E3] text-[#4A3B36] text-xs font-mono font-bold border border-[#E5D5C5]"
              >
                Today
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="p-2 rounded-xl bg-[#FDFBF7] hover:bg-[#F2E8E3] text-[#4A3B36] border border-[#E5D5C5] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Names */}
          <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-mono font-bold text-[#7D6B64] uppercase tracking-wider">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((item, index) => {
              if (!item) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="min-h-[70px] sm:min-h-[85px] rounded-xl bg-[#FDFBF7]/50 border border-transparent"
                  />
                );
              }

              const hasEvents = bookingsByDate[item.dateStr]?.length > 0;
              const isSelected = selectedDate === item.dateStr;
              const isToday =
                new Date().toISOString().split("T")[0] === item.dateStr;

              return (
                <button
                  key={item.dateStr}
                  type="button"
                  onClick={() => setSelectedDate(item.dateStr)}
                  className={`min-h-[70px] sm:min-h-[85px] p-2 rounded-xl border flex flex-col justify-between transition-all text-left group cursor-pointer ${
                    isSelected
                      ? "bg-[#FDFBF7] border-[#B3877F] shadow-sm"
                      : "bg-[#FDFBF7] border-[#E5D5C5] hover:border-[#D8C5BD]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono font-bold ${
                        isToday
                          ? "px-1.5 py-0.5 rounded-md bg-[#EAD8D3] text-[#1C1614]"
                          : isSelected
                          ? "text-[#4A3B36]"
                          : "text-[#7D6B64]"
                      }`}
                    >
                      {item.day}
                    </span>

                    {hasEvents && (
                      <span className="w-2 h-2 rounded-full bg-[#B3877F] shadow-[0_0_6px_#EAD8D3]" />
                    )}
                  </div>

                  {hasEvents && (
                    <div className="space-y-1 mt-1">
                      <div className="px-1.5 py-0.5 rounded bg-[#F2E8E3] text-[9px] font-mono text-[#5D4A44] truncate border border-[#E5D5C5]">
                        {bookingsByDate[item.dateStr].length}{" "}
                        {bookingsByDate[item.dateStr].length === 1 ? "Consult" : "Consults"}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Day's Bookings */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#F7F2EA] border border-[#E5D5C5] space-y-4">
          <div className="pb-3 border-b border-[#E5D5C5]">
            <span className="text-[10px] font-mono uppercase text-[#B3877F] font-bold">
              SCHEDULED DOSSIERS
            </span>
            <h3 className="font-serif text-lg font-bold text-[#1C1614] mt-0.5">
              {new Date(selectedDate + "T00:00:00").toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h3>
          </div>

          {selectedDayBookings.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <CalendarIcon className="w-8 h-8 mx-auto text-[#7D6B64]/60" />
              <p className="text-xs text-[#7D6B64]">
                No consultations scheduled for this date.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDayBookings.map((b) => (
                <div
                  key={b.bookingId}
                  className="p-4 rounded-xl bg-[#FDFBF7] border border-[#E5D5C5] space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#4A3B36] font-bold">
                      {b.bookingId}
                    </span>
                    <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#EAD8D3] text-[#4A3B36] border border-[#D8C5BD] font-bold">
                      {b.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#1C1614]">
                      {b.fullName}
                    </h4>
                    <p className="text-[11px] text-[#5D4A44]">{b.service}</p>
                  </div>

                  <div className="space-y-1 text-[11px] text-[#7D6B64] pt-1 border-t border-[#E5D5C5]">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#B3877F]" />
                      <span className="font-mono text-[#4A3B36]">{b.preferredTime || "10:00 AM"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#B3877F]" />
                      <span>{b.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
