import fs from "fs";
import path from "path";

export type BookingStatus =
  | "NEW"
  | "CONTACTED"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

export interface BookingRecord {
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
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "bookings.json");

function ensureDbExists(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

export function getAllBookingsFromDb(): BookingRecord[] {
  try {
    ensureDbExists();
    const rawData = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(rawData) as BookingRecord[];
  } catch (error) {
    console.error("Failed to read bookings database:", error);
    return [];
  }
}

export function saveAllBookingsToDb(bookings: BookingRecord[]): void {
  try {
    ensureDbExists();
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(bookings, null, 2), "utf-8");
    fs.renameSync(tempFile, DB_FILE);
  } catch (error) {
    console.error("Failed to write bookings database:", error);
  }
}

export function generateBookingId(): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `PAIMA-BK-${randomNum}`;
}

export function createBookingInDb(
  data: Omit<BookingRecord, "bookingId" | "createdAt" | "updatedAt" | "status">
): BookingRecord {
  const bookings = getAllBookingsFromDb();
  const now = new Date().toISOString();
  const newBooking: BookingRecord = {
    ...data,
    bookingId: generateBookingId(),
    createdAt: now,
    updatedAt: now,
    status: "NEW",
  };

  bookings.unshift(newBooking);
  saveAllBookingsToDb(bookings);
  return newBooking;
}

export function updateBookingStatusInDb(
  bookingId: string,
  newStatus: BookingStatus
): BookingRecord | null {
  const bookings = getAllBookingsFromDb();
  const index = bookings.findIndex((b) => b.bookingId === bookingId);
  if (index === -1) return null;

  bookings[index].status = newStatus;
  bookings[index].updatedAt = new Date().toISOString();
  saveAllBookingsToDb(bookings);
  return bookings[index];
}

export function deleteBookingFromDb(bookingId: string): boolean {
  const bookings = getAllBookingsFromDb();
  const filtered = bookings.filter((b) => b.bookingId !== bookingId);
  if (filtered.length === bookings.length) return false;

  saveAllBookingsToDb(filtered);
  return true;
}
