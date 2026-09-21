import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Search,
  MessageSquare,
  Sparkles,
  X,
  Archive,
  ArrowRight,
  Headphones,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import { V4_COLORS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4ConversationCard } from '../chat/V4ConversationCard';
import { V4AuthGate } from '../ui/V4AuthGate';
import { V4EmptyState } from '../ui/V4EmptyState';
import * as chatService from '../../../services/chat';
import { triggerHaptic } from '../../../utils/haptics';

const FILTER_TABS = ['All', 'Owners', 'Flatmates', 'Support', 'Archived'] as const;
type FilterTab = typeof FILTER_TABS[number];

export const V4ChatListScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    user,
    conversations,
    onlineUserIds,
    typingMap,
    fetchConversations,
    setOnlineUserIds,
    setTypingForConversation,
    isAuthenticated,
    togglePinConversation,
    toggleArchiveConversation,
    toggleMuteConversation,
    markConversationAsRead,
    deleteConversation,
    startOrGetSupportConversation,
    showToast,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // 1. Subscribe to realtime conversation updates & global presence
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    fetchConversations?.();

    // Subscribe to presence
    const { unsubscribe: unsubPresence } = chatService.subscribeToPresence(
      'global_presence',
      {
        id: user.id,
        name: user.name || 'User',
        avatar: user.avatar,
      },
      (presenceList) => {
        setOnlineUserIds(presenceList);
      }
    );

    // Subscribe to conversation table updates
    const { unsubscribe: unsubConvs } = chatService.subscribeToConversations(
      user.id,
      () => {
        fetchConversations?.();
      }
    );

    return () => {
      unsubPresence();
      unsubConvs();
    };
  }, [isAuthenticated, user?.id]);

  const onRefresh = useCallback(async () => {
    if (!isAuthenticated) return;
    setRefreshing(true);
    try {
      await fetchConversations?.();
    } finally {
      setRefreshing(false);
    }
  }, [isAuthenticated, fetchConversations]);

  const handleDeleteConversation = (convId: string, name: string) => {
    triggerHaptic('medium');
    Alert.alert(
      'Delete Conversation',
      `Delete your conversation with ${name}? This will remove it from your inbox.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteConversation(convId);
          },
        },
      ]
    );
  };

  const handleSupportChat = async () => {
    triggerHaptic('light');
    try {
      const convId = await startOrGetSupportConversation();
      router.push(`/(renter)/chat/${convId}` as any);
    } catch {
      showToast?.('Unable to connect to support right now.', 'error');
    }
  };

  // Auth Gate
  if (!isAuthenticated) {
    return (
      <View style={styles.root}>
        <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 16) + 4 }]}>
          <View style={styles.headerRow}>
            <Text style={styles.screenTitle}>Messages</Text>
          </View>
        </View>

        <V4AuthGate
          title="Chat with owners and flatmates"
          description="Sign in to message verified owners, receive waves, and coordinate visits."
          featureName="Messages & Chat"
          badgeText="DIRECT MESSAGING"
          benefits={[
            'Verified direct chat with verified owners',
            'Receive and accept incoming waves from potential flatmates',
            'Coordinate property visit schedules and video tours',
            'Encrypted 1-on-1 private messaging',
          ]}
          fullScreen={false}
        />
      </View>
    );
  }

  // Filter Conversations
  const filteredConversations = useMemo(() => {
    return (conversations || []).filter((conv) => {
      // Tab Filtering
      if (activeTab === 'Archived') {
        if (!conv.is_archived) return false;
      } else {
        if (conv.is_archived) return false;
        if (activeTab === 'Owners' && conv.type === 'flatmate') return false;
        if (activeTab === 'Flatmates' && conv.type !== 'flatmate') return false;
        if (activeTab === 'Support' && conv.type !== 'support') return false;
      }

      // Search Filtering
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = conv.other_user_name?.toLowerCase().includes(q);
        const matchProp = conv.property_title?.toLowerCase().includes(q);
        const matchMsg = conv.last_message?.toLowerCase().includes(q);
        return matchName || matchProp || matchMsg;
      }

      return true;
    });
  }, [conversations, activeTab, searchQuery]);

  const pinnedList = useMemo(() => {
    if (activeTab === 'Archived') return [];
    return filteredConversations.filter((c) => c.is_pinned);
  }, [filteredConversations, activeTab]);

  const regularList = useMemo(() => {
    if (activeTab === 'Archived') return filteredConversations;
    return filteredConversations.filter((c) => !c.is_pinned);
  }, [filteredConversations, activeTab]);

  const totalUnread = useMemo(() => {
    return (conversations || []).reduce((acc, c) => acc + (c.unread_count || 0), 0);
  }, [conversations]);

  return (
    <View style={styles.root}>
      {/* 1. TOP BAR */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 14) }]}>
        <View style={styles.headerRow}>
          <View style={styles.titleRow}>
            <Text style={styles.screenTitle}>Messages</Text>
            {totalUnread > 0 && (
              <View style={styles.unreadCountBadge}>
                <Text style={styles.unreadCountBadgeText}>{totalUnread}</Text>
              </View>
            )}
          </View>

          <View style={styles.headerActionRow}>
            <Pressable
              style={[styles.iconBtn, showSearch && styles.iconBtnActive]}
              onPress={() => {
                triggerHaptic('selection');
                setShowSearch(!showSearch);
              }}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Search messages"
            >
              <Search size={18} color={showSearch ? '#FFFFFF' : '#0F766E'} strokeWidth={2.4} />
            </Pressable>

            <Pressable
              style={styles.iconBtn}
              onPress={handleSupportChat}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="24x7 Priority Support Desk"
            >
              <Headphones size={18} color="#0F766E" strokeWidth={2.2} />
            </Pressable>
          </View>
        </View>

        {/* Collapsible Search Input */}
        {showSearch && (
          <View style={styles.searchBarBox}>
            <Search size={15} color="#0F766E" strokeWidth={2.4} />
            <TextInput
              placeholder="Search contacts, properties, or messages..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
              autoFocus
              accessible={true}
              accessibilityLabel="Search query input"
            />
            {searchQuery.length > 0 && (
              <Pressable
                onPress={() => setSearchQuery('')}
                hitSlop={8}
                style={styles.clearSearchBtn}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Clear search"
              >
                <X size={14} color="#64748B" />
              </Pressable>
            )}
          </View>
        )}

        {/* Filter Segmented Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabsScroll}
        >
          {FILTER_TABS.map((tab) => {
            const isSelected = activeTab === tab;
            return (
              <Pressable
                key={tab}
                style={[styles.tabPill, isSelected && styles.tabPillActive]}
                onPress={() => {
                  triggerHaptic('selection');
                  setActiveTab(tab);
                }}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`${tab} filter tab`}
              >
                <Text style={[styles.tabPillText, isSelected && styles.tabPillTextActive]}>
                  {tab}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* 2. CONVERSATIONS LIST */}
      <ScrollView
        style={styles.listScroll}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 80 }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0F766E"
            colors={['#0F766E']}
          />
        }
      >
        {/* Support Concierge Banner */}
        <Pressable
          style={styles.conciergeBanner}
          onPress={handleSupportChat}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Connect with REHVO 24/7 Priority Support"
        >
          <View style={styles.conciergeIconBox}>
            <Sparkles size={18} color="#0F766E" strokeWidth={2.4} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.conciergeTitle}>REHVO 24/7 Priority Concierge</Text>
            <Text style={styles.conciergeSubtitle}>
              Live assistance for visits, leases, ZeroDeposit pass & payments.
            </Text>
          </View>
          <ArrowRight size={15} color="#0F766E" strokeWidth={2.4} />
        </Pressable>

        {/* Pinned Section */}
        {pinnedList.length > 0 && (
          <View style={styles.sectionWrap}>
            <Text style={styles.sectionHeaderLabel}>PINNED CONVERSATIONS</Text>
            {pinnedList.map((conv) => {
              const otherUserId = conv.other_user_id || conv.owner_id;
              const isUserOnline = otherUserId ? onlineUserIds.includes(otherUserId) : false;
              const typingState = typingMap[conv.id];
              const isOtherTyping = Boolean(typingState?.isTyping && typingState?.userId !== user?.id);

              return (
                <V4ConversationCard
                  key={conv.id}
                  conversation={conv}
                  isOnline={isUserOnline}
                  isTyping={isOtherTyping}
                  onPress={() => router.push(`/(renter)/chat/${conv.id}` as any)}
                  onPin={() => togglePinConversation(conv.id)}
                  onArchive={() => toggleArchiveConversation(conv.id)}
                  onMute={() => toggleMuteConversation(conv.id)}
                  onMarkRead={() => markConversationAsRead(conv.id)}
                  onDelete={() => handleDeleteConversation(conv.id, conv.other_user_name || 'Contact')}
                />
              );
            })}
          </View>
        )}

        {/* Regular Section */}
        {regularList.length > 0 && (
          <View style={styles.sectionWrap}>
            {pinnedList.length > 0 && (
              <Text style={styles.sectionHeaderLabel}>ALL CONVERSATIONS</Text>
            )}
            {regularList.map((conv) => {
              const otherUserId = conv.other_user_id || conv.owner_id;
              const isUserOnline = otherUserId ? onlineUserIds.includes(otherUserId) : false;
              const typingState = typingMap[conv.id];
              const isOtherTyping = Boolean(typingState?.isTyping && typingState?.userId !== user?.id);

              return (
                <V4ConversationCard
                  key={conv.id}
                  conversation={conv}
                  isOnline={isUserOnline}
                  isTyping={isOtherTyping}
                  onPress={() => router.push(`/(renter)/chat/${conv.id}` as any)}
                  onPin={() => togglePinConversation(conv.id)}
                  onArchive={() => toggleArchiveConversation(conv.id)}
                  onMute={() => toggleMuteConversation(conv.id)}
                  onMarkRead={() => markConversationAsRead(conv.id)}
                  onDelete={() => handleDeleteConversation(conv.id, conv.other_user_name || 'Contact')}
                />
              );
            })}
          </View>
        )}

        {/* Empty State */}
        {filteredConversations.length === 0 && (
          <V4EmptyState
            icon={<MessageSquare size={44} color="#0F766E" strokeWidth={1.8} />}
            title={
              activeTab === 'Archived'
                ? 'No Archived Messages'
                : searchQuery
                ? 'No Matching Messages'
                : 'No Messages Yet'
            }
            description={
              searchQuery
                ? `No conversations match "${searchQuery}". Try a different keyword.`
                : activeTab === 'Archived'
                ? 'Conversations you archive will appear here.'
                : 'Connect directly with verified owners with verified listing or discover compatible flatmates.'
            }
            actionLabel="Browse Verified Homes"
            onActionPress={() => router.push('/(renter)/search' as any)}
            secondaryActionLabel="Find Flatmates"
            onSecondaryActionPress={() => router.push('/(renter)/flatmates' as any)}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topBar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  unreadCountBadge: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadCountBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  headerActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnActive: {
    backgroundColor: '#0F766E',
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#0F172A',
    fontWeight: '600',
    padding: 0,
  },
  clearSearchBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTabsScroll: {
    paddingHorizontal: 16,
    gap: 8,
    paddingTop: 4,
  },
  tabPill: {
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabPillActive: {
    backgroundColor: '#0F766E',
  },
  tabPillText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748B',
  },
  tabPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  listScroll: {
    flex: 1,
  },
  listContent: {
    paddingTop: 8,
  },
  conciergeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    gap: 12,
    minHeight: 44,
  },
  conciergeIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  conciergeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F766E',
  },
  conciergeSubtitle: {
    fontSize: 11,
    color: '#475569',
    marginTop: 1,
  },
  sectionWrap: {
    marginBottom: 10,
  },
  sectionHeaderLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
