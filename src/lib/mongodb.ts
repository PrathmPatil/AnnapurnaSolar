import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI ?? process.env.MONGO_URI;
const dbName = process.env.MONGODB_DB ?? process.env.MONGO_DB ?? "annpurnasolars";
const connectionTimeoutMs = Number(process.env.MONGO_CONNECTION_TIMEOUT_MS ?? "1500");
const fallbackRetryMs = Number(process.env.MONGO_FALLBACK_RETRY_MS ?? "30000");

let clientPromise: Promise<MongoClient> | null = null;
let warnedAboutFallback = false;
let retryAfter = 0;

export function hasMongoConfig() {
  return Boolean(uri);
}

export async function getMongoDb(): Promise<Db> {
  if (!uri) {
    throw new Error("MONGODB_URI or MONGO_URI is not configured.");
  }

  if (!clientPromise) {
    const timeout = Number.isFinite(connectionTimeoutMs) && connectionTimeoutMs > 0 ? connectionTimeoutMs : 1500;
    const client = new MongoClient(uri, {
      connectTimeoutMS: timeout,
      serverSelectionTimeoutMS: timeout,
    });
    clientPromise = client.connect().catch((error) => {
      clientPromise = null;
      throw error;
    });
  }

  return (await clientPromise).db(dbName);
}

export async function getOptionalMongoDb(): Promise<Db | null> {
  if (!hasMongoConfig()) {
    return null;
  }

  if (Date.now() < retryAfter) {
    return null;
  }

  try {
    return await getMongoDb();
  } catch (error) {
    const cooldown = Number.isFinite(fallbackRetryMs) && fallbackRetryMs > 0 ? fallbackRetryMs : 30000;
    retryAfter = Date.now() + cooldown;
    if (!warnedAboutFallback) {
      const message = error instanceof Error ? error.message : "Unknown MongoDB connection error";
      console.warn(`MongoDB unavailable, using demo data fallback: ${message}`);
      warnedAboutFallback = true;
    }
    return null;
  }
}

export const collections = {
  admins: "admins",
  leads: "leads",
  projects: "projects",
  content: "content",
  audit: "audit",
} as const;
