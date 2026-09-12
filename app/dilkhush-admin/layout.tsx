import React from "react";
import type { Metadata } from "next";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";

export const metadata: Metadata = {
  title: "PAIMA Executive Admin Suite",
  description: "Private executive management console for PAIMA Architectural Studio.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DilkhushAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#090B0E] text-[#E6E8EC] font-sans antialiased selection:bg-[#D4AF37] selection:text-black">
      <AdminLayoutShell>{children}</AdminLayoutShell>
    </div>
  );
}
