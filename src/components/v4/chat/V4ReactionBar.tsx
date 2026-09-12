import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { triggerHaptic } from '../../../utils/haptics';

interface V4ReactionBarProps {
  reactions?: { [emoji: string]: string[] };
  currentUserId?: string;
  onReact: (emoji: string) => void;
  quickReactions?: string[];
}

const DEFAULT_QUICK_EMOJIS = ['❤️', '👍', '😂', '😮', '😢', '🙏'];

const V4ReactionBarComponent: React.FC<V4ReactionBarProps> = ({
  reactions = {},
  currentUserId,
  onReact,
  quickReactions = DEFAULT_QUICK_EMOJIS,
}) => {
  const reactionEntries = Object.entries(reactions).filter(([_, userIds]) => userIds?.length > 0);

  return (
    <View style={styles.container}>
      {/* Existing Reactions Counter Badges */}
      {reactionEntries.length > 0 && (
        <View style={styles.reactionBadgesRow}>
          {reactionEntries.map(([emoji, userIds]) => {
            const hasReacted = currentUserId ? userIds.includes(currentUserId) : false;
            return (
              <Pressable
                key={emoji}
                style={[styles.badge, hasReacted && styles.badgeActive]}
                onPress={() => {
                  triggerHaptic();
                  onReact(emoji);
                }}
                hitSlop={6}
                accessibilityRole="button"
                accessibilityLabel={`${emoji} ${userIds.length}`}
              >
                <Text style={styles.badgeEmoji}>{emoji}</Text>
                <Text style={[styles.badgeCount, hasReacted && styles.badgeCountActive]}>
                  {userIds.length}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
};

export const V4ReactionBar = memo(V4ReactionBarComponent);

const styles = StyleSheet.create({
  container: {
    marginTop: 3,
  },
  reactionBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2ECEF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  badgeActive: {
    backgroundColor: '#CCFBF1',
    borderColor: '#0F766E',
  },
  badgeEmoji: {
    fontSize: 12,
  },
  badgeCount: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
  },
  badgeCountActive: {
    color: '#0F766E',
  },
});
