import { adminLoginSchema } from "@/lib/cms-schemas";
import { setAdminSession, verifyAdminCredentials } from "@/lib/admin-auth";
import { adminLoginLimiter, assertRateLimit, audit, sanitizeRecord } from "@/lib/secure";

export async function POST(request: Request) {
  const limited = assertRateLimit(request, adminLoginLimiter);
  if (limited) return limited;

  const body = await request.json().catch(() => null);
  const parsed = adminLoginSchema.safeParse(sanitizeRecord(body ?? {}));

  if (!parsed.success) {
    return Response.json({ ok: false, message: "Enter a valid admin email and password." }, { status: 400 });
  }

  const admin = await verifyAdminCredentials(parsed.data.email, parsed.data.password);

  if (!admin) {
    await audit("admin.login.failed", parsed.data.email);
    return Response.json({ ok: false, message: "Invalid credentials." }, { status: 401 });
  }

  await setAdminSession(admin);
  await audit("admin.login.success", admin.email);

  return Response.json({
    ok: true,
    admin: {
      email: admin.email,
      role: admin.role,
    },
  });
}
