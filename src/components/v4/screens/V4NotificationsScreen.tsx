import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Bell,
  CalendarCheck,
  MessageSquare,
  Users,
  Bookmark,
  Sparkles,
  ShieldCheck,
  IndianRupee,
  CheckCheck,
  Trash2,
  Clock,
  SlidersHorizontal,
  Search,
  X,
  CheckSquare,
  Square,
  Check,
  Building2,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import { NotificationItem } from '../../../types';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4AuthGate } from '../ui/V4AuthGate';
import { navigateToNotificationDestination } from '../../../services/notificationDeepLinks';

export type NotificationTabKey =
  | 'ALL'
  | 'MESSAGES'
  | 'PROPERTY'
  | 'VISITS'
  | 'WALLET'
  | 'SOCIETY'
  | 'REWARDS';

interface TabDefinition {
  key: NotificationTabKey;
  label: string;
}

const TABS: TabDefinition[] = [
  { key: 'ALL', label: 'All' },
  { key: 'MESSAGES', label: 'Messages' },
  { key: 'PROPERTY', label: 'Property' },
  { key: 'VISITS', label: 'Visits' },
  { key: 'WALLET', label: 'Wallet' },
  { key: 'SOCIETY', label: 'Society' },
  { key: 'REWARDS', label: 'Rewards' },
];

const matchesTab = (item: NotificationItem, tab: NotificationTabKey): boolean => {
  if (tab === 'ALL') return true;
  const cat = (item.data?.category || item.type || '').toLowerCase();
  const type = (item.type || '').toLowerCase();

  if (tab === 'MESSAGES') {
    return (
      type === 'message' ||
      type === 'chat_message' ||
      type === 'flatmate_wave' ||
      cat.includes('message') ||
      cat.includes('chat') ||
      cat.includes('flatmate')
    );
  }
  if (tab === 'PROPERTY') {
    return (
      type === 'property_saved' ||
      type === 'price' ||
      type === 'price_drop' ||
      type === 'enquiry' ||
      type === 'lead' ||
      cat.includes('property') ||
      cat.includes('price') ||
      cat.includes('lead')
    );
  }
  if (tab === 'VISITS') {
    return (
      type === 'visit' ||
      type === 'visit_booking' ||
      type === 'visit_reminder' ||
      cat.includes('visit')
    );
  }
  if (tab === 'WALLET') {
    return (
      type === 'wallet' ||
      type === 'payment' ||
      type === 'rent_due' ||
      type === 'withdrawal' ||
      cat.includes('wallet') ||
      cat.includes('payment') ||
      cat.includes('rent')
    );
  }
  if (tab === 'SOCIETY') {
    return (
      type === 'society' ||
      type === 'society_notice' ||
      type === 'visitor_arrived' ||
      type === 'delivery_arrived' ||
      type === 'maintenance_due' ||
      cat.includes('society')
    );
  }
  if (tab === 'REWARDS') {
    return (
      type === 'reward' ||
      type === 'cashback' ||
      cat.includes('reward') ||
      cat.includes('cashback')
    );
  }
  return false;
};

const formatNotificationTime = (isoString?: string): string => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
};

export const V4NotificationsScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    isAuthenticated,
    notifications,
    unreadNotificationCount,
    fetchNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    bulkMarkNotificationsRead,
    bulkDeleteNotifications,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<NotificationTabKey>('ALL');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      fetchNotifications().finally(() => setLoading(false));
    }
  }, [isAuthenticated, fetchNotifications]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  // Filter by active tab and search query
  const filteredNotifications = useMemo(() => {
    let list = notifications.filter((n) => matchesTab(n, activeTab));

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((n) => {
        const titleMatch = (n.title || '').toLowerCase().includes(q);
        const bodyMatch = (n.body || n.message || '').toLowerCase().includes(q);
        return titleMatch || bodyMatch;
      });
    }

    return list;
  }, [notifications, activeTab, searchQuery]);

  // Tab unread counts
  const unreadCounts = useMemo(() => {
    const counts: Record<NotificationTabKey, number> = {
      ALL: 0,
      MESSAGES: 0,
      PROPERTY: 0,
      VISITS: 0,
      WALLET: 0,
      SOCIETY: 0,
      REWARDS: 0,
    };
    notifications.forEach((n) => {
      if (!n.read) {
        counts.ALL += 1;
        if (matchesTab(n, 'MESSAGES')) counts.MESSAGES += 1;
        if (matchesTab(n, 'PROPERTY')) counts.PROPERTY += 1;
        if (matchesTab(n, 'VISITS')) counts.VISITS += 1;
        if (matchesTab(n, 'WALLET')) counts.WALLET += 1;
        if (matchesTab(n, 'SOCIETY')) counts.SOCIETY += 1;
        if (matchesTab(n, 'REWARDS')) counts.REWARDS += 1;
      }
    });
    return counts;
  }, [notifications]);

  // Group notifications into Today, Yesterday, Earlier (Instagram Activity style)
  const groupedSections = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;

    const today: NotificationItem[] = [];
    const yesterday: NotificationItem[] = [];
    const earlier: NotificationItem[] = [];

    filteredNotifications.forEach((item) => {
      const timeMs = item.created_at ? new Date(item.created_at).getTime() : 0;
      if (timeMs >= startOfToday) {
        today.push(item);
      } else if (timeMs >= startOfYesterday) {
        yesterday.push(item);
      } else {
        earlier.push(item);
      }
    });

    const sections: { title: string; data: NotificationItem[] }[] = [];
    if (today.length > 0) sections.push({ title: 'Today', data: today });
    if (yesterday.length > 0) sections.push({ title: 'Yesterday', data: yesterday });
    if (earlier.length > 0) sections.push({ title: 'Earlier', data: earlier });

    return sections;
  }, [filteredNotifications]);

  // Selection mode helpers
  const toggleSelectId = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const selectAll = useCallback(() => {
    const allFilteredIds = filteredNotifications.map((n) => n.id);
    setSelectedIds(allFilteredIds);
  }, [filteredNotifications]);

  const deselectAll = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const handleBulkMarkRead = useCallback(async () => {
    if (selectedIds.length === 0) return;
    await bulkMarkNotificationsRead(selectedIds);
    setSelectedIds([]);
    setIsSelectionMode(false);
  }, [selectedIds, bulkMarkNotificationsRead]);

  const handleBulkDelete = useCallback(async () => {
    if (selectedIds.length === 0) return;
    await bulkDeleteNotifications(selectedIds);
    setSelectedIds([]);
    setIsSelectionMode(false);
  }, [selectedIds, bulkDeleteNotifications]);

  const handleNotificationPress = async (item: NotificationItem) => {
    if (isSelectionMode) {
      toggleSelectId(item.id);
      return;
    }

    if (!item.read) {
      await markNotificationRead(item.id);
    }

    // Direct deep-link routing via notificationDeepLinks
    const handled = navigateToNotificationDestination(item);
    if (!handled && item.data?.action_url) {
      router.push(item.data.action_url as any);
    }
  };

  const getItemVisuals = (item: NotificationItem) => {
    const cat = (item.data?.category || item.type || '').toLowerCase();
    const type = (item.type || '').toLowerCase();

    if (type === 'message' || type === 'chat_message' || cat.includes('message') || cat.includes('chat')) {
      return { icon: MessageSquare, color: '#0F766E', bg: '#CCFBF1' };
    }
    if (type === 'visit' || type === 'visit_booking' || type === 'visit_reminder' || cat.includes('visit')) {
      return { icon: CalendarCheck, color: '#2563EB', bg: '#EFF6FF' };
    }
    if (type === 'flatmate_wave' || cat.includes('flatmate')) {
      return { icon: Users, color: '#8B5CF6', bg: '#F5F3FF' };
    }
    if (type === 'property_saved' || type === 'price' || type === 'price_drop' || cat.includes('property') || cat.includes('price')) {
      return { icon: Bookmark, color: '#D97706', bg: '#FEF3C7' };
    }
    if (type === 'reward' || type === 'cashback' || cat.includes('reward') || cat.includes('cashback')) {
      return { icon: Sparkles, color: '#F59E0B', bg: '#FEF3C7' };
    }
    if (type === 'payment' || type === 'withdrawal' || type === 'rent_due' || cat.includes('wallet') || cat.includes('rent')) {
      return { icon: IndianRupee, color: '#059669', bg: '#D1FAE5' };
    }
    if (type === 'visitor_arrived' || type === 'delivery_arrived' || type === 'society_notice' || cat.includes('society')) {
      return { icon: Building2, color: '#0284C7', bg: '#E0F2FE' };
    }
    if (type === 'lead' || type === 'owner_lead' || cat.includes('lead')) {
      return { icon: Building2, color: '#0F766E', bg: '#E6FFFA' };
    }
    return { icon: ShieldCheck, color: '#0F766E', bg: '#F0FDFA' };
  };

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 14) }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable
            style={styles.iconBtn}
            onPress={() => router.back()}
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={18} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
          </Pressable>

          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Notifications</Text>
            {unreadNotificationCount > 0 && !isSelectionMode && (
              <View style={styles.headerCountBadge}>
                <Text style={styles.headerCountText}>
                  {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.headerActions}>
          {isAuthenticated && (
            <>
              {/* Search Toggle Button */}
              <Pressable
                style={[styles.iconBtn, isSearchVisible && styles.iconBtnActive]}
                onPress={() => {
                  setIsSearchVisible(!isSearchVisible);
                  if (isSearchVisible) setSearchQuery('');
                }}
                accessibilityLabel="Search notifications"
              >
                <Search
                  size={17}
                  color={isSearchVisible ? V4_COLORS.primary : V4_COLORS.textSecondary}
                  strokeWidth={2.2}
                />
              </Pressable>

              {/* Multi-select Toggle Button */}
              <Pressable
                style={[styles.iconBtn, isSelectionMode && styles.iconBtnActive]}
                onPress={() => {
                  setIsSelectionMode(!isSelectionMode);
                  setSelectedIds([]);
                }}
                accessibilityLabel="Toggle select mode"
              >
                <CheckSquare
                  size={17}
                  color={isSelectionMode ? V4_COLORS.primary : V4_COLORS.textSecondary}
                  strokeWidth={2.2}
                />
              </Pressable>

              {/* Notification Settings Shortcut Button */}
              <Pressable
                style={styles.iconBtn}
                onPress={() => router.push('/(renter)/notification-settings' as any)}
                accessibilityLabel="Notification settings"
              >
                <SlidersHorizontal size={17} color={V4_COLORS.textSecondary} strokeWidth={2.2} />
              </Pressable>
            </>
          )}
        </View>
      </View>

      {/* Instant Search Bar */}
      {isSearchVisible && isAuthenticated && (
        <View style={styles.searchBarWrap}>
          <Search size={16} color={V4_COLORS.textMuted} strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search alerts by title or content..."
            placeholderTextColor={V4_COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <Pressable
              style={styles.searchClearBtn}
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <X size={14} color={V4_COLORS.textSecondary} />
            </Pressable>
          )}
        </View>
      )}

      {!isAuthenticated ? (
        <V4AuthGate
          icon={Bell}
          title="Stay Updated with Live Alerts"
          description="Sign in to receive instant visit confirmations, rent reminders, new flatmate wave alerts, and cashback credits."
          benefits={[
            'Instant visit confirmation & landlord chat alerts',
            'Real-time flatmate matching & wave notifications',
            'Rent due reminders & payment receipt confirmations',
            'Exclusive deals & zero deposit eligibility alerts',
          ]}
          fullScreen={false}
        />
      ) : (
        <>
          {/* Category Tabs Strip */}
          <View style={styles.tabsStrip}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabsContent}
            >
              {TABS.map((tab) => {
                const isActive = activeTab === tab.key;
                const unread = unreadCounts[tab.key];
                return (
                  <Pressable
                    key={tab.key}
                    style={[styles.tabChip, isActive && styles.tabChipActive]}
                    onPress={() => {
                      setActiveTab(tab.key);
                      if (isSelectionMode) setSelectedIds([]);
                    }}
                  >
                    <Text
                      style={[
                        styles.tabChipText,
                        isActive && styles.tabChipTextActive,
                      ]}
                    >
                      {tab.label}
                    </Text>
                    {unread > 0 && (
                      <View
                        style={[
                          styles.tabBadge,
                          isActive && styles.tabBadgeActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.tabBadgeText,
                            isActive && styles.tabBadgeTextActive,
                          ]}
                        >
                          {unread > 99 ? '99+' : unread}
                        </Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Quick Mark All as Read Strip (when not in selection mode & unread exists) */}
          {!isSelectionMode && unreadNotificationCount > 0 && (
            <View style={styles.quickBar}>
              <Text style={styles.quickBarText}>
                {unreadNotificationCount} unread alert{unreadNotificationCount > 1 ? 's' : ''}
              </Text>
              <Pressable
                style={styles.markAllBtn}
                onPress={markAllNotificationsRead}
                accessibilityLabel="Mark all as read"
              >
                <CheckCheck size={14} color={V4_COLORS.primary} strokeWidth={2.4} />
                <Text style={styles.markAllBtnText}>Mark all read</Text>
              </Pressable>
            </View>
          )}

          {/* Bulk Selection Toolbar */}
          {isSelectionMode && (
            <View style={styles.bulkToolbar}>
              <View style={styles.bulkInfoCol}>
                <Text style={styles.bulkSelectedText}>
                  {selectedIds.length} of {filteredNotifications.length} selected
                </Text>
                <View style={styles.bulkSelectToggleRow}>
                  {selectedIds.length === filteredNotifications.length &&
                  filteredNotifications.length > 0 ? (
                    <Pressable onPress={deselectAll}>
                      <Text style={styles.bulkLinkText}>Deselect all</Text>
                    </Pressable>
                  ) : (
                    <Pressable onPress={selectAll}>
                      <Text style={styles.bulkLinkText}>Select all</Text>
                    </Pressable>
                  )}
                </View>
              </View>

              <View style={styles.bulkActionButtons}>
                <Pressable
                  style={[
                    styles.bulkActionBtn,
                    styles.bulkReadBtn,
                    selectedIds.length === 0 && styles.bulkBtnDisabled,
                  ]}
                  onPress={handleBulkMarkRead}
                  disabled={selectedIds.length === 0}
                >
                  <Check size={14} color={selectedIds.length > 0 ? '#0F766E' : '#94A3B8'} strokeWidth={2.5} />
                  <Text
                    style={[
                      styles.bulkActionText,
                      selectedIds.length === 0 && styles.bulkActionTextDisabled,
                    ]}
                  >
                    Read
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.bulkActionBtn,
                    styles.bulkDeleteBtn,
                    selectedIds.length === 0 && styles.bulkBtnDisabled,
                  ]}
                  onPress={handleBulkDelete}
                  disabled={selectedIds.length === 0}
                >
                  <Trash2 size={14} color={selectedIds.length > 0 ? '#DC2626' : '#94A3B8'} strokeWidth={2.2} />
                  <Text
                    style={[
                      styles.bulkDeleteText,
                      selectedIds.length === 0 && styles.bulkActionTextDisabled,
                    ]}
                  >
                    Delete
                  </Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Notifications Content Area */}
          {loading && notifications.length === 0 ? (
            <View style={styles.centerLoading}>
              <ActivityIndicator size="large" color={V4_COLORS.primary} />
              <Text style={styles.loadingText}>Loading notifications...</Text>
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={[
                styles.scrollContent,
                { paddingBottom: insets.bottom + 36 },
              ]}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={[V4_COLORS.primary]}
                  tintColor={V4_COLORS.primary}
                />
              }
            >
              {filteredNotifications.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <View style={styles.emptyIconCircle}>
                    <Bell size={36} color={V4_COLORS.primary} strokeWidth={2} />
                  </View>
                  <Text style={styles.emptyTitle}>
                    {searchQuery.trim()
                      ? 'No matching alerts found'
                      : activeTab === 'ALL'
                      ? "You're All Caught Up"
                      : `No ${TABS.find((t) => t.key === activeTab)?.label} Alerts`}
                  </Text>
                  <Text style={styles.emptySubtitle}>
                    {searchQuery.trim()
                      ? `We couldn't find any notifications matching "${searchQuery}". Try a different keyword.`
                      : activeTab === 'ALL'
                      ? 'When you schedule property visits, receive flatmate waves, or pay rent, notifications will appear here in real time.'
                      : `New alerts for ${TABS.find((t) => t.key === activeTab)?.label.toLowerCase()} will appear here as soon as they occur.`}
                  </Text>
                </View>
              ) : (
                groupedSections.map((section) => (
                  <View key={section.title} style={styles.sectionWrap}>
                    <View style={styles.sectionHeaderRow}>
                      <Text style={styles.sectionHeaderTitle}>{section.title}</Text>
                      <View style={styles.sectionHeaderBadge}>
                        <Text style={styles.sectionHeaderBadgeText}>{section.data.length}</Text>
                      </View>
                    </View>
                    {section.data.map((item) => {
                      const visuals = getItemVisuals(item);
                      const IconComp = visuals.icon;
                      const timeLabel = formatNotificationTime(item.created_at);
                      const isSelected = selectedIds.includes(item.id);

                      return (
                        <Pressable
                          key={item.id}
                          style={[
                            styles.notificationCard,
                            !item.read && styles.unreadCard,
                            isSelected && styles.selectedCard,
                          ]}
                          onPress={() => handleNotificationPress(item)}
                          accessibilityRole="button"
                        >
                          {/* Selection Checkbox in Select Mode */}
                          {isSelectionMode && (
                            <Pressable
                              style={styles.checkboxTouch}
                              onPress={() => toggleSelectId(item.id)}
                              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                              {isSelected ? (
                                <CheckSquare size={20} color={V4_COLORS.primary} strokeWidth={2.4} />
                              ) : (
                                <Square size={20} color="#94A3B8" strokeWidth={2} />
                              )}
                            </Pressable>
                          )}

                          {/* Icon Circle */}
                          <View
                            style={[
                              styles.iconCircle,
                              { backgroundColor: visuals.bg },
                            ]}
                          >
                            <IconComp size={18} color={visuals.color} strokeWidth={2.4} />
                          </View>

                          {/* Content */}
                          <View style={styles.textCol}>
                            <View style={styles.titleRow}>
                              <Text
                                style={[
                                  styles.title,
                                  !item.read && styles.unreadTitle,
                                ]}
                                numberOfLines={1}
                              >
                                {item.title}
                              </Text>
                              {!item.read && <View style={styles.unreadDot} />}
                            </View>

                            <Text style={styles.body} numberOfLines={2}>
                              {item.body || item.message || ''}
                            </Text>

                            {timeLabel ? (
                              <View style={styles.metaRow}>
                                <Clock size={11} color={V4_COLORS.textMuted} />
                                <Text style={styles.time}>{timeLabel}</Text>
                              </View>
                            ) : null}
                          </View>

                          {/* Quick Single Action: Delete or Read */}
                          {!isSelectionMode && (
                            <Pressable
                              style={styles.deleteBtn}
                              onPress={(e) => {
                                e.stopPropagation?.();
                                deleteNotification(item.id);
                              }}
                              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                              accessibilityLabel="Delete notification"
                            >
                              <Trash2 size={16} color="#94A3B8" strokeWidth={2} />
                            </Pressable>
                          )}
                        </Pressable>
                      );
                    })}
                  </View>
                ))
              )}
            </ScrollView>
          )}
        </>
      )}
    </View>
  );
};

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
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2ECEF',
    ...V4_SHADOWS.soft,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnActive: {
    backgroundColor: '#CCFBF1',
    borderWidth: 1,
    borderColor: '#0F766E',
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  headerCountBadge: {
    backgroundColor: V4_COLORS.primary,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  headerCountText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchBarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 4,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: V4_COLORS.textPrimary,
  },
  searchClearBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsStrip: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2ECEF',
  },
  tabsContent: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  tabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: 'transparent',
    minHeight: 36,
  },
  tabChipActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  tabChipText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: V4_COLORS.textSecondary,
  },
  tabChipTextActive: {
    color: '#FFFFFF',
  },
  tabBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  tabBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  tabBadgeTextActive: {
    color: '#FFFFFF',
  },
  quickBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F0FDFA',
    borderBottomWidth: 1,
    borderBottomColor: '#CCFBF1',
  },
  quickBarText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  markAllBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: V4_COLORS.primary,
  },
  bulkToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2ECEF',
    ...V4_SHADOWS.soft,
  },
  bulkInfoCol: {
    gap: 2,
  },
  bulkSelectedText: {
    fontSize: 13,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  bulkSelectToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bulkLinkText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: V4_COLORS.primary,
  },
  bulkActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bulkActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    minHeight: 34,
  },
  bulkReadBtn: {
    backgroundColor: '#CCFBF1',
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  bulkDeleteBtn: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  bulkBtnDisabled: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  bulkActionText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F766E',
  },
  bulkDeleteText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#DC2626',
  },
  bulkActionTextDisabled: {
    color: '#94A3B8',
  },
  centerLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    color: V4_COLORS.textSecondary,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
    gap: 10,
  },
  emptyContainer: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: V4_RADIUS.card,
    padding: 36,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    marginTop: 24,
    ...V4_SHADOWS.soft,
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(15, 118, 110, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: V4_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    gap: 12,
    ...V4_SHADOWS.soft,
  },
  unreadCard: {
    borderColor: '#99F6E4',
    backgroundColor: '#F0FDFA',
  },
  selectedCard: {
    borderColor: '#0F766E',
    backgroundColor: '#F0FDFA',
  },
  checkboxTouch: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    gap: 3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  title: {
    fontSize: 13.5,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
    flex: 1,
  },
  unreadTitle: {
    fontWeight: '900',
    color: '#064E3B',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: V4_COLORS.primary,
  },
  body: {
    fontSize: 12.5,
    color: V4_COLORS.textSecondary,
    lineHeight: 17,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  time: {
    fontSize: 11,
    color: V4_COLORS.textMuted,
    fontWeight: '600',
  },
  deleteBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionWrap: {
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    paddingVertical: 6,
    marginBottom: 4,
  },
  sectionHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F766E',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  sectionHeaderBadge: {
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  sectionHeaderBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F766E',
  },
});

