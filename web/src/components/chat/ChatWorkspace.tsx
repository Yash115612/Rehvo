'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MessageSquare,
  Search,
  Send,
  Loader2,
  Building,
  ArrowLeft,
  CheckCheck,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  getConversations,
  getConversationById,
  getMessages,
  sendMessage,
  markMessagesAsRead,
} from '@/services/chat';
import { Conversation, Message } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

interface ChatWorkspaceProps {
  conversationId?: string;
}

export const ChatWorkspace: React.FC<ChatWorkspaceProps> = ({ conversationId }) => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, refreshUserData } = useAuth();
  const [supabase] = useState(() => createClient());

  // Conversation list state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Active conversation state
  const [selectedId, setSelectedId] = useState<string | null>(conversationId || null);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [convError, setConvError] = useState<string | null>(null);

  // Composer state
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // 1. Auth Guard - Web chat disabled, direct to app download
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/download');
    }
  }, [authLoading, isAuthenticated, router]);

  // 2. Load conversation list
  useEffect(() => {
    async function loadConversationsList() {
      if (!user) return;
      setLoadingList(true);
      const res = await getConversations(user.id);
      setLoadingList(false);

      if (res.success && res.data) {
        setConversations(res.data);

        // If on desktop and on /chat with no specific ID, default to first conversation
        if (!conversationId && res.data.length > 0 && typeof window !== 'undefined' && window.innerWidth >= 768) {
          setSelectedId(res.data[0].id);
        }
      }
    }

    if (user) {
      loadConversationsList();
    }
  }, [user, conversationId]);

  // 3. Load active conversation messages when selectedId changes
  useEffect(() => {
    if (!selectedId || !user) return;

    let isMounted = true;

    async function loadActiveData() {
      if (!user) return;
      setLoadingMessages(true);
      setConvError(null);

      const [convRes, msgRes] = await Promise.all([
        getConversationById(selectedId!, user.id),
        getMessages(selectedId!),
      ]);

      if (!isMounted) return;
      setLoadingMessages(false);

      if (convRes.success && convRes.data) {
        setActiveConv(convRes.data);
      } else {
        setConvError(convRes.error || 'Conversation not found.');
      }

      if (msgRes.success && msgRes.data) {
        setMessages(msgRes.data);
        setTimeout(scrollToBottom, 100);
        // Mark messages as read
        await markMessagesAsRead(selectedId!, user.id);
        await refreshUserData();
      }
    }

    loadActiveData();

    // 4. Setup Realtime Subscription for incoming messages
    const topic = `chat_messages:${selectedId}`;
    try {
      const existingChannels = supabase.getChannels();
      for (const ch of existingChannels) {
        if (ch.topic === topic || ch.topic === `realtime:${topic}`) {
          supabase.removeChannel(ch);
        }
      }
    } catch {}

    const channel = supabase
      .channel(topic)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
          setTimeout(scrollToBottom, 100);

          if (user && newMsg.sender_id !== user.id) {
            markMessagesAsRead(selectedId!, user.id);
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      try {
        supabase.removeChannel(channel);
      } catch {}
    };
  }, [selectedId, user, supabase, scrollToBottom, refreshUserData]);

  // 5. Send message action
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || !user || !inputText.trim() || isSending) return;

    const textToSend = inputText.trim();
    setInputText('');
    setSendError(null);
    setIsSending(true);

    const tempId = `temp-${Date.now()}`;
    const optimisticMsg: Message = {
      id: tempId,
      conversation_id: selectedId,
      sender_id: user.id,
      message: textToSend,
      message_type: 'text',
      is_read: false,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setTimeout(scrollToBottom, 50);

    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? {
              ...c,
              last_message_text: textToSend,
              last_message_at: optimisticMsg.created_at,
            }
          : c
      )
    );

    const res = await sendMessage(selectedId, user.id, textToSend);
    setIsSending(false);

    if (res.success && res.data) {
      setMessages((prev) => prev.map((m) => (m.id === tempId ? res.data! : m)));
    } else {
      setSendError(res.error || 'Failed to send message.');
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    }

    inputRef.current?.focus();
  };

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedId(conv.id);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      router.push(`/chat/${conv.id}`);
    }
  };

  if (authLoading || (loadingList && conversations.length === 0)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#0F766E] animate-spin" />
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

  const otherName = activeConv?.other_participant?.full_name || 'Host';
  const prop = activeConv?.properties;
  const flatmate = activeConv?.flatmate_profiles;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Mobile Back Button */}
      {conversationId && (
        <div className="md:hidden mb-3">
          <Link
            href="/chat"
            className="inline-flex items-center gap-1 text-xs font-bold text-stone-600 hover:text-stone-900 bg-white border border-stone-200 px-3 py-2 rounded-xl shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Conversations</span>
          </Link>
        </div>
      )}

      {/* Main Dual-Pane Web Chat Container */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl overflow-hidden flex flex-col md:flex-row h-[calc(100vh-140px)] min-h-[580px] max-h-[820px]">
        {/* LEFT PANEL: Conversation List */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-stone-200 flex flex-col bg-stone-50/70 ${
            conversationId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* List Header & Search */}
          <div className="p-4 border-b border-stone-200 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-base text-stone-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#0F766E]" />
                <span>Messages & Inquiries</span>
              </h2>
              <span className="text-[11px] font-bold text-stone-400">
                {conversations.length} {conversations.length === 1 ? 'chat' : 'chats'}
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats..."
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:bg-white"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Scrollable Conversation Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
            {conversations.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 bg-[#CCFBF1] text-[#0F766E] rounded-full flex items-center justify-center mx-auto">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-extrabold text-stone-900">Your conversations will appear here</h4>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Start a chat by clicking &ldquo;Chat with Owner&rdquo; on any property or &ldquo;Message Flatmate&rdquo;.
                </p>
                <Link
                  href="/mumbai"
                  className="inline-block bg-[#0F766E] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-teal-800/20 hover:bg-[#064E3B] transition"
                >
                  Browse Listings
                </Link>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-stone-400">
                No matching conversations found.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = selectedId === conv.id;
                const title =
                  conv.properties?.title ||
                  conv.other_participant?.full_name ||
                  'Direct Conversation';
                const avatar =
                  conv.other_participant?.profile_photo ||
                  conv.properties?.property_images?.[0]?.image_url ||
                  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200&auto=format&fit=crop&q=80';

                return (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`p-3.5 transition flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-[#CCFBF1]/80 border-l-4 border-[#0F766E]'
                        : 'hover:bg-stone-100/70'
                    }`}
                  >
                    <img
                      src={avatar}
                      alt={title}
                      className="w-10 h-10 rounded-full object-cover border border-stone-200 flex-shrink-0 mt-0.5"
                    />

                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-extrabold text-xs text-stone-900 truncate">
                          {title}
                        </h4>
                        {conv.last_message_at && (
                          <span className="text-[9px] font-bold text-stone-400 flex-shrink-0">
                            {new Date(conv.last_message_at).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-stone-500 truncate">
                        {conv.last_message_text || 'Conversation started'}
                      </p>

                      {conv.properties && (
                        <span className="text-[9px] text-[#0F766E] font-extrabold block truncate">
                          ₹{conv.properties.price?.toLocaleString('en-IN')}/mo • {conv.properties.locality}
                        </span>
                      )}
                    </div>

                    {conv.unread_count && conv.unread_count > 0 ? (
                      <span className="w-4 h-4 bg-[#0F766E] text-white font-extrabold text-[9px] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        {conv.unread_count}
                      </span>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Active Conversation Thread */}
        <div
          className={`flex-1 flex flex-col bg-white ${
            !conversationId && !selectedId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {loadingMessages ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-7 h-7 text-[#0F766E] animate-spin" />
            </div>
          ) : convError ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-rose-500" />
              <h3 className="font-bold text-sm text-stone-900">{convError}</h3>
              <p className="text-xs text-stone-500 max-w-sm">
                This conversation might be private, deleted, or you do not have permission to view it.
              </p>
              <Link
                href="/chat"
                className="bg-stone-900 text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                Back to Messages
              </Link>
            </div>
          ) : activeConv ? (
            <>
              {/* Active Conversation Header */}
              <div className="p-3.5 sm:p-4 border-b border-stone-200 bg-white flex items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={
                      activeConv.other_participant?.profile_photo ||
                      prop?.property_images?.[0]?.image_url ||
                      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200&auto=format&fit=crop&q=80'
                    }
                    alt={otherName}
                    className="w-10 h-10 rounded-full object-cover border border-stone-200 flex-shrink-0"
                  />

                  <div className="min-w-0">
                    <h3 className="font-extrabold text-sm text-stone-900 truncate">
                      {otherName}
                    </h3>
                    {prop ? (
                      <p className="text-[11px] text-stone-500 truncate">
                        Re: <strong className="text-stone-700">{prop.title}</strong> (₹{prop.price?.toLocaleString('en-IN')}/mo)
                      </p>
                    ) : flatmate ? (
                      <p className="text-[11px] text-stone-500 truncate">
                        Re: Flatmate in <strong>{flatmate.locality}, {flatmate.city}</strong>
                      </p>
                    ) : null}
                  </div>
                </div>

                {prop && (
                  <Link
                    href={`/property/${prop.id}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0F766E] bg-[#CCFBF1] hover:bg-[#99F6E4] px-3 py-1.5 rounded-xl transition flex-shrink-0"
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">View Listing</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>

              {/* Message Bubble Stream */}
              <div className="flex-1 bg-[#F8FAFC] p-4 sm:p-6 overflow-y-auto space-y-3.5">
                {messages.length === 0 ? (
                  <div className="text-center py-16 text-xs text-stone-400 space-y-1">
                    <p className="font-bold">No messages in this chat yet.</p>
                    <p className="text-[11px]">Send a message below to connect directly with the host.</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMine = msg.sender_id === user?.id;

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed shadow-sm ${
                            isMine
                              ? 'bg-[#0F766E] text-white rounded-br-none shadow-teal-800/15'
                              : 'bg-white text-stone-900 border border-stone-200 rounded-bl-none'
                          }`}
                        >
                          {msg.message}
                        </div>

                        <span className="text-[9px] text-stone-400 mt-1 px-1 flex items-center gap-1">
                          {new Date(msg.created_at).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          {isMine && <CheckCheck className="w-3 h-3 text-[#0F766E]" />}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Send Error Toast */}
              {sendError && (
                <div className="px-4 py-2 bg-rose-50 border-t border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-between">
                  <span>{sendError}</span>
                  <button
                    type="button"
                    onClick={() => setSendError(null)}
                    className="text-xs underline font-bold"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Message Composer */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 sm:p-4 bg-white border-t border-stone-200 flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 sm:py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:bg-white"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim() || isSending}
                  className="bg-[#0F766E] hover:bg-[#064E3B] disabled:opacity-50 text-white font-extrabold p-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-md shadow-teal-800/20 transition flex items-center justify-center gap-1.5"
                >
                  {isSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline text-xs">Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3 text-stone-400">
              <MessageSquare className="w-12 h-12 text-stone-300" />
              <h3 className="text-sm font-bold text-stone-700">Select a conversation</h3>
              <p className="text-xs max-w-xs text-stone-500">
                Choose a conversation from the left to view messages and reply in real-time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
