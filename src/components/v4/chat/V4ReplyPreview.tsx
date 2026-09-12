import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { X, CornerDownRight } from 'lucide-react-native';
import { ChatReplyTo } from '../../../types';
import { triggerHaptic } from '../../../utils/haptics';

interface V4ReplyPreviewProps {
  replyTo: ChatReplyTo;
  onDismiss?: () => void;
  isInsideBubble?: boolean;
  isMe?: boolean;
}

const V4ReplyPreviewComponent: React.FC<V4ReplyPreviewProps> = ({
  replyTo,
  onDismiss,
  isInsideBubble = false,
  isMe = false,
}) => {
  return (
    <View
      style={[
        styles.container,
        isInsideBubble && styles.containerInsideBubble,
        isInsideBubble && isMe && styles.containerInsideMe,
      ]}
    >
      <View style={[styles.borderIndicator, isInsideBubble && isMe && styles.indicatorMe]} />
      <View style={styles.textWrap}>
        <View style={styles.senderRow}>
          <CornerDownRight size={11} color={isInsideBubble && isMe ? '#CCFBF1' : '#0F766E'} />
          <Text
            style={[
              styles.senderName,
              isInsideBubble && isMe ? styles.senderNameMe : styles.senderNameOther,
            ]}
            numberOfLines={1}
          >
            {replyTo.sender_name || 'Original Message'}
          </Text>
        </View>
        <Text
          style={[
            styles.snippet,
            isInsideBubble && isMe ? styles.snippetMe : styles.snippetOther,
          ]}
          numberOfLines={1}
        >
          {replyTo.text}
        </Text>
      </View>

      {onDismiss ? (
        <Pressable
          style={styles.dismissBtn}
          onPress={() => {
            triggerHaptic();
            onDismiss();
          }}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Dismiss reply"
        >
          <X size={15} color="#64748B" />
        </Pressable>
      ) : null}
    </View>
  );
};

export const V4ReplyPreview = memo(V4ReplyPreviewComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#0F766E',
    borderRadius: 8,
    marginBottom: 6,
  },
  containerInsideBubble: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderLeftWidth: 3,
    borderLeftColor: '#0F766E',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 6,
  },
  containerInsideMe: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderLeftColor: '#FFFFFF',
  },
  borderIndicator: {
    width: 0,
  },
  indicatorMe: {
    borderLeftColor: '#FFFFFF',
  },
  textWrap: {
    flex: 1,
  },
  senderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  senderName: {
    fontSize: 11,
    fontWeight: '800',
  },
  senderNameMe: {
    color: '#CCFBF1',
  },
  senderNameOther: {
    color: '#0F766E',
  },
  snippet: {
    fontSize: 12,
    marginTop: 1,
  },
  snippetMe: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  snippetOther: {
    color: '#334155',
  },
  dismissBtn: {
    padding: 4,
    marginLeft: 6,
  },
});
