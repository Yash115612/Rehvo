import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  MapPin,
  X,
  Plus,
  IndianRupee,
  BedDouble,
  Sparkles,
  Calendar,
  ShieldCheck,
  Check,
} from 'lucide-react-native';
import { useAppStore } from '../../store/useAppStore';
import { FlatmateProfile, UserType } from '../../types';

export type CreateFlatmateStep =
  | 'PHOTO'
  | 'ABOUT'
  | 'LOOKING_FOR'
  | 'LOCATION'
  | 'BUDGET'
  | 'ROOM_PREF'
  | 'LIFESTYLE'
  | 'MOVE_IN'
  | 'BIO'
  | 'PREVIEW'
  | 'SUCCESS';

const STEPS_ORDER: CreateFlatmateStep[] = [
  'PHOTO',
  'ABOUT',
  'LOOKING_FOR',
  'LOCATION',
  'BUDGET',
  'ROOM_PREF',
  'LIFESTYLE',
  'MOVE_IN',
  'BIO',
  'PREVIEW',
];

const LOOKING_FOR_CHOICES = [
  'Need a flatmate for my flat',
  'Looking for a private room in a flat',
  'Looking for a shared room / roommate',
  'Open to finding a new 2/3 BHK together',
  'Looking for a student-friendly space',
];

const POPULAR_LOCATIONS = [
  'Andheri West',
  'Powai',
  'Bandra West',
  'Goregaon',
  'Thane',
  'Borivali',
  'Lower Parel',
  'Juhu',
  'Malad',
  'Kanjurmarg',
];

const BUDGET_PRESETS = [
  { label: 'Under ₹10K', min: 5000, max: 10000 },
  { label: '₹10K – ₹15K', min: 10000, max: 15000 },
  { label: '₹15K – ₹25K', min: 15000, max: 25000 },
  { label: '₹25K – ₹40K', min: 25000, max: 40000 },
  { label: '₹40K+', min: 40000, max: 80000 },
];

const ROOM_PREFS = ['Private Room', 'Shared Room', 'Any'] as const;
const PROPERTY_TYPE_CHOICES = ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4+ BHK'];
const FURNISHING_CHOICES = [
  'Any',
  'Fully Furnished',
  'Semi Furnished',
  'Unfurnished',
];

const LIFESTYLE_OPTIONS = [
  'Non-Smoker',
  'Pet Friendly',
  'Quiet home',
  'Social home',
  'Early riser',
  'Night owl',
  'Work from home',
  'Student-friendly',
  'Near Metro',
  'AC',
  'Wi-Fi',
  'Parking',
  'Kitchen',
  'Cleaning support',
];

const MOVE_IN_OPTIONS = [
  'Immediately',
  'Within 2 weeks',
  'Within 1 month',
  'In 2–3 months',
  'Not decided',
];

interface FlatmateCreateFlowScreenProps {
  initialData?: FlatmateProfile | null;
  isEditing?: boolean;
}

export const FlatmateCreateFlowScreen: React.FC<
  FlatmateCreateFlowScreenProps
> = ({ initialData, isEditing = false }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    user,
    flatmateDraft,
    saveFlatmateDraft,
    clearFlatmateDraft,
    addFlatmateProfile,
    updateFlatmateProfile,
    showToast,
  } = useAppStore();

  const effectiveData = initialData || flatmateDraft;

  const [currentStep, setCurrentStep] = useState<CreateFlatmateStep>(
    isEditing ? 'PREVIEW' : 'PHOTO'
  );

  // Form State
  const [avatar, setAvatar] = useState<string>(
    effectiveData?.avatar || user?.avatar || ''
  );
  const [name, setName] = useState<string>(
    effectiveData?.name || user?.name || ''
  );
  const [age, setAge] = useState<string>(
    effectiveData?.age ? String(effectiveData.age) : '24'
  );
  const [gender, setGender] = useState<'Male' | 'Female' | 'Any' | 'Other'>(
    effectiveData?.gender || 'Male'
  );
  const [occupation, setOccupation] = useState<string>(
    effectiveData?.occupation || user?.occupation || 'Working Professional'
  );
  const [userType, setUserType] = useState<UserType>(
    effectiveData?.user_type || user?.user_type || 'working_professional'
  );

  const [lookingFor, setLookingFor] = useState<string>(
    effectiveData?.looking_for || 'Looking for a private room in a flat'
  );

  const [locations, setLocations] = useState<string[]>(
    effectiveData?.preferred_locations?.length
      ? effectiveData.preferred_locations
      : [effectiveData?.locality || user?.locality || 'Andheri West', 'Powai']
  );
  const [locSearch, setLocSearch] = useState<string>('');

  const [budgetMin, setBudgetMin] = useState<number>(
    effectiveData?.budget_min || 15000
  );
  const [budgetMax, setBudgetMax] = useState<number>(
    effectiveData?.budget_max || 25000
  );

  const [roomPreference, setRoomPreference] = useState<
    'Private Room' | 'Shared Room' | 'Any'
  >(effectiveData?.room_preference || 'Private Room');
  const [selectedPropTypes, setSelectedPropTypes] = useState<string[]>(
    effectiveData?.property_types || ['2 BHK', '3 BHK']
  );
  const [furnishing, setFurnishing] = useState<string>(
    effectiveData?.furnishing || 'Fully Furnished'
  );

  const [lifestyle, setLifestyle] = useState<string[]>(
    effectiveData?.lifestyle_preferences || [
      'Non-Smoker',
      'Work from home',
      'Quiet home',
      'Near Metro',
    ]
  );

  const [moveInTiming, setMoveInTiming] = useState<string>(
    effectiveData?.move_in_timing || 'Within 1 month'
  );

  const [bio, setBio] = useState<string>(
    effectiveData?.bio ||
      "Working professional in Mumbai. I keep common spaces clean, enjoy quiet evenings on weekdays, and like exploring local cafes on weekends."
  );

  // Auto-save draft on step change if not in editing mode
  const handleSaveDraft = React.useCallback(() => {
    if (!isEditing) {
      saveFlatmateDraft({
        avatar,
        name,
        age: parseInt(age, 10) || 24,
        gender,
        occupation,
        user_type: userType,
        looking_for: lookingFor,
        preferred_locations: locations,
        locality: locations[0] || 'Mumbai',
        budget_min: budgetMin,
        budget_max: budgetMax,
        room_preference: roomPreference,
        property_types: selectedPropTypes,
        furnishing,
        lifestyle_preferences: lifestyle,
        move_in_timing: moveInTiming,
        bio,
      });
    }
  }, [
    isEditing,
    saveFlatmateDraft,
    avatar,
    name,
    age,
    gender,
    occupation,
    userType,
    lookingFor,
    locations,
    budgetMin,
    budgetMax,
    roomPreference,
    selectedPropTypes,
    furnishing,
    lifestyle,
    moveInTiming,
    bio,
  ]);

  // Image Picker
  const handlePickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Needed',
          'Please allow access to your photo library to choose a profile picture.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setAvatar(result.assets[0].uri);
      }
    } catch (e) {
      console.warn('Image picker error:', e);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Needed',
          'Please allow camera permissions to take a profile photo.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setAvatar(result.assets[0].uri);
      }
    } catch (e) {
      console.warn('Camera error:', e);
    }
  };

  // Toggle Location
  const handleToggleLocation = (loc: string) => {
    setLocations((prev) =>
      prev.includes(loc) ? prev.filter((item) => item !== loc) : [...prev, loc]
    );
  };

  // Toggle Property Type
  const handleTogglePropType = (t: string) => {
    setSelectedPropTypes((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
  };

  // Toggle Lifestyle
  const handleToggleLifestyle = (tag: string) => {
    setLifestyle((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  // Navigation between steps
  const stepIdx = STEPS_ORDER.indexOf(currentStep);
  const totalSteps = STEPS_ORDER.length;

  const handleNext = () => {
    handleSaveDraft();
    if (stepIdx < STEPS_ORDER.length - 1) {
      setCurrentStep(STEPS_ORDER[stepIdx + 1]);
    }
  };

  const handleBack = () => {
    handleSaveDraft();
    if (stepIdx > 0) {
      setCurrentStep(STEPS_ORDER[stepIdx - 1]);
    } else {
      router.back();
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Publish
  const handlePublish = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const ageNum = parseInt(age, 10) || 24;

      const profilePayload: Omit<
        FlatmateProfile,
        'id' | 'created_at' | 'updated_at'
      > = {
        user_id: user?.id || '',
        name: name.trim() || user?.name || 'REHVO User',
        display_name: name.trim().split(' ')[0] || user?.name?.split(' ')[0] || 'User',
        age: ageNum,
        gender,
        occupation: occupation.trim() || 'Working Professional',
        city: 'Mumbai',
        locality: locations[0] || 'Andheri West',
        preferred_locations: locations.length ? locations : ['Mumbai'],
        budget_min: budgetMin,
        budget_max: budgetMax,
        looking_for: lookingFor,
        room_preference: roomPreference,
        property_types: selectedPropTypes,
        furnishing,
        move_in_date: moveInTiming,
        move_in_timing: moveInTiming,
        bio: bio.trim(),
        avatar:
          avatar ||
          user?.avatar ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        lifestyle_preferences: lifestyle,
        match_score: 92,
        match_reasons: [
          `High locality overlap (${locations[0] || 'Mumbai'})`,
          `Matching budget (₹${(budgetMin / 1000).toFixed(0)}K–₹${(
            budgetMax / 1000
          ).toFixed(0)}K)`,
          `Move-in compatible (${moveInTiming})`,
        ],
        is_published: true,
        is_paused: false,
        user_type: userType,
        phone: user?.phone || undefined,
        email: user?.email || undefined,
      };

      if (isEditing && initialData?.id) {
        const res = await updateFlatmateProfile(initialData.id, profilePayload, avatar);
        if (res.success) {
          router.back();
        }
      } else {
        const res = await addFlatmateProfile(profilePayload, avatar);
        if (res.success) {
          setCurrentStep('SUCCESS');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Step Content
  const renderStep = () => {
    switch (currentStep) {
      // 1. Profile Photo
      case 'PHOTO':
        return (
          <View style={styles.stepContainer}>
            <View style={styles.titleGroup}>
              <View style={styles.pillBadge}>
                <Sparkles size={12} color="#6C4DFF" strokeWidth={2.5} />
                <Text style={styles.pillBadgeText}>Flatmate Profile Setup</Text>
              </View>
              <Text style={styles.heading}>Create your Flatmate Profile</Text>
              <Text style={styles.subheading}>
                Let people looking for a flatmate discover you. Add a photo to help potential flatmates recognize you.
              </Text>
            </View>

            <View style={styles.photoCenterWrap}>
              <View style={styles.largeAvatarWrap}>
                {avatar ? (
                  <Image source={{ uri: avatar }} style={styles.largeAvatar} />
                ) : (
                  <View style={styles.largeAvatarPlaceholder}>
                    <Camera size={44} color="#6C4DFF" strokeWidth={1.8} />
                    <Text style={styles.placeholderText}>Tap to add photo</Text>
                  </View>
                )}
              </View>

              <View style={styles.photoActionsRow}>
                <Pressable
                  style={styles.photoActionBtn}
                  onPress={handlePickImage}
                  accessibilityRole="button"
                  accessibilityLabel="Choose photo from gallery"
                >
                  <ImageIcon size={18} color="#6C4DFF" />
                  <Text style={styles.photoActionText}>Choose Gallery</Text>
                </Pressable>

                <Pressable
                  style={styles.photoActionBtn}
                  onPress={handleTakePhoto}
                  accessibilityRole="button"
                  accessibilityLabel="Take photo with camera"
                >
                  <Camera size={18} color="#6C4DFF" />
                  <Text style={styles.photoActionText}>Take Photo</Text>
                </Pressable>

                {avatar ? (
                  <Pressable
                    style={[styles.photoActionBtn, styles.photoActionBtnDanger]}
                    onPress={() => setAvatar('')}
                    accessibilityRole="button"
                    accessibilityLabel="Remove photo"
                  >
                    <Trash2 size={18} color="#E5484D" />
                  </Pressable>
                ) : null}
              </View>
            </View>

            <View style={styles.footer}>
              <Pressable
                style={styles.continueBtn}
                onPress={handleNext}
                accessibilityRole="button"
                accessibilityLabel="Continue to about you"
              >
                <Text style={styles.continueBtnText}>Continue</Text>
                <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.2} />
              </Pressable>
            </View>
          </View>
        );

      // 2. About You
      case 'ABOUT':
        return (
          <View style={styles.stepContainer}>
            <View style={styles.titleGroup}>
              <Text style={styles.heading}>Tell people a little about you</Text>
              <Text style={styles.subheading}>
                Basic info so potential flatmates can get to know who you are.
              </Text>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.formScroll}
            >
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name *</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Rohan Das"
                  placeholderTextColor="#8C8994"
                  style={styles.input}
                />
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Age</Text>
                  <TextInput
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                    placeholder="24"
                    placeholderTextColor="#8C8994"
                    style={styles.input}
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1.5 }]}>
                  <Text style={styles.inputLabel}>Gender</Text>
                  <View style={styles.genderRow}>
                    {(['Male', 'Female', 'Other'] as const).map((g) => (
                      <Pressable
                        key={g}
                        style={[
                          styles.genderPill,
                          gender === g && styles.genderPillActive,
                        ]}
                        onPress={() => setGender(g)}
                      >
                        <Text
                          style={[
                            styles.genderPillText,
                            gender === g && styles.genderPillTextActive,
                          ]}
                        >
                          {g}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Occupation / Work</Text>
                <TextInput
                  value={occupation}
                  onChangeText={setOccupation}
                  placeholder="e.g. Software Engineer at Tech Co"
                  placeholderTextColor="#8C8994"
                  style={styles.input}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Role Category</Text>
                <View style={styles.pillRow}>
                  {[
                    { id: 'working_professional', label: 'Working Pro' },
                    { id: 'student', label: 'Student' },
                    { id: 'other', label: 'Self-Employed' },
                  ].map((cat) => (
                    <Pressable
                      key={cat.id}
                      style={[
                        styles.chipPill,
                        userType === cat.id && styles.chipPillActive,
                      ]}
                      onPress={() => setUserType(cat.id as UserType)}
                    >
                      <Text
                        style={[
                          styles.chipPillText,
                          userType === cat.id && styles.chipPillTextActive,
                        ]}
                      >
                        {cat.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <Pressable
                style={[
                  styles.continueBtn,
                  !name.trim() && styles.continueBtnDisabled,
                ]}
                onPress={handleNext}
                disabled={!name.trim()}
              >
                <Text style={styles.continueBtnText}>Continue</Text>
                <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.2} />
              </Pressable>
            </View>
          </View>
        );

      // 3. What Are You Looking For
      case 'LOOKING_FOR':
        return (
          <View style={styles.stepContainer}>
            <View style={styles.titleGroup}>
              <Text style={styles.heading}>What are you looking for?</Text>
              <Text style={styles.subheading}>
                Select the primary roommate arrangement you want.
              </Text>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.formScroll}
            >
              {LOOKING_FOR_CHOICES.map((choice) => {
                const isSelected = lookingFor === choice;
                return (
                  <Pressable
                    key={choice}
                    style={[styles.cardOption, isSelected && styles.cardOptionActive]}
                    onPress={() => setLookingFor(choice)}
                  >
                    <Text
                      style={[
                        styles.cardOptionText,
                        isSelected && styles.cardOptionTextActive,
                      ]}
                    >
                      {choice}
                    </Text>
                    {isSelected && (
                      <CheckCircle2
                        size={20}
                        color="#6C4DFF"
                        strokeWidth={2.5}
                      />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.footer}>
              <Pressable style={styles.continueBtn} onPress={handleNext}>
                <Text style={styles.continueBtnText}>Continue</Text>
                <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.2} />
              </Pressable>
            </View>
          </View>
        );

      // 4. Locations
      case 'LOCATION':
        return (
          <View style={styles.stepContainer}>
            <View style={styles.titleGroup}>
              <Text style={styles.heading}>Where are you looking?</Text>
              <Text style={styles.subheading}>
                Select one or more Mumbai areas where you'd like to live.
              </Text>
            </View>

            {/* Selected Chips */}
            {locations.length > 0 && (
              <View style={styles.selectedLocationsWrap}>
                {locations.map((loc) => (
                  <Pressable
                    key={loc}
                    style={styles.selectedLocChip}
                    onPress={() => handleToggleLocation(loc)}
                  >
                    <MapPin size={12} color="#6C4DFF" />
                    <Text style={styles.selectedLocChipText}>{loc}</Text>
                    <X size={12} color="#6C4DFF" strokeWidth={2.5} />
                  </Pressable>
                ))}
              </View>
            )}

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.formScroll}
            >
              <Text style={styles.subSectionTitle}>Popular Mumbai Areas</Text>
              <View style={styles.locGrid}>
                {POPULAR_LOCATIONS.map((loc) => {
                  const isSelected = locations.includes(loc);
                  return (
                    <Pressable
                      key={loc}
                      style={[
                        styles.locPill,
                        isSelected && styles.locPillSelected,
                      ]}
                      onPress={() => handleToggleLocation(loc)}
                    >
                      <Text
                        style={[
                          styles.locPillText,
                          isSelected && styles.locPillTextSelected,
                        ]}
                      >
                        {loc}
                      </Text>
                      {isSelected ? (
                        <Check size={14} color="#6C4DFF" strokeWidth={2.5} />
                      ) : (
                        <Plus size={14} color="#C9C5CC" />
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <Pressable
                style={[
                  styles.continueBtn,
                  locations.length === 0 && styles.continueBtnDisabled,
                ]}
                onPress={handleNext}
                disabled={locations.length === 0}
              >
                <Text style={styles.continueBtnText}>
                  {locations.length === 0 ? 'Select at least 1 area' : 'Continue'}
                </Text>
                {locations.length > 0 && (
                  <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.2} />
                )}
              </Pressable>
            </View>
          </View>
        );

      // 5. Budget
      case 'BUDGET':
        return (
          <View style={styles.stepContainer}>
            <View style={styles.titleGroup}>
              <Text style={styles.heading}>What's your monthly budget?</Text>
              <Text style={styles.subheading}>
                Choose a comfortable target range for your share of rent.
              </Text>
            </View>

            <View style={styles.budgetDisplayCard}>
              <Text style={styles.budgetDisplayLabel}>Monthly Share</Text>
              <View style={styles.budgetDisplayRow}>
                <IndianRupee size={22} color="#6C4DFF" strokeWidth={2.5} />
                <Text style={styles.budgetDisplayText}>
                  {budgetMin.toLocaleString('en-IN')} –{' '}
                  {budgetMax.toLocaleString('en-IN')}
                  <Text style={styles.budgetDisplayPeriod}> / month</Text>
                </Text>
              </View>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.formScroll}
            >
              {BUDGET_PRESETS.map((preset, idx) => {
                const isSelected =
                  budgetMin === preset.min && budgetMax === preset.max;
                return (
                  <Pressable
                    key={idx}
                    style={[
                      styles.cardOption,
                      isSelected && styles.cardOptionActive,
                    ]}
                    onPress={() => {
                      setBudgetMin(preset.min);
                      setBudgetMax(preset.max);
                    }}
                  >
                    <Text
                      style={[
                        styles.cardOptionText,
                        isSelected && styles.cardOptionTextActive,
                      ]}
                    >
                      {preset.label}
                    </Text>
                    {isSelected && (
                      <CheckCircle2
                        size={20}
                        color="#6C4DFF"
                        strokeWidth={2.5}
                      />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.footer}>
              <Pressable style={styles.continueBtn} onPress={handleNext}>
                <Text style={styles.continueBtnText}>Continue</Text>
                <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.2} />
              </Pressable>
            </View>
          </View>
        );

      // 6. Room & Property Preference
      case 'ROOM_PREF':
        return (
          <View style={styles.stepContainer}>
            <View style={styles.titleGroup}>
              <Text style={styles.heading}>Place & Room Preference</Text>
              <Text style={styles.subheading}>
                What kind of setup works best for you?
              </Text>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.formScroll}
            >
              {/* Room Preference */}
              <View style={styles.prefSection}>
                <Text style={styles.inputLabel}>Room Privacy</Text>
                <View style={styles.pillRow}>
                  {ROOM_PREFS.map((rp) => (
                    <Pressable
                      key={rp}
                      style={[
                        styles.chipPill,
                        roomPreference === rp && styles.chipPillActive,
                      ]}
                      onPress={() => setRoomPreference(rp)}
                    >
                      <Text
                        style={[
                          styles.chipPillText,
                          roomPreference === rp && styles.chipPillTextActive,
                        ]}
                      >
                        {rp}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Property Configuration */}
              <View style={styles.prefSection}>
                <Text style={styles.inputLabel}>Apartment Size</Text>
                <View style={styles.pillRow}>
                  {PROPERTY_TYPE_CHOICES.map((pt) => {
                    const isSelected = selectedPropTypes.includes(pt);
                    return (
                      <Pressable
                        key={pt}
                        style={[
                          styles.chipPill,
                          isSelected && styles.chipPillActive,
                        ]}
                        onPress={() => handleTogglePropType(pt)}
                      >
                        <Text
                          style={[
                            styles.chipPillText,
                            isSelected && styles.chipPillTextActive,
                          ]}
                        >
                          {pt}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Furnishing */}
              <View style={styles.prefSection}>
                <Text style={styles.inputLabel}>Furnishing Status</Text>
                <View style={styles.pillRow}>
                  {FURNISHING_CHOICES.map((fc) => (
                    <Pressable
                      key={fc}
                      style={[
                        styles.chipPill,
                        furnishing === fc && styles.chipPillActive,
                      ]}
                      onPress={() => setFurnishing(fc)}
                    >
                      <Text
                        style={[
                          styles.chipPillText,
                          furnishing === fc && styles.chipPillTextActive,
                        ]}
                      >
                        {fc}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <Pressable style={styles.continueBtn} onPress={handleNext}>
                <Text style={styles.continueBtnText}>Continue</Text>
                <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.2} />
              </Pressable>
            </View>
          </View>
        );

      // 7. Lifestyle Preferences
      case 'LIFESTYLE':
        return (
          <View style={styles.stepContainer}>
            <View style={styles.titleGroup}>
              <Text style={styles.heading}>What's important to you?</Text>
              <Text style={styles.subheading}>
                Pick your lifestyle habits so we can match you with compatible
                flatmates.
              </Text>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.formScroll}
            >
              <View style={styles.locGrid}>
                {LIFESTYLE_OPTIONS.map((tag) => {
                  const isSelected = lifestyle.includes(tag);
                  return (
                    <Pressable
                      key={tag}
                      style={[
                        styles.locPill,
                        isSelected && styles.locPillSelected,
                      ]}
                      onPress={() => handleToggleLifestyle(tag)}
                    >
                      <Text
                        style={[
                          styles.locPillText,
                          isSelected && styles.locPillTextSelected,
                        ]}
                      >
                        {tag}
                      </Text>
                      {isSelected && (
                        <Check size={14} color="#6C4DFF" strokeWidth={2.5} />
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <Pressable style={styles.continueBtn} onPress={handleNext}>
                <Text style={styles.continueBtnText}>Continue</Text>
                <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.2} />
              </Pressable>
            </View>
          </View>
        );

      // 8. Move In Timing
      case 'MOVE_IN':
        return (
          <View style={styles.stepContainer}>
            <View style={styles.titleGroup}>
              <Text style={styles.heading}>When are you planning to move?</Text>
              <Text style={styles.subheading}>
                Helps flatmates with matching lease timelines find you.
              </Text>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.formScroll}
            >
              {MOVE_IN_OPTIONS.map((opt) => {
                const isSelected = moveInTiming === opt;
                return (
                  <Pressable
                    key={opt}
                    style={[styles.cardOption, isSelected && styles.cardOptionActive]}
                    onPress={() => setMoveInTiming(opt)}
                  >
                    <Text
                      style={[
                        styles.cardOptionText,
                        isSelected && styles.cardOptionTextActive,
                      ]}
                    >
                      {opt}
                    </Text>
                    {isSelected && (
                      <CheckCircle2
                        size={20}
                        color="#6C4DFF"
                        strokeWidth={2.5}
                      />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.footer}>
              <Pressable style={styles.continueBtn} onPress={handleNext}>
                <Text style={styles.continueBtnText}>Continue</Text>
                <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.2} />
              </Pressable>
            </View>
          </View>
        );

      // 9. Short Bio
      case 'BIO':
        return (
          <View style={styles.stepContainer}>
            <View style={styles.titleGroup}>
              <Text style={styles.heading}>Introduce yourself</Text>
              <Text style={styles.subheading}>
                Write a short bio about your daily routine, interests, and home
                vibe.
              </Text>
            </View>

            <View style={styles.bioBoxWrap}>
              <TextInput
                value={bio}
                onChangeText={setBio}
                placeholder="Tell potential flatmates a little about your routine, work, interests and what kind of home you're looking for..."
                placeholderTextColor="#8C8994"
                multiline
                numberOfLines={6}
                maxLength={500}
                style={styles.bioInput}
              />
              <Text style={styles.bioCounter}>{bio.length} / 500</Text>
            </View>

            <View style={styles.footer}>
              <Pressable style={styles.continueBtn} onPress={handleNext}>
                <Text style={styles.continueBtnText}>Review Profile</Text>
                <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.2} />
              </Pressable>
            </View>
          </View>
        );

      // 10. Profile Preview
      case 'PREVIEW':
        return (
          <View style={styles.stepContainer}>
            <View style={styles.titleGroup}>
              <View style={styles.pillBadge}>
                <Sparkles size={12} color="#6C4DFF" strokeWidth={2.5} />
                <Text style={styles.pillBadgeText}>Profile Preview</Text>
              </View>
              <Text style={styles.heading}>Here's how you'll look</Text>
              <Text style={styles.subheading}>
                Review your flatmate card before publishing to the community.
              </Text>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.formScroll}
            >
              {/* Card Preview */}
              <View style={styles.previewCard}>
                <View style={styles.previewTop}>
                  <Image
                    source={{
                      uri:
                        avatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
                    }}
                    style={styles.previewAvatar}
                  />
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={styles.previewName}>
                      {name}, {age}
                    </Text>
                    <Text style={styles.previewOccupation}>{occupation}</Text>
                    <View style={styles.previewLookingPill}>
                      <Text style={styles.previewLookingText}>
                        {lookingFor}
                      </Text>
                    </View>
                  </View>
                </View>

                {bio ? <Text style={styles.previewBio}>"{bio}"</Text> : null}

                <View style={styles.previewMetaGrid}>
                  <View style={styles.previewMetaItem}>
                    <MapPin size={13} color="#6C4DFF" />
                    <Text style={styles.previewMetaText}>
                      {locations.join(', ')}
                    </Text>
                  </View>
                  <View style={styles.previewMetaItem}>
                    <IndianRupee size={13} color="#6C4DFF" />
                    <Text style={styles.previewMetaText}>
                      ₹{(budgetMin / 1000).toFixed(0)}K – ₹
                      {(budgetMax / 1000).toFixed(0)}K / mo
                    </Text>
                  </View>
                  <View style={styles.previewMetaItem}>
                    <BedDouble size={13} color="#6C4DFF" />
                    <Text style={styles.previewMetaText}>
                      {roomPreference} · {selectedPropTypes.join(', ')}
                    </Text>
                  </View>
                  <View style={styles.previewMetaItem}>
                    <Calendar size={13} color="#6C4DFF" />
                    <Text style={styles.previewMetaText}>{moveInTiming}</Text>
                  </View>
                </View>

                {lifestyle.length ? (
                  <View style={styles.previewTagsRow}>
                    {lifestyle.map((t, idx) => (
                      <View key={idx} style={styles.previewTagPill}>
                        <Text style={styles.previewTagText}>{t}</Text>
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <Pressable
                style={styles.primaryPublishBtn}
                onPress={handlePublish}
                accessibilityRole="button"
                accessibilityLabel="Publish Flatmate Profile"
              >
                <Sparkles size={18} color="#FFFFFF" strokeWidth={2.2} />
                <Text style={styles.primaryPublishBtnText}>
                  {isEditing ? 'Save Changes' : 'Publish Flatmate Profile'}
                </Text>
              </Pressable>

              <Pressable
                style={styles.editStepBtn}
                onPress={() => setCurrentStep('PHOTO')}
              >
                <Text style={styles.editStepBtnText}>Edit Details</Text>
              </Pressable>
            </View>
          </View>
        );

      // 11. Success Celebration
      case 'SUCCESS':
        return (
          <View style={[styles.stepContainer, { justifyContent: 'center' }]}>
            <View style={styles.successCard}>
              <View style={styles.successIconCircle}>
                <ShieldCheck size={44} color="#32B768" strokeWidth={2.2} />
              </View>
              <Text style={styles.successTitle}>Your profile is live!</Text>
              <Text style={styles.successDesc}>
                People searching for flatmates in {locations.join(', ')} can now
                discover and message you directly on REHVO.
              </Text>

              <View style={styles.successActions}>
                <Pressable
                  style={styles.successPrimaryBtn}
                  onPress={() => router.push('/(renter)/flatmates')}
                >
                  <Text style={styles.successPrimaryBtnText}>
                    Explore Flatmates
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.successSecondaryBtn}
                  onPress={() => router.push('/(renter)/flatmate/my-profile')}
                >
                  <Text style={styles.successSecondaryBtnText}>
                    View My Profile
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header with Progress Bar */}
        {currentStep !== 'SUCCESS' && (
          <View style={styles.topHeader}>
            <Pressable
              style={styles.backBtn}
              onPress={handleBack}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Back"
            >
              <ArrowLeft size={20} color="#171522" strokeWidth={2.2} />
            </Pressable>

            <View style={styles.progressCol}>
              <Text style={styles.stepText}>
                Step {stepIdx + 1} of {totalSteps}
              </Text>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${((stepIdx + 1) / totalSteps) * 100}%` },
                  ]}
                />
              </View>
            </View>

            <Pressable
              style={styles.closeBtn}
              onPress={() => router.back()}
              hitSlop={8}
            >
              <X size={20} color="#777482" />
            </Pressable>
          </View>
        )}

        <View style={{ flex: 1 }}>{renderStep()}</View>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    fontSize: 11.5,
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
  stepContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  titleGroup: {
    gap: 6,
    paddingVertical: 8,
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F0ECFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#DED6FD',
  },
  pillBadgeText: {
    fontSize: 11.5,
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
  photoCenterWrap: {
    alignItems: 'center',
    gap: 20,
    paddingVertical: 20,
  },
  largeAvatarWrap: {
    width: 140,
    height: 140,
    borderRadius: 70,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#6C4DFF',
    backgroundColor: '#FAF9FF',
  },
  largeAvatar: {
    width: '100%',
    height: '100%',
  },
  largeAvatarPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  placeholderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#777482',
  },
  photoActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  photoActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  photoActionBtnDanger: {
    borderColor: '#FEEFEF',
    backgroundColor: '#FEEFEF',
  },
  photoActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#171522',
  },
  formScroll: {
    paddingVertical: 8,
    gap: 14,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#171522',
  },
  input: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#171522',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 6,
  },
  genderPill: {
    flex: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
  },
  genderPillActive: {
    borderColor: '#6C4DFF',
    backgroundColor: '#FAF9FF',
  },
  genderPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#777482',
  },
  genderPillTextActive: {
    color: '#6C4DFF',
    fontWeight: '700',
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipPill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
  },
  chipPillActive: {
    borderColor: '#6C4DFF',
    backgroundColor: '#FAF9FF',
  },
  chipPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#777482',
  },
  chipPillTextActive: {
    color: '#6C4DFF',
    fontWeight: '700',
  },
  cardOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
  },
  cardOptionActive: {
    borderColor: '#6C4DFF',
    backgroundColor: '#FAF9FF',
  },
  cardOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#171522',
  },
  cardOptionTextActive: {
    color: '#6C4DFF',
    fontWeight: '700',
  },
  selectedLocationsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 4,
  },
  selectedLocChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0ECFF',
    borderWidth: 1,
    borderColor: '#DED6FD',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  selectedLocChipText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  subSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#777482',
  },
  locGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  locPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 6,
  },
  locPillSelected: {
    borderColor: '#6C4DFF',
    backgroundColor: '#FAF9FF',
  },
  locPillText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#171522',
  },
  locPillTextSelected: {
    color: '#6C4DFF',
    fontWeight: '700',
  },
  budgetDisplayCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#6C4DFF',
    padding: 16,
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  budgetDisplayLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#777482',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  budgetDisplayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  budgetDisplayText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#171522',
  },
  budgetDisplayPeriod: {
    fontSize: 13,
    fontWeight: '500',
    color: '#777482',
  },
  prefSection: {
    gap: 8,
  },
  bioBoxWrap: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
    padding: 14,
    gap: 8,
  },
  bioInput: {
    fontSize: 14.5,
    color: '#171522',
    lineHeight: 21,
    height: 140,
    textAlignVertical: 'top',
  },
  bioCounter: {
    fontSize: 12,
    color: '#777482',
    textAlign: 'right',
    fontWeight: '600',
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 16,
    gap: 12,
  },
  previewTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  previewAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  previewName: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#171522',
  },
  previewOccupation: {
    fontSize: 12.5,
    color: '#777482',
    fontWeight: '500',
  },
  previewLookingPill: {
    backgroundColor: '#FAF9FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  previewLookingText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6C4DFF',
  },
  previewBio: {
    fontSize: 13,
    color: '#48464B',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  previewMetaGrid: {
    backgroundColor: '#FAF9FF',
    padding: 10,
    borderRadius: 14,
    gap: 6,
  },
  previewMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  previewMetaText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#171522',
  },
  previewTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  previewTagPill: {
    backgroundColor: '#F8F7F4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  previewTagText: {
    fontSize: 11.5,
    color: '#777482',
    fontWeight: '600',
  },
  successCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EAF8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#171522',
  },
  successDesc: {
    fontSize: 13.5,
    color: '#777482',
    textAlign: 'center',
    lineHeight: 20,
  },
  successActions: {
    width: '100%',
    gap: 10,
    marginTop: 12,
  },
  successPrimaryBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#6C4DFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successPrimaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  successSecondaryBtn: {
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successSecondaryBtnText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#171522',
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
  continueBtnDisabled: {
    backgroundColor: '#C9C5CC',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  primaryPublishBtn: {
    height: 54,
    borderRadius: 16,
    backgroundColor: '#6C4DFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryPublishBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  editStepBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  editStepBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#777482',
  },
});
