import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Wifi,
  Snowflake,
  Car,
  Building2,
  Zap,
  ShieldCheck,
  Waves,
  Utensils,
  Sun,
  Dumbbell,
  Flame,
  Tv,
  Box,
  Shield,
  Check,
  ArrowRight,
} from 'lucide-react-native';
import { useAppStore } from '../../../src/store/useAppStore';
import { ListingHeader } from '../../../src/components/listing/ListingHeader';
import { ListingExitModal } from '../../../src/components/listing/ListingExitModal';

interface AmenityOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
}

const AMENITY_OPTIONS: AmenityOption[] = [
  { id: 'Wi-Fi', label: 'High-Speed Wi-Fi', icon: Wifi },
  { id: 'Air Conditioning', label: 'Air Conditioning', icon: Snowflake },
  { id: 'Dedicated Parking', label: 'Dedicated Parking', icon: Car },
  { id: 'Elevator / Lift', label: 'Elevator / Lift', icon: Building2 },
  { id: 'Power Backup', label: '24/7 Power Backup', icon: Zap },
  { id: '24/7 Security', label: '24/7 Gated Security', icon: ShieldCheck },
  { id: 'Washing Machine', label: 'Washing Machine', icon: Waves },
  { id: 'Modular Kitchen', label: 'Modular Kitchen', icon: Utensils },
  { id: 'Balcony', label: 'Private Balcony', icon: Sun },
  { id: 'Gym', label: 'Fitness Center / Gym', icon: Dumbbell },
  { id: 'Swimming Pool', label: 'Swimming Pool', icon: Waves },
  { id: 'Geyser', label: 'Water Geyser', icon: Flame },
  { id: 'TV', label: 'Smart TV', icon: Tv },
  { id: 'Refrigerator', label: 'Refrigerator', icon: Box },
  { id: 'CCTV', label: 'CCTV Surveillance', icon: Shield },
];

export default function ListingAmenitiesRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { listingDraft, updateListingDraft, resetListingDraft, showToast } =
    useAppStore();

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    listingDraft.amenities || ['High-Speed Wi-Fi', '24/7 Security', 'Elevator / Lift'],
  );
  const [exitModalVisible, setExitModalVisible] = useState(false);

  const toggleAmenity = (id: string) => {
    if (selectedAmenities.includes(id)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== id));
    } else {
      setSelectedAmenities([...selectedAmenities, id]);
    }
  };

  const handleContinue = () => {
    updateListingDraft({ amenities: selectedAmenities });
    router.push('/(renter)/listing/photos');
  };

  const handleSaveDraft = () => {
    updateListingDraft({ amenities: selectedAmenities });
    setExitModalVisible(false);
    showToast('Listing draft saved', 'success');
    router.replace('/(renter)/home');
  };

  const handleDiscard = () => {
    resetListingDraft();
    setExitModalVisible(false);
    router.replace('/(renter)/home');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ListingHeader
        currentStep={6}
        totalSteps={10}
        onBack={() => router.back()}
        onClose={() => setExitModalVisible(true)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 90 },
        ]}
      >
        <View style={styles.headingBlock}>
          <Text style={styles.titleText}>What amenities are available?</Text>
          <Text style={styles.subtitle}>
            Select all amenities and lifestyle perks included with the property.
          </Text>
        </View>

        {/* Selected Count Indicator */}
        <View style={styles.countBadge}>
          <Text style={styles.countText}>
            {selectedAmenities.length} amenities selected
          </Text>
        </View>

        {/* Amenity Grid */}
        <View style={styles.grid}>
          {AMENITY_OPTIONS.map((item) => {
            const isSelected = selectedAmenities.includes(item.id);
            const Icon = item.icon;

            return (
              <Pressable
                key={item.id}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => toggleAmenity(item.id)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isSelected }}
              >
                <View
                  style={[
                    styles.iconCircle,
                    isSelected && styles.iconCircleSelected,
                  ]}
                >
                  <Icon
                    size={20}
                    color={isSelected ? '#6C4DFF' : '#171522'}
                    strokeWidth={1.9}
                  />
                </View>

                <Text
                  style={[styles.cardLabel, isSelected && styles.cardLabelSelected]}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>

                <View
                  style={[
                    styles.checkbox,
                    isSelected && styles.checkboxSelected,
                  ]}
                >
                  {isSelected && (
                    <Check size={12} color="#FFFFFF" strokeWidth={3} />
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <Pressable
          style={styles.continueBtn}
          onPress={handleContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue to photos"
        >
          <Text style={styles.continueBtnText}>Continue</Text>
          <ArrowRight size={17} color="#FFFFFF" strokeWidth={2.2} />
        </Pressable>
      </View>

      {/* Exit Confirmation Modal */}
      <ListingExitModal
        visible={exitModalVisible}
        onSaveDraft={handleSaveDraft}
        onDiscard={handleDiscard}
        onCancel={() => setExitModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7F4',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 16,
  },
  headingBlock: {
    marginBottom: 2,
  },
  titleText: {
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
  countBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F0ECFF',
    borderWidth: 1,
    borderColor: '#D4C8FF',
  },
  countText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  grid: {
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
  },
  cardSelected: {
    backgroundColor: '#F7F4FF',
    borderColor: '#6C4DFF',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F0EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconCircleSelected: {
    backgroundColor: '#ECE7FF',
  },
  cardLabel: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '600',
    color: '#171522',
  },
  cardLabelSelected: {
    color: '#171522',
    fontWeight: '700',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#D4D0DC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#6C4DFF',
    borderColor: '#6C4DFF',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E5EC',
  },
  continueBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#6C4DFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  continueBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
