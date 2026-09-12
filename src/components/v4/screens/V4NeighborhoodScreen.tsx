import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Share2,
  MapPin,
  Sparkles,
  Compass,
  Navigation,
  Clock,
  TrendingUp,
  Building,
  CheckCircle2,
  Layers,
  ChevronRight,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import {
  NeighborhoodScoresRecord,
  LocalityCrimeStatsRecord,
  LocalityAirQualityRecord,
  InternetProviderRecord,
  WaterSupplyScheduleRecord,
  LocalityPlacesRecord,
  CommuteEstimateV2,
} from '../../../types';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { getLocalityIntelligence } from '../../../services/propertyCompare';
import {
  calculateCommuteMultiModal,
  PRIME_MUMBAI_DESTINATIONS,
  CommuteDestination,
} from '../../../services/commuteEngine';
import { V4NeighborhoodRadar } from '../ui/V4NeighborhoodRadar';
import { V4SafetyCrimeCard } from '../ui/V4SafetyCrimeCard';
import { V4AirQualityCard } from '../ui/V4AirQualityCard';
import { V4InternetWaterCard } from '../ui/V4InternetWaterCard';
import { V4LifestylePlacesCard } from '../ui/V4LifestylePlacesCard';
import { V4PropertyCardLarge } from '../ui/V4PropertyCardLarge';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const LOCALITY_IMAGES: Record<string, string> = {
  BKC: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&auto=format&fit=crop&q=80',
  'Bandra West': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80',
  Powai: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80',
  'Andheri East': 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=1200&auto=format&fit=crop&q=80',
};

const LOCALITY_COORDS: Record<string, { lat: number; lng: number }> = {
  BKC: { lat: 19.0657, lng: 72.8687 },
  'Bandra West': { lat: 19.0596, lng: 72.8295 },
  Powai: { lat: 19.1176, lng: 72.9060 },
  'Andheri East': { lat: 19.1197, lng: 72.8697 },
};

export const V4NeighborhoodScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ locality?: string }>();

  const localityName = params.locality || 'BKC';

  const properties = useAppStore((s) => s.properties);
  const toggleSaveProperty = useAppStore((s) => s.toggleSaveProperty);
  const savedPropertyIds = useAppStore((s) => s.savedPropertyIds);

  // Intelligence State
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState<NeighborhoodScoresRecord | null>(null);
  const [crime, setCrime] = useState<LocalityCrimeStatsRecord | null>(null);
  const [air, setAir] = useState<LocalityAirQualityRecord | null>(null);
  const [internet, setInternet] = useState<InternetProviderRecord[]>([]);
  const [water, setWater] = useState<WaterSupplyScheduleRecord | null>(null);
  const [places, setPlaces] = useState<LocalityPlacesRecord | null>(null);

  // Commute Calculator State
  const [selectedDestId, setSelectedDestId] = useState<string>('dest_bkc');
  const [isPeakHour, setIsPeakHour] = useState<boolean>(false);

  // Fetch intelligence on mount
  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      const data = await getLocalityIntelligence(localityName);
      if (isMounted) {
        setScores(data.scores);
        setCrime(data.crime);
        setAir(data.air);
        setInternet(data.internet);
        setWater(data.water);
        setPlaces(data.places);
        setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [localityName]);

  // Commute estimates
  const activeDestination = useMemo(() => {
    return (
      PRIME_MUMBAI_DESTINATIONS.find((d) => d.id === selectedDestId) ||
      PRIME_MUMBAI_DESTINATIONS[0]
    );
  }, [selectedDestId]);

  const commuteEstimates: CommuteEstimateV2[] = useMemo(() => {
    const locCoords = LOCALITY_COORDS[localityName] || { lat: 19.0657, lng: 72.8687 };
    return calculateCommuteMultiModal(
      locCoords.lat,
      locCoords.lng,
      activeDestination.lat,
      activeDestination.lng,
      isPeakHour
    );
  }, [localityName, activeDestination, isPeakHour]);

  // Properties in this locality
  const localityProperties = useMemo(() => {
    return properties.filter((p) =>
      (p.locality || '').toLowerCase().includes(localityName.toLowerCase())
    );
  }, [properties, localityName]);

  const bannerImg =
    LOCALITY_IMAGES[localityName] ||
    'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&auto=format&fit=crop&q=80';

  if (loading) {
    return (
      <View style={[styles.root, styles.centerLoader]}>
        <ActivityIndicator size="large" color={V4_COLORS.primary} />
        <Text style={styles.loadingText}>Loading Neighborhood Intelligence...</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* 1. TOP FLOATING NAV BAR */}
      <View style={[styles.topNav, { paddingTop: insets.top + 8 }]}>
        <Pressable
          onPress={() => router.back()}
          style={styles.navIconBtn}
          accessibilityLabel="Back"
        >
          <ArrowLeft size={20} color="#0F172A" />
        </Pressable>

        <View style={styles.navTitleCol}>
          <Text style={styles.navTitle}>{localityName}</Text>
          <Text style={styles.navSub}>Neighborhood Intelligence Hub</Text>
        </View>

        <Pressable
          onPress={() => router.push(`/(renter)/map` as any)}
          style={styles.navIconBtn}
          accessibilityLabel="Open Map"
        >
          <Compass size={18} color="#0F766E" />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollBody,
          { paddingBottom: insets.bottom + 80 },
        ]}
      >
        {/* 2. HERO LOCALITY CARD */}
        <View style={styles.heroCard}>
          <Image source={{ uri: bannerImg }} style={styles.heroBg} resizeMode="cover" />
          <View style={styles.heroOverlay} />

          <View style={styles.heroContent}>
            <View style={styles.gradeBadge}>
              <Text style={styles.gradeBadgeText}>
                Grade {scores?.overall_grade || 'A+'}
              </Text>
            </View>

            <Text style={styles.heroLocalityTitle}>{localityName}</Text>
            <Text style={styles.heroDescription}>
              {scores?.description ||
                `Mumbai's prime residential & commercial zone with robust social infrastructure.`}
            </Text>

            <View style={styles.heroStatsRow}>
              <View style={styles.heroStatItem}>
                <Text style={styles.heroStatValue}>{scores?.walk_score || 8.8}</Text>
                <Text style={styles.heroStatLabel}>Walk Score</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStatItem}>
                <Text style={styles.heroStatValue}>{scores?.safety_score || 9.4}</Text>
                <Text style={styles.heroStatLabel}>Safety</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStatItem}>
                <Text style={styles.heroStatValue}>{scores?.greenery_score || 8.2}</Text>
                <Text style={styles.heroStatLabel}>Greenery</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStatItem}>
                <Text style={styles.heroStatValue}>{scores?.internet_score || 9.8}</Text>
                <Text style={styles.heroStatLabel}>Internet</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 3. LOCALITY RADAR CHART */}
        <View style={styles.cardBox}>
          <View style={styles.boxHeaderRow}>
            <View style={styles.boxIconWrap}>
              <Sparkles size={18} color={V4_COLORS.primary} />
            </View>
            <View style={styles.boxTextCol}>
              <Text style={styles.boxTitle}>8-Metric Intelligence Radar</Text>
              <Text style={styles.boxSubtitle}>
                Spatial balance across livability & wellness factors
              </Text>
            </View>
          </View>

          <V4NeighborhoodRadar scores={scores || {}} size={Math.min(SCREEN_WIDTH - 64, 300)} />
        </View>

        {/* 4. COMMUTE CALCULATOR 2.0 MATRIX */}
        <View style={styles.cardBox}>
          <View style={styles.boxHeaderRow}>
            <View style={styles.boxIconWrap}>
              <Navigation size={18} color={V4_COLORS.primary} />
            </View>
            <View style={styles.boxTextCol}>
              <Text style={styles.boxTitle}>Commute Matrix 2.0</Text>
              <Text style={styles.boxSubtitle}>
                Multi-modal door-to-door travel times & fares
              </Text>
            </View>
          </View>

          {/* Destination Selector Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.destPillsRow}
          >
            {PRIME_MUMBAI_DESTINATIONS.map((dest) => {
              const isSelected = dest.id === selectedDestId;
              return (
                <Pressable
                  key={dest.id}
                  onPress={() => setSelectedDestId(dest.id)}
                  style={[
                    styles.destPill,
                    isSelected && styles.destPillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.destPillText,
                      isSelected && styles.destPillTextActive,
                    ]}
                  >
                    {dest.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Peak Hour Toggle Switch */}
          <Pressable
            onPress={() => setIsPeakHour(!isPeakHour)}
            style={[
              styles.peakHourToggleBar,
              isPeakHour && styles.peakHourToggleBarActive,
            ]}
          >
            <Clock size={15} color={isPeakHour ? '#EA580C' : '#64748B'} />
            <Text
              style={[
                styles.peakHourToggleText,
                isPeakHour && styles.peakHourToggleTextActive,
              ]}
            >
              {isPeakHour ? 'Peak Hour Traffic Active (+35% time)' : 'Normal Traffic Conditions'}
            </Text>
          </Pressable>

          {/* 6 Transit Modes Grid */}
          <View style={styles.transitGrid}>
            {commuteEstimates.map((est) => (
              <View key={est.mode} style={styles.transitCell}>
                <Text style={styles.transitModeLabel}>{est.label}</Text>
                <Text style={styles.transitDuration}>{est.durationMinutes} mins</Text>
                <View style={styles.transitMetaRow}>
                  <Text style={styles.transitDist}>{est.distanceKm} km</Text>
                  <Text style={styles.transitFare}>
                    {est.fareEstimateRupees === 0 ? 'Free' : `~₹${est.fareEstimateRupees}`}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 5. SAFETY & SURVEILLANCE */}
        {crime && <V4SafetyCrimeCard stats={crime} />}

        {/* 6. AIR QUALITY & ACOUSTIC TELEMETRY */}
        {air && <V4AirQualityCard airQuality={air} />}

        {/* 7. INTERNET & WATER RELIABILITY */}
        {water && <V4InternetWaterCard internetProviders={internet} waterSchedule={water} />}

        {/* 8. LIFESTYLE PLACES */}
        {places && <V4LifestylePlacesCard places={places} />}

        {/* 9. HOMES AVAILABLE IN THIS LOCALITY */}
        {localityProperties.length > 0 && (
          <View style={styles.localityHomesSection}>
            <View style={styles.localityHomesHeader}>
              <Text style={styles.localityHomesTitle}>
                Verified Homes in {localityName}
              </Text>
              <Text style={styles.localityHomesCount}>
                {localityProperties.length} Available
              </Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.homesCarousel}
            >
              {localityProperties.map((p) => (
                <V4PropertyCardLarge
                  key={p.id}
                  property={p}
                  cardWidth={Math.min(SCREEN_WIDTH * 0.82, 320)}
                  isSaved={savedPropertyIds.includes(p.id)}
                  onToggleSave={toggleSaveProperty}
                  onSelect={() => router.push(`/(renter)/property/${p.id}` as any)}
                  aiMatchScore={92}
                  whyThisBadge={`${localityName} Verified`}
                  isZeroDeposit={(p.deposit || 0) <= p.rent}
                />
              ))}
            </ScrollView>
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
  centerLoader: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 12,
  },
  navIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitleCol: {
    flex: 1,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  navSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  scrollBody: {
    padding: 16,
    gap: 16,
  },
  heroCard: {
    height: 220,
    borderRadius: V4_RADIUS.card,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
    ...V4_SHADOWS.card,
  },
  heroBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(3, 27, 42, 0.65)',
  },
  heroContent: {
    padding: 18,
    gap: 8,
  },
  gradeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(45, 212, 191, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2DD4BF',
  },
  gradeBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#2DD4BF',
    letterSpacing: 0.5,
  },
  heroLocalityTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  heroDescription: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 16,
  },
  heroStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(3, 27, 42, 0.75)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    marginTop: 4,
  },
  heroStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  heroStatValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  heroStatLabel: {
    fontSize: 9.5,
    color: '#94A3B8',
    fontWeight: '700',
    marginTop: 1,
  },
  heroStatDivider: {
    width: 1,
    height: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: V4_RADIUS.card,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 16,
    ...V4_SHADOWS.card,
  },
  boxHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  boxIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: V4_COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxTextCol: {
    flex: 1,
  },
  boxTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  boxSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  destPillsRow: {
    gap: 8,
    paddingBottom: 2,
  },
  destPill: {
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  destPillActive: {
    backgroundColor: V4_COLORS.primary,
  },
  destPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  destPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  peakHourToggleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  peakHourToggleBarActive: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FED7AA',
  },
  peakHourToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  peakHourToggleTextActive: {
    color: '#EA580C',
    fontWeight: '800',
  },
  transitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  transitCell: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  transitModeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  transitDuration: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  transitMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  transitDist: {
    fontSize: 10.5,
    color: '#94A3B8',
  },
  transitFare: {
    fontSize: 11,
    fontWeight: '800',
    color: V4_COLORS.primary,
  },
  localityHomesSection: {
    gap: 12,
    marginTop: 8,
  },
  localityHomesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  localityHomesTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  localityHomesCount: {
    fontSize: 12,
    color: V4_COLORS.primary,
    fontWeight: '700',
  },
  homesCarousel: {
    gap: 14,
    paddingVertical: 4,
  },
});
