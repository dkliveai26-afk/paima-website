import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth-admin";
import { getAllCustomers } from "@/lib/db-server";

export async function GET() {
  try {
    const authResult = await verifyAdminAuth();
    if (!authResult.isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Administrator access required." },
        { status: 403 }
      );
    }

    const customers = await getAllCustomers();
    return NextResponse.json({ success: true, customers });
  } catch (error) {
    console.error("Admin GET customers error:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer directory." },
      { status: 500 }
    );
  }
}
