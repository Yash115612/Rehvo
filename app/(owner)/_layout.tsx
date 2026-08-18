import React, { useMemo, useEffect, useRef } from 'react';
import { Tabs, useRouter, usePathname } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import {
  FloatingOwnerNav,
  OwnerTab,
} from '../../src/components/navigation/FloatingOwnerNav';
import { useAppStore, selectUserCapabilities } from '../../src/store/useAppStore';

export default function OwnerLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, properties, myFlatmateProfile, flatmateDraft } = useAppStore();

  const { hasPropertyListing } = useMemo(() => {
    return selectUserCapabilities({
      user,
      properties,
      myFlatmateProfile,
      flatmateDraft,
    });
  }, [user, properties, myFlatmateProfile, flatmateDraft]);

  const isListingScreen = pathname.includes('/listing');
  const isRedirectingRef = useRef(false);

  useEffect(() => {
    if (hasPropertyListing) {
      isRedirectingRef.current = false;
    }
  }, [hasPropertyListing]);

  // Route Guard: If user has no property listings and is trying to access owner dashboard/management tabs, redirect ONCE
  useEffect(() => {
    if (!hasPropertyListing && !isListingScreen && !isRedirectingRef.current) {
      isRedirectingRef.current = true;
      router.replace('/(renter)/profile');
    }
  }, [hasPropertyListing, isListingScreen, router]);

  const activeTab = useMemo<OwnerTab>(() => {
    if (pathname.includes('/dashboard')) return 'dashboard';
    if (pathname.includes('/properties')) return 'properties';
    if (pathname.includes('/enquiries')) return 'enquiries';
    if (pathname.includes('/visits')) return 'visits';
    if (pathname.includes('/profile')) return 'profile';
    return 'dashboard';
  }, [pathname]);

  const handleTabPress = (tab: OwnerTab) => {
    if (activeTab !== tab) {
      router.replace(`/(owner)/${tab}`);
    }
  };

  const isHiddenScreen =
    pathname.includes('/listing/') ||
    pathname.includes('/chat') ||
    pathname.includes('/settings');

  const showFloatingNav = !isHiddenScreen && hasPropertyListing;

  return (
    <View style={styles.root} pointerEvents="box-none">
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
          tabBarButton: () => null,
        }}
      >
        <Tabs.Screen name="dashboard" />
        <Tabs.Screen name="properties" />
        <Tabs.Screen name="enquiries" />
        <Tabs.Screen name="visits" />
        <Tabs.Screen name="profile" />
        <Tabs.Screen name="settings" options={{ href: null }} />
        <Tabs.Screen name="listing" options={{ href: null }} />
        <Tabs.Screen name="chat/index" options={{ href: null }} />
        <Tabs.Screen name="chat/[id]" options={{ href: null }} />
      </Tabs>

      {showFloatingNav && (
        <FloatingOwnerNav
          activeTab={activeTab}
          onTabPress={handleTabPress}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F7F5F0',
  },
});
