import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PAIMA Private Admin Portal",
  description: "Confidential Administrator Booking Management System.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0F1115] text-[#F3F4F6] font-sans antialiased selection:bg-[#A78D78] selection:text-black">
      {children}
    </div>
  );
}
