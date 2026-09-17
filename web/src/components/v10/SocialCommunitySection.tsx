'use client';

import React from 'react';
import {
  Instagram,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Video,
  Users,
  Compass,
  KeyRound,
  FileCheck2,
  CheckCircle2,
} from 'lucide-react';

const INSTAGRAM_URL =
  'https://www.instagram.com/rehvo.in?stkn=MW5jZ2x6b2xwbTJrbA==';

const FEATURE_CHIPS = [
  { label: 'Rental Tips', icon: KeyRound },
  { label: 'Property Tours', icon: Video },
  { label: 'Zero Brokerage Deals', icon: FileCheck2 },
  { label: 'Flatmate Stories', icon: Users },
  { label: 'Mumbai Locality Guides', icon: Compass },
  { label: 'REHVO Reels', icon: TrendingUp },
];

const COMMUNITY_STATS = [
  {
    title: 'Daily Rental Updates',
    description: 'Fresh direct-owner listings, price drops & new verified inventory in real-time.',
    badge: 'Real-Time',
    badgeColor: 'text-[#EA580C] bg-[#FFF7ED]',
  },
  {
    title: 'Verified Property Tours',
    description: 'Cinematic 4K walkthroughs and physical room inspections across prime Mumbai spots.',
    badge: '4K Tours',
    badgeColor: 'text-[#0F766E] bg-[#CCFBF1]',
  },
  {
    title: 'Mumbai Flatmate Community',
    description: 'Join thousands of verified working professionals and students finding compatible flatmates.',
    badge: 'Verified People',
    badgeColor: 'text-[#D97706] bg-[#FEF3C7]',
  },
  {
    title: 'Zero Brokerage Insights',
    description: 'Tenant rights, transparent rent index data, society rules & legal checklist tips.',
    badge: '100% Free',
    badgeColor: 'text-[#16A34A] bg-[#DCFCE7]',
  },
];

export const SocialCommunitySection: React.FC = () => {
  return (
    <section
      id="social-community"
      className="py-14 sm:py-20 bg-gradient-to-b from-white via-[#FFF7ED]/30 to-[#F8FAFC] relative overflow-hidden"
    >
      {/* Decorative ambient background glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#F97316]/10 via-[#FB923C]/10 to-[#0F766E]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#F97316]/5 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#FFF7ED] border border-[#F97316]/30 text-[#EA580C] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
            <span>Official Instagram Community</span>
          </div>

          <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black text-[#031B2A] tracking-tight leading-tight">
            Join India&apos;s Fastest Growing Rental Community
          </h2>

          <p className="text-xs sm:text-base text-[#64748B] font-medium leading-relaxed">
            Get daily rental tips, Mumbai property updates, zero brokerage deals, apartment tours, flatmate stories and exclusive REHVO reels directly on Instagram.
          </p>
        </div>

        {/* Responsive Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Left Column (5 cols): Main Instagram CTA Card */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-gradient-to-br from-[#031B2A] via-[#0F2938] to-[#1E293B] rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 text-white border border-[#E2E8F0]/20 shadow-card flex flex-col justify-between h-full relative overflow-hidden group">
              
              {/* Card ambient orange glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#F97316]/20 via-[#FB7185]/20 to-transparent rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                
                {/* Header Row: IG Icon + Badge */}
                <div className="flex items-center justify-between gap-3">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-[#FF543E] via-[#FF0077] to-[#833AB4] p-0.5 shadow-lg shadow-pink-900/30 flex items-center justify-center shrink-0">
                    <div className="w-full h-full bg-[#031B2A]/20 backdrop-blur-xs rounded-[14px] flex items-center justify-center">
                      <Instagram className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-white/10 text-white border border-white/15 backdrop-blur-md">
                    Growing Community 🚀
                  </span>
                </div>

                {/* Account Details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      @rehvo.in
                    </span>
                    <span
                      className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#0EA5E9] text-white"
                      title="Verified Account"
                      aria-label="Verified Account"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <p className="text-xs font-bold text-[#FDBA74] tracking-wide uppercase">
                    Verified REHVO Community
                  </p>
                  <p className="text-xs sm:text-sm text-white/70 font-medium leading-relaxed pt-1">
                    Follow along for Mumbai flat tours, behind-the-scenes walkthroughs, daily direct-owner listings, and roommate vibe checks.
                  </p>
                </div>

                {/* Feature Chips (6 items with icon + orange outline) */}
                <div className="pt-2">
                  <div className="text-[11px] font-black uppercase tracking-wider text-white/60 mb-2.5">
                    What You&apos;ll Find on Our Feed
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {FEATURE_CHIPS.map(({ label, icon: ChipIcon }) => (
                      <div
                        key={label}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-[#F97316]/50 text-white hover:bg-white/10 transition-colors"
                      >
                        <ChipIcon className="w-3.5 h-3.5 text-[#FB923C] shrink-0" />
                        <span className="text-xs font-bold truncate">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <div className="relative z-10 pt-6 mt-6 border-t border-white/10">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow REHVO on Instagram"
                  title="Follow REHVO on Instagram"
                  className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#F97316] via-[#EA580C] to-[#E11D48] hover:from-[#FB923C] hover:to-[#BE123C] text-white font-black text-sm flex items-center justify-center gap-2.5 transition-all duration-200 shadow-lg shadow-orange-950/40 hover:shadow-orange-700/50 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:ring-offset-2 focus:ring-offset-[#031B2A]"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Follow on Instagram</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

            </div>
          </div>

          {/* Right Column (7 cols): Community Stats & Pillars */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
              {COMMUNITY_STATS.map((item) => (
                <div
                  key={item.title}
                  className="bg-white rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 border border-[#E2E8F0] shadow-2xs hover:shadow-card hover:border-[#F97316]/40 transition-all duration-200 flex flex-col justify-between group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-[#EA580C]/40 group-hover:bg-[#EA580C] transition-colors" />
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-[#031B2A] tracking-tight group-hover:text-[#EA580C] transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#64748B] font-medium leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-bold text-[#EA580C]">
                    <span>Watch Stories</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom mini-banner linking to Instagram */}
            <div className="mt-4 bg-[#FFF7ED] rounded-[22px] p-4 border border-[#FDBA74]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#EA580C] text-white flex items-center justify-center shrink-0">
                  <Instagram className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-[#9A3412]">
                    Tag @rehvo.in in your Mumbai rental reels
                  </div>
                  <div className="text-[11px] text-[#C2410C] font-medium">
                    Get featured on our official channel &amp; unlock verified community perks.
                  </div>
                </div>
              </div>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View REHVO Instagram Reels"
                title="View REHVO Instagram Reels"
                className="shrink-0 inline-flex items-center gap-1.5 text-xs font-black text-white bg-[#EA580C] hover:bg-[#C2410C] px-3.5 py-2 rounded-xl transition shadow-xs focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:ring-offset-1"
              >
                <span>View Reels</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
