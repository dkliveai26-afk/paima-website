import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { sendWelcomeEmail } from "@/lib/email-welcome";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const email = user.emailAddresses?.[0]?.emailAddress;
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

    if (!email) {
      return NextResponse.json({ error: "No email associated with user account" }, { status: 400 });
    }

    const result = await sendWelcomeEmail({
      email,
      name: fullName || undefined,
      userId: user.id,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[WelcomeCheck API] Error:", error);
    // Non-fatal: do not block UI
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 200 });
  }
}
