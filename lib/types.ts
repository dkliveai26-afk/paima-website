// Shared TypeScript types — safe for both server and client imports.
// DB function implementations live in lib/db-server.ts (server-only).

export type BookingStatus =
  | "NEW"
  | "CONTACTED"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

export interface BookingRecord {
  id?: string;
  bookingId: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  email: string;
  phone: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  projectDetails: string;
  budget: string;
  location: string;
  message: string;
  status: BookingStatus;
  clerkUserId?: string | null;
  notes?: string[];
  isVip?: boolean;
}

export interface InquiryRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  service?: string;
  status: "UNREAD" | "READ" | "REPLIED" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
}

export interface AdminActivityRecord {
  id: string;
  actorId?: string | null;
  actorEmail: string;
  action: string;
  entityType: "BOOKING" | "CUSTOMER" | "MESSAGE" | "SETTINGS" | "SESSION" | "SYSTEM";
  entityId?: string | null;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface SiteSettingsRecord {
  studioName: string;
  legalName: string;
  tagline: string;
  email: string;
  phone: string;
  primaryAddress: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  zoom: number;
  operatingHours: string;
  updatedAt: string;
}

export interface CustomerSummary {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  totalBookings: number;
  latestBookingDate: string;
  latestService: string;
  status: "VIP Client" | "Active Client" | "New Lead" | "Archived";
  joinedDate: string;
  totalBudget: string;
}

export interface DashboardStats {
  totalBookings: number;
  newInquiries: number;
  contactedCount: number;
  confirmedConsultations: number;
  completedProjects: number;
  cancelledCount: number;
  totalCustomers: number;
  unreadMessagesCount: number;
  // Contact enquiry (messages collection) specific counts
  totalMessages: number;
  unreadMessages: number;
  readMessages: number;
}

