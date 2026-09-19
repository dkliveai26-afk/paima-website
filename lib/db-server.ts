import fs from "fs";
import path from "path";
import { getMongoDb, isMongoConfigured } from "./mongodb";
import type {
  BookingStatus,
  BookingRecord,
  InquiryRecord,
  AdminActivityRecord,
  SiteSettingsRecord,
  CustomerSummary,
  DashboardStats,
} from "./types";

// Re-export all shared types so existing imports from @/lib/db-server continue to work
export type {
  BookingStatus,
  BookingRecord,
  InquiryRecord,
  AdminActivityRecord,
  SiteSettingsRecord,
  CustomerSummary,
  DashboardStats,
} from "./types";

export const VALID_BOOKING_STATUSES: BookingStatus[] = [
  "NEW",
  "CONTACTED",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
];

export function generateBookingId(): string {
  const timePart = Date.now().toString(36).toUpperCase();
  const randPart = Math.floor(1000 + Math.random() * 9000);
  return `PAIMA-BK-${timePart}-${randPart}`;
}

// ----------------------------------------------------
// RESILIENT FALLBACK DATA STORE (In-Memory + File Sync)
// ----------------------------------------------------

const DATA_DIR = path.join(process.cwd(), "data");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");
const ACTIVITIES_FILE = path.join(DATA_DIR, "activities.json");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");

interface FallbackStore {
  bookings: BookingRecord[];
  messages: InquiryRecord[];
  activities: AdminActivityRecord[];
  settings: SiteSettingsRecord;
}

export const DEFAULT_SITE_SETTINGS: SiteSettingsRecord = {
  studioName: "PAIMA Architectural Studio",
  legalName: "Paima Luxury Interiors & Prime Real Estate Group",
  tagline: "Ultra-Prime Real Estate & Bespoke Spatial Architecture",
  email: "concierge@paimadesign.com",
  phone: "+1 (212) 890-4100",
  primaryAddress: "575 Madison Avenue, Upper East Side, New York, NY 10022",
  city: "New York",
  state: "NY",
  country: "United States",
  latitude: 40.7614,
  longitude: -73.9719,
  zoom: 16,
  operatingHours: "Monday – Friday • 09:00 – 18:00 EST / CET",
  updatedAt: new Date().toISOString(),
};

declare global {
  // eslint-disable-next-line no-var
  var _paimaFallbackStore: FallbackStore | undefined;
}

function safeReadJson<T>(filePath: string, defaultValue: T): T {
  try {
    if (typeof window === "undefined" && fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(raw) as T;
    }
  } catch {
    // Non-fatal if filesystem is read-only or file doesn't exist
  }
  return defaultValue;
}

function safeWriteJson<T>(filePath: string, data: T): void {
  try {
    if (typeof window === "undefined") {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const tempFile = `${filePath}.tmp.${Date.now()}`;
      fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), "utf-8");
      fs.renameSync(tempFile, filePath);
    }
  } catch {
    // Non-fatal on serverless read-only environments
  }
}

function getFallbackStore(): FallbackStore {
  if (!global._paimaFallbackStore) {
    global._paimaFallbackStore = {
      bookings: safeReadJson<BookingRecord[]>(BOOKINGS_FILE, []),
      messages: safeReadJson<InquiryRecord[]>(MESSAGES_FILE, []),
      activities: safeReadJson<AdminActivityRecord[]>(ACTIVITIES_FILE, []),
      settings: safeReadJson<SiteSettingsRecord>(SETTINGS_FILE, DEFAULT_SITE_SETTINGS),
    };
  }
  return global._paimaFallbackStore;
}

let indexesEnsured = false;
async function ensureDbIndexes(db: any) {
  if (indexesEnsured) return;
  try {
    await Promise.all([
      db.collection("bookings").createIndex({ bookingId: 1 }, { unique: true }),
      db.collection("bookings").createIndex({ createdAt: -1 }),
      db.collection("bookings").createIndex({ status: 1 }),
      db.collection("bookings").createIndex({ email: 1 }),
      db.collection("messages").createIndex({ createdAt: -1 }),
      db.collection("messages").createIndex({ status: 1 }),
      db.collection("admin_activities").createIndex({ timestamp: -1 }),
    ]);
    indexesEnsured = true;
  } catch {
    indexesEnsured = true;
  }
}

/**
 * Safely acquire MongoDB database instance if available, without throwing hard fatal errors.
 */
async function getDb(): Promise<any | null> {
  try {
    if (!isMongoConfigured()) return null;
    const db = await getMongoDb();
    if (db) {
      await ensureDbIndexes(db);
      return db;
    }
  } catch (err) {
    console.warn("MongoDB connection unavailable, utilizing resilient store fallback:", err);
  }
  return null;
}

function sanitizeBookingDoc(doc: any): BookingRecord {
  const rawStatus = (doc.status || "NEW").toUpperCase() as BookingStatus;
  const status = VALID_BOOKING_STATUSES.includes(rawStatus) ? rawStatus : "NEW";
  const created = doc.createdAt || new Date().toISOString();
  const updated = doc.updatedAt || created;
  const msg = (doc.message || doc.projectDetails || "").toString().trim();
  const details = (doc.projectDetails || doc.message || "").toString().trim();

  return {
    bookingId: doc.bookingId || generateBookingId(),
    createdAt: created,
    updatedAt: updated,
    fullName: (doc.fullName || "Valued Client").toString().trim(),
    email: (doc.email || "").toString().toLowerCase().trim(),
    phone: (doc.phone || "").toString().trim(),
    service: (doc.service || "Haute Architectural Interior").toString().trim(),
    preferredDate: (doc.preferredDate || "").toString().trim(),
    projectDetails: details,
    budget: (doc.budget || "Unspecified").toString().trim(),
    location: (doc.location || "Unspecified").toString().trim(),
    message: msg,
    status,
    clerkUserId: doc.clerkUserId || null,
    notes: Array.isArray(doc.notes) ? doc.notes : [],
    isVip: Boolean(doc.isVip),
  };
}

// ----------------------------------------------------
// BOOKINGS CRUD
// ----------------------------------------------------

export async function getAllBookings(): Promise<BookingRecord[]> {
  try {
    const db = await getDb();
    if (db) {
      const docs = await db
        .collection("bookings")
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      if (docs && docs.length > 0) {
        const parsed = docs.map(sanitizeBookingDoc);
        // Sync into fallback cache for offline availability
        const store = getFallbackStore();
        store.bookings = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.warn("MongoDB getAllBookings error, returning fallback store:", err);
  }

  const store = getFallbackStore();
  return [...store.bookings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createBooking(
  data: Omit<BookingRecord, "bookingId" | "createdAt" | "updatedAt" | "status"> & {
    status?: BookingStatus;
  }
): Promise<BookingRecord> {
  const now = new Date().toISOString();
  const normalizedEmail = (data.email || "").toString().toLowerCase().trim();
  const normalizedName = (data.fullName || "").toString().trim();
  const detailsText = (data.projectDetails || data.message || "").toString().trim();
  const targetStatus = data.status && VALID_BOOKING_STATUSES.includes(data.status) ? data.status : "NEW";

  const newBooking: BookingRecord = {
    bookingId: generateBookingId(),
    createdAt: now,
    updatedAt: now,
    fullName: normalizedName,
    email: normalizedEmail,
    phone: (data.phone || "").toString().trim(),
    service: (data.service || "Haute Architectural Interior").toString().trim(),
    preferredDate: (data.preferredDate || "").toString().trim(),
    projectDetails: detailsText,
    budget: (data.budget || "Unspecified").toString().trim(),
    location: (data.location || "Unspecified").toString().trim(),
    message: (data.message || detailsText).toString().trim(),
    status: targetStatus,
    clerkUserId: data.clerkUserId || null,
    notes: Array.isArray(data.notes) ? data.notes : [],
    isVip: Boolean(data.isVip),
  };

  // 1. Attempt writing to MongoDB
  try {
    const db = await getDb();
    if (db) {
      // Duplicate submission protection (within 15 seconds)
      const fifteenSecsAgo = new Date(Date.now() - 15000).toISOString();
      const existingDuplicate = await db.collection("bookings").findOne({
        email: normalizedEmail,
        projectDetails: detailsText,
        createdAt: { $gte: fifteenSecsAgo },
      });

      if (existingDuplicate) {
        return sanitizeBookingDoc(existingDuplicate);
      }

      await db.collection("bookings").insertOne({ ...newBooking });
    }
  } catch (mongoErr) {
    console.warn("MongoDB insert error, writing to resilient fallback store:", mongoErr);
  }

  // 2. Persist to fallback store
  const store = getFallbackStore();
  const existingDup = store.bookings.find(
    (b) =>
      b.email === normalizedEmail &&
      b.projectDetails === detailsText &&
      new Date(b.createdAt).getTime() > Date.now() - 15000
  );
  if (existingDup) {
    return existingDup;
  }

  store.bookings.unshift(newBooking);
  safeWriteJson(BOOKINGS_FILE, store.bookings);

  return newBooking;
}

export async function updateBookingStatus(
  bookingId: string,
  newStatus: BookingStatus
): Promise<BookingRecord | null> {
  if (!VALID_BOOKING_STATUSES.includes(newStatus)) {
    throw new Error(`Invalid status "${newStatus}". Must be one of: ${VALID_BOOKING_STATUSES.join(", ")}`);
  }

  const now = new Date().toISOString();

  // 1. Attempt MongoDB update
  try {
    const db = await getDb();
    if (db) {
      const res = await db.collection("bookings").findOneAndUpdate(
        { bookingId },
        { $set: { status: newStatus, updatedAt: now } },
        { returnDocument: "after" }
      );
      if (res) {
        const doc = sanitizeBookingDoc(res);
        // Sync into fallback
        const store = getFallbackStore();
        const idx = store.bookings.findIndex((b) => b.bookingId === bookingId);
        if (idx !== -1) {
          store.bookings[idx] = doc;
          safeWriteJson(BOOKINGS_FILE, store.bookings);
        }
        return doc;
      }
    }
  } catch (err) {
    console.warn("MongoDB updateBookingStatus error:", err);
  }

  // 2. Fallback store update
  const store = getFallbackStore();
  const idx = store.bookings.findIndex((b) => b.bookingId === bookingId);
  if (idx === -1) return null;

  store.bookings[idx].status = newStatus;
  store.bookings[idx].updatedAt = now;
  safeWriteJson(BOOKINGS_FILE, store.bookings);
  return store.bookings[idx];
}

export async function deleteBooking(bookingId: string): Promise<boolean> {
  let deletedFromMongo = false;
  try {
    const db = await getDb();
    if (db) {
      const res = await db.collection("bookings").deleteOne({ bookingId });
      deletedFromMongo = res.deletedCount > 0;
    }
  } catch (err) {
    console.warn("MongoDB deleteBooking error:", err);
  }

  const store = getFallbackStore();
  const prevLen = store.bookings.length;
  store.bookings = store.bookings.filter((b) => b.bookingId !== bookingId);
  const deletedFromFallback = store.bookings.length < prevLen;
  if (deletedFromFallback) {
    safeWriteJson(BOOKINGS_FILE, store.bookings);
  }

  return deletedFromMongo || deletedFromFallback;
}

// ----------------------------------------------------
// CUSTOMERS
// ----------------------------------------------------

export async function getAllCustomers(): Promise<CustomerSummary[]> {
  try {
    const db = await getDb();
    if (db) {
      const pipeline = [
        {
          $group: {
            _id: { $toLower: "$email" },
            name: { $first: "$fullName" },
            phone: { $first: "$phone" },
            location: { $first: "$location" },
            totalBookings: { $sum: 1 },
            latestBookingDate: { $max: "$createdAt" },
            latestService: { $last: "$service" },
            isVip: { $max: "$isVip" },
            joinedDate: { $min: "$createdAt" },
            budget: { $last: "$budget" }
          }
        },
        { $sort: { latestBookingDate: -1 } }
      ];

      const docs = await db.collection("bookings").aggregate(pipeline).toArray();
      if (docs && docs.length > 0) {
        return docs.map((doc: any, idx: number) => ({
          id: `CUST-${idx + 1000}`,
          name: doc.name || "Esteemed Client",
          email: doc._id,
          phone: doc.phone || "Unspecified",
          location: doc.location || "Worldwide",
          totalBookings: doc.totalBookings || 1,
          latestBookingDate: doc.latestBookingDate ? doc.latestBookingDate.split("T")[0] : "",
          latestService: doc.latestService || "Haute Interior Architecture",
          status: doc.isVip ? "VIP Client" : "Active Client",
          joinedDate: doc.joinedDate ? doc.joinedDate.split("T")[0] : "",
          totalBudget: doc.budget || "Unspecified",
        }));
      }
    }
  } catch (err) {
    console.warn("MongoDB customers aggregation error, using fallback store:", err);
  }

  // Fallback calculation from in-memory bookings
  const store = getFallbackStore();
  const map = new Map<string, BookingRecord[]>();
  for (const b of store.bookings) {
    const emailKey = (b.email || "").toLowerCase();
    if (!emailKey) continue;
    if (!map.has(emailKey)) map.set(emailKey, []);
    map.get(emailKey)!.push(b);
  }

  const result: CustomerSummary[] = [];
  let idx = 1000;
  for (const [email, bList] of map.entries()) {
    bList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const latest = bList[0];
    const earliest = bList[bList.length - 1];
    const isVip = bList.some((b) => b.isVip);

    result.push({
      id: `CUST-${idx++}`,
      name: latest.fullName || "Esteemed Client",
      email,
      phone: latest.phone || "Unspecified",
      location: latest.location || "Worldwide",
      totalBookings: bList.length,
      latestBookingDate: latest.createdAt ? latest.createdAt.split("T")[0] : "",
      latestService: latest.service || "Haute Interior Architecture",
      status: isVip ? "VIP Client" : "Active Client",
      joinedDate: earliest.createdAt ? earliest.createdAt.split("T")[0] : "",
      totalBudget: latest.budget || "Unspecified",
    });
  }

  return result;
}

// ----------------------------------------------------
// INQUIRIES / MESSAGES
// ----------------------------------------------------

export async function getAllMessages(): Promise<InquiryRecord[]> {
  try {
    const db = await getDb();
    if (db) {
      const docs = await db
        .collection("messages")
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      if (docs && docs.length > 0) {
        return docs.map((doc: any) => ({
          id: doc.id || `MSG-${Math.floor(1000 + Math.random() * 9000)}`,
          name: doc.name || "",
          email: doc.email || "",
          phone: doc.phone || "",
          subject: doc.subject || "",
          message: doc.message || "",
          service: doc.service || "",
          status: doc.status || "UNREAD",
          createdAt: doc.createdAt || new Date().toISOString(),
          updatedAt: doc.updatedAt || doc.createdAt || new Date().toISOString(),
        }));
      }
    }
  } catch (err) {
    console.warn("MongoDB getAllMessages error:", err);
  }

  const store = getFallbackStore();
  return [...store.messages].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createMessage(
  data: Omit<InquiryRecord, "id" | "createdAt" | "updatedAt" | "status">
): Promise<InquiryRecord> {
  const now = new Date().toISOString();
  const id = `MSG-${Math.floor(1000 + Math.random() * 9000)}`;
  const newMsg: InquiryRecord = {
    ...data,
    id,
    status: "UNREAD",
    createdAt: now,
    updatedAt: now,
  };

  try {
    const db = await getDb();
    if (db) {
      await db.collection("messages").insertOne({ ...newMsg });
    }
  } catch (err) {
    console.warn("MongoDB createMessage error:", err);
  }

  const store = getFallbackStore();
  store.messages.unshift(newMsg);
  safeWriteJson(MESSAGES_FILE, store.messages);

  return newMsg;
}

export async function updateMessageStatus(
  id: string,
  status: InquiryRecord["status"]
): Promise<boolean> {
  const now = new Date().toISOString();
  let updatedMongo = false;

  try {
    const db = await getDb();
    if (db) {
      const res = await db
        .collection("messages")
        .updateOne({ id }, { $set: { status, updatedAt: now } });
      updatedMongo = res.modifiedCount > 0;
    }
  } catch (err) {
    console.warn("MongoDB updateMessageStatus error:", err);
  }

  const store = getFallbackStore();
  const msg = store.messages.find((m) => m.id === id);
  if (msg) {
    msg.status = status;
    msg.updatedAt = now;
    safeWriteJson(MESSAGES_FILE, store.messages);
    return true;
  }

  return updatedMongo;
}

export async function deleteMessage(id: string): Promise<boolean> {
  let deletedFromMongo = false;

  try {
    const db = await getDb();
    if (db) {
      const res = await db.collection("messages").deleteOne({ id });
      deletedFromMongo = res.deletedCount > 0;
    }
  } catch (err) {
    console.warn("MongoDB deleteMessage error:", err);
  }

  const store = getFallbackStore();
  const prevLen = store.messages.length;
  store.messages = store.messages.filter((m) => m.id !== id);
  const deletedFromFallback = store.messages.length < prevLen;
  if (deletedFromFallback) {
    safeWriteJson(MESSAGES_FILE, store.messages);
  }

  return deletedFromMongo || deletedFromFallback;
}

// ----------------------------------------------------
// AUDIT / ADMIN ACTIVITY LOGS
// ----------------------------------------------------

export async function getAllActivities(limit = 100): Promise<AdminActivityRecord[]> {
  try {
    const db = await getDb();
    if (db) {
      const docs = await db
        .collection("admin_activities")
        .find({})
        .sort({ timestamp: -1 })
        .limit(limit)
        .toArray();

      if (docs && docs.length > 0) {
        return docs.map((d: any) => ({
          id: d.id,
          actorId: d.actorId || null,
          actorEmail: d.actorEmail || "system",
          action: d.action,
          entityType: d.entityType,
          entityId: d.entityId || null,
          description: d.description,
          timestamp: d.timestamp,
          metadata: d.metadata || {},
        }));
      }
    }
  } catch (err) {
    console.warn("MongoDB getAllActivities error:", err);
  }

  const store = getFallbackStore();
  return store.activities.slice(0, limit);
}

export async function recordActivity(
  data: Omit<AdminActivityRecord, "id" | "timestamp">
): Promise<AdminActivityRecord> {
  const now = new Date().toISOString();
  const id = `ACT-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
  const newActivity: AdminActivityRecord = {
    ...data,
    id,
    timestamp: now,
  };

  try {
    const db = await getDb();
    if (db) {
      await db.collection("admin_activities").insertOne({ ...newActivity });
    }
  } catch (err) {
    console.warn("MongoDB recordActivity error:", err);
  }

  const store = getFallbackStore();
  store.activities.unshift(newActivity);
  if (store.activities.length > 200) {
    store.activities = store.activities.slice(0, 200);
  }
  safeWriteJson(ACTIVITIES_FILE, store.activities);

  return newActivity;
}

// ----------------------------------------------------
// SITE & LOCATION SETTINGS
// ----------------------------------------------------

export async function getSiteSettings(): Promise<SiteSettingsRecord> {
  try {
    const db = await getDb();
    if (db) {
      const doc = await db.collection("site_settings").findOne({ key: "global" });
      if (doc) {
        return {
          studioName: doc.studioName || DEFAULT_SITE_SETTINGS.studioName,
          legalName: doc.legalName || DEFAULT_SITE_SETTINGS.legalName,
          tagline: doc.tagline || DEFAULT_SITE_SETTINGS.tagline,
          email: doc.email || DEFAULT_SITE_SETTINGS.email,
          phone: doc.phone || DEFAULT_SITE_SETTINGS.phone,
          primaryAddress: doc.primaryAddress || DEFAULT_SITE_SETTINGS.primaryAddress,
          city: doc.city || DEFAULT_SITE_SETTINGS.city,
          state: doc.state || DEFAULT_SITE_SETTINGS.state,
          country: doc.country || DEFAULT_SITE_SETTINGS.country,
          latitude: Number(doc.latitude) || DEFAULT_SITE_SETTINGS.latitude,
          longitude: Number(doc.longitude) || DEFAULT_SITE_SETTINGS.longitude,
          zoom: Number(doc.zoom) || DEFAULT_SITE_SETTINGS.zoom,
          operatingHours: doc.operatingHours || DEFAULT_SITE_SETTINGS.operatingHours,
          updatedAt: doc.updatedAt || DEFAULT_SITE_SETTINGS.updatedAt,
        };
      }
    }
  } catch (err) {
    console.warn("MongoDB getSiteSettings error:", err);
  }

  const store = getFallbackStore();
  return store.settings || DEFAULT_SITE_SETTINGS;
}

export async function updateSiteSettings(
  data: Partial<SiteSettingsRecord>
): Promise<SiteSettingsRecord> {
  const current = await getSiteSettings();
  const updated: SiteSettingsRecord = {
    ...current,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  try {
    const db = await getDb();
    if (db) {
      await db
        .collection("site_settings")
        .updateOne({ key: "global" }, { $set: { ...updated, key: "global" } }, { upsert: true });
    }
  } catch (err) {
    console.warn("MongoDB updateSiteSettings error:", err);
  }

  const store = getFallbackStore();
  store.settings = updated;
  safeWriteJson(SETTINGS_FILE, updated);

  return updated;
}

// ----------------------------------------------------
// DYNAMIC DASHBOARD KPIS CALCULATION
// ----------------------------------------------------

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const db = await getDb();
    if (db) {
      const [
        totalBookings,
        newInquiries,
        contactedCount,
        confirmedConsultations,
        completedProjects,
        cancelledCount,
        uniqueCustomers,
        totalMessages,
        unreadMessages,
        readMessages,
      ] = await Promise.all([
        db.collection("bookings").countDocuments({}),
        db.collection("bookings").countDocuments({ status: "NEW" }),
        db.collection("bookings").countDocuments({ status: "CONTACTED" }),
        db.collection("bookings").countDocuments({ status: "CONFIRMED" }),
        db.collection("bookings").countDocuments({ status: "COMPLETED" }),
        db.collection("bookings").countDocuments({ status: "CANCELLED" }),
        db
          .collection("bookings")
          .aggregate([
            { $group: { _id: { $toLower: "$email" } } },
            { $count: "total" },
          ])
          .toArray()
          .then((res: any[]) => (res[0]?.total as number) || 0),
        db.collection("messages").countDocuments({}),
        db.collection("messages").countDocuments({ status: "UNREAD" }),
        db.collection("messages").countDocuments({ status: "READ" }),
      ]);

      return {
        totalBookings,
        newInquiries,
        contactedCount,
        confirmedConsultations,
        completedProjects,
        cancelledCount,
        totalCustomers: uniqueCustomers,
        unreadMessagesCount: unreadMessages,
        totalMessages,
        unreadMessages,
        readMessages,
      };
    }
  } catch (err) {
    console.warn("MongoDB getDashboardStats error, calculating from fallback store:", err);
  }

  const store = getFallbackStore();
  const totalBookings = store.bookings.length;
  const newInquiries = store.bookings.filter((b) => b.status === "NEW").length;
  const contactedCount = store.bookings.filter((b) => b.status === "CONTACTED").length;
  const confirmedConsultations = store.bookings.filter((b) => b.status === "CONFIRMED").length;
  const completedProjects = store.bookings.filter((b) => b.status === "COMPLETED").length;
  const cancelledCount = store.bookings.filter((b) => b.status === "CANCELLED").length;

  const uniqueEmails = new Set(store.bookings.map((b) => (b.email || "").toLowerCase()).filter(Boolean));
  const totalCustomers = uniqueEmails.size;

  const totalMessages = store.messages.length;
  const unreadMessages = store.messages.filter((m) => m.status === "UNREAD").length;
  const readMessages = store.messages.filter((m) => m.status === "READ").length;

  return {
    totalBookings,
    newInquiries,
    contactedCount,
    confirmedConsultations,
    completedProjects,
    cancelledCount,
    totalCustomers,
    unreadMessagesCount: unreadMessages,
    totalMessages,
    unreadMessages,
    readMessages,
  };
}
