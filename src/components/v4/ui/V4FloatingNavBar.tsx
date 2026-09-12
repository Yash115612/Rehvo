import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Home, Compass, MessageSquare, User, Plus } from 'lucide-react-native';
import { V4_COLORS } from '../../../theme/v4Theme';

export type V4TabType = 'home' | 'explore' | 'post' | 'chat' | 'profile' | 'saved';

interface V4FloatingNavBarProps {
  activeTab: V4TabType;
  onTabPress: (tab: V4TabType) => void;
  unreadChatCount?: number;
  visible?: boolean;
}

const MAIN_NAV_TABS: { id: V4TabType; label: string; icon: any }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'explore', label: 'Explore', icon: Compass },
  { id: 'chat', label: 'Message', icon: MessageSquare },
  { id: 'profile', label: 'Profile', icon: User },
];

const V4FloatingNavBarComponent: React.FC<V4FloatingNavBarProps> = ({
  activeTab,
  onTabPress,
  unreadChatCount = 0,
  visible = true,
}) => {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withTiming(visible ? 0 : 120, { duration: 260 });
  }, [visible]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.wrapper,
        { bottom: Math.max(insets.bottom, 12) + 4 },
        animatedContainerStyle,
      ]}
    >
      {/* =====================================================================
          CAPSULE 1: MAIN NAVIGATION ISLAND (Home, Explore, Message, Profile)
         ===================================================================== */}
      <View style={styles.mainNavIslandOuter}>
        <BlurView
          intensity={Platform.OS === 'ios' ? 70 : 85}
          tint="light"
          style={styles.blurContainer}
        >
          {/* Top Specular Highlight Line */}
          <View style={styles.specularHighlight} />

          <View style={styles.mainNavInner}>
            {MAIN_NAV_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const IconComp = tab.icon;

              return (
                <Pressable
                  key={tab.id}
                  style={styles.tabItem}
                  onPress={() => onTabPress(tab.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                >
                  <View
                    style={[
                      styles.iconWrap,
                      isActive ? styles.iconWrapActive : undefined,
                    ]}
                  >
                    <IconComp
                      size={18}
                      color={isActive ? '#FFFFFF' : '#64748B'}
                      strokeWidth={isActive ? 2.5 : 2}
                    />

                    {tab.id === 'chat' && unreadChatCount > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadBadgeText}>
                          {unreadChatCount > 9 ? '9+' : unreadChatCount}
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text
                    style={isActive ? styles.tabLabelActive : styles.tabLabel}
                  >
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </BlurView>
      </View>

      {/* =====================================================================
          CAPSULE 2: DEDICATED ACTION CAPSULE FOR '+' (Post / List / Flatmate)
         ===================================================================== */}
      <View style={styles.actionIslandOuter}>
        <BlurView
          intensity={Platform.OS === 'ios' ? 70 : 85}
          tint="light"
          style={styles.blurContainer}
        >
          {/* Top Specular Highlight */}
          <View style={styles.specularHighlightAction} />

          <Pressable
            style={({ pressed }) => [
              styles.actionButtonInner,
              pressed && styles.actionButtonPressed,
            ]}
            onPress={() => onTabPress('post')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <View style={styles.actionHeroCircle}>
              <Plus size={22} color="#FFFFFF" strokeWidth={2.8} />
            </View>
          </Pressable>
        </BlurView>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    zIndex: 99999,
    elevation: 25,
  },

  // =========================================================================
  // CAPSULE 1: MAIN NAVIGATION ISLAND
  // =========================================================================
  mainNavIslandOuter: {
    flex: 1,
    height: 66,
    borderRadius: 33,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.92)',
    shadowColor: '#031B2A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 22,
    elevation: 14,
  },
  blurContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  specularHighlight: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 1,
    zIndex: 10,
  },
  mainNavInner: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 4,
  },
  tabItem: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  iconWrap: {
    width: 38,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconWrapActive: {
    backgroundColor: V4_COLORS.primary,
    borderRadius: 14,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    letterSpacing: 0.1,
  },
  tabLabelActive: {
    fontSize: 10,
    fontWeight: '800',
    color: V4_COLORS.primary,
    letterSpacing: 0.1,
  },
  unreadBadge: {
    position: 'absolute',
    top: -2,
    right: 2,
    backgroundColor: '#EF4444',
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    paddingHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  unreadBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  // =========================================================================
  // CAPSULE 2: DEDICATED ACTION CAPSULE (+)
  // =========================================================================
  actionIslandOuter: {
    width: 66,
    height: 66,
    borderRadius: 33,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.92)',
    shadowColor: '#031B2A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 22,
    elevation: 14,
  },
  specularHighlightAction: {
    position: 'absolute',
    top: 0,
    left: 12,
    right: 12,
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 1,
    zIndex: 10,
  },
  actionButtonInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.92 }],
  },
  actionHeroCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: V4_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 8,
  },
});

export const V4FloatingNavBar = React.memo(V4FloatingNavBarComponent, (prevProps, nextProps) => {
  return (
    prevProps.activeTab === nextProps.activeTab &&
    prevProps.visible === nextProps.visible &&
    prevProps.unreadChatCount === nextProps.unreadChatCount
  );
});

export default V4FloatingNavBar;
