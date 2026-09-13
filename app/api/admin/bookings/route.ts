import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth-admin";
import {
  getAllBookings,
  createBooking,
  updateBookingStatus,
  deleteBooking,
  BookingStatus,
} from "@/lib/db-server";
import { recordActivity } from "@/lib/db-server";

export async function GET(req: NextRequest) {
  try {
    const authResult = await verifyAdminAuth();
    if (!authResult.isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Administrator access required." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase().trim() || "";
    const status = searchParams.get("status") as BookingStatus | null;
    const service = searchParams.get("service") || "";
    const sort = searchParams.get("sort") || "newest";

    let bookings = await getAllBookings();

    // Filter by status
    if (status && status !== ("ALL" as any)) {
      bookings = bookings.filter((b) => b.status === status);
    }

    // Filter by service
    if (service && service !== "ALL") {
      bookings = bookings.filter(
        (b) => b.service.toLowerCase() === service.toLowerCase()
      );
    }

    // Search by name, email, phone, or bookingId
    if (search) {
      bookings = bookings.filter(
        (b) =>
          b.fullName.toLowerCase().includes(search) ||
          b.email.toLowerCase().includes(search) ||
          b.phone.toLowerCase().includes(search) ||
          b.bookingId.toLowerCase().includes(search) ||
          b.location.toLowerCase().includes(search)
      );
    }

    // Sort
    if (sort === "oldest") {
      bookings.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else if (sort === "preferredDate") {
      bookings.sort((a, b) => a.preferredDate.localeCompare(b.preferredDate));
    } else {
      // newest
      bookings.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return NextResponse.json({
      success: true,
      total: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Admin GET bookings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings." },
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
    const {
      fullName,
      email,
      phone,
      service,
      preferredDate,
      projectDetails,
      budget,
      location,
      status,
      isVip,
    } = body;

    if (!fullName || !email) {
      return NextResponse.json(
        { error: "Full Name and Email are required." },
        { status: 400 }
      );
    }

    const newBooking = await createBooking({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: (phone || "").toString().trim(),
      service: (service || "Haute Residential Architecture").toString().trim(),
      preferredDate: (preferredDate || "").toString().trim(),
      projectDetails: (projectDetails || "").toString().trim(),
      budget: (budget || "Unspecified").toString().trim(),
      location: (location || "Unspecified").toString().trim(),
      message: (projectDetails || "").toString().trim(),
      status: status || "NEW",
      isVip: Boolean(isVip),
    });

    await recordActivity({
      actorId: authResult.userId,
      actorEmail: authResult.userEmail || "admin",
      action: "BOOKING_CREATED_MANUAL",
      entityType: "BOOKING",
      entityId: newBooking.bookingId,
      description: `Administrator manually created booking ${newBooking.bookingId} for ${newBooking.fullName}`,
      metadata: { bookingId: newBooking.bookingId, client: newBooking.fullName },
    });

    return NextResponse.json(
      { success: true, booking: newBooking },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin POST booking error:", error);
    return NextResponse.json(
      { error: "Failed to create booking." },
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
    const { bookingId, status } = body;

    if (!bookingId || !status) {
      return NextResponse.json(
        { error: "Booking ID and new Status are required." },
        { status: 400 }
      );
    }

    const updated = await updateBookingStatus(bookingId, status);
    if (!updated) {
      return NextResponse.json(
        { error: "Booking record not found." },
        { status: 404 }
      );
    }

    await recordActivity({
      actorId: authResult.userId,
      actorEmail: authResult.userEmail || "admin",
      action: "BOOKING_STATUS_UPDATED",
      entityType: "BOOKING",
      entityId: bookingId,
      description: `Administrator changed status of booking ${bookingId} to ${status}`,
      metadata: { bookingId, previousStatus: "MODIFIED", newStatus: status },
    });

    return NextResponse.json({ success: true, booking: updated });
  } catch (error) {
    console.error("Admin PATCH booking error:", error);
    return NextResponse.json(
      { error: "Failed to update booking status." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authResult = await verifyAdminAuth();
    if (!authResult.isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Administrator access required." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("bookingId");

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required." },
        { status: 400 }
      );
    }

    const deleted = await deleteBooking(bookingId);
    if (!deleted) {
      return NextResponse.json(
        { error: "Booking not found or could not be deleted." },
        { status: 404 }
      );
    }

    await recordActivity({
      actorId: authResult.userId,
      actorEmail: authResult.userEmail || "admin",
      action: "BOOKING_DELETED",
      entityType: "BOOKING",
      entityId: bookingId,
      description: `Administrator deleted booking record ${bookingId}`,
      metadata: { bookingId },
    });

    return NextResponse.json({
      success: true,
      message: `Booking ${bookingId} successfully deleted.`,
    });
  } catch (error) {
    console.error("Admin DELETE booking error:", error);
    return NextResponse.json(
      { error: "Failed to delete booking." },
      { status: 500 }
    );
  }
}
