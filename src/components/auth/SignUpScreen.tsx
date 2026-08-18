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
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react-native';
import { REHVOLogo } from '../brand/REHVOLogo';

interface SignUpScreenProps {
  onSuccessSignUp: () => void;
  onNavigateLogin: () => void;
  onSocialSignUp: (provider: 'google' | 'apple') => void;
  onSignUpSubmit: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string; requiresVerification?: boolean }>;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onSuccessSignUp,
  onNavigateLogin,
  onSocialSignUp,
  onSignUpSubmit,
}) => {
  const insets = useSafeAreaInsets();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Field validation error states
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    form?: string;
  }>({});

  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | null>(null);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    }

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      newErrors.email = 'Email address is required';
    } else if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      newErrors.email = 'Please enter a valid email address';
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone) {
      newErrors.phone = 'Mobile number is required';
    } else if (cleanPhone.length !== 10) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async () => {
    if (!validateForm() || isLoading) return;

    setIsLoading(true);
    setErrors({});
    try {
      const res = await onSignUpSubmit({
        name: name.trim(),
        email: email.trim(),
        phone: phone.replace(/\D/g, ''),
        password,
      });
      if (res.success) {
        onSuccessSignUp();
      } else {
        setErrors({ form: res.error || 'Unable to create account. Please try again.' });
      }
    } catch (err: any) {
      setErrors({ form: err?.message || 'Unable to create account. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialClick = async (provider: 'google' | 'apple') => {
    setSocialLoading(provider);
    try {
      await onSocialSignUp(provider);
    } finally {
      setSocialLoading(null);
    }
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
          {/* Top Brand Header */}
          <View style={styles.topHeader}>
            <REHVOLogo size="medium" />
          </View>

          {/* Heading */}
          <View style={styles.titleSection}>
            <Text style={styles.heading}>Create your REHVO account</Text>
            <Text style={styles.subheading}>
              Find your next place and keep everything in one account.
            </Text>
          </View>

          {/* Form Error Banner */}
          {errors.form && (
            <View style={styles.errorBanner}>
              <AlertCircle size={16} color="#E5484D" strokeWidth={2} />
              <Text style={styles.errorBannerText}>{errors.form}</Text>
            </View>
          )}

          {/* Input Fields */}
          <View style={styles.formSection}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>FULL NAME</Text>
              <View
                style={[
                  styles.inputBox,
                  Boolean(errors.name) && styles.inputBoxError,
                ]}
              >
                <User size={18} color="#777482" strokeWidth={1.9} />
                <TextInput
                  style={styles.inputField}
                  value={name}
                  onChangeText={(val) => {
                    setName(val);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  placeholder="e.g. Yash Choudhary"
                  placeholderTextColor="#777482"
                  autoCapitalize="words"
                />
              </View>
              {errors.name && (
                <Text style={styles.fieldErrorText}>{errors.name}</Text>
              )}
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
              <View
                style={[
                  styles.inputBox,
                  Boolean(errors.email) && styles.inputBoxError,
                ]}
              >
                <Mail size={18} color="#777482" strokeWidth={1.9} />
                <TextInput
                  style={styles.inputField}
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder="you@example.com"
                  placeholderTextColor="#777482"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {errors.email && (
                <Text style={styles.fieldErrorText}>{errors.email}</Text>
              )}
            </View>

            {/* Mobile Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>MOBILE NUMBER</Text>
              <View
                style={[
                  styles.phoneInputRow,
                  Boolean(errors.phone) && styles.inputBoxError,
                ]}
              >
                <View style={styles.countryCodeBox}>
                  <Text style={styles.flagText}>🇮🇳</Text>
                  <Text style={styles.countryCodeText}>+91</Text>
                </View>
                <TextInput
                  style={styles.phoneInput}
                  value={phone}
                  onChangeText={(val) => {
                    setPhone(val);
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                  }}
                  placeholder="10-digit number"
                  placeholderTextColor="#777482"
                  keyboardType="number-pad"
                  maxLength={10}
                />
              </View>
              {errors.phone && (
                <Text style={styles.fieldErrorText}>{errors.phone}</Text>
              )}
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>PASSWORD (MIN 8 CHARS)</Text>
              <View
                style={[
                  styles.inputBox,
                  Boolean(errors.password) && styles.inputBoxError,
                ]}
              >
                <Lock size={18} color="#777482" strokeWidth={1.9} />
                <TextInput
                  style={styles.inputField}
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  placeholder="At least 8 characters"
                  placeholderTextColor="#777482"
                  secureTextEntry={!showPassword}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={8}
                  style={styles.eyeBtn}
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff size={18} color="#777482" strokeWidth={1.9} />
                  ) : (
                    <Eye size={18} color="#777482" strokeWidth={1.9} />
                  )}
                </Pressable>
              </View>
              {errors.password && (
                <Text style={styles.fieldErrorText}>{errors.password}</Text>
              )}
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CONFIRM PASSWORD</Text>
              <View
                style={[
                  styles.inputBox,
                  Boolean(errors.confirmPassword) && styles.inputBoxError,
                ]}
              >
                <Lock size={18} color="#777482" strokeWidth={1.9} />
                <TextInput
                  style={styles.inputField}
                  value={confirmPassword}
                  onChangeText={(val) => {
                    setConfirmPassword(val);
                    if (errors.confirmPassword)
                      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                  }}
                  placeholder="Re-enter your password"
                  placeholderTextColor="#777482"
                  secureTextEntry={!showConfirmPassword}
                />
                <Pressable
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  hitSlop={8}
                  style={styles.eyeBtn}
                  accessibilityRole="button"
                  accessibilityLabel={
                    showConfirmPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} color="#777482" strokeWidth={1.9} />
                  ) : (
                    <Eye size={18} color="#777482" strokeWidth={1.9} />
                  )}
                </Pressable>
              </View>
              {errors.confirmPassword && (
                <Text style={styles.fieldErrorText}>{errors.confirmPassword}</Text>
              )}
            </View>

            {/* Create Account Button */}
            <Pressable
              style={({ pressed }) => [
                styles.primaryBtn,
                isLoading && styles.primaryBtnDisabled,
                pressed && !isLoading && styles.primaryBtnPressed,
              ]}
              disabled={isLoading}
              onPress={handleFormSubmit}
              accessibilityRole="button"
              accessibilityLabel="Create REHVO Account"
            >
              {isLoading ? (
                <View style={styles.btnLoadingRow}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.primaryBtnText}>Creating account...</Text>
                </View>
              ) : (
                <View style={styles.btnRow}>
                  <Text style={styles.primaryBtnText}>Create account</Text>
                  <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.2} />
                </View>
              )}
            </Pressable>
          </View>

          {/* Social Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Buttons */}
          <View style={styles.socialRow}>
            <Pressable
              style={styles.socialBtn}
              onPress={() => handleSocialClick('google')}
              disabled={Boolean(socialLoading)}
            >
              {socialLoading === 'google' ? (
                <ActivityIndicator size="small" color="#171522" />
              ) : (
                <>
                  <Text style={styles.socialIconG}>G</Text>
                  <Text style={styles.socialBtnText}>Google</Text>
                </>
              )}
            </Pressable>

            <Pressable
              style={styles.socialBtn}
              onPress={() => handleSocialClick('apple')}
              disabled={Boolean(socialLoading)}
            >
              {socialLoading === 'apple' ? (
                <ActivityIndicator size="small" color="#171522" />
              ) : (
                <>
                  <Text style={styles.socialIconApple}></Text>
                  <Text style={styles.socialBtnText}>Apple</Text>
                </>
              )}
            </Pressable>
          </View>

          {/* Sign In Link */}
          <View style={styles.footerRow}>
            <Text style={styles.footerPrompt}>Already have an account?</Text>
            <Pressable
              onPress={onNavigateLogin}
              hitSlop={6}
              accessibilityRole="button"
              accessibilityLabel="Sign in"
            >
              <Text style={styles.signInLink}>Sign in</Text>
            </Pressable>
          </View>

          {/* Legal Terms */}
          <Text style={styles.legalText}>
            By creating an account, you agree to REHVO's Terms of Service & Privacy Policy.
          </Text>
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
    gap: 18,
  },
  topHeader: {
    alignItems: 'flex-start',
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
  errorBanner: {
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
  errorBannerText: {
    flex: 1,
    fontSize: 13,
    color: '#E5484D',
    fontWeight: '500',
  },
  formSection: {
    gap: 14,
  },
  inputGroup: {
    gap: 5,
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
  phoneInputRow: {
    flexDirection: 'row',
    gap: 10,
    height: 52,
  },
  countryCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
  },
  flagText: {
    fontSize: 16,
  },
  countryCodeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#171522',
  },
  phoneInput: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: '600',
    color: '#171522',
  },
  eyeBtn: {
    padding: 4,
  },
  fieldErrorText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#E5484D',
    marginTop: 2,
    marginLeft: 2,
  },
  primaryBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#6C4DFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
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
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8E5EC',
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#777482',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  socialIconG: {
    fontSize: 16,
    fontWeight: '900',
    color: '#4285F4',
  },
  socialIconApple: {
    fontSize: 18,
    fontWeight: '900',
    color: '#171522',
  },
  socialBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#171522',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
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
  legalText: {
    fontSize: 11.5,
    color: '#777482',
    textAlign: 'center',
    lineHeight: 17,
    marginTop: 6,
  },
});
