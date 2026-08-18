import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAppStore } from '../../store/useAppStore';

export const Toast: React.FC = () => {
  const { toastMessage, toastType, clearToast } = useAppStore();

  if (!toastMessage) return null;

  const bgColors = {
    success: '#32B768',
    error: '#BA1A1A',
    info: '#17151F',
  };

  return (
    <View style={styles.container}>
      <View style={[styles.toastCard, { backgroundColor: bgColors[toastType] }]}>
        <Text style={styles.toastText}>{toastMessage}</Text>
        <Pressable onPress={clearToast} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  toastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'System',
  },
  closeButton: {
    marginLeft: 12,
    padding: 2,
  },
  closeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    opacity: 0.8,
  },
});
