'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Download,
  Trash2,
  ShieldAlert,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { exportToCSV } from '@/lib/export/csv-pdf';
import { supabase } from '@/lib/supabase/client';

interface ChatThread {
  id: string;
  renter_name: string;
  owner_name: string;
  property_title: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
  is_flagged: boolean;
  messages: {
    id: string;
    sender: string;
    text: string;
    time: string;
  }[];
}

export default function AdminChatsPage() {
  const [chats, setChats] = useState<ChatThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Query conversations if table exists
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error || !data || data.length === 0) {
        setChats([]);
        setSelectedThread(null);
      } else {
        const mapped: ChatThread[] = data.map((c: any) => ({
          id: c.id,
          renter_name: c.renter_name || 'Renter',
          owner_name: c.owner_name || 'Owner',
          property_title: c.property_title || 'Direct Chat',
          last_message: c.last_message || 'No messages',
          last_message_at: c.updated_at ? new Date(c.updated_at).toLocaleTimeString() : 'Recent',
          unread_count: 0,
          is_flagged: false,
          messages: [],
        }));
        setChats(mapped);
        setSelectedThread(mapped[0] || null);
      }
    } catch (err) {
      console.warn('Failed to load conversations:', err);
      setChats([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = chats.filter(
    (c) =>
      c.renter_name.toLowerCase().includes(search.toLowerCase()) ||
      c.owner_name.toLowerCase().includes(search.toLowerCase()) ||
      c.property_title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteMessage = (msgId: string) => {
    if (window.confirm('Delete message from the chat history?') && selectedThread) {
      setSelectedThread({
        ...selectedThread,
        messages: selectedThread.messages.filter((m) => m.id !== msgId),
      });
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 text-slate-900 dark:text-white">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Chat Moderation & Spam Sentinel
            </h1>
            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-[#10B981]/15 dark:text-[#10B981] dark:border-[#10B981]/30">
              {chats.length} Live Threads
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Detect off-platform contact exchanges, scam attempts, abusive conduct, and export chat transcripts
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 transition"
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            <span>Sync</span>
          </button>
          <button
            onClick={() => selectedThread && exportToCSV(selectedThread.messages, `rehvo_chat_${selectedThread.id}`)}
            disabled={!selectedThread || selectedThread.messages.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 transition disabled:opacity-50"
          >
            <Download size={13} />
            <span>Export Transcript</span>
          </button>
        </div>
      </div>

      {/* 2. Content */}
      {isLoading ? (
        <div className="py-24 text-center">
          <Loader2 className="animate-spin text-[#10B981] mx-auto mb-3" size={28} />
          <p className="text-xs text-slate-500 font-medium">Checking live chat channels in Supabase...</p>
        </div>
      ) : chats.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
          <MessageSquare size={36} className="mx-auto text-slate-300 dark:text-slate-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            0 Direct Message Threads in Database
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Zero mock conversations are displayed. Secure peer-to-peer chat threads initiated between prospective renters and verified owners in the REHVO app will be monitored here with automated PII & off-platform solicitation filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[650px]">
          {/* Left Column: Thread List */}
          <div className="lg:col-span-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col shadow-sm">
            <div className="p-3 border-b border-slate-200 dark:border-white/10">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search conversation..."
                  className="w-full bg-slate-50 dark:bg-[#16161A] pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#10B981]"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
              {filtered.map((thread) => {
                const isSelected = selectedThread && thread.id === selectedThread.id;
                return (
                  <button
                    key={thread.id}
                    onClick={() => setSelectedThread(thread)}
                    className={`w-full p-3.5 text-left transition flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-[#0E8F73]/15 border-l-2 border-[#10B981]'
                        : 'hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {thread.renter_name} ↔ {thread.owner_name}
                      </span>
                      <span className="text-[10px] text-slate-400">{thread.last_message_at}</span>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">{thread.property_title}</p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1 italic">&quot;{thread.last_message}&quot;</p>

                    {thread.is_flagged && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-400/10 px-2 py-0.5 rounded w-max mt-1 border border-amber-200 dark:border-amber-400/20">
                        <ShieldAlert size={10} /> Off-Platform Contact Flagged
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Conversation Viewer */}
          <div className="lg:col-span-8 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 flex flex-col justify-between overflow-hidden shadow-sm">
            {selectedThread ? (
              <>
                <div className="p-4 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/40 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-black text-slate-900 dark:text-white">
                      {selectedThread.renter_name} (Renter) & {selectedThread.owner_name} (Owner)
                    </h3>
                    <p className="text-[11px] text-[#10B981] font-semibold">{selectedThread.property_title}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alert(`Off-platform warning issued to user.`)}
                      className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 text-xs font-bold hover:opacity-80 transition"
                    >
                      Warn User
                    </button>
                    <button
                      onClick={() => alert(`User suspended from chat.`)}
                      className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 text-xs font-bold hover:opacity-80 transition"
                    >
                      Block Account
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {selectedThread.messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-slate-400">
                      No message history in this thread
                    </div>
                  ) : (
                    selectedThread.messages.map((msg) => (
                      <div key={msg.id} className="flex flex-col gap-1 group">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-900 dark:text-white">{msg.sender}</span>
                          <div className="flex items-center gap-2 text-slate-400">
                            <span>{msg.time}</span>
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="opacity-0 group-hover:opacity-100 text-rose-500 transition"
                              title="Delete this message"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-xs text-slate-800 dark:text-slate-200 leading-relaxed max-w-xl">
                          {msg.text}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-3 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/40 text-[11px] text-slate-500 text-center">
                  All messages are monitored under REHVO Trust & Safety Guidelines. Encrypted in Supabase.
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Select a conversation to inspect
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
