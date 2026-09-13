# PAIMA Atelier – Project System Documentation

This document serves as the permanent, single source of truth for the PAIMA Architectural Studio project architecture as of the current verified state.

---

## A. PROJECT OVERVIEW
The PAIMA Atelier project is a modern, high-performance web application designed for a luxury interior design and real estate studio. It serves two primary user journeys:
1. **Public Visitors/Clients:** Browse services, portfolio, and submit high-value booking inquiries via a seamless, animated frontend.
2. **Studio Administrators:** Log into a highly secure private control console to manage bookings, client dossiers, messages, calendar, and audit activity.

---

## B. TECHNOLOGY STACK
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, `clsx`, `tailwind-merge`
- **Animations & 3D:** Framer Motion, Lenis (smooth scroll), Three.js, React Three Fiber, React Three Drei
- **Public Authentication:** `@clerk/nextjs` (Guest & Client logins)
- **Private Admin Auth:** Custom edge-compatible JWTs via `jose`
- **Database:** MongoDB (native driver `mongodb`)
- **Location Services:** Google Maps (`@googlemaps/js-api-loader`)
- **Icons:** `lucide-react`

---

## C. PROJECT STRUCTURE
- `/app/(public)`: All client-facing public routes (Home, About, Services, Contact, Portfolio).
- `/app/dilkhush-admin`: Private admin console routes.
- `/app/api`: All serverless API endpoints, divided into public (`/bookings`) and private (`/admin/*`).
- `/components`: Shared React components grouped by domain (`/admin`, `/animations`, `/home`, `/layout`, `/ui`).
- `/lib`: Core server logic, database connections, schemas, types, and SEO config.

---

## D. PUBLIC WEBSITE
All public pages are statically generated where possible or cached.
- **Home (`/`)**: Hero section, layered animations, services overview.
- **About (`/about`)**: Studio history and philosophy.
- **Services (`/services`)**: Detailed service offerings.
- **Portfolio (`/portfolio`)**: Visual galleries of past projects.
- **Contact (`/contact`)**: Public inquiry form, connects to `/api/bookings`.

---

## E. AUTHENTICATION SYSTEM
The project uses a **Dual Authentication Model**:

1. **Public Authentication (Clerk):**
   - Handles sign-ups and sign-ins for public users on the main website.
   - Provider: Clerk React components.
   - Completely decoupled from the admin dashboard.

2. **Private Admin Authentication (Custom JWT):**
   - Secures the `/dilkhush-admin` routes and `/api/admin/*` APIs.
   - Flow: Admin enters credentials → `/api/admin/login` → Verifies against `.env.local` → Issues `paima_admin_session` HttpOnly secure cookie.
   - Managed server-side via Next.js middleware and `jose` library.

---

## F. BOOKING / INQUIRY SYSTEM
**End-to-End Flow:**
1. User submits form on `/contact`.
2. Request hits `/api/bookings`.
3. Server validates data (no empty fields, valid email).
4. Server generates `PAIMA-BK-XXXXX` booking ID.
5. Server writes to `bookings` collection in MongoDB.
6. Server automatically mirrors the booking into the `messages` collection (for the admin inbox).
7. Server logs an `AdminActivityRecord`.
8. Admin views it on `/dilkhush-admin/bookings`.

---

## G. MONGODB
- **Database Name:** `paima_atelier`
- **Collections:**
  - `bookings`: Stores all client inquiries and projects.
  - `messages`: Stores direct contact messages and mirrors of bookings.
  - `admin_activities`: Immutable audit log of all system actions.
  - `site_settings`: Global studio settings (singleton document).
- **Connection Strategy:** Singleton client cached across hot-reloads (`globalThis._mongoClientPromise`) in `lib/mongodb.ts`.

---

## H. ADMIN SYSTEM
The admin system (`/dilkhush-admin`) is a restricted SPA-like experience wrapped in a secure Next.js layout.
- **Dashboard:** REAL. Fetches stats dynamically from MongoDB aggregations.
- **Bookings:** REAL. Fetches and updates booking statuses.
- **Customers:** REAL. Aggregates data from the `bookings` collection.
- **Calendar:** REAL. Displays confirmed bookings visually.
- **Messages:** REAL. Manages the mirrored inquiry inbox.
- **Activity:** REAL. Reads from `admin_activities`.
- **Settings:** REAL. Reads/writes to `site_settings`.

---

## I. ADMIN DATA FLOW
Example: **Dashboard Overview**
- **UI Component:** `DashboardOverview.tsx`
- **Fetch:** `fetch('/api/admin/stats')` on mount.
- **API:** `app/api/admin/stats/route.ts` calls `verifyAdminAuth()`.
- **Database:** `getDashboardStats()` in `lib/db-server.ts` runs concurrent `$count` and `$aggregate` queries.
- **Response:** JSON payload populates UI cards.

---

## J. CONTACT / LOCATION SYSTEM
- The `/contact` page features a bespoke form.
- Integrates with Google Maps via `@googlemaps/js-api-loader` if API keys are provided.
- Form submissions skip Clerk logic (unless the user happens to be signed in) and post directly to the database.

---

## K. ENVIRONMENT VARIABLES
*Required variables (Values intentionally omitted):*
- `MONGODB_URI`: Connection string to MongoDB cluster.
- `ADMIN_EMAIL`: The authorized email address(es) for the admin portal.
- `ADMIN_PASSWORD`: The exact string required to log into the admin portal.
- `ADMIN_JWT_SECRET`: The cryptographic key used to sign the admin session cookie.
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` & `CLERK_SECRET_KEY`: Standard public auth.

---

## L. API MAP
- **POST `/api/bookings`**: Public endpoint to submit a booking. No auth required.
- **POST `/api/admin/login`**: Authenticates admin. Issues cookie.
- **POST `/api/admin/logout`**: Destroys cookie.
- **GET `/api/admin/stats`**: Dashboard KPI aggregations. (Admin Auth)
- **GET/PATCH/DELETE `/api/admin/bookings`**: Booking management. (Admin Auth)
- **GET/PATCH/DELETE `/api/admin/messages`**: Inbox management. (Admin Auth)
- **GET `/api/admin/customers`**: Client directory. (Admin Auth)
- **GET `/api/admin/activity`**: Audit logs. (Admin Auth)
- **GET/PATCH `/api/admin/settings`**: Studio configuration. (Admin Auth)

---

## M. DATABASE MAP
```text
[ site_settings ] (Global Config)

[ bookings ] --------------.
      |                     \
(generates mirror)           \ (aggregated into)
      |                       \
      v                        v
[ messages ]            [ Customers (Virtual) ]

(any state change triggers)
      |
      v
[ admin_activities ]
```

---

## N. CURRENT SECURITY MODEL
- **Admin APIs:** Protected at the Edge via `middleware.ts` (checks JWT signature). Double-protected in the route handlers via `verifyAdminAuth()`.
- **Admin UI:** Client-side fallback blocks rendering if no session exists, preventing UI leakage.
- **Database:** Raw driver queries. No ORM injection vectors, but inputs are manually validated.

---

## O. CURRENT PERFORMANCE MODEL
- **MongoDB Aggregations:** The dashboard runs 10 `Promise.all` concurrent database queries to rapidly calculate KPIs.
- **Client Caching:** React `useEffect` is used for admin data fetching.
- **Middleware:** Edge-optimized JWT verification using `jose` adds minimal latency compared to traditional session checks.

---

## P. KNOWN ISSUES / TECHNICAL DEBT
1. **Clerk Clock Skew:** Local dev environment occasionally throws JWT expiration loops if the system clock drifts. (Low Priority - Dev only)
2. **Missing Rate Limiting:** `/api/bookings` is public and lacks rate-limiting or CAPTCHA, making it vulnerable to spam. (Medium Priority)
3. **No Database Indexes:** MongoDB queries perform full collection scans. Indexes on `status`, `createdAt`, and `email` are needed as the database grows. (Medium Priority)
4. **Soft Deletes:** Deleting a booking physically removes it (`deleteOne`). A soft-delete (`isDeleted: true`) would be safer for historical records. (Low Priority)

---

## Q. CURRENTLY WORKING FEATURES
- [x] Public Website Navigation & Animations
- [x] Contact Form Submission
- [x] MongoDB Connection & Persistence
- [x] Custom Admin Login / Logout Flow
- [x] Admin Edge Protection (401 on Unauthorized)
- [x] Admin Dashboard Stats
- [x] Admin Bookings (Read, Update Status)
- [x] Admin Messages (Read, Update Status, Delete)
- [x] Admin Customers Aggregation
- [x] Admin Activity Audit Logging

---

## R. DEPENDENCY / MAINTENANCE NOTES
- The project successfully isolated Clerk from the Admin system. Do not reintroduce Clerk hooks into `app/dilkhush-admin` components.
- The `mongodb` package is currently manually instantiated. Ensure `verify_db.js` is run before deploying to confirm DB reachability.
