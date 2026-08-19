'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CalendarCheck,
  Calendar,
  Clock,
  MapPin,
  MessageSquare,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { getMyVisits, updateVisitStatus } from '@/services/visits';
import { getOrCreatePropertyConversation } from '@/services/chat';
import { Visit } from '@/lib/types';

export default function MyVisitsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?next=/visits');
      return;
    }

    async function loadData() {
      if (user) {
        setLoading(true);
        const res = await getMyVisits(user.id);
        if (res.success && res.data) {
          setVisits(res.data);
        }
        setLoading(false);
      }
    }

    if (user) {
      loadData();
    }
  }, [user, isAuthenticated, authLoading, router]);

  const handleCancelVisit = async (visitId: string) => {
    if (!confirm('Are you sure you want to cancel this scheduled visit?')) return;

    setUpdatingId(visitId);
    const res = await updateVisitStatus(visitId, 'cancelled');
    setUpdatingId(null);

    if (res.success) {
      setVisits((prev) =>
        prev.map((v) => (v.id === visitId ? { ...v, status: 'cancelled' } : v))
      );
    } else {
      alert(res.error || 'Failed to cancel visit.');
    }
  };

  const handleOpenChat = async (propertyId: string) => {
    if (!user) return;
    const res = await getOrCreatePropertyConversation(propertyId, user.id);
    if (res.success && res.data) {
      router.push(`/chat/${res.data}`);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  const filteredVisits = activeFilter === 'all'
    ? visits
    : visits.filter((v) => v.status === activeFilter);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider block">
            Renter Activity
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Scheduled Property Visits ({visits.length})
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Confirmed and pending on-site visits with homeowners.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-2xl w-fit">
          {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                activeFilter === tab
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {filteredVisits.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CalendarCheck className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">No {activeFilter !== 'all' ? activeFilter : ''} visits found</h3>
          <p className="text-xs text-stone-500">
            Select a verified listing on REHVO and choose a date to schedule a free on-site property tour.
          </p>
          <Link
            href="/mumbai"
            className="inline-block bg-stone-900 text-white font-bold text-xs px-6 py-3 rounded-2xl shadow-md"
          >
            Explore Mumbai Rentals
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredVisits.map((visit) => {
            const prop = visit.properties;
            const cover =
              prop?.property_images?.[0]?.image_url ||
              'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80';

            const statusColors = {
              pending: 'bg-amber-50 text-amber-700 border-amber-200',
              confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              completed: 'bg-purple-50 text-purple-700 border-purple-200',
              cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
            }[visit.status] || 'bg-stone-50 text-stone-600 border-stone-200';

            return (
              <div
                key={visit.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
              >
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={cover}
                    alt={prop?.title || 'Property'}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-stone-200 flex-shrink-0"
                  />
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${statusColors}`}>
                        {visit.status}
                      </span>
                      <span className="text-xs font-extrabold text-stone-900 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-purple-600" />
                        {new Date(visit.scheduled_date).toLocaleDateString('en-IN', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="text-xs font-bold text-stone-600 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        {visit.scheduled_time}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-stone-900 leading-tight">
                      {prop?.title || 'Rental Property'}
                    </h3>

                    <p className="text-xs text-stone-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>{prop?.address || prop?.locality || 'Mumbai'}</span>
                    </p>

                    {visit.notes && (
                      <p className="text-xs text-stone-600 italic bg-stone-50 p-2 rounded-xl">
                        Note: {visit.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  {prop && (
                    <button
                      type="button"
                      onClick={() => handleOpenChat(prop.id)}
                      className="flex-1 md:flex-none bg-stone-900 hover:bg-black text-white text-xs font-bold px-4 py-3 rounded-2xl transition flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                      <span>Host Chat</span>
                    </button>
                  )}

                  {visit.status === 'pending' || visit.status === 'confirmed' ? (
                    <button
                      type="button"
                      disabled={updatingId === visit.id}
                      onClick={() => handleCancelVisit(visit.id)}
                      className="px-4 py-3 rounded-2xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition flex items-center justify-center gap-1"
                    >
                      {updatingId === visit.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                      <span>Cancel</span>
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
