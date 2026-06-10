import { ObjectId } from "mongodb";
import { cmsLeadSchema, leadStageSchema } from "@/lib/cms-schemas";
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
    return Response.json({ ok: true, source: "seed", leads: dashboardSeed.leads });
  }

  const leads = await db.collection(collections.leads).find({}).sort({ createdAt: -1 }).limit(100).toArray();
  return Response.json({ ok: true, source: "mongodb", leads });
}

export async function POST(request: Request) {
  const limited = assertRateLimit(request, adminApiLimiter);
  if (limited) return limited;
  const { session, response } = await requireAdmin();
  if (response) return response;

  const body = await request.json().catch(() => null);
  const parsed = cmsLeadSchema.safeParse(sanitizeRecord(body ?? {}));

  if (!parsed.success) {
    return Response.json({ ok: false, message: "Invalid lead data.", errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const db = await getOptionalMongoDb();
  if (!db) {
    return Response.json({ ok: false, message: "MongoDB is required to create CMS leads." }, { status: 503 });
  }

  const doc = {
    ...parsed.data,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: session?.email,
  };
  const result = await db.collection(collections.leads).insertOne(doc);
  await audit("lead.created", session?.email ?? "admin", { leadId: String(result.insertedId) });

  return Response.json({ ok: true, lead: { _id: result.insertedId, ...doc } });
}

export async function PATCH(request: Request) {
  const limited = assertRateLimit(request, adminApiLimiter);
  if (limited) return limited;
  const { session, response } = await requireAdmin();
  if (response) return response;

  const body = sanitizeRecord((await request.json().catch(() => null)) ?? {});
  const id = String(body.id ?? "");
  const stage = leadStageSchema.safeParse(body.stage);

  if (!ObjectId.isValid(id) || !stage.success) {
    return Response.json({ ok: false, message: "Valid lead id and stage are required." }, { status: 400 });
  }

  const db = await getOptionalMongoDb();
  if (!db) {
    return Response.json({ ok: false, message: "MongoDB is required to update CMS leads." }, { status: 503 });
  }

  await db.collection(collections.leads).updateOne(
    { _id: new ObjectId(id) },
    { $set: { stage: stage.data, updatedAt: new Date(), updatedBy: session?.email } },
  );
  await audit("lead.stage.updated", session?.email ?? "admin", { leadId: id, stage: stage.data });

  return Response.json({ ok: true });
}
