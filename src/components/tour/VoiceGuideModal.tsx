/**
 * REHVO AI Tour™ — Smart Voice & NLP Tour Assistant Modal
 * Allows natural language commands in English, Hindi, and Hinglish.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Mic, Sparkles, X, ArrowRight, Volume2 } from 'lucide-react-native';
import { parseVoiceTourCommand } from '../../lib/ai-tour/voiceGuide';
import { Room3D, VoiceCommandResult } from '../../types/tour';

export interface VoiceGuideModalProps {
  visible: boolean;
  rooms: Room3D[];
  onClose: () => void;
  onExecuteCommand: (result: VoiceCommandResult) => void;
}

export const VoiceGuideModal: React.FC<VoiceGuideModalProps> = ({
  visible,
  rooms,
  onClose,
  onExecuteCommand,
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [lastReply, setLastReply] = useState<string | null>(null);

  const samplePrompts = [
    'Show balcony',
    'Kitchen dikhao',
    'Master bedroom',
    'How many bathrooms?',
    'Golden hour dhoop',
    'Night mode',
  ];

  const handleProcessQuery = (textToProcess: string) => {
    if (!textToProcess.trim()) return;

    const availableRooms = rooms.map((r) => ({ id: r.id, name: r.name, type: r.type }));
    const result = parseVoiceTourCommand(textToProcess, availableRooms);

    setLastReply(result.speech_reply);
    onExecuteCommand(result);
    setInputText('');

    // Auto-close if command was a direct action
    if (result.action !== 'info') {
      setTimeout(() => {
        onClose();
        setLastReply(null);
      }, 1400);
    }
  };

  const handleSimulateVoice = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      handleProcessQuery('Balcony kholo');
    }, 1200);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={styles.aiBadge}>
                <Sparkles size={14} color="#0E8F73" />
              </View>
              <View>
                <Text style={styles.title}>REHVO Smart Tour Guide</Text>
                <Text style={styles.subtitle}>Ask in English, Hindi, or Hinglish</Text>
              </View>
            </View>

            <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
              <X size={16} color="#64748B" />
            </Pressable>
          </View>

          {/* AI Speech Bubble if replying */}
          {lastReply && (
            <View style={styles.replyBox}>
              <Volume2 size={16} color="#FF6B35" />
              <Text style={styles.replyText}>{lastReply}</Text>
            </View>
          )}

          {/* Mic Trigger */}
          <View style={styles.micSection}>
            <Pressable
              style={[styles.micButton, isListening && styles.micButtonListening]}
              onPress={handleSimulateVoice}
            >
              {isListening ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Mic size={24} color="#FFFFFF" strokeWidth={2.4} />
              )}
            </Pressable>
            <Text style={styles.micPrompt}>
              {isListening ? 'Listening to speech...' : 'Tap mic to speak or type below'}
            </Text>
          </View>

          {/* Quick Prompts Chips */}
          <View style={styles.chipsContainer}>
            <Text style={styles.chipsHeader}>TRY ASKING:</Text>
            <View style={styles.chipsRow}>
              {samplePrompts.map((prompt) => (
                <Pressable
                  key={prompt}
                  style={styles.chip}
                  onPress={() => handleProcessQuery(prompt)}
                >
                  <Text style={styles.chipText}>{prompt}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Text Input Row */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder='e.g. "Balcony dikhao" or "Go to kitchen"...'
              placeholderTextColor="#94A3B8"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => handleProcessQuery(inputText)}
              returnKeyType="send"
            />
            <Pressable
              style={[styles.sendBtn, !inputText.trim() && { opacity: 0.5 }]}
              onPress={() => handleProcessQuery(inputText)}
              disabled={!inputText.trim()}
            >
              <ArrowRight size={16} color="#FFFFFF" strokeWidth={2.6} />
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
    backgroundColor: 'rgba(3, 27, 42, 0.72)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 20,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aiBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: '#031B2A',
  },
  subtitle: {
    fontSize: 11.5,
    color: '#64748B',
  },
  closeBtn: {
    padding: 6,
  },
  replyBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    padding: 12,
    borderRadius: 14,
  },
  replyText: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '700',
    color: '#9A3412',
    lineHeight: 18,
  },
  micSection: {
    alignItems: 'center',
    paddingVertical: 10,
    gap: 6,
  },
  micButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  micButtonListening: {
    backgroundColor: '#0E8F73',
  },
  micPrompt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  chipsContainer: {
    gap: 6,
  },
  chipsHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  chipText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#334155',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#031B2A',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#0E8F73',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
