import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Share,
  Modal,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Sparkles,
  Send,
  Mic,
  Image as ImageIcon,
  Pin,
  Trash2,
  Plus,
  Search,
  Check,
  Copy,
  Globe,
  HelpCircle,
  X,
  History,
  TrendingDown,
  FileText,
  Truck,
  DollarSign,
  Building,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import {
  AIChatMessage,
  AIConversationRecord,
  Property,
  UserAIMemory,
} from '../../../types';
import {
  chatWithAI,
  saveAIMessageToSupabase,
  fetchAIConversationsFromSupabase,
} from '../../../services/rehvoAI';
import {
  PropertyCardEmbed,
  NegotiationCardEmbed,
  AgreementCardEmbed,
  ChecklistCardEmbed,
  WalletCardEmbed,
} from '../ai/V4AICardEmbeds';
import { V4VoiceAssistantModal } from '../ai/V4VoiceAssistantModal';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';

const SMART_PROMPT_CHIPS = [
  { label: '2BHK under ₹40k near BKC', prompt: 'Find me a 2BHK under ₹40k near BKC with parking' },
  { label: 'Negotiate Rent', prompt: 'Generate a polite WhatsApp message to negotiate rent with landlord' },
  { label: 'Is Rent Overpriced?', prompt: 'How do I know if my Mumbai apartment rent is overpriced?' },
  { label: 'Lease Agreement Review', prompt: 'Explain the standard leave and license lease clauses in Mumbai' },
  { label: 'Moving Checklist', prompt: 'Create my moving, packing, and utility transfer checklist' },
  { label: '30% Budget Plan', prompt: 'Plan my monthly living and rent budget for ₹1,20,000 salary' },
  { label: 'Pet Friendly Flats', prompt: 'What are the best pet-friendly societies in Mumbai?' },
  { label: 'Powai vs Bandra Commute', prompt: 'Compare commute and rental affordability between Powai and Bandra' },
];

export const V4AIChatScreen: React.FC = React.memo(() => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    prompt?: string;
    propertyId?: string;
    context?: string;
    locality?: string;
  }>();

  const properties = useAppStore((s) => s.properties);
  const currentUser = useAppStore((s) => s.user);

  // Active property context if arrived from property details
  const activePropertyContext = useMemo(() => {
    if (!params.propertyId) return undefined;
    return properties.find((p) => p.id === params.propertyId);
  }, [params.propertyId, properties]);

  // Personal AI Memory profile
  const userMemory: UserAIMemory = useMemo(() => ({
    monthlyIncome: 140000,
    targetRent: 45000,
    maxRent: 55000,
    targetDeposit: 90000,
    preferredLocalities: ['BKC', 'Bandra West', 'Powai', 'Lower Parel'],
    officeLocation: 'BKC',
    commuteMode: 'metro',
    lifestyle: ['Gym enthusiast', 'Cooks daily', 'Prefers high floor'],
  }), []);

  // Chat State
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome_1',
      conversationId: 'conv_default',
      sender: 'assistant',
      content: `👋 **Namaste! I am REHVO AI**, your personal Mumbai luxury rental concierge.

I can help you:
* 🏷️ **Negotiate rent** with landlords using data-backed comps
* 📜 **Review lease agreements** for hidden deductions
* 🔍 **Find verified verified listing homes** near your office
* 📦 **Plan your move-in** with custom packing checklists

Tap a prompt below or ask me anything!`,
      messageType: 'text',
      createdAt: new Date().toISOString(),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [conversations, setConversations] = useState<AIConversationRecord[]>([]);
  const [searchHistoryText, setSearchHistoryText] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  // Handle deep-link initial prompt
  useEffect(() => {
    if (params.prompt) {
      handleSend(params.prompt);
    }
    // Fetch conversations list
    fetchAIConversationsFromSupabase(currentUser?.id).then((convs) => {
      if (convs.length > 0) setConversations(convs);
    });
  }, [params.prompt]);

  const handleSend = useCallback(
    async (textToSend?: string) => {
      const text = (textToSend || inputText).trim();
      if (!text || isTyping) return;

      setInputText('');

      const userMsg: AIChatMessage = {
        id: `user_${Date.now()}`,
        conversationId: 'conv_default',
        sender: 'user',
        content: text,
        messageType: 'text',
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 80);

      // Placeholder streaming AI message
      const placeholderAiId = `ai_${Date.now()}`;
      const placeholderMsg: AIChatMessage = {
        id: placeholderAiId,
        conversationId: 'conv_default',
        sender: 'assistant',
        content: '',
        messageType: 'text',
        isStreaming: true,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, placeholderMsg]);

      try {
        const response = await chatWithAI({
          message: text,
          conversationId: 'conv_default',
          history: messages,
          propertyContext: activePropertyContext,
          userMemory,
          language,
          onToken: (token) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === placeholderAiId
                  ? { ...m, content: m.content + token }
                  : m
              )
            );
          },
        });

        // Replace placeholder with final verified response
        setMessages((prev) =>
          prev.map((m) =>
            m.id === placeholderAiId
              ? {
                  ...response.message,
                  id: placeholderAiId,
                  isStreaming: false,
                }
              : m
          )
        );

        // Save to Supabase asynchronously
        saveAIMessageToSupabase('conv_default', 'user', text);
        saveAIMessageToSupabase(
          'conv_default',
          'assistant',
          response.message.content,
          response.message.messageType,
          response.message.metadata
        );
      } catch {
        // Fallback message
        setMessages((prev) =>
          prev.map((m) =>
            m.id === placeholderAiId
              ? {
                  ...m,
                  content:
                    language === 'hi'
                      ? 'माफ़ कीजिए, कोई तकनीकी समस्या आई है। कृपया दोबारा पूछें।'
                      : 'I encountered a temporary connection issue. Please tap to retry.',
                  isStreaming: false,
                }
              : m
          )
        );
      } finally {
        setIsTyping(false);
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    },
    [inputText, isTyping, messages, activePropertyContext, userMemory, language]
  );

  const handleVoiceTranscript = (transcript: string, lang: 'en' | 'hi') => {
    setLanguage(lang);
    handleSend(transcript);
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        conversationId: `conv_${Date.now()}`,
        sender: 'assistant',
        content: `New session started. How can REHVO AI assist you today?`,
        messageType: 'text',
        createdAt: new Date().toISOString(),
      },
    ]);
    setIsHistoryDrawerOpen(false);
  };

  // Render Card Attachment depending on message metadata
  const renderCardEmbed = (msg: AIChatMessage) => {
    if (!msg.metadata) return null;
    const cardType = msg.metadata.cardType;
    const cardData = msg.metadata.cardData;

    if (cardType === 'property' && cardData) {
      return <PropertyCardEmbed property={cardData} />;
    }
    if (cardType === 'negotiation' && cardData) {
      return <NegotiationCardEmbed data={cardData} />;
    }
    if (cardType === 'agreement' && cardData) {
      return <AgreementCardEmbed data={cardData} />;
    }
    if (cardType === 'checklist' && cardData) {
      return <ChecklistCardEmbed data={cardData} />;
    }
    if (cardType === 'wallet' && cardData) {
      return <WalletCardEmbed data={cardData} />;
    }
    return null;
  };

  const renderMessageItem = ({ item }: { item: AIChatMessage }) => {
    const isUser = item.sender === 'user';

    return (
      <View
        style={[
          styles.messageRow,
          isUser ? styles.messageRowUser : styles.messageRowAssistant,
        ]}
      >
        {!isUser && (
          <View style={styles.assistantAvatar}>
            <Sparkles size={14} color="#FFFFFF" />
          </View>
        )}

        <View
          style={[
            styles.messageBubble,
            isUser ? styles.bubbleUser : styles.bubbleAssistant,
          ]}
        >
          {item.isStreaming && !item.content ? (
            <View style={styles.typingIndicatorRow}>
              <View style={[styles.typingDot, styles.dot1]} />
              <View style={[styles.typingDot, styles.dot2]} />
              <View style={[styles.typingDot, styles.dot3]} />
            </View>
          ) : (
            <Text
              style={[
                styles.messageText,
                isUser ? styles.messageTextUser : styles.messageTextAssistant,
              ]}
              selectable
            >
              {item.content}
            </Text>
          )}

          {/* Embedded Card (Property, Negotiation, Agreement, etc.) */}
          {renderCardEmbed(item)}

          {/* Assistant message action strip */}
          {!isUser && item.content.length > 0 && !item.isStreaming && (
            <View style={styles.messageFooterRow}>
              <Pressable
                style={styles.msgActionBtn}
                onPress={() => Share.share({ message: item.content })}
                hitSlop={8}
              >
                <Copy size={11} color="#94A3B8" />
                <Text style={styles.msgActionText}>Copy</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      {/* 1. TOP HEADER */}
      <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top, 14) + 4 }]}>
        <View style={styles.headerRow}>
          {/* Back button */}
          <Pressable style={styles.iconBtn} onPress={() => router.back()} hitSlop={8}>
            <ArrowLeft size={20} color="#0F172A" />
          </Pressable>

          {/* Title and Online Status */}
          <View style={styles.titleCol}>
            <View style={styles.titleBadgeRow}>
              <Text style={styles.screenTitle}>REHVO AI</Text>
              <View style={styles.gptPill}>
                <Sparkles size={10} color={V4_COLORS.primary} />
                <Text style={styles.gptPillText}>GPT-4o</Text>
              </View>
            </View>
            <View style={styles.onlineStatusRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Active • Direct Comps Engine</Text>
            </View>
          </View>

          {/* Right Header Actions */}
          <View style={styles.headerRightActions}>
            {/* Language toggle button */}
            <Pressable
              style={styles.langSwitchBtn}
              onPress={() => setLanguage((l) => (l === 'en' ? 'hi' : 'en'))}
              hitSlop={8}
            >
              <Globe size={13} color={V4_COLORS.primary} />
              <Text style={styles.langSwitchText}>{language === 'en' ? 'EN' : 'हिन्दी'}</Text>
            </Pressable>

            {/* Conversation History Drawer button */}
            <Pressable
              style={styles.iconBtn}
              onPress={() => setIsHistoryDrawerOpen(true)}
              hitSlop={8}
            >
              <History size={18} color="#475569" />
            </Pressable>

            {/* New Chat (+) */}
            <Pressable style={styles.iconBtn} onPress={handleNewChat} hitSlop={8}>
              <Plus size={20} color={V4_COLORS.primary} />
            </Pressable>
          </View>
        </View>

        {/* Active Property Banner (if chatting in property context) */}
        {activePropertyContext && (
          <View style={styles.propertyContextBanner}>
            <Building size={13} color={V4_COLORS.primary} />
            <Text style={styles.propertyContextText} numberOfLines={1}>
              Active Listing: {activePropertyContext.title} (₹{(activePropertyContext.rent || 0).toLocaleString('en-IN')})
            </Text>
          </View>
        )}
      </View>

      {/* 2. CHAT MESSAGES LIST */}
      <KeyboardAvoidingView
        style={styles.chatArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessageItem}
          contentContainerStyle={styles.messagesListContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{ height: 12 }} />}
        />

        {/* 3. SMART PROMPTS CAROUSEL */}
        <View style={styles.smartPromptsSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.promptsScroll}
          >
            {SMART_PROMPT_CHIPS.map((chip, idx) => (
              <Pressable
                key={idx}
                style={styles.promptChip}
                onPress={() => handleSend(chip.prompt)}
              >
                <Sparkles size={11} color={V4_COLORS.primary} />
                <Text style={styles.promptChipText}>{chip.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* 4. INPUT BAR */}
        <View style={[styles.inputBarContainer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <View style={styles.inputInner}>
            {/* Voice AI button */}
            <Pressable
              style={styles.micBtn}
              onPress={() => setIsVoiceModalOpen(true)}
              hitSlop={8}
            >
              <Mic size={18} color={V4_COLORS.primary} />
            </Pressable>

            {/* Multiline TextInput */}
            <TextInput
              style={styles.textInput}
              placeholder={
                language === 'hi'
                  ? 'किराया, एग्रीमेंट या इलाके के बारे में पूछें...'
                  : 'Ask about rent, agreement, BKC commute...'
              }
              placeholderTextColor="#94A3B8"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={1000}
              onSubmitEditing={() => handleSend()}
            />

            {/* Send button */}
            <Pressable
              style={[
                styles.sendBtn,
                !inputText.trim() && styles.sendBtnDisabled,
              ]}
              onPress={() => handleSend()}
              disabled={!inputText.trim() || isTyping}
            >
              {isTyping ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Send size={16} color="#FFFFFF" />
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* 5. VOICE MODAL */}
      <V4VoiceAssistantModal
        visible={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onTranscriptReady={(t, _l) => handleVoiceTranscript(t, _l === 'hi-IN' ? 'hi' : 'en')}
      />

      {/* 6. CONVERSATION HISTORY DRAWER / MODAL */}
      <Modal
        visible={isHistoryDrawerOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsHistoryDrawerOpen(false)}
      >
        <View style={styles.drawerBackdrop}>
          <View style={[styles.drawerCard, { paddingTop: Math.max(insets.top, 16) }]}>
            <View style={styles.drawerHeader}>
              <View style={styles.drawerTitleRow}>
                <History size={18} color={V4_COLORS.primary} />
                <Text style={styles.drawerTitle}>Saved & Recent Chats</Text>
              </View>
              <Pressable
                style={styles.drawerCloseBtn}
                onPress={() => setIsHistoryDrawerOpen(false)}
              >
                <X size={18} color="#64748B" />
              </Pressable>
            </View>

            {/* Search conversations */}
            <View style={styles.drawerSearchRow}>
              <Search size={14} color="#94A3B8" />
              <TextInput
                style={styles.drawerSearchInput}
                placeholder="Search conversations..."
                placeholderTextColor="#94A3B8"
                value={searchHistoryText}
                onChangeText={setSearchHistoryText}
              />
            </View>

            {/* New Conversation Button */}
            <Pressable style={styles.drawerNewChatBtn} onPress={handleNewChat}>
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.drawerNewChatText}>Start New AI Conversation</Text>
            </Pressable>

            {/* List of past conversations */}
            <ScrollView style={styles.drawerScroll} showsVerticalScrollIndicator={false}>
              {conversations.length > 0 ? (
                conversations
                  .filter((c) =>
                    !searchHistoryText ||
                    c.title.toLowerCase().includes(searchHistoryText.toLowerCase())
                  )
                  .map((conv) => (
                    <Pressable
                      key={conv.id}
                      style={styles.convItem}
                      onPress={() => {
                        setIsHistoryDrawerOpen(false);
                      }}
                    >
                      <View style={styles.convIcon}>
                        <FileText size={15} color={V4_COLORS.primary} />
                      </View>
                      <View style={styles.convInfo}>
                        <Text style={styles.convTitle} numberOfLines={1}>
                          {conv.title}
                        </Text>
                        <Text style={styles.convPreview} numberOfLines={1}>
                          {conv.last_message_preview || 'No preview'}
                        </Text>
                      </View>
                    </Pressable>
                  ))
              ) : (
                <View style={styles.emptyConvsBox}>
                  <HelpCircle size={28} color="#CBD5E1" />
                  <Text style={styles.emptyConvsText}>No previous chats saved</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingBottom: 10,
    ...V4_SHADOWS.card,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  titleCol: {
    flex: 1,
    marginLeft: 10,
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  screenTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  gptPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  gptPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: V4_COLORS.primary,
  },
  onlineStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 1,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },
  onlineText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  langSwitchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    minHeight: 44,
  },
  langSwitchText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: V4_COLORS.primary,
  },
  propertyContextBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDFA',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  propertyContextText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F766E',
    flex: 1,
  },
  chatArea: {
    flex: 1,
  },
  messagesListContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'flex-start',
    gap: 8,
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowAssistant: {
    justifyContent: 'flex-start',
  },
  assistantAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: V4_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  messageBubble: {
    maxWidth: '84%',
    borderRadius: 16,
    padding: 14,
  },
  bubbleUser: {
    backgroundColor: '#0F766E',
    borderBottomRightRadius: 4,
  },
  bubbleAssistant: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.card,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 21,
  },
  messageTextUser: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  messageTextAssistant: {
    color: '#0F172A',
    fontWeight: '400',
  },
  typingIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  typingDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: V4_COLORS.primary,
  },
  dot1: { opacity: 0.4 },
  dot2: { opacity: 0.7 },
  dot3: { opacity: 1.0 },
  messageFooterRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  msgActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minHeight: 44,
    paddingHorizontal: 4,
  },
  msgActionText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  smartPromptsSection: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingVertical: 8,
  },
  promptsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  promptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 44,
  },
  promptChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  inputBarContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  inputInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  micBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    maxHeight: 90,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: V4_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#CBD5E1',
  },
  drawerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(3, 27, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  drawerCard: {
    height: '75%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  drawerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  drawerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  drawerCloseBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  drawerSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  drawerSearchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
  },
  drawerNewChatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: V4_COLORS.primary,
    height: 48,
    borderRadius: 12,
    marginBottom: 14,
  },
  drawerNewChatText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  drawerScroll: {
    flex: 1,
  },
  convItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    minHeight: 52,
  },
  convIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  convInfo: {
    flex: 1,
  },
  convTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  convPreview: {
    fontSize: 11.5,
    color: '#64748B',
  },
  emptyConvsBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyConvsText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
  },
});
