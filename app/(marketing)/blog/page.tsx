import { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { createMetadata } from "@/lib/seo/metadata";
import { generateBreadcrumbSchema, generateWebPageSchema } from "@/lib/seo/schemas";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAllPosts, getAllCategories } from "@/lib/content";
import { BlogCard } from "@/components/content/blog-card";
import { Logo } from "@/components/marketing/logo";

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

      {/* Hero Section with Brand Accent */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#FDFBF7] to-white">
        {/* Subtle decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-[#FFF0EB]/40 to-[#FFF0EB]/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-[#FFF0EB]/50 to-[#FFF0EB]/40 rounded-full blur-3xl" />
        </div>

        <div className="relative py-16 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header with Logo */}
            <div className="text-center mb-12">
              {/* Prominent Logo */}
              <div className="flex justify-center mb-8">
                <Logo className="h-12 w-auto" />
              </div>

              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-4">
                Strata{" "}
                <span className="bg-gradient-to-r from-[#FF6B35] via-[#FF6B35] to-[#E85A2A] bg-clip-text text-transparent">
                  Insights
                </span>
              </h1>
              <p className="text-lg text-[#3d3d5c] max-w-2xl mx-auto leading-relaxed">
                Expert guides and compliance updates to help you manage your NSW strata
                scheme with confidence.
              </p>

              {/* Decorative accent line */}
              <div className="mt-8 flex justify-center">
                <div className="h-1 w-24 bg-gradient-to-r from-[#FF6B35] to-[#E85A2A] rounded-full" />
              </div>
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-12">
                <Link
                  href="/blog"
                  className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-[#FF6B35] to-[#E85A2A] text-white shadow-md shadow-[#FF6B35]/20 hover:shadow-lg hover:shadow-[#FF6B35]/30 transition-all"
                >
                  All Posts
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/blog/category/${category}`}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-white text-foreground border border-[#E8E4DE] hover:border-[#FF6B35]/30 hover:text-[#FF6B35] transition-all"
                  >
                    {categoryLabels[category] || category}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-12 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#E85A2A]">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  Featured Articles
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {featuredPosts.map((post) => (
                  <BlogCard key={post.slug} post={post} featured />
                ))}
              </div>
            </section>
          )}

          {/* All Posts */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-6">
              {featuredPosts.length > 0 ? "Latest Articles" : "All Articles"}
            </h2>
            {regularPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularPosts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-[#F8F5F0] rounded-xl border border-[#E8E4DE]">
                <p className="text-[#3d3d5c]">
                  No articles published yet. Check back soon!
                </p>
              </div>
            )}
          </section>

          {/* Newsletter CTA */}
          <section className="mt-16 relative overflow-hidden rounded-2xl">
            {/* Background gradient with glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground to-foreground" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B35]/20 via-[#E85A2A]/20 to-[#FF6B35]/20" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-gradient-to-b from-[#FF6B35]/30 to-transparent blur-2xl" />

            <div className="relative p-8 md:p-12 text-center">
              <div className="inline-flex items-center justify-center mb-4">
                <Logo className="h-8 w-auto" inverted />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-3">
                Stay Updated on Strata Compliance
              </h2>
              <p className="text-white/80 mb-6 max-w-xl mx-auto">
                Get the latest guides, compliance updates, and tips delivered to your
                inbox. No spam, just valuable insights for strata committees.
              </p>
              <Link
                href="/sign-up"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#E85A2A] text-white font-medium rounded-lg hover:from-[#E85A2A] hover:to-[#FF6B35] transition-all shadow-lg shadow-[#FF6B35]/25 hover:shadow-xl hover:shadow-[#FF6B35]/30"
              >
                Start Your Free Trial
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
