import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';
import { Sparkles, MessageCircle, ArrowRight, Heart, ShieldCheck, X } from 'lucide-react-native';
import { FlatmateProfile } from '../../../types';
import { V4_COLORS, V4_SHADOWS } from '../../../theme/v4Theme';

const { width } = Dimensions.get('window');

interface V4MatchCelebrationModalProps {
  visible: boolean;
  flatmate: FlatmateProfile | null;
  currentUserAvatar?: string;
  onClose: () => void;
  onSendMessage: (flatmate: FlatmateProfile) => void;
}

export const V4MatchCelebrationModal: React.FC<V4MatchCelebrationModalProps> = ({
  visible,
  flatmate,
  currentUserAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  onClose,
  onSendMessage,
}) => {
  if (!flatmate) return null;

  const targetAvatar =
    flatmate.photos && flatmate.photos.length > 0
      ? flatmate.photos[0]
      : flatmate.avatar_url || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80';

  const matchPercent = flatmate.compatibility?.overall_score || 94;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Close button */}
          <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={12}>
            <X size={20} color="#FFFFFF" strokeWidth={2.4} />
          </Pressable>

          {/* Top Badge */}
          <View style={styles.badgeRow}>
            <Sparkles size={14} color="#5EEAD4" />
            <Text style={styles.badgeText}>MUTUAL ATTRACTION</Text>
            <Sparkles size={14} color="#5EEAD4" />
          </View>

          {/* Title */}
          <Text style={styles.title}>It's a Flatmate Match!</Text>
          <Text style={styles.subtitle}>
            You and <Text style={styles.boldName}>{flatmate.name.split(' ')[0]}</Text> liked each other's lifestyle & co-living preferences.
          </Text>

          {/* Dual Avatars with Match Ring */}
          <View style={styles.avatarsContainer}>
            <View style={styles.avatarWrapLeft}>
              <Image source={{ uri: currentUserAvatar }} style={styles.avatar} />
            </View>

            <View style={styles.heartCenter}>
              <View style={styles.heartInner}>
                <Heart size={20} color="#FFFFFF" fill="#0F766E" />
              </View>
              <View style={styles.matchPill}>
                <Text style={styles.matchPillText}>{matchPercent}%</Text>
              </View>
            </View>

            <View style={styles.avatarWrapRight}>
              <Image source={{ uri: targetAvatar }} style={styles.avatar} />
            </View>
          </View>

          {/* Compatibility Highlights */}
          <View style={styles.highlightBox}>
            <View style={styles.highlightItem}>
              <Text style={styles.highlightEmoji}>📍</Text>
              <Text style={styles.highlightText} numberOfLines={1}>
                {flatmate.preferred_localities?.[0] || flatmate.locality || 'Same City'}
              </Text>
            </View>
            <View style={styles.highlightDivider} />
            <View style={styles.highlightItem}>
              <Text style={styles.highlightEmoji}>💰</Text>
              <Text style={styles.highlightText}>
                ₹{(flatmate.budget_max || 25000).toLocaleString('en-IN')}/mo
              </Text>
            </View>
            <View style={styles.highlightDivider} />
            <View style={styles.highlightItem}>
              <ShieldCheck size={14} color="#14B8A6" />
              <Text style={styles.highlightText}>Verified</Text>
            </View>
          </View>

          {/* Primary Action: Send Message */}
          <Pressable
            style={styles.chatBtn}
            onPress={() => onSendMessage(flatmate)}
          >
            <MessageCircle size={18} color="#031B2A" strokeWidth={2.4} />
            <Text style={styles.chatBtnText}>Say Hello to {flatmate.name.split(' ')[0]}</Text>
            <ArrowRight size={16} color="#031B2A" strokeWidth={2.4} />
          </Pressable>

          {/* Secondary Action: Keep Swiping */}
          <Pressable style={styles.keepBtn} onPress={onClose}>
            <Text style={styles.keepBtnText}>Keep Swiping</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 27, 42, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: Math.min(width - 40, 380),
    backgroundColor: '#072535',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(20, 184, 166, 0.3)',
    ...V4_SHADOWS.card,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(20, 184, 166, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(20, 184, 166, 0.3)',
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#5EEAD4',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.75)',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  boldName: {
    color: '#5EEAD4',
    fontWeight: '700',
  },
  avatarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
    width: '100%',
    height: 100,
  },
  avatarWrapLeft: {
    position: 'absolute',
    left: '22%',
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 3,
    borderColor: '#14B8A6',
    overflow: 'hidden',
    backgroundColor: '#0F766E',
    shadowColor: '#14B8A6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  avatarWrapRight: {
    position: 'absolute',
    right: '22%',
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 3,
    borderColor: '#5EEAD4',
    overflow: 'hidden',
    backgroundColor: '#0F766E',
    shadowColor: '#5EEAD4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  heartCenter: {
    position: 'absolute',
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartInner: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#14B8A6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#072535',
  },
  matchPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: -6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  matchPillText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#0F766E',
  },
  highlightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 20,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  highlightEmoji: {
    fontSize: 13,
  },
  highlightText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  highlightDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#14B8A6',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 10,
  },
  chatBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#031B2A',
  },
  keepBtn: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keepBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
  },
});
