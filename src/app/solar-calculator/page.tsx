import { SolarCalculator } from "@/components/solar-calculator";
import { FeatureGrid, Section } from "@/components/section";
import { getPageContent } from "@/lib/page-content";

export const metadata = {
  title: "Solar Panel Savings Calculator - Estimate System Size, EMI & ROI",
  description:
    "Estimate rooftop solar system size, installation cost, EMI, savings and environmental impact using pincode and monthly electricity bill.",
};

const journey = [
  {
    title: "Calculate Your Savings",
    text: "Use the solar calculator to check investment, ROI, savings and system size in seconds.",
  },
  {
    title: "Book a Free Consultation",
    text: "Our experts visit at your convenience and prepare a detailed rooftop solar consultation.",
  },
  {
    title: "Quick & Safe Installation",
    text: "Get a cyclone-proof rooftop solar system installed with quality and safety checks.",
  },
  {
    title: "Track Performance",
    text: "Monitor generation, savings and impact over time through a transparent performance journey.",
  },
];

export const dynamic = "force-dynamic";

export default async function SolarCalculatorPage() {
  const cms = await getPageContent("solar-calculator");

  return (
    <>
      <section className="hero-grid">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <p className="eyebrow">{cms.eyebrow}</p>
            <h1 className="heading-1 mt-5">{cms.heroTitle}</h1>
            <p className="mt-6 text-xl leading-9 text-slate-600">
              {cms.heroSubtitle}
            </p>
          </div>
          <div className="mt-12">
            <SolarCalculator />
          </div>
        </div>
      </section>

      <Section eyebrow="Your journey" title={cms.journeyTitle}>
        <FeatureGrid items={journey} />
      </Section>

      <Section
        eyebrow="How it works"
        title={cms.howTitle}
        intro={cms.howIntro}
      >
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["Estimate solar savings", "Know how much you can save monthly, yearly and over 25 years."],
            ["Size your solar system", "Get the ideal system capacity and roof area estimate for your home."],
            ["Compare investment and EMI", "Understand approximate installation cost, subsidy and financing impact."],
          ].map(([title, text]) => (
            <article className="card" key={title}>
              <h3 className="text-xl font-black text-slate-950">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </Section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-slate-950 p-8 text-white lg:p-12">
          <p className="eyebrow">Disclaimer</p>
          <p className="mt-4 max-w-5xl text-sm leading-7 text-slate-300">
            Monthly, yearly and lifetime savings are indicative. Actual project cost and EMI may vary based on city,
            system variant, panel type, inverter type, roof height, discom charges, lender, after-sales service and
            final site design.
          </p>
        </div>
      </section>
    </>
  );
}
