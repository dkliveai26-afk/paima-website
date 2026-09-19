import { MongoClient, Db } from "mongodb";

const DEFAULT_MONGODB_URI = "mongodb://127.0.0.1:27017/paima_atelier";

const options = {
  serverSelectionTimeoutMS: 1500,
  connectTimeoutMS: 1500,
};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;
let lastConnectionFailure = 0;
const FAILURE_COOLDOWN_MS = 30000; // 30 seconds cooldown before retrying unreachable DB

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  // eslint-disable-next-line no-var
  var _mongoLastFailure: number | undefined;
}

function getMongoUri(): string | null {
  if (process.env.MONGODB_URI && process.env.MONGODB_URI.trim().length > 0) {
    return process.env.MONGODB_URI.trim();
  }
  if (process.env.NODE_ENV === "development") {
    return DEFAULT_MONGODB_URI;
  }
  return null;
}

export function isMongoConfigured(): boolean {
  const lastFail = global._mongoLastFailure || lastConnectionFailure;
  if (Date.now() - lastFail < FAILURE_COOLDOWN_MS) {
    return false; // Skip slow connection attempts during cooldown
  }
  return Boolean(process.env.MONGODB_URI && process.env.MONGODB_URI.trim().length > 0);
}

export async function getMongoClient(): Promise<MongoClient | null> {
  const uri = getMongoUri();
  if (!uri) return null;

  const lastFail = global._mongoLastFailure || lastConnectionFailure;
  if (Date.now() - lastFail < FAILURE_COOLDOWN_MS) {
    return null; // Return null immediately so fast fallback store is used
  }

  try {
    if (process.env.NODE_ENV === "development") {
      if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect().catch((err) => {
          console.warn("MongoDB connection unavailable (using fast fallback):", err.message);
          global._mongoClientPromise = undefined;
          global._mongoLastFailure = Date.now();
          lastConnectionFailure = Date.now();
          throw err;
        });
      }
      return await global._mongoClientPromise;
    } else {
      if (!clientPromise) {
        client = new MongoClient(uri, options);
        clientPromise = client.connect().catch((err) => {
          console.warn("MongoDB connection unavailable (using fast fallback):", err.message);
          clientPromise = null;
          lastConnectionFailure = Date.now();
          global._mongoLastFailure = Date.now();
          throw err;
        });
      }
      return await clientPromise;
    }
  } catch (error) {
    lastConnectionFailure = Date.now();
    global._mongoLastFailure = Date.now();
    return null;
  }
}

export async function getMongoDb(dbName?: string): Promise<Db | null> {
  const clientInstance = await getMongoClient();
  if (!clientInstance) return null;
  const targetDb = dbName || process.env.MONGODB_DB;
  return targetDb ? clientInstance.db(targetDb) : clientInstance.db();
}

