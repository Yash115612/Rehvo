import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Search,
  MessageSquare,
  Building2,
  X,
  Archive,
  Plus,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import { V4_COLORS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4ConversationCard } from '../chat/V4ConversationCard';
import { V4OwnerLeadCard } from '../chat/V4OwnerLeadCard';
import { V4AuthGate } from '../ui/V4AuthGate';
import { V4EmptyState } from '../ui/V4EmptyState';
import * as chatService from '../../../services/chat';
import { triggerHaptic } from '../../../utils/haptics';

const CRM_TABS = [
  'New Leads',
  'Active Chats',
  'Visits Scheduled',
  'Negotiating',
  'Converted',
  'Archived',
] as const;
type CrmTab = typeof CRM_TABS[number];

const LOCALITY_CHIPS = ['All Localities', 'Bandra', 'Andheri', 'Worli', 'Powai', 'BKC'] as const;
const SOURCE_CHIPS = ['All Sources', 'Direct Enquiry', 'Site Visit', 'Flatmate Wave'] as const;

export const V4OwnerChatListScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    user,
    conversations,
    myProperties,
    onlineUserIds,
    typingMap,
    fetchConversations,
    setOnlineUserIds,
    isAuthenticated,
    togglePinConversation,
    toggleArchiveConversation,
    toggleMuteConversation,
    markConversationAsRead,
    deleteConversation,
    showToast,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<CrmTab>('New Leads');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedLocality, setSelectedLocality] = useState<string>('All Localities');
  const [selectedSource, setSelectedSource] = useState<string>('All Sources');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedConvIds, setSelectedConvIds] = useState<string[]>([]);

  // 1. Realtime subscriptions & Global presence
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    fetchConversations?.();

    // Subscribe to presence
    const { unsubscribe: unsubPresence } = chatService.subscribeToPresence(
      'owner_inbox_presence',
      {
        id: user.id,
        name: user.name || 'Owner',
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
      'Delete Lead Conversation',
      `Delete conversation with ${name}? This will remove it from your CRM inbox.`,
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

  const handleToggleSelect = (convId: string) => {
    triggerHaptic('selection');
    setSelectedConvIds((prev) =>
      prev.includes(convId) ? prev.filter((id) => id !== convId) : [...prev, convId]
    );
  };

  // Auth Gate
  if (!isAuthenticated) {
    return (
      <View style={styles.root}>
        <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 16) + 4 }]}>
          <View style={styles.headerRow}>
            <Text style={styles.screenTitle}>Host Messages</Text>
          </View>
        </View>

        <V4AuthGate
          title="Owner Direct Messaging CRM"
          description="Sign in to chat directly with verified tenant applicants, send visit invites, and dispatch legal e-leases."
          featureName="Owner Messaging CRM"
          badgeText="VERIFIED MARKETPLACE HOST"
          benefits={[
            'Direct 1-on-1 encrypted messaging with DigiLocker verified renters',
            'Dispatch 11-month state-stamped digital agreements in 1-tap',
            'Schedule QR entry site tours with prospective tenants',
            'Automated rent reminders with direct UPI bank reconciliation',
          ]}
          fullScreen={false}
        />
      </View>
    );
  }

  // Active Conversations Count Helper
  const totalActiveCount = useMemo(() => {
    return (conversations || []).filter((c) => {
      const isClosed = c.metadata?.status === 'closed' || c.metadata?.status === 'rented';
      return !c.is_archived && !isClosed;
    }).length;
  }, [conversations]);

  const propertyActiveCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    (conversations || []).forEach((c) => {
      if (!c.property_id || c.is_archived) return;
      const isClosed = c.metadata?.status === 'closed' || c.metadata?.status === 'rented';
      if (!isClosed) {
        counts[c.property_id] = (counts[c.property_id] || 0) + 1;
      }
    });
    return counts;
  }, [conversations]);

  // Tab Filtering Logic
  const filteredConversations = useMemo(() => {
    return (conversations || []).filter((c) => {
      // 1. Property Filter
      if (selectedPropertyId && c.property_id !== selectedPropertyId) {
        return false;
      }

      // 2. Locality Filter
      if (selectedLocality !== 'All Localities') {
        const propLoc = c.property_locality || c.property_title || '';
        if (!propLoc.toLowerCase().includes(selectedLocality.toLowerCase())) {
          return false;
        }
      }

      // 3. Source Filter
      if (selectedSource !== 'All Sources') {
        if (selectedSource === 'Site Visit') {
          const hasVisit = (c.messages || []).some(
            (m) => m.message_type === 'visit' || Boolean(m.metadata?.visit)
          );
          if (!hasVisit) return false;
        } else if (selectedSource === 'Flatmate Wave') {
          if (c.type !== 'flatmate') return false;
        }
      }

      // 4. CRM Tab Filter
      if (activeTab === 'Archived') {
        if (!c.is_archived) return false;
      } else {
        if (c.is_archived) return false;

        if (activeTab === 'Visits Scheduled') {
          const hasVisit = (c.messages || []).some(
            (m) => m.message_type === 'visit' || Boolean(m.metadata?.visit)
          );
          if (!hasVisit) return false;
        } else if (activeTab === 'Converted') {
          const isClosed =
            c.metadata?.status === 'closed' ||
            c.metadata?.status === 'rented' ||
            (c.property_id && myProperties.find((p) => p.id === c.property_id)?.status === 'RENTED');
          if (!isClosed) return false;
        } else if (activeTab === 'Negotiating') {
          const isNegotiating =
            c.metadata?.status === 'negotiating' ||
            (c.messages || []).some(
              (m) => m.message_type === 'payment_request' || m.message_type === 'agreement'
            );
          if (!isNegotiating) return false;
        } else if (activeTab === 'New Leads') {
          const isNew = (c.messages || []).length <= 2 || (c.unread_count || 0) > 0;
          if (!isNew) return false;
        } else if (activeTab === 'Active Chats') {
          const isClosed = c.metadata?.status === 'closed' || c.metadata?.status === 'rented';
          if (isClosed) return false;
        }
      }

      // 5. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = c.other_user_name?.toLowerCase().includes(q);
        const matchProp = c.property_title?.toLowerCase().includes(q);
        const matchMsg = c.last_message?.toLowerCase().includes(q);
        return matchName || matchProp || matchMsg;
      }

      return true;
    });
  }, [conversations, activeTab, selectedPropertyId, selectedLocality, selectedSource, searchQuery, myProperties]);

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

  const tabUnreadCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    (conversations || []).forEach((c) => {
      const uCount = c.unread_count || 0;
      if (uCount <= 0) return;
      if (c.is_archived) {
        counts['Archived'] = (counts['Archived'] || 0) + uCount;
      } else {
        const hasVisit = (c.messages || []).some(
          (m) => m.message_type === 'visit' || Boolean(m.metadata?.visit)
        );
        if (hasVisit) {
          counts['Visits Scheduled'] = (counts['Visits Scheduled'] || 0) + uCount;
        }
        if ((c.messages || []).length <= 2 || uCount > 0) {
          counts['New Leads'] = (counts['New Leads'] || 0) + uCount;
        }
        counts['Active Chats'] = (counts['Active Chats'] || 0) + uCount;
      }
    });
    return counts;
  }, [conversations]);

  return (
    <View style={styles.root}>
      {/* 1. TOP BAR */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 14) }]}>
        <View style={styles.headerRow}>
          <View style={styles.titleRow}>
            <Text style={styles.screenTitle}>Host Inbox</Text>
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
              accessibilityLabel="Search tenant leads"
            >
              <Search size={18} color={showSearch ? '#FFFFFF' : '#0F766E'} strokeWidth={2.4} />
            </Pressable>

            <Pressable
              style={[styles.iconBtn, activeTab === 'Archived' && styles.iconBtnActive]}
              onPress={() => {
                triggerHaptic('selection');
                setActiveTab(activeTab === 'Archived' ? 'New Leads' : 'Archived');
              }}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="View archived leads"
            >
              <Archive
                size={18}
                color={activeTab === 'Archived' ? '#FFFFFF' : '#0F766E'}
                strokeWidth={2.4}
              />
            </Pressable>
            <Pressable
              style={[styles.bulkToggleBtn, isBulkMode && styles.bulkToggleBtnActive]}
              onPress={() => {
                triggerHaptic('selection');
                setIsBulkMode(!isBulkMode);
                setSelectedConvIds([]);
              }}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Toggle bulk selection mode"
            >
              <Text style={[styles.bulkToggleText, isBulkMode && styles.bulkToggleTextActive]}>
                {isBulkMode ? 'Done' : 'Select'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Collapsible Search Input */}
        {showSearch && (
          <View style={styles.searchBarBox}>
            <Search size={15} color="#0F766E" strokeWidth={2.4} />
            <TextInput
              placeholder="Search tenants, properties, or messages..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
              autoFocus
              accessible={true}
              accessibilityLabel="Search leads input"
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

        {/* CRM Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabsScroll}
        >
          {CRM_TABS.map((tab) => {
            const isSelected = activeTab === tab;
            const tabUnread = tabUnreadCounts[tab] || 0;
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
                accessibilityLabel={`${tab} tab, ${tabUnread} unread`}
              >
                <Text style={[styles.tabPillText, isSelected && styles.tabPillTextActive]}>
                  {tab}
                </Text>
                {tabUnread > 0 && (
                  <View style={[styles.tabBadge, isSelected && styles.tabBadgeActive]}>
                    <Text style={[styles.tabBadgeText, isSelected && styles.tabBadgeTextActive]}>
                      {tabUnread}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Property Filter Strip with Active Conversation Counts */}
        {myProperties.length > 0 && (
          <View style={styles.propertyFilterSection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.propertyFilterScroll}
            >
              <Pressable
                style={[
                  styles.propChip,
                  selectedPropertyId === null && styles.propChipActive,
                ]}
                onPress={() => {
                  triggerHaptic('selection');
                  setSelectedPropertyId(null);
                }}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`All properties, ${totalActiveCount} active conversations`}
              >
                <Building2
                  size={13}
                  color={selectedPropertyId === null ? '#FFFFFF' : '#0F766E'}
                />
                <Text
                  style={[
                    styles.propChipText,
                    selectedPropertyId === null && styles.propChipTextActive,
                  ]}
                >
                  All Properties ({totalActiveCount})
                </Text>
              </Pressable>

              {myProperties.map((p) => {
                const isSelected = selectedPropertyId === p.id;
                const activeCount = propertyActiveCounts[p.id] || 0;
                const rawCover = p.images?.[0];
                const coverImg =
                  typeof rawCover === 'string'
                    ? rawCover
                    : (rawCover as any)?.image_url ||
                      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=100';

                return (
                  <Pressable
                    key={p.id}
                    style={[styles.propChip, isSelected && styles.propChipActive]}
                    onPress={() => {
                      triggerHaptic('selection');
                      setSelectedPropertyId(isSelected ? null : p.id);
                    }}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`${p.title}, ${activeCount} active conversations`}
                  >
                    <Image source={{ uri: coverImg }} style={styles.propChipImg} />
                    <Text
                      style={[
                        styles.propChipText,
                        isSelected && styles.propChipTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {p.title} ({activeCount})
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Locality & Lead Source Filter Strip */}
        <View style={styles.subFilterSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subFilterScroll}
          >
            {LOCALITY_CHIPS.map((loc) => {
              const isSelected = selectedLocality === loc;
              return (
                <Pressable
                  key={loc}
                  style={[styles.subFilterChip, isSelected && styles.subFilterChipActive]}
                  onPress={() => {
                    triggerHaptic('selection');
                    setSelectedLocality(loc);
                  }}
                  accessibilityRole="button"
                >
                  <Text style={[styles.subFilterText, isSelected && styles.subFilterTextActive]}>
                    {loc}
                  </Text>
                </Pressable>
              );
            })}
            <View style={styles.chipDivider} />
            {SOURCE_CHIPS.map((src) => {
              const isSelected = selectedSource === src;
              return (
                <Pressable
                  key={src}
                  style={[styles.subFilterChip, isSelected && styles.subFilterChipActive]}
                  onPress={() => {
                    triggerHaptic('selection');
                    setSelectedSource(src);
                  }}
                  accessibilityRole="button"
                >
                  <Text style={[styles.subFilterText, isSelected && styles.subFilterTextActive]}>
                    {src}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>

      {/* 2. CONVERSATIONS LIST */}
      <ScrollView
        style={styles.listScroll}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + (isBulkMode ? 120 : 80) }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0F766E"
            colors={['#0F766E']}
          />
        }
      >
        {/* Pinned Section */}
        {pinnedList.length > 0 && (
          <View style={styles.sectionWrap}>
            <Text style={styles.sectionHeaderLabel}>PINNED LEADS</Text>
            {pinnedList.map((conv) => {
              const otherUserId = conv.other_user_id || conv.renter_id;
              const isUserOnline = otherUserId ? onlineUserIds.includes(otherUserId) : false;
              const typingState = typingMap[conv.id];
              const isOtherTyping = Boolean(typingState?.isTyping && typingState?.userId !== user?.id);

              return (
                <V4OwnerLeadCard
                  key={conv.id}
                  conversation={conv}
                  isOnline={isUserOnline}
                  isTyping={isOtherTyping}
                  isSelected={selectedConvIds.includes(conv.id)}
                  isBulkMode={isBulkMode}
                  onPress={() => router.push(`/(owner)/chat/${conv.id}` as any)}
                  onSelect={() => handleToggleSelect(conv.id)}
                  onLongPress={() => {
                    setIsBulkMode(true);
                    handleToggleSelect(conv.id);
                  }}
                />
              );
            })}
          </View>
        )}

        {/* Regular Section */}
        {regularList.length > 0 && (
          <View style={styles.sectionWrap}>
            {pinnedList.length > 0 && (
              <Text style={styles.sectionHeaderLabel}>ALL LEADS</Text>
            )}
            {regularList.map((conv) => {
              const otherUserId = conv.other_user_id || conv.renter_id;
              const isUserOnline = otherUserId ? onlineUserIds.includes(otherUserId) : false;
              const typingState = typingMap[conv.id];
              const isOtherTyping = Boolean(typingState?.isTyping && typingState?.userId !== user?.id);

              return (
                <V4OwnerLeadCard
                  key={conv.id}
                  conversation={conv}
                  isOnline={isUserOnline}
                  isTyping={isOtherTyping}
                  isSelected={selectedConvIds.includes(conv.id)}
                  isBulkMode={isBulkMode}
                  onPress={() => router.push(`/(owner)/chat/${conv.id}` as any)}
                  onSelect={() => handleToggleSelect(conv.id)}
                  onLongPress={() => {
                    setIsBulkMode(true);
                    handleToggleSelect(conv.id);
                  }}
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
                ? 'No Archived Inquiries'
                : searchQuery
                ? 'No Matching Leads'
                : activeTab === 'Visits Scheduled'
                ? 'No Scheduled Visits'
                : activeTab === 'Converted'
                ? 'No Converted Deals Yet'
                : 'No Tenant Leads Yet'
            }
            description={
              searchQuery
                ? `No inquiries match "${searchQuery}".`
                : activeTab === 'Visits Scheduled'
                ? 'Leads with scheduled property visits will appear here.'
                : activeTab === 'Converted'
                ? 'Tenants who have executed leases or completed move-in will appear here.'
                : 'When prospective tenants inquire about your listings, their messages will arrive here.'
            }
            actionLabel="View My Listings"
            onActionPress={() => router.push('/(owner)/listings' as any)}
            secondaryActionLabel="Add New Property"
            onSecondaryActionPress={() => router.push('/(renter)/listing' as any)}
          />
        )}
      </ScrollView>

      {/* Floating Bulk Action Toolbar */}
      {isBulkMode && selectedConvIds.length > 0 && (
        <View style={[styles.bulkToolbar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <Text style={styles.bulkToolbarCount}>
            {selectedConvIds.length} lead{selectedConvIds.length > 1 ? 's' : ''} selected
          </Text>
          <View style={styles.bulkToolbarActions}>
            <Pressable
              style={styles.bulkActionBtn}
              onPress={async () => {
                triggerHaptic('medium');
                for (const id of selectedConvIds) {
                  await markConversationAsRead(id);
                }
                setSelectedConvIds([]);
                showToast?.('Selected leads marked as read', 'success');
              }}
            >
              <Text style={styles.bulkActionText}>Mark Read</Text>
            </Pressable>
            <Pressable
              style={styles.bulkActionBtn}
              onPress={async () => {
                triggerHaptic('medium');
                for (const id of selectedConvIds) {
                  await toggleArchiveConversation(id);
                }
                setSelectedConvIds([]);
                showToast?.('Selected leads archived', 'success');
              }}
            >
              <Text style={styles.bulkActionText}>Archive</Text>
            </Pressable>
          </View>
        </View>
      )}
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
    paddingBottom: 8,
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
  bulkToggleBtn: {
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulkToggleBtnActive: {
    backgroundColor: '#0F766E',
  },
  bulkToggleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F766E',
  },
  bulkToggleTextActive: {
    color: '#FFFFFF',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
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
  tabBadge: {
    backgroundColor: '#CBD5E1',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 8,
  },
  tabBadgeActive: {
    backgroundColor: '#064E3B',
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#334155',
  },
  tabBadgeTextActive: {
    color: '#A7F3D0',
  },
  propertyFilterSection: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  propertyFilterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  propChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  propChipActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  propChipImg: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
  },
  propChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  propChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  subFilterSection: {
    marginTop: 6,
    paddingBottom: 4,
  },
  subFilterScroll: {
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 6,
  },
  subFilterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  subFilterChipActive: {
    backgroundColor: '#E0F2FE',
    borderColor: '#0284C7',
  },
  subFilterText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  subFilterTextActive: {
    color: '#0369A1',
    fontWeight: '700',
  },
  chipDivider: {
    width: 1,
    height: 18,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 4,
  },
  listScroll: {
    flex: 1,
  },
  listContent: {
    paddingTop: 4,
  },
  sectionWrap: {
    marginBottom: 8,
  },
  sectionHeaderLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  bulkToolbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  bulkToolbarCount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bulkToolbarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bulkActionBtn: {
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulkActionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
