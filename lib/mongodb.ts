import { MongoClient, Db } from "mongodb";

const DEFAULT_MONGODB_URI = "mongodb://127.0.0.1:27017/paima_atelier";

const options = {};


let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getMongoUri(): string {
  return process.env.MONGODB_URI || DEFAULT_MONGODB_URI;
}


export function isMongoConfigured(): boolean {
  const uri = getMongoUri();
  return Boolean(uri && uri.trim().length > 0);
}

export async function getMongoClient(): Promise<MongoClient | null> {
  const uri = getMongoUri();
  if (!uri) return null;

  try {
    if (process.env.NODE_ENV === "development") {
      if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect().catch((err) => {
          console.error("MongoDB connection failed:", err.message);
          global._mongoClientPromise = undefined;
          throw err;
        });
      }
      return await global._mongoClientPromise;
    } else {
      if (!clientPromise) {
        client = new MongoClient(uri, options);
        clientPromise = client.connect().catch((err) => {
          console.error("MongoDB connection failed:", err.message);
          clientPromise = null;
          throw err;
        });
      }
      return await clientPromise;
    }
  } catch (error) {
    console.error("Failed to acquire MongoDB client:", error);
    return null;
  }
}

export async function getMongoDb(dbName?: string): Promise<Db | null> {
  const clientInstance = await getMongoClient();
  if (!clientInstance) return null;
  const targetDb = dbName || process.env.MONGODB_DB;
  return targetDb ? clientInstance.db(targetDb) : clientInstance.db();
}

