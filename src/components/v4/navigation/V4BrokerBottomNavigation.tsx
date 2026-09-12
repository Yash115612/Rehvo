import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import {
  LayoutDashboard,
  Building2,
  Users,
  MessageSquare,
  CircleUser,
} from 'lucide-react-native';
import { V4_COLORS } from '../../../theme/v4Theme';
import { triggerTabHaptic } from '../../../utils/haptics';

export type V4BrokerTab = 'dashboard' | 'inventory' | 'clients' | 'messages' | 'profile';

interface V4BrokerBottomNavigationProps {
  activeTab: V4BrokerTab;
  onTabPress: (tab: V4BrokerTab) => void;
  inventoryCount?: number;
  clientsBadgeCount?: number;
  unreadMessagesCount?: number;
  profileBadge?: boolean;
  visible?: boolean;
}

const TABS: { id: V4BrokerTab; label: string; icon: any }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'inventory', label: 'Inventory', icon: Building2 },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'profile', label: 'Profile', icon: CircleUser },
];

export const V4BrokerBottomNavigation: React.FC<V4BrokerBottomNavigationProps> = ({
  activeTab,
  onTabPress,
  inventoryCount = 0,
  clientsBadgeCount = 0,
  unreadMessagesCount = 0,
  profileBadge = false,
  visible = true,
}) => {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    translateY.value = withTiming(visible ? 0 : 140, { duration: 280 });
  }, [visible]);

  useEffect(() => {
    if (clientsBadgeCount > 0) {
      pulseScale.value = withRepeat(
        withSequence(withTiming(1.2, { duration: 600 }), withTiming(1, { duration: 600 })),
        -1,
        true
      );
    } else {
      pulseScale.value = 1;
    }
  }, [clientsBadgeCount]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const animatedPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const handlePress = (tabId: V4BrokerTab) => {
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

                    {/* Inventory Count Badge */}
                    {tab.id === 'inventory' && inventoryCount > 0 && (
                      <View style={styles.countBadge}>
                        <Text style={styles.countBadgeTxt}>
                          {inventoryCount > 9 ? '9+' : inventoryCount}
                        </Text>
                      </View>
                    )}

                    {/* Clients Badge (Pulsing) */}
                    {tab.id === 'clients' && clientsBadgeCount > 0 && (
                      <Animated.View style={[styles.leadsBadge, animatedPulseStyle]}>
                        <Text style={styles.leadsBadgeTxt}>
                          {clientsBadgeCount > 9 ? '9+' : clientsBadgeCount}
                        </Text>
                      </Animated.View>
                    )}

                    {/* Messages Unread Badge */}
                    {tab.id === 'messages' && unreadMessagesCount > 0 && (
                      <View style={styles.messagesBadge}>
                        <Text style={styles.messagesBadgeTxt}>
                          {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                        </Text>
                      </View>
                    )}

                    {/* Profile Verification Badge */}
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
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.75)',
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
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 3,
  },
  iconCircleActive: {
    backgroundColor: '#064E3B',
    ...Platform.select({
      ios: {
        shadowColor: '#064E3B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 12px rgba(6, 78, 59, 0.35)',
      },
    }),
  },
  iconCircleInactive: {
    backgroundColor: 'transparent',
  },
  tabLabel: {
    fontSize: 10.5,
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    color: '#064E3B',
    fontWeight: '800',
  },
  tabLabelInactive: {
    color: '#64748B',
    fontWeight: '600',
  },
  countBadge: {
    position: 'absolute',
    top: -2,
    right: -3,
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
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '900',
  },
  leadsBadge: {
    position: 'absolute',
    top: -2,
    right: -3,
    backgroundColor: '#EF4444',
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
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '900',
  },
  messagesBadge: {
    position: 'absolute',
    top: -2,
    right: -3,
    backgroundColor: '#7C3AED',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  messagesBadgeTxt: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '900',
  },
  profileBadgeDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F59E0B',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
});
