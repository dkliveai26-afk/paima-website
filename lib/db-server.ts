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

export function generateBookingId(): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `PAIMA-BK-${randomNum}`;
}

async function requireDb() {
  if (!isMongoConfigured()) {
    throw new Error("MongoDB is not configured.");
  }
  const db = await getMongoDb();
  if (!db) {
    throw new Error("Failed to connect to MongoDB.");
  }
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
    
  return docs.map((doc) => ({
    bookingId: doc.bookingId,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    fullName: doc.fullName,
    email: doc.email,
    phone: doc.phone || "",
    service: doc.service,
    preferredDate: doc.preferredDate || "",
    preferredTime: doc.preferredTime || "",
    projectDetails: doc.projectDetails || "",
    budget: doc.budget || "Unspecified",
    location: doc.location || "Unspecified",
    message: doc.message || "",
    status: doc.status || "NEW",
    clerkUserId: doc.clerkUserId || null,
    notes: doc.notes || [],
    isVip: doc.isVip || false,
  }));
}

export async function createBooking(
  data: Omit<BookingRecord, "bookingId" | "createdAt" | "updatedAt" | "status"> & {
    status?: BookingStatus;
  }
): Promise<BookingRecord> {
  const db = await requireDb();
  const now = new Date().toISOString();
  const newBooking: BookingRecord = {
    ...data,
    bookingId: generateBookingId(),
    createdAt: now,
    updatedAt: now,
    status: data.status || "NEW",
  };

  await db.collection("bookings").insertOne(newBooking);
  return newBooking;
}

export async function updateBookingStatus(
  bookingId: string,
  newStatus: BookingStatus
): Promise<BookingRecord | null> {
  const db = await requireDb();
  const now = new Date().toISOString();

  const res = await db.collection("bookings").findOneAndUpdate(
    { bookingId },
    { $set: { status: newStatus, updatedAt: now } },
    { returnDocument: "after" }
  );

  return res ? (res as unknown as BookingRecord) : null;
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
