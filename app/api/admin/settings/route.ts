import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth-admin";
import { getSiteSettings, updateSiteSettings, recordActivity } from "@/lib/db-server";

export async function GET() {
  try {
    const authResult = await verifyAdminAuth();
    if (!authResult.isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Administrator access required." },
        { status: 403 }
      );
    }

    const settings = await getSiteSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Admin GET settings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch studio settings." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await verifyAdminAuth();
    if (!authResult.isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Administrator access required." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const updated = await updateSiteSettings(body);

    await recordActivity({
      actorId: authResult.userId,
      actorEmail: authResult.userEmail || "admin",
      action: "SETTINGS_UPDATED",
      entityType: "SETTINGS",
      entityId: "global",
      description: "Administrator updated studio contact & location settings",
      metadata: { ...body },
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("Admin POST settings error:", error);
    return NextResponse.json(
      { error: "Failed to update studio settings." },
      { status: 500 }
    );
  }
}
