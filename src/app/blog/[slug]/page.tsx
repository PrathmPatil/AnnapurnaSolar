import Link from "next/link";
import { notFound } from "next/navigation";
import { getPageContent } from "@/lib/page-content";
import { blogPosts, company } from "@/lib/site-data";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  return {
    title: post ? `${post.title} | ${company.name}` : `Blog | ${company.name}`,
    description: post?.excerpt,
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  const cms = await getPageContent(`blog-${slug}`);
  const bodyParagraphs = (cms.body ?? "").split(/\n{2,}/).map((item) => item.trim()).filter(Boolean);

  return (
    <article>
      <section className="hero-grid">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
          <Link className="text-sm font-black text-blue-700" href="/blog/">
            &lt; All Blogs
          </Link>
          <p className="eyebrow mt-8">{cms.category}</p>
          <h1 className="heading-1 mt-5">{cms.heroTitle}</h1>
          <p className="mt-6 text-sm font-bold text-slate-500">
            {post.readTime} · {post.author} · {post.date}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="card space-y-6 text-lg leading-9 text-slate-700">
          <p className="heading-3">{cms.excerpt}</p>
          {bodyParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-10 rounded-[2rem] bg-blue-700 p-8 text-white">
          <h2 className="heading-2 text-white">{cms.ctaTitle}</h2>
          <p className="mt-3 text-blue-100">{cms.ctaSubtitle}</p>
          <Link className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-black text-blue-700" href="/solar-calculator/">
            Open Solar Calculator
          </Link>
        </div>
      </div>
    </article>
  );
}
