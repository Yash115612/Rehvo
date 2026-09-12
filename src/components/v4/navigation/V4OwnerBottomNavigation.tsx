import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import {
  LayoutDashboard,
  Building2,
  MessageSquare,
  Users,
  Wallet,
  CircleUser,
} from 'lucide-react-native';
import { V4_COLORS } from '../../../theme/v4Theme';
import { triggerTabHaptic } from '../../../utils/haptics';

export type V4OwnerTab = 'dashboard' | 'listings' | 'inbox' | 'leads' | 'wallet' | 'profile';

interface V4OwnerBottomNavigationProps {
  activeTab: V4OwnerTab;
  onTabPress: (tab: V4OwnerTab) => void;
  earningsBadge?: boolean;
  listingsCount?: number;
  leadsCount?: number;
  unreadMessagesCount?: number;
  walletBadgeCount?: number;
  profileBadge?: boolean;
  visible?: boolean;
}

const TABS: { id: V4OwnerTab; label: string; icon: any }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'listings', label: 'Listings', icon: Building2 },
  { id: 'inbox', label: 'Inbox', icon: MessageSquare },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'profile', label: 'Profile', icon: CircleUser },
];

export const V4OwnerBottomNavigation: React.FC<V4OwnerBottomNavigationProps> = ({
  activeTab,
  onTabPress,
  earningsBadge = true,
  listingsCount = 0,
  leadsCount = 0,
  unreadMessagesCount = 0,
  walletBadgeCount = 0,
  profileBadge = false,
  visible = true,
}) => {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(0);

  const effectiveInboxCount = Math.max(unreadMessagesCount, leadsCount);

  // Pulse animation for new leads / unread inbox
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    translateY.value = withTiming(visible ? 0 : 140, { duration: 280 });
  }, [visible]);

  useEffect(() => {
    if (effectiveInboxCount > 0) {
      pulseScale.value = withRepeat(
        withSequence(withTiming(1.2, { duration: 600 }), withTiming(1, { duration: 600 })),
        -1,
        true
      );
    } else {
      pulseScale.value = 1;
    }
  }, [effectiveInboxCount]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const animatedPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const handlePress = (tabId: V4OwnerTab) => {
    triggerTabHaptic();
    onTabPress(tabId);
  };

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.wrapper,
        { bottom: Math.max(insets.bottom, 12) + 6 },
        animatedContainerStyle,
      ]}
    >
      <View style={styles.floatingNavIsland}>
        <BlurView
          intensity={Platform.OS === 'ios' ? 80 : 90}
          tint="light"
          style={styles.blurContainer}
        >
          {/* Specular Liquid Highlight */}
          <View style={styles.specularHighlight} />

          <View style={styles.tabsRow}>
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const IconComp = tab.icon;

              return (
                <Pressable
                  key={tab.id}
                  style={styles.tabButton}
                  onPress={() => handlePress(tab.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                >
                  {/* Icon Capsule */}
                  <View
                    style={[
                      styles.iconCircle,
                      isActive ? styles.iconCircleActive : styles.iconCircleInactive,
                    ]}
                  >
                    <IconComp
                      size={20}
                      color={isActive ? '#FFFFFF' : '#64748B'}
                      strokeWidth={isActive ? 2.5 : 2}
                    />

                    {/* 1. Dashboard Earnings Badge */}
                    {tab.id === 'dashboard' && earningsBadge && (
                      <View style={styles.earningsDot} />
                    )}

                    {/* 2. Listings Count Badge */}
                    {tab.id === 'listings' && listingsCount > 0 && (
                      <View style={styles.countBadge}>
                        <Text style={styles.countBadgeTxt}>
                          {listingsCount > 9 ? '9+' : listingsCount}
                        </Text>
                      </View>
                    )}

                    {/* 3. Inbox / Leads Unread Pulse Badge */}
                    {(tab.id === 'inbox' || tab.id === 'leads') && effectiveInboxCount > 0 && (
                      <Animated.View style={[styles.leadsBadge, animatedPulseStyle]}>
                        <Text style={styles.leadsBadgeTxt}>
                          {effectiveInboxCount > 9 ? '9+' : effectiveInboxCount}
                        </Text>
                      </Animated.View>
                    )}

                    {/* 4. Wallet Pending Payout Badge */}
                    {tab.id === 'wallet' && walletBadgeCount > 0 && (
                      <View style={styles.walletBadge}>
                        <Text style={styles.walletBadgeTxt}>
                          {walletBadgeCount}
                        </Text>
                      </View>
                    )}

                    {/* 5. Profile Verification Pending Dot */}
                    {tab.id === 'profile' && profileBadge && (
                      <View style={styles.profileBadgeDot} />
                    )}
                  </View>

                  {/* Tab Label */}
                  <Text
                    style={[
                      styles.tabLabel,
                      isActive ? styles.tabLabelActive : styles.tabLabelInactive,
                    ]}
                    numberOfLines={1}
                  >
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </BlurView>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  floatingNavIsland: {
    width: '92%',
    maxWidth: 420,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    ...Platform.select({
      ios: {
        shadowColor: '#064E3B',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.16,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
      web: {
        boxShadow: '0 12px 32px rgba(6, 78, 59, 0.16)',
      },
    }),
  },
  blurContainer: {
    height: 86,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  specularHighlight: {
    position: 'absolute',
    top: 0,
    left: 24,
    right: 24,
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 1,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: '100%',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconCircleActive: {
    backgroundColor: '#064E3B',
    ...Platform.select({
      ios: {
        shadowColor: '#0F766E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 4px 14px rgba(15, 118, 110, 0.35)',
      },
    }),
  },
  iconCircleInactive: {
    backgroundColor: 'transparent',
    opacity: 0.75,
  },
  tabLabel: {
    fontSize: 10.5,
    marginTop: 3,
  },
  tabLabelActive: {
    fontWeight: '800',
    color: '#064E3B',
  },
  tabLabelInactive: {
    fontWeight: '600',
    color: '#64748B',
    opacity: 0.75,
  },

  // Badges
  earningsDot: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  countBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#0F766E',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  countBadgeTxt: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  leadsBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#D97706',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  leadsBadgeTxt: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  walletBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#16A34A',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  walletBadgeTxt: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileBadgeDot: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#F59E0B',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
});
