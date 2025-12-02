"use client";

import { useState } from "react";
import { Play, Pause } from "lucide-react";

// TODO: Replace with <video src="/hero-demo.mp4"> when file is available.

export function HeroVideoPlaceholder() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative aspect-video w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-border/50 group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand/20 via-transparent to-transparent" />
      </div>

      {/* Fake app window mockup */}
      <div className="absolute inset-4 md:inset-8 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
        {/* Window controls */}
        <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
          <div className="w-3 h-3 rounded-full bg-red-400/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
          <div className="w-3 h-3 rounded-full bg-green-400/80" />
          <span className="ml-4 text-xs text-white/40 font-mono">stratagenie.app/dashboard</span>
        </div>

        {/* Fake content lines */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-32 h-4 rounded bg-white/10 animate-pulse" />
            <div className="w-24 h-4 rounded bg-brand/30" />
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="h-20 rounded-lg bg-white/5 border border-white/10" />
            <div className="h-20 rounded-lg bg-white/5 border border-white/10" />
            <div className="h-20 rounded-lg bg-white/5 border border-white/10" />
          </div>
          <div className="mt-4 space-y-2">
            <div className="w-full h-3 rounded bg-white/5" />
            <div className="w-3/4 h-3 rounded bg-white/5" />
            <div className="w-5/6 h-3 rounded bg-white/5" />
          </div>
        </div>
      </div>

      {/* Play button overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <div
          className={`
            w-20 h-20 md:w-24 md:h-24 rounded-full
            bg-white/95 shadow-lg
            flex items-center justify-center
            transition-all duration-300 ease-out
            ${isHovered ? 'scale-110 shadow-2xl' : 'scale-100'}
          `}
        >
          {isHovered ? (
            <Pause className="w-8 h-8 md:w-10 md:h-10 text-slate-900 ml-0" />
          ) : (
            <Play className="w-8 h-8 md:w-10 md:h-10 text-slate-900 ml-1" />
          )}
        </div>
        <p className={`
          mt-4 text-white/90 font-medium text-sm md:text-base
          transition-all duration-300
          ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-70 translate-y-1'}
        `}>
          See StrataGenie in Action
        </p>
        <p className="mt-1 text-white/50 text-xs">
          2 minute demo
        </p>
      </div>

      {/* Shimmer effect on hover */}
      <div
        className={`
          absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent
          transition-transform duration-700 ease-out
          ${isHovered ? 'translate-x-full' : '-translate-x-full'}
        `}
      />
    </div>
  );
}
