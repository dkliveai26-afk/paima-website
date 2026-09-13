"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  Search,
  ShieldCheck,
  RefreshCw,
  Clock,
  Layers,
  Settings,
  MessageSquare,
  Users,
  Lock,
} from "lucide-react";
import { useAdmin } from "./AdminLayoutShell";
import { AdminActivityRecord } from "@/lib/db-server";

export function AdminActivityView() {
  const { showToast } = useAdmin();
  const [activities, setActivities] = useState<AdminActivityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [errorState, setErrorState] = useState(false);

  const fetchActivities = async () => {
    setLoading(true);
    setErrorState(false);
    try {
      const res = await fetch("/api/admin/activity");
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
      setActivities(data.activities || []);
    } catch (err: any) {
      console.error("Fetch activities error:", err);
      setErrorState(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const filteredActivities = activities.filter((act) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      act.action.toLowerCase().includes(q) ||
      act.description.toLowerCase().includes(q) ||
      act.actorEmail.toLowerCase().includes(q) ||
      (act.entityId && act.entityId.toLowerCase().includes(q))
    );
  });

  const getEntityIcon = (type: string) => {
    switch (type) {
      case "BOOKING":
        return <Layers className="w-4 h-4 text-[#4A3B36]" />;
      case "MESSAGE":
        return <MessageSquare className="w-4 h-4 text-[#B3877F]" />;
      case "SETTINGS":
        return <Settings className="w-4 h-4 text-[#7D6B64]" />;
      case "SESSION":
        return <Lock className="w-4 h-4 text-emerald-600" />;
      default:
        return <Activity className="w-4 h-4 text-[#B3877F]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E5D5C5]">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#B3877F]" />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#B3877F] font-bold">
              AUDIT &amp; SECURITY TRAIL
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1C1614] mt-1">
            System Audit &amp; Activity Log
          </h2>
          <p className="text-xs text-[#5D4A44] mt-0.5">
            Immutable log of all administrative actions, booking status transitions, and data operations.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchActivities}
          className="px-3.5 py-2 rounded-xl bg-[#F7F2EA] hover:bg-[#F2E8E3] text-[#4A3B36] text-xs font-semibold border border-[#E5D5C5] flex items-center gap-2 transition-all cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#B3877F]" : "text-[#B3877F]"}`} />
          <span>Refresh Trail</span>
        </button>
      </div>

      {/* 2. SEARCH TOOLBAR */}
      <div className="p-4 rounded-2xl bg-[#F7F2EA] border border-[#E5D5C5] flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7D6B64]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit trail by actor, action, dossier ID..."
            className="w-full bg-[#FDFBF7] border border-[#E5D5C5] rounded-xl pl-10 pr-4 py-2 text-xs text-[#1C1614] placeholder-[#7D6B64] outline-none focus:border-[#B3877F]"
          />
        </div>

        <span className="text-xs font-mono text-[#7D6B64]">
          {filteredActivities.length} recorded events
        </span>
      </div>

      {/* 3. AUDIT TIMELINE */}
      <div className="rounded-2xl bg-[#F7F2EA] border border-[#E5D5C5] p-6 space-y-4 shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-xs text-[#7D6B64] font-mono">
            Loading audit activities from database...
          </div>
        ) : errorState ? (
          <div className="py-16 px-4 text-center space-y-3">
            <Activity className="w-10 h-10 mx-auto text-[#B3877F]" />
            <p className="text-base font-bold text-[#1C1614]">Data Service Temporarily Unavailable</p>
            <p className="text-xs text-[#7D6B64] max-w-sm mx-auto">
              Unable to load data right now. Please try again.
            </p>
            <button
              type="button"
              onClick={fetchActivities}
              className="px-4 py-2 rounded-xl bg-[#1C1614] text-[#FDFBF7] text-xs font-bold shadow-md hover:bg-[#2D2326] transition-all inline-flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#B3877F]" />
              <span>Retry</span>
            </button>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <Activity className="w-10 h-10 mx-auto text-[#7D6B64]/60" />
            <p className="text-sm font-bold text-[#1C1614]">No audit records found</p>
            <p className="text-xs text-[#7D6B64]">
              Administrative actions will automatically generate real audit trail entries.
            </p>
          </div>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-[1px] before:bg-[#E5D5C5]">
            {filteredActivities.map((act) => (
              <div key={act.id} className="relative group">
                {/* Dot */}
                <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full bg-[#F7F2EA] border-2 border-[#B3877F] group-hover:scale-125 transition-transform" />

                <div className="p-4 rounded-xl bg-[#FDFBF7] border border-[#E5D5C5] hover:border-[#D8C5BD] transition-all space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-[#F2E8E3] border border-[#E5D5C5]">
                        {getEntityIcon(act.entityType)}
                      </div>
                      <span className="font-mono text-xs font-bold text-[#4A3B36]">
                        {act.action}
                      </span>
                      {act.entityId && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FDFBF7] text-[#7D6B64] border border-[#E5D5C5]">
                          {act.entityId}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono text-[#7D6B64]">
                      <Clock className="w-3 h-3 text-[#B3877F]" />
                      <span>{new Date(act.timestamp).toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#1C1614]">{act.description}</p>

                  <div className="pt-2 border-t border-[#E5D5C5] flex items-center justify-between text-[10px] font-mono text-[#7D6B64]">
                    <span>
                      Actor: <strong className="text-[#4A3B36]">{act.actorEmail}</strong>
                    </span>
                    <span className="text-[#7D6B64]">Event ID: {act.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
