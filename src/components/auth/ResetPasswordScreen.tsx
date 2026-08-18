import React, { useState, useMemo } from 'react';
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
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react-native';

interface ResetPasswordScreenProps {
  onBack: () => void;
  onNavigateLogin: () => void;
  onUpdatePassword: (password: string) => Promise<boolean>;
}

export const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({
  onBack,
  onNavigateLogin,
  onUpdatePassword,
}) => {
  const insets = useSafeAreaInsets();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
    form?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Password strength calculation
  const strength = useMemo(() => {
    if (!password) return { label: '', score: 0, color: '#E8E5EC' };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) || /[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password) && password.length >= 10) score += 1;

    if (score === 1) return { label: 'Weak', score: 1, color: '#E5484D' };
    if (score === 2) return { label: 'Medium', score: 2, color: '#F59E0B' };
    return { label: 'Strong', score: 3, color: '#32B768' };
  }, [password]);

  const handleSubmit = async () => {
    const newErrors: typeof errors = {};

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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    try {
      const ok = await onUpdatePassword(password);
      if (ok) {
        setIsSuccess(true);
      } else {
        setErrors({ form: 'Unable to update password. Please try again.' });
      }
    } catch (err: any) {
      setErrors({ form: err?.message || 'Password update failed.' });
    } finally {
      setIsLoading(false);
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
                <CheckCircle2 size={36} color="#32B768" strokeWidth={2} />
              </View>

              <View style={styles.successTextWrap}>
                <Text style={styles.heading}>Password updated</Text>
                <Text style={styles.subheading}>
                  Your password has been successfully reset. You can now sign in with your new password.
                </Text>
              </View>

              <Pressable
                style={styles.primaryBtn}
                onPress={onNavigateLogin}
                accessibilityRole="button"
                accessibilityLabel="Sign in"
              >
                <Text style={styles.primaryBtnText}>Sign in</Text>
              </Pressable>
            </View>
          ) : (
            /* Form View */
            <View style={styles.formContainer}>
              <View style={styles.titleSection}>
                <Text style={styles.heading}>Create a new password</Text>
                <Text style={styles.subheading}>
                  Choose a strong password for your REHVO account.
                </Text>
              </View>

              {/* Form Error */}
              {errors.form && (
                <View style={styles.errorBox}>
                  <AlertCircle size={16} color="#E5484D" strokeWidth={2} />
                  <Text style={styles.errorBoxText}>{errors.form}</Text>
                </View>
              )}

              {/* New Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>NEW PASSWORD</Text>
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
                      if (errors.password)
                        setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    placeholder="At least 8 characters"
                    placeholderTextColor="#777482"
                    secureTextEntry={!showPassword}
                    autoFocus
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

                {/* Password Strength Bars */}
                {password.length > 0 && (
                  <View style={styles.strengthRow}>
                    <View style={styles.strengthBars}>
                      <View
                        style={[
                          styles.strengthBar,
                          {
                            backgroundColor:
                              strength.score >= 1 ? strength.color : '#E8E5EC',
                          },
                        ]}
                      />
                      <View
                        style={[
                          styles.strengthBar,
                          {
                            backgroundColor:
                              strength.score >= 2 ? strength.color : '#E8E5EC',
                          },
                        ]}
                      />
                      <View
                        style={[
                          styles.strengthBar,
                          {
                            backgroundColor:
                              strength.score >= 3 ? strength.color : '#E8E5EC',
                          },
                        ]}
                      />
                    </View>
                    <Text style={[styles.strengthLabel, { color: strength.color }]}>
                      {strength.label}
                    </Text>
                  </View>
                )}
              </View>

              {/* Confirm Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>CONFIRM NEW PASSWORD</Text>
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
                        setErrors((prev) => ({
                          ...prev,
                          confirmPassword: undefined,
                        }));
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

              {/* Submit CTA */}
              <Pressable
                style={({ pressed }) => [
                  styles.primaryBtn,
                  (!password || !confirmPassword || isLoading) &&
                    styles.primaryBtnDisabled,
                  pressed && !isLoading && styles.primaryBtnPressed,
                ]}
                disabled={!password || !confirmPassword || isLoading}
                onPress={handleSubmit}
                accessibilityRole="button"
                accessibilityLabel="Update password"
              >
                {isLoading ? (
                  <View style={styles.btnLoadingRow}>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text style={styles.primaryBtnText}>Updating password...</Text>
                  </View>
                ) : (
                  <View style={styles.btnRow}>
                    <Text style={styles.primaryBtnText}>Update password</Text>
                    <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.2} />
                  </View>
                )}
              </Pressable>
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
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  strengthBars: {
    flex: 1,
    flexDirection: 'row',
    gap: 4,
    height: 4,
  },
  strengthBar: {
    flex: 1,
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: '700',
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
  successContainer: {
    alignItems: 'center',
    gap: 22,
    paddingTop: 24,
  },
  successIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#EAF8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTextWrap: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
  },
});
