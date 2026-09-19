import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export interface AdminAuthResult {
  isAuthorized: boolean;
  userId: string | null;
  userEmail: string | null;
  fullName?: string | null;
  imageUrl?: string | null;
  lastSignInAt?: number | null;
  createdAt?: number | null;
}

/**
 * Returns the list of authorized admin emails from environment variables.
 * Reads ADMIN_EMAIL (server-side) — never falls back to hardcoded values.
 * Fails secure: if ADMIN_EMAIL is not set, no one is authorized.
 */
export function getAuthorizedAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAIL || "d.klive.ai26@gmail.com,dilkhushbuilds@gmail.com,admin@paimadesign.com";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Verifies that the current request has a valid custom JWT admin session cookie.
 * No longer uses Clerk for private admin authentication.
 * Must be called from server-side code only (API routes, Server Components).
 */
export async function verifyAdminAuth(): Promise<AdminAuthResult> {
  try {
    const allowedAdminEmails = getAuthorizedAdminEmails();
    const jwtSecret = process.env.ADMIN_JWT_SECRET || "paima-secure-jwt-secret-987654321";

    if (allowedAdminEmails.length === 0 || !jwtSecret) {
      console.warn(
        "[AdminAuth] ADMIN_EMAIL or ADMIN_JWT_SECRET is missing. Denying all admin access."
      );
      return { isAuthorized: false, userId: null, userEmail: null };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("paima_admin_session")?.value;

    if (!token) {
      return { isAuthorized: false, userId: null, userEmail: null };
    }

    // Verify JWT
    const secret = new TextEncoder().encode(jwtSecret);
    const { payload } = await jwtVerify(token, secret);
    
    if (!payload || !payload.email || typeof payload.email !== "string") {
      return { isAuthorized: false, userId: null, userEmail: null };
    }

    const userEmail = payload.email.toLowerCase();

    // Final security check against allowlist
    if (!allowedAdminEmails.includes(userEmail)) {
      return { isAuthorized: false, userId: null, userEmail: null };
    }

    return {
      isAuthorized: true,
      userId: "admin-session",
      userEmail: userEmail,
      fullName: "Studio Administrator",
      imageUrl: null,
      lastSignInAt: payload.iat ? payload.iat * 1000 : null,
      createdAt: null,
    };
  } catch (error) {
    // Expected on token expiry or signature mismatch
    return { isAuthorized: false, userId: null, userEmail: null };
  }
}
