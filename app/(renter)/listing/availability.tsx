import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Sparkles,
  Clock,
  Calendar,
  CalendarDays,
  Check,
  ArrowRight,
  Shield,
} from 'lucide-react-native';
import { useAppStore } from '../../../src/store/useAppStore';
import { ListingHeader } from '../../../src/components/listing/ListingHeader';
import { ListingExitModal } from '../../../src/components/listing/ListingExitModal';

const AVAILABILITY_OPTIONS = [
  {
    id: 'IMMEDIATE',
    label: 'Available Immediately',
    desc: 'Ready for immediate move-in today.',
    icon: Sparkles,
  },
  {
    id: 'WITHIN_2_WEEKS',
    label: 'Within 2 Weeks',
    desc: 'Available for handover in the next 14 days.',
    icon: Clock,
  },
  {
    id: 'WITHIN_1_MONTH',
    label: 'Within 1 Month',
    desc: 'Available from the start of next month.',
    icon: Calendar,
  },
  {
    id: 'FLEXIBLE',
    label: 'Flexible / Next Quarter',
    desc: 'Ready in 2–3 months or open to discussion.',
    icon: CalendarDays,
  },
];

const LEASE_DURATIONS = ['Flexible', '6 Months', '11 Months', '12+ Months'];

export default function ListingAvailabilityRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { listingDraft, updateListingDraft, resetListingDraft, showToast } =
    useAppStore();

  const [availability, setAvailability] = useState(
    listingDraft.available_from || 'IMMEDIATE',
  );
  const [minStay, setMinStay] = useState('11 Months');
  const [exitModalVisible, setExitModalVisible] = useState(false);

  const handleContinue = () => {
    updateListingDraft({ available_from: availability });
    router.push('/(renter)/listing/contact');
  };

  const handleSaveDraft = () => {
    updateListingDraft({ available_from: availability });
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
        currentStep={9}
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
          <Text style={styles.titleText}>When is it available?</Text>
          <Text style={styles.subtitle}>
            Let renters know your move-in readiness and preferred lease duration.
          </Text>
        </View>

        {/* Availability Options */}
        <View style={styles.list}>
          {AVAILABILITY_OPTIONS.map((opt) => {
            const isSelected = availability === opt.id;
            const Icon = opt.icon;

            return (
              <Pressable
                key={opt.id}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => setAvailability(opt.id)}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
              >
                <View style={styles.cardLeft}>
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
                  <View style={styles.textContainer}>
                    <Text
                      style={[
                        styles.cardTitle,
                        isSelected && styles.cardTitleSelected,
                      ]}
                    >
                      {opt.label}
                    </Text>
                    <Text style={styles.cardDescription}>{opt.desc}</Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.checkbox,
                    isSelected && styles.checkboxSelected,
                  ]}
                >
                  {isSelected && (
                    <Check size={14} color="#FFFFFF" strokeWidth={2.5} />
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Minimum Stay Duration */}
        <View style={styles.leaseSection}>
          <Text style={styles.leaseTitle}>Preferred Agreement Duration</Text>
          <View style={styles.leasePillRow}>
            {LEASE_DURATIONS.map((dur) => {
              const isSelected = minStay === dur;
              return (
                <Pressable
                  key={dur}
                  style={[styles.leasePill, isSelected && styles.leasePillSelected]}
                  onPress={() => setMinStay(dur)}
                >
                  <Text
                    style={[
                      styles.leasePillText,
                      isSelected && styles.leasePillTextSelected,
                    ]}
                  >
                    {dur}
                  </Text>
                </Pressable>
              );
            })}
          </View>
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
          accessibilityLabel="Continue to contact details"
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
  list: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
  },
  cardSelected: {
    backgroundColor: '#F7F4FF',
    borderColor: '#6C4DFF',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
    marginRight: 10,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F0EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleSelected: {
    backgroundColor: '#ECE7FF',
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#171522',
  },
  cardTitleSelected: {
    color: '#171522',
  },
  cardDescription: {
    fontSize: 12.5,
    color: '#777482',
    fontWeight: '500',
    marginTop: 2,
    lineHeight: 17,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#D4D0DC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#6C4DFF',
    borderColor: '#6C4DFF',
  },
  leaseSection: {
    gap: 10,
  },
  leaseTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#171522',
  },
  leasePillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  leasePill: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
  },
  leasePillSelected: {
    backgroundColor: '#6C4DFF',
    borderColor: '#6C4DFF',
  },
  leasePillText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#171522',
  },
  leasePillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
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
