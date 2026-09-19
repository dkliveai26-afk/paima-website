import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server";
import { jwtVerify } from "jose";

// Clerk middleware handler — reads NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and
// CLERK_SECRET_KEY directly from environment variables. No hardcoded fallback
// keys are used here to prevent custom domain DNS errors.
const handleClerk = clerkMiddleware(async (auth, req) => {
  return NextResponse.next();
});

export default async function middleware(req: NextRequest, evt: NextFetchEvent) {
  const pathname = req.nextUrl.pathname;

  // 1. Edge protection for Admin API endpoints (/api/admin/* except login and logout)
  if (
    pathname.startsWith("/api/admin") &&
    !pathname.includes("/login") &&
    !pathname.includes("/logout")
  ) {
    const sessionCookie = req.cookies.get("paima_admin_session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    try {
      const jwtSecret = process.env.ADMIN_JWT_SECRET || "paima-secure-jwt-secret-987654321";
      const secret = new TextEncoder().encode(jwtSecret);
      await jwtVerify(sessionCookie, secret);
    } catch (err) {
      return NextResponse.json({ error: "Invalid or expired session." }, { status: 401 });
    }
  }

  // 2. Execute Clerk middleware safely — catches any handshake or configuration
  // exceptions to completely prevent 500 MIDDLEWARE_INVOCATION_FAILED crashes.
  try {
    return await handleClerk(req, evt);
  } catch (err) {
    console.error("[Middleware] Clerk execution notice:", err);

    // If a handshake query failed, redirect cleanly to strip the param and load the page
    if (req.nextUrl.searchParams.has("__clerk_handshake")) {
      const cleanUrl = req.nextUrl.clone();
      cleanUrl.searchParams.delete("__clerk_handshake");
      cleanUrl.searchParams.delete("__clerk_help");
      return NextResponse.redirect(cleanUrl);
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|json|webmanifest|jpg|jpeg|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
