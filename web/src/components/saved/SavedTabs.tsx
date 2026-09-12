'use client';

import React from 'react';
import { Layers, Home, Users, Building2, BedDouble } from 'lucide-react';

export type SavedCategory = 'all' | 'homes' | 'flatmates' | 'commercial' | 'pg';

interface SavedTabsProps {
  activeTab: SavedCategory;
  onSelectTab: (tab: SavedCategory) => void;
  counts: {
    all: number;
    homes: number;
    flatmates: number;
    commercial: number;
    pg: number;
  };
}

export const SavedTabs: React.FC<SavedTabsProps> = ({ activeTab, onSelectTab, counts }) => {
  const tabs = [
    { id: 'all' as SavedCategory, label: 'All Saved', count: counts.all, icon: Layers },
    { id: 'homes' as SavedCategory, label: 'Homes & Flats', count: counts.homes, icon: Home },
    { id: 'flatmates' as SavedCategory, label: 'Flatmates', count: counts.flatmates, icon: Users },
    { id: 'commercial' as SavedCategory, label: 'Commercial', count: counts.commercial, icon: Building2 },
    { id: 'pg' as SavedCategory, label: 'PG & Rooms', count: counts.pg, icon: BedDouble },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-black transition-all shrink-0 cursor-pointer ${
              isActive
                ? 'bg-[#031B2A] text-white shadow-md'
                : 'rehvo-glass-card text-[#031B2A] hover:bg-white/80 border border-white/80'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0F766E]' : 'text-[#64748B]'}`} />
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                isActive ? 'bg-white/20 text-white' : 'bg-stone-200/70 text-[#031B2A]'
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};