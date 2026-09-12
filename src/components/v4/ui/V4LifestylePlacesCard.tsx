import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import {
  MapPin,
  GraduationCap,
  HeartPulse,
  ShoppingBag,
  Coffee,
  Dumbbell,
  Train,
  Trees,
  Star,
  Clock,
} from 'lucide-react-native';
import { LocalityPlacesRecord, PlaceItem } from '../../../types';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';

interface V4LifestylePlacesCardProps {
  places: LocalityPlacesRecord;
}

type PlaceCategory =
  | 'schools'
  | 'hospitals'
  | 'cafes'
  | 'gyms'
  | 'metro'
  | 'malls'
  | 'parks';

const CATEGORIES: { key: PlaceCategory; label: string; icon: any }[] = [
  { key: 'metro', label: 'Metro', icon: Train },
  { key: 'cafes', label: 'Cafes & Dining', icon: Coffee },
  { key: 'gyms', label: 'Gyms', icon: Dumbbell },
  { key: 'hospitals', label: 'Hospitals', icon: HeartPulse },
  { key: 'schools', label: 'Schools', icon: GraduationCap },
  { key: 'malls', label: 'Shopping', icon: ShoppingBag },
  { key: 'parks', label: 'Parks', icon: Trees },
];

export const V4LifestylePlacesCard: React.FC<V4LifestylePlacesCardProps> = React.memo(
  ({ places }) => {
    const [selectedCategory, setSelectedCategory] = useState<PlaceCategory>('metro');

    const activeList: PlaceItem[] = useMemo(() => {
      return (places[selectedCategory] as PlaceItem[]) || [];
    }, [places, selectedCategory]);

    return (
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.iconCircle}>
            <MapPin size={20} color={V4_COLORS.primary} />
          </View>
          <View style={styles.headerTextCol}>
            <Text style={styles.title}>Lifestyle & Nearby Essentials</Text>
            <Text style={styles.subtitle}>
              Verified distances and travel times to daily landmarks
            </Text>
          </View>
        </View>

        {/* Category Filter Pills Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryPillsContainer}
        >
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.key;
            const count = ((places[cat.key] as PlaceItem[]) || []).length;

            return (
              <Pressable
                key={cat.key}
                onPress={() => setSelectedCategory(cat.key)}
                style={[
                  styles.categoryPill,
                  isSelected && styles.categoryPillActive,
                ]}
              >
                <Icon
                  size={14}
                  color={isSelected ? '#FFFFFF' : '#475569'}
                />
                <Text
                  style={[
                    styles.categoryPillText,
                    isSelected && styles.categoryPillTextActive,
                  ]}
                >
                  {cat.label} ({count})
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Places List */}
        <View style={styles.placesList}>
          {activeList.map((place, idx) => (
            <View key={idx} style={styles.placeRow}>
              <View style={styles.placeLeftCol}>
                <Text style={styles.placeName}>{place.name}</Text>
                <View style={styles.placeMetaRow}>
                  <View style={styles.metaItem}>
                    <MapPin size={11} color="#0F766E" />
                    <Text style={styles.metaText}>{place.distance_km} km away</Text>
                  </View>
                  {place.time_mins && (
                    <View style={styles.metaItem}>
                      <Clock size={11} color="#64748B" />
                      <Text style={styles.metaText}>~{place.time_mins} mins</Text>
                    </View>
                  )}
                </View>
              </View>

              {place.rating && (
                <View style={styles.ratingBadge}>
                  <Star size={12} color="#D97706" fill="#D97706" />
                  <Text style={styles.ratingText}>{place.rating.toFixed(1)}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: V4_RADIUS.card,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 16,
    ...V4_SHADOWS.card,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: V4_COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextCol: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  categoryPillsContainer: {
    gap: 8,
    paddingVertical: 2,
  },
  categoryPill: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryPillActive: {
    backgroundColor: V4_COLORS.primary,
    borderColor: V4_COLORS.primary,
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  placesList: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  placeLeftCol: {
    flex: 1,
    paddingRight: 10,
    gap: 3,
  },
  placeName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  placeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  ratingText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#D97706',
  },
});
