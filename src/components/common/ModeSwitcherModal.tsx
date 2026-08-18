import React, { useMemo } from 'react';
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
  Search,
  Users,
  Building,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
} from 'lucide-react-native';
import { useAppStore, selectUserCapabilities } from '../../store/useAppStore';

interface ModeSwitcherModalProps {
  visible: boolean;
  onClose: () => void;
}

interface ModeOption {
  id: 'RENTER' | 'FLATMATE' | 'OWNER';
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ReactNode;
  iconBg: string;
  destination: string;
}

export const ModeSwitcherModal: React.FC<ModeSwitcherModalProps> = ({
  visible,
  onClose,
}) => {
  const router = useRouter();
  const {
    user,
    properties,
    currentRole,
    switchRole,
    myFlatmateProfile,
    flatmateDraft,
    showToast,
  } = useAppStore();

  const capabilities = selectUserCapabilities({
    user,
    properties,
    myFlatmateProfile,
    flatmateDraft,
  });

  const {
    userProperties,
    hasPropertyListing,
    hasPublishedFlatmateProfile,
    isFlatmatePaused,
  } = capabilities;

  const availableModes = useMemo<ModeOption[]>(() => {
    const modes: ModeOption[] = [
      {
        id: 'RENTER',
        title: 'Looking for a Place',
        subtitle: 'Browse & rent flats, PGs, rooms, or studios with zero brokerage',
        badge: 'Renter Hub',
        icon: <Search size={22} color="#6C4DFF" strokeWidth={2.2} />,
        iconBg: '#F0ECFF',
        destination: '/(renter)/home',
      },
    ];

    if (hasPropertyListing) {
      modes.push({
        id: 'OWNER',
        title: 'Property Lister Mode',
        subtitle: `Manage ${userProperties.length} listed ${userProperties.length === 1 ? 'property' : 'properties'}, enquiries & visits`,
        badge: 'Lister Dashboard',
        icon: <Building size={22} color="#10B981" strokeWidth={2.2} />,
        iconBg: '#D1FAE5',
        destination: '/(owner)/dashboard',
      });
    }

    if (hasPublishedFlatmateProfile) {
      modes.push({
        id: 'FLATMATE',
        title: 'Flatmates Mode',
        subtitle: isFlatmatePaused
          ? 'Profile paused • Manage roommates & preferences'
          : 'Profile live • Manage incoming roommate interests',
        badge: isFlatmatePaused ? 'Paused' : 'Profile Active',
        icon: <Users size={22} color="#0EA5E9" strokeWidth={2.2} />,
        iconBg: '#E0F2FE',
        destination: '/(renter)/flatmate/my-profile',
      });
    }

    return modes;
  }, [hasPropertyListing, hasPublishedFlatmateProfile, isFlatmatePaused, userProperties.length]);

  const handleSelectMode = (mode: ModeOption) => {
    onClose();
    if (mode.id === 'OWNER') {
      switchRole('OWNER');
      router.replace('/(owner)/dashboard');
      showToast('Switched to Lister Mode', 'success');
    } else if (mode.id === 'RENTER') {
      switchRole('RENTER');
      router.replace('/(renter)/home');
      showToast('Switched to Looking for a Place', 'success');
    } else if (mode.id === 'FLATMATE') {
      router.push('/(renter)/flatmate/my-profile');
      showToast('Switched to Flatmate Mode', 'info');
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
              <Text style={styles.title}>Switch Experience</Text>
              <Text style={styles.subtitle}>
                One REHVO account for all your housing needs
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

          {/* Mode List */}
          <View style={styles.listContainer}>
            {availableModes.map((mode) => {
              const isSelected =
                (mode.id === 'OWNER' && currentRole === 'OWNER') ||
                (mode.id === 'RENTER' && currentRole === 'RENTER');

              return (
                <Pressable
                  key={mode.id}
                  style={({ pressed }) => [
                    styles.modeCard,
                    isSelected && styles.modeCardSelected,
                    pressed && styles.cardPressed,
                  ]}
                  onPress={() => handleSelectMode(mode)}
                  accessibilityRole="button"
                  accessibilityLabel={`Switch to ${mode.title}`}
                >
                  <View
                    style={[styles.iconWrap, { backgroundColor: mode.iconBg }]}
                  >
                    {mode.icon}
                  </View>

                  <View style={styles.modeContent}>
                    <View style={styles.titleRow}>
                      <Text style={styles.modeTitle}>{mode.title}</Text>
                      {isSelected ? (
                        <View style={styles.activePill}>
                          <CheckCircle2 size={12} color="#32B768" strokeWidth={2.4} />
                          <Text style={styles.activePillText}>Active</Text>
                        </View>
                      ) : (
                        <View style={styles.badgePill}>
                          <Text style={styles.badgeText}>{mode.badge}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.modeSubtitle}>{mode.subtitle}</Text>
                  </View>

                  <View style={styles.arrowWrap}>
                    <ArrowRight
                      size={16}
                      color={isSelected ? '#6C4DFF' : '#777482'}
                      strokeWidth={2.2}
                    />
                  </View>
                </Pressable>
              );
            })}
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
  listContainer: {
    gap: 12,
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#F8F7F4',
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
    gap: 14,
  },
  modeCardSelected: {
    backgroundColor: '#FAF9FF',
    borderColor: '#6C4DFF',
  },
  cardPressed: {
    opacity: 0.92,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeContent: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  modeTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.2,
  },
  modeSubtitle: {
    fontSize: 12,
    color: '#777482',
    lineHeight: 16,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
  },
  badgePill: {
    backgroundColor: '#EDEBF2',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#777482',
  },
  arrowWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
