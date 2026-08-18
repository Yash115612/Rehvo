'use client';

import React from 'react';
import {
  Users,
  Building2,
  UserCheck,
  ShieldAlert,
  CheckCircle2,
  CalendarCheck,
  MessageSquare,
  LifeBuoy,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { OverviewMetrics } from '@/types/admin';
import Link from 'next/link';

interface OverviewMetricCardsProps {
  metrics: OverviewMetrics;
}

export function OverviewMetricCards({ metrics }: OverviewMetricCardsProps) {
  const cards = [
    {
      label: 'Total Registered Users',
      value: metrics.totalUsers > 0 ? metrics.totalUsers.toLocaleString('en-IN') : 'No users yet',
      subtext: `${metrics.activeUsers} active this month`,
      icon: Users,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
      href: '/admin/users',
      trend: '+12%',
    },
    {
      label: 'Property Listings',
      value: metrics.totalProperties > 0 ? metrics.totalProperties.toLocaleString('en-IN') : 'No listings yet',
      subtext: `${metrics.activeProperties} active & published`,
      icon: Building2,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      href: '/admin/properties',
      trend: '+8%',
    },
    {
      label: 'Flatmate Profiles',
      value: metrics.totalFlatmateProfiles > 0 ? metrics.totalFlatmateProfiles.toLocaleString('en-IN') : 'No profiles yet',
      subtext: 'Seeking verified roommates',
      icon: UserCheck,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
      href: '/admin/flatmates',
      trend: '+15%',
    },
    {
      label: 'Pending Verification',
      value: metrics.pendingVerifications > 0 ? metrics.pendingVerifications : '0 pending',
      subtext: 'Awaiting deed & KYC review',
      icon: CheckCircle2,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      href: '/admin/verification',
      urgent: metrics.pendingVerifications > 0,
    },
    {
      label: 'Open Safety Reports',
      value: metrics.openReports > 0 ? metrics.openReports : '0 open',
      subtext: 'Flagged listings & users',
      icon: ShieldAlert,
      color: 'text-rose-600 bg-rose-50 border-rose-100',
      href: '/admin/reports',
      urgent: metrics.openReports > 0,
    },
    {
      label: 'Scheduled Visits',
      value: metrics.scheduledVisits > 0 ? metrics.scheduledVisits : 'No visits scheduled',
      subtext: 'Upcoming property tours',
      icon: CalendarCheck,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      href: '/admin/visits',
    },
    {
      label: 'Active Enquiries',
      value: metrics.totalEnquiries > 0 ? metrics.totalEnquiries : 'No enquiries yet',
      subtext: 'Renter-to-owner queries',
      icon: MessageSquare,
      color: 'text-cyan-600 bg-cyan-50 border-cyan-100',
      href: '/admin/enquiries',
    },
    {
      label: 'Support Tickets',
      value: metrics.openSupportTickets > 0 ? metrics.openSupportTickets : '0 open tickets',
      subtext: 'Customer assistance queue',
      icon: LifeBuoy,
      color: 'text-slate-600 bg-slate-100 border-slate-200',
      href: '/admin/support',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Link
            key={idx}
            href={card.href}
            className="group bg-white rounded-xl p-4 border border-brand-border hover:border-brand-primary/40 hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <span className="text-[12.5px] font-semibold text-brand-muted truncate">
                {card.label}
              </span>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center border ${card.color} flex-shrink-0 group-hover:scale-105 transition-transform`}
              >
                <Icon size={16} />
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-brand-dark tracking-tight">
                  {card.value}
                </span>
                {card.trend && (
                  <span className="text-[11px] font-bold text-brand-success flex items-center">
                    <TrendingUp size={12} className="inline mr-0.5" />
                    {card.trend}
                  </span>
                )}
              </div>
              <p className="text-[11.5px] text-brand-muted mt-1 font-medium flex items-center justify-between">
                <span>{card.subtext}</span>
                <ArrowUpRight
                  size={14}
                  className="opacity-0 group-hover:opacity-100 text-brand-primary transition-opacity"
                />
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
