'use client';

import React, { useState } from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';
import { AppDownloadModal } from '@/components/public/AppDownloadModal';

interface FlatmateMessageButtonProps {
  flatmateId: string;
  userId?: string;
  name: string;
}

export const FlatmateMessageButton: React.FC<FlatmateMessageButtonProps> = ({
  name,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="w-full bg-[#0F766E] hover:bg-[#064E3B] text-white font-extrabold text-sm py-3.5 px-6 rounded-2xl shadow-lg shadow-teal-800/20 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
      >
        <MessageSquare className="w-4 h-4" />
        <span>Message {name} (App Only)</span>
      </button>

      <AppDownloadModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Message ${name} on REHVO App`}
        subtitle="Chatting with verified flatmates and instant push messaging are exclusively available on the REHVO Mobile App for tenant safety."
      />
    </>
  );
};
