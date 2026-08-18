import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { ShieldCheck, Pencil, Phone, Mail } from 'lucide-react-native';
import { UserProfile } from '../../../types';

interface OwnerProfileHeroProps {
  user: UserProfile | null;
  onEditProfile: () => void;
}

export const OwnerProfileHero: React.FC<OwnerProfileHeroProps> = ({
  user,
  onEditProfile,
}) => {
  const isVerified = user?.verification_status === 'VERIFIED';
  const displayName = user?.name || 'Property Owner';
  const avatarUri =
    user?.avatar ||
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80';

  const initials =
    user?.name
      ?.split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'OW';

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.topRow}>
          {/* Avatar with Verified Ring */}
          <View style={styles.avatarWrap}>
            <Image
              source={{ uri: avatarUri }}
              style={styles.avatar}
              resizeMode="cover"
            />
            {isVerified && (
              <View style={styles.verifiedDot}>
                <ShieldCheck size={12} color="#FFFFFF" strokeWidth={2.5} />
              </View>
            )}
          </View>

          {/* Info */}
          <View style={styles.infoCol}>
            <Text style={styles.name} numberOfLines={1}>
              {displayName}
            </Text>

            <View style={styles.badgeRow}>
              <View style={styles.ownerBadge}>
                <Text style={styles.ownerBadgeText}>Property Owner</Text>
              </View>

              {isVerified && (
                <View style={styles.verifiedBadge}>
                  <ShieldCheck size={11} color="#32B768" strokeWidth={2.5} />
                  <Text style={styles.verifiedBadgeText}>Verified</Text>
                </View>
              )}
            </View>

            {/* Phone & Email row */}
            <View style={styles.contactRow}>
              {user?.phone ? (
                <View style={styles.contactItem}>
                  <Phone size={11} color="#777482" strokeWidth={2} />
                  <Text style={styles.contactText}>{user.phone}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        {/* Edit Profile Button */}
        <Pressable
          style={styles.editBtn}
          onPress={onEditProfile}
          accessibilityRole="button"
          accessibilityLabel="Edit profile details"
        >
          <Pencil size={14} color="#6C4DFF" strokeWidth={2.2} />
          <Text style={styles.editBtnText}>Edit Profile</Text>
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
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 16,
    gap: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E8E5EC',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  verifiedDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#32B768',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  infoCol: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.3,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  ownerBadge: {
    backgroundColor: '#F0ECFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ownerBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#EAF8F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  verifiedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#32B768',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  contactText: {
    fontSize: 11.5,
    color: '#777482',
    fontWeight: '500',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F7F5F0',
    borderWidth: 1,
    borderColor: '#E8E5EC',
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6C4DFF',
  },
});
