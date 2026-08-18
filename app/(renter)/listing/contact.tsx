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
  User,
  Phone,
  Mail,
  ShieldCheck,
  ArrowRight,
  Eye,
} from 'lucide-react-native';
import { useAppStore } from '../../../src/store/useAppStore';
import { ListingHeader } from '../../../src/components/listing/ListingHeader';
import { ListingExitModal } from '../../../src/components/listing/ListingExitModal';

export default function ListingContactRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { user, listingDraft, updateListingDraft, resetListingDraft, showToast } =
    useAppStore();

  const [contactName, setContactName] = useState(
    user?.name || 'Rohan Mehta',
  );
  const [contactPhone, setContactPhone] = useState(
    user?.phone || '+91 98201 45678',
  );
  const [contactEmail, setContactEmail] = useState(
    user?.email || 'rohan.mehta@rehvo.com',
  );
  const [errorMsg, setErrorMsg] = useState('');
  const [exitModalVisible, setExitModalVisible] = useState(false);

  const handleContinue = () => {
    if (contactName.trim().length < 2) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (contactPhone.trim().length < 8) {
      setErrorMsg('Please enter a valid phone number');
      return;
    }

    router.push('/(renter)/listing/preview');
  };

  const handleSaveDraft = () => {
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
        currentStep={10}
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
            <Text style={styles.titleText}>Contact information</Text>
            <Text style={styles.subtitle}>
              How verified renters and tenant enquiries will reach you.
            </Text>
          </View>

          {/* Full Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Your Full Name *</Text>
            <View style={styles.inputWrap}>
              <User size={18} color="#777482" strokeWidth={2} />
              <TextInput
                value={contactName}
                onChangeText={(t) => {
                  setContactName(t);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Full Name"
                placeholderTextColor="#8C8994"
                style={styles.textInput}
              />
            </View>
          </View>

          {/* Phone Number */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Contact Phone Number *</Text>
            <View style={styles.inputWrap}>
              <Phone size={18} color="#777482" strokeWidth={2} />
              <TextInput
                value={contactPhone}
                onChangeText={(t) => {
                  setContactPhone(t);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="+91 98000 00000"
                placeholderTextColor="#8C8994"
                keyboardType="phone-pad"
                style={styles.textInput}
              />
            </View>
          </View>

          {/* Email Address */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Email Address</Text>
            <View style={styles.inputWrap}>
              <Mail size={18} color="#777482" strokeWidth={2} />
              <TextInput
                value={contactEmail}
                onChangeText={setContactEmail}
                placeholder="name@email.com"
                placeholderTextColor="#8C8994"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.textInput}
              />
            </View>
          </View>

          {Boolean(errorMsg) && (
            <Text style={styles.errorText}>{errorMsg}</Text>
          )}

          {/* Privacy Note Card */}
          <View style={styles.privacyCard}>
            <ShieldCheck size={22} color="#32B768" strokeWidth={2.2} />
            <View style={{ flex: 1 }}>
              <Text style={styles.privacyCardTitle}>Verified Contact Privacy</Text>
              <Text style={styles.privacyCardSub}>
                Your contact details are encrypted and shared only when you approve a visit request or initiate a chat on REHVO.
              </Text>
            </View>
          </View>
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
          accessibilityLabel="Preview property listing"
        >
          <Eye size={18} color="#FFFFFF" strokeWidth={2.2} />
          <Text style={styles.continueBtnText}>Preview Listing</Text>
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
    gap: 16,
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
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#171522',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
    paddingHorizontal: 14,
    gap: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '600',
    color: '#171522',
  },
  errorText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#E5484D',
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#EAF8F0',
    borderWidth: 1,
    borderColor: '#C6EED5',
    borderRadius: 16,
    padding: 16,
    marginTop: 4,
  },
  privacyCardTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#171522',
  },
  privacyCardSub: {
    fontSize: 12.5,
    color: '#4B5563',
    fontWeight: '500',
    lineHeight: 18,
    marginTop: 2,
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
