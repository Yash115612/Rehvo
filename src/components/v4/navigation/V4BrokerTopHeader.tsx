import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Bell,
  MessageSquare,
  Briefcase,
  ShieldCheck,
} from 'lucide-react-native';
import { V4_COLORS } from '../../../theme/v4Theme';
import { useAppStore } from '../../../store/useAppStore';

interface V4BrokerTopHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
}

export const V4BrokerTopHeader: React.FC<V4BrokerTopHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    user,
    brokerProfile,
    conversations,
  } = useAppStore();

  const unreadChatCount = (conversations || []).reduce(
    (acc, c) => acc + (c.unread_count || 0),
    0
  );

  return (
    <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* Left: REHVO Broker Brand */}
      <View style={styles.leftCol}>
        <View style={styles.brandRow}>
          <Text style={styles.brandTitle}>REHVO</Text>
          <View style={styles.brokerBadgePill}>
            <Text style={styles.brokerBadgeTxt}>PRO</Text>
          </View>
        </View>
      </View>

      {/* Center: Current Page Title */}
      <View style={styles.centerCol}>
        <Text style={styles.headerTitleText} numberOfLines={1}>
          {title || 'Broker CRM'}
        </Text>
      </View>

      {/* Right: Messages, Notifications, Avatar */}
      <View style={styles.rightActionsRow}>
        {/* Messages */}
        <Pressable
          style={styles.iconBtn}
          onPress={() => router.push('/(broker)/messages' as any)}
          accessibilityRole="button"
          accessibilityLabel="Open Broker Messages"
        >
          <MessageSquare size={19} color="#5B21B6" />
          {unreadChatCount > 0 && (
            <View style={styles.badgeWrap}>
              <Text style={styles.badgeTxt}>
                {unreadChatCount > 9 ? '9+' : unreadChatCount}
              </Text>
            </View>
          )}
        </Pressable>

        {/* Notifications */}
        <Pressable
          style={styles.iconBtn}
          onPress={() => router.push('/(renter)/owner-notifications' as any)}
          accessibilityRole="button"
          accessibilityLabel="Open Broker Notifications"
        >
          <Bell size={19} color="#5B21B6" />
        </Pressable>

        {/* Avatar */}
        <Pressable
          style={styles.avatarBtn}
          onPress={() => router.push('/(broker)/profile' as any)}
          accessibilityRole="button"
          accessibilityLabel="Open Broker Profile"
        >
          <Image
            source={{
              uri:
                brokerProfile?.company_logo ||
                user?.avatar ||
                'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
            }}
            style={styles.avatarImg}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  leftCol: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    minWidth: 92,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#064E3B',
    letterSpacing: 0.8,
  },
  brokerBadgePill: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  brokerBadgeTxt: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#5B21B6',
    letterSpacing: 0.5,
  },
  centerCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  headerTitleText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    textAlign: 'center',
  },
  rightActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 110,
    justifyContent: 'flex-end',
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FAF5FF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  badgeWrap: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    minWidth: 15,
    height: 15,
    borderRadius: 7.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeTxt: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  avatarBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: '#7C3AED',
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
});
