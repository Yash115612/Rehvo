import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, Animated } from 'react-native';
import { Mic, MicOff, X, Volume2, Globe, Sparkles } from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';

interface V4VoiceVisualizerModalProps {
  visible: boolean;
  onClose: () => void;
  onTranscriptReady: (transcript: string, language: 'en' | 'hi') => void;
}

export const V4VoiceVisualizerModal: React.FC<V4VoiceVisualizerModalProps> = React.memo(
  ({ visible, onClose, onTranscriptReady }) => {
    const [isListening, setIsListening] = useState(true);
    const [language, setLanguage] = useState<'en' | 'hi'>('en');
    const [transcript, setTranscript] = useState('');
    const [waveAnims] = useState(() => [
      new Animated.Value(0.4),
      new Animated.Value(0.8),
      new Animated.Value(0.6),
      new Animated.Value(1.0),
      new Animated.Value(0.5),
      new Animated.Value(0.9),
      new Animated.Value(0.3),
    ]);

    // Waveform loop
    useEffect(() => {
      if (!visible || !isListening) return;

      const animations = waveAnims.map((anim, i) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 0.2 + ((i * 37) % 80) / 100,
              duration: 350 + (i % 3) * 80,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 1.0,
              duration: 350 + (i % 3) * 80,
              useNativeDriver: true,
            }),
          ])
        )
      );

      animations.forEach((a) => a.start());

      // Realistic speech simulation for testing & offline voice support
      const sampleQueriesEn = [
        'Find me a 2BHK in Bandra West under 65k with gym',
        'Is 45,000 rent overpriced for Powai Hiranandani?',
        'Generate a polite WhatsApp message to negotiate rent',
        'Explain my lease agreement lock-in clause',
      ];
      const sampleQueriesHi = [
        'BKC के पास 40k में 2BHK फ्लैट ढूंढो',
        'मकान मालिक से किराया कम कराने का मैसेज लिखो',
        'क्या बांद्रा वेस्ट में 60k किराया ठीक है?',
        'घर बदलने के लिए पैकिंग चेकलिस्ट बनाओ',
      ];

      const queries = language === 'hi' ? sampleQueriesHi : sampleQueriesEn;
      const chosen = queries[Math.floor(Math.random() * queries.length)];

      let charIndex = 0;
      const interval = setInterval(() => {
        if (charIndex <= chosen.length) {
          setTranscript(chosen.slice(0, charIndex));
          charIndex += 2;
        } else {
          clearInterval(interval);
        }
      }, 70);

      return () => {
        animations.forEach((a) => a.stop());
        clearInterval(interval);
      };
    }, [visible, isListening, language, waveAnims]);

    const handleConfirm = () => {
      if (transcript.trim()) {
        onTranscriptReady(transcript.trim(), language);
        onClose();
        setTranscript('');
      }
    };

    return (
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
            {/* Header */}
            <View style={styles.headerRow}>
              <View style={styles.aiBadge}>
                <Sparkles size={13} color={V4_COLORS.primary} />
                <Text style={styles.aiBadgeText}>REHVO Voice AI</Text>
              </View>

              <View style={styles.headerActions}>
                {/* Language switch */}
                <Pressable
                  style={styles.langBtn}
                  onPress={() => setLanguage((l) => (l === 'en' ? 'hi' : 'en'))}
                  hitSlop={8}
                >
                  <Globe size={13} color={V4_COLORS.primary} />
                  <Text style={styles.langText}>{language === 'en' ? 'English' : 'हिन्दी'}</Text>
                </Pressable>

                <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={8}>
                  <X size={18} color="#64748B" />
                </Pressable>
              </View>
            </View>

            {/* Listening Indicator */}
            <Text style={styles.statusTitle}>
              {isListening
                ? language === 'hi'
                  ? 'सुन रहा हूँ... बोलिए'
                  : 'Listening... Speak now'
                : 'Paused'}
            </Text>
            <Text style={styles.statusSub}>
              {language === 'hi'
                ? 'मुंबई किराए, एग्रीमेंट या इलाके के बारे में कुछ भी पूछें'
                : 'Ask about rent, lease agreements, BKC commute or moving'}
            </Text>

            {/* Animated Waveform */}
            <View style={styles.waveformContainer}>
              {waveAnims.map((anim, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.waveBar,
                    {
                      transform: [{ scaleY: anim }],
                      backgroundColor: isListening ? V4_COLORS.primary : '#CBD5E1',
                    },
                  ]}
                />
              ))}
            </View>

            {/* Live Transcript Box */}
            <View style={styles.transcriptBox}>
              <Text style={styles.transcriptText}>
                {transcript ? `"${transcript}"` : language === 'hi' ? 'आवाज़ रिकॉर्ड की जा रही है...' : 'Listening to speech...'}
              </Text>
            </View>

            {/* Bottom Actions */}
            <View style={styles.bottomActions}>
              <Pressable
                style={[styles.micToggleBtn, !isListening && styles.micToggleBtnPaused]}
                onPress={() => setIsListening((l) => !l)}
              >
                {isListening ? (
                  <Mic size={22} color="#FFFFFF" />
                ) : (
                  <MicOff size={22} color="#FFFFFF" />
                )}
              </Pressable>

              <Pressable
                style={[styles.submitBtn, !transcript && styles.submitBtnDisabled]}
                onPress={handleConfirm}
                disabled={!transcript}
              >
                <Text style={styles.submitBtnText}>
                  {language === 'hi' ? 'सवाल पूछें →' : 'Send Question →'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(3, 27, 42, 0.65)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#FFFFFF',
    borderRadius: V4_RADIUS['2xl'],
    padding: 20,
    alignItems: 'center',
    ...V4_SHADOWS.floating,
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  aiBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: V4_COLORS.primary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    minHeight: 44,
  },
  langText: {
    fontSize: 12,
    fontWeight: '700',
    color: V4_COLORS.primary,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  statusSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 64,
    marginBottom: 20,
  },
  waveBar: {
    width: 6,
    height: 52,
    borderRadius: 3,
  },
  transcriptBox: {
    width: '100%',
    minHeight: 52,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  transcriptText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    textAlign: 'center',
  },
  bottomActions: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  micToggleBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: V4_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...V4_SHADOWS.glow,
  },
  micToggleBtnPaused: {
    backgroundColor: '#94A3B8',
  },
  submitBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: V4_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...V4_SHADOWS.card,
  },
  submitBtnDisabled: {
    backgroundColor: '#E2E8F0',
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
