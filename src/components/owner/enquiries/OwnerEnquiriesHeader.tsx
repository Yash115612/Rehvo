import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Filter } from 'lucide-react-native';

interface OwnerEnquiriesHeaderProps {
  onFilterPress?: () => void;
}

export const OwnerEnquiriesHeader: React.FC<OwnerEnquiriesHeaderProps> = ({
  onFilterPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftCol}>
        <Text style={styles.title}>Enquiries</Text>
        <Text style={styles.subtitle}>
          People interested in your properties
        </Text>
      </View>

      {onFilterPress && (
        <Pressable
          style={styles.filterBtn}
          onPress={onFilterPress}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Filter enquiries"
        >
          <Filter size={17} color="#171522" strokeWidth={2.2} />
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
  leftCol: {
    flex: 1,
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
  filterBtn: {
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
