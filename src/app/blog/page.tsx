import Link from "next/link";
import { getPageContent } from "@/lib/page-content";
import { blogPosts, company } from "@/lib/site-data";

const categories = [
  "All Blogs",
  "Residential Rooftop Solar",
  "GoodZero - Guaranteed Savings",
  "Solar Panel Installation",
  "Solar Panel Pricing",
  "Solar System Maintenance",
  "Housing Societies",
  "PM Surya Ghar Subsidy",
  "Commercial",
  "Solar Inverter",
  "Solar Batteries",
];

export const metadata = {
  title: `Solar Panel Related Blogs & Information | ${company.name}`,
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const cms = await getPageContent("blog");
  const featured = blogPosts[0];

  return (
    <>
      <section className="hero-grid">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="eyebrow">{cms.eyebrow}</p>
              <h1 className="heading-1 mt-5">{cms.heroTitle}</h1>
            </div>
            <Link className="card block bg-white" href={`/blog/${featured.slug}/`}>
              <p className="eyebrow">{featured.category}</p>
              <h2 className="heading-3 mt-3">{featured.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">{featured.excerpt}</p>
              <p className="mt-5 text-sm font-bold text-slate-500">
                {featured.readTime} · {featured.author} · {featured.date}
              </p>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[18rem_1fr] lg:px-8">
        <aside className="card h-fit">
          <p className="eyebrow">{cms.categoryTitle}</p>
          <div className="mt-5 grid gap-2">
            {categories.map((category) => (
              <button className="rounded-2xl px-3 py-2 text-left text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700" key={category} type="button">
                {category}
              </button>
            ))}
          </div>
        </aside>

        <div>
          <h2 className="heading-2">{cms.allBlogsTitle}</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {blogPosts.map((post) => (
              <Link className="card block" href={`/blog/${post.slug}/`} key={post.slug}>
                <p className="eyebrow">{post.category}</p>
                <h3 className="heading-3 mt-3">{post.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{post.excerpt}</p>
                <p className="mt-5 text-sm font-bold text-slate-500">
                  {post.readTime} · {post.author} · {post.date}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
