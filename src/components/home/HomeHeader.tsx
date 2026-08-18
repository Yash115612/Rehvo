import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { UserPlus, UserCheck, Pencil, Users } from 'lucide-react-native';
import { UserProfile, FlatmateProfile } from '../../types';

interface HomeHeaderProps {
  user: UserProfile | null;
  myFlatmateProfile?: FlatmateProfile | null;
  flatmateDraft?: Partial<FlatmateProfile> | null;
  onFlatmatePress?: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  user,
  myFlatmateProfile,
  flatmateDraft,
  onFlatmatePress,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning,';
    if (hour < 17) return 'Good afternoon,';
    return 'Good evening,';
  };

  const avatarUri =
    user?.avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';

  const hasProfile = Boolean(myFlatmateProfile);
  const isPaused = Boolean(myFlatmateProfile?.is_paused);
  const hasDraft = !hasProfile && Boolean(flatmateDraft);

  return (
    <View style={styles.container}>
      {/* Left: User Avatar & Greeting */}
      <View style={styles.leftCol}>
        <Image
          source={{ uri: avatarUri }}
          style={styles.avatar}
          resizeMode="cover"
        />
        <View style={styles.textWrap}>
          <Text style={styles.greetingText}>
            {getGreeting()} {user?.name ? user.name.split(' ')[0] : ''}
          </Text>
          <Text style={styles.mainTitle}>Find your next home</Text>
        </View>
      </View>

      {/* Right: Flatmate Profile Action (Replaces Bell) */}
      <Pressable
        style={[
          styles.flatmateActionBtn,
          hasDraft && styles.draftActionBtn,
          isPaused && styles.pausedActionBtn,
        ]}
        onPress={onFlatmatePress}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel={
          hasProfile
            ? isPaused
              ? 'Resume Flatmate Profile'
              : 'My Flatmate Profile'
            : hasDraft
            ? 'Continue Flatmate Profile Setup'
            : 'Create Flatmate Profile'
        }
      >
        {hasProfile ? (
          <>
            <View style={styles.iconWithDot}>
              <UserCheck size={15} color={isPaused ? '#D97706' : '#6C4DFF'} strokeWidth={2.2} />
              <View
                style={[
                  styles.statusDot,
                  isPaused ? styles.statusDotPaused : styles.statusDotLive,
                ]}
              />
            </View>
            <Text
              style={[
                styles.flatmateActionText,
                isPaused && styles.pausedActionText,
              ]}
            >
              {isPaused ? 'Resume Flatmate' : 'My Flatmate'}
            </Text>
          </>
        ) : hasDraft ? (
          <>
            <Pencil size={13} color="#D97706" strokeWidth={2.2} />
            <Text style={[styles.flatmateActionText, styles.draftActionText]}>
              Continue Flatmate
            </Text>
          </>
        ) : (
          <>
            <UserPlus size={14} color="#6C4DFF" strokeWidth={2.2} />
            <Text style={styles.flatmateActionText}>+ Flatmate</Text>
          </>
        )}
      </Pressable>
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
    paddingBottom: 4,
    backgroundColor: '#F8F7F4',
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8E5EC',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  textWrap: {
    flex: 1,
  },
  greetingText: {
    fontSize: 12.5,
    color: '#777482',
    fontWeight: '600',
  },
  mainTitle: {
    fontSize: 17.5,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.3,
    marginTop: 1,
  },
  flatmateActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#DED6FD',
    shadowColor: '#6C4DFF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  draftActionBtn: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  pausedActionBtn: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  flatmateActionText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  draftActionText: {
    color: '#D97706',
  },
  pausedActionText: {
    color: '#D97706',
  },
  iconWithDot: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDot: {
    position: 'absolute',
    bottom: -1,
    right: -2,
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  statusDotLive: {
    backgroundColor: '#32B768',
  },
  statusDotPaused: {
    backgroundColor: '#D97706',
  },
});
