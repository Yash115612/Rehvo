'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Building2, BedDouble } from 'lucide-react';

interface CategoryTab {
  label: string;
  href: string;
  matchPrefix: string[];
  icon: React.ElementType;
  accentColor: string;
}

const CATEGORY_TABS: CategoryTab[] = [
  {
    label: 'Homes',
    href: '/rent',
    matchPrefix: ['/rent', '/property', '/mumbai'],
    icon: Home,
    accentColor: '#0F766E',
  },
  {
    label: 'Commercial',
    href: '/commercial',
    matchPrefix: ['/commercial'],
    icon: Building2,
    accentColor: '#4263EB',
  },
  {
    label: 'PG & Rooms',
    href: '/pg-rooms',
    matchPrefix: ['/pg-rooms', '/pg', '/rooms', '/studios'],
    icon: BedDouble,
    accentColor: '#D69E2E',
  },
];

export const RentMarketplaceNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="w-full flex items-center justify-center pt-2 pb-2">
      <div className="inline-flex items-center gap-1.5 p-1 rounded-full rehvo-glass-subtle shadow-xs">
        {CATEGORY_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.matchPrefix.some((prefix) => pathname.startsWith(prefix));

          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`h-9 px-4 sm:px-5 rounded-full text-xs font-bold flex items-center gap-2 transition-all duration-200 active:scale-95 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'rehvo-glass-card text-[#031B2A] shadow-xs font-extrabold -translate-y-0.5'
                  : 'text-[#64748B] hover:text-[#031B2A] hover:bg-white/40'
              }`}
            >
              <Icon
                className="w-3.5 h-3.5"
                style={{ color: isActive ? tab.accentColor : undefined }}
              />
              <span>{tab.label}</span>
              {isActive && (
                <span
                  className="w-1.5 h-1.5 rounded-full block"
                  style={{ backgroundColor: tab.accentColor }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
