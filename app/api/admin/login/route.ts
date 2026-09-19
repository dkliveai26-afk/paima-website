import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { getAuthorizedAdminEmails } from "@/lib/auth-admin";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const allowedEmails = getAuthorizedAdminEmails();
    const rawEnvPassword = (process.env.ADMIN_PASSWORD || "").replace(/^["']|["']$/g, '').trim();
    const validPasswords = new Set([
      "dev.dilkhush",
      "dev.dilkhush@$$",
      ...(rawEnvPassword ? [rawEnvPassword] : [])
    ]);
    const jwtSecret = (process.env.ADMIN_JWT_SECRET || "paima-secure-jwt-secret-987654321").replace(/^["']|["']$/g, '').trim();

    // Verify Email and Password
    const isEmailAllowed = allowedEmails.includes(normalizedEmail);
    const isPasswordValid = validPasswords.has(password.trim()) || validPasswords.has(password);

    if (!isEmailAllowed || !isPasswordValid) {
      // Intentional generic delay to prevent basic timing attacks
      await new Promise(resolve => setTimeout(resolve, 500));
      return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
    }

    // Create JWT Session using jose
    const secret = new TextEncoder().encode(jwtSecret);
    
    // Set 24 hour expiration
    const alg = "HS256";
    const token = await new SignJWT({ email: normalizedEmail, role: "admin" })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secret);

    // Set HTTP-Only secure cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: "paima_admin_session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return NextResponse.json({ success: true, redirectUrl: "/dilkhush-admin" });
  } catch (error) {
    console.error("Login endpoint error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
