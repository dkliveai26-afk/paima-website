import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("paima_admin_session");
    
    return NextResponse.json({ success: true, redirectUrl: "/dilkhush-admin" });
  } catch (error) {
    console.error("Logout endpoint error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
