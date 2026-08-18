import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Building2, Plus, Sparkles } from 'lucide-react-native';

interface OwnerEmptyStateProps {
  onListProperty: () => void;
}

export const OwnerEmptyState: React.FC<OwnerEmptyStateProps> = ({
  onListProperty,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Building2 size={36} color="#6C4DFF" strokeWidth={1.8} />
      </View>

      <Text style={styles.title}>
        Your first property is waiting to be listed.
      </Text>

      <Text style={styles.subtitle}>
        Add your flat, room or PG and start receiving tenant enquiries and visit requests with zero brokerage.
      </Text>

      <Pressable
        style={styles.ctaButton}
        onPress={onListProperty}
        accessibilityRole="button"
        accessibilityLabel="List a property"
      >
        <Plus size={18} color="#FFFFFF" strokeWidth={2.5} />
        <Text style={styles.ctaText}>List a property</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 24,
    marginHorizontal: 16,
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#F0ECFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#171522',
    textAlign: 'center',
    lineHeight: 23,
  },
  subtitle: {
    fontSize: 13,
    color: '#777482',
    textAlign: 'center',
    lineHeight: 19,
    fontWeight: '500',
    maxWidth: 290,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#6C4DFF',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 6,
    shadowColor: '#6C4DFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  ctaText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
