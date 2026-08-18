import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import {
  Sparkles,
  Building2,
  MapPin,
  IndianRupee,
  Armchair,
  CheckCircle2,
  CalendarDays,
  ArrowRight,
  Edit3,
} from 'lucide-react-native';
import { RenterPropertyTypeChoice } from './RenterPropertyTypeStep';
import { BudgetPreset } from './RenterBudgetStep';
import { FurnishingChoice } from './RenterFurnishingStep';
import { MoveInTiming } from './RenterMoveInStep';

interface RenterSummaryStepProps {
  propertyType: RenterPropertyTypeChoice;
  locations: string[];
  budget: BudgetPreset;
  space: string;
  furnishing: FurnishingChoice;
  preferences: string[];
  moveIn: MoveInTiming;
  onFinish: () => void;
  onEdit: () => void;
}

export const RenterSummaryStep: React.FC<RenterSummaryStepProps> = ({
  propertyType,
  locations,
  budget,
  space,
  furnishing,
  preferences,
  moveIn,
  onFinish,
  onEdit,
}) => {
  const getFurnishingLabel = (f: FurnishingChoice) => {
    switch (f) {
      case 'FULLY_FURNISHED':
        return 'Fully Furnished';
      case 'SEMI_FURNISHED':
        return 'Semi Furnished';
      case 'UNFURNISHED':
        return 'Unfurnished';
      default:
        return 'Any Furnishing';
    }
  };

  const getPropertyTypeLabel = (p: RenterPropertyTypeChoice) => {
    switch (p) {
      case 'FLAT':
        return 'Rent / Apartment';
      case 'PG':
        return 'PG / Co-living';
      case 'PRIVATE_ROOM':
        return 'Private Room';
      case 'SHARED_ROOM':
        return 'Shared Room';
      case 'FLATMATE':
        return 'Flatmate Space';
      case 'STUDIO':
        return 'Studio';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleGroup}>
        <View style={styles.pillBadge}>
          <Sparkles size={14} color="#6C4DFF" strokeWidth={2.2} />
          <Text style={styles.pillBadgeText}>Personalized for you</Text>
        </View>
        <Text style={styles.heading}>Your REHVO profile is ready.</Text>
        <Text style={styles.subheading}>
          We've customized your Home feed and search recommendations based on
          what you're looking for.
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.summaryCard}>
          {/* 1. Looking For */}
          <View style={styles.summaryRow}>
            <View style={styles.iconWrap}>
              <Building2 size={18} color="#6C4DFF" strokeWidth={2} />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryLabel}>Looking for</Text>
              <Text style={styles.summaryVal}>
                {space ? `${space} · ` : ''}
                {getPropertyTypeLabel(propertyType)}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* 2. Target Locations */}
          <View style={styles.summaryRow}>
            <View style={styles.iconWrap}>
              <MapPin size={18} color="#6C4DFF" strokeWidth={2} />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryLabel}>Preferred localities</Text>
              <Text style={styles.summaryVal}>
                {locations.length > 0
                  ? locations.join(', ')
                  : 'Across Mumbai'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* 3. Budget */}
          <View style={styles.summaryRow}>
            <View style={styles.iconWrap}>
              <IndianRupee size={18} color="#6C4DFF" strokeWidth={2} />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryLabel}>Target budget</Text>
              <Text style={styles.summaryVal}>{budget.label} / month</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* 4. Furnishing */}
          <View style={styles.summaryRow}>
            <View style={styles.iconWrap}>
              <Armchair size={18} color="#6C4DFF" strokeWidth={2} />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryLabel}>Furnishing</Text>
              <Text style={styles.summaryVal}>
                {getFurnishingLabel(furnishing)}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* 5. Key Preferences */}
          {preferences.length > 0 && (
            <>
              <View style={styles.summaryRow}>
                <View style={styles.iconWrap}>
                  <CheckCircle2 size={18} color="#6C4DFF" strokeWidth={2} />
                </View>
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryLabel}>Key preferences</Text>
                  <Text style={styles.summaryVal}>
                    {preferences.join(' · ')}
                  </Text>
                </View>
              </View>
              <View style={styles.divider} />
            </>
          )}

          {/* 6. Move-in Timing */}
          <View style={styles.summaryRow}>
            <View style={styles.iconWrap}>
              <CalendarDays size={18} color="#6C4DFF" strokeWidth={2} />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryLabel}>Move-in timeline</Text>
              <Text style={styles.summaryVal}>{moveIn}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable
          style={styles.continueBtn}
          onPress={onFinish}
          accessibilityRole="button"
          accessibilityLabel="Show me homes on REHVO"
        >
          <Text style={styles.continueBtnText}>Show me homes</Text>
          <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.2} />
        </Pressable>

        <Pressable
          style={styles.editBtn}
          onPress={onEdit}
          accessibilityRole="button"
          accessibilityLabel="Edit preferences"
        >
          <Edit3 size={15} color="#777482" />
          <Text style={styles.editBtnText}>Edit preferences</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  titleGroup: {
    paddingVertical: 12,
    gap: 6,
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0ECFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#DED6FD',
  },
  pillBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.4,
  },
  subheading: {
    fontSize: 14,
    color: '#777482',
    lineHeight: 20,
    fontWeight: '500',
  },
  scrollContent: {
    paddingVertical: 8,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 16,
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F0ECFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryContent: {
    flex: 1,
    gap: 2,
  },
  summaryLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#777482',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  summaryVal: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#171522',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F0EA',
  },
  footer: {
    paddingVertical: 12,
    gap: 8,
  },
  continueBtn: {
    height: 54,
    borderRadius: 16,
    backgroundColor: '#6C4DFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#6C4DFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 4,
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  editBtnText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#777482',
  },
});
