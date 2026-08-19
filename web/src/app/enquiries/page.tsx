'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ClipboardList,
  MessageSquare,
  Building,
  Loader2,
  Calendar,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { getMyEnquiries } from '@/services/enquiries';
import { getOrCreatePropertyConversation } from '@/services/chat';
import { Enquiry } from '@/lib/types';

export default function MyEnquiriesPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatLoadingId, setChatLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?next=/enquiries');
      return;
    }

    async function loadData() {
      if (user) {
        setLoading(true);
        const res = await getMyEnquiries(user.id);
        if (res.success && res.data) {
          setEnquiries(res.data);
        }
        setLoading(false);
      }
    }

    if (user) {
      loadData();
    }
  }, [user, isAuthenticated, authLoading, router]);

  const handleOpenChat = async (propertyId: string, enquiryId: string) => {
    if (!user) return;
    setChatLoadingId(enquiryId);
    const res = await getOrCreatePropertyConversation(propertyId, user.id, enquiryId);
    setChatLoadingId(null);

    if (res.success && res.data) {
      router.push(`/chat/${res.data}`);
    } else {
      alert(res.error || 'Failed to open conversation.');
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
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider block">
            Renter Activity
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            My Enquiries ({enquiries.length})
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Track inquiries sent to homeowners and open direct chat threads.
          </p>
        </div>

        <Link
          href="/mumbai"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-stone-900 bg-stone-100 hover:bg-stone-200 px-4 py-2 rounded-2xl transition"
        >
          <span>Browse More Homes</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {enquiries.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto">
            <ClipboardList className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">No enquiries submitted yet</h3>
          <p className="text-xs text-stone-500">
            When you find a flat or room you like, click &ldquo;Send Written Enquiry&rdquo; or &ldquo;Chat with Owner&rdquo; to connect directly.
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
          {enquiries.map((enq) => {
            const prop = enq.properties;
            const cover =
              prop?.property_images?.[0]?.image_url ||
              'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80';

            const statusColors = {
              pending: 'bg-amber-50 text-amber-700 border-amber-200',
              replied: 'bg-purple-50 text-purple-700 border-purple-200',
              scheduled: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              closed: 'bg-stone-50 text-stone-600 border-stone-200',
            }[enq.status] || 'bg-stone-50 text-stone-600 border-stone-200';

            return (
              <div
                key={enq.id}
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
                        {enq.status}
                      </span>
                      <span className="text-xs font-bold text-stone-400">
                        {new Date(enq.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-stone-900 leading-tight">
                      {prop?.title || 'Rental Property'}
                    </h3>

                    <p className="text-xs text-stone-500">
                      ₹{prop?.price?.toLocaleString('en-IN') || '—'}/mo • {prop?.locality || 'Mumbai'}
                    </p>

                    <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 text-xs text-stone-700 italic">
                      &ldquo;{enq.message}&rdquo;
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  {prop && (
                    <button
                      type="button"
                      disabled={chatLoadingId === enq.id}
                      onClick={() => handleOpenChat(prop.id, enq.id)}
                      className="flex-1 md:flex-none bg-stone-900 hover:bg-black text-white text-xs font-bold px-4 py-3 rounded-2xl transition flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      {chatLoadingId === enq.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                      )}
                      <span>Chat with Host</span>
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
