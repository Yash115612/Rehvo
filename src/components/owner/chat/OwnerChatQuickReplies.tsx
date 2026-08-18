import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';

const QUICK_REPLIES = [
  "Yes, it's available",
  'When would you like to visit?',
  'Would you like to schedule a visit?',
  'Happy to share more photos or details',
];

interface OwnerChatQuickRepliesProps {
  onSelectReply: (text: string) => void;
}

export const OwnerChatQuickReplies: React.FC<OwnerChatQuickRepliesProps> = ({
  onSelectReply,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {QUICK_REPLIES.map((reply, idx) => (
          <Pressable
            key={idx}
            style={styles.pill}
            onPress={() => onSelectReply(reply)}
            accessibilityRole="button"
            accessibilityLabel={`Quick reply: ${reply}`}
          >
            <Text style={styles.pillText}>{reply}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    backgroundColor: '#F8F7F4',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
    height: 36,
  },
  pill: {
    paddingHorizontal: 12,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#171522',
  },
});
