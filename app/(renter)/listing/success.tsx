import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  CheckCircle2,
  Eye,
  Home,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react-native';
import { useAppStore } from '../../../src/store/useAppStore';

export default function ListingSuccessRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const properties = useAppStore((s) => s.properties);
  const latestProperty = properties[0];

  const handleViewListing = () => {
    if (latestProperty) {
      router.replace(`/(renter)/property/${latestProperty.id}`);
    } else {
      router.replace('/(renter)/home');
    }
  };

  const handleBackHome = () => {
    router.replace('/(renter)/home');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Success Animated Card */}
        <View style={styles.successCard}>
          <View style={styles.iconCircle}>
            <CheckCircle2 size={40} color="#32B768" strokeWidth={2.2} />
          </View>
          <Text style={styles.title}>Your property is live!</Text>
          <Text style={styles.subtitle}>
            Your listing has been published and is now visible to thousands of verified renters searching in Mumbai.
          </Text>

          {/* Quick Stats Pill */}
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <ShieldCheck size={14} color="#32B768" strokeWidth={2.2} />
              <Text style={styles.badgeText}>Verified Listing</Text>
            </View>
            <View style={styles.badge}>
              <Sparkles size={14} color="#6C4DFF" strokeWidth={2.2} />
              <Text style={styles.badgeText}>Instant Visit Enabled</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom Action CTAs */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <Pressable
          style={styles.primaryBtn}
          onPress={handleViewListing}
          accessibilityRole="button"
          accessibilityLabel="View published property listing"
        >
          <Eye size={18} color="#FFFFFF" strokeWidth={2.2} />
          <Text style={styles.primaryBtnText}>View listing</Text>
          <ArrowRight size={17} color="#FFFFFF" strokeWidth={2.2} />
        </Pressable>

        <Pressable
          style={styles.secondaryBtn}
          onPress={handleBackHome}
          accessibilityRole="button"
          accessibilityLabel="Return to Home"
        >
          <Home size={17} color="#171522" strokeWidth={2} />
          <Text style={styles.secondaryBtnText}>Back to Home</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7F4',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
    padding: 28,
    alignItems: 'center',
    shadowColor: '#171522',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EAF8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#171522',
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 14,
    color: '#777482',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
    fontWeight: '500',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F7F5F0',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#171522',
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E5EC',
    gap: 10,
  },
  primaryBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#6C4DFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryBtn: {
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryBtnText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#171522',
  },
});
