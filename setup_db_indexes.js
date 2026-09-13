import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/paima_atelier";

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    console.log("Connected to MongoDB...");

    // Bookings Indexes
    await db.collection("bookings").createIndex({ createdAt: -1 });
    await db.collection("bookings").createIndex({ status: 1 });
    await db.collection("bookings").createIndex({ email: 1 });
    console.log("Created Bookings indexes.");

    // Messages Indexes
    await db.collection("messages").createIndex({ createdAt: -1 });
    await db.collection("messages").createIndex({ status: 1 });
    console.log("Created Messages indexes.");

    // Activity Indexes
    await db.collection("admin_activities").createIndex({ timestamp: -1 });
    console.log("Created Activity indexes.");

    console.log("Database indexing complete!");
  } catch (error) {
    console.error("Error creating indexes:", error);
  } finally {
    await client.close();
  }
}

run();
