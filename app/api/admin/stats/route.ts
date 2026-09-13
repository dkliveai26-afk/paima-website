import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth-admin";
import { getDashboardStats } from "@/lib/db-server";

export async function GET() {
  try {
    const authResult = await verifyAdminAuth();
    if (!authResult.isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Administrator access required." },
        { status: 403 }
      );
    }

    const stats = await getDashboardStats();
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error("Admin GET stats error:", error);
    return NextResponse.json(
      { error: "Failed to calculate dashboard statistics." },
      { status: 500 }
    );
  }
}
