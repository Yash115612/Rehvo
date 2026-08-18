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
import { ArrowRight, BedDouble, Bath, Ruler, Building } from 'lucide-react-native';
import { useAppStore } from '../../../src/store/useAppStore';
import { ListingHeader } from '../../../src/components/listing/ListingHeader';
import { ListingExitModal } from '../../../src/components/listing/ListingExitModal';

const BHK_OPTIONS = ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4+ BHK', 'Studio'];
const BATH_OPTIONS = [1, 2, 3, 4, 5];

export default function ListingDetailsRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { listingDraft, updateListingDraft, resetListingDraft, showToast } =
    useAppStore();

  const [title, setTitle] = useState(listingDraft.title || '');
  const [bhk, setBhk] = useState(listingDraft.bhk || '2 BHK');
  const [bathrooms, setBathrooms] = useState(listingDraft.bathrooms || 2);
  const [areaSqFt, setAreaSqFt] = useState(
    listingDraft.area_sqft ? String(listingDraft.area_sqft) : '950',
  );
  const [titleError, setTitleError] = useState('');
  const [exitModalVisible, setExitModalVisible] = useState(false);

  const handleContinue = () => {
    if (title.trim().length < 4) {
      setTitleError('Please enter a descriptive property title (min 4 characters)');
      return;
    }

    const parsedArea = parseInt(areaSqFt, 10) || 800;

    updateListingDraft({
      title: title.trim(),
      bhk,
      bathrooms,
      area_sqft: parsedArea,
    });

    router.push('/(renter)/listing/location');
  };

  const handleSaveDraft = () => {
    updateListingDraft({
      title: title.trim(),
      bhk,
      bathrooms,
      area_sqft: parseInt(areaSqFt, 10) || 800,
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
        currentStep={2}
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
            <Text style={styles.titleText}>Tell us about the property</Text>
            <Text style={styles.subtitle}>
              Specify space, dimensions, and bathroom configuration.
            </Text>
          </View>

          {/* Field 1: Property Title */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Property Title *</Text>
            <TextInput
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (titleError) setTitleError('');
              }}
              placeholder="e.g. Modern 2 BHK with Balcony in Andheri West"
              placeholderTextColor="#8C8994"
              style={[styles.input, Boolean(titleError) && styles.inputError]}
            />
            {Boolean(titleError) && (
              <Text style={styles.errorText}>{titleError}</Text>
            )}
          </View>

          {/* Field 2: BHK Configuration */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <BedDouble size={16} color="#171522" strokeWidth={2} />
              <Text style={styles.fieldLabel}>Bedrooms / BHK *</Text>
            </View>
            <View style={styles.pillGrid}>
              {BHK_OPTIONS.map((opt) => {
                const isSelected = bhk === opt;
                return (
                  <Pressable
                    key={opt}
                    style={[styles.pill, isSelected && styles.pillSelected]}
                    onPress={() => setBhk(opt)}
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

          {/* Field 3: Bathrooms */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Bath size={16} color="#171522" strokeWidth={2} />
              <Text style={styles.fieldLabel}>Bathrooms *</Text>
            </View>
            <View style={styles.pillGrid}>
              {BATH_OPTIONS.map((num) => {
                const isSelected = bathrooms === num;
                return (
                  <Pressable
                    key={num}
                    style={[styles.pill, isSelected && styles.pillSelected]}
                    onPress={() => setBathrooms(num)}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        isSelected && styles.pillTextSelected,
                      ]}
                    >
                      {num} {num === 1 ? 'Bath' : 'Baths'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Field 4: Carpet Area */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Ruler size={16} color="#171522" strokeWidth={2} />
              <Text style={styles.fieldLabel}>Carpet Area (sq ft)</Text>
            </View>
            <View style={styles.areaInputWrap}>
              <TextInput
                value={areaSqFt}
                onChangeText={setAreaSqFt}
                placeholder="e.g. 950"
                placeholderTextColor="#8C8994"
                keyboardType="numeric"
                style={styles.areaInput}
              />
              <Text style={styles.areaSuffix}>sq ft</Text>
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
          accessibilityLabel="Continue to location"
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
    gap: 20,
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
  input: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
    paddingHorizontal: 16,
    fontSize: 14.5,
    color: '#171522',
    fontWeight: '500',
  },
  inputError: {
    borderColor: '#E5484D',
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E5484D',
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
  areaInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
    paddingHorizontal: 16,
  },
  areaInput: {
    flex: 1,
    fontSize: 15,
    color: '#171522',
    fontWeight: '600',
  },
  areaSuffix: {
    fontSize: 13,
    fontWeight: '600',
    color: '#777482',
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
