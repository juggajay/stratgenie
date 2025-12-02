"use client";

import { Quote } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  scheme?: string;
}

export function TestimonialCard({ quote, author, role, scheme }: TestimonialCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Quote icon */}
      <div className="absolute top-4 right-4 opacity-10">
        <Quote className="w-12 h-12 text-blue-600" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <p className="text-slate-700 leading-relaxed mb-6 text-base italic">
          &ldquo;{quote}&rdquo;
        </p>

        <div className="flex items-center gap-3">
          {/* Avatar placeholder */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
            {author.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{author}</p>
            <p className="text-sm text-slate-500">
              {role}{scheme && ` • ${scheme}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
