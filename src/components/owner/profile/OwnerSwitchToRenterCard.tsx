import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Search, ArrowRight } from 'lucide-react-native';

interface OwnerSwitchToRenterCardProps {
  onSwitchToRenter: () => void;
}

export const OwnerSwitchToRenterCard: React.FC<
  OwnerSwitchToRenterCardProps
> = ({ onSwitchToRenter }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <Search size={20} color="#6C4DFF" strokeWidth={2.2} />
        </View>

        <View style={styles.textCol}>
          <Text style={styles.title}>Looking for a property?</Text>
          <Text style={styles.subtitle}>
            Switch to the renter experience whenever you want. Discover thousands of verified homes and flats across Mumbai.
          </Text>
        </View>

        <Pressable
          style={styles.switchBtn}
          onPress={onSwitchToRenter}
          accessibilityRole="button"
          accessibilityLabel="Switch to renter mode"
        >
          <Text style={styles.switchBtnText}>Switch to Renter</Text>
          <ArrowRight size={15} color="#6C4DFF" strokeWidth={2.5} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#F0ECFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DED6FD',
    padding: 18,
    gap: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#171522',
  },
  subtitle: {
    fontSize: 12.5,
    color: '#5B5768',
    lineHeight: 18,
    fontWeight: '500',
  },
  switchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DED6FD',
  },
  switchBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#6C4DFF',
  },
});
