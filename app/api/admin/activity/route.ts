import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth-admin";
import { getAllActivities } from "@/lib/db-server";

export async function GET() {
  try {
    const authResult = await verifyAdminAuth();
    if (!authResult.isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Administrator access required." },
        { status: 403 }
      );
    }

    const activities = await getAllActivities(150);
    return NextResponse.json({ success: true, activities });
  } catch (error) {
    console.error("Admin GET activity error:", error);
    return NextResponse.json(
      { error: "Failed to fetch audit log activities." },
      { status: 500 }
    );
  }
}
