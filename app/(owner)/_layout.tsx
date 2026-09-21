import React, { useMemo } from 'react';
import { Tabs, useRouter, usePathname } from 'expo-router';
import { View, StyleSheet, ScrollView, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Sparkles,
  ShieldCheck,
  IndianRupee,
  FileText,
  Users,
} from 'lucide-react-native';
import {
  V4OwnerBottomNavigation,
  V4OwnerTab,
} from '../../src/components/v4/navigation/V4OwnerBottomNavigation';
import { V4OwnerTopHeader } from '../../src/components/v4/navigation/V4OwnerTopHeader';
import { V4Button } from '../../src/components/v4/ui/V4Button';
import { V4_COLORS, V4_SHADOWS } from '../../src/theme/v4Theme';
import { useAppStore } from '../../src/store/useAppStore';

export default function OwnerLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  // Atomic selectors to prevent full layout re-rendering
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const myProperties = useAppStore((state) => state.myProperties);
  const tenantLeads = useAppStore((state) => state.tenantLeads);
  const ownerProfile = useAppStore((state) => state.ownerProfile);
  const conversations = useAppStore((state) => state.conversations);

  const unreadMessagesCount = useMemo(() => {
    return (conversations || []).reduce((sum, c) => sum + (c.unread_count || 0), 0);
  }, [conversations]);

  const activeTab = useMemo<V4OwnerTab>(() => {
    if (pathname.includes('/listings')) return 'listings';
    if (pathname.includes('/messages') || pathname.includes('/inbox') || pathname.includes('/chat')) return 'inbox';
    if (pathname.includes('/leads')) return 'leads';
    if (pathname.includes('/wallet') || pathname.includes('/rent-collection')) return 'wallet';
    if (pathname.includes('/profile') || pathname.includes('/subscription')) return 'profile';
    return 'dashboard';
  }, [pathname]);

  const currentTitle = useMemo(() => {
    if (pathname.includes('/notifications')) return 'Host Notifications';
    if (pathname.includes('/messages') || pathname.includes('/inbox')) return 'Inbox & CRM';
    if (pathname.includes('/chat')) return 'Chat';
    if (pathname.includes('/listings')) return 'My Properties';
    if (pathname.includes('/leads')) return 'Tenant Leads CRM';
    if (pathname.includes('/wallet')) return 'Owner Wallet';
    if (pathname.includes('/profile')) return 'Host Profile';
    if (pathname.includes('/analytics')) return 'Property Analytics';
    if (pathname.includes('/visits')) return 'Visit Requests';
    if (pathname.includes('/rent-collection')) return 'Rent Collection';
    if (pathname.includes('/subscription')) return 'Subscription Plans';
    return 'Owner Dashboard';
  }, [pathname]);

  const handleTabPress = (tab: V4OwnerTab) => {
    switch (tab) {
      case 'dashboard':
        router.navigate('/(owner)/dashboard' as any);
        break;
      case 'listings':
        router.navigate('/(owner)/listings' as any);
        break;
      case 'inbox':
        router.navigate('/(owner)/inbox' as any);
        break;
      case 'leads':
        router.navigate('/(owner)/leads' as any);
        break;
      case 'wallet':
        router.navigate('/(owner)/wallet' as any);
        break;
      case 'profile':
        router.navigate('/(owner)/profile' as any);
        break;
      default:
        router.navigate('/(owner)/dashboard' as any);
        break;
    }
  };

  // ---------------------------------------------------------------------------
  // GUEST PROTECTION MODE: Guests never see Owner Navigation
  // ---------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <View style={[styles.guestRoot, { paddingTop: insets.top }]}>
        <ScrollView
          contentContainerStyle={[styles.guestScroll, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.guestHeroCard}>
            <View style={styles.guestBadge}>
              <Sparkles size={13} color="#065F46" />
              <Text style={styles.guestBadgeText}>0% COMMISSION DIRECT HOST</Text>
            </View>
            <Text style={styles.guestHeroTitle}>
              Turn Your Property Into A High-Yield Luxury Asset
            </Text>
            <Text style={styles.guestHeroSubtitle}>
              Join over 14,000+ elite landlords using REHVO’s automated rental ecosystem, DigiLocker verified tenants, and instant UPI AutoPay.
            </Text>

            <View style={styles.guestStatsRow}>
              <View style={styles.guestStatCol}>
                <Text style={styles.guestStatNum}>₹0</Text>
                <Text style={styles.guestStatLabel}>Commission</Text>
              </View>
              <View style={styles.guestStatDivider} />
              <View style={styles.guestStatCol}>
                <Text style={styles.guestStatNum}>4.8x</Text>
                <Text style={styles.guestStatLabel}>Faster Tenant Match</Text>
              </View>
              <View style={styles.guestStatDivider} />
              <View style={styles.guestStatCol}>
                <Text style={styles.guestStatNum}>100%</Text>
                <Text style={styles.guestStatLabel}>Digital E-Lease</Text>
              </View>
            </View>

            <View style={{ gap: 10, width: '100%', marginTop: 8 }}>
              <V4Button
                title="List Your Property"
                variant="primary"
                onPress={() => router.push('/(owner)/listing' as any)}
              />
              <V4Button
                title="View Owner Plans"
                variant="outline"
                onPress={() => router.push('/(owner)/subscription' as any)}
              />
              <V4Button
                title="Create Owner Account / Sign In"
                variant="secondary"
                onPress={() => router.push('/(auth)/login' as any)}
              />
            </View>
          </View>

          {/* Value Props */}
          <View style={styles.guestFeaturesWrap}>
            <Text style={styles.guestFeaturesTitle}>Why Host with REHVO?</Text>

            {[
              {
                icon: ShieldCheck,
                title: 'Government DigiLocker Verified Tenants',
                desc: 'Every tenant passes Aadhaar biometric, PAN OCR, and police verification.',
              },
              {
                icon: IndianRupee,
                title: 'Guaranteed Rent AutoPay',
                desc: 'Rent auto-settles directly into your bank on the 1st of every month.',
              },
              {
                icon: FileText,
                title: 'Legally Binding Digital E-Lease',
                desc: 'Instant 11-month state-stamped agreements generated right from your phone.',
              },
              {
                icon: Users,
                title: 'Comprehensive CRM & Lead Waves',
                desc: 'Screen profiles, schedule QR-verified visits, and approve leases in 1-tap.',
              },
            ].map((f, i) => (
              <View key={i} style={styles.guestFeatureCard}>
                <View style={styles.guestFeatureIconBox}>
                  <f.icon size={22} color="#0F766E" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.guestFeatureCardTitle}>{f.title}</Text>
                  <Text style={styles.guestFeatureCardDesc}>{f.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  // ---------------------------------------------------------------------------
  // AUTHENTICATED OWNER TABS + FLOATING BOTTOM NAVIGATION
  // ---------------------------------------------------------------------------
  const activeListingsCount = myProperties.filter(
    (p) => (p.status as any) === 'published' || (p.status as any) === 'ACTIVE'
  ).length;

  const unreadLeadsCount = tenantLeads.filter((l) => l.status === 'NEW').length;

  const isChatRoom = pathname.includes('/chat');
  const isMessagesScreen = pathname.includes('/messages');
  const isListingScreen = pathname.includes('/listing/') || pathname === '/(owner)/listing';
  const isRentalEstimator = pathname.includes('/rental-estimator');
  const hideLayoutHeader = isChatRoom || isMessagesScreen || isListingScreen || isRentalEstimator;
  const hideBottomNav = isChatRoom || isListingScreen || isRentalEstimator;

  return (
    <View style={styles.root} pointerEvents="box-none">
      {/* Centralized Owner Top Header */}
      {!hideLayoutHeader && <V4OwnerTopHeader title={currentTitle} />}

      <Tabs
        backBehavior="history"
        detachInactiveScreens={false}
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
          freezeOnBlur: true,
        }}
      >
        {/* Visible Tabs (5) */}
        <Tabs.Screen name="dashboard" />
        <Tabs.Screen name="listings" />
        <Tabs.Screen name="inbox" />
        <Tabs.Screen name="analytics" />
        <Tabs.Screen name="profile" />

        {/* Hidden Routes */}
        <Tabs.Screen name="leads" options={{ href: null }} />
        <Tabs.Screen name="visits" options={{ href: null }} />
        <Tabs.Screen name="rent-collection" options={{ href: null }} />
        <Tabs.Screen name="wallet" options={{ href: null }} />
        <Tabs.Screen name="subscription" options={{ href: null }} />
        <Tabs.Screen name="messages" options={{ href: null }} />
        <Tabs.Screen name="chat/[id]" options={{ href: null }} />
        <Tabs.Screen name="notifications" options={{ href: null }} />
        <Tabs.Screen name="rental-estimator" options={{ href: null }} />
        <Tabs.Screen name="listing" options={{ href: null }} />
        <Tabs.Screen name="business-suite" options={{ href: null }} />
      </Tabs>

      {/* REHVO Owner Floating Bottom Navigation Bar */}
      {!hideBottomNav && (
        <V4OwnerBottomNavigation
          activeTab={activeTab}
          onTabPress={handleTabPress}
          earningsBadge={true}
          listingsCount={activeListingsCount}
          leadsCount={unreadLeadsCount}
          unreadMessagesCount={unreadMessagesCount}
          walletBadgeCount={1}
          profileBadge={ownerProfile?.kyc_status !== 'VERIFIED'}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  guestRoot: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  guestScroll: {
    padding: 16,
  },
  guestHeroCard: {
    backgroundColor: '#064E3B',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    ...V4_SHADOWS.card,
  },
  guestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 12,
  },
  guestBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065F46',
  },
  guestHeroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 28,
  },
  guestHeroSubtitle: {
    fontSize: 13,
    color: '#A7F3D0',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
    marginBottom: 18,
  },
  guestStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  guestStatCol: {
    alignItems: 'center',
  },
  guestStatNum: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  guestStatLabel: {
    fontSize: 10,
    color: '#D1FAE5',
    fontWeight: '600',
    marginTop: 2,
  },
  guestStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  guestFeaturesWrap: {
    marginTop: 24,
  },
  guestFeaturesTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    marginBottom: 12,
  },
  guestFeatureCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    ...V4_SHADOWS.soft,
  },
  guestFeatureIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestFeatureCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  guestFeatureCardDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
    lineHeight: 16,
  },
});
