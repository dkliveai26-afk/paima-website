import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { verifyAdminAuth, DEFAULT_ADMIN_EMAIL } from "@/lib/auth-admin";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";
import { ShieldAlert, ArrowLeft, LogOut } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authResult = await verifyAdminAuth();

  // If user is not logged in at all: redirect to /sign-in with return URL
  if (!authResult.userId) {
    redirect("/sign-in?redirect_url=/admin");
  }

  // If NOT authorized as administrator: render 403 Unauthorized UI
  if (!authResult.isAuthorized) {
    const adminEmailRequired =
      process.env.ADMIN_EMAIL?.trim() || DEFAULT_ADMIN_EMAIL;

    return (
      <div className="min-h-screen bg-[#0F1115] text-[#F3F4F6] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-[#161920] border border-[#2D333F] max-w-md w-full rounded-2xl p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-red-400 block font-bold">
              403 ACCESS RESTRICTED
            </span>
            <h1 className="font-serif text-2xl font-bold text-white">
              Administrator Access Required
            </h1>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed font-sans">
            The private admin dashboard is restricted exclusively to designated PAIMA administrator account:
            <br />
            <strong className="text-white font-mono block mt-2 text-xs bg-[#0F1115] py-2 px-3 rounded-lg border border-[#2D333F]">
              {adminEmailRequired}
            </strong>
          </p>

          <div className="space-y-3 pt-2">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-left">
              <p className="text-[10px] text-amber-400 uppercase tracking-wider font-mono font-bold">
                Signed in as non-admin:
              </p>
              <p className="text-xs font-mono font-bold text-white truncate mt-0.5">
                {authResult.userEmail || "Account without admin privileges"}
              </p>
            </div>

            <SignOutButton redirectUrl="/sign-in?redirect_url=/admin">
              <button
                type="button"
                className="w-full py-3.5 bg-[#212631] hover:bg-[#2D333F] text-white text-xs uppercase tracking-[0.18em] font-bold rounded-xl transition-all border border-[#2D333F] flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-gray-400" />
                <span>Sign Out &amp; Switch Admin Account</span>
              </button>
            </SignOutButton>
          </div>

          <div className="pt-4 border-t border-[#2D333F]">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authorized Administrator: Render Dashboard
  return <AdminDashboardClient userEmail={authResult.userEmail!} />;
}

