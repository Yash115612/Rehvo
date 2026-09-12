import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  Dimensions,
  Modal,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Check,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  MapPin,
  Utensils,
  Cigarette,
  Wine,
  Dog,
  Clock,
  Laptop,
  Camera,
  Plus,
  Trash2,
  Lock,
  Users,
  ImageIcon,
  X,
  UploadCloud,
  CheckCircle2,
  Calendar,
  Building2,
  Home,
  MessageCircle,
  Quote,
  Shield,
  Train,
  Smile,
  Eye,
} from 'lucide-react-native';
import { V4_COLORS, V4_SHADOWS } from '../../../theme/v4Theme';
import { useAppStore } from '../../../store/useAppStore';
import { V4AuthGate } from '../ui/V4AuthGate';
import { V4Image } from '../ui/V4Image';
import { FlatmateProfile, FlatmatePrompt } from '../../../types';
import { uploadFlatmateGalleryPhotos, uploadFlatmatePhoto } from '../../../services/flatmates';
import { calculateTrustScore } from '../../../services/trustSafety';

const { width } = Dimensions.get('window');

const CITIES = ['Mumbai', 'Bengaluru', 'Delhi NCR', 'Pune', 'Hyderabad', 'Chennai'];

const GENDERS = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'any', label: 'Other / Non-Binary' },
];

const ROOM_PREFS = [
  { id: 'private_room', label: 'Private Room', desc: 'Single private room in shared flat' },
  { id: 'shared_room', label: 'Shared Room', desc: 'Twin sharing / 2 people in room' },
  { id: 'any', label: 'Open to Either', desc: 'Flexible based on flat quality' },
];

const MOVE_IN_OPTIONS = ['Immediate', 'Within 15 Days', 'Next Month', 'Flexible'];
const LEASE_OPTIONS = ['6 Months', '11 Months', '12+ Months'];
const WORK_MODES = [
  { id: 'wfh', label: 'Remote / WFH', icon: '🏠' },
  { id: 'hybrid', label: 'Hybrid (2-3 days)', icon: '💼' },
  { id: 'office', label: 'In-Office (5 days)', icon: '🏢' },
];

const FOOD_PREFS = [
  { id: 'veg', label: 'Pure Veg 🥗' },
  { id: 'non_veg', label: 'Non-Veg 🍗' },
  { id: 'jain', label: 'Jain Food 🥬' },
  { id: 'vegan', label: 'Vegan 🌱' },
  { id: 'eggetarian', label: 'Eggetarian 🍳' },
];

const SMOKING_PREFS = [
  { id: 'never', label: 'Non-Smoker 🚭' },
  { id: 'outside_only', label: 'Balcony Only 🚬' },
  { id: 'regular', label: 'Regular Smoker' },
];

const DRINKING_PREFS = [
  { id: 'never', label: 'Non-Drinker 💧' },
  { id: 'social', label: 'Social / Weekends 🍻' },
  { id: 'regular', label: 'Regular' },
];

const PET_PREFS = [
  { id: 'pet_friendly', label: 'Pet Friendly 🐶' },
  { id: 'has_pets', label: 'Have Pets with me 🐾' },
  { id: 'not_allowed', label: 'No Pets Allowed 🚫' },
];

const GUEST_POLICIES = [
  { id: 'flexible', label: 'Very Flexible 🎉' },
  { id: 'weekends_only', label: 'Weekends Only 🛋️' },
  { id: 'no_overnight', label: 'No Overnight Guests 🔒' },
];

const CLEANLINESS_PREFS = [
  { id: 'neat', label: 'Neat & Tidy (Daily Cleaning) ✨' },
  { id: 'moderate', label: 'Moderate (Weekly Maid) 🧹' },
  { id: 'relaxed', label: 'Relaxed & Chill 🛋️' },
];

const SLEEP_SCHEDULES = [
  { id: 'early_bird', label: 'Early Riser (6 AM) 🌅' },
  { id: 'night_owl', label: 'Night Owl (1 AM) 🌙' },
  { id: 'flexible', label: 'Flexible / Shifts ⏰' },
];

const PROMPT_QUESTIONS = [
  'The golden rule of our flat will be...',
  'My ideal Sunday looks like...',
  'A non-negotiable for me in a flatmate is...',
  'I geek out on...',
  'You should NOT move in with me if...',
  'The best thing I bring to a flat is...',
];

const SAMPLE_PHOTOS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
];

export const V4CreateFlatmateProfileScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, flatmateDraft, saveFlatmateDraft, createFlatmateProfile, showToast, isAuthenticated } = useAppStore();

  const [step, setStep] = useState(1);

  // Step 1: Basic Info
  const [name, setName] = useState(flatmateDraft?.name || user?.name || '');
  const [age, setAge] = useState(flatmateDraft?.age?.toString() || '24');
  const [gender, setGender] = useState<'male' | 'female' | 'any'>(
    (flatmateDraft?.gender as any) || 'female'
  );
  const [city, setCity] = useState(flatmateDraft?.city || 'Mumbai');

  // Step 2: Work & Alma Mater
  const [profession, setProfession] = useState(
    flatmateDraft?.profession || flatmateDraft?.occupation || 'Product Designer'
  );
  const [company, setCompany] = useState(
    flatmateDraft?.company || flatmateDraft?.company_or_college || 'Swiggy'
  );
  const [college, setCollege] = useState(flatmateDraft?.college || 'IIT Bombay');
  const [workMode, setWorkMode] = useState<'wfh' | 'office' | 'hybrid'>(
    (flatmateDraft?.work_mode as any) || (flatmateDraft?.work_style as any) || 'hybrid'
  );

  // Step 3: Location & Budget
  const [locality, setLocality] = useState(flatmateDraft?.locality || 'Bandra West, Khar, Santacruz');
  const [budgetMin, setBudgetMin] = useState(
    flatmateDraft?.budget_min?.toString() || '20000'
  );
  const [budgetMax, setBudgetMax] = useState(
    flatmateDraft?.budget_max?.toString() || '35000'
  );
  const [nearMetro, setNearMetro] = useState(true);
  const [nearItPark, setNearItPark] = useState(false);
  const [nearCollege, setNearCollege] = useState(false);

  // Step 4: Move-in & Lease
  const [moveInDate, setMoveInDate] = useState(flatmateDraft?.move_in_date || 'Immediate');
  const [leaseDuration, setLeaseDuration] = useState('11 Months');
  const [roomPref, setRoomPref] = useState<'private_room' | 'shared_room' | 'any'>(
    (flatmateDraft?.room_type_preference as any) || 'private_room'
  );

  // Step 5: Habits Matrix
  const [foodPref, setFoodPref] = useState<'veg' | 'non_veg' | 'jain' | 'vegan' | 'eggetarian'>(
    (flatmateDraft?.food_preference as any) || 'veg'
  );
  const [smoking, setSmoking] = useState<'never' | 'outside_only' | 'regular'>(
    (flatmateDraft?.smoking as any) || 'never'
  );
  const [drinking, setDrinking] = useState<'never' | 'social' | 'regular'>(
    (flatmateDraft?.drinking as any) || 'social'
  );
  const [pets, setPets] = useState<'pet_friendly' | 'has_pets' | 'not_allowed'>(
    (flatmateDraft?.pet_friendly as any) || 'pet_friendly'
  );
  const [guestPolicy, setGuestPolicy] = useState<'flexible' | 'weekends_only' | 'no_overnight'>('flexible');
  const [cleanliness, setCleanliness] = useState<'neat' | 'moderate' | 'relaxed'>('neat');
  const [sleepHabit, setSleepHabit] = useState<'early_bird' | 'night_owl' | 'flexible'>('early_bird');

  // Step 6: Prompts (Hinge-Style 3 Prompts)
  const [prompts, setPrompts] = useState<FlatmatePrompt[]>([
    {
      id: 'p1',
      prompt_question: 'The golden rule of our flat will be...',
      prompt_answer: 'Respect quiet hours on weeknights, and keep the kitchen spotless after cooking!',
    },
    {
      id: 'p2',
      prompt_question: 'My ideal Sunday looks like...',
      prompt_answer: 'Morning coffee & workout, catching up on books, and exploring local bakeries.',
    },
    {
      id: 'p3',
      prompt_question: 'A non-negotiable for me in a flatmate is...',
      prompt_answer: 'Honest, open communication and treating common areas with care.',
    },
  ]);

  // Step 7: Photos & Gallery
  const [photos, setPhotos] = useState<string[]>(
    flatmateDraft?.photos && flatmateDraft.photos.length > 0
      ? flatmateDraft.photos
      : [SAMPLE_PHOTOS[0], SAMPLE_PHOTOS[1], SAMPLE_PHOTOS[2]]
  );
  const [bio, setBio] = useState(
    flatmateDraft?.bio ||
      'Looking for a tidy, friendly flatmate to share a 2BHK/3BHK in Bandra or Khar. I work hybrid in tech, love coffee, and keep things quiet & clean on weekdays.'
  );

  // Step 8: Trust & Verification
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(true);
  const [isWorkVerified, setIsWorkVerified] = useState(true);
  const [isPhoneVerified, setIsPhoneVerified] = useState(true);
  const [isLinkedInConnected, setIsLinkedInConnected] = useState(true);

  // Helpers
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Auto-save draft on changes
  useEffect(() => {
    saveFlatmateDraft({
      name,
      age: parseInt(age) || 24,
      gender,
      profession,
      company,
      company_or_college: company,
      college,
      work_mode: workMode,
      work_style: workMode,
      food_preference: foodPref,
      smoking,
      drinking,
      pet_friendly: pets,
      pets,
      guest_policy: guestPolicy,
      cleanliness,
      sleep_habit: sleepHabit,
      sleep_schedule: sleepHabit,
      city,
      locality,
      budget_min: parseInt(budgetMin) || 15000,
      budget_max: parseInt(budgetMax) || 30000,
      room_type_preference: roomPref,
      move_in_date: moveInDate,
      photos,
      bio,
      prompts,
    });
  }, [
    name,
    age,
    gender,
    profession,
    company,
    college,
    workMode,
    foodPref,
    smoking,
    drinking,
    pets,
    guestPolicy,
    cleanliness,
    sleepHabit,
    city,
    locality,
    budgetMin,
    budgetMax,
    roomPref,
    moveInDate,
    photos,
    bio,
    prompts,
  ]);

  const trustResult = useMemo(() => {
    return calculateTrustScore({
      is_kyc_verified: isAadhaarVerified,
      company,
      college,
      phone: user?.phone || '+91 98765 43210',
      email: user?.email || 'user@example.com',
      avatar: photos[0],
      verification_badges: {
        aadhaar: isAadhaarVerified,
        work: isWorkVerified,
        college: Boolean(college),
        phone: isPhoneVerified,
        linkedin: isLinkedInConnected,
      },
    });
  }, [isAadhaarVerified, isWorkVerified, isPhoneVerified, isLinkedInConnected, company, college, user, photos]);

  const handlePickPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Needed', 'Please allow photo gallery access to add profile pictures.');
        return;
      }

      setIsUploadingPhoto(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        const localUri = result.assets[0].uri;
        if (user?.id) {
          const uploadRes = await uploadFlatmatePhoto(user.id, localUri);
          if (uploadRes.success && uploadRes.data) {
            setPhotos((prev) => [uploadRes.data, ...prev.slice(0, 5)]);
          } else {
            setPhotos((prev) => [localUri, ...prev.slice(0, 5)]);
          }
        } else {
          setPhotos((prev) => [localUri, ...prev.slice(0, 5)]);
        }
      }
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!name.trim()) {
        Alert.alert('Required', 'Please enter your full name.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!profession.trim()) {
        Alert.alert('Required', 'Please enter your profession.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!locality.trim()) {
        Alert.alert('Required', 'Please enter your target localities.');
        return;
      }
      setStep(4);
    } else if (step === 4) {
      setStep(5);
    } else if (step === 5) {
      setStep(6);
    } else if (step === 6) {
      setStep(7);
    } else if (step === 7) {
      if (photos.length === 0) {
        Alert.alert('Photo Needed', 'Please add at least 1 profile picture.');
        return;
      }
      setStep(8);
    } else if (step === 8) {
      setStep(9);
    }
  };

  const handlePublish = async () => {
    setIsSubmitting(true);

    try {
      // Upload any local file URIs to Supabase Storage bucket flatmate-images
      let resolvedPhotos = [...photos];
      const hasLocalFiles = photos.some(
        (p) => p.startsWith('file:') || p.startsWith('blob:') || p.startsWith('ph:')
      );

      if (hasLocalFiles && user?.id) {
        const uploadRes = await uploadFlatmateGalleryPhotos(user.id, photos);
        if (uploadRes.success && uploadRes.data.length > 0) {
          resolvedPhotos = uploadRes.data;
        }
      }

      const profileData: Partial<FlatmateProfile> = {
        name: name.trim(),
        age: parseInt(age) || 24,
        gender: gender as any,
        profession: profession.trim(),
        occupation: profession.trim(),
        company: company.trim(),
        college: college.trim(),
        company_or_college: company.trim() || college.trim(),
        work_mode: workMode,
        work_style: workMode,
        food_preference: foodPref,
        smoking,
        drinking,
        pet_friendly: pets,
        pets,
        guest_policy: guestPolicy,
        cleanliness,
        sleep_habit: sleepHabit,
        sleep_schedule: sleepHabit,
        city,
        locality: locality.trim(),
        preferred_localities: locality.split(',').map((l) => l.trim()),
        budget_min: parseInt(budgetMin) || 15000,
        budget_max: parseInt(budgetMax) || 35000,
        room_type_preference: roomPref,
        move_in_date: moveInDate,
        photos: resolvedPhotos,
        avatar_url: resolvedPhotos[0],
        avatar: resolvedPhotos[0],
        bio: bio.trim(),
        prompts,
        near_metro: nearMetro,
        near_it_park: nearItPark,
        near_college: nearCollege,
        is_kyc_verified: isAadhaarVerified,
        trust_score: trustResult.score,
        verification_badges: {
          aadhaar: isAadhaarVerified,
          work: isWorkVerified,
          college: Boolean(college),
          phone: isPhoneVerified,
          linkedin: isLinkedInConnected,
        },
        status: 'active',
      };

      const res = await createFlatmateProfile(profileData, resolvedPhotos[0]);
      setIsSubmitting(false);

      if (res.success) {
        showToast('🎉 Flatmate Profile Live on REHVO!', 'success');
        router.replace('/(renter)/flatmate/my-profile' as any);
      } else {
        Alert.alert('Publish Failed', res.error || 'Please check your connection and try again.');
      }
    } catch {
      setIsSubmitting(false);
      Alert.alert('Error', 'Could not publish flatmate profile. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={[styles.root, { paddingTop: Math.max(insets.top, 14) }]}>
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={10}>
            <ArrowLeft size={20} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Create Flatmate Profile</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <V4AuthGate
          title="Sign in to Create Flatmate Profile"
          description="Create your verified roommate profile to find compatible flatmates, get discovered, and exchange waves with verified marketplace."
          featureName="Profile Creator"
          badgeText="ROOMMATE MATCHING"
          icon={<Users size={32} color="#059669" strokeWidth={2.4} />}
          benefits={[
            'Personalized AI compatibility matching score',
            'Connect & exchange waves with verified roommates',
            'Shared 2BHK/3BHK apartment suggestions with rent split',
            'Aadhaar DigiLocker verified identity badge',
          ]}
          fullScreen={false}
        />
      </View>
    );
  }

  const stepTitles = [
    'Basic Info',
    'Work & Education',
    'Location & Budget',
    'Move-in & Lease',
    'Habits Matrix',
    'Prompts',
    'Photos & Bio',
    'Trust & Verification',
    'Review & Publish',
  ];

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => {
            if (step > 1) {
              setStep(step - 1);
            } else {
              router.back();
            }
          }}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <ArrowLeft size={20} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.headerStepText}>STEP {step} OF 9</Text>
          <Text style={styles.headerTitle}>{stepTitles[step - 1]}</Text>
        </View>

        <View style={styles.stepCounterBadge}>
          <Text style={styles.stepCounterText}>{Math.round((step / 9) * 100)}%</Text>
        </View>
      </View>

      {/* Sleek Progress Bar */}
      <View style={styles.progressBarTrack}>
        <View style={[styles.progressBarFill, { width: `${(step / 9) * 100}%` }]} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 20) + 90 },
        ]}
      >
        {/* STEP 1: BASIC INFO */}
        {step === 1 && (
          <View style={styles.stepCard}>
            <Text style={styles.stepHeading}>Tell us about yourself</Text>
            <Text style={styles.stepSub}>Your name, age, and preferred city for co-living.</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>FULL NAME *</Text>
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Yash Choudhary"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>AGE *</Text>
                <TextInput
                  style={styles.textInput}
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                  maxLength={2}
                  placeholder="24"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1.5 }]}>
                <Text style={styles.inputLabel}>CITY *</Text>
                <TextInput
                  style={styles.textInput}
                  value={city}
                  onChangeText={setCity}
                  placeholder="Mumbai"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>GENDER IDENTITY</Text>
              <View style={styles.chipRow}>
                {GENDERS.map((g) => (
                  <Pressable
                    key={g.id}
                    style={[styles.chip, gender === g.id && styles.chipActive]}
                    onPress={() => setGender(g.id as any)}
                  >
                    <Text style={[styles.chipText, gender === g.id && styles.chipTextActive]}>
                      {g.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* STEP 2: WORK & ALMA MATER */}
        {step === 2 && (
          <View style={styles.stepCard}>
            <Text style={styles.stepHeading}>Career & Education</Text>
            <Text style={styles.stepSub}>Flatmates love knowing your background & daily work rhythm.</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>PROFESSION / ROLE *</Text>
              <TextInput
                style={styles.textInput}
                value={profession}
                onChangeText={setProfession}
                placeholder="e.g. Software Engineer / Product Designer"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>COMPANY / EMPLOYER</Text>
              <TextInput
                style={styles.textInput}
                value={company}
                onChangeText={setCompany}
                placeholder="e.g. Google, Swiggy, Bain"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>COLLEGE / ALMA MATER</Text>
              <TextInput
                style={styles.textInput}
                value={college}
                onChangeText={setCollege}
                placeholder="e.g. IIT Bombay, IIM Ahmedabad"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>WORK MODE</Text>
              <View style={styles.chipRow}>
                {WORK_MODES.map((wm) => (
                  <Pressable
                    key={wm.id}
                    style={[styles.chip, workMode === wm.id && styles.chipActive]}
                    onPress={() => setWorkMode(wm.id as any)}
                  >
                    <Text style={{ marginRight: 4 }}>{wm.icon}</Text>
                    <Text style={[styles.chipText, workMode === wm.id && styles.chipTextActive]}>
                      {wm.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* STEP 3: LOCATION & BUDGET */}
        {step === 3 && (
          <View style={styles.stepCard}>
            <Text style={styles.stepHeading}>Where & What Budget?</Text>
            <Text style={styles.stepSub}>Specify target localities and your rent budget range.</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>PREFERRED LOCALITIES (COMMA SEPARATED) *</Text>
              <TextInput
                style={styles.textInput}
                value={locality}
                onChangeText={setLocality}
                placeholder="e.g. Bandra West, Khar, Santacruz"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>MIN BUDGET (₹/MO)</Text>
                <TextInput
                  style={styles.textInput}
                  value={budgetMin}
                  onChangeText={setBudgetMin}
                  keyboardType="numeric"
                  placeholder="20000"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>MAX BUDGET (₹/MO)</Text>
                <TextInput
                  style={styles.textInput}
                  value={budgetMax}
                  onChangeText={setBudgetMax}
                  keyboardType="numeric"
                  placeholder="35000"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>TRANSIT HUBS & PROXIMITY</Text>
              <View style={styles.toggleRow}>
                <Pressable
                  style={[styles.toggleBtn, nearMetro && styles.toggleBtnActive]}
                  onPress={() => setNearMetro(!nearMetro)}
                >
                  <Train size={16} color={nearMetro ? '#0F766E' : '#64748B'} />
                  <Text style={[styles.toggleBtnText, nearMetro && styles.toggleBtnTextActive]}>
                    Near Metro
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.toggleBtn, nearItPark && styles.toggleBtnActive]}
                  onPress={() => setNearItPark(!nearItPark)}
                >
                  <Building2 size={16} color={nearItPark ? '#0F766E' : '#64748B'} />
                  <Text style={[styles.toggleBtnText, nearItPark && styles.toggleBtnTextActive]}>
                    Near IT Park
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.toggleBtn, nearCollege && styles.toggleBtnActive]}
                  onPress={() => setNearCollege(!nearCollege)}
                >
                  <GraduationCap size={16} color={nearCollege ? '#0F766E' : '#64748B'} />
                  <Text style={[styles.toggleBtnText, nearCollege && styles.toggleBtnTextActive]}>
                    Near College
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}

        {/* STEP 4: MOVE-IN & LEASE */}
        {step === 4 && (
          <View style={styles.stepCard}>
            <Text style={styles.stepHeading}>Move-in Timing & Lease</Text>
            <Text style={styles.stepSub}>When do you plan to shift, and what room type fits you?</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>ROOM PREFERENCE</Text>
              <View style={{ gap: 8 }}>
                {ROOM_PREFS.map((rp) => (
                  <Pressable
                    key={rp.id}
                    style={[styles.cardOption, roomPref === rp.id && styles.cardOptionActive]}
                    onPress={() => setRoomPref(rp.id as any)}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.cardOptionTitle, roomPref === rp.id && styles.cardOptionTitleActive]}>
                        {rp.label}
                      </Text>
                      <Text style={styles.cardOptionDesc}>{rp.desc}</Text>
                    </View>
                    {roomPref === rp.id && (
                      <CheckCircle2 size={18} color="#0F766E" strokeWidth={2.4} />
                    )}
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>MOVE-IN TIMING</Text>
              <View style={styles.chipRow}>
                {MOVE_IN_OPTIONS.map((opt) => (
                  <Pressable
                    key={opt}
                    style={[styles.chip, moveInDate === opt && styles.chipActive]}
                    onPress={() => setMoveInDate(opt)}
                  >
                    <Text style={[styles.chipText, moveInDate === opt && styles.chipTextActive]}>
                      {opt}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>LEASE DURATION</Text>
              <View style={styles.chipRow}>
                {LEASE_OPTIONS.map((dur) => (
                  <Pressable
                    key={dur}
                    style={[styles.chip, leaseDuration === dur && styles.chipActive]}
                    onPress={() => setLeaseDuration(dur)}
                  >
                    <Text style={[styles.chipText, leaseDuration === dur && styles.chipTextActive]}>
                      {dur}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* STEP 5: HABITS MATRIX */}
        {step === 5 && (
          <View style={styles.stepCard}>
            <Text style={styles.stepHeading}>Habits & Lifestyle Matrix</Text>
            <Text style={styles.stepSub}>Matching compatible habits prevents 90% of flatmate disputes.</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>FOOD PREFERENCE</Text>
              <View style={styles.chipRow}>
                {FOOD_PREFS.map((fp) => (
                  <Pressable
                    key={fp.id}
                    style={[styles.chip, foodPref === fp.id && styles.chipActive]}
                    onPress={() => setFoodPref(fp.id as any)}
                  >
                    <Text style={[styles.chipText, foodPref === fp.id && styles.chipTextActive]}>
                      {fp.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>SMOKING</Text>
              <View style={styles.chipRow}>
                {SMOKING_PREFS.map((sp) => (
                  <Pressable
                    key={sp.id}
                    style={[styles.chip, smoking === sp.id && styles.chipActive]}
                    onPress={() => setSmoking(sp.id as any)}
                  >
                    <Text style={[styles.chipText, smoking === sp.id && styles.chipTextActive]}>
                      {sp.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>DRINKING</Text>
              <View style={styles.chipRow}>
                {DRINKING_PREFS.map((dp) => (
                  <Pressable
                    key={dp.id}
                    style={[styles.chip, drinking === dp.id && styles.chipActive]}
                    onPress={() => setDrinking(dp.id as any)}
                  >
                    <Text style={[styles.chipText, drinking === dp.id && styles.chipTextActive]}>
                      {dp.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>PETS</Text>
              <View style={styles.chipRow}>
                {PET_PREFS.map((pp) => (
                  <Pressable
                    key={pp.id}
                    style={[styles.chip, pets === pp.id && styles.chipActive]}
                    onPress={() => setPets(pp.id as any)}
                  >
                    <Text style={[styles.chipText, pets === pp.id && styles.chipTextActive]}>
                      {pp.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>GUEST POLICY</Text>
              <View style={styles.chipRow}>
                {GUEST_POLICIES.map((gp) => (
                  <Pressable
                    key={gp.id}
                    style={[styles.chip, guestPolicy === gp.id && styles.chipActive]}
                    onPress={() => setGuestPolicy(gp.id as any)}
                  >
                    <Text style={[styles.chipText, guestPolicy === gp.id && styles.chipTextActive]}>
                      {gp.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CLEANLINESS STANDARD</Text>
              <View style={{ gap: 8 }}>
                {CLEANLINESS_PREFS.map((cp) => (
                  <Pressable
                    key={cp.id}
                    style={[styles.cardOption, cleanliness === cp.id && styles.cardOptionActive]}
                    onPress={() => setCleanliness(cp.id as any)}
                  >
                    <Text style={[styles.cardOptionTitle, cleanliness === cp.id && styles.cardOptionTitleActive]}>
                      {cp.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* STEP 6: PROMPTS (HINGE-STYLE) */}
        {step === 6 && (
          <View style={styles.stepCard}>
            <Text style={styles.stepHeading}>Hinge-Style Prompts</Text>
            <Text style={styles.stepSub}>Answer 3 quick prompts so prospective flatmates can get your vibe.</Text>

            {prompts.map((p, idx) => (
              <View key={p.id || idx} style={styles.promptBox}>
                <View style={styles.promptHeader}>
                  <Quote size={14} color="#0F766E" />
                  <Text style={styles.promptHeaderTitle}>PROMPT {idx + 1}</Text>
                </View>

                {/* Prompt Question Selector */}
                <View style={styles.promptQuestionRow}>
                  <Text style={styles.promptQuestionText}>{p.prompt_question}</Text>
                </View>

                <TextInput
                  style={styles.promptAnswerInput}
                  value={p.prompt_answer}
                  onChangeText={(txt) => {
                    const next = [...prompts];
                    next[idx] = { ...next[idx], prompt_answer: txt };
                    setPrompts(next);
                  }}
                  multiline
                  placeholder="Type your answer here..."
                  placeholderTextColor="#94A3B8"
                />
              </View>
            ))}
          </View>
        )}

        {/* STEP 7: PHOTOS & GALLERY */}
        {step === 7 && (
          <View style={styles.stepCard}>
            <Text style={styles.stepHeading}>Photos & Lifestyle Gallery</Text>
            <Text style={styles.stepSub}>Add your main avatar and up to 6 pictures of you and your spaces.</Text>

            {/* Photos Grid */}
            <View style={styles.photoGrid}>
              {photos.map((uri, idx) => (
                <View key={idx} style={styles.photoItem}>
                  <V4Image source={{ uri }} style={styles.photoThumb} resizeMode="cover" />
                  {idx === 0 && (
                    <View style={styles.mainPhotoTag}>
                      <Text style={styles.mainPhotoTagText}>MAIN</Text>
                    </View>
                  )}
                  {photos.length > 1 && (
                    <Pressable
                      style={styles.deletePhotoBtn}
                      onPress={() => setPhotos(photos.filter((_, i) => i !== idx))}
                      hitSlop={8}
                    >
                      <Trash2 size={13} color="#FFFFFF" />
                    </Pressable>
                  )}
                </View>
              ))}

              {photos.length < 6 && (
                <Pressable style={styles.addPhotoBtn} onPress={handlePickPhoto}>
                  {isUploadingPhoto ? (
                    <ActivityIndicator size="small" color="#0F766E" />
                  ) : (
                    <>
                      <Plus size={24} color="#0F766E" />
                      <Text style={styles.addPhotoBtnText}>Add Photo</Text>
                    </>
                  )}
                </Pressable>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>ABOUT ME (BIO)</Text>
              <TextInput
                style={styles.bioInput}
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={4}
                placeholder="Share a short bio about what you do, how you live, and what you look for in a flatmate."
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>
        )}

        {/* STEP 8: TRUST & VERIFICATION */}
        {step === 8 && (
          <View style={styles.stepCard}>
            <Text style={styles.stepHeading}>Trust & Safety Verification</Text>
            <Text style={styles.stepSub}>Verified badges give you 3.5x more responses and higher discovery ranking.</Text>

            {/* Live Trust Score Meter */}
            <View style={styles.trustScoreBanner}>
              <ShieldCheck size={32} color="#059669" strokeWidth={2.4} />
              <View style={{ flex: 1 }}>
                <Text style={styles.trustScoreTitle}>
                  Trust Score: {trustResult.score}/100
                </Text>
                <Text style={styles.trustScoreTier}>{trustResult.tier}</Text>
              </View>
            </View>

            <View style={{ gap: 10, marginTop: 12 }}>
              <Pressable
                style={[styles.verificationRow, isAadhaarVerified && styles.verificationRowActive]}
                onPress={() => setIsAadhaarVerified(!isAadhaarVerified)}
              >
                <ShieldCheck size={20} color={isAadhaarVerified ? '#059669' : '#64748B'} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.verificationTitle}>DigiLocker Aadhaar KYC</Text>
                  <Text style={styles.verificationDesc}>Government ID authenticated</Text>
                </View>
                <View style={[styles.checkCircle, isAadhaarVerified && styles.checkCircleActive]}>
                  {isAadhaarVerified && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                </View>
              </Pressable>

              <Pressable
                style={[styles.verificationRow, isWorkVerified && styles.verificationRowActive]}
                onPress={() => setIsWorkVerified(!isWorkVerified)}
              >
                <Briefcase size={20} color={isWorkVerified ? '#059669' : '#64748B'} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.verificationTitle}>Corporate Work / College Email</Text>
                  <Text style={styles.verificationDesc}>Verified employment / student status</Text>
                </View>
                <View style={[styles.checkCircle, isWorkVerified && styles.checkCircleActive]}>
                  {isWorkVerified && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                </View>
              </Pressable>

              <Pressable
                style={[styles.verificationRow, isPhoneVerified && styles.verificationRowActive]}
                onPress={() => setIsPhoneVerified(!isPhoneVerified)}
              >
                <Lock size={20} color={isPhoneVerified ? '#059669' : '#64748B'} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.verificationTitle}>Phone OTP Verified</Text>
                  <Text style={styles.verificationDesc}>Direct WhatsApp communication enabled</Text>
                </View>
                <View style={[styles.checkCircle, isPhoneVerified && styles.checkCircleActive]}>
                  {isPhoneVerified && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                </View>
              </Pressable>

              <Pressable
                style={[styles.verificationRow, isLinkedInConnected && styles.verificationRowActive]}
                onPress={() => setIsLinkedInConnected(!isLinkedInConnected)}
              >
                <Users size={20} color={isLinkedInConnected ? '#059669' : '#64748B'} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.verificationTitle}>LinkedIn Profile Connected</Text>
                  <Text style={styles.verificationDesc}>Social proof & mutual network discovery</Text>
                </View>
                <View style={[styles.checkCircle, isLinkedInConnected && styles.checkCircleActive]}>
                  {isLinkedInConnected && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                </View>
              </Pressable>
            </View>
          </View>
        )}

        {/* STEP 9: REVIEW & PUBLISH */}
        {step === 9 && (
          <View style={styles.stepCard}>
            <Text style={styles.stepHeading}>Review Your Profile</Text>
            <Text style={styles.stepSub}>Here is how your profile will appear to roommates in the Discovery Deck.</Text>

            {/* Preview Card */}
            <View style={styles.previewDeckCard}>
              <V4Image source={{ uri: photos[0] }} style={styles.previewImage} resizeMode="cover" />

              <View style={styles.previewCardInfo}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.previewCardName}>{name}, {age}</Text>
                  {isAadhaarVerified && (
                    <ShieldCheck size={16} color="#059669" strokeWidth={2.6} />
                  )}
                </View>

                <Text style={styles.previewCardSub}>
                  {profession} {company ? `• ${company}` : ''}
                </Text>

                <View style={styles.previewLocalityRow}>
                  <MapPin size={12} color="#0F766E" />
                  <Text style={styles.previewLocalityText}>{locality.split(',')[0]}</Text>
                  <Text style={styles.previewBudgetText}>
                    · ₹{Math.round((parseInt(budgetMin) || 20000) / 1000)}k–₹{Math.round((parseInt(budgetMax) || 35000) / 1000)}k/mo
                  </Text>
                </View>

                {prompts[0]?.prompt_answer ? (
                  <View style={styles.previewPromptBubble}>
                    <Text style={styles.previewPromptQ}>{prompts[0].prompt_question}</Text>
                    <Text style={styles.previewPromptA}>"{prompts[0].prompt_answer}"</Text>
                  </View>
                ) : null}
              </View>
            </View>

            <View style={styles.readyNote}>
              <Sparkles size={16} color="#0F766E" />
              <Text style={styles.readyNoteText}>
                Your profile is 100% complete and will be immediately discoverable by verified flatmates!
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Floating Bottom Navigation Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        {step > 1 && (
          <Pressable
            style={styles.prevBtn}
            onPress={() => setStep(step - 1)}
            accessibilityRole="button"
            accessibilityLabel="Previous step"
          >
            <Text style={styles.prevBtnText}>Back</Text>
          </Pressable>
        )}

        {step < 9 ? (
          <Pressable
            style={styles.nextBtn}
            onPress={handleNextStep}
            accessibilityRole="button"
            accessibilityLabel="Continue to next step"
          >
            <Text style={styles.nextBtnText}>Continue</Text>
            <ArrowRight size={16} color="#FFFFFF" strokeWidth={2.4} />
          </Pressable>
        ) : (
          <Pressable
            style={styles.publishBtn}
            onPress={handlePublish}
            disabled={isSubmitting}
            accessibilityRole="button"
            accessibilityLabel="Publish profile"
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Sparkles size={16} color="#FFFFFF" strokeWidth={2.4} />
                <Text style={styles.publishBtnText}>Publish Live Profile</Text>
              </>
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  headerStepText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#0F766E',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  stepCounterBadge: {
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  stepCounterText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F766E',
  },
  progressBarTrack: {
    width: '100%',
    height: 3.5,
    backgroundColor: '#E2E8F0',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0F766E',
  },
  scrollContent: {
    padding: 16,
  },
  stepCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    gap: 16,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  stepHeading: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  stepSub: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginTop: -8,
  },
  inputGroup: {
    gap: 6,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.3,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
    minHeight: 46,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    minHeight: 40,
  },
  chipActive: {
    backgroundColor: '#F0FDFA',
    borderColor: '#0F766E',
  },
  chipText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
  },
  chipTextActive: {
    color: '#0F766E',
    fontWeight: '800',
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    minHeight: 44,
  },
  toggleBtnActive: {
    backgroundColor: '#F0FDFA',
    borderColor: '#0F766E',
  },
  toggleBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
  },
  toggleBtnTextActive: {
    color: '#0F766E',
    fontWeight: '800',
  },
  cardOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    minHeight: 48,
  },
  cardOptionActive: {
    backgroundColor: '#F0FDFA',
    borderColor: '#0F766E',
  },
  cardOptionTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardOptionTitleActive: {
    color: '#0F766E',
    fontWeight: '800',
  },
  cardOptionDesc: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  promptBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  promptHeaderTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0F766E',
    letterSpacing: 0.5,
  },
  promptQuestionRow: {
    paddingVertical: 2,
  },
  promptQuestionText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  promptAnswerInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 10,
    fontSize: 13,
    color: '#0F172A',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  photoItem: {
    position: 'relative',
    width: (width - 72) / 3,
    height: (width - 72) / 3,
    borderRadius: 14,
    overflow: 'hidden',
  },
  photoThumb: {
    width: '100%',
    height: '100%',
  },
  mainPhotoTag: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#0F766E',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  mainPhotoTagText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  deletePhotoBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoBtn: {
    width: (width - 72) / 3,
    height: (width - 72) / 3,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#0F766E',
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addPhotoBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F766E',
  },
  bioInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 12,
    fontSize: 13.5,
    color: '#0F172A',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  trustScoreBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F0FDF4',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#BBF7D0',
  },
  trustScoreTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#065F46',
  },
  trustScoreTier: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  verificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    minHeight: 48,
  },
  verificationRowActive: {
    backgroundColor: '#F0FDFA',
    borderColor: '#0F766E',
  },
  verificationTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  verificationDesc: {
    fontSize: 11,
    color: '#64748B',
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleActive: {
    backgroundColor: '#059669',
  },
  previewDeckCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  previewImage: {
    width: '100%',
    height: 220,
  },
  previewCardInfo: {
    padding: 16,
    gap: 4,
  },
  previewCardName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  previewCardSub: {
    fontSize: 13,
    color: '#64748B',
  },
  previewLocalityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  previewLocalityText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  previewBudgetText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  previewPromptBubble: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 3,
  },
  previewPromptQ: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F766E',
  },
  previewPromptA: {
    fontSize: 12.5,
    color: '#334155',
    fontStyle: 'italic',
  },
  readyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDFA',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  readyNoteText: {
    flex: 1,
    fontSize: 12,
    color: '#0F766E',
    fontWeight: '600',
    lineHeight: 16,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEF2F6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 10,
  },
  prevBtn: {
    height: 48,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#64748B',
  },
  nextBtn: {
    flex: 1,
    height: 48,
    backgroundColor: '#0F766E',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 2,
  },
  nextBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  publishBtn: {
    flex: 1,
    height: 48,
    backgroundColor: '#059669',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  publishBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
