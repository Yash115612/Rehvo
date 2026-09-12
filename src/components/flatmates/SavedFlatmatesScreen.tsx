import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Heart,
  Bookmark,
  Trash2,
  Share2,
  FolderPlus,
  Sparkles,
  MapPin,
  IndianRupee,
  MessageCircle,
  Users,
  ShieldCheck,
  BedDouble,
} from 'lucide-react-native';
import { useAppStore } from '../../store/useAppStore';
import { FlatmateProfile } from '../../types';
import { V4WaveButton } from './ui/V4WaveButton';

const COLLECTIONS = [
  { id: 'all', label: 'All Saved', icon: '❤️' },
  { id: 'favorites', label: 'Favorites', icon: '⭐' },
  { id: 'students', label: 'Students', icon: '🎓' },
  { id: 'professionals', label: 'Professionals', icon: '💼' },
  { id: 'pets', label: 'Pet Friendly', icon: '🐾' },
  { id: 'visited', label: 'Visited', icon: '📍' },
];

export const SavedFlatmatesScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    flatmates,
    savedFlatmateIds,
    toggleSaveFlatmate,
    wavedFlatmateIds,
    sendFlatmateWave,
    startOrGetFlatmateConversation,
    showToast,
  } = useAppStore();

  const [selectedCollection, setSelectedCollection] = useState('all');
  const [wavingIds, setWavingIds] = useState<{ [id: string]: boolean }>({});

  // Filter saved flatmates
  const savedProfiles = useMemo(() => {
    return flatmates.filter((fm) => {
      if (!savedFlatmateIds.includes(fm.id)) return false;

      if (selectedCollection === 'all' || selectedCollection === 'favorites') return true;
      if (selectedCollection === 'students') {
        return fm.user_type === 'student' || Boolean(fm.company_or_college?.toLowerCase().includes('college'));
      }
      if (selectedCollection === 'professionals') {
        return fm.user_type !== 'student';
      }
      if (selectedCollection === 'pets') {
        return fm.pets?.toLowerCase().includes('friendly') || fm.pets?.toLowerCase().includes('pet');
      }
      return true;
    });
  }, [flatmates, savedFlatmateIds, selectedCollection]);

  const handleWave = async (profile: FlatmateProfile) => {
    if (wavingIds[profile.id]) return;
    setWavingIds((prev) => ({ ...prev, [profile.id]: true }));

    try {
      await sendFlatmateWave(profile.id, profile.name, profile.avatar, profile.locality);
      showToast(`Wave sent to ${profile.name}! 👋`, 'success');
    } catch {
      showToast('Could not send wave.', 'error');
    } finally {
      setWavingIds((prev) => ({ ...prev, [profile.id]: false }));
    }
  };

  const handleStartChat = async (profile: FlatmateProfile) => {
    try {
      const convId = await startOrGetFlatmateConversation(profile);
      router.push(`/(renter)/chat/${convId}`);
    } catch {
      showToast('Could not start chat.', 'error');
    }
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
            <Heart size={18} color="#EF4444" fill="#EF4444" />
            <Text style={styles.headerTitle}>Saved Flatmates</Text>
          </View>
          <Text style={styles.headerSub}>{savedProfiles.length} saved prospective roommates</Text>
        </View>
      </View>

      {/* 2. Collection Switcher Tabs */}
      <View style={styles.collectionsBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.collectionsRail}
        >
          {COLLECTIONS.map((col) => {
            const isSelected = selectedCollection === col.id;
            return (
              <Pressable
                key={col.id}
                style={[styles.colChip, isSelected && styles.colChipSelected]}
                onPress={() => setSelectedCollection(col.id)}
              >
                <Text style={styles.colIcon}>{col.icon}</Text>
                <Text style={[styles.colLabel, isSelected && styles.colLabelSelected]}>
                  {col.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* 3. Saved Cards List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 60 },
        ]}
      >
        {savedProfiles.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Heart size={40} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No Saved Flatmates in this Collection</Text>
            <Text style={styles.emptySub}>
              Tap the heart icon on any flatmate card to shortlist them here.
            </Text>
            <Pressable
              style={styles.exploreBtn}
              onPress={() => router.push('/(renter)/flatmate/explore')}
            >
              <Text style={styles.exploreBtnText}>Discover Flatmates</Text>
            </Pressable>
          </View>
        ) : (
          savedProfiles.map((profile) => {
            const photo =
              (profile.photos && profile.photos[0]) ||
              profile.avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300';
            const isWaved = wavedFlatmateIds.includes(profile.id);

            return (
              <View key={profile.id} style={styles.card}>
                <Pressable
                  style={styles.cardTop}
                  onPress={() => router.push(`/(renter)/flatmate/${profile.id}`)}
                >
                  <Image source={{ uri: photo }} style={styles.avatar} resizeMode="cover" />

                  <View style={styles.infoWrap}>
                    <View style={styles.nameRow}>
                      <Text style={styles.nameText} numberOfLines={1}>
                        {profile.name}, {profile.age || 24}
                      </Text>
                      {profile.is_kyc_verified && (
                        <ShieldCheck size={14} color="#059669" strokeWidth={2.6} />
                      )}
                    </View>

                    <Text style={styles.occupationText} numberOfLines={1}>
                      {profile.occupation || 'Working Professional'}
                    </Text>

                    <View style={styles.locationRow}>
                      <MapPin size={12} color="#64748B" />
                      <Text style={styles.locationText} numberOfLines={1}>
                        {profile.locality || 'Mumbai'}
                      </Text>
                    </View>

                    <View style={styles.budgetValueRow}>
                      <IndianRupee size={12} color="#059669" />
                      <Text style={styles.budgetAmountText}>
                        ₹{((profile.budget_min || 15000) / 1000).toFixed(0)}k–₹{((profile.budget_max || 30000) / 1000).toFixed(0)}k/mo
                      </Text>
                    </View>
                  </View>

                  {/* Remove from Saved Button */}
                  <Pressable
                    style={styles.removeBtn}
                    onPress={() => toggleSaveFlatmate(profile.id)}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Remove from saved"
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </Pressable>
                </Pressable>

                {/* Bottom Action Strip */}
                <View style={styles.cardBottomRow}>
                  <Pressable
                    style={styles.chatBtn}
                    onPress={() => handleStartChat(profile)}
                  >
                    <MessageCircle size={15} color="#059669" strokeWidth={2.4} />
                    <Text style={styles.chatBtnText}>Chat</Text>
                  </Pressable>

                  <View style={{ flex: 1 }}>
                    <V4WaveButton
                      isWaved={isWaved}
                      isLoading={Boolean(wavingIds[profile.id])}
                      onPress={() => handleWave(profile)}
                      size="small"
                    />
                  </View>
                </View>
              </View>
            );
          })
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
  collectionsBar: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
  },
  collectionsRail: {
    paddingHorizontal: 16,
    gap: 8,
  },
  colChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },
  colChipSelected: {
    backgroundColor: '#ECFDF5',
    borderColor: '#059669',
  },
  colIcon: {
    fontSize: 13,
  },
  colLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  colLabelSelected: {
    color: '#059669',
    fontWeight: '800',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },
  infoWrap: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nameText: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  occupationText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  locationText: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '600',
  },
  budgetValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  budgetAmountText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#059669',
  },
  removeBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  chatBtn: {
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  chatBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#059669',
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
