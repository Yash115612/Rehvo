import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
} from 'react-native';
import { Mic, X, Sparkles, Volume2 } from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';

export interface V4VoiceSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectQuery: (query: string) => void;
}

const VOICE_PROMPTS = [
  '2 BHK near BKC under 45k with gym',
  'Furnished flat in Powai with swimming pool',
  'Zero deposit 1 BHK in Andheri East',
  'Sea facing apartment in Worli',
  'Pet friendly 2 BHK in Bandra West',
];

export const V4VoiceSearchModal: React.FC<V4VoiceSearchModalProps> = ({
  visible,
  onClose,
  onSelectQuery,
}) => {
  const [pulseAnim] = useState(new Animated.Value(1));
  const [selectedPromptIndex, setSelectedPromptIndex] = useState(0);

  useEffect(() => {
    if (!visible) return;

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.25,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    // Cycle hint prompts
    const interval = setInterval(() => {
      setSelectedPromptIndex((prev) => (prev + 1) % VOICE_PROMPTS.length);
    }, 2800);

    return () => {
      pulse.stop();
      clearInterval(interval);
    };
  }, [visible, pulseAnim]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.aiBadge}>
              <Sparkles size={13} color={V4_COLORS.primary} />
              <Text style={styles.aiBadgeText}>AI VOICE SEARCH</Text>
            </View>
            <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={10}>
              <X size={18} color="#64748B" />
            </Pressable>
          </View>

          {/* Pulsing Mic Visualizer */}
          <View style={styles.visualizerContainer}>
            <Animated.View
              style={[
                styles.pulseRing,
                { transform: [{ scale: pulseAnim }] },
              ]}
            />
            <View style={styles.micCircle}>
              <Mic size={32} color="#FFFFFF" strokeWidth={2.4} />
            </View>
          </View>

          {/* Listening State Text */}
          <Text style={styles.listeningTitle}>Listening for your dream home...</Text>
          <Text style={styles.listeningSub}>
            Speak naturally: mention BHK, budget, locality, or amenities.
          </Text>

          {/* Current Suggested Prompt (Tap to Simulate Voice Input) */}
          <View style={styles.promptsSection}>
            <Text style={styles.promptsSectionHeader}>Or try asking:</Text>
            <View style={styles.promptsList}>
              {VOICE_PROMPTS.map((prompt, idx) => (
                <Pressable
                  key={idx}
                  style={[
                    styles.promptChip,
                    selectedPromptIndex === idx && styles.promptChipActive,
                  ]}
                  onPress={() => {
                    onSelectQuery(prompt);
                    onClose();
                  }}
                >
                  <Volume2 size={13} color={selectedPromptIndex === idx ? V4_COLORS.primary : '#64748B'} />
                  <Text
                    style={[
                      styles.promptChipText,
                      selectedPromptIndex === idx && styles.promptChipTextActive,
                    ]}
                  >
                    "{prompt}"
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(3, 27, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 38,
    alignItems: 'center',
    ...V4_SHADOWS.card,
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 118, 110, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  aiBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: V4_COLORS.primary,
    letterSpacing: 0.5,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  visualizerContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 12,
  },
  pulseRing: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(15, 118, 110, 0.16)',
  },
  micCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: V4_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...V4_SHADOWS.card,
  },
  listeningTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.3,
    marginTop: 8,
  },
  listeningSub: {
    fontSize: 13,
    color: V4_COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  promptsSection: {
    width: '100%',
    gap: 8,
  },
  promptsSectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: V4_COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  promptsList: {
    gap: 8,
  },
  promptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  promptChipActive: {
    backgroundColor: '#F0FDFA',
    borderColor: '#99F6E4',
  },
  promptChipText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
    flex: 1,
  },
  promptChipTextActive: {
    color: V4_COLORS.primary,
    fontWeight: '800',
  },
});
