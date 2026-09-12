'use client';

import React from 'react';

export const BHK_OPTIONS = [
  { id: 'all', label: 'All Homes', value: '' },
  { id: '1rk', label: '1 RK', value: '1 RK' },
  { id: '1bhk', label: '1 BHK', value: '1 BHK' },
  { id: '2bhk', label: '2 BHK', value: '2 BHK' },
  { id: '3bhk', label: '3 BHK', value: '3 BHK' },
  { id: '4bhk', label: '4+ BHK', value: '4+ BHK' },
  { id: 'studio', label: 'Studio', value: 'Studio' },
];

interface RentQuickBhkRailProps {
  selectedBhk: string;
  onSelectBhk: (bhkValue: string) => void;
}

export const RentQuickBhkRail: React.FC<RentQuickBhkRailProps> = ({
  selectedBhk,
  onSelectBhk,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
      {BHK_OPTIONS.map((opt) => {
        const isActive =
          (opt.value === '' && (!selectedBhk || selectedBhk === 'all')) ||
          opt.value === selectedBhk;

        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelectBhk(opt.value)}
            className={`h-9 px-4 sm:px-5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer active:scale-95 flex items-center gap-1.5 ${
              isActive
                ? 'rehvo-glass-card text-[#031B2A] shadow-xs font-extrabold -translate-y-0.5 border-white/90'
                : 'rehvo-glass-subtle text-[#64748B] hover:text-[#031B2A] hover:bg-white/50'
            }`}
          >
            {isActive && opt.value !== '' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E] block shrink-0" />
            )}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
