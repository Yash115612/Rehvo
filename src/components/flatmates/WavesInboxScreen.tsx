import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Flame,
  Hand,
  Check,
  X,
  MessageCircle,
  Clock,
  Sparkles,
  MapPin,
  IndianRupee,
  ShieldCheck,
  Zap,
  RotateCcw,
  Star,
  Layers,
} from 'lucide-react-native';
import { useAppStore } from '../../store/useAppStore';
import { FlatmateProfile, FlatmateWaveRecord } from '../../types';
import { V4CompatibilityRing } from './ui/V4CompatibilityRing';
import { MatchCelebrationModal } from './MatchCelebrationModal';
import { V4AuthGate } from '../v4/ui/V4AuthGate';
import { V4Image } from '../v4/ui/V4Image';
import * as flatmateService from '../../services/flatmates';

type WaveTab = 'incoming' | 'sent' | 'accepted' | 'super' | 'expired';

interface WaveCardItem {
  id: string;
  flatmate: FlatmateProfile;
  timeSent: string;
  expiresAt?: string;
  isSuperWave?: boolean;
  message?: string;
  status: 'pending' | 'accepted' | 'passed' | 'expired';
}

function calculateTimeRemaining(expiresAt?: string): { text: string; isExpiringSoon: boolean; isExpired: boolean } {
  if (!expiresAt) {
    return { text: '48h left', isExpiringSoon: false, isExpired: false };
  }
  const diffMs = new Date(expiresAt).getTime() - Date.now();
  if (diffMs <= 0) {
    return { text: 'Expired', isExpiringSoon: false, isExpired: true };
  }
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours >= 24) {
    return { text: `${hours}h remaining`, isExpiringSoon: false, isExpired: false };
  }
  if (hours > 0) {
    return { text: `${hours}h ${minutes}m left`, isExpiringSoon: hours < 12, isExpired: false };
  }
  return { text: `${minutes}m left!`, isExpiringSoon: true, isExpired: false };
}

export const WavesInboxScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    user,
    flatmates,
    myFlatmateProfile,
    wavedFlatmateIds,
    incomingWaves,
    acceptedWaveFlatmateIds,
    sendFlatmateWave,
    superWaveFlatmate,
    acceptFlatmateWave,
    declineFlatmateWave,
    startOrGetFlatmateConversation,
    showToast,
    isAuthenticated,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<WaveTab>('incoming');
  const [celebrationFlatmate, setCelebrationFlatmate] = useState<FlatmateProfile | null>(null);
  const [remoteWaves, setRemoteWaves] = useState<FlatmateWaveRecord[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingWaves, setIsLoadingWaves] = useState(false);
  const [, setTimerTick] = useState(0);

  // Live timer tick every 60s
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerTick((prev) => prev + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const userAvatar =
    user?.avatar_url ||
    user?.avatar ||
    myFlatmateProfile?.avatar ||
    myFlatmateProfile?.photos?.[0] ||
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';

  const currentUserId = user?.id || myFlatmateProfile?.id || '';

  // Fetch live waves from Supabase
  const loadLiveWaves = useCallback(async () => {
    if (!currentUserId) return;
    setIsLoadingWaves(true);
    const filterKey: flatmateService.WaveTabFilter =
      activeTab === 'super' ? 'super' : activeTab;
    const res = await flatmateService.fetchWaves(currentUserId, filterKey);
    if (res.success && res.data) {
      setRemoteWaves(res.data);
    }
    setIsLoadingWaves(false);
  }, [currentUserId, activeTab]);

  useEffect(() => {
    loadLiveWaves();
  }, [loadLiveWaves]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadLiveWaves();
    setIsRefreshing(false);
  };

  // Helper to resolve FlatmateProfile from wave record or store
  const resolveFlatmate = useCallback(
    (fmId: string, fallbackName?: string, fallbackAvatar?: string): FlatmateProfile => {
      const match = flatmates.find((f) => f.id === fmId);
      if (match) return match;
      return {
        id: fmId,
        name: fallbackName || 'Flatmate Partner',
        avatar: fallbackAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
        photos: [fallbackAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'],
        locality: 'Bandra West, Mumbai',
        city: 'Mumbai',
        budget_min: 25000,
        budget_max: 40000,
        occupation: 'Product Designer',
        age: 25,
        gender: 'female',
        cleanliness: 'neat',
        sleep_schedule: 'early_bird',
        food_preference: 'veg',
        smoking: 'non_smoker',
        drinking: 'socially',
        pet_friendly: 'yes',
        move_in_date: 'Immediately',
        bio: 'Hey! Looking for a peaceful and tidy flatmate to co-live.',
        match_score: 94,
        is_kyc_verified: true,
      };
    },
    [flatmates]
  );

  // 1. Incoming Waves
  const incomingItems: WaveCardItem[] = useMemo(() => {
    if (remoteWaves.length > 0 && activeTab === 'incoming') {
      return remoteWaves.map((rw) => ({
        id: rw.id,
        flatmate: resolveFlatmate(rw.sender_id),
        timeSent: rw.created_at ? new Date(rw.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
        expiresAt: rw.expires_at,
        isSuperWave: rw.is_super_wave,
        message: rw.message,
        status: rw.status as any,
      }));
    }

    return incomingWaves
      .filter((w) => w.status === 'pending')
      .map((w) => ({
        id: w.id,
        flatmate: resolveFlatmate(w.flatmate_id, w.flatmate_name, w.flatmate_avatar),
        timeSent: 'Just now',
        expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
        isSuperWave: w.is_super_wave,
        message: w.message,
        status: w.status,
      }));
  }, [remoteWaves, activeTab, incomingWaves, resolveFlatmate]);

  // 2. Sent Waves
  const sentItems: WaveCardItem[] = useMemo(() => {
    if (remoteWaves.length > 0 && activeTab === 'sent') {
      return remoteWaves.map((rw) => ({
        id: rw.id,
        flatmate: resolveFlatmate(rw.receiver_id),
        timeSent: rw.created_at ? new Date(rw.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sent recently',
        expiresAt: rw.expires_at,
        isSuperWave: rw.is_super_wave,
        message: rw.message,
        status: 'pending',
      }));
    }

    return flatmates
      .filter((fm) => wavedFlatmateIds.includes(fm.id))
      .map((fm) => ({
        id: `sent-${fm.id}`,
        flatmate: fm,
        timeSent: 'Sent recently',
        expiresAt: new Date(Date.now() + 44 * 3600 * 1000).toISOString(),
        status: 'pending',
      }));
  }, [remoteWaves, activeTab, flatmates, wavedFlatmateIds, resolveFlatmate]);

  // 3. Accepted Waves
  const acceptedItems: WaveCardItem[] = useMemo(() => {
    if (remoteWaves.length > 0 && activeTab === 'accepted') {
      return remoteWaves.map((rw) => {
        const partnerId = rw.sender_id === currentUserId ? rw.receiver_id : rw.sender_id;
        return {
          id: rw.id,
          flatmate: resolveFlatmate(partnerId),
          timeSent: 'Matched',
          isSuperWave: rw.is_super_wave,
          status: 'accepted' as const,
        };
      });
    }

    const acceptedFromIncoming = incomingWaves
      .filter((w) => w.status === 'accepted')
      .map((w) => ({
        id: w.id,
        flatmate: resolveFlatmate(w.flatmate_id, w.flatmate_name, w.flatmate_avatar),
        timeSent: 'Accepted',
        status: 'accepted' as const,
      }));

    const acceptedFromIds = flatmates
      .filter((fm) => acceptedWaveFlatmateIds.includes(fm.id))
      .map((fm) => ({
        id: `acc-${fm.id}`,
        flatmate: fm,
        timeSent: 'Mutual Wave',
        status: 'accepted' as const,
      }));

    const map = new Map<string, WaveCardItem>();
    [...acceptedFromIncoming, ...acceptedFromIds].forEach((item) => {
      map.set(item.flatmate.id, item);
    });
    return Array.from(map.values());
  }, [remoteWaves, activeTab, currentUserId, incomingWaves, flatmates, acceptedWaveFlatmateIds, resolveFlatmate]);

  // 4. Super Waves
  const superItems: WaveCardItem[] = useMemo(() => {
    if (remoteWaves.length > 0 && activeTab === 'super') {
      return remoteWaves.map((rw) => {
        const partnerId = rw.sender_id === currentUserId ? rw.receiver_id : rw.sender_id;
        return {
          id: rw.id,
          flatmate: resolveFlatmate(partnerId),
          timeSent: 'Super Wave',
          expiresAt: rw.expires_at,
          isSuperWave: true,
          message: rw.message || 'Sent a priority Super Wave to connect!',
          status: rw.status as any,
        };
      });
    }

    return incomingWaves
      .filter((w) => w.is_super_wave)
      .map((w) => ({
        id: w.id,
        flatmate: resolveFlatmate(w.flatmate_id, w.flatmate_name, w.flatmate_avatar),
        timeSent: 'Super Wave',
        expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
        isSuperWave: true,
        message: w.message || 'Sent a priority Super Wave to connect!',
        status: w.status,
      }));
  }, [remoteWaves, activeTab, currentUserId, incomingWaves, resolveFlatmate]);

  // 5. Expired Waves
  const expiredItems: WaveCardItem[] = useMemo(() => {
    if (remoteWaves.length > 0 && activeTab === 'expired') {
      return remoteWaves.map((rw) => {
        const partnerId = rw.sender_id === currentUserId ? rw.receiver_id : rw.sender_id;
        return {
          id: rw.id,
          flatmate: resolveFlatmate(partnerId),
          timeSent: 'Expired',
          expiresAt: rw.expires_at,
          isSuperWave: rw.is_super_wave,
          status: 'expired' as const,
        };
      });
    }

    return [];
  }, [remoteWaves, activeTab, currentUserId, resolveFlatmate]);

  const handleAcceptWave = async (wave: WaveCardItem) => {
    await acceptFlatmateWave(wave.id, wave.flatmate.id, wave.flatmate.name);
    setCelebrationFlatmate(wave.flatmate);
    loadLiveWaves();
  };

  const handlePassWave = async (waveId: string) => {
    await declineFlatmateWave(waveId);
    showToast('Wave dismissed.', 'info');
    loadLiveWaves();
  };

  const handleReWave = async (fm: FlatmateProfile) => {
    const res = await sendFlatmateWave(fm.id, fm.name, fm.avatar || fm.photos?.[0], fm.locality);
    if (res.success) {
      showToast(`👋 Re-waved at ${fm.name}! 48h timer renewed.`, 'success');
      loadLiveWaves();
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

  const pendingReceivedCount = incomingItems.length;

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
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
              <Flame size={18} color="#059669" strokeWidth={2.4} />
              <Text style={styles.headerTitle}>Waves Inbox</Text>
            </View>
            <Text style={styles.headerSub}>Incoming roommate waves</Text>
          </View>
        </View>

        <V4AuthGate
          title="Sign in to View Waves"
          description="Create an account or sign in to view incoming waves, send invitations, and connect with flatmates."
          featureName="Waves Inbox"
          badgeText="ROOMMATE WAVES"
          icon={<Hand size={32} color="#059669" strokeWidth={2.4} />}
          benefits={[
            'Send instant waves to prospective flatmates',
            'Receive real-time match celebrations when interest is mutual',
            '1-tap direct chat without paying any brokerage',
            '48-hour live countdown timers & priority Super Waves',
          ]}
          fullScreen={false}
        />
      </SafeAreaView>
    );
  }

  const tabsConfig: { key: WaveTab; label: string; count: number; icon: any }[] = [
    { key: 'incoming', label: 'Incoming', count: pendingReceivedCount, icon: Flame },
    { key: 'sent', label: 'Sent', count: sentItems.length, icon: Hand },
    { key: 'accepted', label: 'Accepted', count: acceptedItems.length, icon: Sparkles },
    { key: 'super', label: 'Super Waves', count: superItems.length, icon: Star },
    { key: 'expired', label: 'Expired', count: expiredItems.length, icon: Clock },
  ];

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
            <Flame size={18} color="#059669" strokeWidth={2.4} />
            <Text style={styles.headerTitle}>Waves Inbox</Text>
          </View>
          <Text style={styles.headerSub}>
            {pendingReceivedCount} pending incoming waves
          </Text>
        </View>

        <View style={styles.waveCounterBadge}>
          <Text style={styles.waveCounterText}>{pendingReceivedCount}</Text>
        </View>
      </View>

      {/* 2. Horizontal 5-Tab Bar */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContent}
        >
          {tabsConfig.map((tab) => {
            const isActive = activeTab === tab.key;
            const IconComponent = tab.icon;
            return (
              <Pressable
                key={tab.key}
                style={[styles.tabBtn, isActive && styles.tabBtnActive]}
                onPress={() => setActiveTab(tab.key)}
                accessibilityRole="button"
                accessibilityLabel={tab.label}
              >
                <IconComponent
                  size={14}
                  color={isActive ? '#0F766E' : '#64748B'}
                  strokeWidth={2.2}
                />
                <Text style={[styles.tabBtnText, isActive && styles.tabBtnTextActive]}>
                  {tab.label}
                </Text>
                {tab.count > 0 && (
                  <View style={[styles.tabCountPill, isActive && styles.tabCountPillActive]}>
                    <Text style={[styles.tabCountText, isActive && styles.tabCountTextActive]}>
                      {tab.count}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* 3. List Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 60 },
        ]}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#0F766E" />
        }
      >
        {isLoadingWaves && (
          <View style={styles.inlineLoading}>
            <ActivityIndicator size="small" color="#0F766E" />
            <Text style={styles.inlineLoadingText}>Syncing waves...</Text>
          </View>
        )}

        {/* Tab: INCOMING */}
        {activeTab === 'incoming' && (
          <>
            {incomingItems.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Flame size={40} color="#94A3B8" />
                <Text style={styles.emptyTitle}>No Pending Waves</Text>
                <Text style={styles.emptySub}>
                  When someone waves at your profile, their invitation with a 48h timer will appear here.
                </Text>
                <Pressable
                  style={styles.exploreBtn}
                  onPress={() => router.push('/(renter)/flatmates')}
                >
                  <Text style={styles.exploreBtnText}>Discover Flatmates</Text>
                </Pressable>
              </View>
            ) : (
              incomingItems.map((wave) => {
                const fm = wave.flatmate;
                const photo =
                  (fm.photos && fm.photos[0]) ||
                  fm.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300';
                const timer = calculateTimeRemaining(wave.expiresAt);

                return (
                  <View
                    key={wave.id}
                    style={[styles.waveCard, wave.isSuperWave && styles.superWaveCard]}
                  >
                    {/* Super wave badge */}
                    {wave.isSuperWave && (
                      <View style={styles.superWaveHeader}>
                        <Zap size={13} color="#B45309" strokeWidth={2.4} />
                        <Text style={styles.superWaveHeaderText}>
                          SUPER WAVE · Priority Match
                        </Text>
                      </View>
                    )}

                    <View style={styles.cardMainRow}>
                      <Pressable
                        onPress={() => router.push(`/(renter)/flatmate/${fm.id}`)}
                        style={styles.avatarWrap}
                      >
                        <V4Image source={{ uri: photo }} style={styles.avatar} resizeMode="cover" />
                        <View style={styles.onlineDot} />
                      </Pressable>

                      <View style={styles.cardInfo}>
                        <View style={styles.nameRow}>
                          <Text style={styles.nameText} numberOfLines={1}>
                            {fm.name}, {fm.age || 24}
                          </Text>
                          {fm.is_kyc_verified && (
                            <ShieldCheck size={14} color="#059669" strokeWidth={2.6} />
                          )}
                        </View>

                        <Text style={styles.occupationText} numberOfLines={1}>
                          {fm.occupation || 'Working Professional'}
                        </Text>

                        <View style={styles.metaRow}>
                          <MapPin size={12} color="#64748B" />
                          <Text style={styles.metaLocText} numberOfLines={1}>
                            {fm.locality || 'Mumbai'}
                          </Text>
                          <Text style={styles.timeText}>· {wave.timeSent}</Text>
                        </View>
                      </View>

                      {/* Compatibility Ring */}
                      <V4CompatibilityRing
                        score={fm.match_score || 94}
                        size={48}
                        strokeWidth={3.5}
                        showLabel
                        labelText="MATCH"
                      />
                    </View>

                    {/* Personal Note */}
                    {!!wave.message && (
                      <View style={styles.noteBox}>
                        <Text style={styles.noteText}>"{wave.message}"</Text>
                      </View>
                    )}

                    {/* Expiration live timer & budget */}
                    <View style={styles.specsPillRow}>
                      <View
                        style={[
                          styles.timerPill,
                          timer.isExpiringSoon && styles.timerPillExpiring,
                        ]}
                      >
                        <Clock
                          size={12}
                          color={timer.isExpiringSoon ? '#DC2626' : '#0F766E'}
                          strokeWidth={2.4}
                        />
                        <Text
                          style={[
                            styles.timerPillText,
                            timer.isExpiringSoon && styles.timerPillTextExpiring,
                          ]}
                        >
                          {timer.text}
                        </Text>
                      </View>

                      <View style={styles.specPill}>
                        <IndianRupee size={12} color="#0F766E" />
                        <Text style={styles.specPillText}>
                          ₹{((fm.budget_min || 15000) / 1000).toFixed(0)}k–₹{((fm.budget_max || 30000) / 1000).toFixed(0)}k/mo
                        </Text>
                      </View>
                    </View>

                    {/* Actions Row */}
                    <View style={styles.actionsRow}>
                      <Pressable
                        style={styles.passBtn}
                        onPress={() => handlePassWave(wave.id)}
                        accessibilityRole="button"
                        accessibilityLabel="Pass wave"
                      >
                        <X size={16} color="#94A3B8" strokeWidth={2.6} />
                        <Text style={styles.passBtnText}>Pass</Text>
                      </Pressable>

                      <Pressable
                        style={styles.viewProfileBtn}
                        onPress={() => router.push(`/(renter)/flatmate/${fm.id}`)}
                        accessibilityRole="button"
                        accessibilityLabel="View profile"
                      >
                        <Text style={styles.viewProfileBtnText}>View</Text>
                      </Pressable>

                      <Pressable
                        style={styles.acceptBtn}
                        onPress={() => handleAcceptWave(wave)}
                        accessibilityRole="button"
                        accessibilityLabel="Accept wave"
                      >
                        <Hand size={16} color="#FFFFFF" strokeWidth={2.4} />
                        <Text style={styles.acceptBtnText}>Accept Wave</Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })
            )}
          </>
        )}

        {/* Tab: SENT */}
        {activeTab === 'sent' && (
          <>
            {sentItems.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Hand size={40} color="#94A3B8" />
                <Text style={styles.emptyTitle}>No Sent Waves</Text>
                <Text style={styles.emptySub}>
                  Waves you send to potential roommates will be tracked here with a 48h response window.
                </Text>
                <Pressable
                  style={styles.exploreBtn}
                  onPress={() => router.push('/(renter)/flatmates')}
                >
                  <Text style={styles.exploreBtnText}>Explore Flatmates</Text>
                </Pressable>
              </View>
            ) : (
              sentItems.map((wave) => {
                const fm = wave.flatmate;
                const photo =
                  (fm.photos && fm.photos[0]) ||
                  fm.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300';
                const timer = calculateTimeRemaining(wave.expiresAt);

                return (
                  <View key={wave.id} style={styles.waveCard}>
                    <View style={styles.cardMainRow}>
                      <Pressable
                        onPress={() => router.push(`/(renter)/flatmate/${fm.id}`)}
                        style={styles.avatarWrap}
                      >
                        <V4Image source={{ uri: photo }} style={styles.avatar} resizeMode="cover" />
                      </Pressable>

                      <View style={styles.cardInfo}>
                        <Text style={styles.nameText}>{fm.name}</Text>
                        <Text style={styles.occupationText}>{fm.locality || 'Mumbai'}</Text>
                        <View style={styles.metaRow}>
                          <Clock size={11} color="#D97706" />
                          <Text style={styles.timeText}>{timer.text}</Text>
                        </View>
                      </View>

                      <View style={styles.statusPendingBadge}>
                        <Clock size={12} color="#D97706" />
                        <Text style={styles.statusPendingText}>Waiting Reply</Text>
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </>
        )}

        {/* Tab: ACCEPTED */}
        {activeTab === 'accepted' && (
          <>
            {acceptedItems.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Sparkles size={40} color="#94A3B8" />
                <Text style={styles.emptyTitle}>No Mutual Matches Yet</Text>
                <Text style={styles.emptySub}>
                  When a wave is mutually accepted, start a direct, free chat here.
                </Text>
                <Pressable
                  style={styles.exploreBtn}
                  onPress={() => router.push('/(renter)/flatmates')}
                >
                  <Text style={styles.exploreBtnText}>Start Swiping</Text>
                </Pressable>
              </View>
            ) : (
              acceptedItems.map((wave) => {
                const fm = wave.flatmate;
                const photo =
                  (fm.photos && fm.photos[0]) ||
                  fm.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300';

                return (
                  <View key={wave.id} style={[styles.waveCard, styles.acceptedCard]}>
                    <View style={styles.cardMainRow}>
                      <Pressable
                        onPress={() => router.push(`/(renter)/flatmate/${fm.id}`)}
                        style={styles.avatarWrap}
                      >
                        <V4Image source={{ uri: photo }} style={styles.avatar} resizeMode="cover" />
                        <View style={styles.onlineDot} />
                      </Pressable>

                      <View style={styles.cardInfo}>
                        <View style={styles.nameRow}>
                          <Text style={styles.nameText}>{fm.name}</Text>
                          <Sparkles size={14} color="#059669" />
                        </View>
                        <Text style={styles.occupationText}>{fm.locality || 'Mumbai'}</Text>
                        <Text style={styles.matchedGreenText}>Mutual Match Unlocked 🎉</Text>
                      </View>

                      <Pressable
                        style={styles.chatActionBtn}
                        onPress={() => handleStartChat(fm)}
                        accessibilityRole="button"
                        accessibilityLabel="Start chat"
                      >
                        <MessageCircle size={16} color="#FFFFFF" strokeWidth={2.4} />
                        <Text style={styles.chatActionBtnText}>Chat</Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })
            )}
          </>
        )}

        {/* Tab: SUPER WAVES */}
        {activeTab === 'super' && (
          <>
            {superItems.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Star size={40} color="#F59E0B" />
                <Text style={styles.emptyTitle}>No Super Waves</Text>
                <Text style={styles.emptySub}>
                  Super Waves grant instant spotlight and 3x response rates! Swipe up on any card to send one.
                </Text>
                <Pressable
                  style={styles.exploreBtn}
                  onPress={() => router.push('/(renter)/flatmates')}
                >
                  <Text style={styles.exploreBtnText}>Send a Super Wave</Text>
                </Pressable>
              </View>
            ) : (
              superItems.map((wave) => {
                const fm = wave.flatmate;
                const photo =
                  (fm.photos && fm.photos[0]) ||
                  fm.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300';

                return (
                  <View key={wave.id} style={[styles.waveCard, styles.superWaveCard]}>
                    <View style={styles.superWaveHeader}>
                      <Zap size={13} color="#B45309" strokeWidth={2.4} />
                      <Text style={styles.superWaveHeaderText}>
                        PRIORITY SUPER WAVE
                      </Text>
                    </View>

                    <View style={styles.cardMainRow}>
                      <Pressable
                        onPress={() => router.push(`/(renter)/flatmate/${fm.id}`)}
                        style={styles.avatarWrap}
                      >
                        <V4Image source={{ uri: photo }} style={styles.avatar} resizeMode="cover" />
                      </Pressable>

                      <View style={styles.cardInfo}>
                        <Text style={styles.nameText}>{fm.name}</Text>
                        <Text style={styles.occupationText}>{fm.locality || 'Mumbai'}</Text>
                        <Text style={styles.goldHighlightText}>
                          {wave.message || 'Priority invitation to connect'}
                        </Text>
                      </View>

                      {wave.status === 'accepted' ? (
                        <Pressable
                          style={styles.chatActionBtn}
                          onPress={() => handleStartChat(fm)}
                        >
                          <MessageCircle size={15} color="#FFFFFF" strokeWidth={2.4} />
                          <Text style={styles.chatActionBtnText}>Chat</Text>
                        </Pressable>
                      ) : (
                        <Pressable
                          style={styles.acceptBtn}
                          onPress={() => handleAcceptWave(wave)}
                        >
                          <Hand size={15} color="#FFFFFF" strokeWidth={2.4} />
                          <Text style={styles.acceptBtnText}>Accept</Text>
                        </Pressable>
                      )}
                    </View>
                  </View>
                );
              })
            )}
          </>
        )}

        {/* Tab: EXPIRED */}
        {activeTab === 'expired' && (
          <>
            {expiredItems.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Clock size={40} color="#94A3B8" />
                <Text style={styles.emptyTitle}>No Expired Waves</Text>
                <Text style={styles.emptySub}>
                  Waves naturally expire after 48 hours if unanswered. You can re-wave at any time!
                </Text>
              </View>
            ) : (
              expiredItems.map((wave) => {
                const fm = wave.flatmate;
                const photo =
                  (fm.photos && fm.photos[0]) ||
                  fm.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300';

                return (
                  <View key={wave.id} style={[styles.waveCard, styles.expiredCard]}>
                    <View style={styles.cardMainRow}>
                      <Pressable
                        onPress={() => router.push(`/(renter)/flatmate/${fm.id}`)}
                        style={styles.avatarWrap}
                      >
                        <V4Image source={{ uri: photo }} style={styles.avatar} resizeMode="cover" />
                      </Pressable>

                      <View style={styles.cardInfo}>
                        <Text style={styles.nameText}>{fm.name}</Text>
                        <Text style={styles.occupationText}>{fm.locality || 'Mumbai'}</Text>
                        <Text style={styles.expiredSubText}>Expired after 48 hours</Text>
                      </View>

                      <Pressable
                        style={styles.reWaveBtn}
                        onPress={() => handleReWave(fm)}
                        accessibilityRole="button"
                        accessibilityLabel="Re-wave"
                      >
                        <RotateCcw size={14} color="#0F766E" strokeWidth={2.4} />
                        <Text style={styles.reWaveBtnText}>Re-wave</Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })
            )}
          </>
        )}
      </ScrollView>

      {/* Mutual Match Celebration Modal */}
      <MatchCelebrationModal
        visible={Boolean(celebrationFlatmate)}
        flatmate={celebrationFlatmate}
        myAvatar={userAvatar}
        onClose={() => setCelebrationFlatmate(null)}
        onStartChat={(fm) => handleStartChat(fm)}
        onViewProfile={(fm) => router.push(`/(renter)/flatmate/${fm.id}`)}
      />
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
    width: 44,
    height: 44,
    borderRadius: 22,
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
  waveCounterBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  waveCounterText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#059669',
  },
  tabsContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
  },
  tabsScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 40,
  },
  tabBtnActive: {
    backgroundColor: '#F0FDFA',
    borderColor: '#0F766E',
  },
  tabBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: '#0F766E',
    fontWeight: '800',
  },
  tabCountPill: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tabCountPillActive: {
    backgroundColor: '#0F766E',
  },
  tabCountText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
  },
  tabCountTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  inlineLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  inlineLoadingText: {
    fontSize: 12,
    color: '#0F766E',
    fontWeight: '600',
  },
  waveCard: {
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
  superWaveCard: {
    borderColor: '#FDE68A',
    backgroundColor: '#FFFEFA',
  },
  acceptedCard: {
    borderColor: '#A7F3D0',
    backgroundColor: '#F0FDF4',
  },
  expiredCard: {
    borderColor: '#E2E8F0',
    backgroundColor: '#FAFAFA',
    opacity: 0.85,
  },
  superWaveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  superWaveHeaderText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#B45309',
    letterSpacing: 0.3,
  },
  cardMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
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
  cardInfo: {
    flex: 1,
    gap: 3,
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  metaLocText: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '600',
  },
  timeText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  noteBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  noteText: {
    fontSize: 12.5,
    color: '#334155',
    fontStyle: 'italic',
  },
  specsPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  timerPillExpiring: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  timerPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F766E',
  },
  timerPillTextExpiring: {
    color: '#DC2626',
  },
  specPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  specPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 4,
  },
  passBtn: {
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  passBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748B',
  },
  viewProfileBtn: {
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewProfileBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  acceptBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#0F766E',
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
  acceptBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statusPendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  statusPendingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },
  chatActionBtn: {
    height: 44,
    backgroundColor: '#0F766E',
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  chatActionBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  reWaveBtn: {
    height: 44,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: '#0F766E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  reWaveBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  matchedGreenText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#059669',
  },
  goldHighlightText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#B45309',
  },
  expiredSubText: {
    fontSize: 11,
    color: '#94A3B8',
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
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  exploreBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F766E',
  },
});
