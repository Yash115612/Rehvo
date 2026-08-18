import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TextInput,
  Pressable,
  Image,
  StyleSheet,
  Linking,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  ShieldCheck,
  MapPin,
  CalendarDays,
  MessageCircle,
  Phone,
  Send,
  MoreVertical,
  CheckCircle2,
  XCircle,
} from 'lucide-react-native';
import { Enquiry, Property } from '../../../types';
import { useAppStore } from '../../../store/useAppStore';

interface OwnerEnquiryDetailsModalProps {
  enquiry: Enquiry | null;
  property: Property | null;
  visible: boolean;
  onClose: () => void;
  onViewProperty: (prop: Property) => void;
  onScheduleVisit: (enquiry: Enquiry) => void;
}

const QUICK_REPLIES = [
  'Yes, the property is available.',
  'When would you like to visit?',
  'Would you like to schedule a visit this weekend?',
];

export const OwnerEnquiryDetailsModal: React.FC<
  OwnerEnquiryDetailsModalProps
> = ({
  enquiry,
  property,
  visible,
  onClose,
  onViewProperty,
  onScheduleVisit,
}) => {
  const insets = useSafeAreaInsets();
  const { updateEnquiryStatus, showToast } = useAppStore();

  const [replyText, setReplyText] = useState('');
  const [messages, setMessages] = useState<
    Array<{ id: string; sender: 'renter' | 'owner'; text: string; time: string }>
  >([]);

  React.useEffect(() => {
    if (enquiry) {
      setMessages([
        {
          id: 'msg_initial',
          sender: 'renter',
          text: enquiry.message,
          time: '10:42 AM',
        },
      ]);
      // If NEW, update to CONTACTED after opening
      if (enquiry.status === 'NEW') {
        updateEnquiryStatus(enquiry.id, 'CONTACTED');
      }
    }
  }, [enquiry]);

  if (!enquiry) return null;

  const avatarUri =
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';

  const coverImage =
    property?.images?.find((img) => img.is_cover)?.url ||
    property?.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80';

  const handleSendReply = (textToSend?: string) => {
    const text = textToSend || replyText;
    if (!text.trim()) return;

    const newMsg = {
      id: `owner_msg_${Date.now()}`,
      sender: 'owner' as const,
      text: text.trim(),
      time: 'Just now',
    };

    setMessages((prev) => [...prev, newMsg]);
    setReplyText('');
    updateEnquiryStatus(enquiry.id, 'CONTACTED');
    showToast('Reply sent to renter', 'success');
  };

  const handleWhatsApp = () => {
    const rawPhone = enquiry.renter_phone.replace(/\D/g, '') || '919876543210';
    const message = `Hi ${enquiry.renter_name}, I saw your REHVO enquiry for "${enquiry.property_title}". Are you free for a quick chat?`;
    const url = `https://wa.me/${rawPhone}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {});
  };

  const handleCall = () => {
    Linking.openURL(`tel:${enquiry.renter_phone}`).catch(() => {});
  };

  const handleCloseEnquiry = () => {
    updateEnquiryStatus(enquiry.id, 'CLOSED');
    showToast('Enquiry marked as closed.', 'info');
  };

  const topInset = Math.max(insets.top, Platform.OS === 'ios' ? 44 : 24);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.modalRoot}>
        {/* 1. Dedicated Header Bar with Safe Area Top Inset */}
        <View style={[styles.headerContainer, { paddingTop: topInset }]}>
          <View style={styles.headerRow}>
            <Pressable
              style={styles.backBtn}
              onPress={onClose}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Back to enquiries"
            >
              <ArrowLeft size={21} color="#171522" strokeWidth={2.2} />
            </Pressable>

            <View style={styles.headerTitleWrap}>
              <Text style={styles.headerTitle}>Enquiry Details</Text>
              <Text style={styles.headerSubtitle} numberOfLines={1}>
                {enquiry.renter_name}
              </Text>
            </View>

            <Pressable
              style={styles.closeBtn}
              onPress={handleCloseEnquiry}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Close enquiry"
            >
              <XCircle size={21} color="#777482" strokeWidth={1.8} />
            </Pressable>
          </View>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* 2. Renter Profile Card */}
            <View style={styles.renterCard}>
              <Image source={{ uri: avatarUri }} style={styles.renterAvatar} />
              <View style={styles.renterInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.renterName}>{enquiry.renter_name}</Text>
                  <View style={styles.verifiedBadge}>
                    <ShieldCheck size={12} color="#32B768" strokeWidth={2.5} />
                    <Text style={styles.verifiedText}>Verified Renter</Text>
                  </View>
                </View>
                <Text style={styles.contactSub}>{enquiry.renter_phone}</Text>
              </View>

              {/* Direct Actions */}
              <View style={styles.contactActions}>
                <Pressable
                  style={styles.iconBtn}
                  onPress={handleWhatsApp}
                  accessibilityRole="button"
                  accessibilityLabel="WhatsApp renter"
                >
                  <MessageCircle size={18} color="#6C4DFF" strokeWidth={2.2} />
                </Pressable>
                <Pressable
                  style={styles.iconBtn}
                  onPress={handleCall}
                  accessibilityRole="button"
                  accessibilityLabel="Call renter"
                >
                  <Phone size={18} color="#32B768" strokeWidth={2.2} />
                </Pressable>
              </View>
            </View>

            {/* 3. Property Context Card */}
            <Pressable
              style={styles.propertyCard}
              onPress={() => {
                if (property) onViewProperty(property);
              }}
              accessibilityRole="button"
              accessibilityLabel="View property details"
            >
              <Image source={{ uri: coverImage }} style={styles.propThumb} />
              <View style={styles.propInfo}>
                <Text style={styles.propTitle} numberOfLines={1}>
                  {enquiry.property_title}
                </Text>
                <View style={styles.locRow}>
                  <MapPin size={11} color="#777482" strokeWidth={2} />
                  <Text style={styles.locText}>
                    {property?.locality || 'Andheri West, Mumbai'}
                  </Text>
                </View>
                {property && (
                  <Text style={styles.rentText}>
                    ₹{property.rent.toLocaleString('en-IN')} / mo
                  </Text>
                )}
              </View>
            </Pressable>

            {/* 4. Action Banner: Schedule Visit */}
            <Pressable
              style={styles.scheduleBanner}
              onPress={() => onScheduleVisit(enquiry)}
              accessibilityRole="button"
              accessibilityLabel="Schedule physical visit with renter"
            >
              <View style={styles.scheduleIconWrap}>
                <CalendarDays size={18} color="#6C4DFF" strokeWidth={2.2} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.scheduleTitle}>Schedule a Visit</Text>
                <Text style={styles.scheduleSub}>
                  Set a date & time slot for {enquiry.renter_name}
                </Text>
              </View>
              <View style={styles.scheduleActionPill}>
                <Text style={styles.scheduleActionText}>Schedule</Text>
              </View>
            </Pressable>

            {/* 5. Messages Timeline */}
            <View style={styles.timelineSection}>
              <Text style={styles.sectionLabel}>Messages</Text>
              {messages.map((m) => {
                const isOwner = m.sender === 'owner';
                return (
                  <View
                    key={m.id}
                    style={[
                      styles.msgBubble,
                      isOwner ? styles.ownerBubble : styles.renterBubble,
                    ]}
                  >
                    <Text
                      style={[
                        styles.msgText,
                        isOwner ? styles.ownerMsgText : styles.renterMsgText,
                      ]}
                    >
                      {m.text}
                    </Text>
                    <Text
                      style={[
                        styles.msgTime,
                        isOwner ? styles.ownerMsgTime : styles.renterMsgTime,
                      ]}
                    >
                      {m.time}
                    </Text>
                  </View>
                );
              })}
            </View>
          </ScrollView>

          {/* 6. Quick Replies & Composer */}
          <View style={styles.composerWrapper}>
            {/* Quick Reply Pills */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickRepliesScroll}
            >
              {QUICK_REPLIES.map((qr, idx) => (
                <Pressable
                  key={idx}
                  style={styles.quickPill}
                  onPress={() => handleSendReply(qr)}
                >
                  <Text style={styles.quickPillText}>{qr}</Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Input Row */}
            <View style={styles.inputRow}>
              <TextInput
                value={replyText}
                onChangeText={setReplyText}
                placeholder="Write a reply..."
                placeholderTextColor="#8C8994"
                style={styles.textInput}
              />
              <Pressable
                style={[
                  styles.sendBtn,
                  !replyText.trim() && styles.sendBtnDisabled,
                ]}
                onPress={() => handleSendReply()}
                disabled={!replyText.trim()}
                accessibilityRole="button"
                accessibilityLabel="Send reply"
              >
                <Send size={18} color="#FFFFFF" strokeWidth={2.2} />
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    backgroundColor: '#F8F7F4',
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E5EC',
  },
  headerRow: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    gap: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F7F5F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#777482',
    fontWeight: '600',
    marginTop: 1,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F7F5F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  renterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 14,
    gap: 12,
  },
  renterAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8E5EC',
  },
  renterInfo: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  renterName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#171522',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#EAF8F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifiedText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#32B768',
  },
  contactSub: {
    fontSize: 12,
    color: '#777482',
    fontWeight: '500',
  },
  contactActions: {
    flexDirection: 'row',
    gap: 6,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F7F5F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  propertyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 12,
    gap: 12,
  },
  propThumb: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#E8E5EC',
  },
  propInfo: {
    flex: 1,
    gap: 2,
  },
  propTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#171522',
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  locText: {
    fontSize: 12,
    color: '#777482',
    fontWeight: '500',
  },
  rentText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#6C4DFF',
    marginTop: 1,
  },
  scheduleBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F0ECFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#DED6FD',
  },
  scheduleIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171522',
  },
  scheduleSub: {
    fontSize: 11.5,
    color: '#777482',
    marginTop: 1,
  },
  scheduleActionPill: {
    backgroundColor: '#6C4DFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  scheduleActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  timelineSection: {
    gap: 8,
    marginTop: 6,
  },
  sectionLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#777482',
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
  msgBubble: {
    maxWidth: '82%',
    padding: 12,
    borderRadius: 16,
    gap: 4,
  },
  renterBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    borderBottomLeftRadius: 4,
  },
  ownerBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#6C4DFF',
    borderBottomRightRadius: 4,
  },
  msgText: {
    fontSize: 13.5,
    lineHeight: 19,
  },
  renterMsgText: {
    color: '#171522',
    fontWeight: '500',
  },
  ownerMsgText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  msgTime: {
    fontSize: 10.5,
    alignSelf: 'flex-end',
  },
  renterMsgTime: {
    color: '#777482',
  },
  ownerMsgTime: {
    color: '#ECE7FF',
  },
  composerWrapper: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E5EC',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    gap: 8,
  },
  quickRepliesScroll: {
    gap: 8,
    paddingBottom: 4,
  },
  quickPill: {
    backgroundColor: '#F7F5F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E5EC',
  },
  quickPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#171522',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textInput: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F7F5F0',
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#171522',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6C4DFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#C5B7FD',
  },
});
