'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Send,
  Loader2,
  Building,
  Phone,
  Calendar,
  Check,
  CheckCheck,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  getConversationById,
  getMessages,
  sendMessage,
  markMessagesAsRead,
} from '@/services/chat';
import { Conversation, Message } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

interface ChatThreadPageProps {
  params: { conversationId: string };
}

export default function ChatThreadPage({ params }: ChatThreadPageProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [supabase] = useState(() => createClient());

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/login?next=/chat/${params.conversationId}`);
      return;
    }

    async function loadChat() {
      if (user) {
        setLoading(true);
        const [convRes, msgRes] = await Promise.all([
          getConversationById(params.conversationId, user.id),
          getMessages(params.conversationId),
        ]);

        if (convRes.success && convRes.data) {
          setConversation(convRes.data);
        }
        if (msgRes.success && msgRes.data) {
          setMessages(msgRes.data);
        }

        // Mark as read
        await markMessagesAsRead(params.conversationId, user.id);
        setLoading(false);
        setTimeout(scrollToBottom, 100);
      }
    }

    if (user) {
      loadChat();
    }
  }, [user, isAuthenticated, authLoading, params.conversationId, router]);

  // Real-time message subscription
  useEffect(() => {
    if (!params.conversationId || !user) return;

    const channel = supabase
      .channel(`chat_${params.conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${params.conversationId}`,
        },
        async (payload) => {
          const newMsg = payload.new as any;
          if (newMsg.sender_id !== user.id) {
            // Fetch formatted message with profile
            const { data } = await supabase
              .from('messages')
              .select(`*, sender_profile:profiles!messages_sender_id_fkey (id, full_name, profile_photo)`)
              .eq('id', newMsg.id)
              .single();

            if (data) {
              setMessages((prev) => [
                ...prev,
                {
                  id: data.id,
                  conversation_id: data.conversation_id,
                  sender_id: data.sender_id,
                  sender_name: data.sender_profile?.full_name || 'User',
                  sender_avatar: data.sender_profile?.profile_photo,
                  message: data.message,
                  message_type: data.message_type,
                  created_at: data.created_at,
                  is_read: true,
                },
              ]);
              await markMessagesAsRead(params.conversationId, user.id);
              setTimeout(scrollToBottom, 100);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [params.conversationId, user, supabase]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user || isSending) return;

    const textToSend = inputText.trim();
    setInputText('');
    setIsSending(true);

    // Optimistic UI update
    const tempId = `temp_${Date.now()}`;
    const optimisticMsg: Message = {
      id: tempId,
      conversation_id: params.conversationId,
      sender_id: user.id,
      sender_name: 'You',
      message: textToSend,
      message_type: 'text',
      created_at: new Date().toISOString(),
      is_read: false,
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setTimeout(scrollToBottom, 50);

    const res = await sendMessage(params.conversationId, user.id, textToSend);
    setIsSending(false);

    if (res.success && res.data) {
      setMessages((prev) => prev.map((m) => (m.id === tempId ? res.data! : m)));
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  const otherName = conversation?.other_participant?.full_name || 'Host';
  const prop = conversation?.properties;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col h-[calc(100vh-140px)] min-h-[550px]">
      {/* Chat Thread Header */}
      <div className="bg-white rounded-t-3xl p-4 sm:p-5 border-x border-t border-stone-200 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/chat"
            className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div>
            <h2 className="font-extrabold text-base text-stone-900 leading-tight">
              {otherName}
            </h2>
            {prop && (
              <p className="text-[11px] text-stone-500 truncate max-w-xs sm:max-w-md">
                Re: <strong className="text-stone-700">{prop.title}</strong> (₹{prop.price?.toLocaleString('en-IN')}/mo)
              </p>
            )}
          </div>
        </div>

        {prop && (
          <Link
            href={`/property/${prop.id}`}
            className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-2 rounded-xl transition"
          >
            <Building className="w-3.5 h-3.5" />
            <span>View Property</span>
          </Link>
        )}
      </div>

      {/* Message Stream Surface */}
      <div className="flex-1 bg-stone-50 border-x border-stone-200 p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-xs text-stone-400">
            No messages in this conversation yet. Send a message below to start chatting!
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
                  className={`max-w-[80%] sm:max-w-[70%] px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed shadow-sm ${
                    isMine
                      ? 'bg-purple-600 text-white rounded-br-none'
                      : 'bg-white text-stone-900 border border-stone-200 rounded-bl-none'
                  }`}
                >
                  {msg.message}
                </div>

                <span className="text-[10px] text-stone-400 mt-1 px-1 flex items-center gap-1">
                  {new Date(msg.created_at).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {isMine && <CheckCheck className="w-3 h-3 text-purple-600" />}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <form
        onSubmit={handleSendMessage}
        className="bg-white rounded-b-3xl p-3 sm:p-4 border-x border-b border-stone-200 shadow-lg flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message to host..."
          className="flex-1 px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isSending}
          className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold p-3 sm:px-5 sm:py-3 rounded-2xl shadow-md transition flex items-center justify-center gap-1.5"
        >
          {isSending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          <span className="hidden sm:inline text-xs">Send</span>
        </button>
      </form>
    </div>
  );
}
