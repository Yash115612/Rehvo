import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import {
  X,
  Navigation,
  Clock,
  Car,
  Bike,
  Footprints,
  Train,
  Bus,
  MapPin,
  ExternalLink,
  Flame,
  Leaf,
  DollarSign,
  ChevronRight,
  Sparkles,
} from 'lucide-react-native';
import { Property, CommuteModeType, TransitDirections } from '../../../types';
import {
  getDirections,
  openGoogleMaps,
  openAppleMaps,
  DEFAULT_MUMBAI_CENTER,
  recordRouteHistory,
} from '../../../services/mapsEngine';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';

interface V4PropertyDirectionsModalProps {
  visible: boolean;
  property?: Property;
  propertyTitle?: string;
  propertyLocality?: string;
  propertyCoordinates?: { latitude: number; longitude: number };
  userLocation?: { latitude: number; longitude: number };
  onClose: () => void;
}

const TRANSIT_MODES: { id: CommuteModeType; label: string; icon: any }[] = [
  { id: 'metro', label: 'Metro', icon: Train },
  { id: 'car', label: 'Car / Cab', icon: Car },
  { id: 'auto', label: 'Auto', icon: Navigation },
  { id: 'bike', label: 'Bike', icon: Bike },
  { id: 'bus', label: 'Bus', icon: Bus },
  { id: 'walk', label: 'Walk', icon: Footprints },
];

export const V4PropertyDirectionsModal: React.FC<V4PropertyDirectionsModalProps> = React.memo(
  ({
    visible,
    property,
    propertyTitle,
    propertyLocality,
    propertyCoordinates,
    userLocation,
    onClose,
  }) => {
    const [selectedMode, setSelectedMode] = useState<CommuteModeType>('metro');
    const [isPeakHour, setIsPeakHour] = useState(false);
    const [directions, setDirections] = useState<TransitDirections | null>(null);

    const title = property?.title || propertyTitle || 'Verified Property';
    const locality = property?.locality || propertyLocality || 'Bandra West';
    const destinationLat =
      property?.latitude || propertyCoordinates?.latitude || DEFAULT_MUMBAI_CENTER.latitude;
    const destinationLng =
      property?.longitude || propertyCoordinates?.longitude || DEFAULT_MUMBAI_CENTER.longitude;

    const origin = userLocation || {
      latitude: 19.0657,
      longitude: 72.8687, // BKC
    };

    useEffect(() => {
      if (!visible) return;

      getDirections(
        origin,
        { latitude: destinationLat, longitude: destinationLng },
        selectedMode,
        'Your Current Location',
        title,
        isPeakHour
      ).then((res) => {
        setDirections(res);

        // Record route telemetry
        recordRouteHistory({
          property_id: property?.id || 'prop_default',
          origin_lat: origin.latitude,
          origin_lng: origin.longitude,
          origin_address: 'Your Location',
          destination_lat: destinationLat,
          destination_lng: destinationLng,
          destination_address: title,
          transit_mode: selectedMode,
          eta_minutes: res.durationMinutes,
          distance_km: res.distanceKm,
          fare_estimate: res.estimatedFareRupees,
          co2_grams: res.co2Grams,
          is_peak_hour: isPeakHour,
        });
      });
    }, [destinationLat, destinationLng, isPeakHour, origin.latitude, origin.longitude, property?.id, selectedMode, title, visible]);

    const handleOpenExternal = (service: 'google' | 'apple') => {
      if (service === 'google') {
        openGoogleMaps(destinationLat, destinationLng, title);
      } else {
        openAppleMaps(destinationLat, destinationLng, title);
      }
    };

    return (
      <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <View style={styles.backdrop}>
          <View style={styles.sheetContainer}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerTitleCol}>
                <View style={styles.badgePill}>
                  <Navigation size={12} color={V4_COLORS.primary} />
                  <Text style={styles.badgeText}>GET DIRECTIONS</Text>
                </View>
                <Text style={styles.title} numberOfLines={1}>
                  Transit to {title}
                </Text>
              </View>

              <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={8}>
                <X size={18} color="#64748B" />
              </Pressable>
            </View>

            {/* Mode Switcher */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.modeTabsScroll}
            >
              {TRANSIT_MODES.map((mode) => {
                const isSelected = selectedMode === mode.id;
                const Icon = mode.icon;
                return (
                  <Pressable
                    key={mode.id}
                    style={[styles.modeTab, isSelected && styles.modeTabActive]}
                    onPress={() => setSelectedMode(mode.id)}
                  >
                    <Icon
                      size={14}
                      color={isSelected ? '#FFFFFF' : '#475569'}
                      strokeWidth={2.4}
                    />
                    <Text style={[styles.modeTabText, isSelected && styles.modeTabTextActive]}>
                      {mode.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Peak Hour Toggle Banner */}
            <Pressable
              style={[styles.peakToggleRow, isPeakHour && styles.peakToggleRowActive]}
              onPress={() => setIsPeakHour(!isPeakHour)}
            >
              <View style={styles.peakLeft}>
                <Flame size={14} color={isPeakHour ? '#DC2626' : '#64748B'} />
                <Text style={[styles.peakText, isPeakHour && styles.peakTextActive]}>
                  {isPeakHour ? 'Peak Hour Traffic Active (+60% Delay)' : 'Normal Traffic (Off-Peak)'}
                </Text>
              </View>
              <View style={[styles.togglePill, isPeakHour && styles.togglePillActive]}>
                <Text style={[styles.togglePillText, isPeakHour && styles.togglePillTextActive]}>
                  {isPeakHour ? 'ON' : 'OFF'}
                </Text>
              </View>
            </Pressable>

            {/* ETA Telemetry Grid */}
            {directions && (
              <View style={styles.telemetryGrid}>
                <View style={styles.metricCard}>
                  <Clock size={16} color={V4_COLORS.primary} />
                  <Text style={styles.metricVal}>{directions.durationMinutes} min</Text>
                  <Text style={styles.metricLabel}>Travel Time</Text>
                </View>

                <View style={styles.metricCard}>
                  <Navigation size={16} color="#0284C7" />
                  <Text style={styles.metricVal}>{directions.distanceKm} km</Text>
                  <Text style={styles.metricLabel}>Distance</Text>
                </View>

                <View style={styles.metricCard}>
                  <DollarSign size={16} color="#16A34A" />
                  <Text style={styles.metricVal}>₹{directions.estimatedFareRupees}</Text>
                  <Text style={styles.metricLabel}>Est. Fare</Text>
                </View>

                <View style={styles.metricCard}>
                  <Leaf size={16} color="#059669" />
                  <Text style={styles.metricVal}>{directions.co2Grams}g</Text>
                  <Text style={styles.metricLabel}>CO₂ Est.</Text>
                </View>
              </View>
            )}

            {/* Turn-by-Turn Steps */}
            <Text style={styles.itineraryTitle}>Recommended Itinerary</Text>
            <ScrollView style={styles.itineraryScroll} showsVerticalScrollIndicator={false}>
              {directions?.steps.map((step, idx) => (
                <View key={idx} style={styles.stepRow}>
                  <View style={styles.stepIndicatorCol}>
                    <View style={styles.stepDot} />
                    {idx < directions.steps.length - 1 && <View style={styles.stepLine} />}
                  </View>
                  <View style={styles.stepContentCol}>
                    <Text style={styles.stepInstruction}>{step.instruction}</Text>
                    <Text style={styles.stepMeta}>
                      {step.distanceMeters}m • ~{step.durationMinutes} min
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* External Navigation Buttons */}
            <View style={styles.actionsRow}>
              <Pressable
                style={styles.googleMapsBtn}
                onPress={() => handleOpenExternal('google')}
              >
                <ExternalLink size={14} color="#FFFFFF" />
                <Text style={styles.googleMapsBtnText}>Google Maps</Text>
              </Pressable>

              {Platform.OS === 'ios' && (
                <Pressable
                  style={styles.appleMapsBtn}
                  onPress={() => handleOpenExternal('apple')}
                >
                  <ExternalLink size={14} color="#0F172A" />
                  <Text style={styles.appleMapsBtnText}>Apple Maps</Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </Modal>
    );
  }
);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(3, 27, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitleCol: {
    flex: 1,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: V4_COLORS.primary,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  modeTabsScroll: {
    gap: 8,
    paddingVertical: 6,
    marginBottom: 10,
  },
  modeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    minHeight: 44,
  },
  modeTabActive: {
    backgroundColor: V4_COLORS.primary,
  },
  modeTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  modeTabTextActive: {
    color: '#FFFFFF',
  },
  peakToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 44,
  },
  peakToggleRowActive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  peakLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  peakText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  peakTextActive: {
    color: '#DC2626',
    fontWeight: '700',
  },
  togglePill: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  togglePillActive: {
    backgroundColor: '#DC2626',
  },
  togglePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
  },
  togglePillTextActive: {
    color: '#FFFFFF',
  },
  telemetryGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  metricVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  metricLabel: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
  },
  itineraryTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  itineraryScroll: {
    maxHeight: 150,
    marginBottom: 14,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  stepIndicatorCol: {
    alignItems: 'center',
    width: 14,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: V4_COLORS.primary,
    marginTop: 4,
  },
  stepLine: {
    width: 1.5,
    flex: 1,
    backgroundColor: '#CBD5E1',
    marginTop: 2,
  },
  stepContentCol: {
    flex: 1,
  },
  stepInstruction: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0F172A',
  },
  stepMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  googleMapsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: V4_COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
    minHeight: 44,
  },
  googleMapsBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  appleMapsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 12,
    minHeight: 44,
  },
  appleMapsBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
});

export default V4PropertyDirectionsModal;

