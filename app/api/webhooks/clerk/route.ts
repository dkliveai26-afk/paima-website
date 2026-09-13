import { NextRequest, NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/email-welcome";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const evtType = body?.type || body?.evt?.type;
    const data = body?.data || body?.evt?.data;

    // Handle user.created event from Clerk
    if (evtType === "user.created" && data) {
      const primaryEmailObj = Array.isArray(data.email_addresses)
        ? data.email_addresses.find(
            (e: any) => e.id === data.primary_email_address_id
          ) || data.email_addresses[0]
        : null;

      const email = primaryEmailObj?.email_address || data.email;
      const firstName = data.first_name || "";
      const lastName = data.last_name || "";
      const fullName = `${firstName} ${lastName}`.trim();

      if (email) {
        console.log(`[Clerk Webhook] New user registered: ${email}`);
        await sendWelcomeEmail({
          email,
          name: fullName || undefined,
          userId: data.id,
        });
      }
    }

    return NextResponse.json({ success: true, message: "Webhook processed" });
  } catch (error: any) {
    console.error("[Clerk Webhook] Error processing webhook:", error);
    // Return 200 to prevent Clerk webhook retry loops while logging error
    return NextResponse.json(
      { success: false, error: "Internal webhook handler notice" },
      { status: 200 }
    );
  }
}
