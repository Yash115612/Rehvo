import React from 'react';
import Link from 'next/link';
import { Home, Building2, BedDouble, Users, ArrowRight } from 'lucide-react';

const MARKETPLACES = [
  {
    id: 'rent',
    title: 'Homes',
    subtitle: 'Flats, apartments & studios',
    href: '/rent',
    badge: 'Verified Marketplace',
    icon: Home,
    iconBg: 'bg-[#CCFBF1]',
    iconColor: 'text-[#0F766E]',
  },
  {
    id: 'commercial',
    title: 'Commercial',
    subtitle: 'Offices, shops & showrooms',
    href: '/commercial',
    badge: 'Direct Landlords',
    icon: Building2,
    iconBg: 'bg-[#F1F5F9]',
    iconColor: 'text-[#031B2A]',
  },
  {
    id: 'pg-rooms',
    title: 'PG & Rooms',
    subtitle: 'Co-living stays & single rooms',
    href: '/pg-rooms',
    badge: 'Meals & Wi-Fi',
    icon: BedDouble,
    iconBg: 'bg-[#CCFBF1]',
    iconColor: 'text-[#0F766E]',
  },
  {
    id: 'flatmates',
    title: 'Flatmates',
    subtitle: 'Verified roommates & shared flats',
    href: '/flatmates',
    badge: 'Lifestyle Match',
    icon: Users,
    iconBg: 'bg-[#F1F5F9]',
    iconColor: 'text-[#031B2A]',
  },
];

export const QuickMarketplaceSwitch: React.FC = () => {
  return (
    <section className="py-6 sm:py-8 bg-[#F8FAFC]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {MARKETPLACES.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className="group bg-[#FFFFFF] rounded-2xl sm:rounded-[20px] p-4 sm:p-5 border border-[#E2E8F0] hover:border-[#0F766E]/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${item.iconBg} ${item.iconColor} flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10.5px] font-bold text-[#64748B] bg-[#F8FAFC] px-2.5 py-1 rounded-full">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base sm:text-lg text-[#031B2A] group-hover:text-[#0F766E] transition">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#64748B] font-medium mt-0.5 line-clamp-1">
                    {item.subtitle}
                  </p>
                </div>

                <div className="pt-3 mt-2 border-t border-[#E2E8F0]/60 flex items-center justify-between text-xs font-bold text-[#031B2A] group-hover:text-[#0F766E] transition">
                  <span>Explore {item.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
