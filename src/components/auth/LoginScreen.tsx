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
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
} from 'lucide-react-native';
import { REHVOLogo } from '../brand/REHVOLogo';

interface LoginScreenProps {
  onSuccessLogin: () => void;
  onNavigateSignUp: () => void;
  onNavigateForgotPassword: () => void;
  onSocialLogin: (provider: 'google' | 'apple') => void;
  onPhoneSendOtp: (phone: string) => Promise<boolean>;
  onEmailLogin: (email: string, pass: string) => Promise<boolean>;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onSuccessLogin,
  onNavigateSignUp,
  onNavigateForgotPassword,
  onSocialLogin,
  onPhoneSendOtp,
  onEmailLogin,
}) => {
  const insets = useSafeAreaInsets();

  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Phone submission
  const handlePhoneSubmit = async () => {
    setError(null);
    const cleaned = phone.replace(/\D/g, '');
    if (!cleaned || cleaned.length !== 10) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setIsLoading(true);
    try {
      const ok = await onPhoneSendOtp(cleaned);
      if (!ok) {
        setError('Unable to send OTP at the moment. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // Email submission
  const handleEmailSubmit = async () => {
    setError(null);
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Please enter your account password.');
      return;
    }

    setIsLoading(true);
    try {
      const ok = await onEmailLogin(cleanEmail, password);
      if (!ok) {
        setError('Invalid email or password. Please check your credentials.');
      }
    } catch {
      setError('Sign in failed. Please check your network connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialClick = async (provider: 'google' | 'apple') => {
    setError(null);
    setSocialLoading(provider);
    try {
      await onSocialLogin(provider);
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
            <Text style={styles.heading}>Welcome back</Text>
            <Text style={styles.subheading}>
              Sign in to continue finding your next place.
            </Text>
          </View>

          {/* Auth Method Switcher */}
          <View style={styles.tabContainer}>
            <Pressable
              onPress={() => {
                setAuthMethod('phone');
                setError(null);
              }}
              style={[
                styles.tabBtn,
                authMethod === 'phone' && styles.tabBtnActive,
              ]}
              accessibilityRole="tab"
              accessibilityState={{ selected: authMethod === 'phone' }}
            >
              <Phone
                size={16}
                color={authMethod === 'phone' ? '#6C4DFF' : '#777482'}
                strokeWidth={2}
              />
              <Text
                style={[
                  styles.tabBtnText,
                  authMethod === 'phone' && styles.tabBtnTextActive,
                ]}
              >
                Phone Number
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setAuthMethod('email');
                setError(null);
              }}
              style={[
                styles.tabBtn,
                authMethod === 'email' && styles.tabBtnActive,
              ]}
              accessibilityRole="tab"
              accessibilityState={{ selected: authMethod === 'email' }}
            >
              <Mail
                size={16}
                color={authMethod === 'email' ? '#6C4DFF' : '#777482'}
                strokeWidth={2}
              />
              <Text
                style={[
                  styles.tabBtnText,
                  authMethod === 'email' && styles.tabBtnTextActive,
                ]}
              >
                Email Address
              </Text>
            </Pressable>
          </View>

          {/* Error Banner */}
          {error && (
            <View style={styles.errorBox}>
              <AlertCircle size={16} color="#E5484D" strokeWidth={2} />
              <Text style={styles.errorBoxText}>{error}</Text>
            </View>
          )}

          {/* Form Inputs */}
          {authMethod === 'phone' ? (
            <View style={styles.formSection}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>MOBILE NUMBER</Text>
                <View style={styles.phoneInputRow}>
                  <View style={styles.countryCodeBox}>
                    <Text style={styles.flagText}>🇮🇳</Text>
                    <Text style={styles.countryCodeText}>+91</Text>
                  </View>
                  <TextInput
                    style={styles.phoneInput}
                    value={phone}
                    onChangeText={(val) => {
                      setPhone(val);
                      if (error) setError(null);
                    }}
                    placeholder="Enter 10-digit number"
                    placeholderTextColor="#777482"
                    keyboardType="number-pad"
                    maxLength={10}
                    autoFocus
                  />
                </View>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.primaryBtn,
                  (!phone || phone.length < 10 || isLoading) &&
                    styles.primaryBtnDisabled,
                  pressed && !isLoading && styles.primaryBtnPressed,
                ]}
                disabled={!phone || phone.length < 10 || isLoading}
                onPress={handlePhoneSubmit}
                accessibilityRole="button"
                accessibilityLabel="Continue with Phone"
              >
                {isLoading ? (
                  <View style={styles.btnLoadingRow}>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text style={styles.primaryBtnText}>Sending code...</Text>
                  </View>
                ) : (
                  <View style={styles.btnRow}>
                    <Text style={styles.primaryBtnText}>Continue</Text>
                    <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.2} />
                  </View>
                )}
              </Pressable>
            </View>
          ) : (
            <View style={styles.formSection}>
              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
                <View style={styles.textInputBox}>
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

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>PASSWORD</Text>
                <View style={styles.textInputBox}>
                  <Lock size={18} color="#777482" strokeWidth={1.9} />
                  <TextInput
                    style={styles.inputField}
                    value={password}
                    onChangeText={(val) => {
                      setPassword(val);
                      if (error) setError(null);
                    }}
                    placeholder="Enter your password"
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
              </View>

              {/* Forgot Password */}
              <Pressable
                onPress={onNavigateForgotPassword}
                style={styles.forgotBtn}
                hitSlop={6}
              >
                <Text style={styles.forgotText}>Forgot password?</Text>
              </Pressable>

              {/* Sign In CTA */}
              <Pressable
                style={({ pressed }) => [
                  styles.primaryBtn,
                  (!email || !password || isLoading) && styles.primaryBtnDisabled,
                  pressed && !isLoading && styles.primaryBtnPressed,
                ]}
                disabled={!email || !password || isLoading}
                onPress={handleEmailSubmit}
                accessibilityRole="button"
                accessibilityLabel="Sign in with Email"
              >
                {isLoading ? (
                  <View style={styles.btnLoadingRow}>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text style={styles.primaryBtnText}>Signing in...</Text>
                  </View>
                ) : (
                  <Text style={styles.primaryBtnText}>Sign in</Text>
                )}
              </Pressable>
            </View>
          )}

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

          {/* Create Account Link */}
          <View style={styles.footerRow}>
            <Text style={styles.footerPrompt}>Don't have an account?</Text>
            <Pressable
              onPress={onNavigateSignUp}
              hitSlop={6}
              accessibilityRole="button"
              accessibilityLabel="Create account"
            >
              <Text style={styles.createAccountLink}>Create account</Text>
            </Pressable>
          </View>

          {/* Legal Terms */}
          <Text style={styles.legalText}>
            By continuing, you agree to REHVO's Terms of Service & Privacy Policy.
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
    gap: 20,
  },
  topHeader: {
    alignItems: 'flex-start',
  },

  titleSection: {
    gap: 6,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 15,
    color: '#777482',
    lineHeight: 22,
    fontWeight: '400',
  },

  // Tabs
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#EAE7E1',
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 42,
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#171522',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  tabBtnText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#777482',
  },
  tabBtnTextActive: {
    color: '#171522',
    fontWeight: '700',
  },

  // Error Banner
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

  // Form Section
  formSection: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#777482',
    letterSpacing: 0.3,
  },
  phoneInputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  countryCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 52,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#171522',
  },
  textInputBox: {
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
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: -4,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6C4DFF',
  },

  // Buttons
  primaryBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#6C4DFF',
    alignItems: 'center',
    justifyContent: 'center',
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

  // Divider
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

  // Social
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

  // Footer Link
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
  createAccountLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  legalText: {
    fontSize: 11.5,
    color: '#777482',
    textAlign: 'center',
    lineHeight: 17,
    marginTop: 8,
  },
});
