import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  Alert,
  Dimensions,
  Platform,
  Modal,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Check,
  Camera,
  Trash2,
  Sparkles,
  MapPin,
  Briefcase,
  Utensils,
  Cigarette,
  Wine,
  Dog,
  Clock,
  Laptop,
  Save,
  Plus,
  ImageIcon,
  X,
  ShieldCheck,
} from 'lucide-react-native';
import { V4_COLORS, V4_SHADOWS } from '../../../theme/v4Theme';
import { useAppStore } from '../../../store/useAppStore';
import { uploadFlatmateGalleryPhotos, uploadFlatmatePhoto } from '../../../services/flatmates';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
];

const LIFESTYLE_CHIPS = [
  '🚭 Non-Smoker',
  '🥗 Pure Veg',
  '🍗 Non-Veg OK',
  '💻 Work From Home',
  '🌅 Early Riser',
  '🌙 Night Owl',
  '🐶 Pet Friendly',
  '🧘 Clean & Quiet',
  '🍻 Social Drinker',
  '🏋️ Fitness Enthusiast',
  '🍳 Loves Cooking',
  '🎧 Music Lover',
  '🎬 Movie Buff',
  '📚 Bookworm',
];

export const V4EditFlatmateProfileScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, myFlatmateProfile, updateFlatmateProfile, createFlatmateProfile, showToast } = useAppStore();

  const profile = myFlatmateProfile || {
    id: 'my_profile',
    name: user?.name || '',
    age: (user as any)?.age || 24,
    gender: (user as any)?.gender || 'male',
    profession: user?.occupation || '',
    company_or_college: '',
    city: user?.city || 'Mumbai',
    locality: user?.locality || 'Bandra West',
    budget_min: user?.budget_min || 18000,
    budget_max: user?.budget_max || 30000,
    room_type_preference: 'private_room',
    move_in_date: 'Immediate',
    food_preference: 'veg',
    smoking: 'never',
    drinking: 'social',
    pets: 'pet_friendly',
    sleep_habit: 'early_bird',
    work_style: 'hybrid',
    bio: user?.bio || '',
    lifestyle_tags: ['🚭 Non-Smoker', '💻 Work From Home', '🧘 Clean & Quiet'],
    photos: user?.avatar ? [user.avatar] : [SAMPLE_AVATARS[0]],
  };

  const [name, setName] = useState(profile.name || '');
  const [age, setAge] = useState((profile.age || 24).toString());
  const [profession, setProfession] = useState(profile.profession || '');
  const [company, setCompany] = useState(profile.company_or_college || '');
  const [city, setCity] = useState(profile.city || 'Mumbai');
  const [locality, setLocality] = useState(profile.locality || 'Bandra West');
  const [budgetMin, setBudgetMin] = useState((profile.budget_min || 18000).toString());
  const [budgetMax, setBudgetMax] = useState((profile.budget_max || 28000).toString());
  const [bio, setBio] = useState(profile.bio || '');
  const [foodPref, setFoodPref] = useState(profile.food_preference || 'veg');
  const [smoking, setSmoking] = useState(profile.smoking || 'never');
  const [drinking, setDrinking] = useState(profile.drinking || 'social');
  const [pets, setPets] = useState(profile.pets || 'pet_friendly');
  const [sleepHabit, setSleepHabit] = useState(profile.sleep_habit || 'early_bird');
  const [workStyle, setWorkStyle] = useState(profile.work_style || 'hybrid');
  const [selectedTags, setSelectedTags] = useState<string[]>(profile.lifestyle_tags || []);
  const [photos, setPhotos] = useState<string[]>(
    profile.photos && profile.photos.length > 0 ? profile.photos : [SAMPLE_AVATARS[0]]
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isPhotoModalVisible, setIsPhotoModalVisible] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const handlePickFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Needed',
          'Please allow photo library access to change your profile picture.'
        );
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
            setPhotos((prev) => [uploadRes.data, ...prev.slice(0, 3)]);
          } else {
            setPhotos((prev) => [localUri, ...prev.slice(0, 3)]);
          }
        } else {
          setPhotos((prev) => [localUri, ...prev.slice(0, 3)]);
        }
      }
    } catch {
      // Gallery pick error handled silently
    } finally {
      setIsUploadingPhoto(false);
      setIsPhotoModalVisible(false);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Needed',
          'Please allow camera permissions to capture your profile picture.'
        );
        return;
      }

      setIsUploadingPhoto(true);
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        const localUri = result.assets[0].uri;
        if (user?.id) {
          const uploadRes = await uploadFlatmatePhoto(user.id, localUri);
          if (uploadRes.success && uploadRes.data) {
            setPhotos((prev) => [uploadRes.data, ...prev.slice(0, 3)]);
          } else {
            setPhotos((prev) => [localUri, ...prev.slice(0, 3)]);
          }
        } else {
          setPhotos((prev) => [localUri, ...prev.slice(0, 3)]);
        }
      }
    } catch {
      // Camera take error handled silently
    } finally {
      setIsUploadingPhoto(false);
      setIsPhotoModalVisible(false);
    }
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Missing Name', 'Please enter your full name.');
      return;
    }

    setIsSaving(true);
    try {
      // 1. Upload any local file uris
      let resolvedPhotos = [...photos];
      const hasLocalFiles = photos.some((p) =>
        p.startsWith('file:') || p.startsWith('blob:') || p.startsWith('ph:') || p.startsWith('content:')
      );

      if (hasLocalFiles && user?.id) {
        const uploadRes = await uploadFlatmateGalleryPhotos(user.id, photos);
        if (uploadRes.success && uploadRes.data.length > 0) {
          resolvedPhotos = uploadRes.data;
        }
      }

      const updatedProfile = {
        ...profile,
        name: name.trim(),
        age: parseInt(age, 10) || 24,
        profession: profession.trim(),
        company_or_college: company.trim(),
        city,
        locality: locality.trim(),
        budget_min: parseInt(budgetMin, 10) || 18000,
        budget_max: parseInt(budgetMax, 10) || 28000,
        bio: bio.trim(),
        food_preference: foodPref as any,
        smoking: smoking as any,
        drinking: drinking as any,
        pets: pets as any,
        sleep_habit: sleepHabit as any,
        work_style: workStyle as any,
        lifestyle_tags: selectedTags,
        photos: resolvedPhotos,
        avatar_url: resolvedPhotos[0],
        avatar: resolvedPhotos[0],
      };

      if (myFlatmateProfile?.id) {
        await updateFlatmateProfile(myFlatmateProfile.id, updatedProfile as any, resolvedPhotos[0]);
      } else {
        await createFlatmateProfile(updatedProfile as any, resolvedPhotos[0]);
      }

      showToast('Co-living profile updated successfully! ✨', 'success');
      router.replace('/(renter)/flatmate/my-profile' as any);
    } catch (err) {
      Alert.alert('Error', 'Could not update flatmate profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={10}>
          <ArrowLeft size={20} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
        </Pressable>

        <Text style={styles.headerTitle}>Edit Flatmate Profile</Text>

        <Pressable style={styles.saveHeaderBtn} onPress={handleSave}>
          <Save size={15} color="#FFFFFF" strokeWidth={2.4} />
          <Text style={styles.saveHeaderBtnText}>Save</Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 80 },
        ]}
      >
        {/* 0. Photos Section */}
        <View style={styles.sectionCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.sectionTitle}>Profile Photos ({photos.length}/4)</Text>
            <Pressable
              style={styles.addPhotoSmallBtn}
              onPress={() => setIsPhotoModalVisible(true)}
              disabled={isUploadingPhoto || photos.length >= 4}
            >
              {isUploadingPhoto ? (
                <ActivityIndicator size="small" color="#0F766E" />
              ) : (
                <>
                  <Plus size={14} color="#0F766E" strokeWidth={2.4} />
                  <Text style={styles.addPhotoSmallBtnText}>Add Photo</Text>
                </>
              )}
            </Pressable>
          </View>

          <View style={styles.photoGrid}>
            {photos.map((uri, idx) => (
              <View key={idx} style={styles.photoBox}>
                <Image source={{ uri }} style={styles.photoImg} />
                {idx === 0 && (
                  <View style={styles.coverBadge}>
                    <Text style={styles.coverBadgeText}>Cover</Text>
                  </View>
                )}
                <Pressable
                  style={styles.photoDeleteBtn}
                  onPress={() => {
                    if (photos.length > 1) {
                      setPhotos(photos.filter((_, i) => i !== idx));
                    } else {
                      Alert.alert('Required', 'You must have at least one photo.');
                    }
                  }}
                >
                  <Trash2 size={12} color="#FFFFFF" />
                </Pressable>
              </View>
            ))}

            {photos.length < 4 && (
              <Pressable
                style={styles.addPhotoCardBox}
                onPress={() => setIsPhotoModalVisible(true)}
                disabled={isUploadingPhoto}
              >
                <Plus size={22} color="#0F766E" strokeWidth={2.4} />
                <Text style={styles.addPhotoCardText}>Upload</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* 1. Basic Info */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
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
              <Text style={styles.inputLabel}>Age</Text>
              <TextInput
                style={styles.textInput}
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                placeholder="24"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={[styles.inputGroup, { flex: 2 }]}>
              <Text style={styles.inputLabel}>Target Locality</Text>
              <TextInput
                style={styles.textInput}
                value={locality}
                onChangeText={setLocality}
                placeholder="Bandra West, Khar"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Occupation / Profession</Text>
            <TextInput
              style={styles.textInput}
              value={profession}
              onChangeText={setProfession}
              placeholder="e.g. Senior Product Designer"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Company or College</Text>
            <TextInput
              style={styles.textInput}
              value={company}
              onChangeText={setCompany}
              placeholder="e.g. Swiggy / IIT Bombay"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        {/* 2. Budget & Rent Range */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Monthly Budget Band</Text>
          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Min Budget (₹)</Text>
              <TextInput
                style={styles.textInput}
                value={budgetMin}
                onChangeText={setBudgetMin}
                keyboardType="numeric"
                placeholder="15000"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Max Budget (₹)</Text>
              <TextInput
                style={styles.textInput}
                value={budgetMax}
                onChangeText={setBudgetMax}
                keyboardType="numeric"
                placeholder="30000"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>
        </View>

        {/* 3. Lifestyle & Habits */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Lifestyle & Co-Living Habits</Text>

          {/* Food */}
          <Text style={styles.subLabel}>Dietary Preference</Text>
          <View style={styles.chipRow}>
            {['veg', 'non_veg', 'eggetarian', 'any'].map((f) => (
              <Pressable
                key={f}
                style={[styles.choiceChip, foodPref === f && styles.choiceChipActive]}
                onPress={() => setFoodPref(f as any)}
              >
                <Text style={[styles.choiceChipText, foodPref === f && styles.choiceChipTextActive]}>
                  {f === 'veg' ? '🥗 Pure Veg' : f === 'non_veg' ? '🍗 Non-Veg' : f === 'eggetarian' ? '🍳 Eggetarian' : 'Flexible'}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Smoking */}
          <Text style={styles.subLabel}>Smoking</Text>
          <View style={styles.chipRow}>
            {['never', 'outside_only', 'occasional', 'regular'].map((s) => (
              <Pressable
                key={s}
                style={[styles.choiceChip, smoking === s && styles.choiceChipActive]}
                onPress={() => setSmoking(s as any)}
              >
                <Text style={[styles.choiceChipText, smoking === s && styles.choiceChipTextActive]}>
                  {s === 'never' ? '🚭 Non-Smoker' : s === 'outside_only' ? 'Balcony Only' : 'Smoker'}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Sleep */}
          <Text style={styles.subLabel}>Sleep Schedule</Text>
          <View style={styles.chipRow}>
            {['early_bird', 'night_owl', 'flexible'].map((sl) => (
              <Pressable
                key={sl}
                style={[styles.choiceChip, sleepHabit === sl && styles.choiceChipActive]}
                onPress={() => setSleepHabit(sl as any)}
              >
                <Text style={[styles.choiceChipText, sleepHabit === sl && styles.choiceChipTextActive]}>
                  {sl === 'early_bird' ? '🌅 Early Riser' : sl === 'night_owl' ? '🌙 Night Owl' : 'Flexible'}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Work Style */}
          <Text style={styles.subLabel}>Work Style</Text>
          <View style={styles.chipRow}>
            {['wfh', 'office', 'hybrid'].map((w) => (
              <Pressable
                key={w}
                style={[styles.choiceChip, workStyle === w && styles.choiceChipActive]}
                onPress={() => setWorkStyle(w as any)}
              >
                <Text style={[styles.choiceChipText, workStyle === w && styles.choiceChipTextActive]}>
                  {w === 'wfh' ? '💻 Remote (WFH)' : w === 'office' ? '🏢 Office Daily' : 'Hybrid ⚡'}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* 4. Lifestyle Chips */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Lifestyle Tags & Vibe</Text>
          <View style={styles.chipRow}>
            {LIFESTYLE_CHIPS.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <Pressable
                  key={tag}
                  style={[styles.choiceChip, isSelected && styles.choiceChipActive]}
                  onPress={() => toggleTag(tag)}
                >
                  <Text style={[styles.choiceChipText, isSelected && styles.choiceChipTextActive]}>
                    {tag}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* 5. Bio & Story */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>About Me (Bio)</Text>
          <TextInput
            style={styles.bioInput}
            value={bio}
            onChangeText={setBio}
            placeholder="Tell future roommates about your routine, cleanliness habits, and weekends..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Save CTA */}
        <Pressable
          style={[styles.bottomSaveBtn, isSaving && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Check size={18} color="#FFFFFF" strokeWidth={3} />
          )}
          <Text style={styles.bottomSaveBtnText}>
            {isSaving ? 'Saving Updates...' : 'Save Profile Updates'}
          </Text>
        </Pressable>
      </ScrollView>

      {/* Photo Picker Modal */}
      <Modal
        visible={isPhotoModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsPhotoModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Change Profile Photo</Text>
                <Text style={styles.modalSubtitle}>
                  Choose how you want to add or change your photo
                </Text>
              </View>
              <Pressable
                style={styles.modalCloseBtn}
                onPress={() => setIsPhotoModalVisible(false)}
                hitSlop={8}
              >
                <X size={18} color="#64748B" />
              </Pressable>
            </View>

            <View style={styles.modalOptionList}>
              <Pressable style={styles.modalOptionBtn} onPress={handleTakePhoto}>
                <View style={[styles.modalOptionIconBox, { backgroundColor: '#E0F2FE' }]}>
                  <Camera size={20} color="#0284C7" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalOptionTitle}>Take Photo</Text>
                  <Text style={styles.modalOptionSub}>Use your camera for a new selfie</Text>
                </View>
              </Pressable>

              <Pressable style={styles.modalOptionBtn} onPress={handlePickFromGallery}>
                <View style={[styles.modalOptionIconBox, { backgroundColor: '#E6F4F1' }]}>
                  <ImageIcon size={20} color="#0F766E" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalOptionTitle}>Choose from Library</Text>
                  <Text style={styles.modalOptionSub}>Select from your photos & gallery</Text>
                </View>
              </Pressable>
            </View>

            {/* Curated Avatars Carousel */}
            <Text style={styles.presetSectionLabel}>Or choose a curated avatar:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
              {SAMPLE_AVATARS.map((uri, sIdx) => (
                <Pressable
                  key={sIdx}
                  style={styles.presetThumbWrap}
                  onPress={() => {
                    setPhotos((prev) => [uri, ...prev.filter((p) => p !== uri).slice(0, 3)]);
                    setIsPhotoModalVisible(false);
                  }}
                >
                  <Image source={{ uri }} style={styles.presetThumb} />
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2ECEF',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  saveHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#0F766E',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
  },
  saveHeaderBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#E2ECEF',
    ...V4_SHADOWS.card,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  addPhotoSmallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E6F4F1',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  addPhotoSmallBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  photoBox: {
    width: (SCREEN_WIDTH - 32 - 36 - 10) / 2,
    height: 130,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F1F5F9',
  },
  photoImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  coverBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#0F766E',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  coverBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  photoDeleteBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoCardBox: {
    width: (SCREEN_WIDTH - 32 - 36 - 10) / 2,
    height: 130,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#0F766E',
    borderStyle: 'dashed',
    backgroundColor: '#E6F4F1',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addPhotoCardText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F766E',
  },
  subLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  inputGroup: {
    gap: 6,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  inputLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  textInput: {
    backgroundColor: '#F8FAFB',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2ECEF',
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 13.5,
    fontWeight: '600',
    color: V4_COLORS.textPrimary,
  },
  bioInput: {
    backgroundColor: '#F8FAFB',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2ECEF',
    padding: 14,
    fontSize: 13.5,
    color: V4_COLORS.textPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  choiceChip: {
    backgroundColor: '#F8FAFB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2ECEF',
  },
  choiceChipActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  choiceChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  choiceChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  bottomSaveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0F766E',
    paddingVertical: 16,
    borderRadius: 18,
    ...V4_SHADOWS.card,
  },
  bottomSaveBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    gap: 16,
    ...V4_SHADOWS.card,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  modalSubtitle: {
    fontSize: 12.5,
    color: V4_COLORS.textSecondary,
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOptionList: {
    gap: 10,
    marginTop: 4,
  },
  modalOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#F8FAFB',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2ECEF',
  },
  modalOptionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOptionTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  modalOptionSub: {
    fontSize: 11.5,
    color: V4_COLORS.textSecondary,
    marginTop: 2,
  },
  presetSectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 6,
  },
  presetScroll: {
    flexDirection: 'row',
  },
  presetThumbWrap: {
    marginRight: 10,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E2ECEF',
  },
  presetThumb: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
});
