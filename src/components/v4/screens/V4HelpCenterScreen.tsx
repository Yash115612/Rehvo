import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Headphones,
  MessageCircle,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  Search,
  X,
  Send,
  CheckCircle2,
  Clock,
  HelpCircle,
} from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4Button } from '../ui/V4Button';
import { useAppStore } from '../../../store/useAppStore';
import {
  createSupportTicket,
  getTicketMessages,
  sendSupportMessage,
} from '../../../services/supportService';
import { SupportTicketMessage } from '../../../types';

const FAQS = [
  {
    q: 'How does Verified Listing work on REHVO?',
    a: 'REHVO connects renters directly with DigiLocker verified property owners. There are zero broker commissions, hidden middleman fees, or listing charges for basic tenancies.',
  },
  {
    q: 'Is my Aadhaar and DigiLocker data secure?',
    a: 'Yes, 100%. REHVO integrates directly with UIDAI & Government DigiLocker APIs using 256-bit AES encryption. We never store raw Aadhaar numbers.',
  },
  {
    q: 'What happens if a property visit is cancelled?',
    a: 'You can reschedule or cancel visits anytime with 1 tap. Any token amount paid is 100% refundable instantly into your REHVO wallet or original bank account.',
  },
  {
    q: 'How do I earn 1% cashback on paying rent?',
    a: 'When you pay rent via UPI, NetBanking, or Credit Card on REHVO, 1% value is instantly credited as R-Cash into your wallet, redeemable for next month rent or utility bills.',
  },
  {
    q: 'How do landlords screen prospective tenants?',
    a: 'All seekers on REHVO pass Aadhaar e-KYC, workplace email check, and optional digital police verification before token confirmation.',
  },
  {
    q: 'How long does biometric lease registration take?',
    a: 'Once terms are signed digitally on REHVO, a government-authorized biometric executive arrives at your doorstep within 48 hours for thumb verification and e-stamp generation.',
  },
];

export const V4HelpCenterScreenComponent: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, showToast } = useAppStore();

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Ticket Modal State
  const [ticketModalVisible, setTicketModalVisible] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState<
    'rent_payment' | 'agreement' | 'visit' | 'flatmate' | 'kyc' | 'other'
  >('rent_payment');
  const [ticketMessage, setTicketMessage] = useState('');
  const [submittingTicket, setSubmittingTicket] = useState(false);

  // Active Chat Modal inside Ticket
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<SupportTicketMessage[]>([]);
  const [newChatText, setNewChatText] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return FAQS;
    const q = searchQuery.toLowerCase();
    return FAQS.filter(
      (f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleCreateTicket = useCallback(async () => {
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      showToast('Please provide a subject and description', 'error');
      return;
    }

    setSubmittingTicket(true);
    try {
      const res = await createSupportTicket({
        user_id: user?.id,
        subject: ticketSubject.trim(),
        category: ticketCategory,
        initialMessage: ticketMessage.trim(),
      });

      if (res.success && res.ticketId) {
        showToast('Support ticket created successfully', 'success');
        setActiveTicketId(res.ticketId);
        setTicketModalVisible(false);
        setTicketSubject('');
        setTicketMessage('');

        // Fetch messages for active ticket
        const msgs = await getTicketMessages(res.ticketId);
        setChatMessages(msgs);
      } else {
        showToast('Failed to create support ticket', 'error');
      }
    } catch {
      showToast('Error connecting to support gateway', 'error');
    } finally {
      setSubmittingTicket(false);
    }
  }, [ticketSubject, ticketMessage, ticketCategory, user?.id, showToast]);

  const handleSendChatMessage = useCallback(async () => {
    if (!activeTicketId || !newChatText.trim()) return;

    const text = newChatText.trim();
    setNewChatText('');
    setSendingMsg(true);

    const userMsg: SupportTicketMessage = {
      id: `local_${Date.now()}`,
      ticket_id: activeTicketId,
      sender_role: 'user',
      message: text,
      created_at: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, userMsg]);

    try {
      await sendSupportMessage(activeTicketId, text, user?.id);
    } catch {
      // safe fallback
    } finally {
      setSendingMsg(false);
    }
  }, [activeTicketId, newChatText, user?.id]);

  const handleWhatsApp = () => {
    Alert.alert('WhatsApp Support', 'Connecting you to REHVO VIP 24x7 Concierge on WhatsApp...');
  };

  const handleCall = () => {
    Alert.alert('Toll Free Call', 'Calling REHVO 24x7 Priority Desk: 1800-734-8669');
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={18} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
        </Pressable>
        <Text style={styles.headerTitle}>24x7 Support Center</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Live Support Card */}
        <View style={styles.supportHeroCard}>
          <View style={styles.supportBadge}>
            <Headphones size={13} color="#FFFFFF" strokeWidth={2.4} />
            <Text style={styles.supportBadgeText}>LIVE CONCIERGE</Text>
          </View>
          <Text style={styles.supportHeroTitle}>How can we help you today?</Text>
          <Text style={styles.supportHeroDesc}>
            Our Mumbai concierge team is active 24x7 for tenant questions, lease issues and visit scheduling.
          </Text>

          <View style={styles.channelsRow}>
            <Pressable style={styles.channelBtn} onPress={handleWhatsApp}>
              <MessageCircle size={16} color="#16A34A" strokeWidth={2.4} />
              <Text style={styles.channelBtnText}>WhatsApp Us</Text>
            </Pressable>

            <Pressable style={styles.channelBtn} onPress={handleCall}>
              <Phone size={16} color={V4_COLORS.primary} strokeWidth={2.4} />
              <Text style={styles.channelBtnText}>1800-REHVO</Text>
            </Pressable>
          </View>
        </View>

        {/* Contact Channels Grid */}
        <Text style={styles.sectionHeading}>DIRECT SUPPORT CHANNELS</Text>
        <View style={styles.grid2}>
          <Pressable
            style={styles.channelCard}
            onPress={() => setTicketModalVisible(true)}
            accessibilityRole="button"
          >
            <View style={[styles.channelIconBox, { backgroundColor: '#E6FFFA' }]}>
              <MessageCircle size={18} color={V4_COLORS.primary} strokeWidth={2.4} />
            </View>
            <Text style={styles.channelCardTitle}>Raise Ticket</Text>
            <Text style={styles.channelCardSub}>Dedicated Agent &lt; 5 mins</Text>
          </Pressable>

          <Pressable
            style={styles.channelCard}
            onPress={() => Alert.alert('Email Support Desk', 'Priority inbox: support@rehvo.in')}
            accessibilityRole="button"
          >
            <View style={[styles.channelIconBox, { backgroundColor: '#EEF2FF' }]}>
              <Mail size={18} color="#6366F1" strokeWidth={2.4} />
            </View>
            <Text style={styles.channelCardTitle}>Email Desk</Text>
            <Text style={styles.channelCardSub}>support@rehvo.in</Text>
          </Pressable>
        </View>

        {/* FAQ Search Bar */}
        <View style={styles.searchBar}>
          <Search size={18} color={V4_COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search FAQs, lease rules, token refund..."
            placeholderTextColor={V4_COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <X size={16} color={V4_COLORS.textMuted} />
            </Pressable>
          )}
        </View>

        {/* FAQs */}
        <Text style={styles.sectionHeading}>FREQUENTLY ASKED QUESTIONS ({filteredFaqs.length})</Text>
        <View style={styles.faqContainer}>
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            const isLast = idx === filteredFaqs.length - 1;
            return (
              <View key={idx} style={[styles.faqItem, !isLast && styles.faqBorder]}>
                <Pressable style={styles.faqQuestionRow} onPress={() => toggleFaq(idx)}>
                  <Text style={styles.faqQuestion}>{faq.q}</Text>
                  {isOpen ? (
                    <ChevronUp size={18} color={V4_COLORS.primary} strokeWidth={2.4} />
                  ) : (
                    <ChevronDown size={18} color={V4_COLORS.textMuted} strokeWidth={2.2} />
                  )}
                </Pressable>
                {isOpen && (
                  <View style={styles.faqAnswerBox}>
                    <Text style={styles.faqAnswer}>{faq.a}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Raise Ticket Button */}
        <V4Button
          title="Create New Support Ticket"
          variant="primary"
          size="lg"
          onPress={() => setTicketModalVisible(true)}
          style={styles.ticketBtn}
        />
      </ScrollView>

      {/* New Ticket Modal */}
      <Modal visible={ticketModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Support Ticket</Text>
              <Pressable
                style={styles.modalCloseBtn}
                onPress={() => setTicketModalVisible(false)}
              >
                <X size={20} color={V4_COLORS.textPrimary} />
              </Pressable>
            </View>

            <Text style={styles.inputLabel}>CATEGORY</Text>
            <View style={styles.categoryGrid}>
              {[
                { key: 'rent_payment', label: 'Rent / Pay' },
                { key: 'agreement', label: 'Lease & eSign' },
                { key: 'visit', label: 'Visit / Gatepass' },
                { key: 'kyc', label: 'Aadhaar / KYC' },
                { key: 'other', label: 'Other Issue' },
              ].map((c) => (
                <Pressable
                  key={c.key}
                  style={[
                    styles.categoryPill,
                    ticketCategory === c.key && styles.categoryPillActive,
                  ]}
                  onPress={() => setTicketCategory(c.key as any)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      ticketCategory === c.key && styles.categoryTextActive,
                    ]}
                  >
                    {c.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.inputLabel}>SUBJECT</Text>
            <TextInput
              style={styles.ticketInput}
              value={ticketSubject}
              onChangeText={setTicketSubject}
              placeholder="e.g. Rent payment confirmation delayed"
              placeholderTextColor={V4_COLORS.textMuted}
            />

            <Text style={styles.inputLabel}>DESCRIPTION</Text>
            <TextInput
              style={[styles.ticketInput, { height: 90, textAlignVertical: 'top' }]}
              value={ticketMessage}
              onChangeText={setTicketMessage}
              placeholder="Explain what happened. Include transaction or property details..."
              placeholderTextColor={V4_COLORS.textMuted}
              multiline
            />

            <View style={styles.modalActions}>
              <Pressable
                style={styles.cancelBtn}
                onPress={() => setTicketModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[styles.submitBtn, submittingTicket && styles.submitBtnDisabled]}
                onPress={handleCreateTicket}
                disabled={submittingTicket}
              >
                {submittingTicket ? (
                  <ActivityIndicator size="small" color={V4_COLORS.textWhite} />
                ) : (
                  <Text style={styles.submitBtnText}>Submit Ticket</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Realtime Ticket Chat Modal */}
      {activeTicketId && (
        <Modal visible={true} transparent={false} animationType="slide">
          <View style={[styles.chatModalContainer, { paddingTop: insets.top }]}>
            <View style={styles.chatModalHeader}>
              <Pressable
                style={styles.backBtn}
                onPress={() => setActiveTicketId(null)}
              >
                <ArrowLeft size={18} color={V4_COLORS.textPrimary} />
              </Pressable>
              <View style={styles.chatTitleContainer}>
                <Text style={styles.chatTicketTitle}>Support Ticket #{activeTicketId.slice(-6)}</Text>
                <Text style={styles.chatTicketSub}>REHVO Priority Desk • Connected</Text>
              </View>
              <View style={styles.onlineBadge}>
                <Text style={styles.onlineBadgeText}>LIVE</Text>
              </View>
            </View>

            <ScrollView
              style={styles.chatScroll}
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
            >
              {chatMessages.map((msg) => {
                const isUser = msg.sender_role === 'user';
                return (
                  <View
                    key={msg.id}
                    style={[
                      styles.bubbleWrapper,
                      isUser ? styles.bubbleUserWrapper : styles.bubbleAgentWrapper,
                    ]}
                  >
                    <View
                      style={[
                        styles.chatBubble,
                        isUser ? styles.bubbleUser : styles.bubbleAgent,
                      ]}
                    >
                      <Text
                        style={[
                          styles.chatBubbleText,
                          isUser ? styles.bubbleUserText : styles.bubbleAgentText,
                        ]}
                      >
                        {msg.message}
                      </Text>
                      <Text
                        style={[
                          styles.bubbleTime,
                          isUser ? styles.bubbleUserTime : styles.bubbleAgentTime,
                        ]}
                      >
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            <View style={[styles.chatInputRow, { paddingBottom: insets.bottom + 8 }]}>
              <TextInput
                style={styles.chatTextInput}
                placeholder="Type your message..."
                placeholderTextColor={V4_COLORS.textMuted}
                value={newChatText}
                onChangeText={setNewChatText}
              />
              <Pressable
                style={[styles.chatSendBtn, !newChatText.trim() && styles.chatSendBtnDisabled]}
                onPress={handleSendChatMessage}
                disabled={!newChatText.trim() || sendingMsg}
              >
                <Send size={18} color={V4_COLORS.textWhite} />
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export const V4HelpCenterScreen = React.memo(V4HelpCenterScreenComponent);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: V4_COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: V4_COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: V4_COLORS.border,
    ...V4_SHADOWS.sm,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: V4_RADIUS.full,
    backgroundColor: V4_COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  supportHeroCard: {
    backgroundColor: V4_COLORS.emerald,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    ...V4_SHADOWS.md,
  },
  supportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 10,
  },
  supportBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginLeft: 4,
  },
  supportHeroTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  supportHeroDesc: {
    color: 'rgba(255, 255, 255, 0.88)',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
    marginBottom: 16,
  },
  channelsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  channelBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    backgroundColor: V4_COLORS.surface,
    borderRadius: V4_RADIUS.md,
    gap: 6,
  },
  channelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: V4_COLORS.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 4,
  },
  grid2: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  channelCard: {
    flex: 1,
    minHeight: 84,
    backgroundColor: V4_COLORS.surface,
    borderRadius: V4_RADIUS.lg,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    padding: 14,
    ...V4_SHADOWS.sm,
  },
  channelIconBox: {
    width: 38,
    height: 38,
    borderRadius: V4_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  channelCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  channelCardSub: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
    marginTop: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 46,
    backgroundColor: V4_COLORS.surface,
    borderRadius: V4_RADIUS.lg,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    paddingHorizontal: 14,
    marginBottom: 20,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: V4_COLORS.textPrimary,
  },
  faqContainer: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: V4_RADIUS.lg,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    marginBottom: 20,
    ...V4_SHADOWS.sm,
  },
  faqItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  faqBorder: {
    borderBottomWidth: 1,
    borderBottomColor: V4_COLORS.borderLight,
  },
  faqQuestionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 44,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: V4_COLORS.textPrimary,
    marginRight: 10,
  },
  faqAnswerBox: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: V4_COLORS.borderLight,
  },
  faqAnswer: {
    fontSize: 13,
    color: V4_COLORS.textSecondary,
    lineHeight: 18,
  },
  ticketBtn: {
    minHeight: 48,
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: V4_RADIUS.xl,
    padding: 20,
    ...V4_SHADOWS.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  modalCloseBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: V4_RADIUS.full,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: V4_COLORS.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: V4_RADIUS.md,
    backgroundColor: V4_COLORS.surfaceSubtle,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
  },
  categoryPillActive: {
    backgroundColor: V4_COLORS.primaryLight,
    borderColor: V4_COLORS.primary,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: V4_COLORS.textSecondary,
  },
  categoryTextActive: {
    color: V4_COLORS.primary,
    fontWeight: '700',
  },
  ticketInput: {
    minHeight: 46,
    backgroundColor: V4_COLORS.surfaceSubtle,
    borderRadius: V4_RADIUS.md,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: V4_COLORS.textPrimary,
    marginBottom: 14,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    minHeight: 48,
    borderRadius: V4_RADIUS.md,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: V4_COLORS.textSecondary,
  },
  submitBtn: {
    flex: 2,
    minHeight: 48,
    borderRadius: V4_RADIUS.md,
    backgroundColor: V4_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: V4_COLORS.textWhite,
  },
  chatModalContainer: {
    flex: 1,
    backgroundColor: V4_COLORS.background,
  },
  chatModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: V4_COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: V4_COLORS.border,
  },
  chatTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  chatTicketTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  chatTicketSub: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
  },
  onlineBadge: {
    backgroundColor: V4_COLORS.successLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: V4_RADIUS.sm,
  },
  onlineBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: V4_COLORS.success,
  },
  chatScroll: {
    flex: 1,
  },
  bubbleWrapper: {
    marginVertical: 6,
    maxWidth: '82%',
  },
  bubbleUserWrapper: {
    alignSelf: 'flex-end',
  },
  bubbleAgentWrapper: {
    alignSelf: 'flex-start',
  },
  chatBubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: V4_RADIUS.lg,
  },
  bubbleUser: {
    backgroundColor: V4_COLORS.primary,
    borderBottomRightRadius: 2,
  },
  bubbleAgent: {
    backgroundColor: V4_COLORS.surface,
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
  },
  chatBubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleUserText: {
    color: V4_COLORS.textWhite,
  },
  bubbleAgentText: {
    color: V4_COLORS.textPrimary,
  },
  bubbleTime: {
    fontSize: 9,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  bubbleUserTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  bubbleAgentTime: {
    color: V4_COLORS.textMuted,
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: V4_COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: V4_COLORS.border,
    gap: 10,
  },
  chatTextInput: {
    flex: 1,
    minHeight: 46,
    backgroundColor: V4_COLORS.surfaceSubtle,
    borderRadius: V4_RADIUS.full,
    paddingHorizontal: 16,
    fontSize: 14,
    color: V4_COLORS.textPrimary,
  },
  chatSendBtn: {
    width: 46,
    height: 46,
    borderRadius: V4_RADIUS.full,
    backgroundColor: V4_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatSendBtnDisabled: {
    opacity: 0.5,
  },
});
