'use client';

import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

interface FlatmatesQuickFiltersProps {
  activeQuickFilter: string;
  onSelectQuickFilter: (key: string) => void;
  onOpenFilterDrawer: () => void;
  activeFilterCount: number;
}

const QUICK_TABS = [
  { id: 'all', label: 'All Flatmates' },
  { id: 'private_room', label: 'Private Room' },
  { id: 'shared_room', label: 'Shared Room' },
  { id: 'under_15k', label: 'Under ₹15k' },
  { id: 'under_25k', label: 'Under ₹25k' },
  { id: 'move_in_soon', label: 'Move-in Soon' },
  { id: 'wfh', label: 'WFH Friendly' },
  { id: 'vegetarian', label: 'Vegetarian' },
];

export const FlatmatesQuickFilters: React.FC<FlatmatesQuickFiltersProps> = ({
  activeQuickFilter,
  onSelectQuickFilter,
  onOpenFilterDrawer,
  activeFilterCount,
}) => {
  return (
    <div className="w-full flex items-center justify-between gap-2.5 pt-1 pb-1">
      <div
        className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar py-1"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {QUICK_TABS.map((tab) => {
          const isActive = activeQuickFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectQuickFilter(tab.id)}
              className={
                'h-9 px-4 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 ' +
                (isActive
                  ? 'bg-[#031B2A] text-white shadow-xs font-black -translate-y-0.5'
                  : 'bg-white hover:bg-slate-100 text-[#031B2A] border border-[#E2E8F0] shadow-2xs')
              }
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onOpenFilterDrawer}
        className="h-9 px-3.5 sm:px-4 rounded-full bg-white hover:bg-slate-100 text-xs font-bold text-[#031B2A] flex items-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer shrink-0 border border-[#E2E8F0]"
        aria-label="Open advanced filters"
      >
        <SlidersHorizontal className="w-3.5 h-3.5 text-[#0F766E]" />
        <span className="hidden sm:inline">Filters</span>
        {activeFilterCount > 0 && (
          <span className="w-5 h-5 rounded-full bg-[#0F766E] text-white text-[10px] font-black flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>
    </div>
  );
};
