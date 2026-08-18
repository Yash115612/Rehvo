import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Users, Plus, ArrowRight, UserCheck } from 'lucide-react-native';
import { FlatmateProfile } from '../../types';

import { useAppStore } from '../../store/useAppStore';

interface HomeFlatmatePromoCardProps {
  myProfile: FlatmateProfile | null;
}

export const HomeFlatmatePromoCard: React.FC<HomeFlatmatePromoCardProps> = ({
  myProfile,
}) => {
  const router = useRouter();
  const { flatmateDraft } = useAppStore();

  const handlePress = () => {
    if (myProfile) {
      router.push('/(renter)/flatmate/my-profile');
    } else {
      router.push('/(renter)/flatmate/create');
    }
  };

  const hasProfile = Boolean(myProfile);
  const hasDraft = !myProfile && Boolean(flatmateDraft);

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.card, hasDraft && { borderColor: '#FDE68A' }]}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={
          hasProfile
            ? 'Manage your flatmate profile'
            : hasDraft
            ? 'Continue flatmate profile setup'
            : 'Create a flatmate profile'
        }
      >
        <View
          style={[
            styles.iconWrap,
            hasDraft && { backgroundColor: '#FEF3C7' },
          ]}
        >
          {hasProfile ? (
            <UserCheck size={20} color="#6C4DFF" strokeWidth={2.2} />
          ) : hasDraft ? (
            <Users size={20} color="#D97706" strokeWidth={2.2} />
          ) : (
            <Users size={20} color="#6C4DFF" strokeWidth={2.2} />
          )}
        </View>

        <View style={styles.textCol}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>
              {hasProfile
                ? 'My Flatmate Profile'
                : hasDraft
                ? 'Continue Flatmate Profile'
                : 'Looking for a flatmate?'}
            </Text>
            {hasProfile && (
              <View
                style={[
                  styles.statusBadge,
                  myProfile?.is_paused
                    ? styles.statusBadgePaused
                    : styles.statusBadgeLive,
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    myProfile?.is_paused
                      ? styles.statusBadgeTextPaused
                      : styles.statusBadgeTextLive,
                  ]}
                >
                  {myProfile?.is_paused ? 'Paused' : 'Published'}
                </Text>
              </View>
            )}
            {hasDraft && (
              <View style={[styles.statusBadge, styles.statusBadgePaused]}>
                <Text style={[styles.statusBadgeText, styles.statusBadgeTextPaused]}>
                  Draft
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.subtitle} numberOfLines={2}>
            {hasProfile
              ? myProfile?.is_paused
                ? 'Your profile is paused. Resume anytime to connect with renters.'
                : `Listed in ${myProfile?.locality || 'Mumbai'} · Tap to manage or edit.`
              : hasDraft
              ? 'You have an unfinished profile setup. Continue to get discovered.'
              : 'Create your profile and let people looking for a place discover you.'}
          </Text>
        </View>

        <View style={[styles.ctaBtn, hasProfile && styles.ctaBtnOutline]}>
          <Text
            style={[
              styles.ctaBtnText,
              hasProfile && styles.ctaBtnTextOutline,
            ]}
          >
            {hasProfile ? 'Manage' : hasDraft ? 'Continue' : 'Create'}
          </Text>
          <ArrowRight
            size={13}
            color={hasProfile ? '#6C4DFF' : '#FFFFFF'}
            strokeWidth={2.5}
          />
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 30,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#171522',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F0ECFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: '#171522',
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusBadgeLive: {
    backgroundColor: '#EAF8F0',
  },
  statusBadgePaused: {
    backgroundColor: '#FEF3C7',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusBadgeTextLive: {
    color: '#32B768',
  },
  statusBadgeTextPaused: {
    color: '#D97706',
  },
  subtitle: {
    fontSize: 12,
    color: '#777482',
    lineHeight: 16,
    fontWeight: '500',
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#6C4DFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  ctaBtnOutline: {
    backgroundColor: '#FAF9FF',
    borderWidth: 1,
    borderColor: '#DED6FD',
  },
  ctaBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  ctaBtnTextOutline: {
    color: '#6C4DFF',
  },
});
