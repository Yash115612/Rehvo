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
  MapPin,
  Search,
  Building,
  Navigation,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react-native';
import { useAppStore } from '../../../src/store/useAppStore';
import { ListingHeader } from '../../../src/components/listing/ListingHeader';
import { ListingExitModal } from '../../../src/components/listing/ListingExitModal';
import { MUMBAI_LOCALITIES } from '../../../src/constants/theme';

export default function ListingLocationRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { listingDraft, updateListingDraft, resetListingDraft, showToast } =
    useAppStore();

  const [city, setCity] = useState(listingDraft.city || 'Mumbai');
  const [locality, setLocality] = useState(listingDraft.locality || 'Andheri West');
  const [address, setAddress] = useState(listingDraft.address || '');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('400058');
  const [errorMsg, setErrorMsg] = useState('');
  const [exitModalVisible, setExitModalVisible] = useState(false);

  const handleContinue = () => {
    if (locality.trim().length < 2) {
      setErrorMsg('Please enter or select a valid locality');
      return;
    }
    if (address.trim().length < 4) {
      setErrorMsg('Please enter building/street address details');
      return;
    }

    updateListingDraft({
      city: city.trim(),
      locality: locality.trim(),
      address: address.trim(),
    });

    router.push('/(renter)/listing/pricing');
  };

  const handleSaveDraft = () => {
    updateListingDraft({
      city: city.trim(),
      locality: locality.trim(),
      address: address.trim(),
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
        currentStep={3}
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
            <Text style={styles.titleText}>Where is your property?</Text>
            <Text style={styles.subtitle}>
              Accurate address details help genuine renters locate your property.
            </Text>
          </View>

          {/* City & Locality */}
          <View style={styles.rowTwo}>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>City *</Text>
              <TextInput
                value={city}
                onChangeText={setCity}
                placeholder="Mumbai"
                placeholderTextColor="#8C8994"
                style={styles.input}
              />
            </View>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>Pincode</Text>
              <TextInput
                value={pincode}
                onChangeText={setPincode}
                placeholder="400058"
                placeholderTextColor="#8C8994"
                keyboardType="numeric"
                maxLength={6}
                style={styles.input}
              />
            </View>
          </View>

          {/* Locality Search / Input */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Locality / Area *</Text>
            <View style={styles.searchWrap}>
              <MapPin size={17} color="#6C4DFF" strokeWidth={2} />
              <TextInput
                value={locality}
                onChangeText={(t) => {
                  setLocality(t);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="e.g. Andheri West"
                placeholderTextColor="#8C8994"
                style={styles.searchInput}
              />
            </View>
          </View>

          {/* Quick Locality Suggestions */}
          <View style={styles.quickAreaWrap}>
            <Text style={styles.quickAreaLabel}>Popular Mumbai Localities</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.areaScroll}
            >
              {MUMBAI_LOCALITIES.slice(0, 7).map((loc) => {
                const isSelected = locality.toLowerCase() === loc.toLowerCase();
                return (
                  <Pressable
                    key={loc}
                    style={[styles.areaPill, isSelected && styles.areaPillSelected]}
                    onPress={() => {
                      setLocality(loc);
                      if (errorMsg) setErrorMsg('');
                    }}
                  >
                    <Text
                      style={[
                        styles.areaPillText,
                        isSelected && styles.areaPillTextSelected,
                      ]}
                    >
                      {loc}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Full Building / Street Address */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Flat / Building / Street Address *</Text>
            <TextInput
              value={address}
              onChangeText={(t) => {
                setAddress(t);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="e.g. Flat 402, Sea Crest Towers, Lokhandwala Complex"
              placeholderTextColor="#8C8994"
              style={styles.input}
            />
          </View>

          {/* Landmark */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Landmark (Optional)</Text>
            <TextInput
              value={landmark}
              onChangeText={setLandmark}
              placeholder="e.g. Near Infinity Mall & Metro Station"
              placeholderTextColor="#8C8994"
              style={styles.input}
            />
          </View>

          {Boolean(errorMsg) && (
            <Text style={styles.errorText}>{errorMsg}</Text>
          )}

          {/* Compact Location Summary Card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryCardIcon}>
              <CheckCircle2 size={20} color="#32B768" strokeWidth={2.2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.summaryCardTitle}>
                {locality || 'Locality'}, {city}
              </Text>
              <Text style={styles.summaryCardAddress} numberOfLines={1}>
                {address || 'Address details'} · {pincode}
              </Text>
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
          accessibilityLabel="Confirm location and continue"
        >
          <Text style={styles.continueBtnText}>Confirm & Continue</Text>
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
  rowTwo: {
    flexDirection: 'row',
    gap: 12,
  },
  fieldGroup: {
    gap: 8,
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
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
    paddingHorizontal: 14,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14.5,
    color: '#171522',
    fontWeight: '600',
  },
  quickAreaWrap: {
    gap: 8,
  },
  quickAreaLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#777482',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  areaScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  areaPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
  },
  areaPillSelected: {
    backgroundColor: '#6C4DFF',
    borderColor: '#6C4DFF',
  },
  areaPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#171522',
  },
  areaPillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  errorText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#E5484D',
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F0ECFF',
    borderWidth: 1.5,
    borderColor: '#D4C8FF',
    borderRadius: 16,
    padding: 14,
    marginTop: 4,
  },
  summaryCardIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171522',
  },
  summaryCardAddress: {
    fontSize: 12,
    fontWeight: '500',
    color: '#777482',
    marginTop: 1,
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
