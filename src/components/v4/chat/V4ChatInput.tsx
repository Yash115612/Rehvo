import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Platform,
} from 'react-native';
import { Plus, Send, Mic, X, Reply, Pencil, Trash2, Check } from 'lucide-react-native';
import { ChatReplyTo, Message } from '../../../types';
import { V4_SHADOWS } from '../../../theme/v4Theme';

interface V4ChatInputProps {
  onSend: (text: string) => void;
  onOpenAttachments: () => void;
  onVoicePress?: () => void;
  onSendVoiceNote?: (durationSeconds: number) => void;
  onTyping?: (isTyping: boolean) => void;
  replyTo?: ChatReplyTo | null;
  onCancelReply?: () => void;
  editingMessage?: Message | null;
  onCancelEdit?: () => void;
  onSaveEdit?: (messageId: string, newText: string) => void;
  placeholder?: string;
  paddingBottom?: number;
}

export const V4ChatInput: React.FC<V4ChatInputProps> = ({
  onSend,
  onOpenAttachments,
  onVoicePress,
  onSendVoiceNote,
  onTyping,
  replyTo,
  onCancelReply,
  editingMessage,
  onCancelEdit,
  onSaveEdit,
  placeholder = 'Type a message...',
  paddingBottom = 12,
}) => {
  const [inputText, setInputText] = useState('');
  const typingTimerRef = useRef<any>(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordTimerRef = useRef<any>(null);

  useEffect(() => {
    if (editingMessage) {
      setInputText(editingMessage.text || '');
    }
  }, [editingMessage]);

  useEffect(() => {
    return () => {
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, []);

  const handleTextChange = (txt: string) => {
    setInputText(txt);

    if (onTyping) {
      onTyping(true);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        onTyping(false);
      }, 2000);
    }
  };

  const handleSendPress = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    if (editingMessage && onSaveEdit) {
      onSaveEdit(editingMessage.id, trimmed);
      setInputText('');
      onCancelEdit?.();
      return;
    }

    onSend(trimmed);
    setInputText('');
    if (onTyping) onTyping(false);
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    recordTimerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  };

  const cancelVoiceRecording = () => {
    if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  const finishAndSendVoiceRecording = () => {
    if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    const dur = recordingSeconds > 0 ? recordingSeconds : 1;
    setIsRecording(false);
    setRecordingSeconds(0);
    if (onSendVoiceNote) {
      onSendVoiceNote(dur);
    } else if (onVoicePress) {
      onVoicePress();
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <View style={[styles.wrapper, { paddingBottom }]}>
      {/* Editing Banner */}
      {editingMessage && (
        <View style={styles.editBanner}>
          <Pencil size={14} color="#0F766E" strokeWidth={2.4} />
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.editBannerTitle}>Editing Message</Text>
            <Text style={styles.editBannerSnippet} numberOfLines={1}>
              {editingMessage.text}
            </Text>
          </View>
          <Pressable onPress={onCancelEdit} style={styles.bannerCancelBtn}>
            <X size={14} color="#64748B" />
          </Pressable>
        </View>
      )}

      {/* Reply Banner */}
      {!editingMessage && replyTo && (
        <View style={styles.replyBanner}>
          <Reply size={14} color="#0F766E" strokeWidth={2.4} />
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.replySenderText}>Replying to {replyTo.sender_name}</Text>
            <Text style={styles.replySnippetText} numberOfLines={1}>
              {replyTo.text}
            </Text>
          </View>
          <Pressable onPress={onCancelReply} style={styles.bannerCancelBtn}>
            <X size={14} color="#64748B" />
          </Pressable>
        </View>
      )}

      {/* Main Bar: Voice Recording UI or Input Bar */}
      {isRecording ? (
        <View style={styles.recordingRow}>
          <View style={styles.recordingIndicatorBox}>
            <View style={styles.recordingPulseDot} />
            <Text style={styles.recordingTimerText}>
              Recording {formatSeconds(recordingSeconds)}
            </Text>
          </View>

          <Pressable
            style={styles.recordingCancelBtn}
            onPress={cancelVoiceRecording}
            accessibilityLabel="Cancel voice recording"
          >
            <Trash2 size={16} color="#DC2626" strokeWidth={2.2} />
            <Text style={styles.recordingCancelText}>Cancel</Text>
          </Pressable>

          <Pressable
            style={styles.recordingSendBtn}
            onPress={finishAndSendVoiceRecording}
            accessibilityLabel="Send voice note"
          >
            <Send size={15} color="#FFFFFF" strokeWidth={2.4} />
          </Pressable>
        </View>
      ) : (
        <View style={styles.inputRow}>
          {/* Attachment + Button */}
          <Pressable
            style={styles.attachBtn}
            onPress={onOpenAttachments}
            accessibilityLabel="Open attachments menu"
          >
            <Plus size={20} color="#0F766E" strokeWidth={2.6} />
          </Pressable>

          {/* Text Field */}
          <TextInput
            style={styles.textInput}
            placeholder={editingMessage ? 'Edit your message...' : placeholder}
            placeholderTextColor="#94A3B8"
            value={inputText}
            onChangeText={handleTextChange}
            multiline
            maxLength={2000}
          />

          {/* Voice note trigger if empty and not editing */}
          {inputText.trim().length === 0 && !editingMessage && (onSendVoiceNote || onVoicePress) ? (
            <Pressable
              style={styles.micBtn}
              onPress={startVoiceRecording}
              accessibilityLabel="Voice message"
            >
              <Mic size={18} color="#0F766E" strokeWidth={2.4} />
            </Pressable>
          ) : (
            <Pressable
              style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
              onPress={handleSendPress}
              disabled={!inputText.trim()}
              accessibilityLabel={editingMessage ? 'Save edited message' : 'Send message'}
            >
              {editingMessage ? (
                <Check size={16} color="#FFFFFF" strokeWidth={2.6} />
              ) : (
                <Send size={15} color="#FFFFFF" strokeWidth={2.4} />
              )}
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingTop: 8,
    ...V4_SHADOWS.soft,
  },
  editBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#059669',
  },
  editBannerTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  editBannerSnippet: {
    fontSize: 11.5,
    color: '#334155',
    marginTop: 1,
  },
  replyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#0F766E',
  },
  replySenderText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F766E',
  },
  replySnippetText: {
    fontSize: 11.5,
    color: '#475569',
    marginTop: 1,
  },
  bannerCancelBtn: {
    padding: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  attachBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingTop: Platform.OS === 'ios' ? 8 : 6,
    paddingBottom: Platform.OS === 'ios' ? 8 : 6,
    fontSize: 14,
    color: '#0F172A',
    maxHeight: 90,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  micBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0F766E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
  recordingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 22,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  recordingIndicatorBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recordingPulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#DC2626',
  },
  recordingTimerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  recordingCancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
  },
  recordingCancelText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#DC2626',
  },
  recordingSendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0F766E',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
