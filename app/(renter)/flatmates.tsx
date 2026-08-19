import React from 'react';
import { View, StyleSheet, ScrollView, Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useAppStore } from '../../src/store/useAppStore';
import { FlatmateDiscoveryFeed } from '../../src/components/flatmates/FlatmateDiscoveryFeed';
import { FlatmateProfile } from '../../src/types';

export default function FlatmatesDiscoveryPage() {
  const router = useRouter();
  const {
    flatmates,
    myFlatmateProfile,
    savedFlatmateIds,
    toggleSaveFlatmate,
  } = useAppStore();

  const handleSelectFlatmate = (profile: FlatmateProfile) => {
    router.push(`/(renter)/flatmate/${profile.id}`);
  };

  const handleCreateProfile = () => {
    router.push('/(renter)/flatmate/create');
  };

  const handleManageMyProfile = () => {
    router.push('/(renter)/flatmate/my-profile');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(renter)/home');
            }
          }}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Back to home"
        >
          <ArrowLeft size={20} color="#171522" strokeWidth={2.2} />
        </Pressable>
        <Text style={styles.headerTitle}>Flatmates</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <FlatmateDiscoveryFeed
          flatmates={flatmates}
          myProfile={myFlatmateProfile}
          savedFlatmateIds={savedFlatmateIds}
          onToggleSave={toggleSaveFlatmate}
          onSelectFlatmate={handleSelectFlatmate}
          onCreateProfile={handleCreateProfile}
          onManageMyProfile={handleManageMyProfile}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F7F4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EEE9',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F7F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#171522',
  },
  scrollContent: {
    paddingVertical: 14,
    gap: 14,
    paddingBottom: 40,
  },
});
