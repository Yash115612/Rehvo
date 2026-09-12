'use client';

import React from 'react';
import Link from 'next/link';
import { Home, MapPin, Calendar, ArrowRight, MessageCircle } from 'lucide-react';
import { PublicFlatmate } from '@/lib/seo/types';
import { RehvoImage } from '@/components/ui/RehvoImage';

interface RoomSeekersSectionProps {
  flatmates: PublicFlatmate[];
  onSayHi: (flatmate: PublicFlatmate) => void;
}

export const RoomSeekersSection: React.FC<RoomSeekersSectionProps> = ({ flatmates, onSayHi }) => {
  const roomSeekers = flatmates.filter((f) => f.room_preference === 'private_room' || f.room_preference === 'shared_room');
  if (roomSeekers.length === 0) return null;

  return (
    <section className="space-y-4 pt-4">
      <div className="border-b border-stone-200/80 pb-3">
        <div className="inline-flex items-center gap-1 text-[11px] font-black text-[#4263EB] uppercase tracking-wider mb-1">
          <Home className="w-3.5 h-3.5" />
          <span>Active Room Hunters</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[#031B2A] tracking-tight">
          People looking for a room
        </h2>
        <p className="text-xs text-[#64748B] font-semibold mt-0.5">
          Verified working professionals ready to move into existing shared flats.
        </p>
      </div>

      {/* Denser 3-Column Card Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {roomSeekers.slice(0, 3).map((flatmate) => {
          const roomLabel = flatmate.room_preference === 'private_room' ? 'Private Room' : 'Shared Room';
          return (
            <article
              key={'seeker-' + flatmate.id}
              className="rehvo-glass-card rounded-[22px] p-4 border border-white/70 shadow-sm flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="space-y-3">
                {/* Horizontal Header */}
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#F1F5F9] border border-white/80 shrink-0 shadow-2xs">
                    <RehvoImage
                      src={flatmate.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'}
                      alt={flatmate.name}
                      fill
                      fallbackCategory="flatmate"
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-black text-[#031B2A] truncate">
                      {flatmate.name}{flatmate.age ? (', ' + flatmate.age) : ''}
                    </h3>
                    <p className="text-xs text-[#64748B] font-semibold truncate flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#0F766E] shrink-0" />
                      <span>{flatmate.locality}</span>
                    </p>
                  </div>
                  <span className="text-xs font-black text-[#031B2A] bg-white/70 px-2.5 py-1 rounded-lg border border-white/80 shrink-0">
                    ₹{flatmate.budget_max.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Move-in & Room Badge Row */}
                <div className="flex items-center justify-between text-[11px] bg-white/50 px-3 py-1.5 rounded-xl border border-white/60">
                  <span className="font-bold text-[#031B2A]">{roomLabel}</span>
                  <span className="text-[#3C8D68] font-black flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{flatmate.move_in_date || 'Immediate'}</span>
                  </span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center gap-2 pt-3 mt-3 border-t border-white/60">
                <Link
                  href={'/flatmates/' + flatmate.id}
                  className="flex-1 h-8 px-3 rounded-full rehvo-glass-subtle text-[11px] font-bold text-[#031B2A] hover:bg-white flex items-center justify-center gap-1 cursor-pointer transition text-center truncate"
                >
                  <span>View Profile</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
                <button
                  type="button"
                  onClick={() => onSayHi(flatmate)}
                  className="h-8 px-3 rounded-full bg-[#0F766E] hover:bg-[#064E3B] text-white text-[11px] font-black flex items-center justify-center gap-1 transition shadow-xs cursor-pointer active:scale-95 shrink-0"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>Say Hi 👋</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
