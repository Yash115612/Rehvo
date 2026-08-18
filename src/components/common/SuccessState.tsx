import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface SuccessStateProps {
  title?: string;
  subtitle?: string;
  onContinue: () => void;
  ctaText?: string;
}

export const SuccessState: React.FC<SuccessStateProps> = ({
  title = "You're in.",
  subtitle = "Welcome to REHVO. Let's find your next place.",
  onContinue,
  ctaText = 'Continue',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <Text style={{ fontSize: 36 }}>✅</Text>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <Pressable onPress={onContinue} style={styles.btn}>
        <Text style={styles.btnText}>{ctaText} →</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E4E2DD',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 24,
    backgroundColor: '#EAF8F0',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontWeight: '600',
  },
  btn: {
    backgroundColor: '#6C4DFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 999,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
