import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Mail,
  AlertCircle,
  CheckCircle2,
  Inbox,
  ArrowRight,
} from 'lucide-react-native';

interface ForgotPasswordScreenProps {
  onBack: () => void;
  onNavigateLogin: () => void;
  onSendResetLink: (email: string) => Promise<boolean>;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  onBack,
  onNavigateLogin,
  onSendResetLink,
}) => {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const ok = await onSendResetLink(cleanEmail);
      if (ok) {
        setIsSuccess(true);
      } else {
        setError('Unable to send reset link. Please check your email.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to send reset link.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEmailApp = () => {
    Linking.openURL('message:').catch(() => {
      Linking.openURL('mailto:');
    });
  };

  const handleResend = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await onSendResetLink(email.trim());
    } finally {
      setIsLoading(false);
    }
  };

  const maskEmail = (val: string) => {
    const parts = val.split('@');
    if (parts.length !== 2) return val;
    const name = parts[0];
    const domain = parts[1];
    if (name.length <= 2) return `${name}***@${domain}`;
    return `${name.slice(0, 2)}***${name.slice(-1)}@${domain}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 20) + 16 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Bar with Back Arrow */}
          <Pressable
            onPress={onBack}
            hitSlop={10}
            style={styles.backBtn}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={22} color="#171522" strokeWidth={2} />
          </Pressable>

          {isSuccess ? (
            /* Success View */
            <View style={styles.successContainer}>
              <View style={styles.successIconCircle}>
                <Inbox size={32} color="#6C4DFF" strokeWidth={1.8} />
              </View>

              <View style={styles.successTextWrap}>
                <Text style={styles.heading}>Check your email</Text>
                <Text style={styles.subheading}>
                  We sent a password reset link to{' '}
                  <Text style={styles.highlightText}>{maskEmail(email)}</Text>.
                  Follow the link to create a new password.
                </Text>
              </View>

              <View style={styles.successActions}>
                <Pressable
                  style={styles.primaryBtn}
                  onPress={handleOpenEmailApp}
                  accessibilityRole="button"
                  accessibilityLabel="Open email application"
                >
                  <Text style={styles.primaryBtnText}>Open email</Text>
                </Pressable>

                <Pressable
                  style={styles.secondaryBtn}
                  onPress={onNavigateLogin}
                  accessibilityRole="button"
                  accessibilityLabel="Back to sign in"
                >
                  <Text style={styles.secondaryBtnText}>Back to sign in</Text>
                </Pressable>

                <View style={styles.resendWrap}>
                  <Text style={styles.resendPrompt}>Didn't receive the email?</Text>
                  <Pressable
                    onPress={handleResend}
                    disabled={isLoading}
                    hitSlop={6}
                    accessibilityRole="button"
                  >
                    <Text style={styles.resendLink}>
                      {isLoading ? 'Sending...' : 'Resend email'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ) : (
            /* Form View */
            <View style={styles.formContainer}>
              <View style={styles.titleSection}>
                <Text style={styles.heading}>Forgot your password?</Text>
                <Text style={styles.subheading}>
                  Enter your email and we'll send you a secure reset link.
                </Text>
              </View>

              {/* Error Box */}
              {error && (
                <View style={styles.errorBox}>
                  <AlertCircle size={16} color="#E5484D" strokeWidth={2} />
                  <Text style={styles.errorBoxText}>{error}</Text>
                </View>
              )}

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
                <View
                  style={[
                    styles.inputBox,
                    Boolean(error) && styles.inputBoxError,
                  ]}
                >
                  <Mail size={18} color="#777482" strokeWidth={1.9} />
                  <TextInput
                    style={styles.inputField}
                    value={email}
                    onChangeText={(val) => {
                      setEmail(val);
                      if (error) setError(null);
                    }}
                    placeholder="you@example.com"
                    placeholderTextColor="#777482"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoFocus
                  />
                </View>
              </View>

              {/* Primary CTA */}
              <Pressable
                style={({ pressed }) => [
                  styles.primaryBtn,
                  (!email || isLoading) && styles.primaryBtnDisabled,
                  pressed && !isLoading && styles.primaryBtnPressed,
                ]}
                disabled={!email || isLoading}
                onPress={handleSubmit}
                accessibilityRole="button"
                accessibilityLabel="Send reset link"
              >
                {isLoading ? (
                  <View style={styles.btnLoadingRow}>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text style={styles.primaryBtnText}>Sending reset link...</Text>
                  </View>
                ) : (
                  <View style={styles.btnRow}>
                    <Text style={styles.primaryBtnText}>Send reset link</Text>
                    <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.2} />
                  </View>
                )}
              </Pressable>

              {/* Back to Sign In Link */}
              <View style={styles.footerRow}>
                <Text style={styles.footerPrompt}>Remember your password?</Text>
                <Pressable
                  onPress={onNavigateLogin}
                  hitSlop={6}
                  accessibilityRole="button"
                  accessibilityLabel="Back to sign in"
                >
                  <Text style={styles.signInLink}>Sign in</Text>
                </Pressable>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7F4',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    flexGrow: 1,
    gap: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
  },
  formContainer: {
    gap: 20,
  },
  titleSection: {
    gap: 6,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.4,
  },
  subheading: {
    fontSize: 14.5,
    color: '#777482',
    lineHeight: 21,
    fontWeight: '400',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FCD8D8',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  errorBoxText: {
    flex: 1,
    fontSize: 13,
    color: '#E5484D',
    fontWeight: '500',
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#777482',
    letterSpacing: 0.3,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    paddingHorizontal: 14,
    gap: 10,
  },
  inputBoxError: {
    borderColor: '#E5484D',
    backgroundColor: '#FFF8F8',
  },
  inputField: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#171522',
    paddingVertical: 0,
  },
  primaryBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#6C4DFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#6C4DFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.22,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  primaryBtnDisabled: {
    opacity: 0.55,
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryBtnPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btnLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
  },
  footerPrompt: {
    fontSize: 14,
    color: '#777482',
  },
  signInLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6C4DFF',
  },

  // Success View Styles
  successContainer: {
    alignItems: 'center',
    gap: 22,
    paddingTop: 20,
  },
  successIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#F0ECFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTextWrap: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
  },
  highlightText: {
    fontWeight: '700',
    color: '#171522',
  },
  successActions: {
    width: '100%',
    gap: 12,
    marginTop: 8,
  },
  secondaryBtn: {
    height: 50,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#171522',
  },
  resendWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 6,
  },
  resendPrompt: {
    fontSize: 13,
    color: '#777482',
  },
  resendLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6C4DFF',
  },
});
