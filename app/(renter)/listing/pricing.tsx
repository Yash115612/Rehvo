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
  IndianRupee,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react-native';
import { useAppStore } from '../../../src/store/useAppStore';
import { ListingHeader } from '../../../src/components/listing/ListingHeader';
import { ListingExitModal } from '../../../src/components/listing/ListingExitModal';

type BrokerageType = 'NONE' | 'FIXED' | 'ONE_MONTH';

export default function ListingPricingRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { listingDraft, updateListingDraft, resetListingDraft, showToast } =
    useAppStore();

  const [rent, setRent] = useState(
    listingDraft.rent ? String(listingDraft.rent) : '35000',
  );
  const [deposit, setDeposit] = useState(
    listingDraft.deposit ? String(listingDraft.deposit) : '100000',
  );
  const [maintenance, setMaintenance] = useState(
    listingDraft.maintenance ? String(listingDraft.maintenance) : '2500',
  );
  const [brokerageType, setBrokerageType] = useState<BrokerageType>(
    listingDraft.brokerage === 0 ? 'NONE' : 'FIXED',
  );
  const [customBrokerage, setCustomBrokerage] = useState(
    listingDraft.brokerage ? String(listingDraft.brokerage) : '0',
  );
  const [errorMsg, setErrorMsg] = useState('');
  const [exitModalVisible, setExitModalVisible] = useState(false);

  const parsedRent = parseInt(rent.replace(/[^0-9]/g, ''), 10) || 0;
  const parsedDeposit = parseInt(deposit.replace(/[^0-9]/g, ''), 10) || 0;
  const parsedMaintenance =
    parseInt(maintenance.replace(/[^0-9]/g, ''), 10) || 0;

  const calculateBrokerage = () => {
    if (brokerageType === 'NONE') return 0;
    if (brokerageType === 'ONE_MONTH') return parsedRent;
    return parseInt(customBrokerage.replace(/[^0-9]/g, ''), 10) || 0;
  };

  const handleContinue = () => {
    if (parsedRent < 1000) {
      setErrorMsg('Please enter a valid monthly rent amount (min ₹1,000)');
      return;
    }

    const finalBrokerage = calculateBrokerage();

    updateListingDraft({
      rent: parsedRent,
      deposit: parsedDeposit,
      maintenance: parsedMaintenance,
      brokerage: finalBrokerage,
      no_brokerage: finalBrokerage === 0,
    });

    router.push('/(renter)/listing/features');
  };

  const handleSaveDraft = () => {
    updateListingDraft({
      rent: parsedRent,
      deposit: parsedDeposit,
      maintenance: parsedMaintenance,
      brokerage: calculateBrokerage(),
      no_brokerage: calculateBrokerage() === 0,
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
        currentStep={4}
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
            <Text style={styles.titleText}>Set your rent & deposit</Text>
            <Text style={styles.subtitle}>
              Clear pricing builds trust and attracts verified renters faster.
            </Text>
          </View>

          {/* Monthly Rent */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Monthly Rent (₹) *</Text>
            <View style={styles.currencyWrap}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                value={rent}
                onChangeText={(t) => {
                  setRent(t);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="35000"
                placeholderTextColor="#8C8994"
                keyboardType="numeric"
                style={styles.currencyInput}
              />
              <Text style={styles.currencyPeriod}>/ month</Text>
            </View>
          </View>

          {/* Security Deposit */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Security Deposit (₹)</Text>
            <View style={styles.currencyWrap}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                value={deposit}
                onChangeText={setDeposit}
                placeholder="100000"
                placeholderTextColor="#8C8994"
                keyboardType="numeric"
                style={styles.currencyInput}
              />
            </View>
          </View>

          {/* Maintenance Charges */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Monthly Maintenance (₹)</Text>
            <View style={styles.currencyWrap}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                value={maintenance}
                onChangeText={setMaintenance}
                placeholder="2500"
                placeholderTextColor="#8C8994"
                keyboardType="numeric"
                style={styles.currencyInput}
              />
              <Text style={styles.currencyPeriod}>/ month</Text>
            </View>
          </View>

          {/* Brokerage Status */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Brokerage / Commission</Text>
            <View style={styles.segmentedRow}>
              <Pressable
                style={[
                  styles.segmentBtn,
                  brokerageType === 'NONE' && styles.segmentBtnSelected,
                ]}
                onPress={() => setBrokerageType('NONE')}
              >
                <Text
                  style={[
                    styles.segmentBtnText,
                    brokerageType === 'NONE' && styles.segmentBtnTextSelected,
                  ]}
                >
                  No Brokerage
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.segmentBtn,
                  brokerageType === 'ONE_MONTH' && styles.segmentBtnSelected,
                ]}
                onPress={() => setBrokerageType('ONE_MONTH')}
              >
                <Text
                  style={[
                    styles.segmentBtnText,
                    brokerageType === 'ONE_MONTH' &&
                      styles.segmentBtnTextSelected,
                  ]}
                >
                  1 Month Rent
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.segmentBtn,
                  brokerageType === 'FIXED' && styles.segmentBtnSelected,
                ]}
                onPress={() => setBrokerageType('FIXED')}
              >
                <Text
                  style={[
                    styles.segmentBtnText,
                    brokerageType === 'FIXED' && styles.segmentBtnTextSelected,
                  ]}
                >
                  Fixed Fee
                </Text>
              </Pressable>
            </View>

            {brokerageType === 'NONE' ? (
              <View style={styles.noBrokerageBenefit}>
                <ShieldCheck size={18} color="#32B768" strokeWidth={2.2} />
                <Text style={styles.noBrokerageBenefitText}>
                  Great — renters can see this as verified "No Brokerage" on REHVO.
                </Text>
              </View>
            ) : brokerageType === 'FIXED' ? (
              <View style={[styles.currencyWrap, { marginTop: 6 }]}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  value={customBrokerage}
                  onChangeText={setCustomBrokerage}
                  placeholder="15000"
                  placeholderTextColor="#8C8994"
                  keyboardType="numeric"
                  style={styles.currencyInput}
                />
              </View>
            ) : null}
          </View>

          {Boolean(errorMsg) && (
            <Text style={styles.errorText}>{errorMsg}</Text>
          )}
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
          accessibilityLabel="Continue to property features"
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
  fieldLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#171522',
  },
  currencyWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6C4DFF',
    marginRight: 8,
  },
  currencyInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#171522',
  },
  currencyPeriod: {
    fontSize: 13,
    fontWeight: '600',
    color: '#777482',
  },
  segmentedRow: {
    flexDirection: 'row',
    gap: 8,
  },
  segmentBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBtnSelected: {
    backgroundColor: '#6C4DFF',
    borderColor: '#6C4DFF',
  },
  segmentBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#171522',
  },
  segmentBtnTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  noBrokerageBenefit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EAF8F0',
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
  },
  noBrokerageBenefitText: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '600',
    color: '#171522',
  },
  errorText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#E5484D',
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
