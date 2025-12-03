import { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/seo/metadata";
import { generateBreadcrumbSchema, generateWebPageSchema } from "@/lib/seo/schemas";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAllPosts, getAllCategories } from "@/lib/content";
import { BlogCard } from "@/components/content/blog-card";

export const metadata: Metadata = createMetadata({
  title: "Strata Management Blog | Tips, Guides & Compliance Updates",
  description:
    "Expert insights on NSW strata compliance, self-managed strata tips, AGM guides, financial management, and more. Stay informed with StrataGenie's blog.",
  path: "/blog",
});

const categoryLabels: Record<string, string> = {
  compliance: "Compliance",
  financial: "Financial",
  maintenance: "Maintenance",
  "self-managed": "Self-Managed",
  news: "News & Updates",
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  const categories = await getAllCategories();
  const featuredPosts = posts.filter((p) => p.frontmatter.featured).slice(0, 2);
  const regularPosts = posts.filter((p) => !featuredPosts.includes(p));

  return (
    <>
      <JsonLd
        data={[
          generateBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
          generateWebPageSchema({
            title: "Strata Management Blog",
            description:
              "Expert insights on NSW strata compliance and self-managed strata tips.",
            path: "/blog",
          }),
        ]}
      />

      <div className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 mb-4">
              Strata Management Blog
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Expert insights, guides, and updates to help you manage your NSW strata
              scheme with confidence.
            </p>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              <Link
                href="/blog"
                className="px-4 py-2 rounded-full text-sm font-medium bg-blue-600 text-white"
              >
                All Posts
              </Link>
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/blog/category/${category}`}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  {categoryLabels[category] || category}
                </Link>
              ))}
            </div>
          )}

          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <section className="mb-16">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">
                Featured Articles
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {featuredPosts.map((post) => (
                  <BlogCard key={post.slug} post={post} featured />
                ))}
              </div>
            </section>
          )}

          {/* All Posts */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              {featuredPosts.length > 0 ? "Latest Articles" : "All Articles"}
            </h2>
            {regularPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularPosts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-xl">
                <p className="text-slate-600">
                  No articles published yet. Check back soon!
                </p>
              </div>
            )}
          </section>

          {/* Newsletter CTA */}
          <section className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl font-semibold text-white mb-3">
              Stay Updated on Strata Compliance
            </h2>
            <p className="text-blue-100 mb-6 max-w-xl mx-auto">
              Get the latest guides, compliance updates, and tips delivered to your
              inbox. No spam, just valuable insights for strata committees.
            </p>
            <Link
              href="/sign-up"
              className="inline-flex items-center px-6 py-3 bg-white text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-colors"
            >
              Start Your Free Trial
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}
