import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth-admin";
import {
  updateMessageStatus,
  deleteMessage,
  recordActivity,
} from "@/lib/db-server";
import type { InquiryRecord } from "@/lib/types";

const VALID_STATUSES: Array<InquiryRecord["status"]> = [
  "UNREAD",
  "READ",
  "REPLIED",
  "ARCHIVED",
];

// PATCH /api/admin/messages/[id] — Update a single message's status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await verifyAdminAuth();
    if (!authResult.isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Administrator access required." },
        { status: 403 }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Message ID is required." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { status } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const updated = await updateMessageStatus(id, status);
    if (!updated) {
      return NextResponse.json(
        { error: "Message not found or status unchanged." },
        { status: 404 }
      );
    }

    await recordActivity({
      actorId: authResult.userId,
      actorEmail: authResult.userEmail || "admin",
      action: "MESSAGE_STATUS_UPDATED",
      entityType: "MESSAGE",
      entityId: id,
      description: `Administrator marked enquiry message ${id} as ${status}`,
      metadata: { messageId: id, status },
    });

    return NextResponse.json({ success: true, id, status });
  } catch (error) {
    console.error("Admin PATCH message [id] error:", error);
    return NextResponse.json(
      { error: "Failed to update message status." },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/messages/[id] — Permanently delete a message
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await verifyAdminAuth();
    if (!authResult.isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Administrator access required." },
        { status: 403 }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Message ID is required." },
        { status: 400 }
      );
    }

    const deleted = await deleteMessage(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Message not found or already deleted." },
        { status: 404 }
      );
    }

    await recordActivity({
      actorId: authResult.userId,
      actorEmail: authResult.userEmail || "admin",
      action: "MESSAGE_DELETED",
      entityType: "MESSAGE",
      entityId: id,
      description: `Administrator permanently deleted enquiry message ${id}`,
      metadata: { messageId: id },
    });

    return NextResponse.json({
      success: true,
      message: `Enquiry message ${id} has been permanently deleted.`,
    });
  } catch (error) {
    console.error("Admin DELETE message [id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete message." },
      { status: 500 }
    );
  }
}
