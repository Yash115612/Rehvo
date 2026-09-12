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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import {
  ArrowLeft,
  Camera,
  Check,
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  HeartHandshake,
  ShieldCheck,
  GraduationCap,
  Globe,
  IndianRupee,
  Calendar,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4Button } from '../ui/V4Button';
import { V4AuthGate } from '../ui/V4AuthGate';

export const V4EditProfileScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, updateProfile, isAuthenticated, showToast } = useAppStore();

  const [avatarUri, setAvatarUri] = useState(
    (user as any)?.avatar_url ||
    user?.avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  );
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [occupation, setOccupation] = useState(user?.occupation || '');
  const [city, setCity] = useState(user?.locality ? `${user.locality}, ${user.city || 'Mumbai'}` : user?.city || '');
  const [college, setCollege] = useState((user as any)?.college || '');
  const [languages, setLanguages] = useState((user as any)?.languages || 'English, Hindi');
  const [budgetMin, setBudgetMin] = useState(String(user?.budget_min || 15000));
  const [budgetMax, setBudgetMax] = useState(String(user?.budget_max || 35000));
  const [moveInDate, setMoveInDate] = useState(user?.move_in_date || 'Immediately');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [bio, setBio] = useState(user?.bio || '');
  const [isSaving, setIsSaving] = useState(false);

  const handlePickAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });
      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        setAvatarUri(result.assets[0].uri);
        showToast?.('Profile photo selected!', 'info');
      }
    } catch (e) {
      Alert.alert('Permission Required', 'Please enable camera roll permissions to change photo.');
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Missing Name', 'Please enter your full name.');
      return;
    }
    setIsSaving(true);
    updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      occupation: occupation.trim(),
      city: city.trim(),
      avatar: avatarUri,
      avatar_url: avatarUri,
      profile_photo: avatarUri,
      bio: bio.trim(),
      budget_min: parseInt(budgetMin, 10) || 15000,
      budget_max: parseInt(budgetMax, 10) || 35000,
      move_in_date: moveInDate,
      ...({ college: college.trim(), languages: languages.trim() } as any),
    });
    setIsSaving(false);
    showToast?.('✅ Profile details saved successfully!', 'success');
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.root, { paddingTop: Math.max(insets.top, 14) }]}
    >
      {/* Top Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={18} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        {isAuthenticated ? (
          <Pressable style={styles.saveHeaderBtn} onPress={handleSave} disabled={isSaving}>
            <Text style={styles.saveHeaderText}>{isSaving ? 'Saving...' : 'Save'}</Text>
          </Pressable>
        ) : (
          <View style={{ width: 38 }} />
        )}
      </View>

      {!isAuthenticated ? (
        <V4AuthGate
          icon={User}
          title="Sign in to Edit Your Profile"
          description="Sign in to update your personal details, contact information, bio, and identity verification documents."
          benefits={[
            'Personalized profile customization & bio',
            'Direct verified contact updates',
            'Government KYC & Aadhaar ID verification',
            'Tenant badges & credibility score',
          ]}
          fullScreen={false}
        />
      ) : (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
        >
        {/* Avatar Upload Banner */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: avatarUri }}
              style={styles.avatar}
            />
            <Pressable
              style={styles.cameraBtn}
              onPress={handlePickAvatar}
            >
              <Camera size={14} color="#FFFFFF" strokeWidth={2.4} />
            </Pressable>
          </View>
          <Pressable onPress={handlePickAvatar}>
            <Text style={styles.changePhotoText}>Change Profile Picture</Text>
          </Pressable>
          <View style={styles.kycVerifiedPill}>
            <ShieldCheck size={12} color="#16A34A" strokeWidth={2.5} />
            <Text style={styles.kycVerifiedText}>DigiLocker Identity Verified</Text>
          </View>
        </View>

        {/* Input Form Fields */}
        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>Full Legal Name</Text>
          <View style={styles.inputRow}>
            <User size={18} color="#64748B" strokeWidth={2} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Aarav Sharma"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <View style={styles.inputRow}>
            <Mail size={18} color="#64748B" strokeWidth={2} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="e.g. aarav@example.com"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <View style={styles.labelWithBadge}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={styles.verifiedSmallBadge}>
              <Check size={10} color="#16A34A" strokeWidth={3} />
              <Text style={styles.verifiedSmallText}>Verified</Text>
            </View>
          </View>
          <View style={styles.inputRow}>
            <Phone size={18} color="#64748B" strokeWidth={2} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="+91 98765 43210"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>Occupation & Company</Text>
          <View style={styles.inputRow}>
            <Briefcase size={18} color="#64748B" strokeWidth={2} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={occupation}
              onChangeText={setOccupation}
              placeholder="e.g. Software Engineer @ Google"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>College / University</Text>
          <View style={styles.inputRow}>
            <GraduationCap size={18} color="#64748B" strokeWidth={2} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={college}
              onChangeText={setCollege}
              placeholder="e.g. IIT Bombay / St. Xavier's"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>Languages Spoken</Text>
          <View style={styles.inputRow}>
            <Globe size={18} color="#64748B" strokeWidth={2} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={languages}
              onChangeText={setLanguages}
              placeholder="e.g. English, Hindi, Marathi"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        {/* Target Rental Budget */}
        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>Target Monthly Budget (₹)</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={[styles.inputRow, { flex: 1 }]}>
              <IndianRupee size={16} color="#64748B" strokeWidth={2} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={budgetMin}
                onChangeText={setBudgetMin}
                keyboardType="numeric"
                placeholder="Min (e.g. 15000)"
                placeholderTextColor="#94A3B8"
              />
            </View>
            <View style={[styles.inputRow, { flex: 1 }]}>
              <IndianRupee size={16} color="#64748B" strokeWidth={2} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={budgetMax}
                onChangeText={setBudgetMax}
                keyboardType="numeric"
                placeholder="Max (e.g. 35000)"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>
        </View>

        {/* Move-in Timeline */}
        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>Preferred Move-In Timeline</Text>
          <View style={styles.inputRow}>
            <Calendar size={18} color="#64748B" strokeWidth={2} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={moveInDate}
              onChangeText={setMoveInDate}
              placeholder="e.g. Immediately / Within 15 Days / Next Month"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>Preferred City / Neighborhood</Text>
          <View style={styles.inputRow}>
            <MapPin size={18} color="#64748B" strokeWidth={2} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="e.g. Bandra West, Mumbai"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>Emergency Contact</Text>
          <View style={styles.inputRow}>
            <HeartHandshake size={18} color="#64748B" strokeWidth={2} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={emergencyContact}
              onChangeText={setEmergencyContact}
              placeholder="Name & Relationship (Phone)"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>About Me / Tenant Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={bio}
            onChangeText={setBio}
            placeholder="Share a brief intro about yourself for landlords..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Save Button */}
        <V4Button
          title={isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
          variant="primary"
          size="lg"
          onPress={handleSave}
          loading={isSaving}
          style={styles.bottomSaveBtn}
        />
      </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: V4_COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E6EEF0',
    ...V4_SHADOWS.soft,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  saveHeaderBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: '#E6FFFA',
    borderRadius: 16,
  },
  saveHeaderText: {
    fontSize: 14,
    fontWeight: '800',
    color: V4_COLORS.primary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E2E8F0',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: V4_COLORS.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  changePhotoText: {
    fontSize: 13,
    fontWeight: '700',
    color: V4_COLORS.primary,
    marginBottom: 6,
  },
  kycVerifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  kycVerifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
    marginLeft: 5,
  },
  formGroup: {
    marginBottom: 18,
  },
  labelWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
    marginBottom: 7,
  },
  verifiedSmallBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 7,
  },
  verifiedSmallText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#16A34A',
    marginLeft: 3,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2ECEF',
    borderRadius: 18,
    paddingHorizontal: 14,
    height: 50,
    ...V4_SHADOWS.soft,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: V4_COLORS.textPrimary,
    fontWeight: '600',
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2ECEF',
    borderRadius: 18,
    padding: 14,
    height: 100,
    textAlignVertical: 'top',
    ...V4_SHADOWS.soft,
  },
  bottomSaveBtn: {
    marginTop: 10,
    marginBottom: 20,
  },
});
