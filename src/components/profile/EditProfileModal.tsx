import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X, Check } from 'lucide-react-native';
import { ProfileAvatarEditor } from './ProfileAvatarEditor';
import { UserProfile, UserType } from '../../types';

interface EditProfileModalProps {
  visible: boolean;
  user: UserProfile | null;
  onClose: () => void;
  onSave: (data: Partial<UserProfile>) => void;
}

const USER_TYPES: { id: UserType; label: string }[] = [
  { id: 'working_professional', label: 'Working Professional' },
  { id: 'student', label: 'Student' },
  { id: 'family', label: 'Family' },
  { id: 'other', label: 'Other' },
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  user,
  onClose,
  onSave,
}) => {
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [city, setCity] = useState(user?.city || 'Mumbai');
  const [locality, setLocality] = useState(user?.locality || '');
  const [occupation, setOccupation] = useState(user?.occupation || '');
  const [userType, setUserType] = useState<UserType>(
    user?.user_type || 'working_professional',
  );

  const handleSave = () => {
    onSave({
      avatar: avatar || undefined,
      name: name.trim() || user?.name,
      phone: phone.trim() || user?.phone,
      email: email.trim() || user?.email,
      city: city.trim() || 'Mumbai',
      locality: locality.trim() || user?.locality,
      occupation: occupation.trim() || user?.occupation,
      user_type: userType,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheetContainer}
        >
          <View style={styles.sheet}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Edit Profile</Text>
              <Pressable
                onPress={onClose}
                hitSlop={8}
                style={styles.closeBtn}
                accessibilityRole="button"
                accessibilityLabel="Close"
              >
                <X size={20} color="#171522" strokeWidth={2} />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.body}
            >
              {/* Profile Photo Header */}
              <View style={styles.avatarSection}>
                <ProfileAvatarEditor
                  uri={avatar}
                  name={name}
                  size={80}
                  editable={true}
                  onAvatarChange={(newUri) => setAvatar(newUri || '')}
                />
                <Text style={styles.avatarHint}>Tap avatar to change photo</Text>
              </View>

              {/* Full Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Your full name"
                  placeholderTextColor="#777482"
                />
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your.email@example.com"
                  placeholderTextColor="#777482"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Phone */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+91 98765 43210"
                  placeholderTextColor="#777482"
                  keyboardType="phone-pad"
                />
              </View>

              {/* Occupation */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Occupation / Work</Text>
                <TextInput
                  style={styles.input}
                  value={occupation}
                  onChangeText={setOccupation}
                  placeholder="e.g. Product Designer at Tech Co"
                  placeholderTextColor="#777482"
                />
              </View>

              {/* City & Locality */}
              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>City</Text>
                  <TextInput
                    style={styles.input}
                    value={city}
                    onChangeText={setCity}
                    placeholder="City"
                    placeholderTextColor="#777482"
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1.4 }]}>
                  <Text style={styles.label}>Current Locality</Text>
                  <TextInput
                    style={styles.input}
                    value={locality}
                    onChangeText={setLocality}
                    placeholder="e.g. Andheri West"
                    placeholderTextColor="#777482"
                  />
                </View>
              </View>

              {/* User Type Selection */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>I am a</Text>
                <View style={styles.pillRow}>
                  {USER_TYPES.map((t) => {
                    const active = userType === t.id;
                    return (
                      <Pressable
                        key={t.id}
                        onPress={() => setUserType(t.id)}
                        style={[
                          styles.typePill,
                          active && styles.typePillActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.typePillText,
                            active && styles.typePillTextActive,
                          ]}
                        >
                          {t.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </ScrollView>

            {/* Footer Actions */}
            <View style={styles.footer}>
              <Pressable
                onPress={onClose}
                style={styles.cancelBtn}
                accessibilityRole="button"
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleSave}
                style={styles.saveBtn}
                accessibilityRole="button"
              >
                <Check size={18} color="#FFFFFF" strokeWidth={2.2} />
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(23, 21, 34, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    maxHeight: '90%',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    maxHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EEE9',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#171522',
    letterSpacing: -0.2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8F7F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 14,
  },
  avatarSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  avatarHint: {
    fontSize: 12,
    fontWeight: '600',
    color: '#777482',
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#171522',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#171522',
    backgroundColor: '#FBFBFA',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 2,
  },
  typePill: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    backgroundColor: '#FFFFFF',
  },
  typePillActive: {
    borderColor: '#6C4DFF',
    backgroundColor: '#F0ECFF',
  },
  typePillText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#777482',
  },
  typePillTextActive: {
    color: '#6C4DFF',
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0EEE9',
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#777482',
  },
  saveBtn: {
    flex: 1.5,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#6C4DFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
