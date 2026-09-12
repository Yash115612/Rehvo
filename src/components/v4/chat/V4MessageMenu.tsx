import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import {
  Reply,
  Copy,
  Star,
  Share2,
  Edit3,
  Trash2,
  X,
  ShieldAlert,
} from 'lucide-react-native';
import { Message } from '../../../types';
import { triggerHaptic } from '../../../utils/haptics';

interface V4MessageMenuProps {
  visible: boolean;
  message: Message | null;
  isMe: boolean;
  isStarred?: boolean;
  onClose: () => void;
  onReply: (msg: Message) => void;
  onCopy: (text: string) => void;
  onStar: (msg: Message) => void;
  onForward: (msg: Message) => void;
  onEdit?: (msg: Message) => void;
  onDeleteForMe: (msg: Message) => void;
  onDeleteForEveryone?: (msg: Message) => void;
  onReact: (msg: Message, emoji: string) => void;
}

const QUICK_EMOJIS = ['❤️', '👍', '😂', '😮', '😢', '🙏'];

const V4MessageMenuComponent: React.FC<V4MessageMenuProps> = ({
  visible,
  message,
  isMe,
  isStarred = false,
  onClose,
  onReply,
  onCopy,
  onStar,
  onForward,
  onEdit,
  onDeleteForMe,
  onDeleteForEveryone,
  onReact,
}) => {
  if (!message) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.sheet} onStartShouldSetResponder={() => true}>
          {/* Top Emoji Quick Bar */}
          <View style={styles.emojiBar}>
            {QUICK_EMOJIS.map((emoji) => (
              <Pressable
                key={emoji}
                style={styles.emojiBtn}
                onPress={() => {
                  triggerHaptic();
                  onReact(message, emoji);
                  onClose();
                }}
                hitSlop={6}
                accessibilityRole="button"
                accessibilityLabel={`React with ${emoji}`}
              >
                <Text style={styles.emojiText}>{emoji}</Text>
              </Pressable>
            ))}
          </View>

          {/* Action List */}
          <View style={styles.menuItems}>
            <Pressable
              style={styles.item}
              onPress={() => {
                triggerHaptic();
                onReply(message);
                onClose();
              }}
              accessibilityRole="button"
              accessibilityLabel="Reply to message"
            >
              <Reply size={18} color="#0F766E" />
              <Text style={styles.itemText}>Reply</Text>
            </Pressable>

            <Pressable
              style={styles.item}
              onPress={() => {
                triggerHaptic();
                onCopy(message.text || '');
                onClose();
              }}
              accessibilityRole="button"
              accessibilityLabel="Copy message text"
            >
              <Copy size={18} color="#0F766E" />
              <Text style={styles.itemText}>Copy</Text>
            </Pressable>

            <Pressable
              style={styles.item}
              onPress={() => {
                triggerHaptic();
                onStar(message);
                onClose();
              }}
              accessibilityRole="button"
              accessibilityLabel={isStarred ? 'Unstar message' : 'Star message'}
            >
              <Star
                size={18}
                color={isStarred ? '#EAB308' : '#0F766E'}
                fill={isStarred ? '#EAB308' : 'transparent'}
              />
              <Text style={styles.itemText}>{isStarred ? 'Unstar' : 'Star'}</Text>
            </Pressable>

            <Pressable
              style={styles.item}
              onPress={() => {
                triggerHaptic();
                onForward(message);
                onClose();
              }}
              accessibilityRole="button"
              accessibilityLabel="Forward message"
            >
              <Share2 size={18} color="#0F766E" />
              <Text style={styles.itemText}>Forward</Text>
            </Pressable>

            {isMe && onEdit && message.message_type === 'text' && (
              <Pressable
                style={styles.item}
                onPress={() => {
                  triggerHaptic();
                  onEdit(message);
                  onClose();
                }}
                accessibilityRole="button"
                accessibilityLabel="Edit message"
              >
                <Edit3 size={18} color="#0F766E" />
                <Text style={styles.itemText}>Edit</Text>
              </Pressable>
            )}

            <View style={styles.divider} />

            <Pressable
              style={styles.item}
              onPress={() => {
                triggerHaptic();
                onDeleteForMe(message);
                onClose();
              }}
              accessibilityRole="button"
              accessibilityLabel="Delete for me"
            >
              <Trash2 size={18} color="#EF4444" />
              <Text style={[styles.itemText, styles.dangerText]}>Delete for Me</Text>
            </Pressable>

            {isMe && onDeleteForEveryone && (
              <Pressable
                style={styles.item}
                onPress={() => {
                  triggerHaptic();
                  onDeleteForEveryone(message);
                  onClose();
                }}
                accessibilityRole="button"
                accessibilityLabel="Delete for everyone"
              >
                <Trash2 size={18} color="#EF4444" />
                <Text style={[styles.itemText, styles.dangerText]}>Delete for Everyone</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export const V4MessageMenu = memo(V4MessageMenuComponent);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(3, 27, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
  },
  emojiBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F0FDFA',
    paddingVertical: 10,
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  emojiBtn: {
    padding: 6,
  },
  emojiText: {
    fontSize: 24,
  },
  menuItems: {
    gap: 2,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  itemText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#031B2A',
  },
  dangerText: {
    color: '#EF4444',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2ECEF',
    marginVertical: 4,
  },
});
