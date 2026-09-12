import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  ShieldCheck,
  Send,
  Plus,
  Mic,
  Image as ImageIcon,
  CheckCheck,
  Building2,
  Calendar,
  Receipt,
  X,
  Sparkles,
  MapPin,
  IndianRupee,
  Lock,
} from 'lucide-react-native';
import { useAppStore } from '../../store/useAppStore';
import { FlatmateProfile } from '../../types';
import { CURATED_FLATMATES } from '../../services/flatmatesData';
import { V4PropertyShareCard, V4PropertyShareData } from './ui/V4PropertyShareCard';
import { V4VisitCard, V4VisitData } from './ui/V4VisitCard';
import { V4SplitExpenseCard } from './ui/V4SplitExpenseCard';
import * as chatService from '../../services/chat';

interface ChatMessage {
  id: string;
  senderId: 'me' | 'other' | 'system';
  text?: string;
  time: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  isPropertyCard?: boolean;
  propertyData?: V4PropertyShareData;
  isVisitCard?: boolean;
  visitData?: V4VisitData;
  isExpenseCard?: boolean;
  is_edited?: boolean;
  is_deleted?: boolean;
  expenseData?: {
    title: string;
    totalAmount: number;
    myShare: number;
    status: 'pending' | 'paid';
    items: { label: string; amount: number }[];
  };
  isVoiceNote?: boolean;
  voiceDuration?: string;
}

const QUICK_REPLIES = [
  '👋 Hi! Loved your profile',
  '✨ Interested in 2 BHK in Bandra',
  '📅 Can we schedule a visit?',
  '💰 What is your budget range?',
  '🧹 How do you manage chores?',
];

export const FlatmateChatRoomScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const {
    flatmates,
    user,
    conversations,
    properties,
    sendRichMessage,
    markConversationAsRead,
    addRealtimeMessage,
    setTyping,
    wavedFlatmateIds,
    sendFlatmateWave,
    startOrGetFlatmateConversation,
    showToast,
  } = useAppStore();

  const conversationId = (params.id as string) || 'conv-1';

  // Identify chat partner from flatmates
  const partner: FlatmateProfile = useMemo(() => {
    return (
      flatmates.find((f) => f.id === conversationId || f.user_id === conversationId) ||
      flatmates[0] ||
      CURATED_FLATMATES[0]
    );
  }, [flatmates, conversationId]);

  // Find active conversation from store
  const conversation = useMemo(() => {
    return (
      (conversations || []).find(
        (c) =>
          c.id === conversationId ||
          c.other_user_id === partner.user_id ||
          c.flatmate_profile_id === partner.id
      ) || null
    );
  }, [conversations, conversationId, partner]);

  const activeConvId = conversation?.id || conversationId;

  // Mutual Wave Check
  const isWaved = useMemo(() => {
    return Boolean(
      (partner &&
        (wavedFlatmateIds?.includes(partner.id) ||
          (partner.user_id && wavedFlatmateIds?.includes(partner.user_id)))) ||
        (conversation?.messages && conversation.messages.length > 0)
    );
  }, [wavedFlatmateIds, partner, conversation?.messages]);

  // Apartment suggestions for co-living
  const suggestedProperties = useMemo(() => {
    if (!properties || properties.length === 0) return [];
    const loc = (partner.preferred_locations?.[0] || partner.locality || '').toLowerCase();
    const matched = properties.filter(
      (p) => p.locality?.toLowerCase().includes(loc) || p.city?.toLowerCase().includes(loc)
    );
    return matched.length > 0 ? matched.slice(0, 3) : properties.slice(0, 3);
  }, [properties, partner]);

  const [inputMessage, setInputMessage] = useState('');
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
  const [isPartnerOnline, setIsPartnerOnline] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Realtime subscription & presence
  useEffect(() => {
    if (!activeConvId) return;
    markConversationAsRead(activeConvId);

    const { unsubscribe: unsubMsg } = chatService.subscribeToMessages(
      activeConvId,
      (newMsg) => {
        addRealtimeMessage(activeConvId, newMsg);
        markConversationAsRead(activeConvId);
      }
    );

    const effectiveUserId = user?.id || 'me';
    const effectiveUserName = user?.name || 'You';
    const { unsubscribe: unsubPresence } = chatService.subscribeToPresence(
      activeConvId,
      {
        id: effectiveUserId,
        name: effectiveUserName,
        avatar: user?.avatar,
      },
      (presenceList) => {
        const otherPresent = presenceList.some((id) => id !== effectiveUserId);
        setIsPartnerOnline(otherPresent);
      }
    );

    return () => {
      unsubMsg();
      unsubPresence();
    };
  }, [activeConvId, user?.id]);

  // Convert live messages to ChatMessage format
  const chatMessages: ChatMessage[] = useMemo(() => {
    if (!conversation?.messages || conversation.messages.length === 0) {
      return [];
    }
    const effectiveUserId = user?.id || 'me';

    return conversation.messages
      .filter((m) => {
        if (m.deleted_for && Array.isArray(m.deleted_for) && m.deleted_for.includes(effectiveUserId)) {
          return false;
        }
        return true;
      })
      .map((m) => {
        const isMe = m.sender_id === user?.id || m.sender_id === 'me';
        const timeStr = m.created_at
          ? new Date(m.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })
          : 'Just now';

        const isProp = m.message_type === 'property' || Boolean(m.metadata?.property);
        const isVis = m.message_type === 'visit' || Boolean(m.metadata?.visit);
        const isExp = Boolean(m.metadata?.expense);

        return {
          id: m.id,
          senderId: isMe ? ('me' as const) : ('other' as const),
          text: m.text,
          time: timeStr,
          status: m.status || (m.is_read ? 'read' : 'delivered'),
          is_edited: m.is_edited,
          is_deleted: m.is_deleted,
          isPropertyCard: isProp,
          propertyData: m.metadata?.property
            ? {
                id: m.metadata.property.property_id || 'prop-1',
                title: m.metadata.property.title || 'Apartment',
                image:
                  m.metadata.property.image ||
                  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
                rent: m.metadata.property.rent || 30000,
                locality: m.metadata.property.locality || 'Mumbai',
                city: 'Mumbai',
                bhk: '2 BHK',
              }
            : undefined,
          isVisitCard: isVis,
          visitData: m.metadata?.visit
            ? {
                id: m.metadata.visit.property_id || 'visit-1',
                propertyTitle: m.metadata.visit.property_title || 'Apartment Tour',
                visitDate: m.metadata.visit.date || 'Tomorrow',
                visitTime: m.metadata.visit.time || '5:00 PM',
                location: m.metadata.visit.location || 'Mumbai',
                status: (m.metadata.visit.status as any) || 'pending',
              }
            : undefined,
          isExpenseCard: isExp,
          expenseData: m.metadata?.expense,
        };
      });
  }, [conversation?.messages, user?.id]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage.trim();
    if (!text) return;

    let targetConvId = conversation?.id;
    if (!targetConvId) {
      targetConvId = await startOrGetFlatmateConversation(partner);
    }

    sendRichMessage(targetConvId, {
      text,
      messageType: 'text',
    });

    setInputMessage('');
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSendSharedProperty = async (selectedProp?: any) => {
    setIsAttachmentModalOpen(false);
    let targetConvId = conversation?.id;
    if (!targetConvId) {
      targetConvId = await startOrGetFlatmateConversation(partner);
    }
    const propToShare = selectedProp || suggestedProperties[0] || properties[0];
    if (!propToShare) return;

    const coverImg =
      typeof propToShare.images?.[0] === 'string'
        ? propToShare.images[0]
        : (propToShare.images?.[0] as any)?.image_url ||
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400';

    sendRichMessage(targetConvId, {
      text: `Sharing property: ${propToShare.title}`,
      messageType: 'property',
      metadata: {
        property: {
          property_id: propToShare.id,
          title: propToShare.title,
          image: coverImg,
          rent: propToShare.rent,
          deposit: propToShare.deposit || propToShare.rent * 2,
          locality: propToShare.locality,
        },
      },
    });
    showToast('Apartment card shared in chat', 'success');
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSendVisitInvitation = async () => {
    setIsAttachmentModalOpen(false);
    let targetConvId = conversation?.id;
    if (!targetConvId) {
      targetConvId = await startOrGetFlatmateConversation(partner);
    }
    const prop = suggestedProperties[0] || properties[0];

    sendRichMessage(targetConvId, {
      text: `Let's schedule a site visit for ${prop?.title || 'this apartment'}!`,
      messageType: 'visit',
      metadata: {
        visit: {
          property_id: prop?.id || 'prop-1',
          property_title: prop?.title || 'Co-Living Tour',
          date: 'This Saturday',
          time: '11:00 AM',
          location: prop?.locality || partner.preferred_locations?.[0] || partner.locality || 'Mumbai',
          status: 'pending',
        },
      },
    });
    showToast('Visit invitation dispatched', 'success');
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSendSplitBill = async () => {
    setIsAttachmentModalOpen(false);
    let targetConvId = conversation?.id;
    if (!targetConvId) {
      targetConvId = await startOrGetFlatmateConversation(partner);
    }
    sendRichMessage(targetConvId, {
      text: '🧾 Monthly Co-Living Utilities Share: ₹3,200',
      messageType: 'text',
      metadata: {
        expense: {
          title: 'Monthly Co-Living Utilities Share',
          totalAmount: 6400,
          myShare: 3200,
          status: 'pending',
          items: [
            { label: 'High-Speed 300 Mbps WiFi', amount: 1200 },
            { label: 'Daily Cleaning & Maid Services', amount: 4000 },
            { label: 'Drinking Water Can Delivery', amount: 1200 },
          ],
        },
      },
    });
    showToast('Expense split shared in chat', 'success');
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSendWave = async () => {
    await sendFlatmateWave(
      partner.id,
      partner.name,
      partner.avatar || partner.photos?.[0],
      partner.preferred_locations?.[0] || partner.locality
    );
    showToast(`Waved at ${partner.name}! Chat unlocked.`, 'success');
  };

  return (
    <View style={styles.root}>
      {/* 1. Chat Room Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 14) + 6 }]}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Back to messages"
        >
          <ArrowLeft size={20} color="#0F172A" strokeWidth={2.4} />
        </Pressable>

        <Pressable
          style={styles.headerPartnerWrap}
          onPress={() => router.push(`/(renter)/flatmate/${partner.id}`)}
        >
          <View style={styles.headerAvatarWrap}>
            <Image
              source={{
                uri:
                  (partner.photos && partner.photos[0]) ||
                  partner.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
              }}
              style={styles.headerAvatar}
            />
            <View
              style={[
                styles.headerOnlineDot,
                !isPartnerOnline && { backgroundColor: '#94A3B8' },
              ]}
            />
          </View>

          <View style={styles.headerPartnerInfo}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={styles.headerPartnerName} numberOfLines={1}>
                {partner.name}
              </Text>
              {partner.is_kyc_verified && (
                <ShieldCheck size={14} color="#059669" strokeWidth={2.6} />
              )}
            </View>

            <View style={styles.headerScoreRow}>
              <Sparkles size={11} color="#059669" />
              <Text style={styles.headerScoreText}>{partner.match_score || 96}% Synergy</Text>
              <Text style={styles.headerActiveText}>· {isPartnerOnline ? 'Online' : 'Active recently'}</Text>
            </View>
          </View>
        </Pressable>

        {/* Right Action Icons */}
        <View style={styles.headerRightBtns}>
          <Pressable
            style={styles.headerActionBtn}
            onPress={() => showToast(`Starting voice call with ${partner.name}...`, 'info')}
            accessibilityRole="button"
            accessibilityLabel="Audio call"
          >
            <Phone size={18} color="#0F172A" strokeWidth={2.2} />
          </Pressable>

          <Pressable
            style={styles.headerActionBtn}
            onPress={() => showToast(`Starting video call with ${partner.name}...`, 'info')}
            accessibilityRole="button"
            accessibilityLabel="Video call"
          >
            <Video size={18} color="#0F172A" strokeWidth={2.2} />
          </Pressable>
        </View>
      </View>

      {/* 2. COMPATIBILITY SCORE BANNER */}
      <View style={styles.compatibilityBanner}>
        <View style={styles.compatTopRow}>
          <View style={styles.compatScoreBox}>
            <Sparkles size={13} color="#0F766E" strokeWidth={2.4} />
            <Text style={styles.compatScoreText}>{partner.match_score || 96}% Lifestyle Synergy</Text>
          </View>
          <Text style={styles.compatVerifiedText}>Verified Lifestyle Match</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.compatChipsRail}
        >
          <View style={styles.compatChip}>
            <IndianRupee size={11} color="#0F766E" />
            <Text style={styles.compatChipText}>
              Budget: Up to ₹{(partner.budget_max || 30000).toLocaleString('en-IN')}/mo
            </Text>
          </View>
          {partner.food_preference && (
            <View style={styles.compatChip}>
              <Text style={styles.compatChipText}>{partner.food_preference}</Text>
            </View>
          )}
          {partner.smoking && (
            <View style={styles.compatChip}>
              <Text style={styles.compatChipText}>{partner.smoking}</Text>
            </View>
          )}
          <View style={styles.compatChip}>
            <MapPin size={11} color="#0F766E" />
            <Text style={styles.compatChipText}>
              {partner.preferred_locations?.[0] || partner.locality || 'Mumbai'}
            </Text>
          </View>
        </ScrollView>
      </View>

      {/* 3. Messages Stream */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {/* APARTMENT SUGGESTIONS RAIL */}
          {suggestedProperties.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <View style={styles.suggestionsHeader}>
                <Building2 size={13} color="#0F766E" strokeWidth={2.4} />
                <Text style={styles.suggestionsTitle}>
                  Co-Living Apartments in {partner.preferred_locations?.[0] || partner.locality || 'Mumbai'}
                </Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.suggestionsRail}
              >
                {suggestedProperties.map((prop) => (
                  <Pressable
                    key={prop.id}
                    style={styles.suggestionCard}
                    onPress={() => handleSendSharedProperty(prop)}
                  >
                    <Image
                      source={{
                        uri:
                          typeof prop.images?.[0] === 'string'
                            ? prop.images[0]
                            : (prop.images?.[0] as any)?.image_url ||
                              'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
                      }}
                      style={styles.suggestionThumb}
                    />
                    <View style={styles.suggestionInfo}>
                      <Text style={styles.suggestionCardTitle} numberOfLines={1}>
                        {prop.title}
                      </Text>
                      <Text style={styles.suggestionCardRent}>
                        ₹{prop.rent?.toLocaleString('en-IN')}/mo
                      </Text>
                      <Text style={styles.suggestionCardAction}>+ Share to Chat</Text>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}

          {/* EMPTY CONVERSATION STATE */}
          {chatMessages.length === 0 && (
            <View style={styles.emptyFeedWrap}>
              <View style={styles.emptyCard}>
                <Image
                  source={{
                    uri:
                      (partner.photos && partner.photos[0]) ||
                      partner.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
                  }}
                  style={styles.emptyAvatar}
                />
                <Text style={styles.emptyTitle}>You're connected with {partner.name}!</Text>
                <Text style={styles.emptySub}>
                  {partner.match_score || 96}% Lifestyle & Habitation Compatibility. Direct encrypted chat with verified marketplace.
                </Text>
                <View style={styles.emptyActionRow}>
                  <Pressable
                    style={styles.emptyActionChip}
                    onPress={() => handleSendMessage('👋 Hi! Loved your profile, are you looking in Bandra?')}
                  >
                    <Text style={styles.emptyActionChipText}>Say Hello 👋</Text>
                  </Pressable>
                  <Pressable
                    style={styles.emptyActionChip}
                    onPress={() => handleSendSharedProperty()}
                  >
                    <Text style={styles.emptyActionChipText}>Suggest Apartment 🏢</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}

          {/* LIVE CHAT MESSAGES */}
          {chatMessages.map((msg) => {
            if (msg.senderId === 'system') {
              return (
                <View key={msg.id} style={styles.systemNoticeWrap}>
                  <Text style={styles.systemNoticeText}>{msg.text}</Text>
                </View>
              );
            }

            const isMe = msg.senderId === 'me';

            return (
              <View
                key={msg.id}
                style={[
                  styles.messageRow,
                  isMe ? styles.messageRowMe : styles.messageRowOther,
                ]}
              >
                {/* Embed Types */}
                {msg.isPropertyCard && msg.propertyData && (
                  <V4PropertyShareCard
                    property={msg.propertyData}
                    senderLabel={isMe ? 'You Shared' : `${partner.name.split(' ')[0]} Shared`}
                  />
                )}

                {msg.isVisitCard && msg.visitData && (
                  <V4VisitCard
                    visit={msg.visitData}
                    onAccept={() => showToast('Visit accepted and added to schedule.', 'success')}
                    onReschedule={() => showToast('Reschedule requested.', 'info')}
                    onDecline={() => showToast('Visit declined.', 'info')}
                  />
                )}

                {msg.isExpenseCard && msg.expenseData && (
                  <V4SplitExpenseCard
                    title={msg.expenseData.title}
                    totalAmount={msg.expenseData.totalAmount}
                    myShare={msg.expenseData.myShare}
                    items={msg.expenseData.items}
                    status={msg.expenseData.status}
                    onPay={() =>
                      showToast(
                        `Escrow payment of ₹${msg.expenseData?.myShare} processed!`,
                        'success'
                      )
                    }
                  />
                )}

                {/* Standard Text Bubble */}
                {msg.is_deleted ? (
                  <View
                    style={[
                      styles.textBubble,
                      isMe ? styles.textBubbleMe : styles.textBubbleOther,
                    ]}
                  >
                    <Text
                      style={[
                        styles.bubbleText,
                        { fontStyle: 'italic', color: isMe ? '#CCFBF1' : '#94A3B8' },
                      ]}
                    >
                      🚫 This message was deleted
                    </Text>
                    <View style={styles.bubbleFooter}>
                      <Text
                        style={[
                          styles.bubbleTime,
                          isMe ? styles.bubbleTimeMe : styles.bubbleTimeOther,
                        ]}
                      >
                        {msg.time}
                      </Text>
                    </View>
                  </View>
                ) : (
                  !!msg.text && (
                    <View
                      style={[
                        styles.textBubble,
                        isMe ? styles.textBubbleMe : styles.textBubbleOther,
                      ]}
                    >
                      <Text
                        style={[
                          styles.bubbleText,
                          isMe ? styles.bubbleTextMe : styles.bubbleTextOther,
                        ]}
                      >
                        {msg.text}
                      </Text>

                      <View style={styles.bubbleFooter}>
                        <Text
                          style={[
                            styles.bubbleTime,
                            isMe ? styles.bubbleTimeMe : styles.bubbleTimeOther,
                          ]}
                        >
                          {msg.time}{msg.is_edited ? ' • edited' : ''}
                        </Text>
                        {isMe && <CheckCheck size={13} color="#A7F3D0" strokeWidth={2.4} />}
                      </View>
                    </View>
                  )
                )}
              </View>
            );
          })}
        </ScrollView>

        {/* 4. Quick Reply Chips Rail */}
        <View style={styles.quickRepliesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickRepliesRail}
          >
            {QUICK_REPLIES.map((reply, idx) => (
              <Pressable
                key={idx}
                style={styles.quickReplyChip}
                onPress={() => handleSendMessage(reply)}
              >
                <Text style={styles.quickReplyText}>{reply}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* 5. Bottom Input Dock or Wave Lock Banner */}
        {!isWaved ? (
          <View
            style={[
              styles.waveLockDock,
              { paddingBottom: Math.max(insets.bottom, 12) + 6 },
            ]}
          >
            <View style={styles.waveLockHeaderRow}>
              <View style={styles.waveLockIconBox}>
                <Lock size={16} color="#0F766E" strokeWidth={2.4} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.waveLockTitle}>Wave to Unlock Chat</Text>
                <Text style={styles.waveLockSub}>
                  To maintain verified flatmate quality, introduce yourself with a Wave before direct messaging.
                </Text>
              </View>
            </View>
            <Pressable
              style={styles.waveActionBtn}
              onPress={handleSendWave}
              accessibilityRole="button"
              accessibilityLabel="Wave at flatmate"
            >
              <Text style={styles.waveActionBtnText}>👋 Send Wave to Connect</Text>
            </Pressable>
          </View>
        ) : (
          <View
            style={[
              styles.inputDock,
              { paddingBottom: Math.max(insets.bottom, 12) + 4 },
            ]}
          >
            {/* Plus / Attachments Button */}
            <Pressable
              style={styles.attachBtn}
              onPress={() => setIsAttachmentModalOpen(true)}
              accessibilityRole="button"
              accessibilityLabel="Open attachment options"
            >
              <Plus size={20} color="#059669" strokeWidth={2.6} />
            </Pressable>

            {/* Text Input */}
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textInput}
                placeholder="Type a message..."
                placeholderTextColor="#94A3B8"
                value={inputMessage}
                onChangeText={setInputMessage}
                multiline
                maxLength={1000}
              />
            </View>

            {/* Send / Mic Action */}
            {inputMessage.trim().length > 0 ? (
              <Pressable
                style={styles.sendBtn}
                onPress={() => handleSendMessage()}
                accessibilityRole="button"
                accessibilityLabel="Send message"
              >
                <Send size={18} color="#FFFFFF" strokeWidth={2.4} />
              </Pressable>
            ) : (
              <Pressable
                style={styles.micBtn}
                onPress={() => {
                  sendRichMessage(activeConvId, {
                    text: '🎙️ Voice Note (0:12)',
                    messageType: 'audio',
                    metadata: {
                      audio: { duration: '0:12' },
                    },
                  });
                  showToast('Voice note dispatched', 'success');
                }}
                accessibilityRole="button"
                accessibilityLabel="Record voice note"
              >
                <Mic size={20} color="#059669" strokeWidth={2.2} />
              </Pressable>
            )}
          </View>
        )}
      </KeyboardAvoidingView>

      {/* 6. Attachments Options Modal */}
      <Modal
        visible={isAttachmentModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsAttachmentModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Share into Roommate Chat</Text>
              <Pressable onPress={() => setIsAttachmentModalOpen(false)} hitSlop={8}>
                <X size={20} color="#0F172A" />
              </Pressable>
            </View>

            <View style={styles.modalGrid}>
              <Pressable style={styles.modalTile} onPress={() => handleSendSharedProperty()}>
                <View style={[styles.modalTileIcon, { backgroundColor: '#ECFDF5' }]}>
                  <Building2 size={24} color="#059669" strokeWidth={2.4} />
                </View>
                <Text style={styles.modalTileTitle}>Share Property</Text>
                <Text style={styles.modalTileSub}>Send apartment card</Text>
              </Pressable>

              <Pressable style={styles.modalTile} onPress={handleSendVisitInvitation}>
                <View style={[styles.modalTileIcon, { backgroundColor: '#F0FDFA' }]}>
                  <Calendar size={24} color="#0F766E" strokeWidth={2.4} />
                </View>
                <Text style={styles.modalTileTitle}>Schedule Visit</Text>
                <Text style={styles.modalTileSub}>Invite for site viewing</Text>
              </Pressable>

              <Pressable style={styles.modalTile} onPress={handleSendSplitBill}>
                <View style={[styles.modalTileIcon, { backgroundColor: '#FFFBEB' }]}>
                  <Receipt size={24} color="#D97706" strokeWidth={2.4} />
                </View>
                <Text style={styles.modalTileTitle}>Split Rent / Bill</Text>
                <Text style={styles.modalTileSub}>Calculate & escrow pay</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
    gap: 10,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerPartnerWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerAvatarWrap: {
    position: 'relative',
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
  },
  headerOnlineDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  headerPartnerInfo: {
    flex: 1,
    gap: 2,
  },
  headerPartnerName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  headerScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  headerScoreText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  headerActiveText: {
    fontSize: 11,
    color: '#64748B',
  },
  headerRightBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compatibilityBanner: {
    backgroundColor: '#F0FDFA',
    borderBottomWidth: 1,
    borderBottomColor: '#CCFBF1',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  compatTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  compatScoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compatScoreText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F766E',
  },
  compatVerifiedText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#047857',
  },
  compatChipsRail: {
    gap: 6,
  },
  compatChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  compatChipText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0F766E',
  },
  suggestionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  suggestionsTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  suggestionsRail: {
    gap: 10,
  },
  suggestionCard: {
    width: 140,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  suggestionThumb: {
    width: '100%',
    height: 70,
    backgroundColor: '#E2E8F0',
  },
  suggestionInfo: {
    padding: 6,
  },
  suggestionCardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  suggestionCardRent: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0F766E',
    marginTop: 2,
  },
  suggestionCardAction: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#0F766E',
    marginTop: 4,
  },
  emptyFeedWrap: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    width: '100%',
    maxWidth: 320,
  },
  emptyAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 17,
  },
  emptyActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  emptyActionChip: {
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  emptyActionChipText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F766E',
  },
  waveLockDock: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEF2F6',
    gap: 10,
  },
  waveLockHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  waveLockIconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveLockTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  waveLockSub: {
    fontSize: 11,
    color: '#64748B',
  },
  waveActionBtn: {
    backgroundColor: '#0F766E',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveActionBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  messagesList: {
    padding: 16,
    gap: 10,
  },
  systemNoticeWrap: {
    backgroundColor: '#F0FDFA',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignSelf: 'center',
    marginVertical: 4,
    maxWidth: '90%',
  },
  systemNoticeText: {
    fontSize: 11.5,
    color: '#0F766E',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
  },
  messageRow: {
    flexDirection: 'column',
    maxWidth: '82%',
  },
  messageRowMe: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  messageRowOther: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  textBubble: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 4,
  },
  textBubbleMe: {
    backgroundColor: '#059669',
    borderBottomRightRadius: 4,
  },
  textBubbleOther: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTextMe: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  bubbleTextOther: {
    color: '#0F172A',
    fontWeight: '500',
  },
  bubbleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 4,
  },
  bubbleTime: {
    fontSize: 10,
  },
  bubbleTimeMe: {
    color: '#D1FAE5',
  },
  bubbleTimeOther: {
    color: '#94A3B8',
  },
  quickRepliesContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#EEF2F6',
  },
  quickRepliesRail: {
    paddingHorizontal: 16,
    gap: 8,
  },
  quickReplyChip: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  quickReplyText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  inputDock: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEF2F6',
  },
  attachBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  inputBox: {
    flex: 1,
    minHeight: 42,
    maxHeight: 100,
    backgroundColor: '#F8FAFC',
    borderRadius: 21,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 14,
    color: '#0F172A',
    padding: 0,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 2,
  },
  micBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 27, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    gap: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  modalTile: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 12,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalTileIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTileTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  modalTileSub: {
    fontSize: 10.5,
    color: '#64748B',
    textAlign: 'center',
  },
});
