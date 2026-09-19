import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createBooking, createMessage, recordActivity } from "@/lib/db-server";
import { sendNewBookingNotificationEmail } from "@/lib/email-welcome";

export async function POST(req: NextRequest) {
  try {
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
      message,
    } = body;

    // Server-side validation
    if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
      return NextResponse.json(
        { error: "Full Name is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Valid email address is required." },
        { status: 400 }
      );
    }

    const detailsText = (projectDetails || message || "").toString().trim();
    if (!detailsText) {
      return NextResponse.json(
        { error: "Project brief or message is required." },
        { status: 400 }
      );
    }

    // Associate with Clerk User ID if authenticated
    let clerkUserId: string | null = null;
    try {
      const { userId } = await auth();
      clerkUserId = userId;
    } catch {
      // Guest booking
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = fullName.trim();
    const normalizedService = (service || "Haute Residential Architecture").toString().trim();

    // 1. Create the booking record
    const createdRecord = await createBooking({
      fullName: normalizedName,
      email: normalizedEmail,
      phone: (phone || "").toString().trim(),
      service: normalizedService,
      preferredDate: (preferredDate || "").toString().trim(),
      projectDetails: detailsText,
      budget: (budget || "Unspecified").toString().trim(),
      location: (location || "Unspecified").toString().trim(),
      message: detailsText,
      clerkUserId,
    });

    // 2. Dispatch real PAIMA admin email notification (Asynchronous background task)
    sendNewBookingNotificationEmail(createdRecord).catch((emailErr) => {
      console.warn("Non-fatal: Admin email notification dispatch failed:", emailErr);
    });

    // 3. Mirror booking as an inquiry message and record audit activity in parallel background task
    Promise.allSettled([
      createMessage({
        name: normalizedName,
        email: normalizedEmail,
        phone: (phone || "").toString().trim(),
        subject: `[${createdRecord.bookingId}] ${normalizedService} — ${normalizedName}`,
        message: detailsText,
        service: normalizedService,
      }),
      recordActivity({
        actorId: clerkUserId,
        actorEmail: normalizedEmail,
        action: "BOOKING_SUBMITTED",
        entityType: "BOOKING",
        entityId: createdRecord.bookingId,
        description: `New booking dossier submitted by ${normalizedName} (${createdRecord.bookingId}) for ${createdRecord.service}`,
        metadata: {
          bookingId: createdRecord.bookingId,
          service: createdRecord.service,
          budget: createdRecord.budget,
          location: createdRecord.location,
        },
      }),
    ]).catch((err) => {
      console.warn("Non-fatal: Background booking mirroring notice:", err);
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your private inquiry has been received with distinction.",
        bookingId: createdRecord.bookingId,
        createdAt: createdRecord.createdAt,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: error?.message || "An error occurred while transmitting your dossier. Please try again." },
      { status: 500 }
    );
  }
}
