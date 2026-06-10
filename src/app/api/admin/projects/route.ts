import { ObjectId } from "mongodb";
import { projectSchema, projectStatusSchema } from "@/lib/cms-schemas";
import { requireAdmin } from "@/lib/admin-auth";
import { collections, getOptionalMongoDb } from "@/lib/mongodb";
import { dashboardSeed } from "@/lib/solar-saas-data";
import { adminApiLimiter, assertRateLimit, audit, sanitizeRecord } from "@/lib/secure";

export async function GET(request: Request) {
  const limited = assertRateLimit(request, adminApiLimiter);
  if (limited) return limited;
  const { response } = await requireAdmin();
  if (response) return response;

  const db = await getOptionalMongoDb();
  if (!db) {
    return Response.json({ ok: true, source: "seed", projects: dashboardSeed.projects });
  }

  const projects = await db.collection(collections.projects).find({}).sort({ updatedAt: -1 }).limit(100).toArray();
  return Response.json({ ok: true, source: "mongodb", projects });
}

export async function POST(request: Request) {
  const limited = assertRateLimit(request, adminApiLimiter);
  if (limited) return limited;
  const { session, response } = await requireAdmin();
  if (response) return response;

  const body = await request.json().catch(() => null);
  const parsed = projectSchema.safeParse(sanitizeRecord(body ?? {}));

  if (!parsed.success) {
    return Response.json({ ok: false, message: "Invalid project data.", errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const db = await getOptionalMongoDb();
  if (!db) {
    return Response.json({ ok: false, message: "MongoDB is required to create projects." }, { status: 503 });
  }

  const doc = {
    ...parsed.data,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: session?.email,
  };
  const result = await db.collection(collections.projects).insertOne(doc);
  await audit("project.created", session?.email ?? "admin", { projectId: String(result.insertedId) });

  return Response.json({ ok: true, project: { _id: result.insertedId, ...doc } });
}

export async function PATCH(request: Request) {
  const limited = assertRateLimit(request, adminApiLimiter);
  if (limited) return limited;
  const { session, response } = await requireAdmin();
  if (response) return response;

  const body = sanitizeRecord((await request.json().catch(() => null)) ?? {});
  const id = String(body.id ?? "");
  const status = projectStatusSchema.safeParse(body.status);

  if (!ObjectId.isValid(id) || !status.success) {
    return Response.json({ ok: false, message: "Valid project id and status are required." }, { status: 400 });
  }

  const db = await getOptionalMongoDb();
  if (!db) {
    return Response.json({ ok: false, message: "MongoDB is required to update projects." }, { status: 503 });
  }

  await db.collection(collections.projects).updateOne(
    { _id: new ObjectId(id) },
    { $set: { status: status.data, updatedAt: new Date(), updatedBy: session?.email } },
  );
  await audit("project.status.updated", session?.email ?? "admin", { projectId: id, status: status.data });

  return Response.json({ ok: true });
}
