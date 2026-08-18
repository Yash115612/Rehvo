import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { SharedConversationScreen } from '../../../src/components/chat/SharedConversationScreen';

export default function RenterChatConversationRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SharedConversationScreen
      conversationId={id || 'conv_01'}
      isOwner={false}
    />
  );
}
