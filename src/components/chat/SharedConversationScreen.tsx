import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Linking,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useAppStore } from '../../store/useAppStore';
import * as chatService from '../../services/chat';
import { Message, Property, Conversation, FlatmateProfile } from '../../types';
import { OwnerChatHeader } from '../owner/chat/OwnerChatHeader';
import { OwnerChatPropertyCard } from '../owner/chat/OwnerChatPropertyCard';
import { OwnerChatMessageBubble } from '../owner/chat/OwnerChatMessageBubble';
import { OwnerChatQuickReplies } from '../owner/chat/OwnerChatQuickReplies';
import { OwnerChatMessageComposer } from '../owner/chat/OwnerChatMessageComposer';
import { OwnerChatMoreModal } from '../owner/chat/OwnerChatMoreModal';
import { ScheduleVisitModal } from '../property/ScheduleVisitModal';

interface SharedConversationScreenProps {
  conversationId: string;
  isOwner?: boolean;
}

const RENTER_QUICK_REPLIES = [
  'Is this still available?',
  'When can I visit?',
  'Is there any brokerage?',
  'Can I move in immediately?',
];

const OWNER_QUICK_REPLIES = [
  "Yes, it's available",
  'When would you like to visit?',
  'Would you like to schedule a visit?',
  'Happy to share more photos or details',
];

export const SharedConversationScreen: React.FC<
  SharedConversationScreenProps
> = ({ conversationId, isOwner = false }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);

  const {
    conversations,
    properties,
    flatmates,
    user,
    sendMessage,
    markConversationAsRead,
    fetchConversationById,
    addRealtimeMessage,
    showToast,
  } = useAppStore();

  const [composerText, setComposerText] = useState('');
  const [moreModalVisible, setMoreModalVisible] = useState(false);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch conversation if not in store
  useEffect(() => {
    let isMounted = true;
    const exists = conversations.find((c) => c.id === conversationId);
    if (!exists && conversationId) {
      setIsLoading(true);
      fetchConversationById(conversationId).finally(() => {
        if (isMounted) setIsLoading(false);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [conversationId, conversations, fetchConversationById]);

  // Realtime subscription for incoming messages
  useEffect(() => {
    if (!conversationId) return;

    const sub = chatService.subscribeToMessages(conversationId, (newMsg) => {
      addRealtimeMessage(conversationId, newMsg);
    });

    return () => {
      sub.unsubscribe();
    };
  }, [conversationId, addRealtimeMessage]);

  // Find conversation
  const conversation = useMemo<Conversation | null>(() => {
    const found = conversations.find((c) => c.id === conversationId);
    if (found) return found;
    return null;
  }, [conversations, conversationId]);

  // Mark as read on open
  useEffect(() => {
    if (conversation) {
      markConversationAsRead(conversation.id);
    }
  }, [conversation?.id, markConversationAsRead]);

  // Check if this is a flatmate conversation
  const flatmate = useMemo<FlatmateProfile | null>(() => {
    if (!conversation) return null;
    return flatmates.find((f) => f.id === conversation.property_id) || null;
  }, [flatmates, conversation]);

  // Find property
  const property = useMemo<Property | null>(() => {
    if (!conversation || flatmate) return null;
    return (
      properties.find((p) => p.id === conversation.property_id) ||
      properties[0] ||
      null
    );
  }, [properties, conversation, flatmate]);

  const messages = conversation?.messages || [];

  // Auto scroll to bottom
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

  const handleOpenProperty = () => {
    if (flatmate) {
      router.push(`/(renter)/flatmate/${flatmate.id}`);
    } else if (property) {
      router.push(`/(renter)/property/${property.id}`);
    }
  };

  const handleWhatsApp = () => {
    const phone = property?.owner_phone?.replace(/\D/g, '') || '919876543210';
    const text = `Hi, regarding "${property?.title || 'the property'}" on REHVO. Are you free for a quick chat?`;
    Linking.openURL(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`).catch(() => {});
  };

  const handleCall = () => {
    const phone = property?.owner_phone || '+919876543210';
    Linking.openURL(`tel:${phone}`).catch(() => {});
  };

  // Participant details based on role
  const otherName = isOwner
    ? conversation?.renter_name || 'Renter'
    : conversation?.owner_name || (flatmate ? flatmate.name : 'Property Owner');

  const otherAvatar = isOwner
    ? conversation?.renter_avatar
    : conversation?.owner_avatar || (flatmate ? flatmate.avatar : undefined);

  const currentUserId = user?.id || (isOwner ? 'owner_01' : 'renter_default');

  if (isLoading) {
    return (
      <View style={[styles.root, styles.centerWrap]}>
        <ActivityIndicator size="large" color="#6C4DFF" />
        <Text style={styles.loadingText}>Loading conversation...</Text>
      </View>
    );
  }

  if (!conversation) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <View style={styles.errorContainer}>
          <Text style={styles.emptyTitle}>Conversation Not Found</Text>
          <Text style={styles.emptySub}>
            This conversation is either unavailable or you do not have permission to access it.
          </Text>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={16} color="#FFFFFF" />
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.root}>
      {/* 1. Dedicated Header positioned strictly below safe area */}
      <OwnerChatHeader
        renterName={otherName}
        renterAvatar={otherAvatar}
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
        {/* 2. Message List with Context Card and Date Separator */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              {/* Context Card: Flatmate or Property */}
              {flatmate ? (
                <Pressable
                  style={styles.flatmateContextCard}
                  onPress={handleOpenProperty}
                >
                  <View style={styles.flatmateContextLeft}>
                    <View style={styles.flatmatePill}>
                      <Text style={styles.flatmatePillText}>Roommate Connection</Text>
                    </View>
                    <Text style={styles.flatmateContextName}>{flatmate.name}</Text>
                    <Text style={styles.flatmateContextMeta}>
                      {flatmate.locality}, {flatmate.city} • ₹
                      {(flatmate.budget_max || 30000).toLocaleString('en-IN')}/mo •{' '}
                      {flatmate.room_preference}
                    </Text>
                  </View>
                  <View style={styles.viewProfileBtn}>
                    <Text style={styles.viewProfileBtnText}>View Profile</Text>
                  </View>
                </Pressable>
              ) : property ? (
                <OwnerChatPropertyCard
                  property={property}
                  onPress={handleOpenProperty}
                />
              ) : null}

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
            const isSenderCurrentUser =
              item.sender_id === currentUserId ||
              (isOwner && (item.sender_id === 'owner_01' || item.sender_id === user?.id)) ||
              (!isOwner && (item.sender_id === 'renter_default' || item.sender_id === user?.id));

            return (
              <OwnerChatMessageBubble
                message={item}
                isOwner={isSenderCurrentUser}
              />
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyTitle}>Start the conversation</Text>
              <Text style={styles.emptySub}>
                {isOwner
                  ? 'Respond to renter questions about availability, rent, or schedule a physical visit.'
                  : 'Ask the property owner about availability, deposit, or schedule a visit.'}
              </Text>
            </View>
          }
        />

        {/* 3. Quick Replies Bar */}
        <OwnerChatQuickReplies
          onSelectReply={(r) => handleSendMessage(r)}
        />

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
  flatmateContextCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    borderRadius: 14,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 10,
    gap: 12,
    shadowColor: '#171522',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  flatmateContextLeft: {
    flex: 1,
    gap: 3,
  },
  flatmatePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
  },
  flatmatePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0284C7',
  },
  flatmateContextName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#171522',
  },
  flatmateContextMeta: {
    fontSize: 11,
    color: '#777482',
  },
  viewProfileBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#F0ECFF',
  },
  viewProfileBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  centerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#777482',
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#6C4DFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
