import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth-admin";
import {
  updateBookingStatusInDb,
  deleteBookingFromDb,
  BookingStatus,
} from "@/lib/db";

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

    const { id: bookingId } = await params;
    const body = await req.json();
    const { status } = body;

    const validStatuses: BookingStatus[] = [
      "NEW",
      "CONTACTED",
      "CONFIRMED",
      "COMPLETED",
      "CANCELLED",
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid booking status." },
        { status: 400 }
      );
    }

    const updated = updateBookingStatusInDb(bookingId, status);
    if (!updated) {
      return NextResponse.json(
        { error: "Booking record not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      booking: updated,
    });
  } catch (error) {
    console.error("Admin PATCH booking status error:", error);
    return NextResponse.json(
      { error: "Failed to update booking status." },
      { status: 500 }
    );
  }
}

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

    const { id: bookingId } = await params;
    const deleted = deleteBookingFromDb(bookingId);

    if (!deleted) {
      return NextResponse.json(
        { error: "Booking record not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Booking ${bookingId} has been deleted.`,
    });
  } catch (error) {
    console.error("Admin DELETE booking error:", error);
    return NextResponse.json(
      { error: "Failed to delete booking." },
      { status: 500 }
    );
  }
}
