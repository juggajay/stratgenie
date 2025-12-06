import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import type { PostMeta } from "@/lib/content";

interface BlogCardProps {
  post: PostMeta;
  featured?: boolean;
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  compliance: { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200" },
  financial: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  maintenance: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  "self-managed": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  news: { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" },
};

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const colors = categoryColors[post.frontmatter.category] || categoryColors.news;
  const formattedDate = new Date(post.frontmatter.publishedAt).toLocaleDateString(
    "en-AU",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  if (featured) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group relative block rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg hover:border-cyan-200 transition-all duration-300 overflow-hidden"
      >
        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {post.frontmatter.image && (
          <div className="aspect-[2/1] bg-slate-100 relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.frontmatter.image}
              alt={post.frontmatter.imageAlt || post.frontmatter.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          </div>
        )}
        <div className="relative p-6">
          <div className="flex items-center gap-3 mb-3">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}
            >
              {post.frontmatter.category}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formattedDate}
            </span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-cyan-700 transition-colors">
            {post.frontmatter.title}
          </h2>
          <p className="text-slate-600 text-sm line-clamp-2 mb-4">
            {post.frontmatter.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readingTime}
            </span>
            <span className="text-cyan-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              Read more
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative block rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-cyan-200 transition-all duration-300"
    >
      {/* Subtle gradient on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative">
        <div className="flex items-center gap-3 mb-3">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}
          >
            {post.frontmatter.category}
          </span>
        </div>
        <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-cyan-700 transition-colors line-clamp-2">
          {post.frontmatter.title}
        </h3>
        <p className="text-slate-600 text-sm line-clamp-2 mb-3">
          {post.frontmatter.description}
        </p>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.readingTime}
          </span>
        </div>
      </div>
    </Link>
  );
}
