"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  MessageSquare,
  Settings,
  Bell,
  Search,
  Plus,
  Menu,
  X,
  ChevronRight,
  LogOut,
  Sliders,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ChevronLeft,
  Filter,
} from "lucide-react";

// Notification Context for Toast Alerts across all Admin pages
interface Toast {
  id: string;
  title: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
}

interface AdminContextType {
  showToast: (title: string, message: string, type?: Toast["type"]) => void;
  openNewInquiryModal: () => void;
}

const AdminContext = createContext<AdminContextType>({
  showToast: () => {},
  openNewInquiryModal: () => {},
});

export const useAdmin = () => useContext(AdminContext);

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dilkhush-admin",
    icon: LayoutDashboard,
  },
  {
    label: "Bookings",
    href: "/dilkhush-admin/bookings",
    icon: Layers,
    badge: "1 New",
    badgeColor: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
  },
  {
    label: "Customers",
    href: "/dilkhush-admin/customers",
    icon: Users,
  },
  {
    label: "Calendar",
    href: "/dilkhush-admin/calendar",
    icon: CalendarDays,
  },
  {
    label: "Messages",
    href: "/dilkhush-admin/messages",
    icon: MessageSquare,
    badge: "2",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  },
  {
    label: "Settings",
    href: "/dilkhush-admin/settings",
    icon: Settings,
  },
];

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [newInquiryModalOpen, setNewInquiryModalOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Search input state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const showToast = (
    title: string,
    message: string,
    type: Toast["type"] = "success"
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const openNewInquiryModal = () => {
    setNewInquiryModalOpen(true);
  };

  // Quick inquiry state
  const [inquiryForm, setInquiryForm] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    service: "Haute Architectural Interior",
    propertyType: "",
    budget: "$350,000 – $500,000",
    message: "",
  });

  const handleCreateInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryForm.clientName || !inquiryForm.clientEmail) {
      showToast("Required Fields", "Please enter client name and email", "warning");
      return;
    }
    showToast(
      "Inquiry Recorded (UI Prototype)",
      `New inquiry created for ${inquiryForm.clientName}. Ready for booking review.`,
      "success"
    );
    setNewInquiryModalOpen(false);
    setInquiryForm({
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      service: "Haute Architectural Interior",
      propertyType: "",
      budget: "$350,000 – $500,000",
      message: "",
    });
  };

  // Determine current page title
  const getCurrentPageTitle = () => {
    if (pathname === "/dilkhush-admin") return "Dashboard Overview";
    if (pathname.startsWith("/dilkhush-admin/bookings")) return "Booking Management";
    if (pathname.startsWith("/dilkhush-admin/customers")) return "Customer Directory";
    if (pathname.startsWith("/dilkhush-admin/calendar")) return "Private Calendar & Schedules";
    if (pathname.startsWith("/dilkhush-admin/messages")) return "Inquiries & Messaging";
    if (pathname.startsWith("/dilkhush-admin/settings")) return "System & Admin Settings";
    return "Admin Portal";
  };

  const NOTIFICATIONS_LIST = [
    {
      id: "1",
      title: "New Booking Inquiry Received",
      desc: "Eleanor Vance-Roche requested an on-site consultation for Avenue Montaigne Triplex.",
      time: "10m ago",
      unread: true,
      badge: "NEW",
    },
    {
      id: "2",
      title: "Design Brief Updated",
      desc: "Maximilian Sterling forwarded 57th St penthouse floor plans.",
      time: "2h ago",
      unread: true,
      badge: "UPDATE",
    },
    {
      id: "3",
      title: "Consultation Confirmed",
      desc: "Countess Sofia de Montmirail confirmed Oct 5th appointment.",
      time: "1d ago",
      unread: false,
      badge: "CONFIRMED",
    },
  ];

  return (
    <AdminContext.Provider value={{ showToast, openNewInquiryModal }}>
      <div className="min-h-screen bg-[#090B0E] text-[#E6E8EC] font-sans antialiased flex flex-col selection:bg-[#C5A880] selection:text-black">
        {/* DESKTOP + MOBILE SHELL */}
        <div className="flex flex-1 w-full relative overflow-x-hidden">
          {/* ========================================================================= */}
          {/* 1. SIDEBAR (DESKTOP) */}
          {/* ========================================================================= */}
          <aside
            className={`hidden md:flex flex-col flex-shrink-0 bg-[#0F1217] border-r border-[#1E232E] transition-all duration-300 z-30 ${
              sidebarCollapsed ? "w-20" : "w-64"
            }`}
          >
            {/* BRAND HEADER */}
            <div className="h-16 px-4 flex items-center justify-between border-b border-[#1E232E]">
              {!sidebarCollapsed ? (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#8C6D23] flex items-center justify-center text-black font-serif font-black text-sm shadow-md">
                    P
                  </div>
                  <div>
                    <span className="font-serif font-bold tracking-[0.15em] text-white text-sm block">
                      PAIMA
                    </span>
                    <span className="text-[9px] uppercase tracking-[0.25em] text-[#C5A880] font-mono font-medium block">
                      Private Admin
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mx-auto w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#8C6D23] flex items-center justify-center text-black font-serif font-black text-sm shadow-md">
                  P
                </div>
              )}

              <button
                type="button"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="text-gray-400 hover:text-white p-1.5 rounded-md hover:bg-[#1A1F29] transition-colors"
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* NAV LINKS */}
            <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === "/dilkhush-admin"
                    ? pathname === "/dilkhush-admin"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
                      isActive
                        ? "bg-[#1E2533] text-white font-semibold shadow-inner border border-[#2D374B]"
                        : "text-gray-400 hover:text-white hover:bg-[#161B23]"
                    } ${sidebarCollapsed ? "justify-center" : "justify-between"}`}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive
                            ? "text-[#D4AF37]"
                            : "text-gray-400 group-hover:text-gray-200"
                        }`}
                      />
                      {!sidebarCollapsed && <span>{item.label}</span>}
                    </div>

                    {!sidebarCollapsed && item.badge && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          item.badgeColor || "bg-gray-800 text-gray-300"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {sidebarCollapsed && item.badge && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#0F1217]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* ADMIN PROFILE FOOTER */}
            <div className="p-3 border-t border-[#1E232E] bg-[#0B0D11]/60">
              <div
                className={`flex items-center gap-3 ${
                  sidebarCollapsed ? "justify-center" : "justify-between"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#1F2532] border border-[#2F394D] text-[#D4AF37] font-mono text-xs font-bold flex items-center justify-center flex-shrink-0 shadow-inner">
                    DK
                  </div>
                  {!sidebarCollapsed && (
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">
                        Dilkhush Kumar
                      </p>
                      <p className="text-[10px] text-[#A0A6B5] truncate font-mono">
                        Super Administrator
                      </p>
                    </div>
                  )}
                </div>

                {!sidebarCollapsed && (
                  <Link
                    href="/dilkhush-admin/settings"
                    className="text-gray-400 hover:text-white p-1 rounded hover:bg-[#1A1F29] transition-colors"
                    title="Account Settings"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          </aside>

          {/* ========================================================================= */}
          {/* 2. MOBILE DRAWER SIDEBAR */}
          {/* ========================================================================= */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 md:hidden flex">
              <div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={() => setMobileMenuOpen(false)}
              />
              <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#0F1217] border-r border-[#1E232E] p-4 z-10 shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-[#1E232E]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#8C6D23] flex items-center justify-center text-black font-serif font-black text-sm">
                      P
                    </div>
                    <div>
                      <span className="font-serif font-bold tracking-[0.15em] text-white text-sm block">
                        PAIMA
                      </span>
                      <span className="text-[9px] uppercase tracking-[0.25em] text-[#C5A880] font-mono font-medium block">
                        Private Admin
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#1A1F29]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
                  {NAV_ITEMS.map((item) => {
                    const isActive =
                      item.href === "/dilkhush-admin"
                        ? pathname === "/dilkhush-admin"
                        : pathname.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium transition-all ${
                          isActive
                            ? "bg-[#1E2533] text-white font-semibold border border-[#2D374B]"
                            : "text-gray-400 hover:text-white hover:bg-[#161B23]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`w-4 h-4 ${
                              isActive ? "text-[#D4AF37]" : "text-gray-400"
                            }`}
                          />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                              item.badgeColor || "bg-gray-800 text-gray-300"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>

                <div className="pt-4 border-t border-[#1E232E] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#1F2532] text-[#D4AF37] font-mono text-xs font-bold flex items-center justify-center">
                      DK
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Dilkhush Kumar</p>
                      <p className="text-[10px] text-gray-400 font-mono">Administrator</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      showToast("Signed Out", "Admin session ended (UI simulation)", "info");
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-400"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. MAIN CONTENT CONTAINER */}
          {/* ========================================================================= */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#0A0C10]">
            {/* TOP BAR */}
            <header className="h-16 bg-[#0F1217] border-b border-[#1E232E] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#1A1F29]"
                >
                  <Menu className="w-5 h-5" />
                </button>

                <div>
                  <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.15em] text-[#A0A6B5]">
                    <span>PAIMA ADMIN</span>
                    <ChevronRight className="w-3 h-3 text-gray-600" />
                    <span className="text-[#D4AF37] font-bold">
                      {pathname === "/dilkhush-admin"
                        ? "Overview"
                        : pathname.replace("/dilkhush-admin/", "").toUpperCase()}
                    </span>
                  </div>
                  <h1 className="text-sm sm:text-base font-bold text-white truncate font-sans">
                    {getCurrentPageTitle()}
                  </h1>
                </div>
              </div>

              {/* TOP BAR ACTIONS */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* OMNI SEARCH */}
                <div className="relative hidden sm:block">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                    placeholder="Search bookings, clients, ID..."
                    className="w-44 lg:w-60 bg-[#161A22] border border-[#232A37] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/60 transition-all font-sans"
                  />
                  {searchFocused && (
                    <div className="absolute top-full mt-1.5 right-0 w-72 bg-[#12161F] border border-[#242C3C] rounded-xl p-3 shadow-2xl z-50 text-xs">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-2 font-bold">
                        Quick Shortcuts
                      </p>
                      <div className="space-y-1">
                        <Link
                          href="/dilkhush-admin/bookings"
                          className="block p-1.5 hover:bg-[#1C222E] rounded-lg text-gray-300 hover:text-white"
                        >
                          → View all new booking inquiries
                        </Link>
                        <Link
                          href="/dilkhush-admin/calendar"
                          className="block p-1.5 hover:bg-[#1C222E] rounded-lg text-gray-300 hover:text-white"
                        >
                          → Check this week&apos;s site visits
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* NEW INQUIRY ACTION BUTTON */}
                <button
                  type="button"
                  onClick={openNewInquiryModal}
                  className="bg-gradient-to-r from-[#D4AF37] to-[#B38F2B] hover:from-[#E5C358] hover:to-[#C29E37] text-black font-bold text-xs px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer font-sans"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span className="hidden sm:inline">New Inquiry</span>
                </button>

                {/* NOTIFICATIONS DROPDOWN */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-[#1A1F29] transition-colors relative border border-transparent hover:border-[#232A37]"
                    title="System Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D4AF37] ring-2 ring-[#0F1217]" />
                  </button>

                  {notificationsOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[#12161F] border border-[#232A37] rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center justify-between pb-3 border-b border-[#232A37]">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white font-sans">
                            Notifications
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-bold">
                            2 Unread
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            showToast("Notifications", "All notifications marked as read");
                            setNotificationsOpen(false);
                          }}
                          className="text-[10px] font-mono text-gray-400 hover:text-[#D4AF37]"
                        >
                          Mark all read
                        </button>
                      </div>

                      <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                        {NOTIFICATIONS_LIST.map((n) => (
                          <div
                            key={n.id}
                            className={`p-2.5 rounded-xl text-xs transition-colors ${
                              n.unread
                                ? "bg-[#181E29] border border-[#2A3447]"
                                : "hover:bg-[#161B23]"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-white text-xs">
                                {n.title}
                              </span>
                              <span className="text-[10px] text-gray-400 font-mono">
                                {n.time}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-300 leading-snug">
                              {n.desc}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-[#232A37] text-center">
                        <Link
                          href="/dilkhush-admin/messages"
                          onClick={() => setNotificationsOpen(false)}
                          className="text-[11px] font-mono text-[#D4AF37] hover:underline"
                        >
                          View all client inquiries →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* USER BADGE */}
                <div className="flex items-center gap-2 pl-2 border-l border-[#232A37]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1E2533] to-[#2E394E] border border-[#3E4C66] text-[#D4AF37] font-mono text-xs font-bold flex items-center justify-center shadow-inner">
                    DK
                  </div>
                </div>
              </div>
            </header>

            {/* MAIN OUTLET */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
              {children}
            </main>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. NEW INQUIRY MODAL (UI PROTOTYPE) */}
        {/* ========================================================================= */}
        {newInquiryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setNewInquiryModalOpen(false)}
            />
            <div className="relative bg-[#12161F] border border-[#252E3E] rounded-2xl max-w-lg w-full p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-4 border-b border-[#252E3E]">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-bold block">
                    MANUAL INTAKE
                  </span>
                  <h2 className="text-base font-bold text-white font-serif">
                    Create New Client Inquiry
                  </h2>
                </div>
                <button
                  onClick={() => setNewInquiryModalOpen(false)}
                  className="text-gray-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateInquiry} className="space-y-4 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-gray-300 block mb-1">
                      Client Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={inquiryForm.clientName}
                      onChange={(e) =>
                        setInquiryForm({ ...inquiryForm, clientName: e.target.value })
                      }
                      placeholder="e.g. Lady Vivienne Montgomery"
                      className="w-full bg-[#181E28] border border-[#2D384D] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-gray-300 block mb-1">
                      Client Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={inquiryForm.clientEmail}
                      onChange={(e) =>
                        setInquiryForm({ ...inquiryForm, clientEmail: e.target.value })
                      }
                      placeholder="v.montgomery@domain.com"
                      className="w-full bg-[#181E28] border border-[#2D384D] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-gray-300 block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={inquiryForm.clientPhone}
                      onChange={(e) =>
                        setInquiryForm({ ...inquiryForm, clientPhone: e.target.value })
                      }
                      placeholder="+33 1 42 68 00 00"
                      className="w-full bg-[#181E28] border border-[#2D384D] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-gray-300 block mb-1">
                      Service Category
                    </label>
                    <select
                      value={inquiryForm.service}
                      onChange={(e) =>
                        setInquiryForm({ ...inquiryForm, service: e.target.value })
                      }
                      className="w-full bg-[#181E28] border border-[#2D384D] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option>Haute Architectural Interior</option>
                      <option>Private Residence Renovation</option>
                      <option>Luxury Penthouse Staging</option>
                      <option>Bespoke Estate Advisory</option>
                      <option>Prime Commercial &amp; Hospitality</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-gray-300 block mb-1">
                      Property / Location Type
                    </label>
                    <input
                      type="text"
                      value={inquiryForm.propertyType}
                      onChange={(e) =>
                        setInquiryForm({ ...inquiryForm, propertyType: e.target.value })
                      }
                      placeholder="e.g. Monaco Seafront Duplex"
                      className="w-full bg-[#181E28] border border-[#2D384D] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-gray-300 block mb-1">
                      Estimated Budget Range
                    </label>
                    <input
                      type="text"
                      value={inquiryForm.budget}
                      onChange={(e) =>
                        setInquiryForm({ ...inquiryForm, budget: e.target.value })
                      }
                      placeholder="$350,000 – $500,000"
                      className="w-full bg-[#181E28] border border-[#2D384D] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-gray-300 block mb-1">
                    Project Notes &amp; Scope
                  </label>
                  <textarea
                    rows={3}
                    value={inquiryForm.message}
                    onChange={(e) =>
                      setInquiryForm({ ...inquiryForm, message: e.target.value })
                    }
                    placeholder="Enter architectural brief, bespoke material requirements, timeline..."
                    className="w-full bg-[#181E28] border border-[#2D384D] rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setNewInquiryModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-[#181E28] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#D4AF37] to-[#B38F2B] hover:from-[#E5C358] hover:to-[#C29E37] text-black font-bold text-xs px-4 py-2 rounded-xl shadow transition-all"
                  >
                    Save Intake Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. TOAST ALERTS NOTIFIER */}
        {/* ========================================================================= */}
        <div className="fixed bottom-5 right-5 z-50 space-y-2 max-w-sm w-full pointer-events-none">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`pointer-events-auto p-3.5 rounded-2xl shadow-2xl border flex items-start justify-between gap-3 animate-in slide-in-from-bottom-3 duration-300 ${
                toast.type === "success"
                  ? "bg-[#111914] border-emerald-500/40 text-emerald-300"
                  : toast.type === "warning"
                  ? "bg-[#1C1810] border-amber-500/40 text-amber-300"
                  : toast.type === "error"
                  ? "bg-[#1C1111] border-red-500/40 text-red-300"
                  : "bg-[#12161F] border-[#2C3649] text-gray-200"
              }`}
            >
              <div className="flex items-start gap-2.5">
                <CheckCircle2
                  className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    toast.type === "success"
                      ? "text-emerald-400"
                      : toast.type === "warning"
                      ? "text-amber-400"
                      : toast.type === "error"
                      ? "text-red-400"
                      : "text-blue-400"
                  }`}
                />
                <div>
                  <p className="text-xs font-bold text-white font-sans">
                    {toast.title}
                  </p>
                  <p className="text-[11px] text-gray-300 leading-snug mt-0.5">
                    {toast.message}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdminContext.Provider>
  );
}
