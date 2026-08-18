'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { BarChart3, Users, Building2, CalendarCheck, ShieldCheck, MessageSquare, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

interface AnalyticsData {
  totalUsers: number;
  totalProperties: number;
  verifiedProperties: number;
  activeProperties: number;
  totalFlatmates: number;
  totalEnquiries: number;
  totalVisits: number;
  completedVisits: number;
  totalSavedProperties: number;
  totalMessages: number;
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      setIsLoading(true);
      try {
        const [
          usersRes,
          propsRes,
          verifiedPropsRes,
          activePropsRes,
          flatmatesRes,
          enquiriesRes,
          visitsRes,
          completedVisitsRes,
          savedPropsRes,
          messagesRes,
        ] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('properties').select('id', { count: 'exact', head: true }),
          supabase.from('properties').select('id', { count: 'exact', head: true }).eq('verification_status', 'verified'),
          supabase.from('properties').select('id', { count: 'exact', head: true }).eq('status', 'active'),
          supabase.from('flatmate_profiles').select('id', { count: 'exact', head: true }),
          supabase.from('enquiries').select('id', { count: 'exact', head: true }),
          supabase.from('visits').select('id', { count: 'exact', head: true }),
          supabase.from('visits').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
          supabase.from('saved_properties').select('id', { count: 'exact', head: true }),
          supabase.from('messages').select('id', { count: 'exact', head: true }),
        ]);

        setData({
          totalUsers: usersRes.count || 0,
          totalProperties: propsRes.count || 0,
          verifiedProperties: verifiedPropsRes.count || 0,
          activeProperties: activePropsRes.count || 0,
          totalFlatmates: flatmatesRes.count || 0,
          totalEnquiries: enquiriesRes.count || 0,
          totalVisits: visitsRes.count || 0,
          completedVisits: completedVisitsRes.count || 0,
          totalSavedProperties: savedPropsRes.count || 0,
          totalMessages: messagesRes.count || 0,
        });
      } catch (err) {
        console.warn('[Admin Analytics] Load error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  const verifiedRatio = data && data.totalProperties > 0
    ? ((data.verifiedProperties / data.totalProperties) * 100).toFixed(1)
    : '0.0';

  const visitCompletionRate = data && data.totalVisits > 0
    ? ((data.completedVisits / data.totalVisits) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Analytics & Telemetry"
        subtitle="Real database metrics, inventory verification ratios, and engagement telemetry"
        badge="Live PostgreSQL Metrics"
      />

      {isLoading ? (
        <div className="bg-white rounded-xl border border-brand-border p-12 text-center flex items-center justify-center gap-2 text-xs text-brand-muted">
          <Loader2 size={16} className="animate-spin text-brand-primary" />
          <span>Aggregating analytics from Supabase...</span>
        </div>
      ) : data ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-brand-border p-4 shadow-xs">
              <p className="text-xs font-bold text-brand-muted uppercase">Verified Listing Ratio</p>
              <p className="text-2xl font-extrabold text-brand-dark mt-1">{verifiedRatio}%</p>
              <p className="text-[11px] text-brand-muted mt-1">
                {data.verifiedProperties} of {data.totalProperties} properties verified
              </p>
            </div>

            <div className="bg-white rounded-xl border border-brand-border p-4 shadow-xs">
              <p className="text-xs font-bold text-brand-muted uppercase">Tour Completion Rate</p>
              <p className="text-2xl font-extrabold text-brand-dark mt-1">{visitCompletionRate}%</p>
              <p className="text-[11px] text-brand-muted mt-1">
                {data.completedVisits} of {data.totalVisits} visits completed
              </p>
            </div>

            <div className="bg-white rounded-xl border border-brand-border p-4 shadow-xs">
              <p className="text-xs font-bold text-brand-muted uppercase">Total Enquiries & Messages</p>
              <p className="text-2xl font-extrabold text-brand-dark mt-1">{data.totalEnquiries + data.totalMessages}</p>
              <p className="text-[11px] text-brand-muted mt-1">
                {data.totalEnquiries} enquiries • {data.totalMessages} chat messages
              </p>
            </div>

            <div className="bg-white rounded-xl border border-brand-border p-4 shadow-xs">
              <p className="text-xs font-bold text-brand-muted uppercase">Shortlists & Saves</p>
              <p className="text-2xl font-extrabold text-brand-dark mt-1">{data.totalSavedProperties}</p>
              <p className="text-[11px] text-brand-muted mt-1">Properties bookmarked by seekers</p>
            </div>
          </div>

          {/* Aggregated Breakdown Summary */}
          <div className="bg-white rounded-xl border border-brand-border p-6 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-dark mb-4">
              Database Entity Aggregates
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3 rounded-lg bg-brand-canvas/60 border border-brand-border text-center">
                <p className="text-lg font-extrabold text-brand-dark">{data.totalUsers}</p>
                <p className="text-[11px] text-brand-muted font-medium mt-0.5">Profiles</p>
              </div>
              <div className="p-3 rounded-lg bg-brand-canvas/60 border border-brand-border text-center">
                <p className="text-lg font-extrabold text-brand-dark">{data.activeProperties}</p>
                <p className="text-[11px] text-brand-muted font-medium mt-0.5">Active Listings</p>
              </div>
              <div className="p-3 rounded-lg bg-brand-canvas/60 border border-brand-border text-center">
                <p className="text-lg font-extrabold text-brand-dark">{data.totalFlatmates}</p>
                <p className="text-[11px] text-brand-muted font-medium mt-0.5">Flatmate Profiles</p>
              </div>
              <div className="p-3 rounded-lg bg-brand-canvas/60 border border-brand-border text-center">
                <p className="text-lg font-extrabold text-brand-dark">{data.totalEnquiries}</p>
                <p className="text-[11px] text-brand-muted font-medium mt-0.5">Direct Enquiries</p>
              </div>
              <div className="p-3 rounded-lg bg-brand-canvas/60 border border-brand-border text-center">
                <p className="text-lg font-extrabold text-brand-dark">{data.totalVisits}</p>
                <p className="text-[11px] text-brand-muted font-medium mt-0.5">Scheduled Visits</p>
              </div>
              <div className="p-3 rounded-lg bg-brand-canvas/60 border border-brand-border text-center">
                <p className="text-lg font-extrabold text-brand-dark">{data.totalMessages}</p>
                <p className="text-[11px] text-brand-muted font-medium mt-0.5">Chat Messages</p>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
