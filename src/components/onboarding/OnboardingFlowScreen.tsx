import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, X, AlertCircle } from 'lucide-react-native';
import { useAppStore } from '../../store/useAppStore';
import { UserRole, PropertyType } from '../../types';

// Steps
import { WelcomeStep } from './WelcomeStep';
import { RoleSelectionStep } from './RoleSelectionStep';
import {
  RenterPropertyTypeStep,
  RenterPropertyTypeChoice,
} from './renter/RenterPropertyTypeStep';
import { RenterLocationStep } from './renter/RenterLocationStep';
import { RenterBudgetStep, BudgetPreset } from './renter/RenterBudgetStep';
import { RenterSpaceStep } from './renter/RenterSpaceStep';
import {
  RenterFurnishingStep,
  FurnishingChoice,
} from './renter/RenterFurnishingStep';
import { RenterPreferencesStep } from './renter/RenterPreferencesStep';
import { RenterMoveInStep, MoveInTiming } from './renter/RenterMoveInStep';
import { RenterSummaryStep } from './renter/RenterSummaryStep';

import { OwnerIntroStep } from './owner/OwnerIntroStep';
import { OwnerPropertyTypeStep } from './owner/OwnerPropertyTypeStep';
import {
  OwnerIntentStep,
  OwnerListingIntent,
} from './owner/OwnerIntentStep';
import { OwnerProfileStep } from './owner/OwnerProfileStep';
import { OwnerVerificationStep } from './owner/OwnerVerificationStep';
import { OwnerCompleteStep } from './owner/OwnerCompleteStep';

export type OnboardingScreenId =
  | 'WELCOME'
  | 'ROLE'
  // Renter
  | 'RENTER_TYPE'
  | 'RENTER_LOCATION'
  | 'RENTER_BUDGET'
  | 'RENTER_SPACE'
  | 'RENTER_FURNISHING'
  | 'RENTER_PREFERENCES'
  | 'RENTER_MOVE_IN'
  | 'RENTER_SUMMARY'
  // Owner
  | 'OWNER_INTRO'
  | 'OWNER_TYPE'
  | 'OWNER_INTENT'
  | 'OWNER_PROFILE'
  | 'OWNER_VERIFICATION'
  | 'OWNER_COMPLETE';

const RENTER_STEPS: OnboardingScreenId[] = [
  'RENTER_TYPE',
  'RENTER_LOCATION',
  'RENTER_BUDGET',
  'RENTER_SPACE',
  'RENTER_FURNISHING',
  'RENTER_PREFERENCES',
  'RENTER_MOVE_IN',
];

const OWNER_STEPS: OnboardingScreenId[] = [
  'OWNER_INTRO',
  'OWNER_TYPE',
  'OWNER_INTENT',
  'OWNER_PROFILE',
  'OWNER_VERIFICATION',
];

interface OnboardingFlowScreenProps {
  initialStep?: OnboardingScreenId;
}

export const OnboardingFlowScreen: React.FC<OnboardingFlowScreenProps> = ({
  initialStep,
}) => {
  const router = useRouter();
  const params = useLocalSearchParams<{ startStep?: string }>();
  const insets = useSafeAreaInsets();

  const startingStep: OnboardingScreenId =
    initialStep || (params.startStep as OnboardingScreenId) || 'WELCOME';

  const {
    user,
    completeOnboarding,
    updateProfile,
    switchRole,
    setFilter,
  } = useAppStore();

  const [currentStep, setCurrentStep] =
    useState<OnboardingScreenId>(startingStep);
  const [selectedRole, setSelectedRole] = useState<UserRole>('RENTER');

  // Renter State
  const [renterType, setRenterType] =
    useState<RenterPropertyTypeChoice>('FLAT');
  const [renterLocations, setRenterLocations] = useState<string[]>([
    'Andheri West',
    'Powai',
  ]);
  const [renterBudgetPresetId, setRenterBudgetPresetId] =
    useState<string>('25k_40k');
  const [renterBudgetPreset, setRenterBudgetPreset] = useState<BudgetPreset>({
    id: '25k_40k',
    label: '₹25,000 – ₹40,000',
    min: 25000,
    max: 40000,
    subtitle: 'Spacious 1 BHK & modern 2 BHK apartments',
  });
  const [renterSpace, setRenterSpace] = useState<string>('2 BHK');
  const [renterFurnishing, setRenterFurnishing] =
    useState<FurnishingChoice>('FULLY_FURNISHED');
  const [renterPreferences, setRenterPreferences] = useState<string[]>([
    'No Brokerage',
    'Near Metro',
  ]);
  const [renterMoveIn, setRenterMoveIn] =
    useState<MoveInTiming>('Within 1 month');

  // Owner State
  const [ownerPropertyType, setOwnerPropertyType] =
    useState<PropertyType>('FLAT');
  const [ownerIntent, setOwnerIntent] =
    useState<OwnerListingIntent>('RENT');
  const [ownerName, setOwnerName] = useState(user?.name || 'Property Owner');
  const [ownerPhone, setOwnerPhone] = useState(
    user?.phone || '+91 98201 45678'
  );
  const [ownerEmail, setOwnerEmail] = useState(
    user?.email || 'owner@rehvo.com'
  );

  // Leave Confirmation Modal
  const [leaveModalVisible, setLeaveModalVisible] = useState(false);

  // Toggle Renter Location
  const handleToggleLocation = (loc: string) => {
    setRenterLocations((prev) =>
      prev.includes(loc) ? prev.filter((item) => item !== loc) : [...prev, loc]
    );
  };

  // Toggle Renter Preference
  const handleTogglePreference = (pref: string) => {
    setRenterPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  // Back Navigation Logic
  const handleBack = () => {
    switch (currentStep) {
      case 'ROLE':
        setCurrentStep('WELCOME');
        break;
      // Renter
      case 'RENTER_TYPE':
        setCurrentStep('ROLE');
        break;
      case 'RENTER_LOCATION':
        setCurrentStep('RENTER_TYPE');
        break;
      case 'RENTER_BUDGET':
        setCurrentStep('RENTER_LOCATION');
        break;
      case 'RENTER_SPACE':
        setCurrentStep('RENTER_BUDGET');
        break;
      case 'RENTER_FURNISHING':
        setCurrentStep('RENTER_SPACE');
        break;
      case 'RENTER_PREFERENCES':
        setCurrentStep('RENTER_FURNISHING');
        break;
      case 'RENTER_MOVE_IN':
        setCurrentStep('RENTER_PREFERENCES');
        break;
      case 'RENTER_SUMMARY':
        setCurrentStep('RENTER_MOVE_IN');
        break;
      // Owner
      case 'OWNER_INTRO':
        setCurrentStep('ROLE');
        break;
      case 'OWNER_TYPE':
        setCurrentStep('OWNER_INTRO');
        break;
      case 'OWNER_INTENT':
        setCurrentStep('OWNER_TYPE');
        break;
      case 'OWNER_PROFILE':
        setCurrentStep('OWNER_INTENT');
        break;
      case 'OWNER_VERIFICATION':
        setCurrentStep('OWNER_PROFILE');
        break;
      case 'OWNER_COMPLETE':
        setCurrentStep('OWNER_VERIFICATION');
        break;
      default:
        setLeaveModalVisible(true);
        break;
    }
  };

  // Finish Renter Setup
  const handleFinishRenter = () => {
    updateProfile({
      role: 'RENTER',
      locality: renterLocations[0] || 'Mumbai',
      budget_min: renterBudgetPreset.min,
      budget_max: renterBudgetPreset.max,
      move_in_date: renterMoveIn,
      onboarding_completed: true,
    });

    switchRole('RENTER');

    // Personalize default search/discovery filters
    setFilter({
      locality: renterLocations[0] || 'ALL',
      rent_min: renterBudgetPreset.min,
      rent_max: renterBudgetPreset.max,
      furnishing:
        renterFurnishing === 'ANY' ? 'ALL' : renterFurnishing,
      bhk: renterSpace.includes('BHK') ? renterSpace : 'ALL',
    });

    completeOnboarding();
    router.replace('/(renter)/home');
  };

  // Finish Owner Setup -> Go to Dashboard
  const handleOwnerGoToDashboard = () => {
    updateProfile({
      name: ownerName,
      phone: ownerPhone,
      email: ownerEmail,
      role: 'OWNER',
      onboarding_completed: true,
    });
    switchRole('OWNER');
    completeOnboarding();
    router.replace('/(owner)/dashboard');
  };

  // Finish Owner Setup -> List Property
  const handleOwnerListProperty = () => {
    updateProfile({
      name: ownerName,
      phone: ownerPhone,
      email: ownerEmail,
      role: 'OWNER',
      onboarding_completed: true,
    });
    switchRole('OWNER');
    completeOnboarding();
    router.replace('/(renter)/listing/property-type');
  };

  // Render Step Content
  const renderStep = () => {
    switch (currentStep) {
      case 'WELCOME':
        return (
          <WelcomeStep
            onGetStarted={() => setCurrentStep('ROLE')}
            onSignIn={() => router.push('/(auth)/login')}
          />
        );

      case 'ROLE':
        return (
          <RoleSelectionStep
            selectedRole={selectedRole}
            onSelectRole={setSelectedRole}
            onContinue={() => {
              if (selectedRole === 'RENTER') {
                setCurrentStep('RENTER_TYPE');
              } else {
                setCurrentStep('OWNER_INTRO');
              }
            }}
            onBack={() => setCurrentStep('WELCOME')}
          />
        );

      // Renter Steps
      case 'RENTER_TYPE':
        return (
          <RenterPropertyTypeStep
            selectedType={renterType}
            onSelectType={setRenterType}
            onContinue={() => setCurrentStep('RENTER_LOCATION')}
          />
        );

      case 'RENTER_LOCATION':
        return (
          <RenterLocationStep
            selectedLocations={renterLocations}
            onToggleLocation={handleToggleLocation}
            onContinue={() => setCurrentStep('RENTER_BUDGET')}
          />
        );

      case 'RENTER_BUDGET':
        return (
          <RenterBudgetStep
            selectedPresetId={renterBudgetPresetId}
            onSelectBudget={(preset) => {
              setRenterBudgetPresetId(preset.id);
              setRenterBudgetPreset(preset);
            }}
            onContinue={() => setCurrentStep('RENTER_SPACE')}
          />
        );

      case 'RENTER_SPACE':
        return (
          <RenterSpaceStep
            propertyType={renterType}
            selectedSpace={renterSpace}
            onSelectSpace={setRenterSpace}
            onContinue={() => setCurrentStep('RENTER_FURNISHING')}
          />
        );

      case 'RENTER_FURNISHING':
        return (
          <RenterFurnishingStep
            selectedFurnishing={renterFurnishing}
            onSelectFurnishing={setRenterFurnishing}
            onContinue={() => setCurrentStep('RENTER_PREFERENCES')}
          />
        );

      case 'RENTER_PREFERENCES':
        return (
          <RenterPreferencesStep
            selectedPreferences={renterPreferences}
            onTogglePreference={handleTogglePreference}
            onContinue={() => setCurrentStep('RENTER_MOVE_IN')}
            onSkip={() => setCurrentStep('RENTER_MOVE_IN')}
          />
        );

      case 'RENTER_MOVE_IN':
        return (
          <RenterMoveInStep
            selectedTiming={renterMoveIn}
            onSelectTiming={setRenterMoveIn}
            onContinue={() => setCurrentStep('RENTER_SUMMARY')}
          />
        );

      case 'RENTER_SUMMARY':
        return (
          <RenterSummaryStep
            propertyType={renterType}
            locations={renterLocations}
            budget={renterBudgetPreset}
            space={renterSpace}
            furnishing={renterFurnishing}
            preferences={renterPreferences}
            moveIn={renterMoveIn}
            onFinish={handleFinishRenter}
            onEdit={() => setCurrentStep('RENTER_TYPE')}
          />
        );

      // Owner Steps
      case 'OWNER_INTRO':
        return (
          <OwnerIntroStep
            onContinue={() => setCurrentStep('OWNER_TYPE')}
          />
        );

      case 'OWNER_TYPE':
        return (
          <OwnerPropertyTypeStep
            selectedType={ownerPropertyType}
            onSelectType={setOwnerPropertyType}
            onContinue={() => setCurrentStep('OWNER_INTENT')}
          />
        );

      case 'OWNER_INTENT':
        return (
          <OwnerIntentStep
            selectedIntent={ownerIntent}
            onSelectIntent={setOwnerIntent}
            onContinue={() => setCurrentStep('OWNER_PROFILE')}
          />
        );

      case 'OWNER_PROFILE':
        return (
          <OwnerProfileStep
            name={ownerName}
            phone={ownerPhone}
            email={ownerEmail}
            onChangeName={setOwnerName}
            onChangePhone={setOwnerPhone}
            onChangeEmail={setOwnerEmail}
            onContinue={() => setCurrentStep('OWNER_VERIFICATION')}
          />
        );

      case 'OWNER_VERIFICATION':
        return (
          <OwnerVerificationStep
            phone={ownerPhone}
            email={ownerEmail}
            onContinue={() => setCurrentStep('OWNER_COMPLETE')}
          />
        );

      case 'OWNER_COMPLETE':
        return (
          <OwnerCompleteStep
            ownerName={ownerName}
            onListProperty={handleOwnerListProperty}
            onGoToDashboard={handleOwnerGoToDashboard}
          />
        );

      default:
        return null;
    }
  };

  // Check if step shows progress bar & top nav
  const isRenterStep = RENTER_STEPS.includes(currentStep);
  const isOwnerStep = OWNER_STEPS.includes(currentStep);

  const renterStepIdx = RENTER_STEPS.indexOf(currentStep);
  const ownerStepIdx = OWNER_STEPS.indexOf(currentStep);

  const showHeaderBar =
    currentStep !== 'WELCOME' &&
    currentStep !== 'ROLE' &&
    currentStep !== 'RENTER_SUMMARY' &&
    currentStep !== 'OWNER_COMPLETE';

  const totalSteps = isRenterStep
    ? RENTER_STEPS.length
    : isOwnerStep
    ? OWNER_STEPS.length
    : 1;

  const currentStepNumber = isRenterStep
    ? renterStepIdx + 1
    : isOwnerStep
    ? ownerStepIdx + 1
    : 1;

  const progressPercent = (currentStepNumber / totalSteps) * 100;

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      {/* Top Header Bar for multi-step flows */}
      {showHeaderBar && (
        <View style={styles.topHeader}>
          <Pressable
            style={styles.backBtn}
            onPress={handleBack}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Back to previous step"
          >
            <ArrowLeft size={20} color="#171522" strokeWidth={2.2} />
          </Pressable>

          <View style={styles.progressCol}>
            <Text style={styles.stepText}>
              Step {currentStepNumber} of {totalSteps}
            </Text>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progressPercent}%` },
                ]}
              />
            </View>
          </View>

          <Pressable
            style={styles.closeBtn}
            onPress={() => setLeaveModalVisible(true)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Leave setup"
          >
            <X size={20} color="#777482" />
          </Pressable>
        </View>
      )}

      {/* Main Step Render */}
      <View style={{ flex: 1 }}>{renderStep()}</View>

      {/* Leave Setup Confirmation Modal */}
      <Modal
        visible={leaveModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLeaveModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconWrap}>
              <AlertCircle size={28} color="#FF735C" strokeWidth={2} />
            </View>
            <Text style={styles.modalTitle}>Leave setup?</Text>
            <Text style={styles.modalBody}>
              Your personalization preferences will not be saved. You can always
              restart setup later.
            </Text>

            <View style={styles.modalActions}>
              <Pressable
                style={styles.modalStayBtn}
                onPress={() => setLeaveModalVisible(false)}
              >
                <Text style={styles.modalStayText}>Continue Setup</Text>
              </Pressable>

              <Pressable
                style={styles.modalLeaveBtn}
                onPress={() => {
                  setLeaveModalVisible(false);
                  router.replace('/(auth)/login');
                }}
              >
                <Text style={styles.modalLeaveText}>Exit to Login</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8F7F4',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 14,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCol: {
    flex: 1,
    gap: 5,
    alignItems: 'center',
  },
  stepText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#777482',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  progressTrack: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E8E5EC',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6C4DFF',
    borderRadius: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(23, 21, 34, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  modalIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFF0EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171522',
  },
  modalBody: {
    fontSize: 13.5,
    color: '#777482',
    textAlign: 'center',
    lineHeight: 19,
  },
  modalActions: {
    width: '100%',
    gap: 8,
    marginTop: 8,
  },
  modalStayBtn: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    backgroundColor: '#6C4DFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalStayText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalLeaveBtn: {
    width: '100%',
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalLeaveText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#E5484D',
  },
});
