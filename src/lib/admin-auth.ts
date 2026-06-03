import { cookies } from "next/headers";
import { HashUtils } from "secure-core-js";
import { collections, getMongoDb, hasMongoConfig } from "./mongodb";
import { cmsRbac, signValue, verifySignedValue } from "./secure";

export type AdminSession = {
  id: string;
  email: string;
  role: "owner";
  exp: number;
};

const cookieName = "ae_cms_session";
const sessionTtlMs = 1000 * 60 * 60 * 8;

export async function verifyAdminCredentials(email: string, password: string) {
  const normalizedEmail = email.toLowerCase();

  if (hasMongoConfig()) {
    const db = await getMongoDb();
    const admin = await db.collection(collections.admins).findOne<{ _id: unknown; email: string; passwordHash: string; role?: "owner" }>({
      email: normalizedEmail,
    });

    if (admin && HashUtils.verifyPassword(password, admin.passwordHash)) {
      return {
        id: String(admin._id),
        email: admin.email,
        role: admin.role ?? "owner",
      };
    }
  }

  const fallbackEmail = (process.env.ADMIN_EMAIL ?? process.env.MASTER_USER_EMAIL ?? "admin@annapurna.local").toLowerCase();
  const fallbackPassword = process.env.ADMIN_PASSWORD ?? process.env.MASTER_USER_PASSWORD ?? "ChangeMe#2026";
  const fallbackHash = process.env.ADMIN_PASSWORD_HASH ?? HashUtils.hashPassword(fallbackPassword);

  if (normalizedEmail === fallbackEmail && HashUtils.verifyPassword(password, fallbackHash)) {
    return {
      id: "admin",
      email: fallbackEmail,
      role: "owner" as const,
    };
  }

  return null;
}

export function createSessionCookie(session: Omit<AdminSession, "exp">) {
  const payload: AdminSession = {
    ...session,
    exp: Date.now() + sessionTtlMs,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${signValue(encoded)}`;
}

export async function setAdminSession(session: Omit<AdminSession, "exp">) {
  const cookieStore = await cookies();
  cookieStore.set(cookieName, createSessionCookie(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: sessionTtlMs / 1000,
    path: "/",
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(cookieName)?.value;

  if (!raw) return null;

  const [encoded, signature] = raw.split(".");
  if (!encoded || !signature || !verifySignedValue(encoded, signature)) {
    return null;
  }

  try {
    const session = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as AdminSession;
    if (!session.exp || session.exp < Date.now()) return null;
    if (!cmsRbac.hasPermission("admin", "cms:read")) return null;
    return session;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    return {
      session: null,
      response: Response.json({ ok: false, message: "Unauthorized" }, { status: 401 }),
    };
  }
  return { session, response: null };
}
