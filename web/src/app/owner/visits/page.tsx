'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CalendarCheck,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Loader2,
  ArrowLeft,
  User,
  MapPin,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { getOwnerVisits, updateVisitStatus } from '@/services/visits';
import { getOrCreatePropertyConversation } from '@/services/chat';
import { Visit } from '@/lib/types';

export default function OwnerVisitsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?next=/owner/visits');
      return;
    }

    async function loadData() {
      if (user) {
        setLoading(true);
        const res = await getOwnerVisits(user.id);
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

  const handleUpdateStatus = async (
    visitId: string,
    status: 'confirmed' | 'completed' | 'cancelled'
  ) => {
    setActionLoadingId(visitId);
    const res = await updateVisitStatus(visitId, status);
    setActionLoadingId(null);

    if (res.success) {
      setVisits((prev) =>
        prev.map((v) => (v.id === visitId ? { ...v, status } : v))
      );
    } else {
      alert(res.error || 'Failed to update visit status.');
    }
  };

  const handleOpenChat = async (propertyId: string, renterUserId: string) => {
    if (!user) return;
    const res = await getOrCreatePropertyConversation(propertyId, user.id, undefined, renterUserId);
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div>
        <Link
          href="/owner"
          className="inline-flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-stone-900 transition mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Property Tour Requests ({visits.length})
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Review and confirm requested physical on-site visits with prospective tenants.
        </p>
      </div>

      {visits.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm max-w-md mx-auto space-y-4">
          <CalendarCheck className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-900">No visit requests yet</h3>
          <p className="text-xs text-stone-500">
            When prospective renters schedule property visits for your listings, they will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {visits.map((visit) => {
            const prop = visit.properties;
            const renter = visit.renter_profile;

            const statusColors = {
              pending: 'bg-amber-50 text-amber-700 border-amber-200',
              confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              completed: 'bg-purple-50 text-purple-700 border-purple-200',
              cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
            }[visit.status] || 'bg-stone-50 text-stone-600 border-stone-200';

            return (
              <div
                key={visit.id}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
              >
                <div className="space-y-2 flex-1">
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

                  <h3 className="font-extrabold text-sm text-stone-900">
                    Property: {prop?.title || 'Listing'}
                  </h3>

                  <p className="text-xs text-stone-600 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-stone-400" />
                    <span>Renter: <strong>{renter?.full_name || 'Renter'}</strong> {renter?.phone ? `(${renter.phone})` : ''}</span>
                  </p>

                  {visit.notes && (
                    <p className="text-xs text-stone-600 italic bg-stone-50 p-2 rounded-xl">
                      Note from renter: {visit.notes}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  {visit.status === 'pending' && (
                    <button
                      type="button"
                      disabled={actionLoadingId === visit.id}
                      onClick={() => handleUpdateStatus(visit.id, 'confirmed')}
                      className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-3 rounded-2xl transition flex items-center justify-center gap-1 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm Slot</span>
                    </button>
                  )}

                  {visit.status === 'confirmed' && (
                    <button
                      type="button"
                      disabled={actionLoadingId === visit.id}
                      onClick={() => handleUpdateStatus(visit.id, 'completed')}
                      className="flex-1 md:flex-none bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-3 rounded-2xl transition flex items-center justify-center gap-1 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Completed</span>
                    </button>
                  )}

                  {visit.status !== 'cancelled' && visit.status !== 'completed' && (
                    <button
                      type="button"
                      disabled={actionLoadingId === visit.id}
                      onClick={() => handleUpdateStatus(visit.id, 'cancelled')}
                      className="p-3 rounded-2xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition flex items-center justify-center gap-1"
                      title="Cancel visit"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {prop && (
                    <button
                      type="button"
                      onClick={() => handleOpenChat(prop.id, visit.user_id)}
                      className="p-3 rounded-2xl bg-stone-100 text-stone-700 hover:bg-stone-200 transition"
                      title="Chat with renter"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
