import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Phone,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  Building2,
  KeyRound,
  Briefcase,
  MapPin,
  Compass,
} from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4Button } from '../ui/V4Button';
import { V4BrandLogo } from '../ui/V4BrandLogo';
import * as authService from '../../../services/auth';
import { useAppStore } from '../../../store/useAppStore';

export interface V4LoginScreenProps {
  initialMode?: 'signin' | 'signup';
  initialRole?: 'renter' | 'owner' | 'broker';
}

export const V4LoginScreen: React.FC<V4LoginScreenProps> = ({
  initialMode = 'signin',
  initialRole,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast, pendingAuthRole, switchMode } = useAppStore();

  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode]);

  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'renter' | 'owner' | 'broker'>(
    initialRole || pendingAuthRole || 'renter'
  );

  useEffect(() => {
    if (initialRole) {
      setSelectedRole(initialRole);
    } else if (pendingAuthRole) {
      setSelectedRole(pendingAuthRole);
    }
  }, [initialRole, pendingAuthRole]);

  // Broker specific fields
  const [agencyName, setAgencyName] = useState('');
  const [operatingCity, setOperatingCity] = useState('Mumbai');
  const [reraNumber, setReraNumber] = useState('');
  const [officeAddress, setOfficeAddress] = useState('');

  // UI State
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Forgot Password Modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  // Validation
  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  const isValidPhone = (val: string) => val.replace(/\D/g, '').length === 10;

  // Helper to route user to correct role ecosystem
  const navigateToRoleDestination = (role?: string) => {
    const raw = (role || selectedRole || useAppStore.getState().activeMode || 'renter').toLowerCase();
    if (raw.includes('broker')) {
      router.replace('/(broker)/dashboard' as any);
    } else if (raw.includes('owner') || raw.includes('lister')) {
      router.replace('/(owner)/dashboard' as any);
    } else {
      router.replace('/(renter)/home' as any);
    }
  };

  // Handle Email/Password Sign In
  const handleEmailSignIn = async () => {
    setErrorMessage(null);
    setSuccessNotice(null);

    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Please enter your password (minimum 6 characters).');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.signInWithEmail(email, password);
      if (!result.success) {
        setErrorMessage(result.error || 'Invalid email or password.');
      } else {
        showToast('Signed in successfully!', 'success');
        const userRole = (useAppStore.getState().user?.role || selectedRole) as string;
        const normalizedRole = userRole?.toLowerCase().includes('broker')
          ? 'broker'
          : userRole?.toLowerCase().includes('owner')
          ? 'owner'
          : 'renter';
        await switchMode(normalizedRole);
        navigateToRoleDestination(normalizedRole);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Email/Password Sign Up
  const handleEmailSignUp = async () => {
    setErrorMessage(null);
    setSuccessNotice(null);

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!isValidPhone(phone)) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!password || password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (selectedRole === 'broker' && !agencyName.trim()) {
      setErrorMessage('Please enter your Real Estate Agency / Company name.');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.signUpWithEmail({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
        role: selectedRole,
        agencyName: selectedRole === 'broker' ? agencyName.trim() : undefined,
        reraNumber: selectedRole === 'broker' ? reraNumber.trim() : undefined,
        officeAddress: selectedRole === 'broker' ? officeAddress.trim() : undefined,
      });

      if (!result.success) {
        setErrorMessage(result.error || 'Sign up failed. Please try again.');
      } else {
        if (result.requiresEmailConfirmation) {
          setSuccessNotice(
            `Account created! A confirmation link has been sent to ${email}. Please verify your email before logging in.`
          );
          setMode('signin');
        } else {
          showToast(`Welcome to REHVO, ${name}!`, 'success');
          await switchMode(selectedRole);
          navigateToRoleDestination(selectedRole);
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Phone OTP Request
  const handlePhoneOtpRequest = async () => {
    setErrorMessage(null);
    setSuccessNotice(null);

    if (!isValidPhone(phone)) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.signInWithPhone(phone);
      if (!result.success) {
        setErrorMessage(result.error || 'Failed to send OTP. Please try again.');
      } else {
        router.push({
          pathname: '/(auth)/otp' as any,
          params: { phone: phone.trim() },
        });
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setGoogleLoading(true);
    try {
      const result = await authService.signInWithGoogle();
      if (!result.success) {
        if (result.error && !result.error.includes('cancelled')) {
          setErrorMessage(result.error);
        }
      } else {
        showToast('Signed in with Google!', 'success');
        const userRole = (useAppStore.getState().user?.role || selectedRole) as string;
        const normalizedRole = userRole?.toLowerCase().includes('broker')
          ? 'broker'
          : userRole?.toLowerCase().includes('owner')
          ? 'owner'
          : 'renter';
        await switchMode(normalizedRole);
        navigateToRoleDestination(normalizedRole);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Google sign-in failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // Handle Password Reset
  const handleSendPasswordReset = async () => {
    if (!isValidEmail(forgotEmail)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await authService.resetPassword(forgotEmail);
      if (res.success) {
        setShowForgotModal(false);
        setForgotEmail('');
        Alert.alert(
          'Reset Link Sent',
          `We have sent password reset instructions to ${forgotEmail}. Please check your inbox.`
        );
      } else {
        Alert.alert('Error', res.error || 'Could not send reset email. Please try again.');
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Something went wrong.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: Math.max(insets.top, 20) + 8, paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top Logo Header */}
        <View style={styles.topRow}>
          <V4BrandLogo variant="horizontal" size="md" />
        </View>

        {/* Mode Switcher Tabs (Sign In vs Create Account) */}
        <View style={styles.tabContainer}>
          <Pressable
            style={[styles.tabBtn, mode === 'signin' && styles.tabBtnActive]}
            onPress={() => {
              setMode('signin');
              setErrorMessage(null);
            }}
          >
            <Text style={[styles.tabBtnText, mode === 'signin' && styles.tabBtnTextActive]}>
              Sign In
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tabBtn, mode === 'signup' && styles.tabBtnActive]}
            onPress={() => {
              setMode('signup');
              setErrorMessage(null);
            }}
          >
            <Text style={[styles.tabBtnText, mode === 'signup' && styles.tabBtnTextActive]}>
              Create Account
            </Text>
          </Pressable>
        </View>

        {/* Header Title Block */}
        <View style={styles.headerBlock}>
          <View style={styles.badgePill}>
            <Sparkles size={11} color="#059669" />
            <Text style={styles.badgeText}>
              {mode === 'signin' ? 'REAL VERIFIED COMMUNITY' : 'JOIN REHVO TODAY'}
            </Text>
          </View>
          <Text style={styles.heading}>
            {mode === 'signin' ? 'Welcome back to REHVO' : 'Create your verified account'}
          </Text>
          <Text style={styles.subtitle}>
            {mode === 'signin'
              ? 'Sign in to access verified verified listing flats, roommates & chat.'
              : 'Direct owner contact, verified flatmates & verified marketplace across Mumbai.'}
          </Text>
        </View>

        {/* Error Alert Banner */}
        {errorMessage && (
          <View style={styles.errorBanner}>
            <AlertCircle size={18} color="#DC2626" />
            <Text style={styles.errorText}>{errorMessage}</Text>
            <Pressable onPress={() => setErrorMessage(null)} hitSlop={8}>
              <X size={16} color="#DC2626" />
            </Pressable>
          </View>
        )}

        {/* Success Notice Banner */}
        {successNotice && (
          <View style={styles.successBanner}>
            <CheckCircle2 size={18} color="#16A34A" />
            <Text style={styles.successText}>{successNotice}</Text>
            <Pressable onPress={() => setSuccessNotice(null)} hitSlop={8}>
              <X size={16} color="#16A34A" />
            </Pressable>
          </View>
        )}

        {/* ============================================================= */}
        {/* SIGN IN FORM */}
        {/* ============================================================= */}
        {mode === 'signin' && (
          <View style={styles.formContainer}>
            {/* Sub-toggle: Email vs Phone */}
            <View style={styles.methodToggleRow}>
              <Pressable
                style={[
                  styles.methodPill,
                  authMethod === 'email' && styles.methodPillActive,
                ]}
                onPress={() => setAuthMethod('email')}
              >
                <Mail size={14} color={authMethod === 'email' ? '#059669' : '#64748B'} />
                <Text
                  style={[
                    styles.methodPillText,
                    authMethod === 'email' && styles.methodPillTextActive,
                  ]}
                >
                  Email & Password
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.methodPill,
                  authMethod === 'phone' && styles.methodPillActive,
                ]}
                onPress={() => setAuthMethod('phone')}
              >
                <Phone size={14} color={authMethod === 'phone' ? '#059669' : '#64748B'} />
                <Text
                  style={[
                    styles.methodPillText,
                    authMethod === 'phone' && styles.methodPillTextActive,
                  ]}
                >
                  Phone OTP
                </Text>
              </Pressable>
            </View>

            {authMethod === 'email' ? (
              <>
                {/* Email Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <View style={styles.inputRow}>
                    <Mail size={18} color="#94A3B8" />
                    <TextInput
                      placeholder="name@example.com"
                      placeholderTextColor={V4_COLORS.textMuted}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      style={styles.textInput}
                    />
                  </View>
                </View>

                {/* Password Input */}
                <View style={styles.inputGroup}>
                  <View style={styles.passwordLabelRow}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <Pressable onPress={() => setShowForgotModal(true)}>
                      <Text style={styles.forgotPassText}>Forgot?</Text>
                    </Pressable>
                  </View>
                  <View style={styles.inputRow}>
                    <Lock size={18} color="#94A3B8" />
                    <TextInput
                      placeholder="Enter your password"
                      placeholderTextColor={V4_COLORS.textMuted}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      style={styles.textInput}
                    />
                    <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
                      {showPassword ? (
                        <EyeOff size={18} color="#94A3B8" />
                      ) : (
                        <Eye size={18} color="#94A3B8" />
                      )}
                    </Pressable>
                  </View>
                </View>

                {/* Sign In Button */}
                <V4Button
                  label="Sign In"
                  size="lg"
                  fullWidth
                  loading={loading}
                  iconRight={<ArrowRight size={16} color="#FFFFFF" strokeWidth={2.4} />}
                  onPress={handleEmailSignIn}
                  style={{ marginTop: 8 }}
                />
              </>
            ) : (
              <>
                {/* Phone Number Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Mobile Number</Text>
                  <View style={styles.inputRow}>
                    <View style={styles.countryCodeBox}>
                      <Text style={styles.flagEmoji}>🇮🇳</Text>
                      <Text style={styles.countryCode}>+91</Text>
                    </View>
                    <TextInput
                      placeholder="98765 43210"
                      placeholderTextColor={V4_COLORS.textMuted}
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                      maxLength={10}
                      style={styles.textInput}
                    />
                  </View>
                </View>

                {/* Send OTP Button */}
                <V4Button
                  label="Send 6-Digit OTP"
                  size="lg"
                  fullWidth
                  loading={loading}
                  disabled={phone.replace(/\D/g, '').length < 10}
                  iconRight={<ArrowRight size={16} color="#FFFFFF" strokeWidth={2.4} />}
                  onPress={handlePhoneOtpRequest}
                  style={{ marginTop: 8 }}
                />
              </>
            )}
          </View>
        )}

        {/* ============================================================= */}
        {/* SIGN UP / CREATE ACCOUNT FORM */}
        {/* ============================================================= */}
        {mode === 'signup' && (
          <View style={styles.formContainer}>
            {/* Account Type / Role Segmented Toggle */}
            <View style={styles.rolePickerWrap}>
              <Text style={styles.rolePickerLabel}>I am joining REHVO as a:</Text>
              <View style={styles.rolePickerRow}>
                {[
                  { id: 'renter', label: 'Renter', icon: Compass },
                  { id: 'owner', label: 'Owner', icon: Building2 },
                  { id: 'broker', label: 'Broker', icon: Briefcase },
                ].map((item) => {
                  const isRoleActive = selectedRole === item.id;
                  const IconComp = item.icon;
                  return (
                    <Pressable
                      key={item.id}
                      style={[
                        styles.rolePickerPill,
                        isRoleActive && styles.rolePickerPillActive,
                      ]}
                      onPress={() => setSelectedRole(item.id as any)}
                    >
                      <IconComp
                        size={15}
                        color={isRoleActive ? '#FFFFFF' : '#64748B'}
                        strokeWidth={isRoleActive ? 2.5 : 2}
                      />
                      <Text
                        style={[
                          styles.rolePickerPillText,
                          isRoleActive && styles.rolePickerPillTextActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Broker Business Details Card */}
            {selectedRole === 'broker' && (
              <View style={styles.brokerFieldsCard}>
                <View style={styles.brokerCardHeader}>
                  <Briefcase size={16} color="#5B21B6" />
                  <Text style={styles.brokerCardTitle}>Agency & Broker Profile</Text>
                </View>

                {/* Agency Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Real Estate Agency / Company Name *</Text>
                  <View style={styles.inputRow}>
                    <Building2 size={18} color="#94A3B8" />
                    <TextInput
                      placeholder="e.g. Apex Luxury Realty"
                      placeholderTextColor={V4_COLORS.textMuted}
                      value={agencyName}
                      onChangeText={setAgencyName}
                      style={styles.textInput}
                    />
                  </View>
                </View>

                {/* Operating City */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Primary Operating City *</Text>
                  <View style={styles.inputRow}>
                    <MapPin size={18} color="#94A3B8" />
                    <TextInput
                      placeholder="e.g. Mumbai / Bandra / BKC"
                      placeholderTextColor={V4_COLORS.textMuted}
                      value={operatingCity}
                      onChangeText={setOperatingCity}
                      style={styles.textInput}
                    />
                  </View>
                </View>

                {/* RERA Number */}
                <View style={styles.inputGroup}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.inputLabel}>MahaRERA Registration Number</Text>
                    <Text style={{ fontSize: 11, color: '#059669', fontWeight: '700' }}>Recommended</Text>
                  </View>
                  <View style={styles.inputRow}>
                    <ShieldCheck size={18} color="#94A3B8" />
                    <TextInput
                      placeholder="e.g. A51800012345"
                      placeholderTextColor={V4_COLORS.textMuted}
                      value={reraNumber}
                      onChangeText={setReraNumber}
                      autoCapitalize="characters"
                      style={styles.textInput}
                    />
                  </View>
                </View>

                {/* Office Address */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Registered Office Address (Optional)</Text>
                  <View style={styles.inputRow}>
                    <MapPin size={18} color="#94A3B8" />
                    <TextInput
                      placeholder="e.g. 402, Trade Centre, BKC, Mumbai"
                      placeholderTextColor={V4_COLORS.textMuted}
                      value={officeAddress}
                      onChangeText={setOfficeAddress}
                      style={styles.textInput}
                    />
                  </View>
                </View>
              </View>
            )}

            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={styles.inputRow}>
                <User size={18} color="#94A3B8" />
                <TextInput
                  placeholder="e.g. Rahul Sharma"
                  placeholderTextColor={V4_COLORS.textMuted}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  style={styles.textInput}
                />
              </View>
            </View>

            {/* Email Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputRow}>
                <Mail size={18} color="#94A3B8" />
                <TextInput
                  placeholder="name@example.com"
                  placeholderTextColor={V4_COLORS.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.textInput}
                />
              </View>
            </View>

            {/* Phone Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mobile Number</Text>
              <View style={styles.inputRow}>
                <View style={styles.countryCodeBox}>
                  <Text style={styles.flagEmoji}>🇮🇳</Text>
                  <Text style={styles.countryCode}>+91</Text>
                </View>
                <TextInput
                  placeholder="98765 43210"
                  placeholderTextColor={V4_COLORS.textMuted}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  maxLength={10}
                  style={styles.textInput}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Create Password (min. 8 characters)</Text>
              <View style={styles.inputRow}>
                <Lock size={18} color="#94A3B8" />
                <TextInput
                  placeholder="At least 8 characters"
                  placeholderTextColor={V4_COLORS.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={styles.textInput}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
                  {showPassword ? (
                    <EyeOff size={18} color="#94A3B8" />
                  ) : (
                    <Eye size={18} color="#94A3B8" />
                  )}
                </Pressable>
              </View>
            </View>

            {/* Create Account Button */}
            <V4Button
              label="Create Verified Account"
              size="lg"
              fullWidth
              loading={loading}
              iconRight={<ArrowRight size={16} color="#FFFFFF" strokeWidth={2.4} />}
              onPress={handleEmailSignUp}
              style={{ marginTop: 8 }}
            />
          </View>
        )}

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Google OAuth Button */}
        <Pressable
          style={styles.googleBtn}
          onPress={handleGoogleSignIn}
          disabled={googleLoading}
        >
          {googleLoading ? (
            <ActivityIndicator size="small" color="#0F172A" />
          ) : (
            <>
              <Text style={styles.googleGLogo}>G</Text>
              <Text style={styles.googleBtnText}>Continue with Google</Text>
            </>
          )}
        </Pressable>

        {/* Guest Exploration Option */}
        <Pressable
          style={styles.guestBtn}
          onPress={() => router.replace('/(renter)/home' as any)}
        >
          <Text style={styles.guestBtnText}>Browse REHVO as Guest →</Text>
        </Pressable>

        {/* Trust & Security Strip */}
        <View style={styles.trustBox}>
          <ShieldCheck size={16} color="#059669" strokeWidth={2.4} />
          <Text style={styles.trustText}>
            100% Real Users • DigiLocker KYC Verified • Verified Marketplace
          </Text>
        </View>

        {/* Legal Disclaimer */}
        <Text style={styles.termsText}>
          By continuing, you agree to REHVO's Terms of Service and Privacy Policy.
        </Text>
      </ScrollView>

      {/* Forgot Password Modal */}
      <Modal
        visible={showForgotModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowForgotModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconBox}>
                <KeyRound size={20} color="#059669" />
              </View>
              <Text style={styles.modalTitle}>Reset Password</Text>
              <Pressable
                style={styles.modalCloseBtn}
                onPress={() => setShowForgotModal(false)}
              >
                <X size={18} color="#64748B" />
              </Pressable>
            </View>

            <Text style={styles.modalSubtitle}>
              Enter your registered email address and we'll send you instructions to reset your password.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputRow}>
                <Mail size={18} color="#94A3B8" />
                <TextInput
                  placeholder="name@example.com"
                  placeholderTextColor={V4_COLORS.textMuted}
                  value={forgotEmail}
                  onChangeText={setForgotEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.textInput}
                />
              </View>
            </View>

            <V4Button
              label="Send Reset Link"
              size="md"
              fullWidth
              loading={forgotLoading}
              onPress={handleSendPasswordReset}
              style={{ marginTop: 14 }}
            />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 11,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    ...V4_SHADOWS.soft,
  },
  tabBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: '#0F172A',
    fontWeight: '800',
  },
  headerBlock: {
    gap: 6,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(5, 150, 105, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: 0.6,
  },
  heading: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.4,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    padding: 12,
    borderRadius: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '600',
    color: '#DC2626',
    lineHeight: 16,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    padding: 12,
    borderRadius: 12,
  },
  successText: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '600',
    color: '#16A34A',
    lineHeight: 16,
  },
  formContainer: {
    gap: 14,
  },
  methodToggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  methodPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  methodPillActive: {
    backgroundColor: 'rgba(5, 150, 105, 0.08)',
    borderColor: '#059669',
  },
  methodPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  methodPillTextActive: {
    color: '#059669',
    fontWeight: '800',
  },
  inputGroup: {
    gap: 6,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  forgotPassText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  countryCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: '#CBD5E1',
  },
  flagEmoji: {
    fontSize: 16,
  },
  countryCode: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  textInput: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
    paddingVertical: 0,
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
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 12,
    ...V4_SHADOWS.soft,
  },
  googleGLogo: {
    fontSize: 18,
    fontWeight: '900',
    color: '#EA4335',
  },
  googleBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  guestBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  guestBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#059669',
  },
  trustBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginTop: 4,
  },
  trustText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
    flex: 1,
    lineHeight: 15,
  },
  termsText: {
    fontSize: 10.5,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    gap: 14,
    ...V4_SHADOWS.medium,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    flex: 1,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  rolePickerWrap: {
    marginBottom: 16,
  },
  rolePickerLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  rolePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    gap: 6,
  },
  rolePickerPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 10,
    gap: 6,
  },
  rolePickerPillActive: {
    backgroundColor: '#064E3B',
    ...V4_SHADOWS.soft,
  },
  rolePickerPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  rolePickerPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  brokerFieldsCard: {
    backgroundColor: '#FDF4FF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F0ABFC',
    marginBottom: 14,
    gap: 12,
  },
  brokerCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F5D0FE',
  },
  brokerCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#5B21B6',
    letterSpacing: 0.3,
  },
});

