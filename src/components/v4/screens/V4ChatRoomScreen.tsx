import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Linking,
  Alert,
  TextInput,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  ShieldCheck,
  Building2,
  Calendar,
  IndianRupee,
  FileText,
  Clock,
  X,
  Lock,
  Flag,
  UserX,
  BellOff,
  Archive,
  Send,
  ChevronDown,
  Image as ImageIcon,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import { V4_COLORS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4ChatBubble, V4ChatMessage } from '../ui/V4ChatBubble';
import { V4ChatInput } from '../chat/V4ChatInput';
import { V4ChatAttachmentsModal } from '../chat/V4ChatAttachmentsModal';
import { V4MessageReactionModal } from '../chat/V4MessageReactionModal';
import { V4MessageMenu } from '../chat/V4MessageMenu';
import { V4ConversationMediaModal } from '../chat/V4ConversationMediaModal';
import { V4TypingIndicator } from '../chat/V4TypingIndicator';
import { V4AuthGate } from '../ui/V4AuthGate';
import { Message, ChatReplyTo } from '../../../types';
import * as chatService from '../../../services/chat';

const QUICK_REPLIES = [
  '📅 Schedule Visit',
  '💰 Make Rent Offer',
  '📍 Society Location',
  '📄 Lease Agreement',
];

export const V4ChatRoomScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const {
    user,
    conversations,
    isAuthenticated,
    fetchMessages,
    sendRichMessage,
    toggleMessageReaction,
    markConversationAsRead,
    setTyping,
    addRealtimeMessage,
    toggleArchiveConversation,
    toggleMuteConversation,
    blockUser,
    deleteMessage,
    deleteMessageForEveryone,
    editMessage,
    uploadChatAttachment,
    bookPropertyVisit,
    showToast,
    starMessage,
    unstarMessage,
  } = useAppStore();

  const activeId = id || 'conv-1';
  const scrollViewRef = useRef<ScrollView>(null);

  // Find active conversation from store
  const conversation = useMemo(() => {
    return (
      (conversations || []).find((c) => c.id === activeId) ||
      (conversations || [])[0]
    );
  }, [conversations, activeId]);

  // Modals
  const [isAttachmentsModalOpen, setIsAttachmentsModalOpen] = useState(false);
  const [isReactionModalOpen, setIsReactionModalOpen] = useState(false);
  const [isMessageMenuOpen, setIsMessageMenuOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  // Form Inputs
  const [selectedVisitDate, setSelectedVisitDate] = useState('Tomorrow');
  const [selectedVisitSlot, setSelectedVisitSlot] = useState('5:00 PM');
  const [offerRentAmount, setOfferRentAmount] = useState(
    conversation?.property_rent?.toString() || '75000'
  );

  // Reply & Pin state
  const [replyTo, setReplyTo] = useState<ChatReplyTo | null>(null);
  const [isPropertyContextPinned, setIsPropertyContextPinned] = useState(true);

  // Presence & Typing state
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const [isOtherUserOnline, setIsOtherUserOnline] = useState(false);

  // 1. Realtime message subscription, typing & presence
  useEffect(() => {
    if (!conversation?.id) return;

    // Fetch messages from Supabase
    fetchMessages?.(conversation.id);

    // Mark as read immediately on open
    markConversationAsRead(conversation.id);

    // Subscribe to new messages from Supabase Realtime
    const { unsubscribe: unsubMsg } = chatService.subscribeToMessages(
      conversation.id,
      (newMsg) => {
        addRealtimeMessage(conversation.id, newMsg);
        markConversationAsRead(conversation.id);
      }
    );


    // Subscribe to typing updates
    const { unsubscribe: unsubTyping } = chatService.subscribeToTyping(
      conversation.id,
      (typingUsers) => {
        const otherTyping = typingUsers.some(
          (u) => u.userId !== user?.id && u.isTyping
        );
        setIsOtherUserTyping(otherTyping);
      }
    );

    // Subscribe to presence
    const effectiveUserId = user?.id || 'me';
    const effectiveUserName = user?.name || 'You';
    const { unsubscribe: unsubPresence } = chatService.subscribeToPresence(
      conversation.id,
      {
        id: effectiveUserId,
        name: effectiveUserName,
        avatar: user?.avatar,
      },
      (presenceList) => {
        const otherPresent = presenceList.some((id) => id !== effectiveUserId);
        setIsOtherUserOnline(otherPresent);
      }
    );

    return () => {
      unsubMsg();
      unsubTyping();
      unsubPresence();
    };
  }, [conversation?.id, user?.id]);

  if (!isAuthenticated) {
    return (
      <View style={[styles.root, { paddingTop: Math.max(insets.top, 12) }]}>
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) + 4 }]}>
          <View style={styles.headerRow}>
            <Pressable style={styles.backBtn} onPress={() => router.back()}>
              <ArrowLeft size={18} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
            </Pressable>
            <View style={styles.headerTextCol}>
              <Text style={styles.headerName}>Encrypted Conversation</Text>
            </View>
          </View>
        </View>

        <V4AuthGate
          title="Sign in to View Messages"
          description="Sign in to send and receive messages from verified property owners and flatmates."
          featureName="Private Chat"
          badgeText="ENCRYPTED CHAT"
          benefits={[
            'Verified direct chat with verified owners',
            'Receive and accept incoming waves from potential flatmates',
            'Coordinate property visit schedules and video tours',
            'Instant real-time message delivery',
          ]}
          fullScreen={false}
        />
      </View>
    );
  }

  // Convert conversation messages to V4ChatMessage
  const chatMessages: V4ChatMessage[] = useMemo(() => {
    if (!conversation?.messages) return [];
    const effectiveUserId = user?.id || 'me';

    return conversation.messages
      .filter((m) => {
        if (m.deleted_for && Array.isArray(m.deleted_for) && m.deleted_for.includes(effectiveUserId)) {
          return false;
        }
        return true;
      })
      .map((m) => {
        const isMe =
          m.sender_id === user?.id ||
          m.sender_id === 'renter-user-1' ||
          m.sender_id === 'user' ||
          m.sender_id === 'me';

        const timeStr = m.created_at
          ? new Date(m.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })
          : 'Just now';

        return {
          id: m.id,
          text: m.text,
          senderId: m.sender_id,
          senderName: m.sender_name,
          senderAvatar: m.sender_avatar,
          isMe,
          time: timeStr,
          createdAt: m.created_at,
          status: m.status || (m.is_read ? 'read' : 'delivered'),
          imageUrl: m.image_url,
          videoUrl: m.video_url,
          audioUrl: m.audio_url,
          isStarred: m.is_starred,
          documentUrl: m.document_url,
          documentName: m.document_name,
          messageType: m.message_type,
          metadata: m.metadata,
          reply_to: m.reply_to,
          reactions: m.reactions,
          is_edited: m.is_edited,
          edited_at: m.edited_at,
          is_deleted: m.is_deleted,
          isEdited: m.is_edited,
          isDeleted: m.is_deleted,
        };
      });
  }, [conversation?.messages, user?.id]);

  const getFormattedDateSeparator = (dateStr?: string): string => {
    if (!dateStr) return 'Today';
    const date = new Date(dateStr);
    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday) return 'Today';

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    if (isYesterday) return 'Yesterday';

    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };


  // Message Send Handlers
  const handleSendText = (text: string) => {
    if (!conversation) return;
    sendRichMessage(conversation.id, {
      text,
      messageType: 'text',
      replyToId: replyTo?.id,
    });
    setReplyTo(null);
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    // Support concierge auto response
    if (conversation.type === 'support') {
      setTimeout(() => {
        sendRichMessage(conversation.id, {
          text: `Thank you for contacting REHVO Priority Concierge! We've received your message and an executive is reviewing it now.`,
          messageType: 'text',
        });
      }, 1500);
    }
  };

  const handleSendVisitRequest = () => {
    if (!conversation) return;
    sendRichMessage(conversation.id, {
      text: `Hi ${conversation.other_user_name}, I would like to schedule a physical site visit on ${selectedVisitDate} at ${selectedVisitSlot}.`,
      messageType: 'visit',
      metadata: {
        visit: {
          property_id: conversation.property_id,
          property_title: conversation.property_title,
          date: selectedVisitDate,
          time: selectedVisitSlot,
          location: conversation.property_locality || 'Property Location',
          status: 'requested',
        },
      },
    });
    setIsVisitModalOpen(false);
    showToast?.('Visit request dispatched to owner', 'success');
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleSendRentOffer = () => {
    if (!conversation) return;
    const rentNum = parseInt(offerRentAmount) || conversation.property_rent || 75000;
    sendRichMessage(conversation.id, {
      text: `Hi ${conversation.other_user_name}, I am submitting a digital rental offer of ₹${rentNum.toLocaleString('en-IN')}/month with standard security deposit.`,
      messageType: 'text',
      metadata: {
        rent_reminder: {
          amount: rentNum,
          due_date: '1st of every month',
          month_year: 'Offer Draft',
          status: 'pending',
          upi_autopay: true,
        },
      },
    });
    setIsOfferModalOpen(false);
    showToast?.('Rental offer dispatched to owner', 'success');
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleShareProperty = () => {
    if (!conversation) return;
    sendRichMessage(conversation.id, {
      text: `Sharing property details for ${conversation.property_title}.`,
      messageType: 'property',
      metadata: {
        property: {
          property_id: conversation.property_id || 'prop-1',
          title: conversation.property_title || 'Luxury Apartment',
          image: conversation.property_image || '',
          rent: conversation.property_rent || 75000,
          deposit: (conversation.property_rent || 75000) * 2,
          locality: conversation.property_locality || 'Mumbai',
        },
      },
    });
    showToast?.('Property card shared in chat', 'success');
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handlePickCamera = async () => {
    setIsAttachmentsModalOpen(false);
    if (!conversation) return;
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera permission is required to capture photos.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });
      if (!result.canceled && result.assets?.[0]?.uri) {
        showToast?.('Uploading photo...', 'info');
        const uploadRes = await uploadChatAttachment(result.assets[0].uri);
        const photoUrl = uploadRes?.data || result.assets[0].uri;
        sendRichMessage(conversation.id, {
          text: '📷 Photo',
          messageType: 'image',
          imageUrl: photoUrl,
        });
        showToast?.('Photo sent', 'success');
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
      }
    } catch (_) {
      showToast?.('Failed to capture photo', 'error');
    }
  };

  const handlePickGallery = async () => {
    setIsAttachmentsModalOpen(false);
    if (!conversation) return;
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Media library access is required to select photos.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });
      if (!result.canceled && result.assets?.[0]?.uri) {
        showToast?.('Uploading photo...', 'info');
        const uploadRes = await uploadChatAttachment(result.assets[0].uri);
        const photoUrl = uploadRes?.data || result.assets[0].uri;
        sendRichMessage(conversation.id, {
          text: '📷 Photo',
          messageType: 'image',
          imageUrl: photoUrl,
        });
        showToast?.('Photo sent', 'success');
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
      }
    } catch (_) {
      showToast?.('Failed to select photo', 'error');
    }
  };

  const handlePickVideo = async () => {
    setIsAttachmentsModalOpen(false);
    if (!conversation) return;
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Media library access is required to select videos.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
      });
      if (!result.canceled && result.assets?.[0]?.uri) {
        showToast?.('Uploading video walkthrough...', 'info');
        const uploadRes = await uploadChatAttachment(result.assets[0].uri);
        const vidUrl = uploadRes?.data || result.assets[0].uri;
        sendRichMessage(conversation.id, {
          text: '📹 Video Tour',
          messageType: 'video',
          videoUrl: vidUrl,
        });
        showToast?.('Video sent', 'success');
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
      }
    } catch (_) {
      showToast?.('Failed to select video', 'error');
    }
  };

  const handleSendDocument = () => {
    setIsAttachmentsModalOpen(false);
    if (!conversation) return;
    sendRichMessage(conversation.id, {
      text: '📄 Document: Tenant_Verification_KYC.pdf',
      messageType: 'document',
      documentUrl: 'https://assets.rehvo.com/documents/Tenant_Verification_KYC.pdf',
      documentName: 'Tenant_Verification_KYC.pdf',
    });
    showToast?.('Document attached', 'success');
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleShareLocation = () => {
    setIsAttachmentsModalOpen(false);
    if (!conversation) return;
    const locName = conversation.property_locality || conversation.property_title || 'Prime City Location';
    sendRichMessage(conversation.id, {
      text: `📍 Location: ${locName}`,
      messageType: 'location',
      metadata: {
        location: {
          latitude: 19.0760,
          longitude: 72.8777,
          name: locName,
          address: `${locName}, Mumbai, Maharashtra`,
        },
      },
    });
    showToast?.('Location shared', 'success');
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleSendVoiceNote = (durationSeconds: number = 14) => {
    setIsAttachmentsModalOpen(false);
    if (!conversation) return;
    const m = Math.floor(durationSeconds / 60);
    const s = durationSeconds % 60;
    const durStr = `${m}:${s < 10 ? '0' : ''}${s}`;

    sendRichMessage(conversation.id, {
      text: `🎙️ Voice Note (${durStr})`,
      messageType: 'audio',
      metadata: {
        audio: {
          duration: durStr,
          durationSeconds,
        },
      },
    });
    showToast?.('Voice note dispatched', 'success');
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleCopyMessage = (txt: string) => {
    if (typeof navigator !== 'undefined' && (navigator as any).clipboard?.writeText) {
      (navigator as any).clipboard.writeText(txt).catch(() => {});
    }
    showToast?.('Message copied to clipboard', 'success');
  };

  const handleDeleteMessage = (msgId: string) => {
    if (!conversation) return;
    deleteMessage(conversation.id, msgId);
  };

  const handleDeleteForEveryone = (msgId: string) => {
    if (!conversation) return;
    deleteMessageForEveryone(conversation.id, msgId);
  };

  const handleEditMessage = (msg: Message) => {
    setEditingMessage(msg);
  };

  const handleAcceptVisit = (msg: V4ChatMessage) => {
    if (!conversation) return;
    if (conversation.property_id) {
      bookPropertyVisit({
        property_id: conversation.property_id,
        property_title: conversation.property_title || 'Verified Property',
        property_locality: conversation.property_locality || 'Prime Location',
        host_name: conversation.other_user_name || 'Verified Owner',
        visit_date: msg.metadata?.visit?.date || 'Tomorrow',
        time_slot: msg.metadata?.visit?.time || '5:00 PM',
        status: 'confirmed',
        qr_code_payload: `REHVO-VT-${Date.now().toString().slice(-6)}`,
      });
    }
    sendRichMessage(conversation.id, {
      text: `✓ Visit for ${msg.metadata?.visit?.date || 'Tomorrow'} at ${msg.metadata?.visit?.time || '5:00 PM'} confirmed! QR Entry Pass generated.`,
      messageType: 'visit',
      metadata: {
        visit: {
          property_id: conversation.property_id,
          property_title: conversation.property_title,
          date: msg.metadata?.visit?.date || 'Tomorrow',
          time: msg.metadata?.visit?.time || '5:00 PM',
          location: conversation.property_locality || 'Property Location',
          status: 'confirmed',
          visit_id: `VT-${Date.now().toString().slice(-6)}`,
        },
      },
    });
    showToast?.('Visit confirmed! QR Pass generated', 'success');
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };

  if (!conversation) {
    return (
      <View style={styles.root}>
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 14) }]}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={18} color="#0F172A" />
          </Pressable>
          <Text style={styles.headerTitle}>Conversation</Text>
        </View>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>Conversation not found.</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {/* 1. TOP HEADER */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        <View style={styles.headerRow}>
          {/* Back Action */}
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={18} color="#0F172A" strokeWidth={2.4} />
          </Pressable>

          {/* User Info Block */}
          <Pressable
            style={styles.headerUserCol}
            onPress={() => setIsMediaModalOpen(true)}
          >
            <View style={styles.headerAvatarWrap}>
              <Image
                source={{
                  uri:
                    conversation.other_user_avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
                }}
                style={styles.headerAvatar}
              />
              <View
                style={[
                  styles.headerOnlineDot,
                  !(isOtherUserOnline || conversation.is_online) && { backgroundColor: '#94A3B8' },
                ]}
              />
            </View>

            <View style={styles.headerTextCol}>
              <View style={styles.headerNameRow}>
                <Text style={styles.headerName} numberOfLines={1}>
                  {conversation.other_user_name}
                </Text>
                {conversation.is_verified && (
                  <ShieldCheck size={13} color="#16A34A" strokeWidth={2.6} style={{ marginLeft: 3 }} />
                )}
              </View>
              <Text
                style={[
                  styles.headerRole,
                  (isOtherUserTyping || isOtherUserOnline) && { color: '#0F766E', fontWeight: '700' },
                ]}
                numberOfLines={1}
              >
                {isOtherUserTyping
                  ? 'typing...'
                  : isOtherUserOnline
                  ? '● Online'
                  : conversation.type === 'support'
                  ? '24x7 PRIORITY CONCIERGE'
                  : conversation.other_user_role === 'OWNER'
                  ? 'DIRECT OWNER • VERIFIED LISTING'
                  : 'VERIFIED USER'}
              </Text>
            </View>
          </Pressable>

          {/* Action Buttons: Phone, Video, More */}
          <View style={styles.headerActions}>
            <Pressable
              style={styles.headerActionBtn}
              onPress={() => setIsCallModalOpen(true)}
              accessibilityLabel="Masked phone call"
            >
              <Phone size={16} color="#0F766E" strokeWidth={2.4} />
            </Pressable>

            <Pressable
              style={[styles.headerActionBtn, styles.headerActionBtnPrimary]}
              onPress={() => setIsVisitModalOpen(true)}
              accessibilityLabel="Book Site Visit"
            >
              <Calendar size={15} color="#FFFFFF" strokeWidth={2.4} />
            </Pressable>

            <Pressable
              style={styles.headerActionBtn}
              onPress={() => setIsMoreMenuOpen(true)}
              accessibilityLabel="More options"
            >
              <MoreVertical size={16} color="#475569" />
            </Pressable>
          </View>
        </View>

        {/* 2. PINNED PROPERTY CONTEXT BAR */}
        {conversation.property_title && isPropertyContextPinned && (
          <View style={styles.pinnedPropertyBar}>
            {conversation.property_image && (
              <Image source={{ uri: conversation.property_image }} style={styles.pinnedImage} />
            )}
            <View style={styles.pinnedTextCol}>
              <Text style={styles.pinnedTitle} numberOfLines={1}>
                {conversation.property_title}
              </Text>
              <Text style={styles.pinnedPrice}>
                {conversation.property_rent ? `₹${conversation.property_rent.toLocaleString('en-IN')}/mo` : ''} •{' '}
                <Text style={{ color: '#16A34A', fontWeight: '700' }}>Verified Listing</Text>
              </Text>
            </View>

            <Pressable
              style={styles.pinnedBookBtn}
              onPress={() => setIsVisitModalOpen(true)}
            >
              <Text style={styles.pinnedBookBtnText}>Book Visit</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* 3. CHAT FEED SCROLL */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatScroll}
        contentContainerStyle={[styles.chatContent, { paddingBottom: 16 }]}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
        onScroll={(e) => {
          const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
          const paddingToBottom = 150;
          const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
          setShowScrollBottom(!isCloseToBottom);
        }}
        scrollEventThrottle={16}
      >
        {chatMessages.map((msg, idx) => {
          const prevMsg = idx > 0 ? chatMessages[idx - 1] : null;
          const currentDateLabel = getFormattedDateSeparator(msg.createdAt);
          const prevDateLabel = prevMsg ? getFormattedDateSeparator(prevMsg.createdAt) : null;
          const showDateSeparator = idx === 0 || currentDateLabel !== prevDateLabel;

          return (
            <React.Fragment key={msg.id}>
              {showDateSeparator && (
                <View style={styles.dateSeparatorRow}>
                  <View style={styles.dateSeparatorPill}>
                    <Text style={styles.dateSeparatorText}>{currentDateLabel}</Text>
                  </View>
                </View>
              )}
              <V4ChatBubble
                message={msg}
                onReactionPress={(m, emoji) => {
                  const fullMsg = conversation.messages?.find((item) => item.id === m.id) || null;
                  setSelectedMessage(fullMsg);
                  if (emoji) {
                    toggleMessageReaction(conversation.id, m.id, emoji);
                  } else {
                    setIsMessageMenuOpen(true);
                  }
                }}
                onLongPress={(m) => {
                  const fullMsg = conversation.messages?.find((item) => item.id === m.id) || null;
                  setSelectedMessage(fullMsg);
                  setIsMessageMenuOpen(true);
                }}
                onVisitCardPress={() => setIsVisitModalOpen(true)}
                onAcceptVisit={handleAcceptVisit}
                onOfferCardPress={() => setIsOfferModalOpen(true)}
                onAgreementCardPress={() => {
                  Alert.alert(
                    'Digital Lease Review',
                    'This agreement has been digitally stamped. Would you like to review the 11-month lease clauses and Aadhaar e-Sign?',
                    [
                      { text: 'Later', style: 'cancel' },
                      {
                        text: 'Review & Sign',
                        onPress: () => router.push('/(renter)/rental-agreements' as any),
                      },
                    ]
                  );
                }}
                onRentReminderPress={() => {
                  Alert.alert(
                    'Instant Rent AutoPay',
                    'Pay monthly rent with 0% transaction fee via UPI AutoPay or NetBanking.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Pay via UPI',
                        onPress: () => router.push('/(renter)/pay-rent' as any),
                      },
                    ]
                  );
                }}
              />
            </React.Fragment>
          );
        })}


        {/* Live Typing Indicator */}
        {isOtherUserTyping && (
          <V4TypingIndicator userName={conversation.other_user_name} />
        )}
      </ScrollView>

      {/* 4. QUICK REPLIES CHIPS */}
      <View style={styles.quickChipsWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickChipsScroll}
        >
          {QUICK_REPLIES.map((chip, idx) => (
            <Pressable
              key={idx}
              style={styles.quickChip}
              onPress={() => {
                if (chip.includes('Visit')) setIsVisitModalOpen(true);
                else if (chip.includes('Offer')) setIsOfferModalOpen(true);
                else handleSendText(chip);
              }}
            >
              <Text style={styles.quickChipText}>{chip}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* 5. CHAT INPUT BAR */}
      <V4ChatInput
        onSend={handleSendText}
        onOpenAttachments={() => setIsAttachmentsModalOpen(true)}
        onVoicePress={() => handleSendVoiceNote(14)}
        onSendVoiceNote={(dur) => handleSendVoiceNote(dur)}
        onTyping={(isTyping) => setTyping(conversation.id, isTyping)}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
        editingMessage={editingMessage}
        onCancelEdit={() => setEditingMessage(null)}
        onSaveEdit={(messageId, newText) => {
          editMessage(conversation.id, messageId, newText);
          setEditingMessage(null);
        }}
        paddingBottom={Math.max(insets.bottom, 12)}
      />

      {/* 6. ATTACHMENTS MODAL */}
      <V4ChatAttachmentsModal
        visible={isAttachmentsModalOpen}
        onClose={() => setIsAttachmentsModalOpen(false)}
        onSelectCamera={handlePickCamera}
        onSelectGallery={handlePickGallery}
        onSelectProperty={handleShareProperty}
        onSelectVisit={() => {
          setIsAttachmentsModalOpen(false);
          setIsVisitModalOpen(true);
        }}
        onSelectAgreement={() => {
          setIsAttachmentsModalOpen(false);
          showToast?.('Digital agreements are dispatched by property owners.', 'info');
        }}
        onSelectRentReminder={() => {
          setIsAttachmentsModalOpen(false);
          setIsOfferModalOpen(true);
        }}
        onSelectVideo={handlePickVideo}
        onSelectDocument={handleSendDocument}
        onSelectLocation={handleShareLocation}
        onSelectVoiceNote={() => handleSendVoiceNote(14)}
      />

      {/* 7. MESSAGE ACTION MENU (Long Press / WhatsApp Style) */}
      <V4MessageMenu
        visible={isMessageMenuOpen}
        message={selectedMessage}
        isMe={
          selectedMessage?.sender_id === user?.id ||
          selectedMessage?.sender_id === 'renter-user-1' ||
          selectedMessage?.sender_id === 'user' ||
          selectedMessage?.sender_id === 'me'
        }
        isStarred={selectedMessage?.is_starred}
        onClose={() => {
          setIsMessageMenuOpen(false);
          setSelectedMessage(null);
        }}
        onReply={(msg) => {
          setReplyTo({
            id: msg.id,
            sender_name: msg.sender_name || 'Contact',
            text: msg.text,
          });
          setIsMessageMenuOpen(false);
          setSelectedMessage(null);
        }}
        onCopy={(txt) => {
          handleCopyMessage(txt);
          setIsMessageMenuOpen(false);
          setSelectedMessage(null);
        }}
        onStar={(msg) => {
          if (!conversation) return;
          if (msg.is_starred) {
            unstarMessage(conversation.id, msg.id);
            showToast?.('Message unstarred', 'info');
          } else {
            starMessage(conversation.id, msg.id);
            showToast?.('Message starred', 'success');
          }
          setIsMessageMenuOpen(false);
          setSelectedMessage(null);
        }}
        onForward={(msg) => {
          showToast?.('Forwarding link ready', 'info');
          setIsMessageMenuOpen(false);
          setSelectedMessage(null);
        }}
        onEdit={(msg) => {
          handleEditMessage(msg);
          setIsMessageMenuOpen(false);
          setSelectedMessage(null);
        }}
        onDeleteForMe={(msg) => {
          handleDeleteMessage(msg.id);
          setIsMessageMenuOpen(false);
          setSelectedMessage(null);
        }}
        onDeleteForEveryone={(msg) => {
          handleDeleteForEveryone(msg.id);
          setIsMessageMenuOpen(false);
          setSelectedMessage(null);
        }}
        onReact={(msg, emoji) => {
          if (conversation) {
            toggleMessageReaction(conversation.id, msg.id, emoji);
          }
          setIsMessageMenuOpen(false);
          setSelectedMessage(null);
        }}
      />

      {/* 8. SCHEDULE VISIT MODAL */}
      <Modal visible={isVisitModalOpen} transparent animationType="slide">
        <Pressable style={styles.modalBackdrop} onPress={() => setIsVisitModalOpen(false)}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Schedule Site Visit</Text>
              <Pressable onPress={() => setIsVisitModalOpen(false)}>
                <X size={18} color="#0F172A" />
              </Pressable>
            </View>

            <Text style={styles.modalSub}>Select your preferred day for visiting:</Text>
            <View style={styles.pillRow}>
              {['Today', 'Tomorrow', 'This Saturday', 'This Sunday'].map((d) => (
                <Pressable
                  key={d}
                  style={[styles.modalPill, selectedVisitDate === d && styles.modalPillActive]}
                  onPress={() => setSelectedVisitDate(d)}
                >
                  <Text
                    style={[styles.modalPillText, selectedVisitDate === d && styles.modalPillTextActive]}
                  >
                    {d}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={[styles.modalSub, { marginTop: 12 }]}>Select time slot:</Text>
            <View style={styles.pillRow}>
              {['11:00 AM', '2:00 PM', '5:00 PM', '7:00 PM'].map((s) => (
                <Pressable
                  key={s}
                  style={[styles.modalPill, selectedVisitSlot === s && styles.modalPillActive]}
                  onPress={() => setSelectedVisitSlot(s)}
                >
                  <Text
                    style={[styles.modalPillText, selectedVisitSlot === s && styles.modalPillTextActive]}
                  >
                    {s}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable style={styles.modalSubmitBtn} onPress={handleSendVisitRequest}>
              <Calendar size={16} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.modalSubmitBtnText}>Dispatch Visit Request</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* 9. MAKE RENTAL OFFER MODAL */}
      <Modal visible={isOfferModalOpen} transparent animationType="slide">
        <Pressable style={styles.modalBackdrop} onPress={() => setIsOfferModalOpen(false)}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Submit Rental Offer</Text>
              <Pressable onPress={() => setIsOfferModalOpen(false)}>
                <X size={18} color="#0F172A" />
              </Pressable>
            </View>

            <Text style={styles.modalSub}>Proposed Monthly Rent (₹):</Text>
            <View style={styles.rentInputBox}>
              <IndianRupee size={18} color="#0F766E" />
              <TextInput
                value={offerRentAmount}
                onChangeText={setOfferRentAmount}
                keyboardType="numeric"
                style={styles.rentTextInput}
              />
            </View>

            <View style={styles.escrowNoticeBox}>
              <Lock size={14} color="#0F766E" />
              <Text style={styles.escrowNoticeText}>
                Includes ₹10,000 security token refundable within 24 hours if offer is declined.
              </Text>
            </View>

            <Pressable style={styles.modalSubmitBtn} onPress={handleSendRentOffer}>
              <IndianRupee size={16} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.modalSubmitBtnText}>Dispatch Official Offer</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* 10. CALL OWNER MODAL */}
      <Modal visible={isCallModalOpen} transparent animationType="fade">
        <Pressable style={styles.modalBackdrop} onPress={() => setIsCallModalOpen(false)}>
          <View style={[styles.modalSheet, { padding: 20 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Connect with Landlord</Text>
              <Pressable onPress={() => setIsCallModalOpen(false)}>
                <X size={18} color="#0F172A" />
              </Pressable>
            </View>

            <Text style={styles.modalSub}>
              For privacy and safety, phone numbers are masked through REHVO's secure privacy bridge.
            </Text>

            <Pressable
              style={styles.modalSubmitBtn}
              onPress={() => {
                setIsCallModalOpen(false);
                Linking.openURL('tel:+919820012345');
              }}
            >
              <Phone size={16} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.modalSubmitBtnText}>Call Masked Number (+91 98200 ...)</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* 11. MORE MENU MODAL */}
      <Modal visible={isMoreMenuOpen} transparent animationType="fade">
        <Pressable style={styles.modalBackdrop} onPress={() => setIsMoreMenuOpen(false)}>
          <View style={styles.menuSheet}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>{conversation.other_user_name}</Text>
              <Pressable onPress={() => setIsMoreMenuOpen(false)}>
                <X size={16} color="#64748B" />
              </Pressable>
            </View>

            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setIsMoreMenuOpen(false);
                setIsMediaModalOpen(true);
              }}
            >
              <ImageIcon size={16} color="#0F766E" strokeWidth={2.4} />
              <Text style={styles.menuItemText}>Media, Links & Docs</Text>
            </Pressable>

            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setIsMoreMenuOpen(false);
                if (conversation.property_id) {
                  router.push(`/(renter)/property/${conversation.property_id}` as any);
                }
              }}
            >
              <Building2 size={16} color="#0F766E" strokeWidth={2.4} />
              <Text style={styles.menuItemText}>View Property Listing</Text>
            </Pressable>

            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setIsMoreMenuOpen(false);
                toggleMuteConversation(conversation.id);
                showToast?.('Notification preferences updated', 'info');
              }}
            >
              <BellOff size={16} color="#475569" strokeWidth={2.4} />
              <Text style={styles.menuItemText}>
                {conversation.is_muted ? 'Unmute Notifications' : 'Mute Notifications'}
              </Text>
            </Pressable>

            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setIsMoreMenuOpen(false);
                toggleArchiveConversation(conversation.id);
                showToast?.('Conversation archived', 'info');
                router.back();
              }}
            >
              <Archive size={16} color="#475569" strokeWidth={2.4} />
              <Text style={styles.menuItemText}>Archive Conversation</Text>
            </Pressable>

            <Pressable
              style={[styles.menuItem, { borderBottomWidth: 0 }]}
              onPress={() => {
                setIsMoreMenuOpen(false);
                Alert.alert(
                  'Block & Report Contact',
                  'Are you sure you want to block this contact? They will no longer be able to message you.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Block & Report',
                      style: 'destructive',
                      onPress: () => {
                        blockUser(conversation.other_user_id || 'user');
                        showToast?.('Contact blocked and reported', 'success');
                        router.back();
                      },
                    },
                  ]
                );
              }}
            >
              <UserX size={16} color="#DC2626" strokeWidth={2.4} />
              <Text style={[styles.menuItemText, { color: '#DC2626' }]}>Block & Report Spam</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* 12. CONVERSATION MEDIA GALLERY MODAL */}
      {conversation && (
        <V4ConversationMediaModal
          visible={isMediaModalOpen}
          conversation={conversation}
          messages={conversation.messages || []}
          onClose={() => setIsMediaModalOpen(false)}
        />
      )}

      {/* 13. SCROLL TO BOTTOM FAB */}
      {showScrollBottom && (
        <Pressable
          style={styles.scrollToBottomFab}
          onPress={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Scroll to bottom"
        >
          <ChevronDown size={20} color="#0F766E" strokeWidth={2.4} />
        </Pressable>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollToBottomFab: {
    position: 'absolute',
    bottom: 96,
    right: 18,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    ...V4_SHADOWS.card,
    zIndex: 25,
  },
  root: {
    flex: 1,
    backgroundColor: '#FAF8F5', // Warm Ivory Canvas
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    ...V4_SHADOWS.soft,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerUserCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  headerAvatarWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    position: 'relative',
  },
  headerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E2E8F0',
  },
  headerOnlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#16A34A',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  headerTextCol: {
    marginLeft: 10,
    flex: 1,
  },
  headerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerName: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerRole: {
    fontSize: 10.5,
    color: '#0F766E',
    fontWeight: '700',
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerActionBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  headerActionBtnPrimary: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  pinnedPropertyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  pinnedImage: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
  },
  pinnedTextCol: {
    flex: 1,
    marginLeft: 10,
  },
  pinnedTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  pinnedPrice: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  pinnedBookBtn: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  pinnedBookBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    paddingTop: 12,
  },
  quickChipsWrap: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingVertical: 6,
  },
  quickChipsScroll: {
    paddingHorizontal: 14,
    gap: 8,
  },
  quickChip: {
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  quickChipText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F766E',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 18,
    paddingBottom: 32,
    ...V4_SHADOWS.floating,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSub: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 10,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modalPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  modalPillActive: {
    backgroundColor: '#0F766E',
  },
  modalPillText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
  },
  modalPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  modalSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 18,
    backgroundColor: '#0F766E',
    borderRadius: 12,
    paddingVertical: 12,
  },
  modalSubmitBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  rentInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 48,
  },
  rentTextInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  escrowNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDFA',
    borderRadius: 10,
    padding: 10,
    marginTop: 12,
  },
  escrowNoticeText: {
    fontSize: 11.5,
    color: '#0F766E',
    fontWeight: '600',
    flex: 1,
  },
  menuSheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 40,
    ...V4_SHADOWS.floating,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuItemText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#334155',
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginLeft: 10,
  },
  dateSeparatorRow: {
    alignItems: 'center',
    marginVertical: 12,
  },
  dateSeparatorPill: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dateSeparatorText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
});

