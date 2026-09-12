import React, { useMemo, useState } from 'react';
import { Tabs, useRouter, usePathname } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import {
  V4FloatingNavBar,
  V4TabType,
} from '../../src/components/v4/ui/V4FloatingNavBar';
import { V4PostActionModal } from '../../src/components/v4/ui/V4PostActionModal';
import { V4NotificationPermissionModal } from '../../src/components/v4/ui/V4NotificationPermissionModal';
import { usePushNotifications } from '../../src/hooks/usePushNotifications';
import { useAppStore } from '../../src/store/useAppStore';

export default function RenterLayout() {
  const router = useRouter();
  const pathname = usePathname();
  usePushNotifications();
  const {
    conversations,
    isNotificationPermissionModalVisible,
    setNotificationPermissionModalVisible,
    registerDevicePushToken,
  } = useAppStore();
  const [isPostModalVisible, setIsPostModalVisible] = useState(false);

  const unreadMessagesCount = useMemo(() => {
    return (conversations || []).reduce((acc, c) => acc + (c?.unread_count || 0), 0);
  }, [conversations]);

  const activeTab = useMemo<V4TabType>(() => {
    if (pathname.includes('/home') || pathname === '/' || pathname === '/(renter)') return 'home';
    if (
      pathname.includes('/search') ||
      pathname.includes('/explore') ||
      pathname.includes('/rent') ||
      pathname.includes('/commercial') ||
      pathname.includes('/pg') ||
      pathname.includes('/flatmates') ||
      pathname.includes('/rooms') ||
      pathname.includes('/studios') ||
      pathname.includes('/map')
    ) {
      return 'explore';
    }
    if (pathname.includes('/chat')) return 'chat';
    if (pathname.includes('/profile')) return 'profile';
    return 'home';
  }, [pathname]);

  const handleTabPress = (tab: V4TabType) => {
    switch (tab) {
      case 'home':
        router.replace('/(renter)/home');
        break;
      case 'explore':
        router.replace('/(renter)/search');
        break;
      case 'post':
        setIsPostModalVisible(true);
        break;
      case 'chat':
        router.replace('/(renter)/chat');
        break;
      case 'profile':
        router.replace('/(renter)/profile');
        break;
      case 'saved':
        router.replace('/(renter)/saved');
        break;
      default:
        router.replace('/(renter)/home');
        break;
    }
  };

  const isHiddenScreen = useMemo(() => {
    // Top-level main screens where floating navigation is ALWAYS visible
    const isMainTab =
      pathname.endsWith('/home') ||
      pathname.endsWith('/search') ||
      pathname.endsWith('/saved') ||
      pathname.endsWith('/chat') ||
      pathname.endsWith('/chat/index') ||
      pathname.endsWith('/profile');

    if (isMainTab) return false;

    // Chat conversation room (/chat/[id] where [id] is an actual conversation id)
    if (
      pathname.includes('/chat/') &&
      !pathname.endsWith('/chat') &&
      !pathname.includes('/chat/index')
    ) {
      return true;
    }

    // Sub-screens and detail flows where floating navigation should be hidden
    return true;
  }, [pathname]);

  const showFloatingNav = !isHiddenScreen;

  return (
    <View style={styles.root} pointerEvents="box-none">
      <Tabs
        backBehavior="history"
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
          tabBarButton: () => null,
          freezeOnBlur: true,
        }}
      >
        {/* =====================================================================
            1. MAIN BOTTOM TABS (ONLY 5 VISIBLE TABS)
           ===================================================================== */}
        <Tabs.Screen name="home" />
        <Tabs.Screen name="search" />
        <Tabs.Screen name="saved" />
        <Tabs.Screen name="chat/index" />
        <Tabs.Screen name="profile" />

        {/* =====================================================================
            2. CORE & ENTRY
           ===================================================================== */}
        <Tabs.Screen name="index" options={{ href: null }} />
        <Tabs.Screen name="add" options={{ href: null }} />
        <Tabs.Screen name="login" options={{ href: null }} />
        <Tabs.Screen name="host-plans" options={{ href: null }} />

        {/* =====================================================================
            3. PROPERTY ECOSYSTEM
           ===================================================================== */}
        <Tabs.Screen name="property/[id]" options={{ href: null }} />
        <Tabs.Screen name="property/[id]/gallery" options={{ href: null }} />
        <Tabs.Screen name="booking/tour" options={{ href: null }} />
        <Tabs.Screen name="booking/[id]" options={{ href: null }} />
        <Tabs.Screen name="bookings" options={{ href: null }} />
        <Tabs.Screen name="flats" options={{ href: null }} />
        <Tabs.Screen name="apartments" options={{ href: null }} />
        <Tabs.Screen name="pg" options={{ href: null }} />
        <Tabs.Screen name="hostel" options={{ href: null }} />
        <Tabs.Screen name="studios" options={{ href: null }} />
        <Tabs.Screen name="commercial" options={{ href: null }} />
        <Tabs.Screen name="office" options={{ href: null }} />
        <Tabs.Screen name="plots" options={{ href: null }} />
        <Tabs.Screen name="explore" options={{ href: null }} />
        <Tabs.Screen name="map" options={{ href: null }} />
        <Tabs.Screen name="visits" options={{ href: null }} />
        <Tabs.Screen name="listing" options={{ href: null }} />

        {/* =====================================================================
            4. FLATMATES
           ===================================================================== */}
        <Tabs.Screen name="flatmates" options={{ href: null }} />
        <Tabs.Screen name="flatmate/[id]" options={{ href: null }} />
        <Tabs.Screen name="flatmate/discover" options={{ href: null }} />
        <Tabs.Screen name="flatmate/matches" options={{ href: null }} />
        <Tabs.Screen name="flatmate/create" options={{ href: null }} />
        <Tabs.Screen name="flatmate/edit" options={{ href: null }} />
        <Tabs.Screen name="flatmate/my-profile" options={{ href: null }} />
        <Tabs.Screen name="flatmate/verification" options={{ href: null }} />
        <Tabs.Screen name="flatmate/compatibility/[id]" options={{ href: null }} />
        <Tabs.Screen name="flatmate/insights" options={{ href: null }} />
        <Tabs.Screen name="flatmate/chat/[id]" options={{ href: null }} />
        <Tabs.Screen name="flatmate/chat/index" options={{ href: null }} />
        <Tabs.Screen name="flatmate/explore" options={{ href: null }} />
        <Tabs.Screen name="flatmate/saved" options={{ href: null }} />
        <Tabs.Screen name="flatmate/waves" options={{ href: null }} />

        {/* =====================================================================
            5. CHAT ROOM
           ===================================================================== */}
        <Tabs.Screen name="chat/[id]" options={{ href: null }} />

        {/* =====================================================================
            6. WALLET + REWARDS
           ===================================================================== */}
        <Tabs.Screen name="wallet" options={{ href: null }} />
        <Tabs.Screen name="rcash" options={{ href: null }} />
        <Tabs.Screen name="rewards" options={{ href: null }} />
        <Tabs.Screen name="reward-history" options={{ href: null }} />
        <Tabs.Screen name="transactions" options={{ href: null }} />
        <Tabs.Screen name="share-earn" options={{ href: null }} />
        <Tabs.Screen name="challenges" options={{ href: null }} />

        {/* =====================================================================
            7. PAYMENTS
           ===================================================================== */}
        <Tabs.Screen name="pay-rent" options={{ href: null }} />
        <Tabs.Screen name="zero-deposit" options={{ href: null }} />

        {/* =====================================================================
            8. SOCIETY
           ===================================================================== */}
        <Tabs.Screen name="society/index" options={{ href: null }} />
        <Tabs.Screen name="society/visitor-pass" options={{ href: null }} />
        <Tabs.Screen name="society/delivery-pass" options={{ href: null }} />
        <Tabs.Screen name="society/maintenance" options={{ href: null }} />
        <Tabs.Screen name="society/complaints" options={{ href: null }} />
        <Tabs.Screen name="society/notices" options={{ href: null }} />
        <Tabs.Screen name="society/amenities" options={{ href: null }} />
        <Tabs.Screen name="society/sos" options={{ href: null }} />
        <Tabs.Screen name="society-pass" options={{ href: null }} />

        {/* =====================================================================
            9. UTILITIES
           ===================================================================== */}
        <Tabs.Screen name="utilities/index" options={{ href: null }} />
        <Tabs.Screen name="utilities/electricity" options={{ href: null }} />
        <Tabs.Screen name="utilities/gas" options={{ href: null }} />
        <Tabs.Screen name="utilities/water" options={{ href: null }} />
        <Tabs.Screen name="utilities/wifi" options={{ href: null }} />
        <Tabs.Screen name="utilities/broadband" options={{ href: null }} />
        <Tabs.Screen name="utilities/mobile" options={{ href: null }} />
        <Tabs.Screen name="utilities/dth" options={{ href: null }} />

        {/* =====================================================================
            10. RESIDENT SERVICES
           ===================================================================== */}
        <Tabs.Screen name="services/index" options={{ href: null }} />
        <Tabs.Screen name="services/[category]" options={{ href: null }} />
        <Tabs.Screen name="services/cleaning" options={{ href: null }} />
        <Tabs.Screen name="maintenance" options={{ href: null }} />
        <Tabs.Screen name="movers" options={{ href: null }} />
        <Tabs.Screen name="cleaning" options={{ href: null }} />
        <Tabs.Screen name="move-in" options={{ href: null }} />

        {/* =====================================================================
            11. LEGAL
           ===================================================================== */}
        <Tabs.Screen name="kyc" options={{ href: null }} />
        <Tabs.Screen name="rental-agreements" options={{ href: null }} />
        <Tabs.Screen name="document-vault" options={{ href: null }} />
        <Tabs.Screen name="document-scanner" options={{ href: null }} />

        {/* =====================================================================
            12. NOTIFICATIONS
           ===================================================================== */}
        <Tabs.Screen name="notifications" options={{ href: null }} />
        <Tabs.Screen name="notification-settings" options={{ href: null }} />
        <Tabs.Screen name="notification-preview" options={{ href: null }} />

        {/* =====================================================================
            13. PROFILE & SECURITY
           ===================================================================== */}
        <Tabs.Screen name="profile/edit" options={{ href: null }} />
        <Tabs.Screen name="settings" options={{ href: null }} />
        <Tabs.Screen name="safety" options={{ href: null }} />
        <Tabs.Screen name="sos" options={{ href: null }} />
        <Tabs.Screen name="privacy" options={{ href: null }} />
        <Tabs.Screen name="terms" options={{ href: null }} />
        <Tabs.Screen name="about" options={{ href: null }} />
        <Tabs.Screen name="help" options={{ href: null }} />

        {/* =====================================================================
            14. OWNER SHARED SCREENS
           ===================================================================== */}
        <Tabs.Screen name="manage-properties" options={{ href: null }} />
        <Tabs.Screen name="owner-dashboard" options={{ href: null }} />
        <Tabs.Screen name="owner-properties" options={{ href: null }} />
        <Tabs.Screen name="owner-leads" options={{ href: null }} />
        <Tabs.Screen name="owner-rent" options={{ href: null }} />
        <Tabs.Screen name="owner-visits" options={{ href: null }} />
        <Tabs.Screen name="owner-analytics" options={{ href: null }} />
        <Tabs.Screen name="owner-performance" options={{ href: null }} />
        <Tabs.Screen name="owner-notifications" options={{ href: null }} />
        <Tabs.Screen name="owner-documents" options={{ href: null }} />
        <Tabs.Screen name="owner-plans" options={{ href: null }} />

        {/* =====================================================================
            15. AI MODULES
           ===================================================================== */}
        <Tabs.Screen name="rental-estimator" options={{ href: null }} />
        <Tabs.Screen name="compare" options={{ href: null }} />
        <Tabs.Screen name="neighborhood/[locality]" options={{ href: null }} />
        <Tabs.Screen name="ai" options={{ href: null }} />

        {/* =====================================================================
            16. REHVO V7.2 PRODUCTION MODULES
           ===================================================================== */}
        <Tabs.Screen name="security" options={{ href: null }} />
        <Tabs.Screen name="support" options={{ href: null }} />
        <Tabs.Screen name="document-center" options={{ href: null }} />
        <Tabs.Screen name="onboarding" options={{ href: null }} />
        <Tabs.Screen name="admin-cms" options={{ href: null }} />
      </Tabs>

      {showFloatingNav && (
        <V4FloatingNavBar
          activeTab={activeTab}
          onTabPress={handleTabPress}
          unreadChatCount={unreadMessagesCount}
        />
      )}

      <V4PostActionModal
        visible={isPostModalVisible}
        onClose={() => setIsPostModalVisible(false)}
      />

      {Platform.OS !== 'web' && (
        <V4NotificationPermissionModal
          visible={isNotificationPermissionModalVisible}
          onAllow={async () => {
            setNotificationPermissionModalVisible(false);
            await registerDevicePushToken();
          }}
          onDismiss={() => setNotificationPermissionModalVisible(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFB',
  },
});
