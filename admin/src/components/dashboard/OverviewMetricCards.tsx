'use client';

import React from 'react';
import {
  Users,
  Building2,
  CheckCircle2,
  Clock,
  UserCheck,
  Building,
  Briefcase,
  Video,
  IndianRupee,
  ShieldCheck,
  Ticket,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';
import { OverviewMetrics } from '@/types/admin';
import Link from 'next/link';

interface OverviewMetricCardsProps {
  metrics: OverviewMetrics;
}

export const OverviewMetricCards: React.FC<OverviewMetricCardsProps> = ({ metrics }) => {
  const cards = [
    {
      label: 'Total Users',
      value: metrics.totalUsers.toLocaleString('en-IN'),
      trend: 'Registered profiles',
      icon: Users,
      color: '#3B82F6',
      href: '/admin/users',
    },
    {
      label: 'Total Owners',
      value: metrics.totalOwners.toLocaleString('en-IN'),
      trend: 'Verified hosts',
      icon: Building2,
      color: '#10B981',
      href: '/admin/owners',
    },
    {
      label: 'Active Listings',
      value: metrics.activeProperties.toLocaleString('en-IN'),
      trend: 'Live in Mumbai',
      icon: CheckCircle2,
      color: '#0E8F73',
      href: '/admin/properties',
    },
    {
      label: 'Pending Review',
      value: metrics.pendingProperties.toLocaleString('en-IN'),
      trend: 'Deed check queue',
      icon: Clock,
      color: '#F59E0B',
      href: '/admin/kyc',
    },
    {
      label: 'Flatmate Seekers',
      value: metrics.totalFlatmateProfiles.toLocaleString('en-IN'),
      trend: 'Seeker profiles',
      icon: UserCheck,
      color: '#8B5CF6',
      href: '/admin/flatmates',
    },
    {
      label: 'PG & Hostels',
      value: metrics.totalPgListings.toLocaleString('en-IN'),
      trend: 'Rooms & shared stays',
      icon: Building,
      color: '#EC4899',
      href: '/admin/pg-hostels',
    },
    {
      label: 'Commercial Spaces',
      value: metrics.totalCommercialListings.toLocaleString('en-IN'),
      trend: 'Offices & retail',
      icon: Briefcase,
      color: '#06B6D4',
      href: '/admin/commercial',
    },
    {
      label: 'ShowReel Videos',
      value: metrics.totalShowreels.toLocaleString('en-IN'),
      trend: 'Walkthrough reels',
      icon: Video,
      color: '#F43F5E',
      href: '/admin/showreels',
    },
    {
      label: 'Revenue Today',
      value: `₹${metrics.revenueToday.toLocaleString('en-IN')}`,
      trend: 'Settled today',
      icon: IndianRupee,
      color: '#10B981',
      href: '/admin/payments',
    },
    {
      label: 'Inventory Rent',
      value: metrics.revenueMonth >= 100000 ? `₹${(metrics.revenueMonth / 100000).toFixed(2)} Lakh` : `₹${metrics.revenueMonth.toLocaleString('en-IN')}`,
      trend: 'Monthly rental value',
      icon: TrendingUp,
      color: '#10B981',
      href: '/admin/payments',
    },
    {
      label: 'Pending KYC & Deeds',
      value: metrics.pendingVerifications.toLocaleString('en-IN'),
      trend: 'Awaiting verification',
      icon: ShieldCheck,
      color: '#EAB308',
      href: '/admin/kyc',
    },
    {
      label: 'Open Support Tickets',
      value: metrics.openSupportTickets.toLocaleString('en-IN'),
      trend: 'Awaiting resolution',
      icon: Ticket,
      color: '#EF4444',
      href: '/admin/support',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-3 sm:gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Link
            key={idx}
            href={card.href}
            className="group relative p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 hover:border-[#0E8F73]/40 shadow-xs dark:shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden flex flex-col justify-between"
          >
            {/* Top row */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                {card.label}
              </span>
              <div
                className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${card.color}18`, color: card.color }}
              >
                <Icon size={15} />
              </div>
            </div>

            {/* Value */}
            <div className="my-2">
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-[#10B981] transition-colors">
                {card.value}
              </div>
            </div>

            {/* Trend & Arrow */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-white/5 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
              <span className="truncate">{card.trend}</span>
              <ArrowUpRight size={12} className="text-slate-400 group-hover:text-[#10B981] transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        );
      })}
    </div>
  );
};
