import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { User, Phone, Mail, ArrowRight, ShieldCheck } from 'lucide-react-native';

interface OwnerProfileStepProps {
  name: string;
  phone: string;
  email: string;
  onChangeName: (val: string) => void;
  onChangePhone: (val: string) => void;
  onChangeEmail: (val: string) => void;
  onContinue: () => void;
}

export const OwnerProfileStep: React.FC<OwnerProfileStepProps> = ({
  name,
  phone,
  email,
  onChangeName,
  onChangePhone,
  onChangeEmail,
  onContinue,
}) => {
  const isValid = name.trim().length > 1 && phone.trim().length >= 10;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <View style={styles.titleGroup}>
          <Text style={styles.heading}>Owner contact details</Text>
          <Text style={styles.subheading}>
            Renters will see this name and verified badge on your listings.
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* 1. Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name / Business Name *</Text>
            <View style={styles.inputBox}>
              <User size={18} color="#777482" strokeWidth={2} />
              <TextInput
                value={name}
                onChangeText={onChangeName}
                placeholder="e.g. Yash Choudhary"
                placeholderTextColor="#8C8994"
                style={styles.input}
              />
            </View>
          </View>

          {/* 2. Phone Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number *</Text>
            <View style={styles.inputBox}>
              <Phone size={18} color="#777482" strokeWidth={2} />
              <TextInput
                value={phone}
                onChangeText={onChangePhone}
                placeholder="+91 98765 43210"
                placeholderTextColor="#8C8994"
                keyboardType="phone-pad"
                style={styles.input}
              />
            </View>
          </View>

          {/* 3. Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputBox}>
              <Mail size={18} color="#777482" strokeWidth={2} />
              <TextInput
                value={email}
                onChangeText={onChangeEmail}
                placeholder="owner@example.com"
                placeholderTextColor="#8C8994"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>
          </View>

          {/* Safety Notice */}
          <View style={styles.trustCard}>
            <ShieldCheck size={16} color="#32B768" strokeWidth={2.2} />
            <Text style={styles.trustText}>
              Your contact details are encrypted and only shared with renters
              when you approve their enquiry or visit request.
            </Text>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Pressable
            style={[styles.continueBtn, !isValid && styles.continueBtnDisabled]}
            onPress={onContinue}
            disabled={!isValid}
            accessibilityRole="button"
            accessibilityLabel="Continue to verification"
          >
            <Text style={styles.continueBtnText}>Continue</Text>
            {isValid && (
              <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.2} />
            )}
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  titleGroup: {
    paddingVertical: 12,
    gap: 6,
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
  scrollContent: {
    paddingVertical: 8,
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#171522',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
    paddingHorizontal: 14,
    height: 52,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14.5,
    color: '#171522',
    fontWeight: '600',
    padding: 0,
  },
  trustCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FAF9FF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#DED6FD',
  },
  trustText: {
    flex: 1,
    fontSize: 12,
    color: '#777482',
    lineHeight: 17,
    fontWeight: '500',
  },
  footer: {
    paddingVertical: 12,
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
});
