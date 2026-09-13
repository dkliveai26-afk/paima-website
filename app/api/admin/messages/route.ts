import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth-admin";
import { getAllMessages, updateMessageStatus, recordActivity } from "@/lib/db-server";

export async function GET() {
  try {
    const authResult = await verifyAdminAuth();
    if (!authResult.isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Administrator access required." },
        { status: 403 }
      );
    }

    const messages = await getAllMessages();
    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("Admin GET messages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiries." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authResult = await verifyAdminAuth();
    if (!authResult.isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Administrator access required." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "Message ID and Status are required." },
        { status: 400 }
      );
    }

    const updated = await updateMessageStatus(id, status);
    if (!updated) {
      return NextResponse.json(
        { error: "Message not found." },
        { status: 404 }
      );
    }

    await recordActivity({
      actorId: authResult.userId,
      actorEmail: authResult.userEmail || "admin",
      action: "MESSAGE_STATUS_UPDATED",
      entityType: "MESSAGE",
      entityId: id,
      description: `Administrator marked inquiry message ${id} as ${status}`,
      metadata: { messageId: id, status },
    });

    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error("Admin PATCH message error:", error);
    return NextResponse.json(
      { error: "Failed to update inquiry status." },
      { status: 500 }
    );
  }
}
