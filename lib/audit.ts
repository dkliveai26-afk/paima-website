import { recordActivity, AdminActivityRecord } from "./db-server";
import { verifyAdminAuth } from "./auth-admin";

export async function logAdminAction({
  action,
  entityType,
  entityId,
  description,
  metadata,
}: {
  action: string;
  entityType: AdminActivityRecord["entityType"];
  entityId?: string | null;
  description: string;
  metadata?: Record<string, any>;
}): Promise<AdminActivityRecord | null> {
  try {
    const authResult = await verifyAdminAuth();
    const actorEmail = authResult.userEmail || "system@paimadesign.com";
    const actorId = authResult.userId || null;

    return await recordActivity({
      actorId,
      actorEmail,
      action,
      entityType,
      entityId: entityId || null,
      description,
      metadata: metadata || {},
    });
  } catch (err) {
    console.error("Failed to log admin action:", err);
    return null;
  }
}
