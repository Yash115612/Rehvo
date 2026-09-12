import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Heart,
  Hand,
  Bookmark,
  Sparkles,
  MessageCircle,
  Calendar,
  ShieldCheck,
  MapPin,
  Trash2,
  ChevronRight,
  Flame,
  CheckCircle2,
  Home,
  IndianRupee,
  Share2,
  Layers,
} from 'lucide-react-native';
import { V4_COLORS, V4_SHADOWS } from '../../../theme/v4Theme';
import { useAppStore } from '../../../store/useAppStore';
import { FlatmateProfile, FlatmateMatchRecord, Property } from '../../../types';
import { V4AuthGate } from '../ui/V4AuthGate';
import { V4Image } from '../ui/V4Image';
import { V4CompatibilityRing } from '../../flatmates/ui/V4CompatibilityRing';
import { getSharedApartmentSuggestions, SharedApartmentSuggestion } from '../../../services/apartmentSuggestions';
import * as flatmateService from '../../../services/flatmates';

const { width } = Dimensions.get('window');

type TabType = 'matches' | 'requests' | 'saved';

export const V4FlatmateMatchesScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    user,
    properties,
    flatmates,
    matchedFlatmateIds,
    acceptedWaveFlatmateIds,
    incomingWaves,
    savedFlatmateIds,
    myFlatmateProfile,
    unsaveFlatmate,
    acceptFlatmateWave,
    startOrGetFlatmateConversation,
    showToast,
    isAuthenticated,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<TabType>('matches');
  const [remoteMatches, setRemoteMatches] = useState<FlatmateMatchRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedApartmentMatchId, setSelectedApartmentMatchId] = useState<string | null>(null);

  const currentUserId = user?.id || myFlatmateProfile?.id || '';

  const loadLiveMatches = useCallback(async () => {
    if (!currentUserId) return;
    setIsLoading(true);
    const res = await flatmateService.fetchMatches(currentUserId);
    if (res.success && res.data) {
      setRemoteMatches(res.data);
    }
    setIsLoading(false);
  }, [currentUserId]);

  useEffect(() => {
    loadLiveMatches();
  }, [loadLiveMatches]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadLiveMatches();
    setIsRefreshing(false);
  };

  // Helper to resolve profile
  const resolveFlatmate = useCallback(
    (targetId: string): FlatmateProfile | undefined => {
      return flatmates.find((f) => f.id === targetId);
    },
    [flatmates]
  );

  // Matched profiles (both mutual likes, accepted waves, and remote matches)
  const matchedProfiles = useMemo(() => {
    const idsFromRemote = remoteMatches.map((rm) =>
      rm.user_1_id === currentUserId ? rm.user_2_id : rm.user_1_id
    );
    const allMatchedIds = Array.from(
      new Set([...matchedFlatmateIds, ...acceptedWaveFlatmateIds, ...idsFromRemote])
    );
    return flatmates.filter((fm) => allMatchedIds.includes(fm.id));
  }, [remoteMatches, currentUserId, flatmates, matchedFlatmateIds, acceptedWaveFlatmateIds]);

  // Saved profiles
  const savedProfiles = useMemo(() => {
    return flatmates.filter((fm) => savedFlatmateIds.includes(fm.id));
  }, [flatmates, savedFlatmateIds]);

  const handleStartChat = async (flatmate: FlatmateProfile) => {
    try {
      const convoId = await startOrGetFlatmateConversation(flatmate);
      router.push(`/(renter)/chat/${convoId}` as any);
    } catch {
      showToast('Could not open chat.', 'error');
    }
  };

  const handleScheduleVisit = (flatmate: FlatmateProfile) => {
    showToast(`Opening visit scheduler for ${flatmate.name}...`, 'info');
    router.push('/(renter)/visits' as any);
  };

  const handleAcceptWave = async (waveId: string, flatmateId: string, flatmateName: string) => {
    const convoId = await acceptFlatmateWave(waveId, flatmateId, flatmateName);
    showToast(`🎉 Match Created! Connected with ${flatmateName}.`, 'success');
    if (convoId) {
      router.push(`/(renter)/chat/${convoId}` as any);
    }
    loadLiveMatches();
  };

  if (!isAuthenticated) {
    return (
      <View style={[styles.root, { paddingTop: Math.max(insets.top, 14) }]}>
        <View style={styles.header}>
          <Pressable
            style={styles.backBtn}
            onPress={() => router.back()}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <ArrowLeft size={20} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
          </Pressable>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Matches & Waves</Text>
            <Text style={styles.headerSubtitle}>Manage your flatmate network</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <V4AuthGate
          title="Sign in to View Matches & Waves"
          description="Create an account or sign in to send waves, view mutual matches, and chat with verified flatmates."
          featureName="Matches & Waves"
          badgeText="ROOMMATE NETWORKING"
          icon={<Hand size={32} color="#059669" strokeWidth={2.4} />}
          benefits={[
            'Send instant waves to prospective flatmates',
            'Receive real-time match celebrations when interest is mutual',
            '1-tap direct chat with verified profiles',
            'Shared 2BHK/3BHK apartment suggestions with 50/50 rent split',
          ]}
          fullScreen={false}
        />
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <ArrowLeft size={20} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Matches & Connections</Text>
          <Text style={styles.headerSubtitle}>Manage your flatmate network</Text>
        </View>

        <Pressable
          style={styles.discoverBtn}
          onPress={() => router.push('/(renter)/flatmates' as any)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Swipe cards"
        >
          <Flame size={16} color="#0F766E" strokeWidth={2.4} />
          <Text style={styles.discoverBtnText}>Swipe</Text>
        </Pressable>
      </View>

      {/* Segmented Tab Controls */}
      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tabItem, activeTab === 'matches' && styles.tabItemActive]}
          onPress={() => setActiveTab('matches')}
          accessibilityRole="button"
          accessibilityLabel="Matches"
        >
          <Heart
            size={16}
            color={activeTab === 'matches' ? '#0F766E' : '#64748B'}
            fill={activeTab === 'matches' ? '#0F766E' : 'transparent'}
            strokeWidth={2.4}
          />
          <Text
            style={[
              styles.tabItemText,
              activeTab === 'matches' && styles.tabItemTextActive,
            ]}
          >
            Matches ({matchedProfiles.length})
          </Text>
        </Pressable>

        <Pressable
          style={[styles.tabItem, activeTab === 'requests' && styles.tabItemActive]}
          onPress={() => setActiveTab('requests')}
          accessibilityRole="button"
          accessibilityLabel="Incoming Waves"
        >
          <Hand
            size={16}
            color={activeTab === 'requests' ? '#0F766E' : '#64748B'}
            strokeWidth={2.4}
          />
          <Text
            style={[
              styles.tabItemText,
              activeTab === 'requests' && styles.tabItemTextActive,
            ]}
          >
            Waves ({incomingWaves.length})
          </Text>
        </Pressable>

        <Pressable
          style={[styles.tabItem, activeTab === 'saved' && styles.tabItemActive]}
          onPress={() => setActiveTab('saved')}
          accessibilityRole="button"
          accessibilityLabel="Saved flatmates"
        >
          <Bookmark
            size={16}
            color={activeTab === 'saved' ? '#0F766E' : '#64748B'}
            fill={activeTab === 'saved' ? '#0F766E' : 'transparent'}
            strokeWidth={2.4}
          />
          <Text
            style={[
              styles.tabItemText,
              activeTab === 'saved' && styles.tabItemTextActive,
            ]}
          >
            Saved ({savedProfiles.length})
          </Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 20) + 80 },
        ]}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#0F766E" />
        }
      >
        {isLoading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color="#0F766E" />
            <Text style={styles.loadingRowText}>Syncing matches...</Text>
          </View>
        )}

        {/* TAB 1: MUTUAL MATCHES */}
        {activeTab === 'matches' && (
          <View style={styles.listContainer}>
            {matchedProfiles.length === 0 ? (
              <View style={styles.emptyCard}>
                <View style={styles.emptyIconCircle}>
                  <Heart size={36} color="#0F766E" strokeWidth={2} />
                </View>
                <Text style={styles.emptyTitle}>No Mutual Matches Yet</Text>
                <Text style={styles.emptySubtitle}>
                  Swipe right on flatmates or send waves! When the interest is mutual, they will appear here with shared apartment recommendations.
                </Text>
                <Pressable
                  style={styles.ctaBtn}
                  onPress={() => router.push('/(renter)/flatmates' as any)}
                  accessibilityRole="button"
                >
                  <Flame size={16} color="#FFFFFF" strokeWidth={2.4} />
                  <Text style={styles.ctaBtnText}>Discover Flatmates</Text>
                </Pressable>
              </View>
            ) : (
              matchedProfiles.map((fm) => {
                const photo =
                  (fm.photos && fm.photos[0]) ||
                  fm.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';

                const suggestions = getSharedApartmentSuggestions(
                  fm,
                  myFlatmateProfile,
                  properties,
                  2
                );

                const isApartmentsExpanded = selectedApartmentMatchId === fm.id;

                return (
                  <View key={fm.id} style={styles.matchCard}>
                    {/* Top Main Row */}
                    <Pressable
                      style={styles.matchCardTop}
                      onPress={() => router.push(`/(renter)/flatmate/${fm.id}` as any)}
                      accessibilityRole="button"
                    >
                      <View style={styles.avatarWrap}>
                        <V4Image source={{ uri: photo }} style={styles.matchAvatar} resizeMode="cover" />
                        <View style={styles.onlineDot} />
                      </View>

                      <View style={{ flex: 1, gap: 2 }}>
                        <View style={styles.matchNameRow}>
                          <Text style={styles.matchName}>
                            {fm.name}{fm.age ? `, ${fm.age}` : ''}
                          </Text>
                          {fm.is_kyc_verified && (
                            <ShieldCheck size={15} color="#059669" strokeWidth={2.6} />
                          )}
                        </View>

                        <Text style={styles.matchSub} numberOfLines={1}>
                          {fm.profession || 'Professional'}
                          {fm.company_or_college ? ` • ${fm.company_or_college}` : ''}
                        </Text>

                        <View style={styles.matchMetaRow}>
                          <View style={styles.metaBadge}>
                            <MapPin size={11} color="#0F766E" />
                            <Text style={styles.metaBadgeText} numberOfLines={1}>
                              {fm.locality || 'Mumbai'}
                            </Text>
                          </View>
                          <View style={styles.metaBadgeGold}>
                            <IndianRupee size={11} color="#B45309" />
                            <Text style={styles.metaBadgeGoldText}>
                              ₹{Math.round((fm.budget_max || 25000) / 1000)}k/mo
                            </Text>
                          </View>
                        </View>
                      </View>

                      <V4CompatibilityRing
                        score={fm.match_score || fm.compatibility?.overall || 94}
                        size={46}
                        strokeWidth={3.5}
                        showLabel
                        labelText="MATCH"
                      />
                    </Pressable>

                    {/* Shared Apartments Suggestion Bar */}
                    {suggestions.length > 0 && (
                      <View style={styles.coLivingBox}>
                        <Pressable
                          style={styles.coLivingHeader}
                          onPress={() =>
                            setSelectedApartmentMatchId(
                              isApartmentsExpanded ? null : fm.id
                            )
                          }
                        >
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Home size={14} color="#0F766E" strokeWidth={2.4} />
                            <Text style={styles.coLivingHeaderText}>
                              {suggestions.length} Shared Apartments in Budget
                            </Text>
                          </View>
                          <ChevronRight
                            size={16}
                            color="#0F766E"
                            style={{
                              transform: [{ rotate: isApartmentsExpanded ? '90deg' : '0deg' }],
                            }}
                          />
                        </Pressable>

                        {isApartmentsExpanded && (
                          <View style={styles.coLivingList}>
                            {suggestions.map((sug, idx) => {
                              const propImg = sug.property.images?.[0];
                              const propImgUri =
                                typeof propImg === 'string'
                                  ? propImg
                                  : (propImg as any)?.url ||
                                    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400';

                              return (
                                <Pressable
                                  key={sug.property.id || idx}
                                  style={styles.coLivingCard}
                                  onPress={() => router.push(`/(renter)/property/${sug.property.id}` as any)}
                                >
                                  <V4Image
                                    source={{ uri: propImgUri }}
                                    style={styles.coLivingThumb}
                                    resizeMode="cover"
                                  />
                                  <View style={{ flex: 1, gap: 2 }}>
                                    <Text style={styles.coLivingTitle} numberOfLines={1}>
                                      {sug.property.title || `${sug.bhk} in ${sug.locality}`}
                                    </Text>
                                    <Text style={styles.coLivingSplitText}>
                                      Rent split: ₹{sug.splitRentPerPerson.toLocaleString('en-IN')}/mo each
                                    </Text>
                                    <Text style={styles.coLivingReason} numberOfLines={1}>
                                      ✨ {sug.matchReason}
                                    </Text>
                                  </View>
                                </Pressable>
                              );
                            })}
                          </View>
                        )}
                      </View>
                    )}

                    {/* Quick Actions */}
                    <View style={styles.matchActionsRow}>
                      <Pressable
                        style={styles.chatActionBtn}
                        onPress={() => handleStartChat(fm)}
                        accessibilityRole="button"
                        accessibilityLabel="Chat now"
                      >
                        <MessageCircle size={15} color="#FFFFFF" strokeWidth={2.4} />
                        <Text style={styles.chatActionBtnText}>Chat Now</Text>
                      </Pressable>

                      <Pressable
                        style={styles.visitActionBtn}
                        onPress={() => handleScheduleVisit(fm)}
                        accessibilityRole="button"
                        accessibilityLabel="Schedule visit"
                      >
                        <Calendar size={15} color="#0F766E" strokeWidth={2.4} />
                        <Text style={styles.visitActionBtnText}>Schedule Visit</Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        )}

        {/* TAB 2: INCOMING WAVES */}
        {activeTab === 'requests' && (
          <View style={styles.listContainer}>
            {incomingWaves.length === 0 ? (
              <View style={styles.emptyCard}>
                <View style={styles.emptyIconCircle}>
                  <Hand size={36} color="#0F766E" strokeWidth={2} />
                </View>
                <Text style={styles.emptyTitle}>No Incoming Waves</Text>
                <Text style={styles.emptySubtitle}>
                  When someone waves at your profile, their invitation will appear right here.
                </Text>
              </View>
            ) : (
              incomingWaves.map((wave) => (
                <View key={wave.id} style={styles.waveCard}>
                  <View style={styles.waveCardTop}>
                    <V4Image
                      source={{
                        uri:
                          wave.flatmate_avatar ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
                      }}
                      style={styles.matchAvatar}
                      resizeMode="cover"
                    />

                    <View style={{ flex: 1 }}>
                      <Text style={styles.waveName}>{wave.flatmate_name}</Text>
                      <Text style={styles.waveLoc}>
                        📍 Looking in {wave.locality || 'Mumbai'}
                      </Text>
                      <Text style={styles.waveNote}>
                        Waved at you to connect and explore co-living!
                      </Text>
                    </View>
                  </View>

                  {/* Accept action */}
                  <View style={styles.waveActions}>
                    <Pressable
                      style={styles.acceptWaveBtn}
                      onPress={() =>
                        handleAcceptWave(wave.id, wave.flatmate_id, wave.flatmate_name)
                      }
                      accessibilityRole="button"
                      accessibilityLabel="Accept wave"
                    >
                      <CheckCircle2 size={16} color="#FFFFFF" strokeWidth={2.4} />
                      <Text style={styles.acceptWaveBtnText}>Accept Wave 👋</Text>
                    </Pressable>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* TAB 3: SAVED PROFILES */}
        {activeTab === 'saved' && (
          <View style={styles.listContainer}>
            {savedProfiles.length === 0 ? (
              <View style={styles.emptyCard}>
                <View style={styles.emptyIconCircle}>
                  <Bookmark size={36} color="#0F766E" strokeWidth={2} />
                </View>
                <Text style={styles.emptyTitle}>No Saved Flatmates</Text>
                <Text style={styles.emptySubtitle}>
                  Bookmark flatmate profiles while browsing to easily revisit and contact them.
                </Text>
                <Pressable
                  style={styles.ctaBtn}
                  onPress={() => router.push('/(renter)/flatmates' as any)}
                  accessibilityRole="button"
                >
                  <Text style={styles.ctaBtnText}>Explore Flatmates Feed</Text>
                </Pressable>
              </View>
            ) : (
              savedProfiles.map((fm) => {
                const photo =
                  (fm.photos && fm.photos[0]) ||
                  fm.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';

                return (
                  <View key={fm.id} style={styles.savedCard}>
                    <Pressable
                      style={styles.savedCardTop}
                      onPress={() => router.push(`/(renter)/flatmate/${fm.id}` as any)}
                      accessibilityRole="button"
                    >
                      <V4Image
                        source={{ uri: photo }}
                        style={styles.matchAvatar}
                        resizeMode="cover"
                      />

                      <View style={{ flex: 1 }}>
                        <Text style={styles.matchName}>
                          {fm.name}{fm.age ? `, ${fm.age}` : ''}
                        </Text>
                        <Text style={styles.matchSub} numberOfLines={1}>
                          {fm.profession || 'Professional'}
                        </Text>
                        <Text style={styles.savedBudget}>
                          ₹{(fm.budget_max || 25000).toLocaleString('en-IN')}/mo
                        </Text>
                      </View>

                      <Pressable
                        style={styles.unsaveBtn}
                        onPress={() => unsaveFlatmate(fm.id)}
                        hitSlop={10}
                        accessibilityRole="button"
                        accessibilityLabel="Remove from saved"
                      >
                        <Trash2 size={16} color="#EF4444" />
                      </Pressable>
                    </Pressable>

                    <Pressable
                      style={styles.savedChatBtn}
                      onPress={() => handleStartChat(fm)}
                      accessibilityRole="button"
                    >
                      <MessageCircle size={15} color="#0F766E" strokeWidth={2.4} />
                      <Text style={styles.savedChatBtnText}>Start Conversation</Text>
                    </Pressable>
                  </View>
                );
              })
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
  },
  discoverBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    minHeight: 44,
  },
  discoverBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F766E',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
    gap: 8,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 40,
  },
  tabItemActive: {
    backgroundColor: '#F0FDFA',
    borderColor: '#0F766E',
  },
  tabItemText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  tabItemTextActive: {
    color: '#0F766E',
    fontWeight: '800',
  },
  scrollContent: {
    padding: 16,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: 12,
  },
  loadingRowText: {
    fontSize: 12,
    color: '#0F766E',
    fontWeight: '600',
  },
  listContainer: {
    gap: 12,
  },
  matchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  matchCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarWrap: {
    position: 'relative',
  },
  matchAvatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#E2E8F0',
  },
  onlineDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  matchNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  matchName: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  matchSub: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  matchMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  metaBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F766E',
  },
  metaBadgeGold: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  metaBadgeGoldText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  coLivingBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  coLivingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  coLivingHeaderText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F766E',
  },
  coLivingList: {
    paddingHorizontal: 12,
    paddingBottom: 10,
    gap: 8,
  },
  coLivingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  coLivingThumb: {
    width: 46,
    height: 46,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
  },
  coLivingTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  coLivingSplitText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  coLivingReason: {
    fontSize: 10.5,
    color: '#64748B',
  },
  matchActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chatActionBtn: {
    flex: 1,
    height: 44,
    backgroundColor: '#0F766E',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 2,
  },
  chatActionBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  visitActionBtn: {
    flex: 1,
    height: 44,
    backgroundColor: '#F0FDFA',
    borderWidth: 1.2,
    borderColor: '#0F766E',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  visitActionBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F766E',
  },
  waveCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 16,
    gap: 12,
  },
  waveCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  waveName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  waveLoc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  waveNote: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
  },
  waveActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  acceptWaveBtn: {
    flex: 1,
    height: 44,
    backgroundColor: '#0F766E',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  acceptWaveBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  savedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 16,
    gap: 12,
  },
  savedCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  savedBudget: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F766E',
    marginTop: 2,
  },
  unsaveBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedChatBtn: {
    height: 44,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  savedChatBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F766E',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    gap: 10,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    marginTop: 20,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  ctaBtn: {
    marginTop: 8,
    backgroundColor: '#0F766E',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ctaBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
