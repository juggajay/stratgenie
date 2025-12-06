import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { createMetadata } from "@/lib/seo/metadata";
import { generateBreadcrumbSchema, generateWebPageSchema } from "@/lib/seo/schemas";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAllCategories, getPostsByCategory } from "@/lib/content";
import { BlogCard } from "@/components/content/blog-card";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

const categoryInfo: Record<
  string,
  { label: string; description: string }
> = {
  compliance: {
    label: "Compliance",
    description:
      "Stay on top of NSW strata compliance requirements, Strata Hub reporting, AGM deadlines, and regulatory updates.",
  },
  financial: {
    label: "Financial Management",
    description:
      "Learn about strata levies, budgeting, admin funds, capital works funds, and financial reporting for your strata scheme.",
  },
  maintenance: {
    label: "Maintenance & Assets",
    description:
      "Guides on capital works planning, building maintenance, repairs, and asset management for strata properties.",
  },
  "self-managed": {
    label: "Self-Managed Strata",
    description:
      "Everything you need to know about running a self-managed strata scheme in NSW, from transitioning to day-to-day operations.",
  },
  news: {
    label: "News & Updates",
    description:
      "Latest news, legislative changes, and updates affecting NSW strata schemes.",
  },
};

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({
    category,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const info = categoryInfo[category];

  if (!info) {
    return createMetadata({
      title: "Category Not Found",
      description: "The requested category could not be found.",
      path: `/blog/category/${category}`,
    });
  }

  return createMetadata({
    title: `${info.label} Articles | Strata Management Blog`,
    description: info.description,
    path: `/blog/category/${category}`,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const info = categoryInfo[category];

  if (!info) {
    notFound();
  }

  const posts = await getPostsByCategory(category);
  const allCategories = await getAllCategories();

  return (
    <>
      <JsonLd
        data={[
          generateBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: info.label, path: `/blog/category/${category}` },
          ]),
          generateWebPageSchema({
            title: `${info.label} Articles`,
            description: info.description,
            path: `/blog/category/${category}`,
          }),
        ]}
      />

      <div className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-[#6b6b8a] hover:text-[#FF6B35] mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-semibold tracking-tight text-[#1a1a2e] mb-4 font-display">
              {info.label}
            </h1>
            <p className="text-lg text-[#3d3d5c] max-w-2xl">
              {info.description}
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-12">
            <Link
              href="/blog"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-[#F8F5F0] text-[#3d3d5c] hover:bg-[#FFF0EB] hover:text-[#FF6B35] transition-colors"
            >
              All Posts
            </Link>
            {allCategories.map((cat) => (
              <Link
                key={cat}
                href={`/blog/category/${cat}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  cat === category
                    ? "bg-[#FF6B35] text-white"
                    : "bg-[#F8F5F0] text-[#3d3d5c] hover:bg-[#FFF0EB] hover:text-[#FF6B35]"
                }`}
              >
                {categoryInfo[cat]?.label || cat}
              </Link>
            ))}
          </div>

          {/* Posts Grid */}
          {posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-[#F8F5F0] rounded-[20px]">
              <p className="text-[#3d3d5c]">
                No articles in this category yet. Check back soon!
              </p>
            </div>
          )}

          {/* CTA */}
          <section className="mt-16 bg-gradient-to-r from-[#FF6B35] to-[#E85A2A] rounded-[20px] p-8 md:p-12 text-center">
            <h2 className="text-2xl font-semibold text-white mb-3 font-display">
              Simplify Your Strata Compliance
            </h2>
            <p className="text-white/90 mb-6 max-w-xl mx-auto">
              StrataGenie helps NSW strata committees stay compliant with automated
              reminders, document generation, and AI-powered guidance.
            </p>
            <Link
              href="/sign-up"
              className="inline-flex items-center px-6 py-3 bg-white text-[#FF6B35] font-medium rounded-lg hover:bg-[#FFF0EB] transition-colors"
            >
              Start Your Free Trial
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}
