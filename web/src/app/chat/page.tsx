'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MessageSquare,
  Building,
  Users,
  Search,
  Loader2,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { getConversations } from '@/services/chat';
import { Conversation } from '@/lib/types';

export default function ChatInboxPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?next=/chat');
      return;
    }

    async function loadData() {
      if (user) {
        setLoading(true);
        const res = await getConversations(user.id);
        if (res.success && res.data) {
          setConversations(res.data);
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

  const filteredConversations = conversations.filter((c) => {
    const title = c.properties?.title || c.other_participant?.full_name || '';
    const lastMsg = c.last_message_text || '';
    return (
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lastMsg.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider block">
            Direct Messaging
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Messages & Inquiries
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time chat with homeowners and potential flatmates.
          </p>
        </div>
      </div>

      {/* Search Input */}
      {conversations.length > 0 && (
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-2xl text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
        </div>
      )}

      {conversations.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto">
            <MessageSquare className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">No conversations yet</h3>
          <p className="text-xs text-stone-500">
            Start a direct conversation by clicking &ldquo;Chat with Owner&rdquo; on any property listing or &ldquo;Message Flatmate&rdquo;.
          </p>
          <Link
            href="/mumbai"
            className="inline-block bg-stone-900 text-white font-bold text-xs px-6 py-3 rounded-2xl shadow-md"
          >
            Explore Mumbai Rentals
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden divide-y divide-stone-100">
          {filteredConversations.map((conv) => {
            const isPropertyChat = !!conv.properties;
            const title =
              conv.properties?.title ||
              (conv.other_participant?.full_name ? `Flatmate: ${conv.other_participant.full_name}` : 'Direct Conversation');
            const avatar =
              conv.other_participant?.profile_photo ||
              conv.properties?.property_images?.[0]?.image_url ||
              'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200&auto=format&fit=crop&q=80';

            return (
              <Link
                key={conv.id}
                href={`/chat/${conv.id}`}
                className="p-5 hover:bg-purple-50/50 transition flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <img
                    src={avatar}
                    alt={title}
                    className="w-12 h-12 rounded-full object-cover border border-stone-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-extrabold text-sm text-stone-900 truncate group-hover:text-purple-700 transition">
                        {title}
                      </h3>
                      {conv.last_message_at && (
                        <span className="text-[10px] font-bold text-stone-400 flex-shrink-0">
                          {new Date(conv.last_message_at).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-stone-500 truncate">
                      {conv.last_message_text || 'Conversation started'}
                    </p>

                    {conv.properties && (
                      <span className="text-[10px] text-purple-600 font-bold block">
                        ₹{conv.properties.price?.toLocaleString('en-IN')}/mo • {conv.properties.locality}
                      </span>
                    )}
                  </div>
                </div>

                {conv.unread_count && conv.unread_count > 0 ? (
                  <span className="w-5 h-5 bg-purple-600 text-white font-extrabold text-[10px] rounded-full flex items-center justify-center flex-shrink-0">
                    {conv.unread_count}
                  </span>
                ) : (
                  <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
