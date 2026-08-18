import React from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Building2,
  Users2,
  Plus,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react-native';
import { useAppStore } from '../../store/useAppStore';

interface ContextualCreateSheetProps {
  visible: boolean;
  onClose: () => void;
}

export const ContextualCreateSheet: React.FC<ContextualCreateSheetProps> = ({
  visible,
  onClose,
}) => {
  const router = useRouter();
  const { currentRole, myFlatmateProfile } = useAppStore();

  const handleListProperty = () => {
    onClose();
    router.push('/(renter)/listing/property-type');
  };

  const handleFlatmateAction = () => {
    onClose();
    if (myFlatmateProfile) {
      router.push('/(renter)/flatmate/my-profile');
    } else {
      router.push('/(renter)/flatmate/create');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>What would you like to create?</Text>
              <Text style={styles.subtitle}>
                Post verified rentals or find roommates on REHVO
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              hitSlop={8}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <X size={20} color="#171522" strokeWidth={2} />
            </Pressable>
          </View>

          {/* Action Cards */}
          <View style={styles.actionsContainer}>
            {/* 1. List a Property Option */}
            <Pressable
              style={({ pressed }) => [
                styles.actionCard,
                styles.primaryCard,
                pressed && styles.cardPressed,
              ]}
              onPress={handleListProperty}
              accessibilityRole="button"
              accessibilityLabel="List a property for rent"
            >
              <View style={[styles.iconWrap, { backgroundColor: '#6C4DFF' }]}>
                <Building2 size={24} color="#FFFFFF" strokeWidth={2.2} />
              </View>

              <View style={styles.cardContent}>
                <View style={styles.badgeRow}>
                  <Text style={styles.cardTitle}>List a Property for Rent</Text>
                  <View style={styles.badgePill}>
                    <Text style={styles.badgeText}>Zero Brokerage</Text>
                  </View>
                </View>
                <Text style={styles.cardDesc}>
                  Post entire flats, rooms, PGs, or studios in Mumbai
                </Text>
              </View>

              <View style={styles.arrowCircle}>
                <ArrowRight size={16} color="#6C4DFF" strokeWidth={2.5} />
              </View>
            </Pressable>

            {/* 2. Flatmate Profile Option */}
            <Pressable
              style={({ pressed }) => [
                styles.actionCard,
                styles.secondaryCard,
                pressed && styles.cardPressed,
              ]}
              onPress={handleFlatmateAction}
              accessibilityRole="button"
              accessibilityLabel="Create or manage flatmate profile"
            >
              <View style={[styles.iconWrap, { backgroundColor: '#0EA5E9' }]}>
                <Users2 size={24} color="#FFFFFF" strokeWidth={2.2} />
              </View>

              <View style={styles.cardContent}>
                <View style={styles.badgeRow}>
                  <Text style={styles.cardTitle}>
                    {myFlatmateProfile
                      ? 'Manage Flatmate Profile'
                      : 'Create Flatmate Profile'}
                  </Text>
                  {myFlatmateProfile && (
                    <View
                      style={[
                        styles.badgePill,
                        { backgroundColor: '#DCFCE7' },
                      ]}
                    >
                      <Text style={[styles.badgeText, { color: '#16A34A' }]}>
                        {myFlatmateProfile.is_paused ? 'Paused' : 'Active'}
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={styles.cardDesc}>
                  {myFlatmateProfile
                    ? 'Review incoming interests, views, and update lifestyle preferences'
                    : 'Get discovered by verified renters looking for a compatible roommate'}
                </Text>
              </View>

              <View style={styles.arrowCircle}>
                <ArrowRight size={16} color="#0EA5E9" strokeWidth={2.5} />
              </View>
            </Pressable>
          </View>

          {/* Safe Badge Footer */}
          <View style={styles.footerRow}>
            <ShieldCheck size={14} color="#32B768" strokeWidth={2.2} />
            <Text style={styles.footerText}>
              100% Free · Verified Profiles & Listings · Zero Hidden Charges
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(23, 21, 34, 0.52)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    gap: 18,
  },
  handle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E8E5EC',
    alignSelf: 'center',
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: '#777482',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F7F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsContainer: {
    gap: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    gap: 14,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  primaryCard: {
    backgroundColor: '#FAF9FF',
    borderColor: '#E4DCFF',
  },
  secondaryCard: {
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#171522',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
    gap: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.2,
  },
  badgePill: {
    backgroundColor: '#F0ECFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  cardDesc: {
    fontSize: 12,
    color: '#777482',
    lineHeight: 17,
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8E5EC',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 4,
  },
  footerText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#777482',
  },
});
