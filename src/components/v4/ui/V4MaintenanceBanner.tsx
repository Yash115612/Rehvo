import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { V4_COLORS } from '../../../theme/v4Theme';

interface V4MaintenanceBannerProps {
  message?: string;
}

export const V4MaintenanceBannerComponent: React.FC<V4MaintenanceBannerProps> = ({ message }) => {
  if (!message) return null;

  return (
    <View style={styles.banner}>
      <AlertCircle size={14} color={V4_COLORS.textWhite} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

export const V4MaintenanceBanner = React.memo(V4MaintenanceBannerComponent);

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D97706',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    color: V4_COLORS.textWhite,
  },
});
