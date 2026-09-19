// Central database entry point for PAIMA Atelier
// Seamlessly re-exports all database operations with automatic MongoDB & fallback support.

export * from "./db-server";

import {
  getAllBookings,
  createBooking,
  updateBookingStatus,
  deleteBooking,
} from "./db-server";

// Original legacy aliases for 100% backward compatibility with commit f4aa7a7e
export const getAllBookingsFromDb = getAllBookings;
export const createBookingInDb = createBooking;
export const updateBookingStatusInDb = updateBookingStatus;
export const deleteBookingFromDb = deleteBooking;
export { generateBookingId } from "./db-server";
