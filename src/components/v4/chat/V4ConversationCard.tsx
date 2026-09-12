import React, { useState, memo } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Modal } from 'react-native';
import {
  ShieldCheck,
  Pin,
  Archive,
  Check,
  CheckCheck,
  BellOff,
  Trash2,
  X,
  MoreVertical,
  Clock,
} from 'lucide-react-native';
import { Conversation } from '../../../types';
import { V4_COLORS, V4_SHADOWS } from '../../../theme/v4Theme';

export interface V4ConversationCardProps {
  conversation: Conversation;
  onPress: () => void;
  onPin?: () => void;
  onArchive?: () => void;
  onMarkRead?: () => void;
  onMute?: () => void;
  onDelete?: () => void;
  isOnline?: boolean;
  isTyping?: boolean;
  isLastMessageMine?: boolean;
  lastMessageStatus?: 'sending' | 'sent' | 'delivered' | 'read';
}

function formatRelativeTimestamp(dateStr?: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) {
    return 'Yesterday';
  }

  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: 'short' });
  }

  return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
}

export const V4ConversationCardComponent: React.FC<V4ConversationCardProps> = ({
  conversation,
  onPress,
  onPin,
  onArchive,
  onMarkRead,
  onMute,
  onDelete,
  isOnline: propIsOnline,
  isTyping = false,
  isLastMessageMine = false,
  lastMessageStatus,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const isOnline = propIsOnline !== undefined ? propIsOnline : Boolean(conversation.is_online);
  const isPinned = conversation.is_pinned ?? false;
  const isArchived = conversation.is_archived ?? false;
  const isMuted = conversation.is_muted ?? false;
  const unreadCount = conversation.unread_count || 0;

  const timeStr = formatRelativeTimestamp(conversation.updated_at);

  const lastMsg = (conversation.messages || [])[conversation.messages?.length - 1];
  const effectiveStatus = lastMessageStatus || lastMsg?.status || 'sent';

  return (
    <>
      <Pressable
        style={[styles.row, isPinned && styles.rowPinned]}
        onPress={onPress}
        onLongPress={() => setMenuVisible(true)}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Chat with ${conversation.other_user_name || 'User'}, ${timeStr}`}
      >
        {/* Avatar with Presence Indicator */}
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

        {/* Center Details */}
        <View style={styles.centerCol}>
          <View style={styles.nameRow}>
            <View style={styles.nameBadgeRow}>
              <Text style={styles.nameText} numberOfLines={1}>
                {conversation.other_user_name || 'Contact'}
              </Text>
              {conversation.is_verified && (
                <ShieldCheck size={13} color="#16A34A" strokeWidth={2.6} />
              )}
            </View>

            <View style={styles.timeWrap}>
              {isPinned && <Pin size={11} color="#0F766E" strokeWidth={2.4} />}
              {isMuted && <BellOff size={11} color="#94A3B8" />}
              <Text style={[styles.timeText, unreadCount > 0 && styles.timeTextUnread]}>
                {timeStr}
              </Text>
            </View>
          </View>

          {/* Property or Flatmate Compatibility Subtitle Pill */}
          {conversation.type === 'flatmate' && conversation.match_score ? (
            <View style={styles.matchPill}>
              <Text style={styles.matchPillText}>
                ✨ {conversation.match_score}% Match • {conversation.flatmate_locality || 'Looking for Flat'}
              </Text>
            </View>
          ) : conversation.property_title ? (
            <View style={styles.propertyPill}>
              {conversation.property_image ? (
                <Image
                  source={{ uri: conversation.property_image }}
                  style={styles.propertyThumb}
                />
              ) : null}
              <Text style={styles.propertyPillText} numberOfLines={1}>
                {conversation.property_title}
                {conversation.property_rent ? ` • ₹${conversation.property_rent.toLocaleString('en-IN')}` : ''}
              </Text>
            </View>
          ) : null}

          {/* Last Message Row or Realtime Typing Indicator */}
          <View style={styles.messageRow}>
            {isTyping ? (
              <View style={styles.typingContainer}>
                <Text style={styles.typingText}>typing...</Text>
              </View>
            ) : (
              <View style={styles.snippetWrap}>
                {isLastMessageMine && (
                  <View style={styles.receiptTick}>
                    {effectiveStatus === 'sending' && <Clock size={11} color="#94A3B8" />}
                    {effectiveStatus === 'sent' && <Check size={13} color="#94A3B8" strokeWidth={2.4} />}
                    {effectiveStatus === 'delivered' && (
                      <CheckCheck size={13} color="#94A3B8" strokeWidth={2.4} />
                    )}
                    {effectiveStatus === 'read' && (
                      <CheckCheck size={13} color="#0F766E" strokeWidth={2.6} />
                    )}
                  </View>
                )}
                <Text
                  style={[
                    styles.messageSnippet,
                    unreadCount > 0 && styles.messageSnippetUnread,
                  ]}
                  numberOfLines={1}
                >
                  {conversation.last_message || 'Start chatting with verified listing...'}
                </Text>
              </View>
            )}

            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>

      {/* Long-Press Action Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuSheet}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>{conversation.other_user_name || 'Conversation'}</Text>
              <Pressable
                onPress={() => setMenuVisible(false)}
                hitSlop={12}
                style={styles.closeBtn}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Close menu"
              >
                <X size={18} color="#64748B" />
              </Pressable>
            </View>

            {onPin && (
              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  onPin();
                }}
                accessible={true}
                accessibilityRole="button"
              >
                <Pin size={18} color="#0F766E" strokeWidth={2.2} />
                <Text style={styles.menuItemText}>{isPinned ? 'Unpin Conversation' : 'Pin to Top'}</Text>
              </Pressable>
            )}

            {onMarkRead && (
              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  onMarkRead();
                }}
                accessible={true}
                accessibilityRole="button"
              >
                <CheckCheck size={18} color="#0F766E" strokeWidth={2.2} />
                <Text style={styles.menuItemText}>Mark as Read</Text>
              </Pressable>
            )}

            {onMute && (
              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  onMute();
                }}
                accessible={true}
                accessibilityRole="button"
              >
                <BellOff size={18} color="#64748B" strokeWidth={2.2} />
                <Text style={styles.menuItemText}>{isMuted ? 'Unmute Notifications' : 'Mute Notifications'}</Text>
              </Pressable>
            )}

            {onArchive && (
              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  onArchive();
                }}
                accessible={true}
                accessibilityRole="button"
              >
                <Archive size={18} color="#64748B" strokeWidth={2.2} />
                <Text style={styles.menuItemText}>{isArchived ? 'Unarchive' : 'Archive Conversation'}</Text>
              </Pressable>
            )}

            {onDelete && (
              <Pressable
                style={[styles.menuItem, styles.menuItemDestructive]}
                onPress={() => {
                  setMenuVisible(false);
                  onDelete();
                }}
                accessible={true}
                accessibilityRole="button"
              >
                <Trash2 size={18} color="#DC2626" strokeWidth={2.2} />
                <Text style={[styles.menuItemText, { color: '#DC2626' }]}>Delete Conversation</Text>
              </Pressable>
            )}
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

export const V4ConversationCard = memo(V4ConversationCardComponent);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F1F5F9',
    minHeight: 74,
  },
  rowPinned: {
    backgroundColor: '#F0FDFA',
  },
  avatarWrap: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E2E8F0',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  centerCol: {
    flex: 1,
    justifyContent: 'center',
    gap: 3,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
    paddingRight: 8,
  },
  nameText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  timeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 11.5,
    color: '#94A3B8',
    fontWeight: '600',
  },
  timeTextUnread: {
    color: '#0F766E',
    fontWeight: '800',
  },
  propertyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    maxWidth: '90%',
  },
  propertyThumb: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  propertyPillText: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
  },
  matchPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    maxWidth: '90%',
  },
  matchPillText: {
    fontSize: 10.5,
    color: '#0F766E',
    fontWeight: '800',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 20,
  },
  snippetWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  receiptTick: {
    marginRight: 4,
  },
  messageSnippet: {
    flex: 1,
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  messageSnippetUnread: {
    color: '#0F172A',
    fontWeight: '700',
  },
  typingContainer: {
    flex: 1,
  },
  typingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F766E',
    fontStyle: 'italic',
  },
  unreadBadge: {
    backgroundColor: '#0F766E',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '900',
  },

  // Modal Sheet
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 27, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  menuSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 34,
    gap: 4,
    ...V4_SHADOWS.card,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 8,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 48,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  menuItemDestructive: {
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#FEE2E2',
    paddingTop: 14,
  },
  menuItemText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#334155',
  },
});
