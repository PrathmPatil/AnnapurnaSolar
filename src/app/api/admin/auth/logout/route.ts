import { clearAdminSession, getAdminSession } from "@/lib/admin-auth";
import { audit } from "@/lib/secure";

export async function POST() {
  const session = await getAdminSession();
  await clearAdminSession();
  if (session) {
    await audit("admin.logout", session.email);
  }
  return Response.json({ ok: true });
}
