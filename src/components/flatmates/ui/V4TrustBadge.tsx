import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShieldCheck, CheckCircle2 } from 'lucide-react-native';

interface V4TrustBadgeProps {
  type?: 'aadhaar' | 'digilocker' | 'phone' | 'work' | 'college' | 'general';
  label?: string;
  size?: 'small' | 'medium';
}

export const V4TrustBadge: React.FC<V4TrustBadgeProps> = ({
  type = 'digilocker',
  label,
  size = 'small',
}) => {
  const getDefaultLabel = () => {
    switch (type) {
      case 'digilocker':
        return 'DIGILOCKER KYC';
      case 'aadhaar':
        return 'AADHAAR VERIFIED';
      case 'work':
        return 'WORKPLACE VERIFIED';
      case 'college':
        return 'CAMPUS VERIFIED';
      case 'phone':
        return '2FA OTP VERIFIED';
      default:
        return 'VERIFIED';
    }
  };

  const text = label || getDefaultLabel();
  const isSmall = size === 'small';

  return (
    <View style={[styles.badge, isSmall && styles.badgeSmall]}>
      <ShieldCheck size={isSmall ? 11 : 14} color="#059669" strokeWidth={2.8} />
      <Text style={[styles.badgeText, isSmall && styles.badgeTextSmall]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  badgeSmall: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#065F46',
    letterSpacing: 0.3,
  },
  badgeTextSmall: {
    fontSize: 9.5,
    fontWeight: '800',
  },
});
