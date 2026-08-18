import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  KeyRound,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react-native';
import { UserRole } from '../../types';

interface RoleSelectionStepProps {
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const RoleSelectionStep: React.FC<RoleSelectionStepProps> = ({
  selectedRole,
  onSelectRole,
  onContinue,
  onBack,
}) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.backBtn}
            onPress={onBack}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Back to welcome"
          >
            <ArrowLeft size={20} color="#171522" strokeWidth={2.2} />
          </Pressable>
        </View>

        {/* Content */}
        <View style={styles.body}>
          <View style={styles.titleGroup}>
            <Text style={styles.heading}>What are you here for?</Text>
            <Text style={styles.subheading}>
              We'll personalize your experience based on what you need today.
            </Text>
          </View>

          {/* Role Cards */}
          <View style={styles.cardsGroup}>
            {/* 1. Find a Place (Renter) */}
            <Pressable
              style={[
                styles.roleCard,
                selectedRole === 'RENTER' && styles.roleCardActive,
              ]}
              onPress={() => onSelectRole('RENTER')}
              accessibilityRole="radio"
              accessibilityState={{ selected: selectedRole === 'RENTER' }}
              accessibilityLabel="Find a place. I am looking to rent a home, room or PG."
            >
              <View
                style={[
                  styles.iconWrap,
                  selectedRole === 'RENTER' && styles.iconWrapActive,
                ]}
              >
                <Building2
                  size={26}
                  color={selectedRole === 'RENTER' ? '#6C4DFF' : '#171522'}
                  strokeWidth={2}
                />
              </View>

              <View style={styles.cardTextCol}>
                <View style={styles.cardHeaderRow}>
                  <Text
                    style={[
                      styles.cardTitle,
                      selectedRole === 'RENTER' && styles.cardTitleActive,
                    ]}
                  >
                    Find a place
                  </Text>
                  {selectedRole === 'RENTER' && (
                    <CheckCircle2
                      size={20}
                      color="#6C4DFF"
                      strokeWidth={2.5}
                    />
                  )}
                </View>
                <Text style={styles.cardDesc}>
                  I'm looking to rent a verified home, room, or PG in Mumbai.
                </Text>
              </View>
            </Pressable>

            {/* 2. List a Property (Owner) */}
            <Pressable
              style={[
                styles.roleCard,
                selectedRole === 'OWNER' && styles.roleCardActive,
              ]}
              onPress={() => onSelectRole('OWNER')}
              accessibilityRole="radio"
              accessibilityState={{ selected: selectedRole === 'OWNER' }}
              accessibilityLabel="List a property. I am a property owner or lister."
            >
              <View
                style={[
                  styles.iconWrap,
                  selectedRole === 'OWNER' && styles.iconWrapActive,
                ]}
              >
                <KeyRound
                  size={26}
                  color={selectedRole === 'OWNER' ? '#6C4DFF' : '#171522'}
                  strokeWidth={2}
                />
              </View>

              <View style={styles.cardTextCol}>
                <View style={styles.cardHeaderRow}>
                  <Text
                    style={[
                      styles.cardTitle,
                      selectedRole === 'OWNER' && styles.cardTitleActive,
                    ]}
                  >
                    List a property
                  </Text>
                  {selectedRole === 'OWNER' && (
                    <CheckCircle2
                      size={20}
                      color="#6C4DFF"
                      strokeWidth={2.5}
                    />
                  )}
                </View>
                <Text style={styles.cardDesc}>
                  I'm a property owner or host looking to find verified tenants.
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Trust Banner */}
          <View style={styles.trustBanner}>
            <ShieldCheck size={16} color="#32B768" strokeWidth={2.2} />
            <Text style={styles.trustBannerText}>
              You can easily switch roles anytime from your profile settings.
            </Text>
          </View>
        </View>

        {/* Footer CTA */}
        <View style={styles.footer}>
          <Pressable
            style={styles.continueBtn}
            onPress={onContinue}
            accessibilityRole="button"
            accessibilityLabel="Continue to personalization"
          >
            <Text style={styles.continueBtnText}>Continue</Text>
            <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.2} />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F7F4',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    gap: 24,
  },
  titleGroup: {
    gap: 8,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 14.5,
    color: '#777482',
    lineHeight: 21,
    fontWeight: '500',
  },
  cardsGroup: {
    gap: 14,
  },
  roleCard: {
    flexDirection: 'row',
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#171522',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  roleCardActive: {
    borderColor: '#6C4DFF',
    backgroundColor: '#FAF9FF',
    shadowColor: '#6C4DFF',
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F7F5F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: '#F0ECFF',
  },
  cardTextCol: {
    flex: 1,
    gap: 4,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#171522',
  },
  cardTitleActive: {
    color: '#6C4DFF',
  },
  cardDesc: {
    fontSize: 13,
    color: '#777482',
    lineHeight: 18,
    fontWeight: '500',
  },
  trustBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E8E5EC',
  },
  trustBannerText: {
    flex: 1,
    fontSize: 12,
    color: '#777482',
    lineHeight: 17,
    fontWeight: '500',
  },
  footer: {
    paddingTop: 12,
  },
  continueBtn: {
    height: 54,
    borderRadius: 16,
    backgroundColor: '#6C4DFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#6C4DFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 4,
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
