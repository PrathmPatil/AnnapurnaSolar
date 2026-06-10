import { requireAdmin } from "@/lib/admin-auth";
import { collections, getOptionalMongoDb } from "@/lib/mongodb";
import { competitorInsights, dashboardSeed, saasModules } from "@/lib/solar-saas-data";
import { adminApiLimiter, assertRateLimit } from "@/lib/secure";

export async function GET(request: Request) {
  const limited = assertRateLimit(request, adminApiLimiter);
  if (limited) return limited;

  const { response } = await requireAdmin();
  if (response) return response;

  const db = await getOptionalMongoDb();
  if (!db) {
    return Response.json({
      ok: true,
      source: "seed",
      ...dashboardSeed,
      modules: saasModules,
      competitorInsights,
    });
  }

  const [leadCount, projectCount, leads, projects] = await Promise.all([
    db.collection(collections.leads).countDocuments(),
    db.collection(collections.projects).countDocuments(),
    db.collection(collections.leads).find({}).sort({ createdAt: -1 }).limit(8).toArray(),
    db.collection(collections.projects).find({}).sort({ updatedAt: -1 }).limit(8).toArray(),
  ]);

  return Response.json({
    ok: true,
    source: "mongodb",
    metrics: [
      { label: "Pipeline Value", value: "Live", delta: "MongoDB" },
      { label: "Active Leads", value: String(leadCount), delta: "total" },
      { label: "Projects", value: String(projectCount), delta: "active" },
      { label: "Modules", value: String(saasModules.length), delta: "enabled" },
    ],
    pipeline: dashboardSeed.pipeline,
    leads,
    projects,
    modules: saasModules,
    competitorInsights,
  });
}
