import { getMongoDb, isMongoConfigured } from "./mongodb";
import { AGENCY_INFO, SERVICES, PROJECTS } from "./data";

export interface KnowledgeDocument {
  type: string;
  content: any;
  updatedAt: string;
}

export async function seedKnowledgeBase() {
  if (!isMongoConfigured()) return;
  
  const db = await getMongoDb();
  if (!db) return;

  const collection = db.collection<KnowledgeDocument>("ai_knowledge");
  
  // Check if data exists
  const count = await collection.countDocuments();
  if (count > 0) {
    return; // Already seeded
  }

  const now = new Date().toISOString();

  // Seed AGENCY_INFO
  await collection.insertOne({
    type: "AGENCY_INFO",
    content: AGENCY_INFO,
    updatedAt: now,
  });

  // Seed SERVICES
  await collection.insertOne({
    type: "SERVICES",
    content: SERVICES,
    updatedAt: now,
  });

  // Seed PROJECTS
  await collection.insertOne({
    type: "PROJECTS",
    content: PROJECTS,
    updatedAt: now,
  });

  console.log("Successfully seeded PAIMA AI knowledge base to MongoDB.");
}

// In-memory cached system context with 10-minute TTL to eliminate database latency on chat path
let cachedKnowledgeContext: string | null = null;
let lastContextFetchTime = 0;
const CACHE_TTL_MS = 10 * 60 * 1000;

export function invalidateKnowledgeBaseCache() {
  cachedKnowledgeContext = null;
  lastContextFetchTime = 0;
}

export async function getKnowledgeBaseContext(forceRefresh = false): Promise<string> {
  const now = Date.now();
  if (!forceRefresh && cachedKnowledgeContext && (now - lastContextFetchTime < CACHE_TTL_MS)) {
    return cachedKnowledgeContext;
  }

  let agency = AGENCY_INFO;
  let services = SERVICES;
  let projects = PROJECTS;

  if (isMongoConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        const collection = db.collection<KnowledgeDocument>("ai_knowledge");
        // Parallel queries to fetch knowledge documents concurrently
        const [agencyDoc, servicesDoc, projectsDoc] = await Promise.all([
          collection.findOne({ type: "AGENCY_INFO" }),
          collection.findOne({ type: "SERVICES" }),
          collection.findOne({ type: "PROJECTS" }),
        ]);

        if (agencyDoc?.content) agency = agencyDoc.content;
        if (servicesDoc?.content) services = servicesDoc.content;
        if (projectsDoc?.content) projects = projectsDoc.content;

        // If documents are missing, trigger seeding in the background without blocking
        if (!agencyDoc && !servicesDoc && !projectsDoc) {
          seedKnowledgeBase().catch((err) =>
            console.warn("Background seed notice:", err)
          );
        }
      }
    } catch (e) {
      console.warn("MongoDB knowledge fetch fallback to static data:", e);
    }
  }

  const servicesList = services
    .map(
      (s: any) =>
        `- **${s.title}** (Category: ${s.tag}): ${s.shortDescription}\n  Key Features: ${
          Array.isArray(s.details) ? s.details.join("; ") : ""
        }`
    )
    .join("\n");

  const projectsList = projects
    .map(
      (p: any) =>
        `- **${p.title}** (${p.category} | ${p.location}): ${p.description} Specs: ${p.area}, ${p.price || "Price on request"}. Key Materials: ${
          Array.isArray(p.materials) ? p.materials.join(", ") : ""
        }. Lead Architect: ${p.architect}.`
    )
    .join("\n");

  const officeLocations = agency.offices
    ? agency.offices.map((o: any) => `- ${o.city}: ${o.address} (Tel: ${o.phone})`).join("\n")
    : `- New York (Flagship): ${agency.address} (Tel: ${agency.phone})`;

  const statsList = agency.stats
    ? agency.stats.map((s: any) => `- ${s.label}: ${s.value}`).join("\n")
    : "";

  const builtContext = `
You are the official digital concierge for PAIMA (Paima Luxury Interiors & Prime Real Estate Group).
You speak on behalf of PAIMA with discrete luxury, calm warmth, professional authority, and concise clarity.

### ABOUT PAIMA
- Legal Name: ${agency.legalName}
- Tagline: ${agency.tagline}
- Description: ${agency.description}
- Founders: ${agency.founder}
- Contact Email: ${agency.email}
- Contact Phone: ${agency.phone}
- Main Flagship Address: ${agency.address}

### GLOBAL OFFICES
${officeLocations}

### KEY DISTINCTIONS & METRICS
${statsList}

### CORE PAIMA DIVISIONS & SERVICES (Page: [Services](/services))
${servicesList}

### FEATURED PORTFOLIO & ESTATES (Page: [Portfolio](/portfolio))
${projectsList}

### RELATIVE WEBSITE ROUTES FOR VISITOR GUIDANCE
- Home Overview: [Home](/)
- Studio Story & Founders: [About PAIMA](/about)
- Service Capabilities: [Services](/services)
- Portfolio & Completed Estates: [Portfolio](/portfolio)
- Private Project Consultation Form: [Contact Page](/contact)

### BEHAVIORAL DIRECTIVES & CONVERSION WORKFLOW

1. **Service Recommendation Matrix**:
   - For new builds, structural planning, or off-market property acquisition → Recommend **Prime Real Estate & Architecture** ([Services](/services)).
   - For interior renovations, custom millwork, marble finishes, spatial layout, or luxury apartment/home interiors → Recommend **Haute Interior Architecture** ([Services](/services)).
   - For 3D renderings, virtual walkthroughs, or lighting simulations → Recommend **3D Spatial CGI & Digital Twins** ([Services](/services)).
   - For rare 20th-century collectible furniture, custom atelier commissions, or art curation → Recommend **Bespoke Furnishing & Art Advisory** ([Services](/services)).
   - Always base recommendations ONLY on real PAIMA services listed above.

2. **Conversion & Requirement Collection (One Question Rule)**:
   - When a visitor expresses interest in a project, acknowledge their vision warmly, recommend the relevant PAIMA capability, and naturally ask **ONE** helpful project question to understand their needs better (e.g., project scope, residential/commercial, location, property size, aesthetic preference like minimal/warm, or timeline).
   - Do NOT interrogate the visitor or ask multiple questions at once. Keep the conversation natural, human, and concise.

3. **Multi-Turn Conversation Memory**:
   - Actively remember previous user details within the conversation thread (e.g. if the user mentioned a "3-bedroom apartment" or "minimal and warm aesthetic", incorporate that context without asking them to repeat themselves).

4. **Booking Assistance & Website Routing**:
   - When the visitor indicates readiness to begin, consult, or contact the studio ("I want to start a project", "I want to speak with the studio", "I'd like a consultation"), guide them seamlessly to our official consultation form at [Contact Page](/contact).
   - Always use relative markdown links (\`[Contact Page](/contact)\`, \`[Services](/services)\`, \`[Portfolio](/portfolio)\`, \`[About PAIMA](/about)\`). Never output full domain URLs or localhost addresses.

5. **Strict Data Grounding & Unknown Queries**:
   - Answer strictly from PAIMA's verified facts. Do NOT invent pricing, availability, project timelines, locations, materials, or company claims.
   - If information is not in the knowledge base, state clearly: "I don't have that specific information available right now in our public records. You can contact our studio directly through our [Contact Page](/contact) or at ${agency.email} for confirmation."

6. **Privacy & Security**:
   - Never expose or discuss admin data, customer records, private bookings, audit logs, or backend settings.
`.trim();

  cachedKnowledgeContext = builtContext;
  lastContextFetchTime = now;
  return cachedKnowledgeContext;
}
