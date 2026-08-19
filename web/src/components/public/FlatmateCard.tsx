import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Briefcase, CheckCircle2, User } from 'lucide-react';
import { PublicFlatmate } from '@/lib/seo/queries';

interface FlatmateCardProps {
  flatmate: PublicFlatmate;
}

export const FlatmateCard: React.FC<FlatmateCardProps> = ({ flatmate }) => {
  const avatarUrl =
    flatmate.photo ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';

  const roomPref =
    flatmate.room_preference === 'private_room'
      ? 'Private Room'
      : flatmate.room_preference === 'shared_room'
      ? 'Shared Room'
      : 'Any Room';

  return (
    <div className="bg-white rounded-2xl p-5 border border-stone-200 hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Top Avatar & Name */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="relative w-14 h-14 rounded-full overflow-hidden bg-purple-100 flex-shrink-0 border-2 border-white shadow-sm">
            {flatmate.photo ? (
              <Image
                src={avatarUrl}
                alt={flatmate.name}
                fill
                className="object-cover"
                sizes="56px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-purple-600 font-bold text-lg">
                {flatmate.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-bold text-stone-900 truncate">{flatmate.name}</h3>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            </div>
            <p className="text-xs text-stone-500 truncate flex items-center gap-1 mt-0.5">
              <Briefcase className="w-3 h-3 text-stone-400" />
              <span>{flatmate.profession}</span>
            </p>
          </div>
        </div>

        {/* Location & Budget */}
        <div className="space-y-1.5 mb-4 text-xs text-stone-600 bg-stone-50 p-3 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-stone-500 font-medium">Looking in:</span>
            <span className="font-semibold text-stone-800 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-purple-600" />
              {flatmate.locality}, {flatmate.city}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-stone-500 font-medium">Max Budget:</span>
            <span className="font-bold text-stone-900">
              ₹{flatmate.budget_max.toLocaleString('en-IN')}/mo
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-stone-500 font-medium">Room Type:</span>
            <span className="font-medium text-stone-700">{roomPref}</span>
          </div>
        </div>
      </div>

      {/* Action to App */}
      <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
          Verified Flatmate
        </span>
        <Link
          href="https://rehvo.com/app"
          target="_blank"
          className="text-xs font-bold text-stone-900 hover:text-purple-600 transition"
        >
          Connect on App →
        </Link>
      </div>
    </div>
  );
};
