import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth-admin";
import { getAllBookingsFromDb, BookingStatus } from "@/lib/db";

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

    let bookings = getAllBookingsFromDb();

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
      bookings.sort((a, b) =>
        a.preferredDate.localeCompare(b.preferredDate)
      );
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
