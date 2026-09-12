import React, { useMemo } from 'react';
import { Tabs, useRouter, usePathname } from 'expo-router';
import { View, StyleSheet, ScrollView, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Sparkles,
  ShieldCheck,
  Briefcase,
  Building2,
  Users,
  TrendingUp,
} from 'lucide-react-native';
import {
  V4BrokerBottomNavigation,
  V4BrokerTab,
} from '../../src/components/v4/navigation/V4BrokerBottomNavigation';
import { V4BrokerTopHeader } from '../../src/components/v4/navigation/V4BrokerTopHeader';
import { V4Button } from '../../src/components/v4/ui/V4Button';
import { V4_COLORS, V4_SHADOWS } from '../../src/theme/v4Theme';
import { useAppStore } from '../../src/store/useAppStore';

export default function BrokerLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const {
    isAuthenticated,
    brokerProfile,
    brokerClients,
    brokerMetrics,
  } = useAppStore();

  const activeTab = useMemo<V4BrokerTab>(() => {
    if (pathname.includes('/inventory')) return 'inventory';
    if (pathname.includes('/clients')) return 'clients';
    if (pathname.includes('/messages')) return 'messages';
    if (pathname.includes('/profile')) return 'profile';
    return 'dashboard';
  }, [pathname]);

  const currentTitle = useMemo(() => {
    if (pathname.includes('/inventory')) return 'Inventory Pipeline';
    if (pathname.includes('/clients')) return 'Client Pipeline CRM';
    if (pathname.includes('/messages')) return 'Client Messages';
    if (pathname.includes('/profile')) return 'Broker Profile & Agency';
    return 'Broker Dashboard';
  }, [pathname]);

  const handleTabPress = (tab: V4BrokerTab) => {
    switch (tab) {
      case 'dashboard':
        router.replace('/(broker)/dashboard' as any);
        break;
      case 'inventory':
        router.replace('/(broker)/inventory' as any);
        break;
      case 'clients':
        router.replace('/(broker)/clients' as any);
        break;
      case 'messages':
        router.replace('/(broker)/messages' as any);
        break;
      case 'profile':
        router.replace('/(broker)/profile' as any);
        break;
      default:
        router.replace('/(broker)/dashboard' as any);
        break;
    }
  };

  // ---------------------------------------------------------------------------
  // GUEST PROTECTION MODE: Unauthenticated users see Broker Partner landing
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
              <Sparkles size={13} color="#5B21B6" />
              <Text style={styles.guestBadgeText}>REHVO PRO AGENT NETWORK</Text>
            </View>
            <Text style={styles.guestHeroTitle}>
              Scale Your Real Estate Agency With REHVO Pro
            </Text>
            <Text style={styles.guestHeroSubtitle}>
              Join over 2,500+ MahaRERA certified agents and agencies. Access verified prime inventory, close high-intent buyer leads, and manage deals in 1-tap.
            </Text>

            <View style={styles.guestStatsRow}>
              <View style={styles.guestStatCol}>
                <Text style={styles.guestStatNum}>₹0</Text>
                <Text style={styles.guestStatLabel}>Platform Fee</Text>
              </View>
              <View style={styles.guestStatDivider} />
              <View style={styles.guestStatCol}>
                <Text style={styles.guestStatNum}>100%</Text>
                <Text style={styles.guestStatLabel}>RERA Verified</Text>
              </View>
              <View style={styles.guestStatDivider} />
              <View style={styles.guestStatCol}>
                <Text style={styles.guestStatNum}>3.2x</Text>
                <Text style={styles.guestStatLabel}>Faster Closings</Text>
              </View>
            </View>

            <View style={{ gap: 10, width: '100%', marginTop: 8 }}>
              <V4Button
                label="Register Agency / Create Account"
                variant="primary"
                fullWidth
                onPress={() =>
                  router.push({
                    pathname: '/(auth)/login',
                    params: { mode: 'signup', role: 'broker' },
                  } as any)
                }
              />
              <V4Button
                label="Sign In to Broker Portal"
                variant="outline"
                fullWidth
                onPress={() =>
                  router.push({
                    pathname: '/(auth)/login',
                    params: { mode: 'signin', role: 'broker' },
                  } as any)
                }
              />
              <V4Button
                label="Switch to Renter Experience →"
                variant="ghost"
                fullWidth
                onPress={() => router.replace('/(renter)/home' as any)}
              />
            </View>
          </View>

          {/* Value Props */}
          <View style={styles.guestFeaturesWrap}>
            <Text style={styles.guestFeaturesTitle}>Why Partner with REHVO Pro?</Text>

            {[
              {
                icon: Building2,
                title: 'Curated Luxury Inventory Pipeline',
                desc: 'Access exclusive verified listings across Bandra, BKC, Worli, and Powai with clear owner commissions.',
              },
              {
                icon: Users,
                title: 'Pre-Screened Qualified Leads',
                desc: 'Connect directly with pre-verified high-budget corporate tenants and luxury home buyers.',
              },
              {
                icon: TrendingUp,
                title: 'Integrated Agency CRM & Kanban',
                desc: 'Track clients from site visit to agreement execution with built-in pipeline management.',
              },
              {
                icon: ShieldCheck,
                title: 'Official MahaRERA Verified Badge',
                desc: 'Build instant trust with clients through verified RERA certificate display and transparent credentials.',
              },
            ].map((f, i) => (
              <View key={i} style={styles.guestFeatureCard}>
                <View style={styles.guestFeatureIconBox}>
                  <f.icon size={22} color="#5B21B6" />
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
  // AUTHENTICATED BROKER TABS + FLOATING BOTTOM NAVIGATION
  // ---------------------------------------------------------------------------
  const activeClientsCount = (brokerClients || []).filter(
    (c) => c.stage !== 'CLOSED' && c.stage !== 'DROPPED' && c.stage !== 'LOST' && c.stage !== 'DEAL_CLOSED'
  ).length;

  const isChatRoom = pathname.includes('/chat');
  const hideBottomNav = isChatRoom;

  return (
    <View style={styles.root} pointerEvents="box-none">
      {/* Centralized Broker Top Header */}
      <V4BrokerTopHeader title={currentTitle} />

      <Tabs
        backBehavior="history"
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      >
        <Tabs.Screen name="dashboard" />
        <Tabs.Screen name="inventory" />
        <Tabs.Screen name="clients" />
        <Tabs.Screen name="messages" />
        <Tabs.Screen name="profile" />
      </Tabs>

      {/* REHVO Broker Floating Bottom Navigation Bar */}
      {!hideBottomNav && (
        <V4BrokerBottomNavigation
          activeTab={activeTab}
          onTabPress={handleTabPress}
          inventoryCount={brokerMetrics?.total_properties || brokerMetrics?.active_inventory_count || 14}
          clientsBadgeCount={activeClientsCount}
          unreadMessagesCount={1}
          profileBadge={!brokerProfile?.is_rera_verified && !brokerProfile?.verified}
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
    backgroundColor: '#1E1B4B',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    ...V4_SHADOWS.card,
  },
  guestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 12,
  },
  guestBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#5B21B6',
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
    color: '#DDD6FE',
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
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
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
    color: '#DDD6FE',
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
    backgroundColor: '#FAF5FF',
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
