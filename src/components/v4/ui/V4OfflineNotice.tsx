import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WifiOff } from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS } from '../../../theme/v4Theme';

interface V4OfflineNoticeProps {
  isOffline: boolean;
}

export const V4OfflineNoticeComponent: React.FC<V4OfflineNoticeProps> = ({ isOffline }) => {
  if (!isOffline) return null;

  return (
    <View style={styles.banner}>
      <WifiOff size={14} color={V4_COLORS.textWhite} />
      <Text style={styles.text}>
        You're currently offline. Viewing cached properties.
      </Text>
    </View>
  );
};

export const V4OfflineNotice = React.memo(V4OfflineNoticeComponent);

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#334155',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: V4_COLORS.textWhite,
  },
});

export default V4OfflineNotice;
