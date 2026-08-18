import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Plus, Sparkles, ArrowRight } from 'lucide-react-native';

interface OwnerListPropertyCTAProps {
  onListProperty: () => void;
}

export const OwnerListPropertyCTA: React.FC<OwnerListPropertyCTAProps> = ({
  onListProperty,
}) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.ctaButton}
        onPress={onListProperty}
        accessibilityRole="button"
        accessibilityLabel="List a new property"
      >
        <View style={styles.leftRow}>
          <View style={styles.plusCircle}>
            <Plus size={20} color="#6C4DFF" strokeWidth={2.5} />
          </View>
          <View>
            <Text style={styles.ctaTitle}>List a property</Text>
            <Text style={styles.ctaSubtitle}>
              Publish your flat, room or PG in minutes
            </Text>
          </View>
        </View>

        <View style={styles.arrowCircle}>
          <ArrowRight size={16} color="#FFFFFF" strokeWidth={2.2} />
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#6C4DFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#6C4DFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  plusCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  ctaSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ECE7FF',
    marginTop: 2,
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
