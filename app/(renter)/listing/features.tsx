import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Armchair,
  Car,
  Sun,
  Building,
  Users,
  Check,
  ArrowRight,
} from 'lucide-react-native';
import { useAppStore } from '../../../src/store/useAppStore';
import { ListingHeader } from '../../../src/components/listing/ListingHeader';
import { ListingExitModal } from '../../../src/components/listing/ListingExitModal';
import { FurnishingType } from '../../../src/types';

const FURNISHING_OPTIONS: { id: FurnishingType; label: string }[] = [
  { id: 'FULLY_FURNISHED', label: 'Fully Furnished' },
  { id: 'SEMI_FURNISHED', label: 'Semi Furnished' },
  { id: 'UNFURNISHED', label: 'Unfurnished' },
];

const PARKING_OPTIONS = ['Car & Bike', '2 Wheeler Only', 'None'];

const TENANT_OPTIONS = [
  'All Welcome',
  'Family Preferred',
  'Bachelors Allowed',
  'Working Professionals Only',
];

export default function ListingFeaturesRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { listingDraft, updateListingDraft, resetListingDraft, showToast } =
    useAppStore();

  const [furnishing, setFurnishing] = useState<FurnishingType>(
    listingDraft.furnishing || 'SEMI_FURNISHED',
  );
  const [parking, setParking] = useState('Car & Bike');
  const [balcony, setBalcony] = useState(true);
  const [floor, setFloor] = useState('4');
  const [totalFloors, setTotalFloors] = useState('12');
  const [tenantPref, setTenantPref] = useState('All Welcome');
  const [exitModalVisible, setExitModalVisible] = useState(false);

  const handleContinue = () => {
    updateListingDraft({
      furnishing,
      tenant_preferences: [tenantPref],
    });

    router.push('/(renter)/listing/amenities');
  };

  const handleSaveDraft = () => {
    updateListingDraft({
      furnishing,
      tenant_preferences: [tenantPref],
    });
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
        currentStep={5}
        totalSteps={10}
        onBack={() => router.back()}
        onClose={() => setExitModalVisible(true)}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: Math.max(insets.bottom, 20) + 90 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headingBlock}>
            <Text style={styles.titleText}>What does the property include?</Text>
            <Text style={styles.subtitle}>
              Specify furnishing level, parking, floor level, and preferences.
            </Text>
          </View>

          {/* Furnishing */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Armchair size={16} color="#171522" strokeWidth={2} />
              <Text style={styles.fieldLabel}>Furnishing Status *</Text>
            </View>
            <View style={styles.pillGrid}>
              {FURNISHING_OPTIONS.map((opt) => {
                const isSelected = furnishing === opt.id;
                return (
                  <Pressable
                    key={opt.id}
                    style={[styles.pill, isSelected && styles.pillSelected]}
                    onPress={() => setFurnishing(opt.id)}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        isSelected && styles.pillTextSelected,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Parking */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Car size={16} color="#171522" strokeWidth={2} />
              <Text style={styles.fieldLabel}>Parking Facilities</Text>
            </View>
            <View style={styles.pillGrid}>
              {PARKING_OPTIONS.map((opt) => {
                const isSelected = parking === opt;
                return (
                  <Pressable
                    key={opt}
                    style={[styles.pill, isSelected && styles.pillSelected]}
                    onPress={() => setParking(opt)}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        isSelected && styles.pillTextSelected,
                      ]}
                    >
                      {opt}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Balcony */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Sun size={16} color="#171522" strokeWidth={2} />
              <Text style={styles.fieldLabel}>Private Balcony / Terrace</Text>
            </View>
            <View style={styles.pillGrid}>
              <Pressable
                style={[styles.pill, balcony && styles.pillSelected]}
                onPress={() => setBalcony(true)}
              >
                <Text
                  style={[
                    styles.pillText,
                    balcony && styles.pillTextSelected,
                  ]}
                >
                  Yes, has balcony
                </Text>
              </Pressable>
              <Pressable
                style={[styles.pill, !balcony && styles.pillSelected]}
                onPress={() => setBalcony(false)}
              >
                <Text
                  style={[
                    styles.pillText,
                    !balcony && styles.pillTextSelected,
                  ]}
                >
                  No balcony
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Floor & Total Floors */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Building size={16} color="#171522" strokeWidth={2} />
              <Text style={styles.fieldLabel}>Floor Details</Text>
            </View>
            <View style={styles.rowTwo}>
              <View style={[styles.inputSubWrap, { flex: 1 }]}>
                <Text style={styles.subLabel}>Property Floor</Text>
                <TextInput
                  value={floor}
                  onChangeText={setFloor}
                  placeholder="4"
                  keyboardType="numeric"
                  style={styles.numericInput}
                />
              </View>
              <View style={[styles.inputSubWrap, { flex: 1 }]}>
                <Text style={styles.subLabel}>Total Floors in Building</Text>
                <TextInput
                  value={totalFloors}
                  onChangeText={setTotalFloors}
                  placeholder="12"
                  keyboardType="numeric"
                  style={styles.numericInput}
                />
              </View>
            </View>
          </View>

          {/* Tenant Preferences */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Users size={16} color="#171522" strokeWidth={2} />
              <Text style={styles.fieldLabel}>Tenant Preference</Text>
            </View>
            <View style={styles.pillGrid}>
              {TENANT_OPTIONS.map((opt) => {
                const isSelected = tenantPref === opt;
                return (
                  <Pressable
                    key={opt}
                    style={[styles.pill, isSelected && styles.pillSelected]}
                    onPress={() => setTenantPref(opt)}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        isSelected && styles.pillTextSelected,
                      ]}
                    >
                      {opt}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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
          accessibilityLabel="Continue to amenities"
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
    gap: 18,
  },
  headingBlock: {
    marginBottom: 4,
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
  fieldGroup: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fieldLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#171522',
  },
  pillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
  },
  pillSelected: {
    backgroundColor: '#6C4DFF',
    borderColor: '#6C4DFF',
  },
  pillText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#171522',
  },
  pillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  rowTwo: {
    flexDirection: 'row',
    gap: 12,
  },
  inputSubWrap: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
    padding: 12,
    gap: 4,
  },
  subLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#777482',
  },
  numericInput: {
    fontSize: 16,
    fontWeight: '700',
    color: '#171522',
    paddingVertical: 2,
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
