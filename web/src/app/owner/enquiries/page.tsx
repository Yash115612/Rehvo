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
  ArrowLeft,
  User,
  Phone,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { getOwnerEnquiries } from '@/services/enquiries';
import { getOrCreatePropertyConversation } from '@/services/chat';
import { Enquiry } from '@/lib/types';

export default function OwnerEnquiriesPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatLoadingId, setChatLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?next=/owner/enquiries');
      return;
    }

    async function loadData() {
      if (user) {
        setLoading(true);
        const res = await getOwnerEnquiries(user.id);
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
      <div>
        <Link
          href="/owner"
          className="inline-flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-stone-900 transition mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Tenant Enquiries ({enquiries.length})
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Inquiries submitted by interested renters for your property listings.
        </p>
      </div>

      {enquiries.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm max-w-md mx-auto space-y-4">
          <ClipboardList className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-900">No tenant enquiries yet</h3>
          <p className="text-xs text-stone-500">
            When prospective renters enquire on your properties, their messages will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map((enq) => {
            const prop = enq.properties;
            const renter = enq.renter_profile;

            return (
              <div
                key={enq.id}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-extrabold text-purple-700 bg-purple-50 border border-purple-100 px-2.5 py-0.5 rounded-full">
                      {renter?.full_name || 'Renter'}
                    </span>
                    <span className="text-xs font-bold text-stone-400">
                      {new Date(enq.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm text-stone-900">
                    For: {prop?.title || 'Listing'}
                  </h3>

                  <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 text-xs text-stone-700">
                    &ldquo;{enq.message}&rdquo;
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  {prop && (
                    <button
                      type="button"
                      disabled={chatLoadingId === enq.id}
                      onClick={() => handleOpenChat(prop.id, enq.id)}
                      className="flex-1 md:flex-none bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-5 py-3 rounded-2xl transition flex items-center justify-center gap-2 shadow-sm"
                    >
                      {chatLoadingId === enq.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <MessageSquare className="w-4 h-4" />
                      )}
                      <span>Reply in Chat</span>
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
