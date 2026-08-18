import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Users } from 'lucide-react-native';
import { useAppStore } from '../../../src/store/useAppStore';
import { FlatmateDetailsScreen } from '../../../src/components/flatmates/FlatmateDetailsScreen';
import * as flatmateService from '../../../src/services/flatmates';
import { FlatmateProfile } from '../../../src/types';

export default function FlatmateDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { flatmates, myFlatmateProfile } = useAppStore();

  const [remoteProfile, setRemoteProfile] = useState<FlatmateProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchAttempted, setFetchAttempted] = useState(false);

  const localProfile =
    flatmates.find((f) => f.id === id) ||
    (myFlatmateProfile?.id === id ? myFlatmateProfile : null);

  useEffect(() => {
    if (!localProfile && id) {
      setIsLoading(true);
      flatmateService.getFlatmateProfile(id).then((res) => {
        setIsLoading(false);
        setFetchAttempted(true);
        if (res.success && res.data) {
          setRemoteProfile(res.data);
        }
      });
    }
  }, [id, localProfile]);

  const profile = localProfile || remoteProfile;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#6C4DFF" />
          <Text style={styles.loadingText}>Loading flatmate profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!profile && (fetchAttempted || !id || flatmates.length > 0)) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable
            style={styles.backBtn}
            onPress={() => router.back()}
            hitSlop={8}
          >
            <ArrowLeft size={20} color="#171522" strokeWidth={2.2} />
          </Pressable>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.notFoundWrap}>
          <Users size={40} color="#777482" />
          <Text style={styles.notFoundTitle}>Flatmate profile not found</Text>
          <Text style={styles.notFoundSub}>
            This profile may have been paused or removed by the user.
          </Text>
          <Pressable
            style={styles.backHomeBtn}
            onPress={() => router.push('/(renter)/flatmates')}
          >
            <Text style={styles.backHomeBtnText}>Explore Flatmates</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#6C4DFF" />
        </View>
      </SafeAreaView>
    );
  }

  return <FlatmateDetailsScreen profile={profile} />;
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
    fontSize: 16.5,
    fontWeight: '800',
    color: '#171522',
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#777482',
  },
  notFoundWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    gap: 10,
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171522',
  },
  notFoundSub: {
    fontSize: 13.5,
    color: '#777482',
    textAlign: 'center',
  },
  backHomeBtn: {
    marginTop: 12,
    backgroundColor: '#6C4DFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  backHomeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
