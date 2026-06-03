import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI ?? process.env.MONGO_URI;
const dbName = process.env.MONGODB_DB ?? process.env.MONGO_DB ?? "annpurnasolars";

let clientPromise: Promise<MongoClient> | null = null;

export function hasMongoConfig() {
  return Boolean(uri);
}

export async function getMongoDb(): Promise<Db> {
  if (!uri) {
    throw new Error("MONGODB_URI or MONGO_URI is not configured.");
  }

  if (!clientPromise) {
    const client = new MongoClient(uri);
    clientPromise = client.connect();
  }

  return (await clientPromise).db(dbName);
}

export const collections = {
  admins: "admins",
  leads: "leads",
  projects: "projects",
  content: "content",
  audit: "audit",
} as const;
