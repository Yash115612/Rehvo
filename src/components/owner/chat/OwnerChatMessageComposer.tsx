import React from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Send, Paperclip } from 'lucide-react-native';

interface OwnerChatMessageComposerProps {
  text: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onAttachment?: () => void;
}

export const OwnerChatMessageComposer: React.FC<
  OwnerChatMessageComposerProps
> = ({ text, onChangeText, onSend, onAttachment }) => {
  const canSend = text.trim().length > 0;

  return (
    <View style={styles.container}>
      {/* Attachment Button */}
      {onAttachment && (
        <Pressable
          style={styles.attachBtn}
          onPress={onAttachment}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel="Attach photo or document"
        >
          <Paperclip size={18} color="#777482" strokeWidth={2} />
        </Pressable>
      )}

      {/* Input */}
      <View style={styles.inputWrap}>
        <TextInput
          value={text}
          onChangeText={onChangeText}
          placeholder="Write a message..."
          placeholderTextColor="#8C8994"
          style={styles.input}
          multiline
          maxLength={1000}
        />
      </View>

      {/* Send Button */}
      <Pressable
        style={[styles.sendBtn, !canSend && styles.sendBtnDisabled]}
        onPress={onSend}
        disabled={!canSend}
        accessibilityRole="button"
        accessibilityLabel="Send message"
      >
        <Send size={18} color="#FFFFFF" strokeWidth={2.2} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E5EC',
    gap: 8,
  },
  attachBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F7F5F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrap: {
    flex: 1,
    minHeight: 42,
    maxHeight: 100,
    borderRadius: 21,
    backgroundColor: '#F7F5F0',
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  input: {
    fontSize: 14,
    color: '#171522',
    paddingTop: 8,
    paddingBottom: 8,
    maxHeight: 90,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#6C4DFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#C5B7FD',
  },
});
