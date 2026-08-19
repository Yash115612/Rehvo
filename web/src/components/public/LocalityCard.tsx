import React from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';

interface LocalityCardProps {
  name: string;
  slug: string;
  count?: number;
  avgRent?: number;
  zone?: string;
}

export const LocalityCard: React.FC<LocalityCardProps> = ({
  name,
  slug,
  count = 0,
  avgRent,
  zone,
}) => {
  return (
    <Link
      href={`/mumbai/${slug}`}
      className="group bg-white rounded-2xl p-5 border border-stone-200 hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <MapPin className="w-5 h-5" />
          </div>
          {zone && (
            <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
              {zone}
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-stone-900 group-hover:text-purple-600 transition mb-1">
          {name}
        </h3>

        {count > 0 ? (
          <p className="text-xs text-stone-500 font-medium">
            {count} {count === 1 ? 'verified home' : 'verified homes'} available
          </p>
        ) : (
          <p className="text-xs text-stone-400">Zero-brokerage rentals</p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
        {avgRent ? (
          <span className="text-xs font-bold text-stone-800">
            Avg. ₹{avgRent.toLocaleString('en-IN')}/mo
          </span>
        ) : (
          <span className="text-xs font-semibold text-stone-500">Explore locality</span>
        )}
        <span className="text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
          Browse <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
};
