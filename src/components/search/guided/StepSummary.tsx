import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import {
  Building2,
  MapPin,
  IndianRupee,
  BedDouble,
  Armchair,
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react-native';
import { GuidedSearchState } from './guidedSearchTypes';

interface StepSummaryProps {
  state: GuidedSearchState;
  matchingCount: number;
  onEditStep: (stepIndex: number) => void;
  onSubmit: () => void;
}

export const StepSummary: React.FC<StepSummaryProps> = ({
  state,
  matchingCount,
  onEditStep,
  onSubmit,
}) => {
  const getCategoryLabel = () => {
    switch (state.category) {
      case 'FLAT':
        return 'Flat / Apartment';
      case 'PG':
        return 'PG / Co-living';
      case 'PRIVATE_ROOM':
        return 'Private Room';
      case 'SHARED_ROOM':
        return 'Shared Room';
      case 'FLATMATE':
        return 'Flatmate Space';
      case 'STUDIO':
        return 'Studio Apartment';
      default:
        return 'Rental Property';
    }
  };

  const getFurnishingLabel = () => {
    switch (state.furnishing) {
      case 'FULLY_FURNISHED':
        return 'Fully Furnished';
      case 'SEMI_FURNISHED':
        return 'Semi Furnished';
      case 'UNFURNISHED':
        return 'Unfurnished';
      case 'ALL':
      default:
        return 'Any Furnishing';
    }
  };

  const getMoveInLabel = () => {
    switch (state.moveInTime) {
      case 'IMMEDIATE':
        return 'Immediately';
      case 'WITHIN_2_WEEKS':
        return 'Within 2 weeks';
      case 'WITHIN_1_MONTH':
        return 'Within 1 month';
      case 'IN_2_3_MONTHS':
        return 'In 2–3 months';
      case 'NOT_DECIDED':
      default:
        return 'Flexible';
    }
  };

  const formatAmount = (val: number) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(0)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
    return `₹${val}`;
  };

  const budgetDisplay =
    state.rentMin === 0
      ? `Up to ${formatAmount(state.rentMax)} / month`
      : `${formatAmount(state.rentMin)} – ${formatAmount(state.rentMax)} / month`;

  const locationDisplay =
    state.locations.length > 0
      ? state.locations.join(', ')
      : 'All Mumbai';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your search summary</Text>
        <Text style={styles.subtitle}>
          Everything is set! Tap any row to customize before seeing results.
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Match Count Hero Banner */}
        <View style={styles.matchBanner}>
          <View style={styles.sparkleCircle}>
            <Sparkles size={22} color="#6C4DFF" strokeWidth={2.2} />
          </View>
          <View>
            <Text style={styles.matchCount}>
              {matchingCount > 0 ? `${matchingCount}+ homes match` : 'Matches found'}
            </Text>
            <Text style={styles.matchSub}>
              Based on your custom requirements in Mumbai
            </Text>
          </View>
        </View>

        {/* Summary Card List */}
        <View style={styles.summaryCard}>
          {/* Row 1: Property Type */}
          <Pressable
            style={styles.summaryRow}
            onPress={() => onEditStep(0)}
          >
            <View style={styles.rowLeft}>
              <View style={styles.iconCircle}>
                <Building2 size={18} color="#6C4DFF" strokeWidth={2} />
              </View>
              <View>
                <Text style={styles.rowLabel}>Property Type</Text>
                <Text style={styles.rowValue}>{getCategoryLabel()}</Text>
              </View>
            </View>
            <ChevronRight size={16} color="#A5A2AD" />
          </Pressable>

          {/* Row 2: Budget */}
          <Pressable
            style={styles.summaryRow}
            onPress={() => onEditStep(1)}
          >
            <View style={styles.rowLeft}>
              <View style={styles.iconCircle}>
                <IndianRupee size={18} color="#6C4DFF" strokeWidth={2.2} />
              </View>
              <View>
                <Text style={styles.rowLabel}>Monthly Budget</Text>
                <Text style={styles.rowValue}>{budgetDisplay}</Text>
              </View>
            </View>
            <ChevronRight size={16} color="#A5A2AD" />
          </Pressable>

          {/* Row 3: Location */}
          <Pressable
            style={styles.summaryRow}
            onPress={() => onEditStep(2)}
          >
            <View style={styles.rowLeft}>
              <View style={styles.iconCircle}>
                <MapPin size={18} color="#6C4DFF" strokeWidth={2} />
              </View>
              <View>
                <Text style={styles.rowLabel}>Preferred Areas</Text>
                <Text style={styles.rowValue} numberOfLines={1}>
                  {locationDisplay}
                </Text>
              </View>
            </View>
            <ChevronRight size={16} color="#A5A2AD" />
          </Pressable>

          {/* Row 4: Space / BHK */}
          <Pressable
            style={styles.summaryRow}
            onPress={() => onEditStep(3)}
          >
            <View style={styles.rowLeft}>
              <View style={styles.iconCircle}>
                <BedDouble size={18} color="#6C4DFF" strokeWidth={2} />
              </View>
              <View>
                <Text style={styles.rowLabel}>Space & Layout</Text>
                <Text style={styles.rowValue}>{state.spaceType}</Text>
              </View>
            </View>
            <ChevronRight size={16} color="#A5A2AD" />
          </Pressable>

          {/* Row 5: Furnishing */}
          <Pressable
            style={styles.summaryRow}
            onPress={() => onEditStep(4)}
          >
            <View style={styles.rowLeft}>
              <View style={styles.iconCircle}>
                <Armchair size={18} color="#6C4DFF" strokeWidth={2} />
              </View>
              <View>
                <Text style={styles.rowLabel}>Furnishing</Text>
                <Text style={styles.rowValue}>{getFurnishingLabel()}</Text>
              </View>
            </View>
            <ChevronRight size={16} color="#A5A2AD" />
          </Pressable>

          {/* Row 6: Preferences */}
          <Pressable
            style={styles.summaryRow}
            onPress={() => onEditStep(5)}
          >
            <View style={styles.rowLeft}>
              <View style={styles.iconCircle}>
                <ShieldCheck size={18} color="#6C4DFF" strokeWidth={2} />
              </View>
              <View>
                <Text style={styles.rowLabel}>Important Perks</Text>
                <Text style={styles.rowValue} numberOfLines={1}>
                  {state.preferences.length > 0
                    ? state.preferences.join(', ')
                    : 'None specified'}
                </Text>
              </View>
            </View>
            <ChevronRight size={16} color="#A5A2AD" />
          </Pressable>

          {/* Row 7: Move-in */}
          <Pressable
            style={[styles.summaryRow, { borderBottomWidth: 0 }]}
            onPress={() => onEditStep(6)}
          >
            <View style={styles.rowLeft}>
              <View style={styles.iconCircle}>
                <Calendar size={18} color="#6C4DFF" strokeWidth={2} />
              </View>
              <View>
                <Text style={styles.rowLabel}>Move-In Date</Text>
                <Text style={styles.rowValue}>{getMoveInLabel()}</Text>
              </View>
            </View>
            <ChevronRight size={16} color="#A5A2AD" />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 14,
    color: '#777482',
    fontWeight: '500',
    marginTop: 4,
  },
  scrollContent: {
    gap: 16,
    paddingBottom: 24,
  },
  matchBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#F0ECFF',
    borderWidth: 1.5,
    borderColor: '#D4C8FF',
    borderRadius: 18,
    padding: 16,
  },
  sparkleCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchCount: {
    fontSize: 17,
    fontWeight: '800',
    color: '#171522',
  },
  matchSub: {
    fontSize: 12.5,
    color: '#777482',
    fontWeight: '500',
    marginTop: 2,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    overflow: 'hidden',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F0EA',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 8,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F7F4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#777482',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  rowValue: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#171522',
    marginTop: 2,
  },
});
