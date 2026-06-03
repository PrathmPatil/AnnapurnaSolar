import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().trim().email().max(160),
  password: z.string().min(8).max(200),
});

export const leadStageSchema = z.enum([
  "new",
  "qualified",
  "survey",
  "proposal",
  "won",
  "project",
  "lost",
]);

export const cmsLeadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().regex(/^\d{10}$/),
  email: z.string().trim().email().optional().or(z.literal("")),
  pincode: z.string().trim().regex(/^\d{6}$/),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  type: z.enum(["home", "commercial", "society"]).default("home"),
  monthlyBill: z.string().trim().min(1).max(80),
  source: z.string().trim().max(80).default("website"),
  stage: leadStageSchema.default("new"),
  notes: z.string().trim().max(1200).optional().or(z.literal("")),
});

export const projectStatusSchema = z.enum([
  "survey",
  "design",
  "proposal",
  "permit",
  "install",
  "inspection",
  "pto",
  "monitoring",
]);

export const projectSchema = z.object({
  customerName: z.string().trim().min(2).max(120),
  systemSizeKw: z.coerce.number().positive().max(5000),
  city: z.string().trim().min(2).max(80),
  status: projectStatusSchema.default("survey"),
  value: z.coerce.number().nonnegative().max(100000000).default(0),
  nextAction: z.string().trim().min(2).max(200),
  assignedTo: z.string().trim().min(2).max(100).default("Operations"),
});

export const contentSettingsSchema = z.object({
  heroTitle: z.string().trim().min(8).max(140),
  heroSubtitle: z.string().trim().min(20).max(400),
  primaryCta: z.string().trim().min(2).max(40),
  phone: z.string().trim().min(8).max(30),
  email: z.string().trim().email(),
  address: z.string().trim().min(10).max(280),
});

export const pageContentSchema = z.object({
  slug: z.string().trim().min(2).max(120),
  values: z.record(z.string().trim().min(1).max(120), z.string().trim().max(4000)),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type CmsLeadInput = z.infer<typeof cmsLeadSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type ContentSettingsInput = z.infer<typeof contentSettingsSchema>;
export type PageContentInput = z.infer<typeof pageContentSchema>;
