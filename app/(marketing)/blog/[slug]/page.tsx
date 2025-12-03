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
  compliance: { bg: "bg-blue-100", text: "text-blue-700" },
  financial: { bg: "bg-emerald-100", text: "text-emerald-700" },
  maintenance: { bg: "bg-amber-100", text: "text-amber-700" },
  "self-managed": { bg: "bg-purple-100", text: "text-purple-700" },
  news: { bg: "bg-slate-100", text: "text-slate-700" },
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
            path: `/blog/${slug}`,
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
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Article Header */}
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Link
                href={`/blog/category/${post.frontmatter.category}`}
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text} hover:opacity-80 transition-opacity`}
              >
                {post.frontmatter.category}
              </Link>
              <span className="text-sm text-slate-500 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formattedDate}
              </span>
              <span className="text-sm text-slate-500 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readingTime}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 mb-4">
              {post.frontmatter.title}
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed">
              {post.frontmatter.description}
            </p>

            {post.frontmatter.author && (
              <p className="mt-4 text-sm text-slate-500">
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
            <div className="mt-10 pt-6 border-t border-slate-200">
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="w-4 h-4 text-slate-400" />
                {post.frontmatter.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Trial CTA */}
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-center">
            <h3 className="text-xl font-semibold text-white mb-2">
              Ready to simplify your strata compliance?
            </h3>
            <p className="text-blue-100 mb-4">
              Start your free trial today. No credit card required.
            </p>
            <Link
              href="/sign-up"
              className="inline-flex items-center px-5 py-2.5 bg-white text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-colors"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-12 px-6 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
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
