import { HashUtils, RateLimiter, RBAC, Sanitizer } from "secure-core-js";
import { collections, getOptionalMongoDb } from "./mongodb";

export const adminLoginLimiter = new RateLimiter(60_000, 8);
export const adminApiLimiter = new RateLimiter(60_000, 120);

export const cmsRbac = new RBAC();
cmsRbac.createRole(
  "owner",
  ["cms:read", "cms:write", "leads:read", "leads:write", "projects:read", "projects:write", "analytics:read"],
  "Full CMS and solar SaaS control",
);
cmsRbac.createUser("admin");
cmsRbac.assignRoleToUser("admin", "owner");

export function sanitizeRecord<T extends Record<string, unknown>>(value: T): T {
  return Sanitizer.sanitizeObject(value) as T;
}

export function sanitizeText(value: string) {
  return Sanitizer.sanitizeInput(value);
}

export function signValue(value: string) {
  return HashUtils.hmacSHA256(value, getSessionSecret());
}

export function verifySignedValue(value: string, signature: string) {
  return signValue(value) === signature;
}

export function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? process.env.JWT_SECRET ?? process.env.NEXTAUTH_SECRET ?? "dev-only-change-admin-session-secret";
}

export function getClientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}

export function assertRateLimit(request: Request, limiter: RateLimiter) {
  const ip = getClientIp(request);
  if (!limiter.isAllowed(ip)) {
    return Response.json({ ok: false, message: "Too many requests. Please try again shortly." }, { status: 429 });
  }
  return null;
}

export async function audit(action: string, actor: string, metadata: Record<string, unknown> = {}) {
  const event = {
    action: sanitizeText(action),
    actor: sanitizeText(actor),
    metadata: sanitizeRecord(metadata),
    createdAt: new Date(),
  };

  const db = await getOptionalMongoDb();
  if (!db) {
    return event;
  }

  await db.collection(collections.audit).insertOne(event);
  return event;
}
