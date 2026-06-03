import { collections, getMongoDb, hasMongoConfig } from "@/lib/mongodb";
import { audit, sanitizeRecord } from "@/lib/secure";
import { validateLead } from "@/lib/validation";

export async function POST(request: Request) {
  const body = sanitizeRecord((await request.json().catch(() => null)) ?? {});

  if (!Object.keys(body).length) {
    return Response.json({ ok: false, message: "Invalid JSON payload." }, { status: 400 });
  }

  const validation = validateLead(body);

  if (!validation.ok) {
    return Response.json(
      {
        ok: false,
        message: "Please check the highlighted details and try again.",
        errors: validation.errors,
      },
      { status: 400 },
    );
  }

  let leadId = `lead_${Date.now().toString(36)}`;

  if (hasMongoConfig()) {
    const db = await getMongoDb();
    const result = await db.collection(collections.leads).insertOne({
      ...body,
      source: body.source ?? "website",
      stage: "new",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    leadId = String(result.insertedId);
    await audit("public.lead.created", String(body.name ?? "website"), { leadId });
  }

  return Response.json({
    ok: true,
    leadId,
    message: "Details submitted successfully. Our team will contact you shortly.",
  });
}
