"use client";

import React, { useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Plus,
  Filter,
  CheckCircle2,
  X,
  Layers,
  Sparkles,
  Users,
} from "lucide-react";
import {
  INITIAL_CALENDAR_EVENTS,
  CalendarBookingEvent,
  BookingStatus,
} from "./admin-mock-data";
import { useAdmin } from "./AdminLayoutShell";

type CalendarViewMode = "MONTH" | "WEEK" | "DAY";

const STATUS_CHIP_COLORS: Record<BookingStatus, string> = {
  NEW: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  CONTACTED: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  CONFIRMED: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  COMPLETED: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  CANCELLED: "bg-red-500/20 text-red-400 border-red-500/40",
};

export function CalendarScheduler() {
  const { showToast, openNewInquiryModal } = useAdmin();
  const [viewMode, setViewMode] = useState<CalendarViewMode>("MONTH");
  const [currentMonth, setCurrentMonth] = useState("September 2026");
  const [events, setEvents] = useState<CalendarBookingEvent[]>(INITIAL_CALENDAR_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<CalendarBookingEvent | null>(null);

  // Month days generation for September 2026 (Starts on Tuesday Sep 1, 30 days)
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
  const startDayOffset = 1; // Tuesday (0=Mon, 1=Tue in European calendar)

  const getEventsForDay = (day: number) => {
    const dayStr = `2026-09-${day < 10 ? "0" + day : day}`;
    return events.filter((e) => e.date === dayStr);
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER & CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#1E232E]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-wide">
            Private Calendar &amp; Consultations
          </h2>
          <p className="text-xs text-gray-400 font-sans mt-0.5">
            Architectural site surveys, client design briefings, and material presentations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* VIEW SWITCHER */}
          <div className="flex items-center bg-[#181E29] border border-[#263143] rounded-xl p-1">
            {(["MONTH", "WEEK", "DAY"] as CalendarViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`text-[10px] font-mono font-bold px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === mode
                    ? "bg-[#252E3E] text-white shadow-sm border border-[#37445C]"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {mode} View
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={openNewInquiryModal}
            className="bg-gradient-to-r from-[#D4AF37] to-[#B38F2B] hover:from-[#E5C358] hover:to-[#C29E37] text-black font-bold text-xs px-3.5 py-2 rounded-xl shadow flex items-center gap-1.5 transition-all font-sans"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Schedule Session</span>
          </button>
        </div>
      </div>

      {/* 2. CALENDAR NAVIGATION TOOLBAR */}
      <div className="bg-[#12161F] border border-[#1E2533] p-4 rounded-2xl shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => showToast("Navigation", "Viewing previous cycle")}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#181E29] border border-[#232A37]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => showToast("Navigation", "Viewing next cycle")}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#181E29] border border-[#232A37]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h3 className="text-base font-bold text-white font-serif tracking-wide">
            {currentMonth}
          </h3>

          <button
            onClick={() => showToast("Navigation", "Returned to current date")}
            className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-[#181E29] text-gray-300 hover:text-white border border-[#263143]"
          >
            Today
          </button>
        </div>

        {/* STATUS LEGEND */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
          <span className="text-gray-500">Legend:</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> New Inquiry
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Contacted
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Confirmed
          </span>
        </div>
      </div>

      {/* 3. CALENDAR VIEWS */}
      {viewMode === "MONTH" && (
        <div className="bg-[#12161F] border border-[#1E2533] rounded-2xl shadow-xl overflow-hidden">
          {/* DAY NAMES HEADER */}
          <div className="grid grid-cols-7 bg-[#0D1016] border-b border-[#1E2533] text-center text-[10px] font-mono uppercase tracking-wider text-gray-400 py-3">
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
            <div>Sun</div>
          </div>

          {/* MONTH GRID */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-[#181E29] bg-[#0E1117]">
            {/* Blank leading days for offset */}
            {Array.from({ length: startDayOffset }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                className="min-h-[110px] p-2 bg-[#0A0C10]/40"
              />
            ))}

            {/* Days of Month */}
            {daysInMonth.map((day) => {
              const dayEvents = getEventsForDay(day);
              const isToday = day === 12;

              return (
                <div
                  key={day}
                  className={`min-h-[110px] p-2 transition-colors flex flex-col justify-between ${
                    isToday ? "bg-[#161D2B]/70" : "hover:bg-[#141822]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono font-bold ${
                        isToday
                          ? "w-6 h-6 rounded-full bg-[#D4AF37] text-black flex items-center justify-center shadow-md"
                          : "text-gray-400"
                      }`}
                    >
                      {day}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-[9px] font-mono text-gray-500">
                        {dayEvents.length} ev
                      </span>
                    )}
                  </div>

                  {/* EVENTS CHIPS */}
                  <div className="space-y-1 mt-1 flex-1">
                    {dayEvents.map((ev) => (
                      <button
                        key={ev.id}
                        type="button"
                        onClick={() => setSelectedEvent(ev)}
                        className={`w-full text-left p-1 rounded text-[10px] font-mono truncate border block transition-transform hover:scale-[1.02] ${
                          STATUS_CHIP_COLORS[ev.status]
                        }`}
                      >
                        <span className="font-bold">{ev.startTime}</span> • {ev.clientName}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WEEK VIEW */}
      {viewMode === "WEEK" && (
        <div className="bg-[#12161F] border border-[#1E2533] rounded-2xl shadow-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E2533]">
            <h4 className="text-sm font-bold text-white font-serif">
              Week of September 21 – 27, 2026
            </h4>
            <span className="text-xs font-mono text-gray-400">
              Active Studio Schedule
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {[
              { day: "Mon 21", events: [] },
              { day: "Tue 22", events: [] },
              { day: "Wed 23", events: [] },
              {
                day: "Thu 24",
                events: [
                  {
                    time: "14:30 – 16:30",
                    title: "Avenue Montaigne Survey",
                    client: "Eleanor Vance-Roche",
                    loc: "Paris, 8th Arr.",
                    status: "NEW" as BookingStatus,
                  },
                ],
              },
              { day: "Fri 25", events: [] },
              { day: "Sat 26", events: [] },
              { day: "Sun 27", events: [] },
            ].map((col, idx) => (
              <div
                key={idx}
                className="bg-[#161B24] border border-[#232B3A] rounded-xl p-3 min-h-[220px] flex flex-col"
              >
                <span className="text-xs font-mono font-bold text-white block pb-2 border-b border-[#232B3A]">
                  {col.day}
                </span>

                <div className="mt-3 space-y-2 flex-1">
                  {col.events.length === 0 ? (
                    <span className="text-[10px] text-gray-500 italic block pt-2">
                      No consultations
                    </span>
                  ) : (
                    col.events.map((ev, i) => (
                      <div
                        key={i}
                        className={`p-2 rounded-lg border text-xs space-y-1 ${
                          STATUS_CHIP_COLORS[ev.status]
                        }`}
                      >
                        <div className="font-bold text-[11px]">{ev.time}</div>
                        <div className="font-medium text-white">{ev.title}</div>
                        <div className="text-[10px] opacity-80">{ev.client}</div>
                        <div className="text-[9px] opacity-70 flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5" /> {ev.loc}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DAY VIEW */}
      {viewMode === "DAY" && (
        <div className="bg-[#12161F] border border-[#1E2533] rounded-2xl shadow-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E2533]">
            <div>
              <h4 className="text-sm font-bold text-white font-serif">
                Thursday, September 24, 2026
              </h4>
              <p className="text-xs text-gray-400 font-mono">
                1 Private Appointment Scheduled
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#181E29] text-gray-300 border border-[#263143]">
              CET Paris Timezone
            </span>
          </div>

          <div className="space-y-3">
            {[
              { time: "09:00", title: "Studio Material Review (Internal)", active: false },
              { time: "11:00", title: "Open Consultation Slot", active: false },
              {
                time: "14:30 – 16:30",
                title: "Avenue Montaigne Triplex Architectural Survey",
                client: "Eleanor Vance-Roche",
                loc: "Avenue Montaigne, 8th Arr., Paris",
                status: "NEW" as BookingStatus,
                active: true,
              },
              { time: "17:00", title: "Lighting & Stone Suppliers Briefing", active: false },
            ].map((slot, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border flex items-start justify-between gap-4 ${
                  slot.active
                    ? "bg-[#1A2230] border-[#364663]"
                    : "bg-[#141822] border-[#202736] opacity-60"
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-xs font-mono font-bold text-[#D4AF37] w-28">
                    {slot.time}
                  </span>
                  <div>
                    <h5 className="text-sm font-bold text-white">{slot.title}</h5>
                    {slot.client && (
                      <p className="text-xs text-gray-300 mt-0.5">
                        Client: {slot.client}
                      </p>
                    )}
                    {slot.loc && (
                      <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-gray-500" /> {slot.loc}
                      </p>
                    )}
                  </div>
                </div>

                {slot.status && (
                  <span
                    className={`text-[10px] font-mono px-2.5 py-1 rounded-full border font-bold ${
                      STATUS_CHIP_COLORS[slot.status]
                    }`}
                  >
                    {slot.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. EVENT DETAILS MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedEvent(null)}
          />
          <div className="relative bg-[#12161F] border border-[#252E3E] rounded-2xl max-w-md w-full p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-[#252E3E]">
              <div>
                <span className="text-[10px] font-mono text-[#D4AF37] font-bold block">
                  {selectedEvent.bookingId} • {selectedEvent.service}
                </span>
                <h3 className="text-base font-bold text-white font-serif mt-0.5">
                  {selectedEvent.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Client</span>
                <span className="font-semibold text-white">
                  {selectedEvent.clientName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Date</span>
                <span className="font-mono text-gray-200">
                  {selectedEvent.date}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Time Window</span>
                <span className="font-mono text-gray-200">
                  {selectedEvent.startTime} – {selectedEvent.endTime}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Location</span>
                <span className="text-gray-200">{selectedEvent.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Status</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                    STATUS_CHIP_COLORS[selectedEvent.status]
                  }`}
                >
                  {selectedEvent.status}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#252E3E] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 rounded-xl bg-[#1E2533] text-gray-300 hover:text-white text-xs font-mono"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
