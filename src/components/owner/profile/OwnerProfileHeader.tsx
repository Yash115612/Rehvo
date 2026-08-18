import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Settings } from 'lucide-react-native';

interface OwnerProfileHeaderProps {
  onSettingsPress?: () => void;
}

export const OwnerProfileHeader: React.FC<OwnerProfileHeaderProps> = ({
  onSettingsPress,
}) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Owner Account & Settings</Text>
      </View>

      {onSettingsPress && (
        <Pressable
          style={styles.settingsBtn}
          onPress={onSettingsPress}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Open settings"
        >
          <Settings size={18} color="#171522" strokeWidth={2} />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: '#F8F7F4',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    color: '#777482',
    fontWeight: '500',
    marginTop: 2,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
