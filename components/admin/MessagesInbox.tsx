"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Search,
  Star,
  Send,
  Mail,
  Phone,
  Paperclip,
  CheckCircle2,
  Sparkles,
  User,
  ArrowRight,
  Clock,
  Trash2,
  X,
} from "lucide-react";
import { INITIAL_MESSAGES, InquiryMessage } from "./admin-mock-data";
import { useAdmin } from "./AdminLayoutShell";

export function MessagesInbox() {
  const { showToast } = useAdmin();
  const [messages, setMessages] = useState<InquiryMessage[]>(INITIAL_MESSAGES);
  const [activeMessageId, setActiveMessageId] = useState<string>(
    INITIAL_MESSAGES[0].id
  );
  const [filterType, setFilterType] = useState<"ALL" | "UNREAD" | "STARRED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");

  const activeMessage =
    messages.find((m) => m.id === activeMessageId) || messages[0];

  const filteredMessages = messages.filter((m) => {
    if (filterType === "UNREAD" && !m.isUnread) return false;
    if (filterType === "STARRED" && !m.isStarred) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      return (
        m.senderName.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.snippet.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const toggleStar = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isStarred: !m.isStarred } : m))
    );
  };

  const handleSelectMessage = (id: string) => {
    setActiveMessageId(id);
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isUnread: false } : m))
    );
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeMessage) return;

    const newReply = {
      sender: "Dilkhush Kumar (Principal Administrator)",
      text: replyText.trim(),
      timestamp: "Just now",
      isAdmin: true,
    };

    setMessages((prev) =>
      prev.map((m) =>
        m.id === activeMessage.id
          ? { ...m, replies: [...(m.replies || []), newReply] }
          : m
      )
    );

    setReplyText("");
    showToast(
      "Reply Dispatched",
      `Private email consultation sent to ${activeMessage.senderEmail}.`
    );
  };

  const handleApplyTemplate = (template: string) => {
    setReplyText(template);
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#1E232E]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-wide">
            Inquiries &amp; Messaging
          </h2>
          <p className="text-xs text-gray-400 font-sans mt-0.5">
            Direct client communications, architectural design briefs, and confidential memos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#161B23] border border-[#262F3F] text-gray-300">
            {messages.filter((m) => m.isUnread).length} Unread Inquiries
          </span>
        </div>
      </div>

      {/* 2. SPLIT INBOX VIEW */}
      <div className="bg-[#12161F] border border-[#1E2533] rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* LEFT COLUMN: MESSAGE LIST */}
        <div className="lg:col-span-5 border-r border-[#1E2533] flex flex-col bg-[#0F1217]">
          {/* SEARCH & FILTERS */}
          <div className="p-3.5 border-b border-[#1E2533] space-y-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="w-full bg-[#181E29] border border-[#263143] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="flex items-center gap-1.5">
              {(["ALL", "UNREAD", "STARRED"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`text-[10px] font-mono px-2.5 py-1 rounded-lg transition-all font-bold ${
                    filterType === type
                      ? "bg-[#252E3E] text-white border border-[#3A4860]"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* MESSAGE LIST ITEMS */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#181E29]">
            {filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-xs">
                No messages found.
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isActive = msg.id === activeMessageId;

                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg.id)}
                    className={`p-3.5 cursor-pointer transition-all ${
                      isActive
                        ? "bg-[#181F2C] border-l-2 border-[#D4AF37]"
                        : "hover:bg-[#141822]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        {msg.isUnread && (
                          <span className="w-2 h-2 rounded-full bg-[#D4AF37] flex-shrink-0" />
                        )}
                        <span
                          className={`text-xs truncate ${
                            msg.isUnread
                              ? "font-bold text-white"
                              : "font-semibold text-gray-300"
                          }`}
                        >
                          {msg.senderName}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-gray-400">
                          {msg.timestamp}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => toggleStar(e, msg.id)}
                          className={`p-0.5 ${
                            msg.isStarred
                              ? "text-amber-400"
                              : "text-gray-600 hover:text-gray-400"
                          }`}
                        >
                          <Star className="w-3 h-3 fill-current" />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-[11px] font-medium text-gray-200 truncate">
                      {msg.subject}
                    </h4>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5 font-sans">
                      {msg.snippet}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: READING PANE & REPLY COMPOSER */}
        <div className="lg:col-span-7 flex flex-col bg-[#12161F]">
          {activeMessage ? (
            <>
              {/* MESSAGE HEADER */}
              <div className="p-4 sm:p-5 border-b border-[#1E2533] bg-[#0E1117] flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1E2533] to-[#2E394E] border border-[#3E4C66] text-[#D4AF37] font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {activeMessage.senderAvatar}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white font-serif">
                      {activeMessage.subject}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-gray-400 font-mono">
                      <span>From: {activeMessage.senderName}</span>
                      <span>•</span>
                      <a
                        href={`mailto:${activeMessage.senderEmail}`}
                        className="text-[#D4AF37] hover:underline"
                      >
                        {activeMessage.senderEmail}
                      </a>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#1A212E] text-gray-300 border border-[#2B364A] flex-shrink-0">
                  {activeMessage.service}
                </span>
              </div>

              {/* MESSAGE CONTENT & REPLIES */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4">
                {/* ORIGINAL MESSAGE */}
                <div className="bg-[#161B24] border border-[#232B3A] rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 pb-2 border-b border-[#232B3A]">
                    <span>Original Client Inquiry</span>
                    <span>{activeMessage.timestamp}</span>
                  </div>
                  <p className="text-xs text-gray-200 leading-relaxed whitespace-pre-line font-sans">
                    {activeMessage.fullMessage}
                  </p>
                </div>

                {/* THREAD REPLIES */}
                {activeMessage.replies && activeMessage.replies.length > 0 && (
                  <div className="space-y-3 pt-2">
                    {activeMessage.replies.map((rep, idx) => (
                      <div
                        key={idx}
                        className="bg-[#1A2230] border border-[#2E3C54] rounded-2xl p-4 space-y-2 ml-4"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono text-[#D4AF37]">
                          <span className="font-bold">{rep.sender}</span>
                          <span className="text-gray-400">{rep.timestamp}</span>
                        </div>
                        <p className="text-xs text-gray-200 leading-relaxed font-sans">
                          {rep.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* QUICK TEMPLATES & REPLY COMPOSER */}
              <div className="p-4 border-t border-[#1E2533] bg-[#0E1117] space-y-3">
                {/* QUICK ACTION TEMPLATES */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-mono text-gray-500 mr-1">
                    Quick Templates:
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleApplyTemplate(
                        "Dear " +
                          activeMessage.senderName +
                          ",\n\nThank you for reaching out to PAIMA Architectural Studio. We would be delighted to schedule a private on-site consultation to review your property and spatial vision.\n\nCould you confirm your preferred schedule for next week?\n\nWarm regards,\nDilkhush Kumar"
                      )
                    }
                    className="text-[10px] font-mono px-2 py-1 rounded-lg bg-[#181E29] hover:bg-[#222A3A] text-gray-300 hover:text-white border border-[#263143] transition-colors"
                  >
                    Schedule Consultation
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleApplyTemplate(
                        "Dear " +
                          activeMessage.senderName +
                          ",\n\nWe have received your design brief and our architecture team is reviewing the floor plans and zoning requirements. We will revert with our preliminary concept storyboard shortly.\n\nBest regards,\nDilkhush Kumar"
                      )
                    }
                    className="text-[10px] font-mono px-2 py-1 rounded-lg bg-[#181E29] hover:bg-[#222A3A] text-gray-300 hover:text-white border border-[#263143] transition-colors"
                  >
                    Send Concept Review
                  </button>
                </div>

                {/* REPLY FORM */}
                <form onSubmit={handleSendReply} className="space-y-2">
                  <textarea
                    rows={3}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Compose confidential response to client..."
                    className="w-full bg-[#161B24] border border-[#263143] rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-gray-500">
                      Dispatched via studio encrypted gateway (UI Simulation)
                    </span>
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-[#D4AF37] to-[#B38F2B] hover:from-[#E5C358] hover:to-[#C29E37] text-black font-bold text-xs px-4 py-2 rounded-xl shadow flex items-center gap-1.5 transition-all font-sans"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Reply</span>
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-gray-500 text-xs">
              Select an inquiry from the inbox to read and respond.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
