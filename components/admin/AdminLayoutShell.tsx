"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  MessageSquare,
  Settings,
  Bell,
  Menu,
  X,
  ChevronRight,
  LogOut,
  Layers,
  Activity,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  LucideIcon,
  Loader2,
} from "lucide-react";

export interface AdminUserContext {
  userId: string | null;
  userEmail: string | null;
  fullName?: string | null;
  imageUrl?: string | null;
  lastSignInAt?: number | null;
}

interface Toast {
  id: string;
  title: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
}

interface AdminContextType {
  showToast: (title: string, message: string, type?: Toast["type"]) => void;
  adminUser: AdminUserContext | null;
  refreshStats: () => void;
  stats: {
    totalBookings: number;
    newInquiries: number;
    confirmedConsultations: number;
    unreadMessagesCount: number;
  } | null;
}

const AdminContext = createContext<AdminContextType>({
  showToast: () => {},
  adminUser: null,
  refreshStats: () => {},
  stats: null,
});

export const useAdmin = () => useContext(AdminContext);

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  getBadge?: (stats: any) => string | number | null;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Executive Overview",
    href: "/dilkhush-admin",
    icon: LayoutDashboard,
  },
  {
    label: "Bookings & Dossiers",
    href: "/dilkhush-admin/bookings",
    icon: Layers,
    getBadge: (s) => (s?.newInquiries > 0 ? `${s.newInquiries} New` : null),
  },
  {
    label: "Customer Directory",
    href: "/dilkhush-admin/customers",
    icon: Users,
  },
  {
    label: "Consultation Calendar",
    href: "/dilkhush-admin/calendar",
    icon: CalendarDays,
    getBadge: (s) => (s?.confirmedConsultations > 0 ? `${s.confirmedConsultations}` : null),
  },
  {
    label: "Inquiry Messages",
    href: "/dilkhush-admin/messages",
    icon: MessageSquare,
    getBadge: (s) => (s?.unreadMessagesCount > 0 ? `${s.unreadMessagesCount}` : null),
  },
  {
    label: "Audit Activity Log",
    href: "/dilkhush-admin/activity",
    icon: Activity,
  },
  {
    label: "Studio & Map Settings",
    href: "/dilkhush-admin/settings",
    icon: Settings,
  },
];

export function AdminLayoutShell({
  children,
  adminUser = null,
}: {
  children: React.ReactNode;
  adminUser?: AdminUserContext | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [signingOut, setSigningOut] = useState(false);

  const activeAdminUser: AdminUserContext = adminUser || {
    userId: "admin-session",
    userEmail: "admin@example.com",
    fullName: "Studio Administrator",
    imageUrl: null,
    lastSignInAt: null,
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch {
      // stats fetch failed
    }
  };

  useEffect(() => {
    fetchStats();
  }, [pathname]);

  const showToast = (
    title: string,
    message: string,
    type: Toast["type"] = "success"
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/dilkhush-admin");
      router.refresh();
    } catch (err) {
      console.error(err);
      setSigningOut(false);
    }
  };

  const getPageTitle = () => {
    if (pathname === "/dilkhush-admin") return "Executive Control Console";
    if (pathname.startsWith("/dilkhush-admin/bookings")) return "Bookings & Dossier Management";
    if (pathname.startsWith("/dilkhush-admin/customers")) return "Client & Customer Directory";
    if (pathname.startsWith("/dilkhush-admin/calendar")) return "Private Consultation Schedules";
    if (pathname.startsWith("/dilkhush-admin/messages")) return "Client Messages & Inquiries";
    if (pathname.startsWith("/dilkhush-admin/activity")) return "System Audit & Activity Logs";
    if (pathname.startsWith("/dilkhush-admin/settings")) return "Studio, Map & System Settings";
    return "Executive Portal";
  };

  return (
    <AdminContext.Provider
      value={{
        showToast,
        adminUser: activeAdminUser,
        refreshStats: fetchStats,
        stats,
      }}
    >
      <div className="flex h-screen bg-[#FDFBF7] text-[#1C1614] overflow-hidden">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex lg:flex-col w-72 bg-[#F7F2EA] border-r border-[#E5D5C5] z-30 select-none">
          {/* Brand Header */}
          <div className="p-6 border-b border-[#E5D5C5] flex items-center justify-between">
            <Link href="/dilkhush-admin" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <Image
                src="/logo.svg"
                alt="Paima Luxury Interiors & Real Estate"
                width={150}
                height={40}
                priority
                className="h-9 w-auto object-contain"
              />
            </Link>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" title="System Online" />
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
            <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#7D6B64] font-bold">
              Administration
            </div>

            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/dilkhush-admin"
                  ? pathname === "/dilkhush-admin"
                  : pathname.startsWith(item.href);
              const badgeValue = item.getBadge ? item.getBadge(stats) : null;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? "bg-[#EAD8D3] text-[#4A3B36] font-bold shadow-sm border border-[#D8C5BD]"
                      : "text-[#5D4A44] hover:bg-[#F2E8E3] hover:text-[#1C1614]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive
                          ? "text-[#4A3B36]"
                          : "text-[#7D6B64] group-hover:text-[#4A3B36]"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {badgeValue && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#EAD8D3] text-[#4A3B36] border border-[#D8C5BD]">
                      {badgeValue}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Authenticated Admin Profile Footer */}
          <div className="p-4 border-t border-[#E5D5C5] bg-[#FDFBF7]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {activeAdminUser?.imageUrl ? (
                  <img
                    src={activeAdminUser.imageUrl}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full object-cover border border-[#D8C5BD]"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#EAD8D3] border border-[#D8C5BD] flex items-center justify-center text-[#4A3B36] font-mono text-xs font-bold">
                    {activeAdminUser?.fullName?.charAt(0) || "A"}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-[#1C1614] truncate">
                      {activeAdminUser?.fullName || "Administrator"}
                    </p>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#B3877F] shrink-0" />
                  </div>
                  <p className="text-[10px] font-mono text-[#7D6B64] truncate">
                    {activeAdminUser?.userEmail || "Administrator"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                title="Sign Out"
                onClick={handleSignOut}
                disabled={signingOut}
                className="p-2 rounded-lg bg-[#F2E8E3] hover:bg-[#E5D5C5] text-[#7D6B64] hover:text-[#1C1614] transition-colors cursor-pointer border border-[#E5D5C5] disabled:opacity-50"
              >
                {signingOut ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT WRAPPER */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* TOP BAR */}
          <header className="h-16 border-b border-[#E5D5C5] bg-[#FDFBF7]/90 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between z-20 shrink-0">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-[#F2E8E3] border border-[#E5D5C5] text-[#4A3B36] hover:bg-[#EAD8D3]"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#B3877F] font-bold hidden sm:inline-block">
                    SECURE CONTROL
                  </span>
                  <span className="text-[10px] text-[#7D6B64] hidden sm:inline-block">&bull;</span>
                  <h1 className="font-serif text-sm sm:text-base font-bold text-[#1C1614]">
                    {getPageTitle()}
                  </h1>
                </div>
              </div>
            </div>

            {/* Right Top Header Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F2E8E3] border border-[#E5D5C5] text-xs font-mono text-[#5D4A44]">
                <UserCheck className="w-3.5 h-3.5 text-[#B3877F]" />
                <span className="truncate max-w-[180px]">
                  {activeAdminUser?.userEmail || "Administrator"}
                </span>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="px-3.5 py-1.5 rounded-xl bg-[#EAD8D3] hover:bg-[#D8C5BD] text-[#4A3B36] text-xs font-semibold border border-[#D8C5BD] flex items-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-50"
              >
                {signingOut ? <Loader2 className="w-3.5 h-3.5 text-[#B3877F] animate-spin" /> : <LogOut className="w-3.5 h-3.5 text-[#B3877F]" />}
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </header>

          {/* PAGE BODY */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#FDFBF7]">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>

        {/* MOBILE DRAWER */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#F7F2EA] border-r border-[#E5D5C5] p-6 z-10">
              <div className="flex items-center justify-between pb-6 border-b border-[#E5D5C5]">
                <Link href="/dilkhush-admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                  <Image
                    src="/logo.svg"
                    alt="Paima Luxury Interiors & Real Estate"
                    width={140}
                    height={36}
                    className="h-8 w-auto object-contain"
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl bg-[#F2E8E3] text-[#7D6B64] hover:text-[#1C1614]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 py-6 space-y-1.5 overflow-y-auto">
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
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium ${
                        isActive
                          ? "bg-[#EAD8D3] text-[#4A3B36] font-bold border border-[#D8C5BD]"
                          : "text-[#5D4A44] hover:bg-[#F2E8E3]"
                      }`}
                    >
                      <Icon className="w-4 h-4 text-[#B3877F]" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-[#E5D5C5]">
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="w-full py-2.5 rounded-xl bg-[#EAD8D3] text-[#4A3B36] text-xs font-bold flex items-center justify-center gap-2 border border-[#D8C5BD] disabled:opacity-50"
                >
                  {signingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TOAST ALERTS */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`p-4 rounded-xl border shadow-2xl backdrop-blur-md transition-all duration-300 pointer-events-auto flex items-start gap-3 ${
                toast.type === "error"
                  ? "bg-[#FDFBF7]/95 border-red-500/40 text-red-800"
                  : toast.type === "warning"
                  ? "bg-[#FDFBF7]/95 border-amber-500/40 text-amber-800"
                  : "bg-[#F7F2EA]/95 border-[#E5D5C5] text-[#1C1614]"
              }`}
            >
              {toast.type === "error" ? (
               <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-[#B3877F] shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-[#1C1614]">{toast.title}</p>
                <p className="text-[11px] text-[#5D4A44] leading-tight">
                  {toast.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminContext.Provider>
  );
}
