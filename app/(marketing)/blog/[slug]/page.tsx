import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import { createMetadata } from "@/lib/seo/metadata";
import {
  generateArticleSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo/schemas";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/content";
import { mdxComponents } from "@/components/content/mdx-components";
import { BlogCard } from "@/components/content/blog-card";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return createMetadata({
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
      path: `/blog/${slug}`,
    });
  }

  return createMetadata({
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    path: `/blog/${slug}`,
    type: "article",
    image: post.frontmatter.image,
  });
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  compliance: { bg: "bg-[#FFF0EB]", text: "text-[#FF6B35]" },
  financial: { bg: "bg-[#ECFDF5]", text: "text-[#059669]" },
  maintenance: { bg: "bg-[#FEF3C7]", text: "text-[#D97706]" },
  "self-managed": { bg: "bg-[#E0F2FE]", text: "text-[#0891B2]" },
  news: { bg: "bg-[#F8F5F0]", text: "text-[#6b6b8a]" },
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(slug, 3);
  const colors =
    categoryColors[post.frontmatter.category] || categoryColors.news;

  const formattedDate = new Date(post.frontmatter.publishedAt).toLocaleDateString(
    "en-AU",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <>
      <JsonLd
        data={[
          generateBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.frontmatter.title, path: `/blog/${slug}` },
          ]),
          generateArticleSchema({
            title: post.frontmatter.title,
            description: post.frontmatter.description,
            slug: `/blog/${slug}`,
            publishedAt: post.frontmatter.publishedAt,
            updatedAt: post.frontmatter.updatedAt,
            author: post.frontmatter.author || "StrataGenie Team",
            image: post.frontmatter.image,
          }),
        ]}
      />

      <article className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-[#6b6b8a] hover:text-[#FF6B35] mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Article Header */}
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Link
                href={`/blog/category/${post.frontmatter.category}`}
                className={`inline-flex items-center px-3 py-1 rounded text-[10px] font-semibold uppercase tracking-wide ${colors.bg} ${colors.text} hover:opacity-80 transition-opacity`}
              >
                {post.frontmatter.category}
              </Link>
              <span className="text-sm text-[#6b6b8a] flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formattedDate}
              </span>
              <span className="text-sm text-[#6b6b8a] flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readingTime}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#1a1a2e] mb-4 font-display">
              {post.frontmatter.title}
            </h1>

            <p className="text-lg text-[#3d3d5c] leading-relaxed">
              {post.frontmatter.description}
            </p>

            {post.frontmatter.author && (
              <p className="mt-4 text-sm text-[#6b6b8a]">
                By {post.frontmatter.author}
              </p>
            )}
          </header>

          {/* Featured Image */}
          {post.frontmatter.image && (
            <div className="mb-10 rounded-xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.frontmatter.image}
                alt={post.frontmatter.imageAlt || post.frontmatter.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-slate max-w-none">
            <MDXRemote
              source={post.content}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
                },
              }}
            />
          </div>

          {/* Tags */}
          {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-[#E8E4DE]">
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="w-4 h-4 text-[#9595ad]" />
                {post.frontmatter.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-[#F8F5F0] text-[#3d3d5c] text-sm rounded-lg"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Trial CTA */}
          <div className="mt-12 bg-gradient-to-r from-[#FF6B35] to-[#E85A2A] rounded-[20px] p-6 text-center">
            <h3 className="text-xl font-semibold text-white mb-2 font-display">
              Ready to simplify your strata compliance?
            </h3>
            <p className="text-white/90 mb-4">
              Start your free trial today. No credit card required.
            </p>
            <Link
              href="/sign-up"
              className="inline-flex items-center px-5 py-2.5 bg-white text-[#FF6B35] font-medium rounded-lg hover:bg-[#FFF0EB] transition-colors"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-12 px-6 bg-[#F8F5F0]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-semibold text-[#1a1a2e] mb-6 font-display">
              Related Articles
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
