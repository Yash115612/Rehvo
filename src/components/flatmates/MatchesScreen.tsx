import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Search,
  Sparkles,
  Heart,
  X,
  Users,
} from 'lucide-react-native';
import { useAppStore } from '../../store/useAppStore';
import { FlatmateProfile } from '../../types';
import { V4MatchCard } from './ui/V4MatchCard';

export const MatchesScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    flatmates,
    myFlatmateProfile,
    startOrGetFlatmateConversation,
    showToast,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');

  // Curate mutual matches from flatmates list
  const matchesList = useMemo(() => {
    return flatmates.filter((fm) => {
      if (myFlatmateProfile && fm.id === myFlatmateProfile.id) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = fm.name.toLowerCase().includes(q);
        const matchesLoc = fm.locality?.toLowerCase().includes(q) || fm.city?.toLowerCase().includes(q);
        const matchesOcc = fm.occupation?.toLowerCase().includes(q) || fm.company_or_college?.toLowerCase().includes(q);
        if (!matchesName && !matchesLoc && !matchesOcc) return false;
      }
      return true;
    });
  }, [flatmates, myFlatmateProfile, searchQuery]);

  const handleStartChat = async (profile: FlatmateProfile) => {
    try {
      const convId = await startOrGetFlatmateConversation(profile);
      router.push(`/(renter)/chat/${convId}`);
    } catch {
      showToast('Could not start conversation.', 'error');
    }
  };

  const handleScheduleVisit = (profile: FlatmateProfile) => {
    showToast(`Opening visit scheduler with ${profile.name}`, 'info');
    handleStartChat(profile);
  };

  const handleShareProperty = (profile: FlatmateProfile) => {
    showToast(`Select property to share with ${profile.name}`, 'info');
    handleStartChat(profile);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* 1. Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <ArrowLeft size={20} color="#0F172A" strokeWidth={2.4} />
        </Pressable>

        <View style={styles.titleWrap}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Sparkles size={18} color="#059669" strokeWidth={2.4} />
            <Text style={styles.headerTitle}>Mutual Matches</Text>
          </View>
          <Text style={styles.headerSub}>
            {matchesList.length} roommates you mutually matched with
          </Text>
        </View>
      </View>

      {/* 2. Search inside Matches */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Search size={16} color="#059669" strokeWidth={2.4} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search within your matches..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
              <X size={16} color="#94A3B8" />
            </Pressable>
          )}
        </View>
      </View>

      {/* 3. Matches List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 60 },
        ]}
      >
        {matchesList.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Users size={40} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No Matches Found</Text>
            <Text style={styles.emptySub}>
              {searchQuery
                ? 'No matching roommates found for your search term.'
                : 'Send waves to compatible flatmates to form mutual matches!'}
            </Text>
            <Pressable
              style={styles.exploreBtn}
              onPress={() => router.push('/(renter)/flatmate/explore')}
            >
              <Text style={styles.exploreBtnText}>Explore Flatmates</Text>
            </Pressable>
          </View>
        ) : (
          matchesList.map((profile, idx) => (
            <V4MatchCard
              key={profile.id}
              profile={profile}
              lastActive={idx % 2 === 0 ? 'Active 5m ago' : 'Active 1h ago'}
              isOnline={idx % 2 === 0}
              onChat={() => handleStartChat(profile)}
              onScheduleVisit={() => handleScheduleVisit(profile)}
              onShareProperty={() => handleShareProperty(profile)}
              onViewProfile={() => router.push(`/(renter)/flatmate/${profile.id}`)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    flex: 1,
    gap: 2,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 12,
    color: '#64748B',
  },
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
  },
  searchBar: {
    height: 44,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0F172A',
    height: '100%',
  },
  listContent: {
    padding: 16,
    gap: 10,
  },
  emptyWrap: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 36,
    alignItems: 'center',
    gap: 10,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  emptySub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  exploreBtn: {
    marginTop: 8,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  exploreBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#059669',
  },
});
