import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check, CheckCheck } from 'lucide-react-native';
import { Message } from '../../../types';

interface OwnerChatMessageBubbleProps {
  message: Message;
  isOwner: boolean;
}

export const OwnerChatMessageBubble: React.FC<OwnerChatMessageBubbleProps> = ({
  message,
  isOwner,
}) => {
  const formatTime = (iso: string) => {
    try {
      const date = new Date(iso);
      if (isNaN(date.getTime())) return '10:42 AM';
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '10:42 AM';
    }
  };

  const timeStr = formatTime(message.created_at);

  return (
    <View
      style={[
        styles.container,
        isOwner ? styles.ownerContainer : styles.renterContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isOwner ? styles.ownerBubble : styles.renterBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isOwner ? styles.ownerText : styles.renterText,
          ]}
        >
          {message.text}
        </Text>

        <View style={styles.metaRow}>
          <Text
            style={[
              styles.timeText,
              isOwner ? styles.ownerTimeText : styles.renterTimeText,
            ]}
          >
            {timeStr}
          </Text>
          {isOwner && (
            <CheckCheck
              size={13}
              color="#ECE7FF"
              strokeWidth={2.2}
              style={styles.checkIcon}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 4,
  },
  ownerContainer: {
    alignItems: 'flex-end',
  },
  renterContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    gap: 4,
  },
  ownerBubble: {
    backgroundColor: '#6C4DFF',
    borderBottomRightRadius: 4,
  },
  renterBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  ownerText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  renterText: {
    color: '#171522',
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 3,
  },
  timeText: {
    fontSize: 10.5,
  },
  ownerTimeText: {
    color: '#ECE7FF',
  },
  renterTimeText: {
    color: '#777482',
  },
  checkIcon: {
    marginTop: 1,
  },
});
