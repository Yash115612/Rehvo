import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  MapPin,
  Train,
  Building2,
  GraduationCap,
  HeartPulse,
  ShoppingBag,
  Dumbbell,
  Utensils,
  Sparkles,
  ChevronRight,
  Navigation,
  Crosshair,
  RotateCcw,
  Layers,
  Flame,
  List,
  Heart,
  Eye,
  CheckCircle2,
  Zap,
  Compass,
  Plus,
  Minus,
  Car,
  ShieldCheck,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import { Property, CommuteHubType, CommuteHubRecord } from '../../../types';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import {
  calculateDistanceKm,
  CURATED_COMMUTE_HUBS,
  getHeatMapData,
  RentHeatmapPoint,
} from '../../../services/smartMaps';
import {
  getCurrentLocation,
  watchLiveLocation,
  DEFAULT_MUMBAI_CENTER,
} from '../../../services/mapsEngine';
import { V4PropertyDirectionsModal } from '../ui/V4PropertyDirectionsModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BOTTOM_CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.84, 340);

const RADIUS_OPTIONS = [
  { id: 'all', label: 'All Mumbai' },
  { id: '500m', label: '500 m', maxKm: 0.5 },
  { id: '1km', label: '1 km', maxKm: 1 },
  { id: '2km', label: '2 km', maxKm: 2 },
  { id: '5km', label: '5 km', maxKm: 5 },
  { id: '10km', label: '10 km', maxKm: 10 },
];

export type MapTypeOption = 'standard' | 'satellite' | 'terrain' | 'hybrid';

const MAP_TYPES: { id: MapTypeOption; label: string }[] = [
  { id: 'standard', label: 'Standard' },
  { id: 'satellite', label: 'Satellite' },
  { id: 'terrain', label: 'Terrain' },
  { id: 'hybrid', label: 'Hybrid' },
];

const OVERLAY_CATEGORIES: { id: CommuteHubType | 'ev'; label: string; icon: any; color: string }[] = [
  { id: 'metro', label: 'Metro', icon: Train, color: '#0284C7' },
  { id: 'office', label: 'Tech Parks', icon: Building2, color: '#0F766E' },
  { id: 'college', label: 'Colleges', icon: GraduationCap, color: '#EA580C' },
  { id: 'hospital', label: 'Hospitals', icon: HeartPulse, color: '#DC2626' },
  { id: 'grocery', label: 'Groceries', icon: ShoppingBag, color: '#16A34A' },
  { id: 'gym', label: 'Gyms', icon: Dumbbell, color: '#7C3AED' },
  { id: 'restaurant', label: 'Dining', icon: Utensils, color: '#D97706' },
  { id: 'ev', label: 'EV Chargers', icon: Zap, color: '#10B981' },
];

export const V4MapScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { properties, savedPropertyIds, toggleSaveProperty, showToast } = useAppStore();

  const [selectedRadius, setSelectedRadius] = useState('all');
  const [activeOverlays, setActiveOverlays] = useState<string[]>(['metro']);
  const [heatMapActive, setHeatMapActive] = useState(false);
  const [trafficActive, setTrafficActive] = useState(false);
  const [mapType, setMapType] = useState<MapTypeOption>('standard');
  const [zoomLevel, setZoomLevel] = useState<number>(3); // 1-5 zoom scale
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  // Directions Modal
  const [isDirectionsModalOpen, setIsDirectionsModalOpen] = useState(false);

  // Live Location & Moving Tracking
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number }>(
    DEFAULT_MUMBAI_CENTER
  );
  const [isLiveGpsActive, setIsLiveGpsActive] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bottomScrollRef = useRef<ScrollView>(null);

  // Start live location pulse animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 2.2,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Acquire initial location
    getCurrentLocation().then((loc) => {
      if (loc) {
        setUserLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
        setIsLiveGpsActive(true);
      }
    });

    // Start live tracking subscription
    let sub: any;
    watchLiveLocation((pos) => {
      setUserLocation({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
      setIsLiveGpsActive(true);
    }).then((s) => {
      sub = s;
    });

    return () => {
      sub?.remove?.();
    };
  }, [pulseAnim]);

  // Toggle POI Overlays
  const toggleOverlay = (hubType: string) => {
    setActiveOverlays((prev) =>
      prev.includes(hubType) ? prev.filter((t) => t !== hubType) : [...prev, hubType]
    );
  };

  // Filtered Properties by Radius
  const filteredProperties = useMemo(() => {
    if (!properties || properties.length === 0) return [];
    return properties.filter((prop) => {
      if (selectedRadius !== 'all') {
        const radiusConfig = RADIUS_OPTIONS.find((r) => r.id === selectedRadius);
        if (radiusConfig?.maxKm) {
          const pLat = prop.latitude || userLocation.latitude;
          const pLng = prop.longitude || userLocation.longitude;
          const dist = calculateDistanceKm(
            userLocation.latitude,
            userLocation.longitude,
            pLat,
            pLng
          );
          if (dist > radiusConfig.maxKm) return false;
        }
      }
      return true;
    });
  }, [properties, selectedRadius, userLocation]);

  const selectedProperty = useMemo(() => {
    if (!filteredProperties.length) return null;
    if (selectedPropertyId) {
      const found = filteredProperties.find((p) => p.id === selectedPropertyId);
      if (found) return found;
    }
    return filteredProperties[0];
  }, [filteredProperties, selectedPropertyId]);

  // Synchronize horizontal carousel scroll when selectedPropertyId changes
  const handleSelectPin = (propId: string, index: number) => {
    setSelectedPropertyId(propId);
    bottomScrollRef.current?.scrollTo({
      x: index * (BOTTOM_CARD_WIDTH + 12),
      animated: true,
    });
  };

  // Map Pins layout positions on the luxury canvas
  const pinPositions = useMemo(() => {
    const defaultCoords = [
      { top: '34%', left: '44%' },
      { top: '48%', left: '58%' },
      { top: '56%', left: '28%' },
      { top: '28%', left: '68%' },
      { top: '40%', left: '18%' },
      { top: '64%', left: '62%' },
      { top: '36%', left: '78%' },
      { top: '52%', left: '38%' },
      { top: '24%', left: '35%' },
      { top: '70%', left: '45%' },
    ];
    return filteredProperties.map((_, idx) => defaultCoords[idx % defaultCoords.length]);
  }, [filteredProperties]);

  // Heatmap Points
  const heatMapPoints: RentHeatmapPoint[] = useMemo(() => {
    return getHeatMapData(filteredProperties);
  }, [filteredProperties]);

  // Active Overlays POIs
  const activeHubs: CommuteHubRecord[] = useMemo(() => {
    return CURATED_COMMUTE_HUBS.filter((h) => activeOverlays.includes(h.hub_type));
  }, [activeOverlays]);

  const hubPositions = useMemo(() => [
    { top: '30%', left: '50%' },
    { top: '42%', left: '32%' },
    { top: '58%', left: '72%' },
    { top: '66%', left: '36%' },
    { top: '26%', left: '60%' },
    { top: '46%', left: '74%' },
    { top: '38%', left: '24%' },
    { top: '60%', left: '52%' },
  ], []);

  const formatRentShort = (rent: number) => {
    if (rent >= 100000) return `₹${(rent / 100000).toFixed(1)}L`;
    return `₹${Math.round(rent / 1000)}k`;
  };

  const handleCenterOnUser = async () => {
    const loc = await getCurrentLocation();
    if (loc) {
      setUserLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      showToast('Centered on your live GPS location', 'success');
    } else {
      showToast('Centering on Mumbai Prime Corridor', 'info');
    }
  };

  return (
    <View style={styles.root}>
      {/* =====================================================================
          1. TOP NAVIGATION & SEARCH PILL
         ===================================================================== */}
      <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top, 14) }]}>
        <View style={styles.topRow}>
          <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={8}>
            <ArrowLeft size={18} color="#0F172A" strokeWidth={2.4} />
          </Pressable>

          <Pressable
            style={styles.searchBarPill}
            onPress={() => router.push('/(renter)/search' as any)}
          >
            <MapPin size={15} color={V4_COLORS.primary} strokeWidth={2.4} />
            <Text style={styles.searchBarText} numberOfLines={1}>
              {selectedProperty
                ? `${selectedProperty.locality || 'Bandra West'} (${filteredProperties.length} homes)`
                : 'Search Mumbai Neighborhoods...'}
            </Text>
          </Pressable>

          <Pressable
            style={styles.listSwitchBtn}
            onPress={() => router.push('/(renter)/search' as any)}
            hitSlop={8}
          >
            <List size={18} color={V4_COLORS.primary} strokeWidth={2.4} />
          </Pressable>
        </View>

        {/* Radius Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.radiusScroll}
        >
          {RADIUS_OPTIONS.map((r) => {
            const isSelected = selectedRadius === r.id;
            return (
              <Pressable
                key={r.id}
                style={[styles.radiusChip, isSelected && styles.radiusChipActive]}
                onPress={() => setSelectedRadius(r.id)}
              >
                <Text
                  style={[styles.radiusChipText, isSelected && styles.radiusChipTextActive]}
                >
                  {r.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* POI Overlays Horizontal Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.overlaysScroll}
        >
          {OVERLAY_CATEGORIES.map((cat) => {
            const isActive = activeOverlays.includes(cat.id);
            const Icon = cat.icon;
            return (
              <Pressable
                key={cat.id}
                style={[styles.overlayChip, isActive && styles.overlayChipActive]}
                onPress={() => toggleOverlay(cat.id)}
              >
                <Icon
                  size={12}
                  color={isActive ? '#FFFFFF' : cat.color}
                  strokeWidth={2.4}
                />
                <Text
                  style={[
                    styles.overlayChipText,
                    isActive && styles.overlayChipTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* =====================================================================
          2. MAP CANVAS 3.0 (Stylized Luxury Canvas with Native Map Fallback)
         ===================================================================== */}
      <View
        style={[
          styles.mapStage,
          mapType === 'satellite' && styles.mapStageSatellite,
          mapType === 'terrain' && styles.mapStageTerrain,
          mapType === 'hybrid' && styles.mapStageHybrid,
        ]}
      >
        {/* Dynamic Commute Radius Circles */}
        <View style={styles.radiusCirclesOverlay}>
          <View style={[styles.radiusCircleDashed, { width: 140, height: 140 }]} />
          <View style={[styles.radiusCircleDashed, { width: 260, height: 260 }]} />
          <View style={[styles.radiusCircleDashed, { width: 380, height: 380 }]} />
        </View>

        {/* Traffic Flow Overlay (Simulated Green/Amber Arteries) */}
        {trafficActive && (
          <View style={styles.trafficOverlay}>
            <View style={[styles.trafficArtery, { top: '35%', backgroundColor: '#22C55E' }]} />
            <View style={[styles.trafficArtery, { top: '45%', backgroundColor: '#EAB308' }]} />
            <View style={[styles.trafficArtery, { top: '58%', backgroundColor: '#22C55E' }]} />
          </View>
        )}

        {/* Rent Heatmap Overlay */}
        {heatMapActive && (
          <View style={styles.heatMapContainer}>
            {heatMapPoints.map((pt, idx) => {
              const pos = pinPositions[idx % pinPositions.length];
              return (
                <View
                  key={`heat-${pt.id}`}
                  style={[
                    styles.heatSpot,
                    {
                      top: pos.top as any,
                      left: pos.left as any,
                      backgroundColor: pt.color,
                    },
                  ]}
                />
              );
            })}
          </View>
        )}

        {/* Live Blue User Location Dot with Pulsing Halo */}
        <View style={styles.userLocationContainer}>
          <Animated.View
            style={[
              styles.userLocationHalo,
              {
                transform: [{ scale: pulseAnim }],
                opacity: pulseAnim.interpolate({
                  inputRange: [1, 2.2],
                  outputRange: [0.6, 0],
                }),
              },
            ]}
          />
          <View style={styles.userLocationDot}>
            <View style={styles.userLocationInner} />
          </View>
        </View>

        {/* POI Commute Hub Overlays */}
        {activeHubs.map((hub, idx) => {
          const pos = hubPositions[idx % hubPositions.length];
          const catConfig = OVERLAY_CATEGORIES.find((c) => c.id === hub.hub_type);
          const IconComp = catConfig?.icon || MapPin;
          return (
            <Pressable
              key={`hub-${hub.id}`}
              style={[
                styles.hubPin,
                { top: pos.top as any, left: pos.left as any, borderColor: catConfig?.color || '#0F766E' },
              ]}
              onPress={() => showToast(`${hub.name} (${catConfig?.label})`, 'info')}
            >
              <IconComp size={12} color={catConfig?.color || '#0F766E'} strokeWidth={2.4} />
            </Pressable>
          );
        })}

        {/* Property Price Pins (Airbnb style) */}
        {!heatMapActive &&
          filteredProperties.map((prop, index) => {
            const isSelected = selectedProperty?.id === prop.id;
            const pos = pinPositions[index % pinPositions.length];
            const isVerified = prop.verification_status === 'VERIFIED';
            return (
              <Pressable
                key={prop.id}
                style={[
                  styles.pricePin,
                  isSelected && styles.pricePinActive,
                  { top: pos.top as any, left: pos.left as any },
                ]}
                onPress={() => handleSelectPin(prop.id, index)}
              >
                {isVerified && <ShieldCheck size={10} color={isSelected ? '#CCFBF1' : '#10B981'} />}
                {isSelected && <Sparkles size={11} color="#FFFFFF" strokeWidth={2.4} />}
                <Text
                  style={[
                    styles.pricePinText,
                    isSelected && styles.pricePinTextActive,
                  ]}
                >
                  {formatRentShort(prop.rent || 35000)}
                </Text>
              </Pressable>
            );
          })}

        {/* =====================================================================
            3. FLOATING TOOLBAR CONTROLS (My Location, Zoom, Layers, Traffic)
           ===================================================================== */}
        <View style={[styles.mapFloatControls, { top: Math.max(insets.top, 14) + 120 }]}>
          {/* My Location GPS Recenter */}
          <Pressable style={styles.mapToolBtn} onPress={handleCenterOnUser} hitSlop={8}>
            <Crosshair size={18} color={isLiveGpsActive ? '#0284C7' : '#0F172A'} strokeWidth={2.4} />
          </Pressable>

          {/* Compass Orientation */}
          <Pressable
            style={styles.mapToolBtn}
            onPress={() => showToast('Heading: 0° North', 'info')}
            hitSlop={8}
          >
            <Compass size={18} color="#0F766E" strokeWidth={2.4} />
          </Pressable>

          {/* Zoom In (+) */}
          <Pressable
            style={styles.mapToolBtn}
            onPress={() => {
              setZoomLevel((z) => Math.min(5, z + 1));
              showToast(`Zoom level: ${Math.min(5, zoomLevel + 1)}x`, 'info');
            }}
            hitSlop={8}
          >
            <Plus size={18} color="#0F172A" strokeWidth={2.4} />
          </Pressable>

          {/* Zoom Out (-) */}
          <Pressable
            style={styles.mapToolBtn}
            onPress={() => {
              setZoomLevel((z) => Math.max(1, z - 1));
              showToast(`Zoom level: ${Math.max(1, zoomLevel - 1)}x`, 'info');
            }}
            hitSlop={8}
          >
            <Minus size={18} color="#0F172A" strokeWidth={2.4} />
          </Pressable>

          {/* Traffic Overlay Toggle */}
          <Pressable
            style={[styles.mapToolBtn, trafficActive && styles.mapToolBtnActive]}
            onPress={() => {
              setTrafficActive(!trafficActive);
              showToast(trafficActive ? 'Traffic overlay disabled' : 'Live traffic flow active', 'info');
            }}
            hitSlop={8}
          >
            <Car size={16} color={trafficActive ? '#FFFFFF' : '#0F172A'} strokeWidth={2.4} />
          </Pressable>

          {/* Heat Map Toggle */}
          <Pressable
            style={[styles.mapToolBtn, heatMapActive && styles.mapToolBtnActive]}
            onPress={() => {
              setHeatMapActive(!heatMapActive);
              showToast(heatMapActive ? 'Rent Heatmap disabled' : 'Rent Heatmap active', 'info');
            }}
            hitSlop={8}
          >
            <Flame size={16} color={heatMapActive ? '#FFFFFF' : '#EA580C'} strokeWidth={2.4} />
          </Pressable>

          {/* Map Type Toggle (Standard/Satellite/Terrain) */}
          <Pressable
            style={styles.mapToolBtn}
            onPress={() => {
              const types: MapTypeOption[] = ['standard', 'satellite', 'terrain', 'hybrid'];
              const next = types[(types.indexOf(mapType) + 1) % types.length];
              setMapType(next);
              showToast(`Map style: ${next.toUpperCase()}`, 'info');
            }}
            hitSlop={8}
          >
            <Layers size={16} color="#0F766E" strokeWidth={2.4} />
          </Pressable>
        </View>

        {/* =====================================================================
            4. BOTTOM HORIZONTAL PROPERTY CAROUSEL (Synced with Map Pins)
           ===================================================================== */}
        <View style={[styles.bottomCarouselContainer, { paddingBottom: Math.max(insets.bottom, 14) + 10 }]}>
          <ScrollView
            ref={bottomScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={BOTTOM_CARD_WIDTH + 12}
            decelerationRate="fast"
            contentContainerStyle={styles.bottomCarouselContent}
            onMomentumScrollEnd={(e) => {
              const offsetX = e.nativeEvent.contentOffset.x;
              const index = Math.round(offsetX / (BOTTOM_CARD_WIDTH + 12));
              if (filteredProperties[index]) {
                setSelectedPropertyId(filteredProperties[index].id);
              }
            }}
          >
            {filteredProperties.map((prop, idx) => {
              const isSelected = selectedProperty?.id === prop.id;
              const isSaved = savedPropertyIds.includes(prop.id);
              const rawImg = prop.images?.[0];
              const imgUri =
                (typeof rawImg === 'string' ? rawImg : (rawImg as any)?.url) ||
                'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80';

              return (
                <Pressable
                  key={`bottom-${prop.id}`}
                  style={[
                    styles.bottomCard,
                    { width: BOTTOM_CARD_WIDTH },
                    isSelected && styles.bottomCardSelected,
                  ]}
                  onPress={() => handleSelectPin(prop.id, idx)}
                >
                  <Image source={{ uri: imgUri }} style={styles.cardImage} />

                  <View style={styles.cardContent}>
                    <View style={styles.cardHeaderRow}>
                      <View style={styles.bhkPill}>
                        <Text style={styles.bhkPillText}>{prop.bhk || '2 BHK'}</Text>
                      </View>
                      <Pressable
                        style={styles.favBtn}
                        onPress={() => toggleSaveProperty(prop.id)}
                        hitSlop={8}
                      >
                        <Heart
                          size={16}
                          color={isSaved ? '#EF4444' : '#0F172A'}
                          fill={isSaved ? '#EF4444' : 'transparent'}
                        />
                      </Pressable>
                    </View>

                    <Text style={styles.cardTitle} numberOfLines={1}>
                      {prop.title}
                    </Text>

                    <View style={styles.cardLocRow}>
                      <MapPin size={11} color="#64748B" />
                      <Text style={styles.cardLocText} numberOfLines={1}>
                        {prop.locality || 'Bandra West'}
                      </Text>
                    </View>

                    <View style={styles.cardBottomRow}>
                      <Text style={styles.cardRent}>
                        ₹{(prop.rent || 35000).toLocaleString('en-IN')}
                        <Text style={styles.cardRentSub}>/mo</Text>
                      </Text>

                      {/* Directions Trigger Button */}
                      <Pressable
                        style={styles.directionsBtn}
                        onPress={() => {
                          setSelectedPropertyId(prop.id);
                          setIsDirectionsModalOpen(true);
                        }}
                        hitSlop={8}
                      >
                        <Navigation size={12} color="#FFFFFF" strokeWidth={2.4} />
                        <Text style={styles.directionsBtnText}>Directions</Text>
                      </Pressable>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>

      {/* =====================================================================
          5. PROPERTY TRANSIT DIRECTIONS MODAL
         ===================================================================== */}
      {selectedProperty && (
        <V4PropertyDirectionsModal
          visible={isDirectionsModalOpen}
          property={selectedProperty}
          userLocation={userLocation}
          onClose={() => setIsDirectionsModalOpen(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingBottom: 8,
    zIndex: 10,
    ...V4_SHADOWS.card,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  searchBarPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F1F5F9',
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchBarText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  listSwitchBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#CCFBF1',
  },
  radiusScroll: {
    gap: 6,
    paddingBottom: 6,
  },
  radiusChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 44,
    justifyContent: 'center',
  },
  radiusChipActive: {
    backgroundColor: V4_COLORS.primary,
    borderColor: V4_COLORS.primary,
  },
  radiusChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  radiusChipTextActive: {
    color: '#FFFFFF',
  },
  overlaysScroll: {
    gap: 6,
    paddingVertical: 2,
  },
  overlayChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 44,
  },
  overlayChipActive: {
    backgroundColor: V4_COLORS.primary,
    borderColor: V4_COLORS.primary,
  },
  overlayChipText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  overlayChipTextActive: {
    color: '#FFFFFF',
  },
  mapStage: {
    flex: 1,
    backgroundColor: '#E6EFF2',
    position: 'relative',
    overflow: 'hidden',
  },
  mapStageSatellite: {
    backgroundColor: '#1C2E3D',
  },
  mapStageTerrain: {
    backgroundColor: '#DFE7DA',
  },
  mapStageHybrid: {
    backgroundColor: '#1E3231',
  },
  radiusCirclesOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  radiusCircleDashed: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: 'rgba(15, 118, 110, 0.25)',
    borderStyle: 'dashed',
  },
  trafficOverlay: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  trafficArtery: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    opacity: 0.75,
  },
  heatMapContainer: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  heatSpot: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    opacity: 0.35,
  },
  userLocationContainer: {
    position: 'absolute',
    top: '48%',
    left: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  },
  userLocationHalo: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0284C7',
  },
  userLocationDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...V4_SHADOWS.card,
  },
  userLocationInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0284C7',
  },
  hubPin: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    ...V4_SHADOWS.card,
  },
  pricePin: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#0F766E',
    ...V4_SHADOWS.card,
  },
  pricePinActive: {
    backgroundColor: '#0F766E',
    borderColor: '#064E3B',
    transform: [{ scale: 1.15 }],
    zIndex: 99,
  },
  pricePinText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F766E',
  },
  pricePinTextActive: {
    color: '#FFFFFF',
  },
  mapFloatControls: {
    position: 'absolute',
    right: 14,
    gap: 8,
    zIndex: 50,
  },
  mapToolBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.card,
  },
  mapToolBtnActive: {
    backgroundColor: V4_COLORS.primary,
    borderColor: V4_COLORS.primary,
  },
  bottomCarouselContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 40,
  },
  bottomCarouselContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  bottomCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.card,
  },
  bottomCardSelected: {
    borderColor: V4_COLORS.primary,
    borderWidth: 2,
  },
  cardImage: {
    width: '100%',
    height: 110,
    backgroundColor: '#E2E8F0',
  },
  cardContent: {
    padding: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  bhkPill: {
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  bhkPillText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: V4_COLORS.primary,
  },
  favBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  cardLocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  cardLocText: {
    fontSize: 11.5,
    color: '#64748B',
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardRent: {
    fontSize: 15,
    fontWeight: '800',
    color: V4_COLORS.primary,
  },
  cardRentSub: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94A3B8',
  },
  directionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: V4_COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    minHeight: 44,
  },
  directionsBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
