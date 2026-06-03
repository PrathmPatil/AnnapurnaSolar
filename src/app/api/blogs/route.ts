import { blogPosts } from "@/lib/site-data";

export function GET() {
  return Response.json({
    ok: true,
    posts: blogPosts,
    categories: Array.from(new Set(blogPosts.map((post) => post.category))),
  });
}
