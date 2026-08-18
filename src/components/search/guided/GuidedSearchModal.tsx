import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';
import {
  ArrowLeft,
  X,
  ArrowRight,
  Sparkles,
} from 'lucide-react-native';
import {
  GuidedSearchState,
  INITIAL_GUIDED_STATE,
  GuidedPropertyCategory,
  GuidedSpaceType,
  GuidedMoveInTime,
} from './guidedSearchTypes';
import { StepPropertyType } from './StepPropertyType';
import { StepBudget } from './StepBudget';
import { StepLocation } from './StepLocation';
import { StepSpace } from './StepSpace';
import { StepFurnishing } from './StepFurnishing';
import { StepPreferences } from './StepPreferences';
import { StepMoveIn } from './StepMoveIn';
import { StepSummary } from './StepSummary';
import { Property, FurnishingType } from '../../../types';

interface GuidedSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (state: GuidedSearchState) => void;
  initialState?: GuidedSearchState;
  properties: Property[];
}

const TOTAL_STEPS = 8;

export const GuidedSearchModal: React.FC<GuidedSearchModalProps> = ({
  visible,
  onClose,
  onApply,
  initialState,
  properties,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formState, setFormState] = useState<GuidedSearchState>(
    initialState || INITIAL_GUIDED_STATE,
  );

  // Sync state if modal opens
  React.useEffect(() => {
    if (visible && initialState) {
      setFormState(initialState);
      setCurrentStep(0);
    }
  }, [visible, initialState]);

  // Calculate live matching properties
  const matchingCount = useMemo(() => {
    return properties.filter((p) => {
      // 1. Rent
      if (p.rent < formState.rentMin || p.rent > formState.rentMax) return false;

      // 2. Category
      if (formState.category === 'FLAT' && p.property_type !== 'FLAT' && p.property_type !== 'APARTMENT')
        return false;
      if (formState.category === 'PG' && p.property_type !== 'PG' && p.property_type !== 'CO_LIVING')
        return false;
      if (formState.category === 'PRIVATE_ROOM' && p.property_type !== 'PRIVATE_ROOM')
        return false;
      if (formState.category === 'SHARED_ROOM' && p.property_type !== 'SHARED_ROOM')
        return false;

      // 3. Location (if selected)
      if (
        formState.locations.length > 0 &&
        !formState.locations.some(
          (loc) =>
            p.locality.toLowerCase().includes(loc.toLowerCase()) ||
            loc.toLowerCase().includes(p.locality.toLowerCase()),
        )
      ) {
        return false;
      }

      // 4. Space / BHK
      if (
        formState.spaceType !== 'ANY' &&
        formState.spaceType.includes('BHK') &&
        p.bhk !== formState.spaceType
      ) {
        return false;
      }

      // 5. Furnishing
      if (
        formState.furnishing !== 'ALL' &&
        p.furnishing !== formState.furnishing
      ) {
        return false;
      }

      // 6. No Brokerage
      if (
        formState.preferences.includes('No Brokerage') &&
        p.brokerage > 0
      ) {
        return false;
      }

      return true;
    }).length;
  }, [properties, formState]);

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onApply(formState);
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      onClose();
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const progressPercent = ((currentStep + 1) / TOTAL_STEPS) * 100;

  const isOptionalStep = currentStep === 5 || currentStep === 6;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Top Header with Back / Close and Progress */}
        <View style={styles.topHeader}>
          <Pressable
            style={styles.navBtn}
            onPress={handleBack}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={currentStep === 0 ? 'Close guided search' : 'Go back'}
          >
            {currentStep === 0 ? (
              <X size={20} color="#171522" strokeWidth={2.2} />
            ) : (
              <ArrowLeft size={20} color="#171522" strokeWidth={2.2} />
            )}
          </Pressable>

          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>
              Step {currentStep + 1} of {TOTAL_STEPS}
            </Text>
          </View>

          <Pressable
            style={styles.navBtn}
            onPress={onClose}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <X size={20} color="#777482" strokeWidth={2} />
          </Pressable>
        </View>

        {/* Thin Smooth Progress Bar */}
        <View style={styles.progressTrack}>
          <View
            style={[styles.progressBar, { width: `${progressPercent}%` }]}
          />
        </View>

        {/* Step Body */}
        <View style={styles.body}>
          {currentStep === 0 && (
            <StepPropertyType
              selected={formState.category}
              onSelect={(category: GuidedPropertyCategory) =>
                setFormState((prev) => ({ ...prev, category }))
              }
            />
          )}

          {currentStep === 1 && (
            <StepBudget
              rentMin={formState.rentMin}
              rentMax={formState.rentMax}
              onChange={(rentMin, rentMax) =>
                setFormState((prev) => ({ ...prev, rentMin, rentMax }))
              }
            />
          )}

          {currentStep === 2 && (
            <StepLocation
              locations={formState.locations}
              onChange={(locations) =>
                setFormState((prev) => ({ ...prev, locations }))
              }
            />
          )}

          {currentStep === 3 && (
            <StepSpace
              category={formState.category}
              spaceType={formState.spaceType}
              onSelect={(spaceType: GuidedSpaceType | 'ANY') =>
                setFormState((prev) => ({ ...prev, spaceType }))
              }
            />
          )}

          {currentStep === 4 && (
            <StepFurnishing
              furnishing={formState.furnishing}
              onSelect={(furnishing: FurnishingType | 'ALL') =>
                setFormState((prev) => ({ ...prev, furnishing }))
              }
            />
          )}

          {currentStep === 5 && (
            <StepPreferences
              preferences={formState.preferences}
              onChange={(preferences) =>
                setFormState((prev) => ({ ...prev, preferences }))
              }
            />
          )}

          {currentStep === 6 && (
            <StepMoveIn
              moveInTime={formState.moveInTime}
              onSelect={(moveInTime: GuidedMoveInTime) =>
                setFormState((prev) => ({ ...prev, moveInTime }))
              }
            />
          )}

          {currentStep === 7 && (
            <StepSummary
              state={formState}
              matchingCount={matchingCount}
              onEditStep={(stepIndex) => setCurrentStep(stepIndex)}
              onSubmit={() => {
                onApply(formState);
                onClose();
              }}
            />
          )}
        </View>

        {/* Sticky Bottom Actions */}
        <View style={styles.bottomBar}>
          {currentStep === 7 ? (
            <View style={styles.summaryActions}>
              <Pressable
                style={styles.secondaryBtn}
                onPress={() => setCurrentStep(0)}
                accessibilityRole="button"
                accessibilityLabel="Edit search criteria"
              >
                <Text style={styles.secondaryBtnText}>Edit</Text>
              </Pressable>

              <Pressable
                style={styles.primaryCta}
                onPress={() => {
                  onApply(formState);
                  onClose();
                }}
                accessibilityRole="button"
                accessibilityLabel="Show matching homes"
              >
                <Sparkles size={18} color="#FFFFFF" strokeWidth={2.2} />
                <Text style={styles.primaryCtaText}>
                  {matchingCount > 0
                    ? `Show ${matchingCount} homes`
                    : 'Show matching homes'}
                </Text>
                <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.2} />
              </Pressable>
            </View>
          ) : (
            <View style={styles.standardActions}>
              {isOptionalStep && (
                <Pressable
                  style={styles.skipBtn}
                  onPress={handleSkip}
                  accessibilityRole="button"
                  accessibilityLabel="Skip optional step"
                >
                  <Text style={styles.skipBtnText}>Skip for now</Text>
                </Pressable>
              )}

              <Pressable
                style={[
                  styles.continueBtn,
                  !isOptionalStep && { flex: 1 },
                ]}
                onPress={handleNext}
                accessibilityRole="button"
                accessibilityLabel="Continue to next step"
              >
                <Text style={styles.continueBtnText}>Continue</Text>
                <ArrowRight size={17} color="#FFFFFF" strokeWidth={2.2} />
              </Pressable>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F7F4',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F8F7F4',
  },
  navBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
  },
  stepBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#171522',
  },
  progressTrack: {
    height: 3,
    backgroundColor: '#E8E5EC',
    width: '100%',
  },
  progressBar: {
    height: 3,
    backgroundColor: '#6C4DFF',
  },
  body: {
    flex: 1,
    paddingTop: 8,
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E5EC',
  },
  standardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  skipBtn: {
    paddingHorizontal: 16,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#777482',
  },
  continueBtn: {
    height: 50,
    backgroundColor: '#6C4DFF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 24,
  },
  continueBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  summaryActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  secondaryBtn: {
    width: 80,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171522',
  },
  primaryCta: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#6C4DFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  primaryCtaText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
