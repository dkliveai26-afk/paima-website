import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createBookingInDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      phone,
      service,
      preferredDate,
      preferredTime,
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

    const createdRecord = createBookingInDb({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: (phone || "").toString().trim(),
      service: (service || "Haute Residential Architecture").toString().trim(),
      preferredDate: (preferredDate || "").toString().trim(),
      preferredTime: (preferredTime || "").toString().trim(),
      projectDetails: detailsText,
      budget: (budget || "Unspecified").toString().trim(),
      location: (location || "Unspecified").toString().trim(),
      message: detailsText,
      clerkUserId,
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
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "An error occurred while transmitting your dossier. Please try again." },
      { status: 500 }
    );
  }
}
