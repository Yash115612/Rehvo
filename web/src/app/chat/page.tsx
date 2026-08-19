import React from 'react';
import { Metadata } from 'next';
import { ChatWorkspace } from '@/components/chat/ChatWorkspace';

export const metadata: Metadata = {
  title: 'Messages & Inquiries | REHVO',
  description: 'Direct messaging and real-time chat with homeowners and verified flatmates.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ChatInboxPage() {
  return <ChatWorkspace />;
}
