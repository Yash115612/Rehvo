import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  X,
  Bell,
  MessageCircle,
  Calendar,
  Home,
  ShieldCheck,
  Tag,
  CheckCheck,
  Trash2,
  ChevronRight,
} from 'lucide-react-native';
import { useAppStore } from '../../store/useAppStore';
import * as notificationsService from '../../services/notifications';
import { NotificationItem } from '../../types';

interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  visible,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    notifications,
    unreadNotificationCount,
    user,
    currentRole,
    fetchNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    addRealtimeNotification,
  } = useAppStore();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch when opened
  useEffect(() => {
    if (visible) {
      setIsLoading(true);
      fetchNotifications().finally(() => setIsLoading(false));
    }
  }, [visible, fetchNotifications]);

  // Realtime subscription while modal is mounted
  useEffect(() => {
    if (!user?.id || !visible) return;

    const sub = notificationsService.subscribeToNotifications(user.id, (notif) => {
      addRealtimeNotification(notif);
    });

    return () => {
      sub.unsubscribe();
    };
  }, [user?.id, visible, addRealtimeNotification]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchNotifications();
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchNotifications]);

  const handleNotificationPress = async (item: NotificationItem) => {
    if (!item.read) {
      await markNotificationRead(item.id);
    }

    onClose();

    // Deep link routing based on payload
    const data = item.data || {};
    const isOwner = currentRole === 'OWNER' || user?.role === 'OWNER';

    if (data.conversation_id) {
      const chatRoute = isOwner
        ? `/(owner)/chat/${data.conversation_id}`
        : `/(renter)/chat/${data.conversation_id}`;
      router.push(chatRoute as any);
    } else if (data.property_id && item.type !== 'visit' && item.type !== 'application') {
      router.push(`/(renter)/property/${data.property_id}` as any);
    } else if (data.enquiry_id || item.type === 'application') {
      if (isOwner) {
        router.push('/(owner)/enquiries');
      } else {
        router.push('/(renter)/profile');
      }
    } else if (data.visit_id || item.type === 'visit') {
      if (isOwner) {
        router.push('/(owner)/visits');
      } else {
        router.push('/(renter)/profile');
      }
    } else if (item.type === 'verification') {
      router.push(isOwner ? '/(owner)/profile' : '/(renter)/profile');
    }
  };

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'message':
        return {
          icon: <MessageCircle size={18} color="#6C4DFF" strokeWidth={2.2} />,
          bg: '#F0ECFF',
        };
      case 'visit':
        return {
          icon: <Calendar size={18} color="#0284C7" strokeWidth={2.2} />,
          bg: '#E0F2FE',
        };
      case 'application':
        return {
          icon: <Home size={18} color="#D97706" strokeWidth={2.2} />,
          bg: '#FEF3C7',
        };
      case 'verification':
        return {
          icon: <ShieldCheck size={18} color="#059669" strokeWidth={2.2} />,
          bg: '#D1FAE5',
        };
      case 'price':
        return {
          icon: <Tag size={18} color="#E11D48" strokeWidth={2.2} />,
          bg: '#FFE4E6',
        };
      default:
        return {
          icon: <Bell size={18} color="#6C4DFF" strokeWidth={2.2} />,
          bg: '#F0ECFF',
        };
    }
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const diff = (Date.now() - new Date(isoString).getTime()) / 1000;
      if (diff < 60) return 'Just now';
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
      return new Date(isoString).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Recent';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* 1. Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Notifications</Text>
            {unreadNotificationCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{unreadNotificationCount}</Text>
              </View>
            )}
          </View>

          <View style={styles.headerRight}>
            {unreadNotificationCount > 0 && (
              <Pressable
                style={styles.markAllBtn}
                onPress={() => markAllNotificationsRead()}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Mark all as read"
              >
                <CheckCheck size={16} color="#6C4DFF" strokeWidth={2.2} />
                <Text style={styles.markAllBtnText}>Mark all read</Text>
              </Pressable>
            )}
            <Pressable
              style={styles.closeBtn}
              onPress={onClose}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Close notifications"
            >
              <X size={20} color="#171522" strokeWidth={2.2} />
            </Pressable>
          </View>
        </View>

        {/* 2. List */}
        {isLoading && notifications.length === 0 ? (
          <View style={styles.centerWrap}>
            <ActivityIndicator size="large" color="#6C4DFF" />
            <Text style={styles.loadingText}>Loading notifications...</Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                colors={['#6C4DFF']}
                tintColor="#6C4DFF"
              />
            }
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: Math.max(insets.bottom, 20) + 16 },
            ]}
            renderItem={({ item }) => {
              const { icon, bg } = getNotificationIcon(item.type);
              return (
                <Pressable
                  style={[styles.notifRow, !item.read && styles.notifRowUnread]}
                  onPress={() => handleNotificationPress(item)}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.title}. ${item.body}`}
                >
                  <View style={[styles.iconWrap, { backgroundColor: bg }]}>
                    {icon}
                  </View>

                  <View style={styles.contentCol}>
                    <View style={styles.topRow}>
                      <Text
                        style={[styles.notifTitle, !item.read && styles.notifTitleUnread]}
                        numberOfLines={1}
                      >
                        {item.title}
                      </Text>
                      <Text style={styles.timeText}>
                        {formatRelativeTime(item.created_at)}
                      </Text>
                    </View>

                    <Text
                      style={[styles.notifBody, !item.read && styles.notifBodyUnread]}
                      numberOfLines={2}
                    >
                      {item.body || item.message}
                    </Text>
                  </View>

                  <View style={styles.actionCol}>
                    {!item.read && <View style={styles.unreadDot} />}
                    <Pressable
                      style={styles.deleteBtn}
                      onPress={(e) => {
                        e.stopPropagation();
                        deleteNotification(item.id);
                      }}
                      hitSlop={8}
                      accessibilityRole="button"
                      accessibilityLabel="Delete notification"
                    >
                      <Trash2 size={15} color="#A8A4AF" strokeWidth={1.8} />
                    </Pressable>
                  </View>
                </Pressable>
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <View style={styles.emptyIconCircle}>
                  <Bell size={32} color="#6C4DFF" strokeWidth={1.8} />
                </View>
                <Text style={styles.emptyTitle}>You're all caught up</Text>
                <Text style={styles.emptySub}>
                  Important updates regarding messages, visits, enquiries, and verifications will appear here.
                </Text>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F7F4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E5EC',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.3,
  },
  unreadBadge: {
    backgroundColor: '#6C4DFF',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  unreadBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0ECFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  markAllBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F7F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 8,
  },
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#777482',
    fontWeight: '600',
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 14,
    gap: 12,
  },
  notifRowUnread: {
    backgroundColor: '#FAF9FF',
    borderColor: '#DED6FD',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  contentCol: {
    flex: 1,
    gap: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#171522',
    flex: 1,
    marginRight: 8,
  },
  notifTitleUnread: {
    fontWeight: '800',
    color: '#171522',
  },
  timeText: {
    fontSize: 11,
    color: '#86828F',
    fontWeight: '500',
  },
  notifBody: {
    fontSize: 12.5,
    color: '#777482',
    lineHeight: 17,
  },
  notifBodyUnread: {
    color: '#34303E',
    fontWeight: '500',
  },
  actionCol: {
    alignItems: 'center',
    gap: 10,
    marginTop: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6C4DFF',
  },
  deleteBtn: {
    padding: 4,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
    gap: 10,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0ECFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#171522',
  },
  emptySub: {
    fontSize: 13,
    color: '#777482',
    textAlign: 'center',
    lineHeight: 19,
    maxWidth: 280,
  },
});
