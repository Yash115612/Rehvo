import React, { useMemo, useState } from 'react';
import { Tabs, useRouter, usePathname } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import {
  FloatingBottomNav,
  RenterTab,
} from '../../src/components/navigation/FloatingBottomNav';
import { ContextualCreateSheet } from '../../src/components/navigation/ContextualCreateSheet';

export default function RenterLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const [createSheetVisible, setCreateSheetVisible] = useState(false);

  const activeTab = useMemo<RenterTab>(() => {
    if (pathname.includes('/home')) return 'home';
    if (pathname.includes('/search')) return 'search';
    if (pathname.includes('/saved')) return 'saved';
    if (pathname.includes('/profile')) return 'profile';
    return 'home';
  }, [pathname]);

  const handleTabPress = (tab: RenterTab) => {
    if (activeTab !== tab) {
      router.replace(`/(renter)/${tab}`);
    }
  };

  const handleOpenListProperty = () => {
    setCreateSheetVisible(true);
  };

  const isHiddenScreen =
    pathname.includes('/property/') ||
    pathname.includes('/visit/') ||
    pathname.includes('/listing/') ||
    pathname.includes('/chat') ||
    pathname.includes('/notification') ||
    pathname.includes('/settings') ||
    pathname.includes('/edit') ||
    pathname.includes('/add') ||
    pathname.includes('/flatmate');

  const showFloatingNav = !isHiddenScreen;

  return (
    <View style={styles.root} pointerEvents="box-none">
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
          tabBarButton: () => null,
        }}
      >
        <Tabs.Screen name="home" />
        <Tabs.Screen name="search" />
        <Tabs.Screen name="add" options={{ href: null }} />
        <Tabs.Screen name="saved" />
        <Tabs.Screen name="profile" />
        <Tabs.Screen name="rent" options={{ href: null }} />
        <Tabs.Screen name="pg" options={{ href: null }} />
        <Tabs.Screen name="rooms" options={{ href: null }} />
        <Tabs.Screen name="flatmates" options={{ href: null }} />
        <Tabs.Screen name="studios" options={{ href: null }} />
        <Tabs.Screen name="property/[id]" options={{ href: null }} />
        <Tabs.Screen name="visit/schedule" options={{ href: null }} />
        <Tabs.Screen name="listing" options={{ href: null }} />
        <Tabs.Screen name="settings" options={{ href: null }} />
        <Tabs.Screen name="chat/index" options={{ href: null }} />
        <Tabs.Screen name="chat/[id]" options={{ href: null }} />
      </Tabs>

      {showFloatingNav && (
        <FloatingBottomNav
          activeTab={activeTab}
          onTabPress={handleTabPress}
          onOpenListProperty={handleOpenListProperty}
        />
      )}

      <ContextualCreateSheet
        visible={createSheetVisible}
        onClose={() => setCreateSheetVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F7F5F0',
  },
});
