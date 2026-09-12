'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, CheckCircle2, Heart, MessageCircle, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { PublicFlatmate } from '@/lib/seo/types';
import { RehvoImage } from '@/components/ui/RehvoImage';

interface FlatmateProfileCardProps {
  flatmate: PublicFlatmate;
  onSayHi?: (flatmate: PublicFlatmate) => void;
}

export const FlatmateProfileCard: React.FC<FlatmateProfileCardProps> = ({
  flatmate,
  onSayHi,
}) => {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('rehvo_saved_flatmates') || '[]');
      if (saved.includes(flatmate.id)) {
        setIsSaved(true);
      }
    } catch {}
  }, [flatmate.id]);

  const avatarUrl =
    flatmate.photo ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80';

  const roomLabel =
    flatmate.room_preference === 'private_room'
      ? 'Private Room'
      : flatmate.room_preference === 'shared_room'
      ? 'Shared Room'
      : 'Any Room';

  const tags = flatmate.lifestyle_preferences?.slice(0, 3) || ['Working Pro', 'Non-Smoker', 'Clean'];

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved((prev) => {
      const next = !prev;
      try {
        const saved = JSON.parse(localStorage.getItem('rehvo_saved_flatmates') || '[]');
        const updated = next
          ? Array.from(new Set([...saved, flatmate.id]))
          : saved.filter((id: string) => id !== flatmate.id);
        localStorage.setItem('rehvo_saved_flatmates', JSON.stringify(updated));
        window.dispatchEvent(new Event('rehvo_saved_updated'));
      } catch {}
      return next;
    });
  };

  const handleSayHiClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSayHi) {
      onSayHi(flatmate);
    }
  };

  return (
    <article className="group relative bg-white rounded-[24px] p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#0F766E]/40 border border-[#E2E8F0]">
      <div>
        {/* Top Portrait Frame with Save Heart */}
        <div className="relative w-full aspect-[4/3] rounded-[20px] overflow-hidden bg-[#F1F5F9] mb-4 border border-[#E2E8F0] shadow-xs">
          <RehvoImage
            src={avatarUrl}
            alt={flatmate.name}
            fill
            fallbackCategory="flatmate"
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Deep readable gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#031B2A]/90 via-[#031B2A]/30 to-transparent pointer-events-none" />

          {/* Top Badges */}
          <div className="absolute left-3 top-3 flex items-center gap-1.5">
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#064E3B] text-[10px] font-black shadow-xs">
              <ShieldCheck className="w-3 h-3 text-[#0F766E]" />
              <span>Verified</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#CCFBF1]/95 backdrop-blur-md text-[#064E3B] text-[10px] font-black shadow-xs">
              <Sparkles className="w-3 h-3 text-[#0F766E]" />
              <span>96% Match</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleSave}
            className="absolute right-3 top-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md hover:bg-white flex items-center justify-center text-[#031B2A] hover:text-[#0F766E] transition active:scale-90 shadow-sm cursor-pointer"
            aria-label={isSaved ? 'Unsave flatmate' : 'Save flatmate'}
          >
            <Heart
              className={'w-4 h-4 transition-colors ' + (isSaved ? 'fill-[#EF4444] text-[#EF4444]' : 'text-[#64748B]')}
            />
          </button>

          <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
            <div className="flex items-center gap-1.5">
              <h3 className="text-lg font-black tracking-tight drop-shadow-sm">
                {flatmate.name.split(' ')[0]}{flatmate.age ? (', ' + flatmate.age) : ''}
              </h3>
              <CheckCircle2 className="w-4 h-4 text-[#34D399] fill-white shrink-0 drop-shadow-sm" />
            </div>
            <p className="text-xs font-semibold text-white/95 drop-shadow-sm flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#2DD4BF] shrink-0" />
              <span className="truncate">{flatmate.locality}, Mumbai</span>
            </p>
          </div>
        </div>

        {/* Budget & Room Preference Pill Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E2E8F0]">
            <span className="block text-[9.5px] font-black text-[#64748B] uppercase tracking-wider">
              Budget
            </span>
            <span className="text-xs sm:text-sm font-black text-[#031B2A]">
              ₹{flatmate.budget_max ? flatmate.budget_max.toLocaleString('en-IN') : '20,000'}/mo
            </span>
          </div>

          <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E2E8F0]">
            <span className="block text-[9.5px] font-black text-[#64748B] uppercase tracking-wider">
              Room Type
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#031B2A] truncate block">
              {roomLabel}
            </span>
          </div>
        </div>

        {/* Compatibility Chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[10.5px] font-bold text-[#0F766E] bg-[#F0FDFA] px-2.5 py-1 rounded-full border border-[#CCFBF1]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Compatibility Match Card */}
        <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] mb-4">
          <span className="text-[#64748B] font-semibold text-[11px]">VibeMatch Compatibility</span>
          <span className="inline-flex items-center gap-1 font-black text-[#0F766E] text-xs">
            <Sparkles className="w-3 h-3" />
            <span>High Compatibility</span>
          </span>
        </div>
      </div>

      {/* Action Buttons: [ View Profile ] [ Say Hi ] */}
      <div className="flex items-center gap-2 pt-2 border-t border-[#E2E8F0]">
        <Link
          href={'/flatmates/' + flatmate.id}
          className="flex-1 h-10 px-3 rounded-full bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-xs font-bold text-[#031B2A] transition flex items-center justify-center gap-1 cursor-pointer active:scale-95 text-center truncate"
        >
          <span>View Profile</span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0 text-[#64748B]" />
        </Link>

        <button
          type="button"
          onClick={handleSayHiClick}
          className="flex-1 h-10 px-3 rounded-full bg-[#0F766E] hover:bg-[#064E3B] text-white text-xs font-black transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer active:scale-95 truncate"
        >
          <MessageCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Say Hi 👋</span>
        </button>
      </div>
    </article>
  );
};
