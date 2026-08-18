import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { UserRole } from '../../types';

interface RoleSelectionScreenProps {
  initialRole?: UserRole | null;
  onSelectRole: (role: UserRole) => void;
  isLoading?: boolean;
}

export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({
  initialRole = null,
  onSelectRole,
  isLoading = false,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(initialRole);

  const handleContinue = () => {
    if (selectedRole) {
      onSelectRole(selectedRole);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>ACCOUNT SETUP</Text>
          </View>
          <Text style={styles.title}>What are you here for?</Text>
          <Text style={styles.subtitle}>
            Select how you want to use REHVO. There are two simple account roles.
          </Text>
        </View>

        {/* Role Options */}
        <View style={styles.cardsContainer}>
          {/* Renter Role */}
          <Pressable
            onPress={() => setSelectedRole('RENTER')}
            style={[
              styles.card,
              selectedRole === 'RENTER' && styles.cardSelected,
            ]}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>🔍</Text>
              <Text style={styles.cardTitle}>Looking for a property</Text>
            </View>
            <Text style={styles.cardDesc}>
              Search and rent flats, PGs, rooms, flatmates and co-living stays in Mumbai.
            </Text>
          </Pressable>

          {/* Owner Role */}
          <Pressable
            onPress={() => setSelectedRole('OWNER')}
            style={[
              styles.card,
              selectedRole === 'OWNER' && styles.cardSelected,
            ]}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>🏠</Text>
              <Text style={styles.cardTitle}>I'm a property owner</Text>
            </View>
            <Text style={styles.cardDesc}>
              List flats, rooms, or PG properties and connect directly with verified renters.
            </Text>
          </Pressable>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Pressable
            onPress={handleContinue}
            disabled={!selectedRole || isLoading}
            style={[
              styles.continueBtn,
              (!selectedRole || isLoading) && styles.btnDisabled,
            ]}
          >
            <Text style={styles.continueText}>
              {isLoading ? 'Setting up...' : 'Continue →'}
            </Text>
          </Pressable>

          <Text style={styles.note}>
            🔒 Your role determines your tailored app experience.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F5F0',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  header: {
    gap: 8,
    marginTop: 10,
  },
  badge: {
    backgroundColor: '#EEE9FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#6C4DFF',
    fontSize: 10,
    fontWeight: '900',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#17151F',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#86828F',
    fontWeight: '500',
    lineHeight: 18,
  },
  cardsContainer: {
    gap: 16,
    marginVertical: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#E4E2DD',
    gap: 8,
  },
  cardSelected: {
    borderColor: '#6C4DFF',
    backgroundColor: '#FAF8FF',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardIcon: {
    fontSize: 24,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#17151F',
  },
  cardDesc: {
    fontSize: 12,
    color: '#86828F',
    fontWeight: '500',
    lineHeight: 18,
  },
  footer: {
    gap: 12,
  },
  continueBtn: {
    backgroundColor: '#6C4DFF',
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  note: {
    textAlign: 'center',
    fontSize: 11,
    color: '#86828F',
    fontWeight: '600',
  },
});
