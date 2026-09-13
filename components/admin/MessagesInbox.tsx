"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Search,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Eye,
  Reply,
  X,
  AlertCircle,
  Filter,
} from "lucide-react";
import { useAdmin } from "./AdminLayoutShell";
import { InquiryRecord } from "@/lib/db-server";

type StatusFilter = "ALL" | "UNREAD" | "READ" | "REPLIED" | "ARCHIVED";

const STATUS_CONFIG: Record<
  NonNullable<InquiryRecord["status"]>,
  { label: string; badgeClass: string; dotClass: string }
> = {
  UNREAD: {
    label: "UNREAD",
    badgeClass: "bg-[#EAD8D3] text-[#4A3B36] border-[#D8C5BD]",
    dotClass: "bg-[#B3877F]",
  },
  READ: {
    label: "READ",
    badgeClass: "bg-[#F2E8E3] text-[#5D4A44] border-[#E5D5C5]",
    dotClass: "bg-[#7D6B64]",
  },
  REPLIED: {
    label: "REPLIED",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-500",
  },
  ARCHIVED: {
    label: "ARCHIVED",
    badgeClass: "bg-slate-100 text-slate-600 border-slate-200",
    dotClass: "bg-slate-400",
  },
};

export function MessagesInbox() {
  const { showToast, refreshStats } = useAdmin();
  const [messages, setMessages] = useState<InquiryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [selectedMessage, setSelectedMessage] = useState<InquiryRecord | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<InquiryRecord | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [errorState, setErrorState] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    setErrorState(false);
    try {
      const res = await fetch("/api/admin/messages");
      if (!res.ok) {
        setErrorState(true);
        if (res.status === 401 || res.status === 403) {
          showToast(
            "Session Notice",
            "Your executive session may have expired. Please refresh or sign in again.",
            "error"
          );
        } else {
          showToast("Notice", "Unable to load enquiries right now. Please try again.", "error");
        }
        return;
      }
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err: any) {
      console.error("Fetch messages error:", err);
      setErrorState(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Auto-mark as READ when opening a message
  const openMessage = async (msg: InquiryRecord) => {
    setSelectedMessage(msg);
    if (msg.status === "UNREAD") {
      await handleUpdateStatus(msg.id, "READ", true);
    }
  };

  const handleUpdateStatus = async (
    id: string,
    status: InquiryRecord["status"],
    silent = false
  ) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        if (!silent)
          showToast("Error", "Failed to update status. Please try again.", "error");
        return;
      }

      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage((prev) => (prev ? { ...prev, status } : null));
      }
      if (!silent) {
        showToast("Updated", `Enquiry marked as ${status}.`, "success");
        refreshStats();
      } else {
        refreshStats();
      }
    } catch (err: any) {
      if (!silent)
        showToast("Error", "Failed to update status. Please try again.", "error");
    }
  };

  const handleDeleteMessage = async () => {
    if (!messageToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/messages/${messageToDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        showToast("Error", errData.error || "Failed to delete enquiry.", "error");
        return;
      }

      setMessages((prev) => prev.filter((m) => m.id !== messageToDelete.id));
      if (selectedMessage?.id === messageToDelete.id) {
        setSelectedMessage(null);
      }
      showToast(
        "Deleted",
        `Enquiry from ${messageToDelete.name} has been permanently deleted.`,
        "success"
      );
      setMessageToDelete(null);
      refreshStats();
    } catch (err: any) {
      showToast("Error", "Failed to delete enquiry. Please try again.", "error");
    } finally {
      setDeleting(false);
    }
  };

  // Client-side filtering (data set is small enough)
  const filteredMessages = messages.filter((m) => {
    const matchesStatus =
      statusFilter === "ALL" || m.status === statusFilter;
    if (!search) return matchesStatus;
    const q = search.toLowerCase();
    const matchesSearch =
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      (m.phone || "").toLowerCase().includes(q) ||
      (m.subject || "").toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const unreadCount = messages.filter((m) => m.status === "UNREAD").length;

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E5D5C5]">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#B3877F]" />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#B3877F] font-bold">
              CLIENT ENQUIRY INBOX
            </span>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#EAD8D3] text-[#4A3B36] border border-[#D8C5BD]">
                {unreadCount} unread
              </span>
            )}
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1C1614] mt-1">
            Contact Enquiries &amp; Messages
          </h2>
          <p className="text-xs text-[#5D4A44] mt-0.5">
            All contact form submissions and private inquiry messages from the website.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchMessages}
          className="px-3.5 py-2 rounded-xl bg-[#F7F2EA] hover:bg-[#F2E8E3] text-[#4A3B36] text-xs font-semibold border border-[#E5D5C5] flex items-center gap-2 transition-all cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#B3877F]" : "text-[#B3877F]"}`}
          />
          <span>Sync Inbox</span>
        </button>
      </div>

      {/* 2. SEARCH + FILTER TOOLBAR */}
      <div className="p-4 rounded-2xl bg-[#F7F2EA] border border-[#E5D5C5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7D6B64]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, subject..."
            className="w-full bg-[#FDFBF7] border border-[#E5D5C5] rounded-xl pl-10 pr-4 py-2 text-xs text-[#1C1614] placeholder-[#7D6B64] outline-none focus:border-[#B3877F] transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#7D6B64]" />
            <span className="text-[10px] font-mono text-[#7D6B64] uppercase">Filter:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="bg-[#FDFBF7] border border-[#E5D5C5] text-[#1C1614] text-xs rounded-xl px-3 py-1.5 outline-none focus:border-[#B3877F] cursor-pointer"
            >
              <option value="ALL">All Enquiries</option>
              <option value="UNREAD">Unread</option>
              <option value="READ">Read</option>
              <option value="REPLIED">Replied</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <span className="text-xs font-mono text-[#7D6B64]">
            {filteredMessages.length}{" "}
            {filteredMessages.length === 1 ? "enquiry" : "enquiries"}
          </span>
        </div>
      </div>

      {/* 3. MESSAGES LIST */}
      <div className="rounded-2xl bg-[#F7F2EA] border border-[#E5D5C5] overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-xs text-[#7D6B64] font-mono">
            Loading enquiries from database...
          </div>
        ) : errorState ? (
          <div className="py-16 px-4 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#EAD8D3] border border-[#D8C5BD] flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-[#B3877F]" />
            </div>
            <div>
              <p className="text-base font-bold text-[#1C1614]">Unable to Load Enquiries</p>
              <p className="text-xs text-[#7D6B64] mt-1 max-w-sm mx-auto">
                There was a problem connecting to the database. Please try again.
              </p>
            </div>
            <button
              type="button"
              onClick={fetchMessages}
              className="px-4 py-2 rounded-xl bg-[#1C1614] hover:bg-[#2D2326] text-[#FDFBF7] text-xs font-bold transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#B3877F]" />
              <span>Retry</span>
            </button>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#F2E8E3] border border-[#E5D5C5] flex items-center justify-center">
              <MessageSquare className="w-7 h-7 text-[#B3877F]" />
            </div>
            <div>
              <p className="text-base font-bold text-[#1C1614]">
                {search || statusFilter !== "ALL" ? "No matching enquiries" : "Inbox is empty"}
              </p>
              <p className="text-xs text-[#7D6B64] mt-1 max-w-sm mx-auto">
                {search || statusFilter !== "ALL"
                  ? "Try adjusting your search or filter."
                  : "Contact form submissions will appear here automatically."}
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-[#E5D5C5]">
            {filteredMessages.map((msg) => {
              const statusCfg = STATUS_CONFIG[msg.status] || STATUS_CONFIG.UNREAD;
              return (
                <div
                  key={msg.id}
                  className={`p-5 hover:bg-[#F2E8E3] transition-colors group ${
                    msg.status === "UNREAD" ? "bg-[#FDFBF7]" : ""
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left: Message Info */}
                    <div
                      className="space-y-1 min-w-0 flex-1 cursor-pointer"
                      onClick={() => openMessage(msg)}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-serif font-bold text-sm text-[#1C1614]">
                          {msg.name}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border ${statusCfg.badgeClass}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dotClass}`} />
                          {statusCfg.label}
                        </span>
                        <span className="text-[10px] font-mono text-[#7D6B64]">
                          {msg.email}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-[#4A3B36] truncate">
                        {msg.subject || "General Consultation Inquiry"}
                      </p>
                      <p className="text-xs text-[#7D6B64] truncate max-w-2xl">
                        {msg.message}
                      </p>
                    </div>

                    {/* Right: Date + Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <span className="text-[10px] font-mono text-[#7D6B64]">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>

                      {/* View button */}
                      <button
                        type="button"
                        title="View Full Enquiry"
                        onClick={() => openMessage(msg)}
                        className="p-1.5 rounded-lg bg-[#FDFBF7] hover:bg-[#F2E8E3] border border-[#E5D5C5] text-[#4A3B36] transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Toggle read/unread */}
                      <button
                        type="button"
                        title={msg.status === "UNREAD" ? "Mark as Read" : "Mark as Unread"}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateStatus(
                            msg.id,
                            msg.status === "UNREAD" ? "READ" : "UNREAD"
                          );
                        }}
                        className="p-1.5 rounded-lg bg-[#FDFBF7] hover:bg-[#F2E8E3] border border-[#E5D5C5] text-[#4A3B36] text-[11px] font-mono transition-colors cursor-pointer"
                      >
                        {msg.status === "UNREAD" ? "Mark Read" : "Mark Unread"}
                      </button>

                      {/* Delete button */}
                      <button
                        type="button"
                        title="Delete Enquiry"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMessageToDelete(msg);
                        }}
                        className="p-1.5 rounded-lg bg-[#FDFBF7] hover:bg-red-50 border border-[#E5D5C5] text-[#7D6B64] hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. MESSAGE DETAIL MODAL */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-[#F7F2EA] border border-[#E5D5C5] rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#E5D5C5]">
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase text-[#B3877F] font-bold block">
                  ENQUIRY DETAILS — {selectedMessage.id}
                </span>
                <h3 className="font-serif text-xl font-bold text-[#1C1614] mt-0.5">
                  {selectedMessage.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="p-2 rounded-xl bg-[#F2E8E3] text-[#7D6B64] hover:text-[#1C1614] shrink-0 ml-4"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#FDFBF7] border border-[#E5D5C5] space-y-1">
                <span className="text-[10px] font-mono text-[#7D6B64] uppercase block">Email Address</span>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="font-bold text-[#1C1614] hover:text-[#B3877F] transition-colors block truncate"
                >
                  {selectedMessage.email}
                </a>
              </div>

              <div className="p-3 rounded-xl bg-[#FDFBF7] border border-[#E5D5C5] space-y-1">
                <span className="text-[10px] font-mono text-[#7D6B64] uppercase block">Phone Number</span>
                {selectedMessage.phone ? (
                  <a
                    href={`tel:${selectedMessage.phone}`}
                    className="font-mono font-bold text-[#1C1614] hover:text-[#B3877F] transition-colors block"
                  >
                    {selectedMessage.phone}
                  </a>
                ) : (
                  <span className="text-[#7D6B64] italic">Not provided</span>
                )}
              </div>

              <div className="p-3 rounded-xl bg-[#FDFBF7] border border-[#E5D5C5] space-y-1">
                <span className="text-[10px] font-mono text-[#7D6B64] uppercase block">Received</span>
                <span className="font-mono text-[#1C1614]">
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#FDFBF7] border border-[#E5D5C5] space-y-1">
                <span className="text-[10px] font-mono text-[#7D6B64] uppercase block">Status</span>
                <div className="flex items-center gap-1.5">
                  {(() => {
                    const cfg = STATUS_CONFIG[selectedMessage.status] || STATUS_CONFIG.UNREAD;
                    return (
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${cfg.badgeClass}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotClass}`} />
                        {cfg.label}
                      </span>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Subject */}
            {selectedMessage.subject && (
              <div className="p-3 rounded-xl bg-[#FDFBF7] border border-[#E5D5C5] space-y-1 text-xs">
                <span className="text-[10px] font-mono text-[#7D6B64] uppercase block">Subject</span>
                <p className="font-bold text-[#1C1614]">{selectedMessage.subject}</p>
              </div>
            )}

            {/* Message */}
            <div className="p-4 rounded-xl bg-[#FDFBF7] border border-[#E5D5C5] space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#7D6B64] block font-bold">
                Message Content
              </span>
              <p className="text-xs text-[#1C1614] leading-relaxed whitespace-pre-wrap">
                {selectedMessage.message}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E5D5C5]">
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={`mailto:${selectedMessage.email}?subject=RE: ${encodeURIComponent(
                    selectedMessage.subject || "PAIMA Consultation Enquiry"
                  )}`}
                  className="px-4 py-2 rounded-xl bg-[#1C1614] text-[#FDFBF7] text-xs font-bold shadow-md hover:bg-[#2D2326] flex items-center gap-2 transition-all"
                >
                  <Reply className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>

                <button
                  type="button"
                  onClick={() =>
                    handleUpdateStatus(
                      selectedMessage.id,
                      selectedMessage.status === "UNREAD" ? "READ" : "UNREAD"
                    )
                  }
                  className="px-4 py-2 rounded-xl bg-[#F7F2EA] hover:bg-[#F2E8E3] border border-[#E5D5C5] text-[#1C1614] text-xs font-bold transition-all"
                >
                  {selectedMessage.status === "UNREAD" ? "Mark as Read" : "Mark as Unread"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedMessage(null);
                    setMessageToDelete(selectedMessage);
                  }}
                  className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-bold flex items-center gap-2 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2 rounded-xl bg-[#FDFBF7] hover:bg-[#F2E8E3] border border-[#E5D5C5] text-[#1C1614] text-xs font-bold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. DELETE CONFIRMATION MODAL */}
      {messageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-[#FDFBF7] border border-red-200 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>

            <div className="space-y-2">
              <h4 className="font-serif text-lg font-bold text-[#1C1614]">
                Delete This Enquiry?
              </h4>
              <p className="text-xs text-[#5D4A44] leading-relaxed">
                Are you sure you want to permanently delete the enquiry from{" "}
                <strong className="text-[#4A3B36]">{messageToDelete.name}</strong> (
                {messageToDelete.email})?
                <br />
                <span className="text-red-600 font-bold">This action cannot be undone.</span>
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMessageToDelete(null)}
                disabled={deleting}
                className="px-5 py-2.5 rounded-xl bg-[#F7F2EA] hover:bg-[#F2E8E3] border border-[#E5D5C5] text-[#1C1614] text-xs font-bold transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteMessage}
                disabled={deleting}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
