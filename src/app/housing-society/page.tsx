import { FaqAccordion } from "@/components/faq-accordion";
import { LeadForm } from "@/components/lead-form";
import { FeatureGrid, Section, StatGrid } from "@/components/section";
import { getPageContent } from "@/lib/page-content";
import { societyFaqs } from "@/lib/site-data";

const societyBenefits = [
  {
    title: "Quality that lasts 25+ years",
    text: "From design and installation to maintenance and subsidy paperwork, societies get end-to-end support.",
  },
  {
    title: "Money-back promise",
    text: "Promised unit generation is tracked so savings stay transparent and accountable.",
  },
  {
    title: "Government subsidy",
    text: "Societies can receive subsidy support under applicable government schemes.",
  },
  {
    title: "Tailored financing",
    text: "Choose CAPEX, OPEX or zero-investment options based on society approvals and budgets.",
  },
];

const projects = [
  ["Raheja Vistas CHS", "810 kW"],
  ["Sangalwadi Housing Society", "125 kW"],
  ["Sangli Apartment Complex", "90 kW"],
  ["L&T South City", "500 kW"],
  ["SNN Raj Greenbay", "341 kW"],
  ["24K Opula Apartments", "308 kW"],
];

export const dynamic = "force-dynamic";

export default async function HousingSocietyPage() {
  const cms = await getPageContent("housing-society");

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
            <div className="mt-8 flex flex-wrap gap-3 text-sm font-bold text-slate-700">
              <span className="rounded-full bg-white px-4 py-2 shadow-sm">Rated 4.8 on Google</span>
              <span className="rounded-full bg-white px-4 py-2 shadow-sm">200+ societies</span>
              <span className="rounded-full bg-white px-4 py-2 shadow-sm">10+ states and UTs</span>
            </div>
          </div>
          <LeadForm type="society" title={cms.formTitle} />
        </div>
      </section>

      <Section eyebrow="Trusted local support" title={cms.whyTitle}>
        <FeatureGrid items={societyBenefits} />
      </Section>

      <Section eyebrow="Society solar scale" title={cms.scaleTitle}>
        <StatGrid
          stats={[
            { value: "250+", label: "Housing Societies Solarized" },
            { value: "1,000+", label: "Solar Projects Executed" },
            { value: "8+", label: "Years Industry Experience" },
            { value: "25,000+", label: "Happy Customers" },
          ]}
        />
      </Section>

      <Section eyebrow="Largest projects" title={cms.projectsTitle}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map(([name, capacity]) => (
            <article className="card" key={name}>
              <p className="text-sm font-bold text-slate-500">{name}</p>
              <p className="heading-3 mt-3 text-blue-700">{capacity}</p>
            </article>
          ))}
        </div>
      </Section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-[2rem] bg-slate-950 p-8 text-white lg:grid-cols-2 lg:p-12">
          <div>
            <p className="eyebrow">Customer journey</p>
            <h2 className="heading-2 mt-3 text-white">{cms.journeyTitle}</h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              {cms.journeySubtitle}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["June 2024", "Commissioned"],
              ["Rs. 64,89,000", "Lifetime Savings"],
              ["Just 1 year", "Time to Break Even"],
              ["Rs. 60 lakhs", "Subsidy Received"],
            ].map(([value, label]) => (
              <div className="rounded-3xl bg-white/10 p-5" key={label}>
                <p className="heading-3 text-white">{value}</p>
                <p className="mt-1 text-sm text-slate-300">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Section eyebrow="Safety" title={cms.safetyTitle}>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {["IIT Bombay Approved", "Awarded by CII", "TUV Certified", "UL Certified"].map((item) => (
            <article className="card" key={item}>
              <div className="mb-5 h-24 rounded-3xl bg-gradient-to-br from-blue-100 to-amber-100" />
              <h3 className="heading-3">{item}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Structural quality, safe installation practices and long-term performance standards are built into the
                project process.
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section eyebrow="FAQ" title={cms.faqTitle}>
        <FaqAccordion items={societyFaqs} />
      </Section>
    </>
  );
}
