import nodemailer from "nodemailer";
import { getMongoDb, isMongoConfigured } from "./mongodb";

export interface SendWelcomeEmailParams {
  email: string;
  name?: string;
  userId?: string;
}

export function getAppBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.VERCEL_URL ||
    "https://paimadesign.com"
  );
}

/**
 * Checks if a welcome email has already been sent to this email address.
 */
export async function hasWelcomeEmailBeenSent(email: string): Promise<boolean> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!isMongoConfigured()) return false;

  try {
    const db = await getMongoDb();
    if (!db) return false;

    const existing = await db
      .collection("welcome_emails_sent")
      .findOne({ email: normalizedEmail });

    return Boolean(existing);
  } catch (err) {
    console.warn("MongoDB check for sent welcome emails failed:", err);
    return false;
  }
}

/**
 * Records that a welcome email was sent to this email address.
 */
export async function recordWelcomeEmailSent(
  email: string,
  userId?: string
): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!isMongoConfigured()) return;

  try {
    const db = await getMongoDb();
    if (!db) return;

    await db.collection("welcome_emails_sent").updateOne(
      { email: normalizedEmail },
      {
        $set: {
          email: normalizedEmail,
          userId: userId || null,
          sentAt: new Date().toISOString(),
        },
      },
      { upsert: true }
    );
  } catch (err) {
    console.warn("MongoDB record welcome email sent failed:", err);
  }
}

/**
 * Builds the elegant, luxury HTML email template for PAIMA.
 */
export function buildWelcomeEmailHtml(name?: string): string {
  const baseUrl = getAppBaseUrl();
  const greeting = name && name.trim() ? `Dear ${name.trim()},` : "Dear Patron,";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to PAIMA</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0F0C0B; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #E5D5C5; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0F0C0B; padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #1C1614; border: 1px solid #3A2E2B; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
          
          <!-- Header Banner -->
          <tr>
            <td align="center" style="padding: 40px 40px 30px 40px; border-bottom: 1px solid #2D2326; background: linear-gradient(180deg, #261D1A 0%, #1C1614 100%);">
              <div style="font-family: Georgia, serif; font-size: 28px; font-weight: bold; letter-spacing: 0.25em; color: #FDFBF7; text-transform: uppercase;">
                PAIMA
              </div>
              <div style="font-size: 9px; font-weight: 700; letter-spacing: 0.35em; color: #B3877F; text-transform: uppercase; margin-top: 8px;">
                HAUTE ARCHITECTURE &amp; INTERIORS
              </div>
            </td>
          </tr>

          <!-- Email Body -->
          <tr>
            <td style="padding: 40px; line-height: 1.7; font-size: 15px; color: #D4C3B5;">
              <p style="margin-top: 0; margin-bottom: 24px; font-size: 16px; font-weight: 600; color: #FDFBF7;">
                ${greeting}
              </p>
              
              <p style="margin-bottom: 20px;">
                Welcome to <strong style="color: #FDFBF7;">PAIMA</strong>. Your account has been successfully created.
              </p>

              <p style="margin-bottom: 20px;">
                We look forward to helping you explore the world of PAIMA—from our architectural services and interior design to our selected portfolio estates and private inquiries.
              </p>

              <p style="margin-bottom: 32px;">
                You can now explore the PAIMA website and begin your journey with us.
              </p>

              <!-- CTA Button -->
              <table border="0" cellspacing="0" cellpadding="0" style="margin-top: 32px; margin-bottom: 32px;">
                <tr>
                  <td align="center" style="border-radius: 8px; background-color: #B3877F;">
                    <a href="${baseUrl}" target="_blank" style="font-size: 13px; font-weight: 700; color: #1C1614; text-decoration: none; padding: 14px 32px; border-radius: 8px; display: inline-block; letter-spacing: 0.15em; text-transform: uppercase;">
                      Explore PAIMA
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin-bottom: 0; font-size: 13px; color: #8C7B75; border-top: 1px solid #2D2326; padding-top: 24px;">
                Warmest regards,<br>
                <strong style="color: #E5D5C5;">PAIMA Concierge Atelier</strong><br>
                <span style="font-size: 12px; color: #6E5E58;">New York • Paris • Beverly Hills • Monaco</span>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 24px 40px; background-color: #14100F; font-size: 11px; color: #6E5E58; border-top: 1px solid #261D1A;">
              <p style="margin: 0 0 8px 0;">
                &copy; ${new Date().getFullYear()} PAIMA Luxury Interiors &amp; Prime Real Estate Group. All rights reserved.
              </p>
              <p style="margin: 0;">
                Confidential Communication • <a href="${baseUrl}" style="color: #B3877F; text-decoration: none;">paimadesign.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Main function to send the PAIMA Welcome Email safely without throwing unhandled exceptions.
 */
export async function sendWelcomeEmail({
  email,
  name,
  userId,
}: SendWelcomeEmailParams): Promise<{ success: boolean; skipped?: boolean; message?: string }> {
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return { success: false, message: "Invalid recipient email address." };
  }

  const normalizedEmail = email.trim().toLowerCase();

  // 1. Prevent duplicate sends for the same user
  const alreadySent = await hasWelcomeEmailBeenSent(normalizedEmail);
  if (alreadySent) {
    console.log(`[WelcomeEmail] Email already sent previously to ${normalizedEmail}. Skipping.`);
    return { success: true, skipped: true, message: "Welcome email already sent previously." };
  }

  const subject = "Welcome to PAIMA";
  const html = buildWelcomeEmailHtml(name);

  // 2. Transporter configuration using environment variables or safe dev fallback
  let smtpHost = process.env.SMTP_HOST;
  let smtpPort = Number(process.env.SMTP_PORT) || 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpService = process.env.SMTP_SERVICE;
  const fromAddress = process.env.EMAIL_FROM || '"PAIMA Studio" <concierge@paimadesign.com>';

  // Auto-detect Gmail if user provided Gmail account without explicit host
  if (!smtpHost && smtpUser && (smtpUser.toLowerCase().includes("@gmail.com") || smtpService === "gmail")) {
    smtpHost = "smtp.gmail.com";
    if (!process.env.SMTP_PORT) smtpPort = 465;
  }

  let emailSent = false;

  if ((smtpHost || smtpService) && smtpUser && smtpPass) {
    try {
      const transporterConfig: any = smtpService
        ? { service: smtpService, auth: { user: smtpUser, pass: smtpPass } }
        : {
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465,
            auth: { user: smtpUser, pass: smtpPass },
            tls: { rejectUnauthorized: false },
          };

      const transporter = nodemailer.createTransport(transporterConfig);

      await transporter.sendMail({
        from: fromAddress,
        to: normalizedEmail,
        subject,
        html,
      });

      emailSent = true;
      console.log(`[WelcomeEmail] Real email dispatched via SMTP to ${normalizedEmail}`);
    } catch (err: any) {
      console.error(`[WelcomeEmail] SMTP dispatch failed for ${normalizedEmail}:`, err.message || err);
    }
  } else {
    const missingVars = [];
    if (!smtpHost && !smtpService) missingVars.push("SMTP_HOST");
    if (!smtpUser) missingVars.push("SMTP_USER");
    if (!smtpPass) missingVars.push("SMTP_PASS");

    console.warn(`[WelcomeEmail] ⚠️ SMTP NOT CONFIGURED. Missing environment variables: [${missingVars.join(", ")}]. Set these variables in .env.local to enable real welcome emails.`);
  }

  // 3. Record in DB ONLY if actually delivered over SMTP
  if (emailSent) {
    await recordWelcomeEmailSent(normalizedEmail, userId);
  }

  return { success: true, message: emailSent ? "Welcome email dispatched successfully." : "Welcome email skipped or pending SMTP configuration." };
}

/**
 * Sends a real PAIMA notification email to the studio/admin inbox when a new booking is created.
 */
export async function sendNewBookingNotificationEmail(booking: {
  bookingId: string;
  fullName: string;
  email: string;
  phone?: string;
  service: string;
  preferredDate?: string;
  budget?: string;
  location?: string;
  projectDetails?: string;
  message?: string;
  createdAt?: string;
}): Promise<{ success: boolean; skipped?: boolean; error?: string }> {
  const adminRecipients = (process.env.ADMIN_EMAIL || "concierge@paimadesign.com")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  const recipient = adminRecipients.length > 0 ? adminRecipients.join(", ") : "concierge@paimadesign.com";
  const subject = `New PAIMA Private Inquiry — ${booking.bookingId}`;

  // 1. Duplicate check in DB to prevent multiple notifications for same booking ID
  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        const existing = await db
          .collection("booking_notifications_sent")
          .findOne({ bookingId: booking.bookingId });
        if (existing) {
          console.log(`[BookingNotification] Notification already sent for ${booking.bookingId}. Skipping.`);
          return { success: true, skipped: true };
        }
      }
    } catch (dbErr) {
      console.warn("[BookingNotification] DB check for sent notification failed:", dbErr);
    }
  }

  const baseUrl = getAppBaseUrl();
  const createdDateText = booking.createdAt
    ? new Date(booking.createdAt).toLocaleString()
    : new Date().toLocaleString();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New PAIMA Private Inquiry</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0F0C0B; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #E5D5C5;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0F0C0B; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #1C1614; border: 1px solid #3A2E2B; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 36px 40px; border-bottom: 1px solid #2D2326; background: linear-gradient(180deg, #261D1A 0%, #1C1614 100%);">
              <div style="font-family: Georgia, serif; font-size: 26px; font-weight: bold; letter-spacing: 0.25em; color: #FDFBF7; text-transform: uppercase;">
                PAIMA
              </div>
              <div style="font-size: 9px; font-weight: 700; letter-spacing: 0.35em; color: #B3877F; text-transform: uppercase; margin-top: 6px;">
                NEW DOSSIER INQUIRY NOTIFICATION
              </div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 36px 40px; line-height: 1.6; font-size: 14px; color: #D4C3B5;">
              <p style="margin-top: 0; font-size: 16px; font-weight: bold; color: #FDFBF7; margin-bottom: 20px;">
                A new client commission dossier has been registered in the PAIMA database.
              </p>

              <table width="100%" border="0" cellspacing="0" cellpadding="10" style="background-color: #14100F; border: 1px solid #2D2326; border-radius: 8px; margin-bottom: 24px; font-size: 13px;">
                <tr>
                  <td width="35%" style="color: #8C7B75; font-weight: bold;">Booking ID:</td>
                  <td style="color: #FDFBF7; font-family: monospace; font-weight: bold;">${booking.bookingId}</td>
                </tr>
                <tr>
                  <td style="color: #8C7B75; font-weight: bold;">Client Name:</td>
                  <td style="color: #FDFBF7; font-weight: bold;">${booking.fullName}</td>
                </tr>
                <tr>
                  <td style="color: #8C7B75; font-weight: bold;">Email Address:</td>
                  <td style="color: #B3877F;">${booking.email}</td>
                </tr>
                <tr>
                  <td style="color: #8C7B75; font-weight: bold;">Telephone:</td>
                  <td style="color: #FDFBF7;">${booking.phone || "Unspecified"}</td>
                </tr>
                <tr>
                  <td style="color: #8C7B75; font-weight: bold;">Service / Typology:</td>
                  <td style="color: #FDFBF7; font-weight: bold;">${booking.service}</td>
                </tr>
                <tr>
                  <td style="color: #8C7B75; font-weight: bold;">Preferred Date:</td>
                  <td style="color: #FDFBF7;">${booking.preferredDate || "Flexible"}</td>
                </tr>
                <tr>
                  <td style="color: #8C7B75; font-weight: bold;">Budget / Investment:</td>
                  <td style="color: #FDFBF7;">${booking.budget || "Unspecified"}</td>
                </tr>
                <tr>
                  <td style="color: #8C7B75; font-weight: bold;">Property Location:</td>
                  <td style="color: #FDFBF7;">${booking.location || "Unspecified"}</td>
                </tr>
                <tr>
                  <td style="color: #8C7B75; font-weight: bold;">Submitted At:</td>
                  <td style="color: #FDFBF7;">${createdDateText}</td>
                </tr>
              </table>

              <div style="background-color: #261D1A; padding: 18px; border-radius: 8px; border-left: 3px solid #B3877F; margin-bottom: 28px;">
                <div style="font-size: 10px; font-weight: bold; color: #B3877F; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 8px;">
                  Project Brief &amp; Details
                </div>
                <div style="color: #FDFBF7; font-size: 13px; white-space: pre-wrap; line-height: 1.6;">
                  ${booking.projectDetails || booking.message || "No additional project brief provided."}
                </div>
              </div>

              <div style="text-align: center; margin-top: 32px; margin-bottom: 12px;">
                <a href="${baseUrl}/dilkhush-admin/bookings" target="_blank" style="background-color: #B3877F; color: #1C1614; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; display: inline-block;">
                  View Dossier in Admin Portal
                </a>
              </div>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding: 20px 40px; background-color: #14100F; font-size: 11px; color: #6E5E58; border-top: 1px solid #261D1A;">
              <p style="margin: 0;">
                Internal Studio Notification • PAIMA Real Estate &amp; Architecture Group
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  // 2. SMTP Transport resolution
  let smtpHost = process.env.SMTP_HOST;
  let smtpPort = Number(process.env.SMTP_PORT) || 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpService = process.env.SMTP_SERVICE;
  const fromAddress = process.env.EMAIL_FROM || '"PAIMA Studio" <concierge@paimadesign.com>';

  // Auto-detect Gmail if user provided Gmail account without explicit host
  if (!smtpHost && smtpUser && (smtpUser.toLowerCase().includes("@gmail.com") || smtpService === "gmail")) {
    smtpHost = "smtp.gmail.com";
    if (!process.env.SMTP_PORT) smtpPort = 465;
  }

  let emailSentSuccessfully = false;

  if ((smtpHost || smtpService) && smtpUser && smtpPass) {
    try {
      const transporterConfig: any = smtpService
        ? { service: smtpService, auth: { user: smtpUser, pass: smtpPass } }
        : {
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465,
            auth: { user: smtpUser, pass: smtpPass },
            tls: { rejectUnauthorized: false },
          };

      const transporter = nodemailer.createTransport(transporterConfig);

      const info = await transporter.sendMail({
        from: fromAddress,
        to: recipient,
        subject,
        html,
      });

      emailSentSuccessfully = true;
      console.log(`[BookingNotification] ✅ SUCCESS: Email notification delivered for ${booking.bookingId}. MessageId: ${info.messageId}`);
    } catch (err: any) {
      console.error(`[BookingNotification] ❌ SMTP FAILURE for ${booking.bookingId}:`, err.message || err);
      return { success: false, error: err.message || "SMTP transmission failed." };
    }
  } else {
    const missingVars = [];
    if (!smtpHost && !smtpService) missingVars.push("SMTP_HOST");
    if (!smtpUser) missingVars.push("SMTP_USER");
    if (!smtpPass) missingVars.push("SMTP_PASS");

    console.warn(`[BookingNotification] ⚠️ SMTP NOT CONFIGURED. Missing environment variables: [${missingVars.join(", ")}]. Set these variables in .env.local to enable real email transmission.`);
    return { success: false, error: `Missing SMTP environment variables: ${missingVars.join(", ")}` };
  }

  // 3. Record in DB ONLY if successfully delivered over SMTP
  if (emailSentSuccessfully && isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        await db.collection("booking_notifications_sent").updateOne(
          { bookingId: booking.bookingId },
          { $set: { bookingId: booking.bookingId, sentAt: new Date().toISOString(), recipient } },
          { upsert: true }
        );
      }
    } catch (recErr) {
      console.warn("[BookingNotification] Failed to record sent notification in MongoDB:", recErr);
    }
  }

  return { success: true };
}
