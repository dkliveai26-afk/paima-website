import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth-admin";

export async function GET() {
  try {
    const authResult = await verifyAdminAuth();
    if (!authResult.isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Administrator access required." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        userId: authResult.userId,
        userEmail: authResult.userEmail,
        fullName: authResult.fullName || "Studio Administrator",
        imageUrl: authResult.imageUrl,
        lastSignInAt: authResult.lastSignInAt,
        createdAt: authResult.createdAt,
      },
    });
  } catch (error) {
    console.error("Admin GET me error:", error);
    return NextResponse.json(
      { error: "Failed to fetch administrator profile." },
      { status: 500 }
    );
  }
}
