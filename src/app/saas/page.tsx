import Link from "next/link";
import { getPageContent } from "@/lib/page-content";
import { competitorInsights, saasModules } from "@/lib/solar-saas-data";

export const metadata = {
  title: "SwamiInfotech Solar SaaS",
  description: "A solar business SaaS for CRM, proposals, projects, dispatch, CMS and monitoring.",
};

export const dynamic = "force-dynamic";

export default async function SolarSaasPage() {
  const cms = await getPageContent("saas");

  return (
    <>
      <section className="hero-grid">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-4xl">
            <p className="eyebrow">{cms.eyebrow}</p>
            <h1 className="heading-1 mt-5">{cms.heroTitle}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              {cms.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="btn-primary justify-center" href="/cms/login/">
                Open CMS Controller
              </Link>
              <Link className="btn-secondary justify-center" href="/">
                View Website
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <p className="eyebrow">Modules</p>
          <h2 className="heading-2 mt-3">{cms.modulesTitle}</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {saasModules.map((module) => (
            <article className="card" key={module}>
              <p className="eyebrow">Module</p>
              <h2 className="heading-3 mt-3">{module}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Designed as part of a single lead-to-install workflow so sales, office, and field teams work from one
                source of truth.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <p className="eyebrow">Competitive study</p>
          <h2 className="heading-2 mt-3">{cms.researchTitle}</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {competitorInsights.map((item) => (
            <article className="card" key={item.name}>
              <p className="eyebrow">{item.name}</p>
              <h3 className="heading-3 mt-3">{item.focus}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{item.lesson}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
