import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Building2,
  Users,
  BedDouble,
  Users2,
  Sparkles,
  Home,
  Layout,
  Building,
  Check,
  ArrowRight,
} from 'lucide-react-native';
import { useAppStore } from '../../../src/store/useAppStore';
import { ListingHeader } from '../../../src/components/listing/ListingHeader';
import { ListingExitModal } from '../../../src/components/listing/ListingExitModal';
import { PropertyType } from '../../../src/types';

interface PropertyTypeOption {
  id: PropertyType;
  title: string;
  description: string;
  icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
}

const PROPERTY_TYPES: PropertyTypeOption[] = [
  {
    id: 'FLAT',
    title: 'Flat / Apartment',
    description: 'An entire independent apartment for rent.',
    icon: Building2,
  },
  {
    id: 'PG',
    title: 'PG / Co-living',
    description: 'Managed shared accommodation with meals & services.',
    icon: Users,
  },
  {
    id: 'PRIVATE_ROOM',
    title: 'Private Room',
    description: 'A private locked room inside a shared flat.',
    icon: BedDouble,
  },
  {
    id: 'SHARED_ROOM',
    title: 'Shared Room',
    description: 'Shared room bed-space for roommates.',
    icon: Users2,
  },
  {
    id: 'STUDIO',
    title: 'Studio Apartment',
    description: 'Compact self-contained studio living unit.',
    icon: Layout,
  },
];

export default function ListingPropertyTypeRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { listingDraft, updateListingDraft, resetListingDraft, showToast } =
    useAppStore();

  const [selectedType, setSelectedType] = useState<PropertyType>(
    listingDraft.property_type || 'FLAT',
  );
  const [exitModalVisible, setExitModalVisible] = useState(false);

  const handleSelect = (type: PropertyType) => {
    setSelectedType(type);
    updateListingDraft({ property_type: type });
  };

  const handleContinue = () => {
    updateListingDraft({ property_type: selectedType });
    router.push('/(renter)/listing/details');
  };

  const handleSaveDraft = () => {
    updateListingDraft({ property_type: selectedType });
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
        currentStep={1}
        totalSteps={10}
        onBack={() => setExitModalVisible(true)}
        onClose={() => setExitModalVisible(true)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 80 },
        ]}
      >
        <View style={styles.headingBlock}>
          <Text style={styles.title}>What are you listing?</Text>
          <Text style={styles.subtitle}>
            Choose the type of property you want to list on REHVO.
          </Text>
        </View>

        <View style={styles.list}>
          {PROPERTY_TYPES.map((item) => {
            const isSelected = selectedType === item.id;
            const Icon = item.icon;

            return (
              <Pressable
                key={item.id}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => handleSelect(item.id)}
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
                      size={22}
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
                      {item.title}
                    </Text>
                    <Text style={styles.cardDescription}>
                      {item.description}
                    </Text>
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
          accessibilityLabel="Continue to basic details"
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
  },
  headingBlock: {
    marginBottom: 20,
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
    width: 46,
    height: 46,
    borderRadius: 23,
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
