import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { V4OwnerPropertiesScreen } from '../../src/components/v4/screens/V4OwnerPropertiesScreen';
import { triggerTabHaptic } from '../../src/utils/haptics';
import { V4_SHADOWS } from '../../src/theme/v4Theme';

export default function OwnerListingsRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleAddProperty = () => {
    triggerTabHaptic();
    router.push('/(owner)/listing' as any);
  };

  return (
    <View style={styles.container}>
      <V4OwnerPropertiesScreen hideHeader />

      {/* Floating Action Button: Add Property (Listings Tab Exclusive) */}
      <Pressable
        style={[
          styles.fabBtn,
          { bottom: Math.max(insets.bottom, 12) + 94 },
        ]}
        onPress={handleAddProperty}
        accessibilityRole="button"
        accessibilityLabel="Add New Property Listing"
      >
        <View style={styles.fabIconCircle}>
          <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
        </View>
        <Text style={styles.fabText}>Add Property</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    position: 'relative',
  },
  fabBtn: {
    position: 'absolute',
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#064E3B',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#0F766E',
    zIndex: 50,
    ...V4_SHADOWS.floating,
    shadowColor: '#064E3B',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  fabIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});
