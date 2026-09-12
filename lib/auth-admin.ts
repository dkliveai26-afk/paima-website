import { auth, currentUser } from "@clerk/nextjs/server";

export const DEFAULT_ADMIN_EMAIL = "d.klive.ai26@gmail.com";

export interface AdminAuthResult {
  isAuthorized: boolean;
  userId: string | null;
  userEmail: string | null;
}

export async function verifyAdminAuth(): Promise<AdminAuthResult> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { isAuthorized: false, userId: null, userEmail: null };
    }

    const user = await currentUser();
    if (!user) {
      return { isAuthorized: false, userId, userEmail: null };
    }

    const allowedAdminEmail =
      process.env.ADMIN_EMAIL?.trim().toLowerCase() ||
      DEFAULT_ADMIN_EMAIL.toLowerCase();

    const userEmails = user.emailAddresses.map((e) =>
      e.emailAddress.toLowerCase()
    );

    const isAuthorized = userEmails.includes(allowedAdminEmail);

    return {
      isAuthorized,
      userId,
      userEmail: userEmails[0] || null,
    };
  } catch (error) {
    console.error("Admin verification error:", error);
    return { isAuthorized: false, userId: null, userEmail: null };
  }
}
