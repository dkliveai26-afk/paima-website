import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

export default clerkMiddleware(async (auth, req: NextRequest) => {
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

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|json|webmanifest|jpg|jpeg|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
