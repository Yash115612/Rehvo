import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { UserRole } from '../../types';

interface RoleSelectionScreenProps {
  onRoleSelected: (role: UserRole) => void;
}

export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({ onRoleSelected }) => {
  const { updateProfile, completeOnboarding } = useAppStore();
  const [selectedRole, setSelectedRole] = useState<UserRole>('RENTER');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = async () => {
    setIsSubmitting(true);
    try {
      updateProfile({
        role: selectedRole,
        onboarding_completed: true,
      });
      completeOnboarding();
      onRoleSelected(selectedRole);
    } catch (err) {
      console.warn('Error saving role selection:', err);
      onRoleSelected(selectedRole);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>🏢</Text>
          </View>
          <Text style={styles.title}>What are you here for?</Text>
          <Text style={styles.subtitle}>
            Choose your account type to personalize your experience on REHVO.
          </Text>
        </View>

        {/* Selection Cards */}
        <View style={styles.cardList}>
          {/* Renter */}
          <Pressable
            onPress={() => setSelectedRole('RENTER')}
            style={[
              styles.roleCard,
              selectedRole === 'RENTER' ? styles.roleCardSelected : styles.roleCardNormal,
            ]}
          >
            <View
              style={[
                styles.roleIconBox,
                selectedRole === 'RENTER' ? styles.iconBoxSelected : styles.iconBoxNormal,
              ]}
            >
              <Text style={styles.roleIcon}>🔎</Text>
            </View>
            <View style={styles.roleContent}>
              <View style={styles.roleTitleRow}>
                <Text style={styles.roleTitle}>Looking for a property</Text>
                {selectedRole === 'RENTER' && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <Text style={styles.roleSub}>
                Find flats, PGs, rooms, flatmates and co-living spaces.
              </Text>
            </View>
          </Pressable>

          {/* Owner */}
          <Pressable
            onPress={() => setSelectedRole('OWNER')}
            style={[
              styles.roleCard,
              selectedRole === 'OWNER' ? styles.roleCardSelected : styles.roleCardNormal,
            ]}
          >
            <View
              style={[
                styles.roleIconBox,
                selectedRole === 'OWNER' ? styles.iconBoxSelected : styles.iconBoxNormal,
              ]}
            >
              <Text style={styles.roleIcon}>🏠</Text>
            </View>
            <View style={styles.roleContent}>
              <View style={styles.roleTitleRow}>
                <Text style={styles.roleTitle}>I'm a property owner</Text>
                {selectedRole === 'OWNER' && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <Text style={styles.roleSub}>List and manage your properties on REHVO.</Text>
            </View>
          </Pressable>
        </View>

        {/* Continue Button */}
        <Pressable
          onPress={handleContinue}
          disabled={isSubmitting}
          style={[styles.continueBtn, isSubmitting && { opacity: 0.7 }]}
        >
          <Text style={styles.continueText}>
            {isSubmitting ? 'Saving Preference...' : 'Continue →'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#E4E2DD',
    padding: 24,
    gap: 24,
  },
  header: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: '#EEE9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconText: {
    fontSize: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#17151F',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#79767C',
    textAlign: 'center',
    marginTop: 4,
  },
  cardList: {
    gap: 12,
  },
  roleCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  roleCardNormal: {
    borderColor: '#E4E2DD',
    backgroundColor: '#F7F5F0',
  },
  roleCardSelected: {
    borderColor: '#6C4DFF',
    backgroundColor: '#EEE9FF',
  },
  roleIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxNormal: {
    backgroundColor: '#EAE8E3',
  },
  iconBoxSelected: {
    backgroundColor: '#6C4DFF',
  },
  roleIcon: {
    fontSize: 20,
  },
  roleContent: {
    flex: 1,
  },
  roleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roleTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#17151F',
  },
  checkMark: {
    fontSize: 16,
    fontWeight: '900',
    color: '#6C4DFF',
  },
  roleSub: {
    fontSize: 11,
    color: '#48464B',
    marginTop: 2,
  },
  continueBtn: {
    backgroundColor: '#6C4DFF',
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
});

