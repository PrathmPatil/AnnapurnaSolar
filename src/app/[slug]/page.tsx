import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/lead-form";
import { getPageContent } from "@/lib/page-content";
import { cityPages, company, secondaryPages } from "@/lib/site-data";

const allSlugs = [...Object.keys(secondaryPages), ...Object.keys(cityPages)];
type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allSlugs.map((slug) => ({ slug }));
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = secondaryPages[slug];
  const city = cityPages[slug];

  return {
    title: page?.title ?? (city ? `Solar in ${city.city} | ${company.name}` : company.name),
    description: page?.description ?? (city ? `Rooftop solar installation and savings consultation in ${city.city}.` : undefined),
  };
}

export default async function SecondaryPage({ params }: PageProps) {
  const { slug } = await params;
  const page = secondaryPages[slug];
  const city = cityPages[slug];
  const cms = await getPageContent(slug);

  if (!page && !city) {
    notFound();
  }

  if (city) {
    return (
      <section className="hero-grid">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <p className="eyebrow">{cms.eyebrow}</p>
            <h1 className="heading-1 mt-5">{cms.heroTitle}</h1>
            <p className="mt-6 max-w-2xl text-xl leading-9 text-slate-600">
              {cms.heroSubtitle}
            </p>
            <div className="mt-8 flex gap-3">
              <Link className="btn-primary" href="/solar-calculator/">
                {cms.primaryCta}
              </Link>
              <a className="btn-secondary" href="#book-visit">
                Book Visit
              </a>
            </div>
          </div>
          <LeadForm type="home" title={`Get a free solar consultation in ${city.city}.`} />
        </div>
      </section>
    );
  }

  return (
    <section className="hero-grid">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <p className="eyebrow">{cms.eyebrow}</p>
        <h1 className="heading-1 mt-5">{cms.heroTitle}</h1>
        <p className="mt-6 max-w-3xl text-xl leading-9 text-slate-600">{cms.heroSubtitle}</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {page.sections.map((section) => (
            <article className="card" key={section}>
              <p className="text-sm font-bold leading-7 text-slate-700">{section}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link className="btn-primary justify-center" href="/solar-calculator/">
            {cms.primaryCta}
          </Link>
          <Link className="btn-secondary justify-center" href="/">
            {cms.secondaryCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
