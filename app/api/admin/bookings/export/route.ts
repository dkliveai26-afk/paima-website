import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth-admin";
import { getAllBookings, recordActivity, BookingStatus } from "@/lib/db-server";
import * as XLSX from "xlsx";

function formatTimestamp(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const mins = String(d.getMinutes()).padStart(2, "0");
    const secs = String(d.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${mins}:${secs}`;
  } catch {
    return dateStr || "";
  }
}

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

    const dataToExport = bookings.map((b) => ({
      "Booking ID": b.bookingId || "",
      Name: b.fullName || "",
      Email: b.email || "",
      Phone: b.phone || "",
      Service: b.service || "",
      Address: b.location || "",
      "Preferred Date": b.preferredDate || "",
      Budget: b.budget || "",
      Message: b.message || b.projectDetails || "",
      Status: b.status || "",
      "Created At": formatTimestamp(b.createdAt),
      "Updated At": formatTimestamp(b.updatedAt || b.createdAt),
    }));

    const emptyRow = {
      "Booking ID": "",
      Name: "",
      Email: "",
      Phone: "",
      Service: "",
      Address: "",
      "Preferred Date": "",
      Budget: "",
      Message: "",
      Status: "",
      "Created At": "",
      "Updated At": "",
    };

    const worksheet = XLSX.utils.json_to_sheet(
      dataToExport.length > 0 ? dataToExport : [emptyRow]
    );

    if (dataToExport.length === 0) {
      const headers = Object.keys(emptyRow);
      XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });
    }

    worksheet["!cols"] = [
      { wch: 18 }, // Booking ID
      { wch: 22 }, // Name
      { wch: 26 }, // Email
      { wch: 18 }, // Phone
      { wch: 30 }, // Service
      { wch: 24 }, // Address
      { wch: 16 }, // Preferred Date
      { wch: 20 }, // Budget
      { wch: 40 }, // Message
      { wch: 14 }, // Status
      { wch: 22 }, // Created At
      { wch: 22 }, // Updated At
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    const today = new Date().toISOString().split("T")[0];
    const filename = `PAIMA-Bookings-${today}.xlsx`;

    // Audit activity record
    await recordActivity({
      actorId: authResult.userId,
      actorEmail: authResult.userEmail || "admin",
      action: "BOOKINGS_EXPORTED",
      entityType: "BOOKING",
      description: `Administrator exported ${bookings.length} booking record(s) to Excel`,
      metadata: { recordCount: bookings.length, search, statusFilter: status },
    }).catch((err) => console.warn("Audit record export failed:", err));

    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Admin GET bookings export error:", error);
    return NextResponse.json(
      { error: "Failed to generate Excel export." },
      { status: 500 }
    );
  }
}
