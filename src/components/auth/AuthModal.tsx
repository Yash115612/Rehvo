import React, { useState } from 'react';
import { View, Text, Pressable, TextInput as RNTextInput, Modal, StyleSheet } from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialRole = 'RENTER' }) => {
  const { login } = useAppStore();
  const [step, setStep] = useState<'goal' | 'method' | 'otp' | 'email'>('goal');
  const [role, setRole] = useState<UserRole>(initialRole);
  const [phone, setPhone] = useState('+91 98765 43210');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(45);
  const [error, setError] = useState('');

  const handleSendOTP = () => {
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setStep('otp');
    setTimer(45);
  };

  const handleVerifyOTP = () => {
    const entered = otp.join('');
    if (entered.length < 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }
    setError('');
    login({
      phone,
      role,
      name: role === 'OWNER' ? 'Sarah Kapoor' : 'Arjun Mehta',
    });
    onClose();
  };

  const handleEmailAuth = () => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    setError('');
    login({
      email,
      role,
      name: email.split('@')[0],
    });
    onClose();
  };

  const handleSocialAuth = (provider: 'Google' | 'Apple') => {
    login({
      name: `User (${provider})`,
      email: `user.${provider.toLowerCase()}@example.com`,
      role,
    });
    onClose();
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Close Button */}
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>

          {/* Step 1: Goal Selection */}
          {step === 'goal' && (
            <View style={styles.alignCenter}>
              <Text style={styles.title}>What are you here for?</Text>
              <Text style={styles.subtitle}>
                Select your primary goal to help us personalize your REHVO experience.
              </Text>

              <View style={styles.goalOptions}>
                {/* Renter Option */}
                <Pressable
                  onPress={() => {
                    setRole('RENTER');
                    setStep('method');
                  }}
                  style={[styles.goalCard, role === 'RENTER' && styles.goalCardSelected]}
                >
                  <View style={styles.goalIconBox}>
                    <Text style={styles.goalIcon}>🔍</Text>
                  </View>
                  <View style={styles.goalInfo}>
                    <Text style={styles.goalTitle}>I'm looking for a place</Text>
                    <Text style={styles.goalSub}>
                      Discover curated flats, PGs, rooms & flatmates in Mumbai.
                    </Text>
                  </View>
                  <Text style={styles.arrowIcon}>→</Text>
                </Pressable>

                {/* Owner Option */}
                <Pressable
                  onPress={() => {
                    setRole('OWNER');
                    setStep('method');
                  }}
                  style={[styles.goalCard, role === 'OWNER' && styles.goalCardSelected]}
                >
                  <View style={styles.goalIconBox}>
                    <Text style={styles.goalIcon}>🏡</Text>
                  </View>
                  <View style={styles.goalInfo}>
                    <Text style={styles.goalTitle}>I want to list a place</Text>
                    <Text style={styles.goalSub}>
                      Connect with high-quality tenants looking for rentals.
                    </Text>
                  </View>
                  <Text style={styles.arrowIcon}>→</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Step 2: Authentication Method */}
          {step === 'method' && (
            <View>
              <Pressable onPress={() => setStep('goal')} style={styles.backBtn}>
                <Text style={styles.backBtnText}>← Back</Text>
              </Pressable>

              <Text style={styles.title}>Join the future of living.</Text>
              <Text style={styles.subtitle}>
                Save properties, schedule viewings, and connect directly with verified hosts.
              </Text>

              {/* Social Logins */}
              <View style={styles.socialCol}>
                <Pressable onPress={() => handleSocialAuth('Google')} style={styles.socialBtn}>
                  <Text style={styles.socialBtnText}>G  Continue with Google</Text>
                </Pressable>

                <Pressable onPress={() => handleSocialAuth('Apple')} style={styles.socialBtn}>
                  <Text style={styles.socialBtnText}>🍎  Continue with Apple</Text>
                </Pressable>
              </View>

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Phone Form */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Mobile Phone Number</Text>
                <View style={styles.phoneInputRow}>
                  <Text style={styles.prefix}>+91</Text>
                  <RNTextInput
                    value={phone.replace('+91 ', '')}
                    onChangeText={(text) => setPhone(`+91 ${text}`)}
                    placeholder="98765 43210"
                    placeholderTextColor="#86828F"
                    keyboardType="phone-pad"
                    style={styles.phoneInput}
                  />
                </View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <Pressable onPress={handleSendOTP} style={styles.primaryBtn}>
                  <Text style={styles.primaryBtnText}>📞  Continue with Phone</Text>
                </Pressable>

                <Pressable onPress={() => setStep('email')} style={styles.switchLink}>
                  <Text style={styles.switchLinkText}>Use Email Password instead</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Step 3: OTP Verification */}
          {step === 'otp' && (
            <View style={styles.alignCenter}>
              <Pressable onPress={() => setStep('method')} style={[styles.backBtn, { alignSelf: 'flex-start' }]}>
                <Text style={styles.backBtnText}>← Back</Text>
              </Pressable>

              <View style={styles.lockIconBox}>
                <Text style={styles.lockIcon}>🔓</Text>
              </View>

              <Text style={styles.title}>Verify it's you</Text>
              <Text style={styles.subtitle}>
                We've sent a 6-digit verification code to {'\n'}
                <Text style={{ fontWeight: '800', color: '#17151F' }}>{phone}</Text>
              </Text>

              {/* 6 Digit Input Boxes */}
              <View style={styles.otpRow}>
                {otp.map((digit, idx) => (
                  <React.Fragment key={idx}>
                    <RNTextInput
                      value={digit}
                      onChangeText={(val) => {
                        const newOtp = [...otp];
                        newOtp[idx] = val;
                        setOtp(newOtp);
                      }}
                      maxLength={1}
                      keyboardType="number-pad"
                      style={styles.otpBox}
                    />
                  </React.Fragment>
                ))}
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <Pressable onPress={handleVerifyOTP} style={[styles.primaryBtn, { width: '100%' }]}>
                <Text style={styles.primaryBtnText}>Verify Code →</Text>
              </Pressable>

              <View style={styles.timerRow}>
                <Text style={styles.timerText}>Timer: 00:{timer < 10 ? `0${timer}` : timer}</Text>
                <Pressable disabled={timer > 0} onPress={() => setTimer(45)}>
                  <Text style={[styles.resendText, timer > 0 && { opacity: 0.4 }]}>Resend OTP</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Step 4: Email Password */}
          {step === 'email' && (
            <View>
              <Pressable onPress={() => setStep('method')} style={styles.backBtn}>
                <Text style={styles.backBtnText}>← Back</Text>
              </Pressable>

              <Text style={styles.title}>Welcome back.</Text>
              <Text style={styles.subtitle}>Log in to continue your rental journey.</Text>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Email Address</Text>
                <RNTextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="enter your email"
                  placeholderTextColor="#86828F"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />

                <Text style={styles.label}>Password</Text>
                <RNTextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="enter password"
                  placeholderTextColor="#86828F"
                  secureTextEntry
                  style={styles.input}
                />

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <Pressable onPress={handleEmailAuth} style={styles.primaryBtn}>
                  <Text style={styles.primaryBtnText}>Log In</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#F7F5F0',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#E4E2DD',
    padding: 24,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#17151F',
  },
  alignCenter: {
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#17151F',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12,
    color: '#48464B',
    marginBottom: 20,
    textAlign: 'center',
  },
  goalOptions: {
    width: '100%',
    gap: 12,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E2DD',
  },
  goalCardSelected: {
    borderColor: '#6C4DFF',
    backgroundColor: '#EEE9FF',
  },
  goalIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEE9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  goalIcon: {
    fontSize: 20,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#17151F',
  },
  goalSub: {
    fontSize: 11,
    color: '#48464B',
    marginTop: 2,
  },
  arrowIcon: {
    fontSize: 18,
    color: '#6C4DFF',
    fontWeight: '900',
  },
  backBtn: {
    marginBottom: 12,
  },
  backBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#48464B',
  },
  socialCol: {
    gap: 10,
    marginBottom: 16,
  },
  socialBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C9C5CC',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  socialBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#17151F',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#C9C5CC',
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#86828F',
  },
  formGroup: {
    gap: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#17151F',
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C9C5CC',
    borderRadius: 16,
    paddingHorizontal: 12,
  },
  prefix: {
    fontSize: 14,
    fontWeight: '800',
    color: '#17151F',
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '700',
    color: '#17151F',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C9C5CC',
    borderRadius: 14,
    padding: 12,
    fontSize: 13,
    fontWeight: '600',
    color: '#17151F',
  },
  errorText: {
    fontSize: 11,
    color: '#BA1A1A',
    fontWeight: '700',
  },
  primaryBtn: {
    backgroundColor: '#6C4DFF',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  switchLink: {
    alignItems: 'center',
    marginTop: 8,
  },
  switchLinkText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6C4DFF',
  },
  lockIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EEE9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  lockIcon: {
    fontSize: 24,
  },
  otpRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 16,
  },
  otpBox: {
    width: 44,
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#C9C5CC',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '900',
    color: '#17151F',
  },
  timerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
  },
  timerText: {
    fontSize: 11,
    color: '#48464B',
  },
  resendText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6C4DFF',
  },
});

