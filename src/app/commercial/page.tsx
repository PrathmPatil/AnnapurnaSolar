import { FaqAccordion } from "@/components/faq-accordion";
import { LeadForm } from "@/components/lead-form";
import { FeatureGrid, Section, StatGrid } from "@/components/section";
import { getPageContent } from "@/lib/page-content";
import { blogPosts, commercialFaqs } from "@/lib/site-data";
import Link from "next/link";

const commercialBenefits = [
  {
    title: "Best price challenge",
    text: "Premium solar systems using top-quality components at competitive prices for lifetime performance.",
  },
  {
    title: "Precision designs",
    text: "Roof surveys, measurements and shadow analysis power accurate 3D designs before installation.",
  },
  {
    title: "Net metering or captive use",
    text: "Choose grid-connected or behind-the-meter systems depending on your power requirements.",
  },
  {
    title: "End-to-end execution",
    text: "From evaluation and safety checks to commissioning and maintenance, the journey is professionally managed.",
  },
];

export const dynamic = "force-dynamic";

export default async function CommercialPage() {
  const cms = await getPageContent("commercial");

  return (
    <>
      <section className="hero-grid">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <p className="eyebrow">{cms.eyebrow}</p>
            <h1 className="heading-1 mt-5">{cms.heroTitle}</h1>
            <p className="mt-6 max-w-2xl text-xl leading-9 text-slate-600">
              {cms.heroSubtitle}
            </p>
            <blockquote className="mt-8 rounded-[2rem] bg-white p-6 shadow-xl">
              <p className="text-lg font-bold leading-8 text-slate-800">
                {cms.quote}
              </p>
              <p className="mt-4 text-sm font-black text-blue-700">N Krishnamoorthy, Director, TVS & Sons</p>
            </blockquote>
          </div>
          <LeadForm type="commercial" title={cms.formTitle} />
        </div>
      </section>

      <Section
        eyebrow="Professional installation"
        title={cms.benefitsTitle}
        intro={cms.benefitsIntro}
      >
        <FeatureGrid items={commercialBenefits} />
      </Section>

      <Section eyebrow="Commercial impact" title={cms.impactTitle}>
        <StatGrid
          stats={[
            { value: "150+", label: "Commercial projects" },
            { value: "8+", label: "Years of experience" },
            { value: "90 MW+", label: "Installation experience" },
            { value: "70%+", label: "Potential bill reduction" },
          ]}
        />
      </Section>

      <Section eyebrow="How commercial solar works" title={cms.systemsTitle}>
        <div className="grid gap-6 lg:grid-cols-2">
          <article className="card">
            <h3 className="heading-3">With net metering</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Solar power generation is highest during the day. Excess power can be exported to the DISCOM through a
              bi-directional meter and adjusted against your electricity bill.
            </p>
          </article>
          <article className="card">
            <h3 className="heading-3">Without net metering</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              For high-consumption businesses, generated power can be consumed within the building as behind-the-meter
              solar without exporting power to the grid.
            </p>
          </article>
        </div>
      </Section>

      <Section eyebrow="Benefits" title="Save lakhs and reduce your carbon footprint">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["Lower electricity cost", "Solar energy reduces dependency on expensive grid power and improves long-term operating margins."],
            ["Accelerated depreciation", "Commercial entities can evaluate tax benefits while investing in long-life solar assets."],
            ["RPO and ESG goals", "Solar supports renewable purchase obligations and visible decarbonisation commitments."],
          ].map(([title, text]) => (
            <article className="card" key={title}>
              <h3 className="text-xl font-black text-slate-950">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section eyebrow="FAQ" title={cms.faqTitle}>
        <FaqAccordion items={commercialFaqs} />
      </Section>

      <Section eyebrow="Blogs" title={cms.blogTitle}>
        <div className="grid gap-5 md:grid-cols-3">
          {blogPosts.slice(1, 4).map((post) => (
            <Link className="card block" href={`/blog/${post.slug}/`} key={post.slug}>
              <p className="eyebrow">{post.category}</p>
              <h3 className="mt-3 text-xl font-black text-slate-950">{post.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
