import { collections, getOptionalMongoDb } from "./mongodb";
import { blogPosts, company } from "./site-data";

export type CmsFieldType = "text" | "textarea";

export type CmsField = {
  key: string;
  label: string;
  type: CmsFieldType;
  defaultValue: string;
};

export type CmsPageDefinition = {
  slug: string;
  title: string;
  route: string;
  fields: CmsField[];
};

const common = {
  phone: company.phone,
  address: company.address,
  business: company.name,
};

export const cmsPages = [
  {
    slug: "home",
    title: "Home",
    route: "/",
    fields: [
      field("eyebrow", "Hero eyebrow", `${company.location} Solar Energy Company`),
      field("heroTitle", "Hero title", `${company.name} brings solar home.`),
      area(
        "heroSubtitle",
        "Hero subtitle",
        `${company.description} Get practical rooftop solar guidance, site visits and installation support from a local Sangli team.`,
      ),
      field("primaryCta", "Primary CTA", "Schedule a FREE Visit"),
      field("secondaryCta", "Secondary CTA", "Calculate savings"),
      field("offersTitle", "Offers section title", "Homes, Societies and Businesses"),
      field("trustTitle", "Trust section title", "We Handle Everything. You Just Save."),
      field("darkTitle", "Dark feature title", "Local solar work, clear guidance"),
      area(
        "darkSubtitle",
        "Dark feature subtitle",
        `${common.business} handles solar installation and related electrical work from Sambhaji Nagar, Sangalwadi, Sangli.`,
      ),
      field("serviceTitle", "Service section title", "Solar support around Sangli"),
      field("processTitle", "Process section title", "A complete solar journey in four clear steps"),
      field("monitoringTitle", "Monitoring section title", "Track the performance of your solar system anywhere"),
      field("faqTitle", "FAQ section title", "Frequently Asked Questions"),
      field("blogTitle", "Blog section title", "Learn more about rooftop solar"),
    ],
  },
  {
    slug: "commercial",
    title: "Commercial",
    route: "/commercial/",
    fields: [
      field("eyebrow", "Hero eyebrow", "Rooftop Solar for Commercial Enterprise"),
      field("heroTitle", "Hero title", `Sangli businesses choose ${common.business}.`),
      area(
        "heroSubtitle",
        "Hero subtitle",
        "Turn unused commercial rooftops into high-performing energy assets and reduce electricity bills by more than 70%.",
      ),
      area(
        "quote",
        "Hero quote",
        "The solar installation process was handled professionally, with practical guidance from survey to execution.",
      ),
      field("formTitle", "Form title", "Submit a solar project enquiry for your enterprise."),
      field("benefitsTitle", "Benefits title", "Hassle-free, professional and friendly solar execution"),
      area(
        "benefitsIntro",
        "Benefits intro",
        "We create high-quality commercial solar systems with precise design, strong safety practices and clear financial outcomes.",
      ),
      field("impactTitle", "Impact title", "Exceptional quality. End-to-end service. Delighted customers."),
      field("systemsTitle", "Systems section title", "Commercial rooftop systems in India"),
      field("faqTitle", "FAQ section title", "Commercial solar questions"),
      field("blogTitle", "Blog section title", "Commercial solar resources"),
    ],
  },
  {
    slug: "housing-society",
    title: "Housing Society",
    route: "/housing-society/",
    fields: [
      field("eyebrow", "Hero eyebrow", "Reliable Rooftop Solar for Housing Societies"),
      field("heroTitle", "Hero title", "Slash Your Society's Electricity Bills by up to 90%."),
      area(
        "heroSubtitle",
        "Hero subtitle",
        "Guaranteed solar savings, professionally managed from design and AGM support to installation and maintenance.",
      ),
      field("formTitle", "Form title", "Book a free visit for your housing society."),
      field("whyTitle", "Why choose title", `Why choose ${common.business} for your society`),
      field("scaleTitle", "Scale title", "We serve societies across India's major cities"),
      field("projectsTitle", "Projects title", "Big savings for large residential communities"),
      field("journeyTitle", "Journey title", "Godrej Infinity Housing Society"),
      area(
        "journeySubtitle",
        "Journey subtitle",
        "A 400 kW solar system installed across common areas, designed to deliver significant savings and a fast break-even period.",
      ),
      field("safetyTitle", "Safety title", "Your safety is our obsession"),
      field("faqTitle", "FAQ title", "Housing society solar questions"),
    ],
  },
  {
    slug: "solar-calculator",
    title: "Solar Calculator",
    route: "/solar-calculator/",
    fields: [
      field("eyebrow", "Hero eyebrow", "Solar Panel Savings Calculator"),
      field("heroTitle", "Hero title", "Calculate Your Solar Savings Now."),
      area(
        "heroSubtitle",
        "Hero subtitle",
        "Unlock savings, build that dream fund and start your clean-energy checklist with a fast rooftop estimate.",
      ),
      field("journeyTitle", "Journey title", "Take control of your electricity bill"),
      field("howTitle", "How it works title", "A rooftop calculator designed for Indian power consumers"),
      area(
        "howIntro",
        "How it works intro",
        "The calculator considers monthly bill, pincode serviceability, system generation, electricity tariffs, subsidy slabs, degradation and tariff inflation to create an indicative savings report.",
      ),
    ],
  },
  {
    slug: "blog",
    title: "Blog",
    route: "/blog/",
    fields: [
      field("eyebrow", "Hero eyebrow", "Solar guides"),
      field("heroTitle", "Hero title", "Solar Panel Related Blogs & Information"),
      field("allBlogsTitle", "All blogs title", "All blogs"),
      field("categoryTitle", "Category title", "Browse by Category"),
    ],
  },
  {
    slug: "saas",
    title: "SaaS",
    route: "/saas/",
    fields: [
      field("eyebrow", "Hero eyebrow", "Powered by SwamiInfotech"),
      field("heroTitle", "Hero title", "A richer solar business operating system."),
      area(
        "heroSubtitle",
        "Hero subtitle",
        "Built for local solar installers who need more than a website: CRM, CMS, proposals, project stages, dispatch, documents, monitoring tickets, and customer transparency in one secure platform.",
      ),
      field("modulesTitle", "Modules title", "Solar business modules"),
      field("researchTitle", "Research title", "What this platform borrows and improves"),
    ],
  },
  ...blogPageDefinitions(),
  ...secondaryPageDefinitions(),
] satisfies CmsPageDefinition[];

export type CmsPageSlug = (typeof cmsPages)[number]["slug"];

export function getCmsPageDefinition(slug: string) {
  return cmsPages.find((page) => page.slug === slug);
}

export function getDefaultContent(slug: string) {
  const page = getCmsPageDefinition(slug);
  return Object.fromEntries((page?.fields ?? []).map((item) => [item.key, item.defaultValue]));
}

export async function getPageContent(slug: string): Promise<Record<string, string>> {
  const defaults = getDefaultContent(slug);
  const db = await getOptionalMongoDb();

  if (!db) {
    return defaults;
  }

  const saved = await db.collection(collections.content).findOne<{ value?: Record<string, string> }>({ key: pageKey(slug) });
  return {
    ...defaults,
    ...(saved?.value ?? {}),
  };
}

export async function getPageContentState(slug: string) {
  const page = getCmsPageDefinition(slug);
  if (!page) return null;

  const defaults = getDefaultContent(slug);
  let current = defaults;
  let previous = defaults;
  let updatedAt: Date | null = null;
  let source = "defaults";

  const db = await getOptionalMongoDb();
  if (db) {
    const saved = await db
      .collection(collections.content)
      .findOne<{ value?: Record<string, string>; previousValue?: Record<string, string>; updatedAt?: Date }>({ key: pageKey(slug) });
    if (saved) {
      current = { ...defaults, ...(saved.value ?? {}) };
      previous = { ...defaults, ...(saved.previousValue ?? saved.value ?? {}) };
      updatedAt = saved.updatedAt ?? null;
      source = "mongodb";
    }
  }

  return { page, defaults, previous, current, updatedAt, source };
}

export function pageKey(slug: string) {
  return `page:${slug}`;
}

function field(key: string, label: string, defaultValue: string): CmsField {
  return { key, label, defaultValue, type: "text" };
}

function area(key: string, label: string, defaultValue: string): CmsField {
  return { key, label, defaultValue, type: "textarea" };
}

function secondaryPageDefinitions(): CmsPageDefinition[] {
  const pages = [
    ["about-us", "About Us", "/about-us/", "We make rooftop solar with integrity"],
    ["on-grid-solar", "On-Grid Solar", "/on-grid-solar/", "On-Grid Solar Systems"],
    ["off-grid-solar", "Off-Grid Solar", "/off-grid-solar/", "Off-Grid Solar Systems"],
    ["careers", "Careers", "/careers/", "Careers at Annapurna Equipments"],
    ["privacy-policy", "Privacy Policy", "/privacy-policy/", "Privacy Policy"],
    ["terms-of-service", "Terms of Service", "/terms-of-service/", "Terms of Service"],
    ["solar-in-sangli", "Solar in Sangli", "/solar-in-sangli/", "Solar in Sangli"],
    ["solar-in-sangalwadi", "Solar in Sangalwadi", "/solar-in-sangalwadi/", "Solar in Sangalwadi"],
    ["solar-in-sambhaji-nagar", "Solar in Sambhaji Nagar", "/solar-in-sambhaji-nagar/", "Solar in Sambhaji Nagar"],
    ["solar-in-miraj", "Solar in Miraj", "/solar-in-miraj/", "Solar in Miraj"],
    ["solar-in-kolhapur", "Solar in Kolhapur", "/solar-in-kolhapur/", "Solar in Kolhapur"],
    ["solar-in-satara", "Solar in Satara", "/solar-in-satara/", "Solar in Satara"],
  ];

  return pages.map(([slug, title, route, pageTitle]) => ({
    slug,
    title,
    route,
    fields: [
      field("eyebrow", "Eyebrow", common.business),
      field("heroTitle", "Hero title", pageTitle),
      area("heroSubtitle", "Hero subtitle", `Solar installation, consultation and electrical support by ${common.business}.`),
      field("primaryCta", "Primary CTA", "Calculate Savings"),
      field("secondaryCta", "Secondary CTA", "Back to Home"),
    ],
  }));
}

function blogPageDefinitions(): CmsPageDefinition[] {
  return blogPosts.map((post) => ({
    slug: `blog-${post.slug}`,
    title: `Blog: ${post.title}`,
    route: `/blog/${post.slug}/`,
    fields: [
      field("category", "Category", post.category),
      field("heroTitle", "Article title", post.title),
      area("excerpt", "Excerpt", post.excerpt),
      area("body", "Body paragraphs", post.body.join("\n\n")),
      field("ctaTitle", "CTA title", "Calculate your savings"),
      area("ctaSubtitle", "CTA subtitle", "Forecast your savings with solar and book a free consultation."),
    ],
  }));
}
