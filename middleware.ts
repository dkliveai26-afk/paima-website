import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl;
  const pathname = url.pathname;
  
  // Protect all /api/admin/* routes at the edge using our Custom JWT
  // (Skip the login and logout routes)
  if (pathname.startsWith("/api/admin") && !pathname.includes("/login") && !pathname.includes("/logout")) {
    const sessionCookie = req.cookies.get("paima_admin_session")?.value;
    
    if (!sessionCookie) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }
    
    try {
      const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET || "");
      await jwtVerify(sessionCookie, secret);
    } catch (err) {
      return NextResponse.json({ error: "Invalid or expired session." }, { status: 401 });
    }
  }

  // /dilkhush-admin/* page routes are NOT edge-redirected here to avoid redirect loops.
  // The AdminAuthGuard (client component) will handle showing the login UI
  // if verifyAdminAuth() fails to find a valid session on page load.
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|json|webmanifest|jpg|jpeg|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
