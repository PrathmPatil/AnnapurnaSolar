import Link from "next/link";
import { FaqAccordion } from "@/components/faq-accordion";
import { LeadForm } from "@/components/lead-form";
import { FeatureGrid, Section, StatGrid } from "@/components/section";
import { SolarCalculator } from "@/components/solar-calculator";
import { MotionCard, Reveal } from "@/components/motion-primitives";
import { ScrollStory } from "@/components/scroll-story";
import { getPageContent } from "@/lib/page-content";
import { blogPosts, company, homeFaqs, testimonials, trustCards } from "@/lib/site-data";

const processSteps = [
  {
    title: "Free Home Visit & Rooftop Survey",
    text: "Our team measures your rooftop to design a solar system for maximum generation.",
  },
  {
    title: "Free 3D Solar Design",
    text: "We share a personalised rooftop solar design so you can clearly see how it will look.",
  },
  {
    title: "Installation & Subsidy Support",
    text: "Experts install your solar system and handle paperwork including subsidy support.",
  },
  {
    title: "Solar On. You Save. We Maintain.",
    text: "Your system starts saving from day one while we handle maintenance year after year.",
  },
];

export const dynamic = "force-dynamic";

export default async function Home() {
  const cms = await getPageContent("home");

  return (
    <>
      <section className="hero-grid">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
          <Reveal className="flex flex-col justify-center">
            <p className="eyebrow">{cms.eyebrow}</p>
            <h1 className="heading-1 mt-5">{cms.heroTitle}</h1>
            <p className="mt-6 max-w-2xl text-xl leading-9 text-slate-600">
              {cms.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a className="btn-primary justify-center" href="#book-visit">
                {cms.primaryCta}
              </a>
              <Link className="btn-secondary justify-center" href="/solar-calculator/">
                {cms.secondaryCta}
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 text-sm font-bold text-slate-700">
              <span className="rounded-full bg-white px-4 py-2 shadow-sm">Sangli, Maharashtra</span>
              <span className="rounded-full bg-white px-4 py-2 shadow-sm">{company.phone}</span>
              <span className="rounded-full bg-white px-4 py-2 shadow-sm">Solar installation & electrical work</span>
            </div>
          </Reveal>
          <Reveal className="grid gap-5" delay={0.1}>
            <div
              className="min-h-72 rounded-[2rem] border border-white/70 bg-cover bg-center shadow-2xl"
              style={{ backgroundImage: `url(${company.images[0]})` }}
              aria-label={`${company.name} solar work photo`}
            />
            <LeadForm type="home" title="Get a free rooftop survey and personalised solar savings plan." />
          </Reveal>
        </div>
      </section>

      <ScrollStory />

      <Section eyebrow="Get Solar For" title={cms.offersTitle}>
        <div className="horizontal-rail">
          {[
            ["Homes", "Save up to 90% on your home electricity bills.", "/"],
            ["Housing Societies", "Reduce common-area power costs and add long-term value.", "/housing-society/"],
            ["Commercial", "Power your business with green energy and save on costs.", "/commercial/"],
          ].map(([title, text, href], index) => (
            <MotionCard className="h-full" delay={index * 0.05} key={title}>
              <Link className="card group block h-full" href={href}>
                <div
                  className="mb-10 h-48 rounded-[1.5rem] bg-cover bg-center"
                  style={{ backgroundImage: `url(${company.images[index % company.images.length]})` }}
                />
                <h3 className="heading-3">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
                <span className="mt-5 inline-flex font-bold text-blue-700 group-hover:underline">Explore &gt;</span>
              </Link>
            </MotionCard>
          ))}
        </div>
      </Section>

      <Section eyebrow="Why families trust us" title={cms.trustTitle}>
        <FeatureGrid items={trustCards} />
      </Section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-[2rem] bg-slate-950 p-8 text-white lg:grid-cols-[0.9fr_1.1fr] lg:p-12">
          <div>
            <p className="eyebrow">Introducing</p>
            <h2 className="heading-2 mt-3 text-white">{cms.darkTitle}</h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
              {cms.darkSubtitle}
            </p>
            <a className="btn-primary mt-8" href={company.facebook}>
              View Facebook Page
            </a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {["Solar rooftop consultation", "Installation and electrical work", "Sangli local service", "Residential and commercial support"].map((item) => (
              <div className="rounded-3xl bg-white/10 p-5 text-lg font-black" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Section eyebrow="Service area" title={cms.serviceTitle}>
        <StatGrid
          stats={[
            { value: "416416", label: "Primary Service Pincode" },
            { value: "Sangli", label: "Business Location" },
            { value: "Solar", label: "Installation Work" },
            { value: "Local", label: "Electrical Support" },
          ]}
        />
      </Section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SolarCalculator compact />
      </section>

      <Section eyebrow="Our process" title={cms.processTitle}>
        <FeatureGrid items={processSteps} />
      </Section>

      <Section
        eyebrow="Real-time monitoring app"
        title={cms.monitoringTitle}
        intro="Track generation, savings, referrals and promised versus actual production with transparent monitoring."
      >
        <div className="mx-auto max-w-4xl rounded-[2rem] bg-gradient-to-br from-blue-700 to-slate-950 p-8 text-white shadow-2xl">
          <div className="grid gap-4 sm:grid-cols-2">
            {["Track your power generation", "Get complete visibility on savings", "Track referrals and rewards", "Compare promised vs actual generation"].map((item) => (
              <div className="rounded-3xl bg-white/10 p-5 font-black" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section eyebrow="Customer love" title="90% of our customers recommend us">
        <div className="horizontal-rail">
          {testimonials.map((testimonial, index) => (
            <MotionCard className="h-full" delay={index * 0.05} key={testimonial.quote}>
            <article className="card h-full">
              <p className="text-lg font-bold leading-8 text-slate-800">{testimonial.quote}</p>
              <p className="mt-6 font-bold text-slate-950">{testimonial.name}</p>
              <p className="text-sm text-slate-500">{testimonial.meta}</p>
            </article>
            </MotionCard>
          ))}
        </div>
      </Section>

      <Section eyebrow="FAQ" title={cms.faqTitle}>
        <FaqAccordion items={homeFaqs} />
      </Section>

      <Section eyebrow="Blogs" title={cms.blogTitle}>
        <div className="horizontal-rail">
          {blogPosts.slice(0, 3).map((post, index) => (
            <MotionCard className="h-full" delay={index * 0.05} key={post.slug}>
            <Link className="card block h-full" href={`/blog/${post.slug}/`}>
              <p className="eyebrow">{post.category}</p>
              <h3 className="heading-3 mt-3">{post.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{post.excerpt}</p>
              <p className="mt-5 text-sm font-bold text-blue-700">Read More</p>
            </Link>
            </MotionCard>
          ))}
        </div>
      </Section>
    </>
  );
}
