import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Bell,
  CheckCheck,
  Users,
  Calendar,
  IndianRupee,
  ShieldCheck,
  Building2,
  Gift,
  TrendingUp,
  ChevronRight,
  Clock,
} from 'lucide-react-native';
import { OwnerNotificationCategory, OwnerNotificationRecord } from '../../../types';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { useAppStore } from '../../../store/useAppStore';

const CATEGORIES: { key: OwnerNotificationCategory | 'ALL'; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'LEADS', label: 'Leads' },
  { key: 'VISITS', label: 'Visits' },
  { key: 'RENT', label: 'Rent' },
  { key: 'WALLET', label: 'Wallet' },
  { key: 'VERIFICATION', label: 'Verification' },
  { key: 'LISTINGS', label: 'Listings' },
  { key: 'REWARDS', label: 'Rewards' },
];

export const V4OwnerNotificationsScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    ownerNotifications,
    unreadOwnerNotificationsCount,
    markOwnerNotificationRead,
    markAllOwnerNotificationsRead,
    fetchOwnerEcosystemData,
  } = useAppStore();

  const [activeCategory, setActiveCategory] = useState<OwnerNotificationCategory | 'ALL'>('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOwnerEcosystemData();
    setRefreshing(false);
  };

  const filteredNotifications = useMemo(() => {
    if (activeCategory === 'ALL') return ownerNotifications;
    return ownerNotifications.filter((n) => n.category === activeCategory);
  }, [ownerNotifications, activeCategory]);

  const handleNotificationClick = async (notif: OwnerNotificationRecord) => {
    if (!notif.is_read) {
      await markOwnerNotificationRead(notif.id);
    }
    if (notif.action_url) {
      router.push(notif.action_url as any);
    }
  };

  const getCategoryIcon = (category: OwnerNotificationCategory) => {
    switch (category) {
      case 'LEADS':
        return { icon: Users, color: '#D97706', bg: '#FEF3C7' };
      case 'VISITS':
        return { icon: Calendar, color: '#2563EB', bg: '#EFF6FF' };
      case 'RENT':
        return { icon: IndianRupee, color: '#16A34A', bg: '#DCFCE7' };
      case 'WALLET':
        return { icon: TrendingUp, color: '#0284C7', bg: '#E0F2FE' };
      case 'VERIFICATION':
        return { icon: ShieldCheck, color: '#059669', bg: '#D1FAE5' };
      case 'LISTINGS':
        return { icon: Building2, color: '#7E22CE', bg: '#F3E8FF' };
      case 'REWARDS':
      default:
        return { icon: Gift, color: '#DC2626', bg: '#FEE2E2' };
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Header */}
      <View style={styles.topNav}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color={V4_COLORS.textPrimary} />
        </Pressable>
        <View style={styles.topNavCenter}>
          <Text style={styles.topNavTitle}>Owner Notifications</Text>
          <Text style={styles.topNavSub}>
            {unreadOwnerNotificationsCount} Unread Alerts
          </Text>
        </View>
        <Pressable
          style={styles.markAllBtn}
          onPress={markAllOwnerNotificationsRead}
        >
          <CheckCheck size={20} color="#0F766E" />
        </Pressable>
      </View>

      {/* Category Filter Pills */}
      <View style={styles.categoryStripWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat.key;
            return (
              <Pressable
                key={cat.key}
                style={[styles.catPill, active && styles.catPillActive]}
                onPress={() => setActiveCategory(cat.key)}
              >
                <Text style={[styles.catPillTxt, active && styles.catPillTxtActive]}>
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Notifications List */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#0F766E" />
        }
      >
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Bell size={44} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptySub}>
              You're all caught up! Updates regarding leads, visits, and rent will appear here.
            </Text>
          </View>
        ) : (
          filteredNotifications.map((notif) => {
            const iconConfig = getCategoryIcon(notif.category);
            const Icon = iconConfig.icon;

            return (
              <Pressable
                key={notif.id}
                style={[
                  styles.notifCard,
                  !notif.is_read && styles.notifCardUnread,
                ]}
                onPress={() => handleNotificationClick(notif)}
              >
                <View style={[styles.iconBox, { backgroundColor: iconConfig.bg }]}>
                  <Icon size={20} color={iconConfig.color} />
                </View>

                <View style={{ flex: 1 }}>
                  <View style={styles.notifHeaderRow}>
                    <Text style={styles.notifCategory}>{notif.category}</Text>
                    {!notif.is_read && <View style={styles.unreadDot} />}
                  </View>

                  <Text style={styles.notifTitle}>{notif.title}</Text>
                  <Text style={styles.notifMsg}>{notif.message}</Text>

                  <View style={styles.timeRow}>
                    <Clock size={11} color="#94A3B8" />
                    <Text style={styles.timeTxt}>
                      {new Date(notif.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                </View>

                <ChevronRight size={18} color="#94A3B8" />
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topNavCenter: {
    alignItems: 'center',
  },
  topNavTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  topNavSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  markAllBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryStripWrap: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 10,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  catPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  catPillActive: {
    backgroundColor: '#064E3B',
  },
  catPillTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  catPillTxtActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    marginTop: 14,
  },
  emptySub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    ...V4_SHADOWS.soft,
  },
  notifCardUnread: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notifCategory: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10B981',
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    marginTop: 2,
  },
  notifMsg: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  timeTxt: {
    fontSize: 10.5,
    color: '#94A3B8',
    fontWeight: '500',
  },
});
