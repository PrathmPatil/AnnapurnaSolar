import { pageContentSchema } from "@/lib/cms-schemas";
import { requireAdmin } from "@/lib/admin-auth";
import { collections, getOptionalMongoDb } from "@/lib/mongodb";
import { cmsPages, getCmsPageDefinition, getPageContentState, pageKey } from "@/lib/page-content";
import { adminApiLimiter, assertRateLimit, audit, sanitizeRecord } from "@/lib/secure";

export async function GET(request: Request) {
  const limited = assertRateLimit(request, adminApiLimiter);
  if (limited) return limited;
  const { response } = await requireAdmin();
  if (response) return response;

  const url = new URL(request.url);
  const slug = url.searchParams.get("slug") ?? cmsPages[0].slug;
  const state = await getPageContentState(slug);

  if (!state) {
    return Response.json({ ok: false, message: "Unknown CMS page." }, { status: 404 });
  }

  return Response.json({
    ok: true,
    pages: cmsPages.map(({ slug: pageSlug, title, route }) => ({ slug: pageSlug, title, route })),
    ...state,
  });
}

export async function PATCH(request: Request) {
  const limited = assertRateLimit(request, adminApiLimiter);
  if (limited) return limited;
  const { session, response } = await requireAdmin();
  if (response) return response;

  const body = await request.json().catch(() => null);
  const parsed = pageContentSchema.safeParse(sanitizeRecord(body ?? {}));

  if (!parsed.success) {
    return Response.json({ ok: false, message: "Invalid page content.", errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const page = getCmsPageDefinition(parsed.data.slug);
  if (!page) {
    return Response.json({ ok: false, message: "Unknown CMS page." }, { status: 404 });
  }

  const allowedKeys = new Set(page.fields.map((field) => field.key));
  const values = Object.fromEntries(Object.entries(parsed.data.values).filter(([key]) => allowedKeys.has(key)));
  const before = await getPageContentState(parsed.data.slug);

  const db = await getOptionalMongoDb();
  if (!db) {
    return Response.json({
      ok: false,
      message: "MongoDB is required to save CMS page content. Current values are preview-only defaults.",
      previous: before?.previous,
      current: before?.current,
    }, { status: 503 });
  }

  await db.collection(collections.content).updateOne(
    { key: pageKey(parsed.data.slug) },
    {
      $set: {
        key: pageKey(parsed.data.slug),
        slug: parsed.data.slug,
        value: values,
        previousValue: before?.current ?? {},
        updatedAt: new Date(),
        updatedBy: session?.email,
      },
    },
    { upsert: true },
  );

  await audit("cms.page.updated", session?.email ?? "admin", { slug: parsed.data.slug });
  const after = await getPageContentState(parsed.data.slug);

  return Response.json({ ok: true, ...after });
}
