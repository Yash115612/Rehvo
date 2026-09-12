import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { Reply, Copy, Trash2, Pencil } from 'lucide-react-native';
import { Message } from '../../../types';
import { V4_SHADOWS } from '../../../theme/v4Theme';

interface V4MessageReactionModalProps {
  visible: boolean;
  message: Message | null;
  isMe?: boolean;
  onClose: () => void;
  onSelectEmoji: (emoji: string) => void;
  onReply?: (message: Message) => void;
  onCopy?: (text: string) => void;
  onEdit?: (message: Message) => void;
  onDeleteForMe?: (messageId: string) => void;
  onDeleteForEveryone?: (messageId: string) => void;
}

const EMOJIS = ['❤️', '👍', '👏', '🔥', '😮', '😂', '🏠', '🤝'];

export const V4MessageReactionModal: React.FC<V4MessageReactionModalProps> = ({
  visible,
  message,
  isMe = false,
  onClose,
  onSelectEmoji,
  onReply,
  onCopy,
  onEdit,
  onDeleteForMe,
  onDeleteForEveryone,
}) => {
  if (!message) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.contentCard} onPress={(e) => e.stopPropagation()}>
          {/* Reaction Emoji Row */}
          <View style={styles.emojiRow}>
            {EMOJIS.map((emo) => (
              <Pressable
                key={emo}
                style={styles.emojiBtn}
                onPress={() => {
                  onSelectEmoji(emo);
                  onClose();
                }}
              >
                <Text style={styles.emojiText}>{emo}</Text>
              </Pressable>
            ))}
          </View>

          {/* Quick Actions List */}
          <View style={styles.actionsList}>
            <Pressable
              style={styles.actionRow}
              onPress={() => {
                onClose();
                onReply?.(message);
              }}
            >
              <Reply size={16} color="#0F766E" strokeWidth={2.4} />
              <Text style={styles.actionText}>Reply to Message</Text>
            </Pressable>

            {Boolean(message.text) && !message.is_deleted && (
              <Pressable
                style={styles.actionRow}
                onPress={() => {
                  onClose();
                  onCopy?.(message.text);
                }}
              >
                <Copy size={16} color="#475569" strokeWidth={2.4} />
                <Text style={styles.actionText}>Copy Text</Text>
              </Pressable>
            )}

            {isMe && !message.is_deleted && Boolean(message.text) && onEdit && (
              <Pressable
                style={styles.actionRow}
                onPress={() => {
                  onClose();
                  onEdit(message);
                }}
              >
                <Pencil size={16} color="#0F766E" strokeWidth={2.4} />
                <Text style={[styles.actionText, { color: '#0F766E' }]}>Edit Message</Text>
              </Pressable>
            )}

            {isMe && !message.is_deleted && onDeleteForEveryone && (
              <Pressable
                style={styles.actionRow}
                onPress={() => {
                  onClose();
                  onDeleteForEveryone(message.id);
                }}
              >
                <Trash2 size={16} color="#B91C1C" strokeWidth={2.4} />
                <Text style={[styles.actionText, { color: '#B91C1C' }]}>Delete for Everyone</Text>
              </Pressable>
            )}

            <Pressable
              style={[styles.actionRow, { borderBottomWidth: 0 }]}
              onPress={() => {
                onClose();
                onDeleteForMe?.(message.id);
              }}
            >
              <Trash2 size={16} color="#DC2626" strokeWidth={2.4} />
              <Text style={[styles.actionText, { color: '#DC2626' }]}>Delete for Me</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    width: '100%',
    maxWidth: 320,
    ...V4_SHADOWS.card,
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emojiBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: 20,
  },
  actionsList: {
    marginTop: 14,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  actionText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
});
