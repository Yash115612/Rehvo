'use client';

import React from 'react';

interface RehvoLogoAssembleProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const RehvoLogoAssemble: React.FC<RehvoLogoAssembleProps> = ({
  size = 'lg',
  showTagline = true,
}) => {
  const sizeClasses = {
    sm: {
      emblem: 'w-7 h-7 rounded-xl text-xs',
      text: 'text-2xl',
      letterV: 'text-2xl',
      padding: 'px-4 py-2 rounded-2xl',
      tagline: 'text-[9px]',
    },
    md: {
      emblem: 'w-9 h-9 rounded-2xl text-base',
      text: 'text-3xl sm:text-4xl',
      letterV: 'text-3xl sm:text-4xl',
      padding: 'px-6 py-3 rounded-3xl',
      tagline: 'text-[10px]',
    },
    lg: {
      emblem: 'w-11 h-11 rounded-2xl text-xl',
      text: 'text-4xl sm:text-5xl',
      letterV: 'text-4xl sm:text-5xl',
      padding: 'px-8 py-4 rounded-[28px]',
      tagline: 'text-xs',
    },
  }[size];

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Background Emerald Halo Aura */}
      <div className="absolute -inset-6 rounded-full bg-gradient-to-tr from-[#0F766E]/25 via-[#2DD4BF]/20 to-transparent blur-2xl animate-glow-rings pointer-events-none" />
      <div className="absolute inset-0 rounded-full border-2 border-[#CCFBF1] opacity-50 animate-ping pointer-events-none" />

      {/* Main Liquid-Glass Card Enclosing Logo Assembly */}
      <div
        className={`relative ${sizeClasses.padding} bg-white/92 backdrop-blur-2xl border border-white/80 shadow-2xl shadow-emerald-950/10 flex flex-col items-center overflow-hidden`}
      >
        {/* Shimmer Light Sweep Layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/70 to-transparent animate-shimmer-sweep" />
        </div>

        {/* Emblem & Assembled Wordmark Container */}
        <div className="relative flex items-center gap-3.5 z-10">
          {/* Emblem Icon: Animated Assembly */}
          <div
            className={`${sizeClasses.emblem} bg-gradient-to-br from-[#0F766E] to-[#064E3B] text-white flex items-center justify-center font-black shadow-lg shadow-emerald-900/30 animate-assemble-emblem ring-2 ring-[#CCFBF1]/60`}
          >
            <span>R</span>
          </div>

          {/* Letter Assembly Group: R - E - H - V - O */}
          <div
            className={`flex items-baseline font-black ${sizeClasses.text} tracking-tight`}
            aria-label="REHVO"
          >
            {/* R */}
            <span className="inline-block text-[#031B2A] animate-assemble-r">
              R
            </span>

            {/* E */}
            <span className="inline-block text-[#031B2A] animate-assemble-e">
              E
            </span>

            {/* H */}
            <span className="inline-block text-[#031B2A] animate-assemble-h">
              H
            </span>

            {/* V: Signature Emerald Accent with Radiance */}
            <span
              className={`inline-block relative text-transparent bg-clip-text bg-gradient-to-b from-[#14B8A6] via-[#0F766E] to-[#047857] animate-assemble-v drop-shadow-[0_2px_8px_rgba(15,118,110,0.4)] ${sizeClasses.letterV}`}
            >
              V
              {/* Micro-sparkle dot on the V */}
              <span className="absolute -top-1 right-0 w-1.5 h-1.5 rounded-full bg-[#34D399] animate-ping" />
            </span>

            {/* O */}
            <span className="inline-block text-[#031B2A] animate-assemble-o">
              O
            </span>
          </div>
        </div>

        {/* Assembled Tagline: VERIFIED LISTING */}
        {showTagline && (
          <div className="mt-2.5 flex items-center gap-1.5 animate-tagline-reveal z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E] animate-pulse" />
            <span
              className={`${sizeClasses.tagline} font-black text-[#0F766E] uppercase tracking-widest`}
            >
              Verified Listing • Owners & Brokers
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
