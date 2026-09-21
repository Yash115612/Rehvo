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
  ShieldCheck,
  Building2,
  Crown,
} from 'lucide-react-native';
import { V4_COLORS } from '../../../theme/v4Theme';
import { useAppStore } from '../../../store/useAppStore';

interface V4OwnerTopHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
}

const V4OwnerTopHeaderComponent: React.FC<V4OwnerTopHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const user = useAppStore((state) => state.user);
  const ownerProfile = useAppStore((state) => state.ownerProfile);
  const unreadOwnerNotificationsCount = useAppStore((state) => state.unreadOwnerNotificationsCount);
  const conversations = useAppStore((state) => state.conversations);

  const unreadChatCount = (conversations || []).reduce(
    (acc, c) => acc + (c.unread_count || 0),
    0
  );

  return (
    <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* Left: REHVO Owner Brand */}
      <View style={styles.leftCol}>
        <View style={styles.brandRow}>
          <Text style={styles.brandTitle}>REHVO</Text>
          <View style={styles.hostBadgePill}>
            <Text style={styles.hostBadgeTxt}>HOST</Text>
          </View>
        </View>
      </View>

      {/* Center: Current Page Title */}
      <View style={styles.centerCol}>
        <Text style={styles.headerTitleText} numberOfLines={1}>
          {title || 'Dashboard'}
        </Text>
      </View>

      {/* Right: Messages, Notifications, Avatar */}
      <View style={styles.rightActionsRow}>
        {/* Messages */}
        <Pressable
          style={styles.iconBtn}
          onPress={() => router.push('/(owner)/messages' as any)}
          accessibilityRole="button"
          accessibilityLabel="Open Host Chats"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MessageSquare size={19} color="#0F766E" />
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
          onPress={() => router.push('/(owner)/notifications' as any)}
          accessibilityRole="button"
          accessibilityLabel="Open Owner Notifications"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Bell size={19} color="#0F766E" />
          {unreadOwnerNotificationsCount > 0 && (
            <View style={styles.badgeWrap}>
              <Text style={styles.badgeTxt}>
                {unreadOwnerNotificationsCount > 9 ? '9+' : unreadOwnerNotificationsCount}
              </Text>
            </View>
          )}
        </Pressable>

        {/* Avatar */}
        <Pressable
          style={styles.avatarBtn}
          onPress={() => router.push('/(owner)/profile' as any)}
          accessibilityRole="button"
          accessibilityLabel="Open Host Profile"
        >
          <Image
            source={{
              uri:
                ownerProfile?.profile_photo ||
                user?.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
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
    minWidth: 90,
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
  hostBadgePill: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  hostBadgeTxt: {
    fontSize: 9,
    fontWeight: '800',
    color: '#065F46',
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
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#CCFBF1',
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
    borderColor: '#0F766E',
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
});

export const V4OwnerTopHeader = React.memo(V4OwnerTopHeaderComponent);
export default V4OwnerTopHeader;
