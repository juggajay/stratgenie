import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import type { PostMeta } from "@/lib/content";

interface BlogCardProps {
  post: PostMeta;
  featured?: boolean;
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  compliance: { bg: "bg-[#FFF0EB]", text: "text-[#FF6B35]" },
  financial: { bg: "bg-[#ECFDF5]", text: "text-[#059669]" },
  maintenance: { bg: "bg-[#FEF3C7]", text: "text-[#D97706]" },
  "self-managed": { bg: "bg-[#E0F2FE]", text: "text-[#0891B2]" },
  news: { bg: "bg-[#F8F5F0]", text: "text-[#6b6b8a]" },
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
        className="group block rounded-[20px] border border-[#E8E4DE] bg-white shadow-[0_4px_6px_rgba(0,0,0,0.02),0_10px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_6px_rgba(0,0,0,0.02),0_15px_30px_rgba(0,0,0,0.06)] transition-all overflow-hidden"
      >
        {post.frontmatter.image && (
          <div className="aspect-[2/1] bg-[#F8F5F0] relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.frontmatter.image}
              alt={post.frontmatter.imageAlt || post.frontmatter.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${colors.bg} ${colors.text}`}
            >
              {post.frontmatter.category}
            </span>
            <span className="text-xs text-[#6b6b8a] flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formattedDate}
            </span>
          </div>
          <h2 className="text-xl font-semibold text-[#1a1a2e] mb-2 group-hover:text-[#FF6B35] transition-colors font-display">
            {post.frontmatter.title}
          </h2>
          <p className="text-[#3d3d5c] text-sm line-clamp-2 mb-4">
            {post.frontmatter.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#6b6b8a] flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readingTime}
            </span>
            <span className="text-[#FF6B35] text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
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
      className="group block rounded-[20px] border border-[#E8E4DE] bg-white p-5 shadow-[0_4px_6px_rgba(0,0,0,0.02),0_10px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_6px_rgba(0,0,0,0.02),0_15px_30px_rgba(0,0,0,0.06)] transition-all"
    >
      <div className="flex items-center gap-3 mb-3">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${colors.bg} ${colors.text}`}
        >
          {post.frontmatter.category}
        </span>
      </div>
      <h3 className="font-semibold text-[#1a1a2e] mb-2 group-hover:text-[#FF6B35] transition-colors line-clamp-2 font-display">
        {post.frontmatter.title}
      </h3>
      <p className="text-[#3d3d5c] text-sm line-clamp-2 mb-3">
        {post.frontmatter.description}
      </p>
      <div className="flex items-center gap-4 text-xs text-[#6b6b8a]">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {formattedDate}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {post.readingTime}
        </span>
      </div>
    </Link>
  );
}
