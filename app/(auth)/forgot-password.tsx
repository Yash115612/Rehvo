import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Mail, ShieldCheck, CheckCircle2 } from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../src/theme/v4Theme';
import { V4Button } from '../../src/components/v4/ui/V4Button';
import { resetPassword } from '../../src/services/auth';
import { useAppStore } from '../../src/store/useAppStore';

export default function ForgotPasswordRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useAppStore();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    const clean = email.trim().toLowerCase();
    if (!clean || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword(clean);
      if (res.success) {
        setSubmitted(true);
        showToast('Password reset email sent!', 'success');
      } else {
        showToast(res.error || 'Failed to send reset link.', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to send reset link.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.badgeWrap}>
          <ShieldCheck size={14} color="#0F766E" />
          <Text style={styles.badgeText}>ACCOUNT RECOVERY</Text>
        </View>

        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          Enter your registered email address and we will send you a secure verification link to reset your password.
        </Text>

        {submitted ? (
          <View style={styles.successCard}>
            <CheckCircle2 size={32} color="#16A34A" />
            <Text style={styles.successTitle}>Check Your Email</Text>
            <Text style={styles.successDesc}>
              We sent password reset instructions to {email}. Tap the link in your email to choose a new password.
            </Text>
            <V4Button
              label="Back to Sign In"
              onPress={() => router.replace('/(auth)/login')}
              style={{ width: '100%', marginTop: 16 }}
            />
          </View>
        ) : (
          <View style={styles.formCard}>
            <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
            <View style={styles.inputBox}>
              <Mail size={18} color="#94A3B8" />
              <TextInput
                style={styles.input}
                placeholder="name@example.com"
                placeholderTextColor="#94A3B8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <V4Button
              label={loading ? 'Sending Link...' : 'Send Recovery Link'}
              onPress={handleSubmit}
              loading={loading}
              style={{ marginTop: 20 }}
            />

            <Pressable style={styles.cancelBtn} onPress={() => router.replace('/(auth)/login')}>
              <Text style={styles.cancelText}>Remember your password? <Text style={styles.linkText}>Sign In</Text></Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFB',
  },
  header: {
    height: 52,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5EEF0',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  badgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F766E',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 22,
    marginBottom: 28,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5EEF0',
    ...V4_SHADOWS.sm,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFB',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5EEF0',
    paddingHorizontal: 14,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: V4_COLORS.textPrimary,
  },
  cancelBtn: {
    marginTop: 18,
    alignItems: 'center',
    paddingVertical: 8,
  },
  cancelText: {
    fontSize: 13,
    color: '#64748B',
  },
  linkText: {
    color: '#0F766E',
    fontWeight: '700',
  },
  successCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    ...V4_SHADOWS.sm,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    marginTop: 14,
    marginBottom: 8,
  },
  successDesc: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 21,
  },
});
