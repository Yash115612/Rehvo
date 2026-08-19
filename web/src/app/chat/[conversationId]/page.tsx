import React from 'react';
import { Metadata } from 'next';
import { ChatWorkspace } from '@/components/chat/ChatWorkspace';

export const metadata: Metadata = {
  title: 'Direct Chat | REHVO',
  description: 'Direct messaging and real-time conversation thread.',
  robots: {
    index: false,
    follow: false,
  },
};

interface ChatThreadPageProps {
  params: { conversationId: string };
}

export default function ChatThreadPage({ params }: ChatThreadPageProps) {
  return <ChatWorkspace conversationId={params.conversationId} />;
}
