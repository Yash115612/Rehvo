import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import {
  ShieldCheck,
  Calendar,
  IndianRupee,
  Pin,
  Check,
  CheckCheck,
  Clock,
  CheckSquare,
  Square,
  Sparkles,
} from 'lucide-react-native';
import { Conversation } from '../../../types';
import { V4_COLORS, V4_SHADOWS } from '../../../theme/v4Theme';

interface V4OwnerLeadCardProps {
  conversation: Conversation;
  isOnline: boolean;
  isTyping: boolean;
  isSelected?: boolean;
  isBulkMode?: boolean;
  onPress: () => void;
  onLongPress?: () => void;
  onSelect?: () => void;
}

function formatLeadTimestamp(dateStr?: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

const V4OwnerLeadCardComponent: React.FC<V4OwnerLeadCardProps> = ({
  conversation,
  isOnline,
  isTyping,
  isSelected = false,
  isBulkMode = false,
  onPress,
  onLongPress,
  onSelect,
}) => {
  const isPinned = conversation.is_pinned ?? false;
  const unreadCount = conversation.unread_count || 0;
  const hasVisit = (conversation.messages || []).some(
    (m) => m.message_type === 'visit' || Boolean(m.metadata?.visit)
  );

  const budget = conversation.flatmate_budget
    ? `₹${(conversation.flatmate_budget / 1000).toFixed(0)}k/mo`
    : conversation.rent || conversation.property_rent
    ? `₹${((conversation.rent || conversation.property_rent || 65000) / 1000).toFixed(0)}k/mo`
    : '₹55k–₹70k/mo';

  const moveInDate = conversation.metadata?.move_in_date || 'Immediate Move-in';
  const compatibilityScore = conversation.match_score || 94;

  return (
    <Pressable
      style={[
        styles.card,
        isPinned && styles.cardPinned,
        isSelected && styles.cardSelected,
      ]}
      onPress={isBulkMode ? onSelect : onPress}
      onLongPress={onLongPress}
      accessibilityRole="button"
      accessibilityLabel={`Lead from ${conversation.other_user_name || 'Tenant'}`}
    >
      {/* Selection Checkbox in Bulk Mode */}
      {isBulkMode && (
        <Pressable style={styles.checkboxTouch} onPress={onSelect}>
          {isSelected ? (
            <CheckSquare size={20} color="#0F766E" />
          ) : (
            <Square size={20} color="#94A3B8" />
          )}
        </Pressable>
      )}

      {/* Tenant Avatar */}
      <View style={styles.avatarWrap}>
        <Image
          source={{
            uri:
              conversation.other_user_avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          }}
          style={styles.avatar}
        />
        {isOnline && <View style={styles.onlineDot} />}
      </View>

      {/* Main Content */}
      <View style={styles.detailsCol}>
        {/* Top Header Row */}
        <View style={styles.topRow}>
          <View style={styles.nameRow}>
            <Text style={styles.nameText} numberOfLines={1}>
              {conversation.other_user_name || 'Verified Applicant'}
            </Text>
            <ShieldCheck size={13} color="#16A34A" strokeWidth={2.6} />
          </View>
          <View style={styles.timeRow}>
            {isPinned && <Pin size={11} color="#0F766E" strokeWidth={2.4} />}
            <Text style={[styles.timeText, unreadCount > 0 && styles.timeTextUnread]}>
              {formatLeadTimestamp(conversation.updated_at)}
            </Text>
          </View>
        </View>

        {/* Lead Badges Strip (Budget, Move-in, Score, Visit) */}
        <View style={styles.leadBadgesRow}>
          <View style={styles.budgetBadge}>
            <Text style={styles.budgetBadgeText}>{budget}</Text>
          </View>
          <View style={styles.moveInBadge}>
            <Text style={styles.moveInBadgeText}>{moveInDate}</Text>
          </View>
          {hasVisit ? (
            <View style={styles.visitBadge}>
              <Calendar size={10} color="#0F766E" />
              <Text style={styles.visitBadgeText}>Visit Booked</Text>
            </View>
          ) : (
            <View style={styles.scoreBadge}>
              <Sparkles size={9} color="#D97706" />
              <Text style={styles.scoreBadgeText}>{compatibilityScore}% Match</Text>
            </View>
          )}
        </View>

        {/* Interested Property Strip */}
        {conversation.property_title ? (
          <View style={styles.propRow}>
            {conversation.property_image ? (
              <Image
                source={{ uri: conversation.property_image }}
                style={styles.propThumb}
              />
            ) : null}
            <Text style={styles.propTitle} numberOfLines={1}>
              Interested in {conversation.property_title}
            </Text>
          </View>
        ) : null}

        {/* Message Snippet or Typing */}
        <View style={styles.msgRow}>
          {isTyping ? (
            <Text style={styles.typingText}>Applicant is typing...</Text>
          ) : (
            <Text
              style={[styles.msgSnippet, unreadCount > 0 && styles.msgSnippetUnread]}
              numberOfLines={1}
            >
              {conversation.last_message || 'New lead inquiry initiated.'}
            </Text>
          )}

          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export const V4OwnerLeadCard = memo(V4OwnerLeadCardComponent);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2ECEF',
    marginVertical: 4,
    gap: 12,
    ...V4_SHADOWS.soft,
  },
  cardPinned: {
    backgroundColor: '#F0FDFA',
    borderColor: '#CCFBF1',
  },
  cardSelected: {
    backgroundColor: '#CCFBF1',
    borderColor: '#0F766E',
  },
  checkboxTouch: {
    alignSelf: 'center',
    paddingRight: 4,
  },
  avatarWrap: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E2ECEF',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: '#16A34A',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  detailsCol: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
  },
  nameText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#031B2A',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  timeTextUnread: {
    color: '#0F766E',
    fontWeight: '800',
  },
  leadBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: 6,
  },
  budgetBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  budgetBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#16A34A',
  },
  moveInBadge: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  moveInBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  visitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  visitBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F766E',
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  scoreBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D97706',
  },
  propRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  propThumb: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  propTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
    flex: 1,
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  typingText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#0F766E',
    fontWeight: '600',
  },
  msgSnippet: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
  },
  msgSnippetUnread: {
    color: '#031B2A',
    fontWeight: '700',
  },
  unreadBadge: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
});
