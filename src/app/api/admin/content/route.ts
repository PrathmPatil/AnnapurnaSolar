import { contentSettingsSchema } from "@/lib/cms-schemas";
import { requireAdmin } from "@/lib/admin-auth";
import { collections, getMongoDb, hasMongoConfig } from "@/lib/mongodb";
import { dashboardSeed } from "@/lib/solar-saas-data";
import { adminApiLimiter, assertRateLimit, audit, sanitizeRecord } from "@/lib/secure";

const settingsKey = "site-settings";

export async function GET(request: Request) {
  const limited = assertRateLimit(request, adminApiLimiter);
  if (limited) return limited;
  const { response } = await requireAdmin();
  if (response) return response;

  if (!hasMongoConfig()) {
    return Response.json({ ok: true, source: "seed", settings: dashboardSeed.content });
  }

  const db = await getMongoDb();
  const settings = await db.collection(collections.content).findOne({ key: settingsKey });

  return Response.json({
    ok: true,
    source: "mongodb",
    settings: settings?.value ?? dashboardSeed.content,
  });
}

export async function PATCH(request: Request) {
  const limited = assertRateLimit(request, adminApiLimiter);
  if (limited) return limited;
  const { session, response } = await requireAdmin();
  if (response) return response;

  const body = await request.json().catch(() => null);
  const parsed = contentSettingsSchema.safeParse(sanitizeRecord(body ?? {}));

  if (!parsed.success) {
    return Response.json({ ok: false, message: "Invalid content settings.", errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  if (!hasMongoConfig()) {
    return Response.json({ ok: false, message: "MongoDB is required to save CMS settings." }, { status: 503 });
  }

  const db = await getMongoDb();
  await db.collection(collections.content).updateOne(
    { key: settingsKey },
    {
      $set: {
        key: settingsKey,
        value: parsed.data,
        updatedAt: new Date(),
        updatedBy: session?.email,
      },
    },
    { upsert: true },
  );
  await audit("content.settings.updated", session?.email ?? "admin");

  return Response.json({ ok: true, settings: parsed.data });
}
