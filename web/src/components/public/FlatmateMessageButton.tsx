'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { getOrCreateFlatmateConversation } from '@/services/chat';

interface FlatmateMessageButtonProps {
  flatmateId: string;
  userId?: string;
  name: string;
}

export const FlatmateMessageButton: React.FC<FlatmateMessageButtonProps> = ({
  flatmateId,
  userId,
  name,
}) => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [isStarting, setIsStarting] = useState(false);

  const handleStartChat = async () => {
    if (!isAuthenticated || !user) {
      router.push(`/login?next=/flatmates/${flatmateId}`);
      return;
    }

    if (userId && user.id === userId) {
      alert('This is your own profile.');
      return;
    }

    setIsStarting(true);
    const res = await getOrCreateFlatmateConversation(flatmateId, user.id);
    setIsStarting(false);

    if (res.success && res.data) {
      router.push(`/chat/${res.data}`);
    } else {
      alert(res.error || 'Failed to start conversation.');
    }
  };

  return (
    <button
      type="button"
      disabled={isStarting}
      onClick={handleStartChat}
      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm py-3.5 px-6 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
    >
      {isStarting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <MessageSquare className="w-4 h-4" />
      )}
      <span>Message {name}</span>
    </button>
  );
};
