"use client";

import { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  description: string;
  features?: string[];
  gradient?: "blue" | "emerald" | "amber" | "purple";
}

const gradientStyles = {
  blue: "from-blue-50 to-blue-100/50 border-blue-100",
  emerald: "from-emerald-50 to-emerald-100/50 border-emerald-100",
  amber: "from-amber-50 to-amber-100/50 border-amber-100",
  purple: "from-purple-50 to-purple-100/50 border-purple-100",
};

const iconStyles = {
  blue: "bg-blue-100 text-blue-600",
  emerald: "bg-emerald-100 text-emerald-600",
  amber: "bg-amber-100 text-amber-600",
  purple: "bg-purple-100 text-purple-600",
};

const checkStyles = {
  blue: "bg-blue-200 text-blue-700",
  emerald: "bg-emerald-200 text-emerald-700",
  amber: "bg-amber-200 text-amber-700",
  purple: "bg-purple-200 text-purple-700",
};

export function FeatureCard({
  icon: Icon,
  title,
  subtitle,
  description,
  features,
  gradient = "blue",
}: FeatureCardProps) {
  return (
    <div
      className={`
        group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 md:p-8
        transition-all duration-300 hover:shadow-lg hover:-translate-y-1
        ${gradientStyles[gradient]}
      `}
    >
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="100" cy="0" r="70" fill="currentColor" className="text-white" />
        </svg>
      </div>

      <div className="relative z-10">
        <div
          className={`
            w-12 h-12 rounded-xl flex items-center justify-center mb-4
            transition-transform duration-300 group-hover:scale-110
            ${iconStyles[gradient]}
          `}
        >
          <Icon className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-semibold text-slate-900 mb-1">{title}</h3>
        {subtitle && (
          <p className={`text-sm font-medium mb-3 ${iconStyles[gradient].split(' ')[1]}`}>
            {subtitle}
          </p>
        )}
        <p className="text-sm text-slate-600 leading-relaxed mb-4">{description}</p>

        {features && features.length > 0 && (
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${checkStyles[gradient]}`}>
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-slate-700">{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
