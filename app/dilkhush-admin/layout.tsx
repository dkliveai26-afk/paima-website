import React from "react";
import type { Metadata } from "next";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { verifyAdminAuth } from "@/lib/auth-admin";

export const metadata: Metadata = {
  title: "PAIMA Executive Admin Suite",
  description: "Private executive management console for PAIMA Architectural Studio.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function DilkhushAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authResult = await verifyAdminAuth();



  return (
    <AdminAuthGuard isAuthorized={authResult.isAuthorized}>
      <div className="min-h-screen bg-[#FDFBF7] text-[#1C1614] font-sans antialiased selection:bg-[#EAD8D3] selection:text-[#1C1614]">
        <AdminLayoutShell
          adminUser={{
            userId: authResult.userId || "admin-session",
            userEmail: authResult.userEmail || null,
            fullName: authResult.fullName || "Studio Administrator",
            imageUrl: authResult.imageUrl,
            lastSignInAt: authResult.lastSignInAt,
          }}
        >
          {children}
        </AdminLayoutShell>
      </div>
    </AdminAuthGuard>
  );
}
