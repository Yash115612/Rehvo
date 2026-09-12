import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';
import { Sparkles, MessageCircle, User, Home, X, Check } from 'lucide-react-native';
import { FlatmateProfile } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface MatchCelebrationModalProps {
  visible: boolean;
  flatmate: FlatmateProfile | null;
  myAvatar?: string;
  onClose: () => void;
  onStartChat: (flatmate: FlatmateProfile) => void;
  onViewProfile: (flatmate: FlatmateProfile) => void;
  onInviteApartment?: (flatmate: FlatmateProfile) => void;
}

export const MatchCelebrationModal: React.FC<MatchCelebrationModalProps> = ({
  visible,
  flatmate,
  myAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
  onClose,
  onStartChat,
  onViewProfile,
  onInviteApartment,
}) => {
  if (!flatmate) return null;

  const otherPhoto =
    (flatmate.photos && flatmate.photos[0]) ||
    flatmate.avatar ||
    flatmate.avatar_url ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80';

  const score = flatmate.match_score || flatmate.compatibility?.overall || 98;
  const firstName = flatmate.name.split(' ')[0];

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        {/* Background Scrim with Emerald Glow */}
        <View style={styles.glowCircle} />

        {/* Floating Close Button */}
        <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={10}>
          <X size={20} color="#FFFFFF" />
        </Pressable>

        <View style={styles.card}>
          {/* Sparkle Header Badge */}
          <View style={styles.sparkleBadge}>
            <Sparkles size={14} color="#059669" />
            <Text style={styles.sparkleBadgeText}>{score}% AI SYNERGY MATCH</Text>
          </View>

          {/* Celebratory Avatars Container */}
          <View style={styles.avatarsWrapper}>
            {/* My Avatar */}
            <View style={[styles.avatarBox, styles.myAvatarBox]}>
              <Image source={{ uri: myAvatar }} style={styles.avatarImg} resizeMode="cover" />
            </View>

            {/* Overlapping Heart / Match Ring */}
            <View style={styles.heartCircle}>
              <Sparkles size={18} color="#FFFFFF" strokeWidth={2.6} />
            </View>

            {/* Flatmate Avatar */}
            <View style={[styles.avatarBox, styles.otherAvatarBox]}>
              <Image source={{ uri: otherPhoto }} style={styles.avatarImg} resizeMode="cover" />
            </View>
          </View>

          {/* Title & Description */}
          <Text style={styles.headline}>It's a Mutual Match!</Text>
          <Text style={styles.subheadline}>
            You and <Text style={styles.boldName}>{flatmate.name}</Text> both waved at each other. You have {score}% compatible living habits in {flatmate.locality || 'Mumbai'}.
          </Text>

          {/* Compatibility Highlights Box */}
          <View style={styles.highlightsBox}>
            <View style={styles.highlightRow}>
              <Check size={14} color="#059669" strokeWidth={3} />
              <Text style={styles.highlightText}>Budget: ₹{((flatmate.budget_min || 15000) / 1000).toFixed(0)}k–₹{((flatmate.budget_max || 30000) / 1000).toFixed(0)}k matching</Text>
            </View>
            <View style={styles.highlightRow}>
              <Check size={14} color="#059669" strokeWidth={3} />
              <Text style={styles.highlightText}>Area: {flatmate.locality || 'Preferred localities'} aligned</Text>
            </View>
            <View style={styles.highlightRow}>
              <Check size={14} color="#059669" strokeWidth={3} />
              <Text style={styles.highlightText}>Habits: {flatmate.food_preference || 'Veg-friendly'}, {flatmate.smoking || 'Non-smoker'}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsStack}>
            <Pressable
              style={styles.chatCTA}
              onPress={() => {
                onClose();
                onStartChat(flatmate);
              }}
              accessibilityRole="button"
              accessibilityLabel={`Start chat with ${firstName}`}
            >
              <MessageCircle size={18} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.chatCTAText}>Chat with {firstName}</Text>
            </Pressable>

            {onInviteApartment && (
              <Pressable
                style={styles.inviteCTA}
                onPress={() => {
                  onClose();
                  onInviteApartment(flatmate);
                }}
                accessibilityRole="button"
                accessibilityLabel="Invite to Apartment"
              >
                <Home size={16} color="#059669" strokeWidth={2.2} />
                <Text style={styles.inviteCTAText}>Invite to Share an Apartment</Text>
              </Pressable>
            )}

            <Pressable
              style={styles.profileBtn}
              onPress={() => {
                onClose();
                onViewProfile(flatmate);
              }}
              accessibilityRole="button"
              accessibilityLabel="View full profile"
            >
              <Text style={styles.profileBtnText}>View Full Profile</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 27, 42, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    position: 'relative',
  },
  glowCircle: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(5, 150, 105, 0.35)',
    filter: Platform.OS === 'web' ? 'blur(60px)' : undefined,
  },
  closeBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 24,
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  sparkleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  sparkleBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: 0.4,
  },
  avatarsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 94,
    position: 'relative',
    marginTop: 6,
  },
  avatarBox: {
    width: 82,
    height: 82,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  myAvatarBox: {
    marginRight: -16,
    zIndex: 1,
  },
  otherAvatarBox: {
    marginLeft: -16,
    zIndex: 1,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  heartCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },
  headline: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  subheadline: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  boldName: {
    fontWeight: '800',
    color: '#0F172A',
  },
  highlightsBox: {
    width: '100%',
    backgroundColor: '#F0FDFA',
    borderRadius: 16,
    padding: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  highlightText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  actionsStack: {
    width: '100%',
    gap: 8,
    marginTop: 4,
  },
  chatCTA: {
    width: '100%',
    height: 50,
    borderRadius: 16,
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  chatCTAText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  inviteCTA: {
    width: '100%',
    height: 46,
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  inviteCTAText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#059669',
  },
  profileBtn: {
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
});
