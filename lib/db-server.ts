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

async function requireDb() {
  if (!isMongoConfigured()) {
    throw new Error("MongoDB is not configured.");
  }
  const db = await getMongoDb();
  if (!db) {
    throw new Error("Failed to connect to MongoDB.");
  }
  await ensureDbIndexes(db);
  return db;
}

// ----------------------------------------------------
// BOOKINGS CRUD
// ----------------------------------------------------

export async function getAllBookings(): Promise<BookingRecord[]> {
  const db = await requireDb();
  const docs = await db
    .collection("bookings")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return docs.map((doc) => {
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
  });
}

export async function createBooking(
  data: Omit<BookingRecord, "bookingId" | "createdAt" | "updatedAt" | "status"> & {
    status?: BookingStatus;
  }
): Promise<BookingRecord> {
  const db = await requireDb();
  const now = new Date().toISOString();
  const normalizedEmail = (data.email || "").toString().toLowerCase().trim();
  const normalizedName = (data.fullName || "").toString().trim();
  const detailsText = (data.projectDetails || data.message || "").toString().trim();
  const targetStatus = data.status && VALID_BOOKING_STATUSES.includes(data.status) ? data.status : "NEW";

  // Duplicate submission protection (within 15 seconds)
  const fifteenSecsAgo = new Date(Date.now() - 15000).toISOString();
  const existingDuplicate = await db.collection("bookings").findOne({
    email: normalizedEmail,
    projectDetails: detailsText,
    createdAt: { $gte: fifteenSecsAgo },
  });

  if (existingDuplicate) {
    const doc = existingDuplicate;
    return {
      bookingId: doc.bookingId,
      createdAt: doc.createdAt || now,
      updatedAt: doc.updatedAt || doc.createdAt || now,
      fullName: doc.fullName || normalizedName,
      email: doc.email || normalizedEmail,
      phone: doc.phone || "",
      service: doc.service || data.service,
      preferredDate: doc.preferredDate || "",
      projectDetails: doc.projectDetails || detailsText,
      budget: doc.budget || "Unspecified",
      location: doc.location || "Unspecified",
      message: doc.message || detailsText,
      status: doc.status || targetStatus,
      clerkUserId: doc.clerkUserId || null,
      notes: Array.isArray(doc.notes) ? doc.notes : [],
      isVip: Boolean(doc.isVip),
    };
  }

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

  await db.collection("bookings").insertOne(newBooking);
  return newBooking;
}

export async function updateBookingStatus(
  bookingId: string,
  newStatus: BookingStatus
): Promise<BookingRecord | null> {
  if (!VALID_BOOKING_STATUSES.includes(newStatus)) {
    throw new Error(`Invalid status "${newStatus}". Must be one of: ${VALID_BOOKING_STATUSES.join(", ")}`);
  }

  const db = await requireDb();
  const now = new Date().toISOString();

  const res = await db.collection("bookings").findOneAndUpdate(
    { bookingId },
    { $set: { status: newStatus, updatedAt: now } },
    { returnDocument: "after" }
  );

  if (!res) return null;
  const doc = res as unknown as BookingRecord;

  return {
    bookingId: doc.bookingId,
    createdAt: doc.createdAt || now,
    updatedAt: now,
    fullName: (doc.fullName || "").toString().trim(),
    email: (doc.email || "").toString().toLowerCase().trim(),
    phone: (doc.phone || "").toString().trim(),
    service: (doc.service || "").toString().trim(),
    preferredDate: (doc.preferredDate || "").toString().trim(),
    projectDetails: (doc.projectDetails || doc.message || "").toString().trim(),
    budget: (doc.budget || "Unspecified").toString().trim(),
    location: (doc.location || "Unspecified").toString().trim(),
    message: (doc.message || doc.projectDetails || "").toString().trim(),
    status: doc.status || newStatus,
    clerkUserId: doc.clerkUserId || null,
    notes: Array.isArray(doc.notes) ? doc.notes : [],
    isVip: Boolean(doc.isVip),
  };
}

export async function deleteBooking(bookingId: string): Promise<boolean> {
  const db = await requireDb();
  const res = await db.collection("bookings").deleteOne({ bookingId });
  return res.deletedCount > 0;
}

// ----------------------------------------------------
// CUSTOMERS
// ----------------------------------------------------

export async function getAllCustomers(): Promise<CustomerSummary[]> {
  const db = await requireDb();
  
  // Query MongoDB properly to aggregate customers
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

  return docs.map((doc, idx) => ({
    id: `CUST-${idx + 1000}`,
    name: doc.name,
    email: doc._id,
    phone: doc.phone || "Unspecified",
    location: doc.location || "Worldwide",
    totalBookings: doc.totalBookings,
    latestBookingDate: doc.latestBookingDate ? doc.latestBookingDate.split("T")[0] : "",
    latestService: doc.latestService,
    status: doc.isVip ? "VIP Client" : "Active Client",
    joinedDate: doc.joinedDate ? doc.joinedDate.split("T")[0] : "",
    totalBudget: doc.budget || "Unspecified",
  }));
}

// ----------------------------------------------------
// INQUIRIES / MESSAGES
// ----------------------------------------------------

export async function getAllMessages(): Promise<InquiryRecord[]> {
  const db = await requireDb();
  const docs = await db
    .collection("messages")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
    
  return docs.map((doc) => ({
    id: doc.id,
    name: doc.name,
    email: doc.email,
    phone: doc.phone || "",
    subject: doc.subject,
    message: doc.message,
    service: doc.service || "",
    status: doc.status || "UNREAD",
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }));
}

export async function createMessage(
  data: Omit<InquiryRecord, "id" | "createdAt" | "updatedAt" | "status">
): Promise<InquiryRecord> {
  const db = await requireDb();
  const now = new Date().toISOString();
  const id = `MSG-${Math.floor(1000 + Math.random() * 9000)}`;
  const newMsg: InquiryRecord = {
    ...data,
    id,
    status: "UNREAD",
    createdAt: now,
    updatedAt: now,
  };

  await db.collection("messages").insertOne(newMsg);
  return newMsg;
}

export async function updateMessageStatus(
  id: string,
  status: InquiryRecord["status"]
): Promise<boolean> {
  const db = await requireDb();
  const now = new Date().toISOString();

  const res = await db
    .collection("messages")
    .updateOne({ id }, { $set: { status, updatedAt: now } });

  return res.modifiedCount > 0;
}

export async function deleteMessage(id: string): Promise<boolean> {
  const db = await requireDb();
  const res = await db.collection("messages").deleteOne({ id });
  return res.deletedCount > 0;
}

// ----------------------------------------------------
// AUDIT / ADMIN ACTIVITY LOGS
// ----------------------------------------------------

export async function getAllActivities(limit = 100): Promise<AdminActivityRecord[]> {
  const db = await requireDb();
  const docs = await db
    .collection("admin_activities")
    .find({})
    .sort({ timestamp: -1 })
    .limit(limit)
    .toArray();
    
  return docs.map((d) => ({
    id: d.id,
    actorId: d.actorId || null,
    actorEmail: d.actorEmail,
    action: d.action,
    entityType: d.entityType,
    entityId: d.entityId || null,
    description: d.description,
    timestamp: d.timestamp,
    metadata: d.metadata || {},
  }));
}

export async function recordActivity(
  data: Omit<AdminActivityRecord, "id" | "timestamp">
): Promise<AdminActivityRecord> {
  const db = await requireDb();
  const now = new Date().toISOString();
  const id = `ACT-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
  const newActivity: AdminActivityRecord = {
    ...data,
    id,
    timestamp: now,
  };

  await db.collection("admin_activities").insertOne(newActivity);
  return newActivity;
}

// ----------------------------------------------------
// SITE & LOCATION SETTINGS
// ----------------------------------------------------

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

export async function getSiteSettings(): Promise<SiteSettingsRecord> {
  try {
    const db = await requireDb();
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
  } catch (err) {
    console.warn("Could not fetch site settings, using default:", err);
  }
  return DEFAULT_SITE_SETTINGS;
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

  const db = await requireDb();
  await db
    .collection("site_settings")
    .updateOne({ key: "global" }, { $set: { ...updated, key: "global" } }, { upsert: true });

  return updated;
}

// ----------------------------------------------------
// DYNAMIC DASHBOARD KPIS CALCULATION (MONGODB AGGREGATION)
// ----------------------------------------------------


export async function getDashboardStats(): Promise<DashboardStats> {
  const db = await requireDb();

  // Run all aggregations concurrently for maximum performance
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

    // Count unique patron emails across all bookings
    db
      .collection("bookings")
      .aggregate([
        { $group: { _id: { $toLower: "$email" } } },
        { $count: "total" },
      ])
      .toArray()
      .then((res) => (res[0]?.total as number) || 0),

    // Messages (contact enquiries) collection stats
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
    // Legacy field kept for backwards compat
    unreadMessagesCount: unreadMessages,
    // New explicit message stats
    totalMessages,
    unreadMessages,
    readMessages,
  };
}
