'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Building,
  Eye,
  ClipboardList,
  CalendarCheck,
  PlusCircle,
  MessageSquare,
  ArrowRight,
  Loader2,
  ShieldCheck,
  TrendingUp,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { getOwnerMetrics } from '@/services/owner';
import { getMyProperties } from '@/services/properties';
import { OwnerMetrics, Property } from '@/lib/types';

export default function OwnerDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [metrics, setMetrics] = useState<OwnerMetrics | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?next=/owner');
      return;
    }

    async function loadData() {
      if (user) {
        setLoading(true);
        const [metricsRes, propRes] = await Promise.all([
          getOwnerMetrics(user.id),
          getMyProperties(user.id),
        ]);

        if (metricsRes.success && metricsRes.data) {
          setMetrics(metricsRes.data);
        }
        if (propRes.success && propRes.data) {
          setProperties(propRes.data);
        }
        setLoading(false);
      }
    }

    if (user) {
      loadData();
    }
  }, [user, isAuthenticated, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-1">
            <LayoutDashboard className="w-3.5 h-3.5" />
            Host Command Center
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Owner Dashboard
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time analytics, tenant enquiries, and visit schedules across your Mumbai listings.
          </p>
        </div>

        <Link
          href="/owner/properties/new"
          className="inline-flex items-center gap-2 bg-stone-900 hover:bg-black text-white text-xs font-extrabold px-5 py-3.5 rounded-2xl shadow-lg transition"
        >
          <PlusCircle className="w-4 h-4 text-purple-400" />
          <span>List New Property</span>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Listings</span>
            <Building className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-extrabold text-stone-900">
            {metrics?.activeListings || 0}
            <span className="text-xs font-normal text-stone-400 ml-1.5">
              / {metrics?.totalListings || 0} total
            </span>
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Views</span>
            <Eye className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-extrabold text-stone-900">
            {metrics?.totalViews?.toLocaleString('en-IN') || 0}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Tenant Enquiries</span>
            <ClipboardList className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-stone-900">
            {metrics?.totalEnquiries || 0}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Visits Scheduled</span>
            <CalendarCheck className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-extrabold text-stone-900">
            {metrics?.totalVisits || 0}
            {metrics?.pendingVisits ? (
              <span className="text-xs font-bold text-amber-600 ml-1.5">
                ({metrics.pendingVisits} pending)
              </span>
            ) : null}
          </p>
        </div>
      </div>

      {/* Quick Access Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/owner/properties"
          className="bg-white p-6 rounded-3xl border border-stone-200 hover:border-purple-300 hover:shadow-md transition flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider block">
              Inventory
            </span>
            <h3 className="font-extrabold text-base text-stone-900 group-hover:text-purple-700">
              Manage Listings
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">Edit, pause, or view public links</p>
          </div>
          <ArrowRight className="w-5 h-5 text-stone-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/owner/enquiries"
          className="bg-white p-6 rounded-3xl border border-stone-200 hover:border-purple-300 hover:shadow-md transition flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider block">
              Inbox
            </span>
            <h3 className="font-extrabold text-base text-stone-900 group-hover:text-purple-700">
              Renter Enquiries
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">Reply and open chat threads</p>
          </div>
          <ArrowRight className="w-5 h-5 text-stone-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/owner/visits"
          className="bg-white p-6 rounded-3xl border border-stone-200 hover:border-purple-300 hover:shadow-md transition flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-extrabold text-amber-600 uppercase tracking-wider block">
              Calendar
            </span>
            <h3 className="font-extrabold text-base text-stone-900 group-hover:text-purple-700">
              Visit Requests
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">Confirm or reschedule site visits</p>
          </div>
          <ArrowRight className="w-5 h-5 text-stone-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* Recent Listed Properties */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-stone-900">Your Properties</h2>
          <Link
            href="/owner/properties"
            className="text-xs font-bold text-purple-600 hover:text-purple-800"
          >
            View All →
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm space-y-4">
            <Building className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="text-base font-bold text-stone-900">No properties listed yet</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              List your apartment, room, or PG on REHVO in under 3 minutes with 100% zero brokerage.
            </p>
            <Link
              href="/owner/properties/new"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-6 py-3 rounded-2xl shadow-md transition"
            >
              List First Property
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.slice(0, 3).map((prop) => {
              const cover =
                prop.property_images?.[0]?.image_url ||
                'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80';

              return (
                <div
                  key={prop.id}
                  className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm flex flex-col"
                >
                  <div className="relative aspect-[16/10] w-full bg-stone-100">
                    <img src={cover} alt={prop.title} className="w-full h-full object-cover" />
                    <span
                      className={`absolute top-3 left-3 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-sm ${
                        prop.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {prop.status}
                    </span>
                  </div>

                  <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-extrabold text-sm text-stone-900 leading-tight">
                        {prop.title}
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        ₹{prop.price.toLocaleString('en-IN')}/mo • {prop.locality}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold">
                      <Link
                        href={`/property/${prop.id}`}
                        className="text-stone-600 hover:text-stone-900"
                      >
                        Public Link
                      </Link>
                      <Link
                        href={`/owner/properties/${prop.id}/edit`}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        Edit →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
