"use client";

import React, { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Loader2, Sparkles, AlertCircle } from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

function parseLineToNodes(line: string, isUser: boolean, onLinkClick?: () => void) {
  const regex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|(\/(?:contact|services|portfolio|about)\b)/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      elements.push(line.substring(lastIndex, match.index));
    }

    if (match[1] && match[2]) {
      const label = match[1];
      const url = match[2];
      const isInternal = url.startsWith("/");
      
      if (isInternal) {
        elements.push(
          <Link
            key={match.index}
            href={url}
            onClick={onLinkClick}
            className={cn(
              "font-medium underline underline-offset-2 transition-colors",
              isUser
                ? "text-[#C8B89E] hover:text-white"
                : "text-[#1A1A1A] hover:text-[#C8B89E]"
            )}
          >
            {label}
          </Link>
        );
      } else {
        elements.push(
          <a
            key={match.index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "font-medium underline underline-offset-2 transition-colors",
              isUser
                ? "text-[#C8B89E] hover:text-white"
                : "text-[#1A1A1A] hover:text-[#C8B89E]"
            )}
          >
            {label}
          </a>
        );
      }
    } else if (match[3]) {
      elements.push(
        <strong key={match.index} className="font-semibold">
          {match[3]}
        </strong>
      );
    } else if (match[4]) {
      const route = match[4];
      const routeLabels: Record<string, string> = {
        "/contact": "Contact Page",
        "/services": "Services Page",
        "/portfolio": "Portfolio Page",
        "/about": "About PAIMA",
      };
      elements.push(
        <Link
          key={match.index}
          href={route}
          onClick={onLinkClick}
          className={cn(
            "font-medium underline underline-offset-2 transition-colors mx-0.5",
            isUser
              ? "text-[#C8B89E] hover:text-white"
              : "text-[#1A1A1A] hover:text-[#C8B89E]"
          )}
        >
          {routeLabels[route] || route}
        </Link>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < line.length) {
    elements.push(line.substring(lastIndex));
  }

  return elements.length > 0 ? elements : [line];
}

function renderFormattedMessage(text: string, isUser: boolean, onLinkClick?: () => void) {
  const lines = text.split("\n");
  return lines.map((line, i) => (
    <React.Fragment key={i}>
      {parseLineToNodes(line, isUser, onLinkClick)}
      {i < lines.length - 1 && <br />}
    </React.Fragment>
  ));
}

export default function PaimaAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState("");

  const {
    messages,
    status,
    error,
    setMessages,
    sendMessage,
  } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    onError: (err: Error) => {
      console.warn("PAIMA Agent notice:", err?.message || err);
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userText = input;
    setInput("");
    try {
      await sendMessage({ text: userText });
    } catch (err) {
      console.error("Error sending message to PAIMA Agent:", err);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#1A1A1A] text-[#F5F2EB] shadow-2xl hover:bg-black transition-colors focus:outline-none focus:ring-2 focus:ring-[#C8B89E] focus:ring-offset-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        aria-label="Toggle PAIMA Agent"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 flex h-[500px] max-h-[calc(100vh-120px)] w-[350px] flex-col overflow-hidden rounded-2xl bg-[#FDFBF7] shadow-2xl border border-[#E8E3D5] font-sans"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-[#1A1A1A] px-5 py-4 text-[#F5F2EB] shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#C8B89E]" />
                <h3 className="font-medium tracking-wide">PAIMA Agent</h3>
              </div>
              <button
                onClick={() => setMessages([])}
                className="text-xs text-[#A3A3A3] hover:text-white transition-colors"
                title="Clear conversation"
              >
                Reset
              </button>
            </div>

            {/* Messages Area - Internal Scroll System */}
            <div
              ref={messagesContainerRef}
              data-lenis-prevent="true"
              data-lenis-prevent-touch="true"
              data-lenis-prevent-wheel="true"
              style={{ overscrollBehavior: "contain", touchAction: "pan-y" }}
              className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#FDFBF7] scroll-smooth"
            >
              {messages.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center text-center space-y-3 opacity-60">
                  <MessageSquare className="h-8 w-8 text-[#1A1A1A]" />
                  <p className="text-sm text-[#1A1A1A]">
                    Welcome to PAIMA. How may I assist you with our services, portfolio, or inquiries today?
                  </p>
                </div>
              )}

              {messages.map((m: any, index: number) => {
                const messageText =
                  typeof m.content === "string"
                    ? m.content
                    : Array.isArray(m.parts)
                    ? m.parts.map((p: any) => (p.type === "text" ? p.text : "")).join("")
                    : "";

                const isUser = m.role === "user";

                return (
                  <div
                    key={m.id || index}
                    className={cn(
                      "flex w-full",
                      isUser ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed break-words",
                        isUser
                          ? "bg-[#1A1A1A] text-[#F5F2EB] rounded-tr-sm"
                          : "bg-[#E8E3D5] text-[#1A1A1A] rounded-tl-sm"
                      )}
                    >
                      {renderFormattedMessage(messageText, isUser, () => setIsOpen(false))}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex w-full justify-start">
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-[#E8E3D5] px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-[#1A1A1A]" />
                  </div>
                </div>
              )}

              {error && (
                <div className="flex w-full justify-center">
                  <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>Sorry, I'm unable to respond right now.</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Pinned at Bottom */}
            <div className="border-t border-[#E8E3D5] bg-[#FDFBF7] p-4 shrink-0">
              <form onSubmit={onSubmit} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about PAIMA..."
                  disabled={isLoading}
                  className="w-full rounded-full border border-[#DCD5C6] bg-white px-4 py-3 pr-12 text-sm text-[#1A1A1A] placeholder-[#A3A3A3] focus:border-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#1A1A1A] text-[#F5F2EB] transition-colors hover:bg-black disabled:opacity-50"
                >
                  <Send className="h-4 w-4 ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

