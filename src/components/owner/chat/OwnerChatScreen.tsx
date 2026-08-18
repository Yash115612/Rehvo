import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../../store/useAppStore';
import { Message, Property, Conversation } from '../../../types';
import { OwnerChatHeader } from './OwnerChatHeader';
import { OwnerChatPropertyCard } from './OwnerChatPropertyCard';
import { OwnerChatMessageBubble } from './OwnerChatMessageBubble';
import { OwnerChatQuickReplies } from './OwnerChatQuickReplies';
import { OwnerChatMessageComposer } from './OwnerChatMessageComposer';
import { OwnerChatMoreModal } from './OwnerChatMoreModal';
import { ScheduleVisitModal } from '../../property/ScheduleVisitModal';

interface OwnerChatScreenProps {
  conversationId: string;
}

export const OwnerChatScreen: React.FC<OwnerChatScreenProps> = ({
  conversationId,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);

  const {
    conversations,
    properties,
    user,
    sendMessage,
    showToast,
  } = useAppStore();

  const [composerText, setComposerText] = useState('');
  const [moreModalVisible, setMoreModalVisible] = useState(false);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);

  // Find conversation
  const conversation = useMemo<Conversation | null>(() => {
    const found = conversations.find((c) => c.id === conversationId);
    if (found) return found;

    // Fallback if ID doesn't match directly: return first conversation or null
    return conversations[0] || null;
  }, [conversations, conversationId]);

  // Find property
  const property = useMemo<Property | null>(() => {
    if (!conversation) return properties[0] || null;
    return (
      properties.find((p) => p.id === conversation.property_id) ||
      properties[0] ||
      null
    );
  }, [properties, conversation]);

  const messages = conversation?.messages || [];

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || composerText;
    if (!text.trim() || !conversation) return;

    sendMessage(conversation.id, text.trim());
    setComposerText('');
  };

  const handleSelectQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  const handleOpenProperty = () => {
    if (property) {
      router.push(`/(renter)/property/${property.id}`);
    }
  };

  const handleWhatsApp = () => {
    const phone = '919876543210';
    const text = `Hi ${conversation?.renter_name || 'there'}, regarding "${property?.title || 'the property'}". Are you free for a quick chat?`;
    Linking.openURL(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`).catch(() => {});
  };

  const handleCall = () => {
    Linking.openURL(`tel:+919876543210`).catch(() => {});
  };

  const renterName = conversation?.renter_name || 'Renter';
  const renterAvatar = conversation?.renter_avatar;

  return (
    <View style={styles.root}>
      {/* 1. Dedicated Header positioned safely below status bar */}
      <OwnerChatHeader
        renterName={renterName}
        renterAvatar={renterAvatar}
        property={property}
        onBack={() => router.back()}
        onOpenProperty={handleOpenProperty}
        onOpenMore={() => setMoreModalVisible(true)}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* 2. Message List with Property Card and Date Separator */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              {/* Property Context Card */}
              <OwnerChatPropertyCard
                property={property}
                onPress={handleOpenProperty}
              />

              {/* Safety banner */}
              <View style={styles.safetyBanner}>
                <Text style={styles.safetyText}>
                  🛡️ Always keep communications on REHVO. Never share OTPs or passwords.
                </Text>
              </View>

              {/* Date Separator */}
              <View style={styles.dateSeparator}>
                <View style={styles.dateLine} />
                <Text style={styles.dateText}>Today</Text>
                <View style={styles.dateLine} />
              </View>
            </View>
          }
          renderItem={({ item }) => {
            const isOwner =
              item.sender_id === user?.id || item.sender_id === 'owner_01';

            return (
              <OwnerChatMessageBubble message={item} isOwner={isOwner} />
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyTitle}>Start the conversation</Text>
              <Text style={styles.emptySub}>
                Answer renter questions about availability, rent, or schedule a physical visit.
              </Text>
            </View>
          }
        />

        {/* 3. Quick Replies Bar */}
        <OwnerChatQuickReplies onSelectReply={handleSelectQuickReply} />

        {/* 4. Composer */}
        <OwnerChatMessageComposer
          text={composerText}
          onChangeText={setComposerText}
          onSend={() => handleSendMessage()}
          onAttachment={() => showToast('Photo attachment opened', 'info')}
        />
      </KeyboardAvoidingView>

      {/* More Options Modal */}
      <OwnerChatMoreModal
        visible={moreModalVisible}
        onClose={() => setMoreModalVisible(false)}
        onViewProperty={handleOpenProperty}
        onScheduleVisit={() => setScheduleModalVisible(true)}
        onWhatsApp={handleWhatsApp}
        onCall={handleCall}
      />

      {/* Schedule Visit Modal */}
      {property && (
        <ScheduleVisitModal
          property={property}
          isOpen={scheduleModalVisible}
          onClose={() => setScheduleModalVisible(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContent: {
    paddingBottom: 8,
    backgroundColor: '#F8F7F4',
    minHeight: '100%',
  },
  listHeader: {
    paddingBottom: 6,
  },
  safetyBanner: {
    backgroundColor: '#FAF9FF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  safetyText: {
    fontSize: 11.5,
    color: '#777482',
    lineHeight: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  dateSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginVertical: 8,
    paddingHorizontal: 24,
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8E5EC',
  },
  dateText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#86828F',
  },
  emptyWrap: {
    alignItems: 'center',
    padding: 32,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#171522',
  },
  emptySub: {
    fontSize: 13,
    color: '#777482',
    textAlign: 'center',
    lineHeight: 18,
  },
});
