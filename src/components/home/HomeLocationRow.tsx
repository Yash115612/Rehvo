import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MapPin, ChevronDown } from 'lucide-react-native';

interface HomeLocationRowProps {
  city?: string;
  onPress?: () => void;
}

export const HomeLocationRow: React.FC<HomeLocationRowProps> = ({
  city = 'Mumbai',
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.pill}
        onPress={onPress}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`Current location: ${city}`}
      >
        <MapPin size={14} color="#6C4DFF" strokeWidth={2.2} />
        <Text style={styles.cityText}>{city}</Text>
        <ChevronDown size={13} color="#777482" strokeWidth={2} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  cityText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#171522',
  },
});
