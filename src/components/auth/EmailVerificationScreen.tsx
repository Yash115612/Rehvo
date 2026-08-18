import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';

interface EmailVerificationScreenProps {
  email: string;
  onContinue: () => void;
  onResend: () => Promise<boolean>;
  onChangeEmail: () => void;
}

export const EmailVerificationScreen: React.FC<EmailVerificationScreenProps> = ({
  email,
  onContinue,
  onResend,
  onChangeEmail,
}) => {
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  const handleResendClick = async () => {
    setIsResending(true);
    setResendStatus(null);
    try {
      await onResend();
      setResendStatus('Verification link resent successfully.');
    } catch (err) {
      setResendStatus('Failed to resend. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.iconBox}>
            <Text style={styles.icon}>✉️</Text>
          </View>

          <Text style={styles.title}>Check your inbox.</Text>
          <Text style={styles.subtitle}>
            We sent a verification link to <Text style={{ fontWeight: '800', color: '#17151F' }}>{email}</Text>
          </Text>

          {resendStatus && (
            <View style={styles.statusBox}>
              <Text style={styles.statusText}>{resendStatus}</Text>
            </View>
          )}

          <View style={{ gap: 10, marginTop: 12 }}>
            <Pressable onPress={onContinue} style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>I've verified my email — Continue →</Text>
            </Pressable>

            <Pressable onPress={handleResendClick} disabled={isResending} style={styles.secondaryBtn}>
              {isResending ? (
                <ActivityIndicator color="#17151F" size="small" />
              ) : (
                <Text style={styles.secondaryBtnText}>Resend email</Text>
              )}
            </Pressable>

            <Pressable onPress={onChangeEmail} style={{ alignSelf: 'center', marginTop: 8 }}>
              <Text style={styles.linkText}>Wrong email address? Change email</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F5F0',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E4E2DD',
    alignItems: 'center',
    gap: 8,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 24,
    backgroundColor: '#EEE9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#17151F',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#86828F',
    textAlign: 'center',
    fontWeight: '500',
  },
  statusBox: {
    backgroundColor: '#EAF8F0',
    padding: 10,
    borderRadius: 12,
    marginTop: 4,
  },
  statusText: {
    color: '#32B768',
    fontSize: 12,
    fontWeight: '800',
  },
  primaryBtn: {
    backgroundColor: '#6C4DFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 999,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  secondaryBtn: {
    backgroundColor: '#F7F5F0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E4E2DD',
  },
  secondaryBtnText: {
    color: '#17151F',
    fontSize: 13,
    fontWeight: '800',
  },
  linkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#86828F',
  },
});
