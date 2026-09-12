/**
 * V4VoiceAssistantModal — ChatGPT Voice Luxury Assistant
 * Fullscreen ambient dark interface, glowing pulsing mic orb,
 * 24-bar liquid waveform equalizer, real-time transcript streaming,
 * multilingual speech parsing (English / Hinglish / Hindi),
 * and rich interactive AI actionable cards.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Mic,
  MicOff,
  X,
  Sparkles,
  Volume2,
  Navigation,
  GitCompare,
  Calendar,
  PhoneCall,
  Search,
  CheckCircle2,
} from 'lucide-react-native';
import { V4_COLORS } from '../../../theme/v4Theme';
import { triggerHaptic } from '../../../utils/haptics';
import {
  VoiceLanguage,
  VoiceParsedIntent,
  generateWaveformData,
  parseVoiceQuery,
  logVoiceQuery,
  speakResponse,
  stopSpeaking,
} from '../../../services/voiceAI';

interface V4VoiceAssistantModalProps {
  visible: boolean;
  onClose: () => void;
  onActionTrigger?: (intent: VoiceParsedIntent) => void;
  onTranscriptReady?: (transcript: string, language: VoiceLanguage) => void;
  initialQuery?: string;
}

const SAMPLE_QUERIES: Record<VoiceLanguage, string[]> = {
  'en-IN': [
    'Find 2 BHK in Bandra West under 65k with gym',
    'Get directions to this apartment from metro station',
    'Compare this property with my saved flats',
    'Schedule a visit for tomorrow at 6 PM',
  ],
  'hi-IN': [
    'Bandra mein 60k ke andar 2 BHK flat dikhao',
    'Metro station se yahan tak ka rasta batao',
    'Makan malik se baat karao',
    'Kal shaam 6 baje visit schedule karo',
  ],
  'hinglish': [
    'Bandra mein 2 BHK under 65k dhundo',
    'Is flat ka rent agreement lock-in kya hai?',
    'Metro se walking distance kitna hai?',
    'Makan malik ko direct call karo',
  ],
};

export const V4VoiceAssistantModal: React.FC<V4VoiceAssistantModalProps> = React.memo(({
  visible,
  onClose,
  onActionTrigger,
  onTranscriptReady,
  initialQuery,
}) => {
  const router = useRouter();

  const [language, setLanguage] = useState<VoiceLanguage>('en-IN');
  const [isListening, setIsListening] = useState<boolean>(true);
  const [transcript, setTranscript] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [parsedIntent, setParsedIntent] = useState<VoiceParsedIntent | null>(null);

  // Waveform bars animation
  const [waveformBars, setWaveformBars] = useState<number[]>(() => generateWaveformData(20));

  // Orb Pulsing Animation
  const orbScale = useRef(new Animated.Value(1)).current;
  const ring1Scale = useRef(new Animated.Value(1)).current;
  const ring2Scale = useRef(new Animated.Value(1)).current;
  const ring1Opacity = useRef(new Animated.Value(0.6)).current;
  const ring2Opacity = useRef(new Animated.Value(0.3)).current;

  // Pulse loop
  useEffect(() => {
    if (!visible || !isListening) {
      orbScale.setValue(1);
      return;
    }

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(orbScale, {
            toValue: 1.14,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(ring1Scale, {
            toValue: 1.5,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(ring2Scale, {
            toValue: 1.85,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(ring1Opacity, {
            toValue: 0.1,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(ring2Opacity, {
            toValue: 0,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(orbScale, {
            toValue: 1.0,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(ring1Scale, {
            toValue: 1.0,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(ring2Scale, {
            toValue: 1.0,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(ring1Opacity, {
            toValue: 0.6,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(ring2Opacity, {
            toValue: 0.3,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    pulse.start();
    return () => pulse.stop();
  }, [isListening, orbScale, ring1Opacity, ring1Scale, ring2Opacity, ring2Scale, visible]);

  // Waveform flutter effect
  useEffect(() => {
    if (!visible || !isListening) return;
    const interval = setInterval(() => {
      setWaveformBars(generateWaveformData(20));
    }, 180);
    return () => clearInterval(interval);
  }, [visible, isListening]);

  // Speech Streaming Simulation
  useEffect(() => {
    if (!visible) {
      setTranscript('');
      setParsedIntent(null);
      setIsThinking(false);
      stopSpeaking();
      return;
    }

    if (initialQuery) {
      setTranscript(initialQuery);
      handleProcessQuery(initialQuery);
      return;
    }

    const queries = SAMPLE_QUERIES[language];
    const chosenQuery = queries[Math.floor(Math.random() * queries.length)];

    let charIndex = 0;
    const typing = setInterval(() => {
      if (charIndex <= chosenQuery.length) {
        setTranscript(chosenQuery.slice(0, charIndex));
        charIndex += 2;
      } else {
        clearInterval(typing);
        handleProcessQuery(chosenQuery);
      }
    }, 60);

    return () => {
      clearInterval(typing);
      stopSpeaking();
    };
  }, [language, visible]);

  const handleProcessQuery = useCallback(
    async (queryText: string) => {
      if (!queryText.trim()) return;
      setIsListening(false);
      setIsThinking(true);
      triggerHaptic('medium');

      // 600ms latency simulation
      setTimeout(async () => {
        const parsed = parseVoiceQuery(queryText, language);
        setParsedIntent(parsed);
        setIsThinking(false);
        triggerHaptic('light');

        // Text-to-speech audio feedback
        speakResponse(parsed.responseText, language);

        // Supabase audit logging
        await logVoiceQuery(queryText, parsed, language);

        if (onTranscriptReady) {
          onTranscriptReady(queryText, language);
        }
      }, 700);
    },
    [language, onTranscriptReady]
  );

  const toggleMic = useCallback(() => {
    triggerHaptic('selection');
    if (isListening) {
      setIsListening(false);
      stopSpeaking();
    } else {
      setIsListening(true);
      setParsedIntent(null);
      setTranscript('');
    }
  }, [isListening]);

  const handleExecuteAction = useCallback(() => {
    if (!parsedIntent) return;
    triggerHaptic('medium');
    stopSpeaking();
    onClose();

    if (onActionTrigger) {
      onActionTrigger(parsedIntent);
    } else if (parsedIntent.actionRoute) {
      router.push(parsedIntent.actionRoute as any);
    }
  }, [onActionTrigger, onClose, parsedIntent, router]);

  const handleClose = useCallback(() => {
    stopSpeaking();
    onClose();
  }, [onClose]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.container}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <View style={styles.brandBadge}>
              <Sparkles size={16} color={V4_COLORS.primaryLight} />
              <Text style={styles.brandBadgeText}>REHVO Voice AI</Text>
            </View>

            {/* Language Selector */}
            <View style={styles.langSelector}>
              {(['en-IN', 'hinglish', 'hi-IN'] as VoiceLanguage[]).map((lang) => {
                const isSelected = language === lang;
                const label = lang === 'en-IN' ? 'EN' : lang === 'hi-IN' ? 'हिंदी' : 'Hinglish';
                return (
                  <TouchableOpacity
                    key={lang}
                    style={[styles.langChip, isSelected && styles.langChipActive]}
                    onPress={() => {
                      triggerHaptic('selection');
                      setLanguage(lang);
                    }}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Text style={[styles.langChipText, isSelected && styles.langChipTextActive]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={handleClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Close Voice Assistant"
            >
              <X size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Central Pulsing Orb Section */}
          <View style={styles.orbCenterSection}>
            <View style={styles.orbWrapper}>
              {/* Concentric Halo Rings */}
              {isListening && (
                <>
                  <Animated.View
                    style={[
                      styles.haloRing,
                      {
                        transform: [{ scale: ring2Scale }],
                        opacity: ring2Opacity,
                      },
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.haloRing,
                      {
                        transform: [{ scale: ring1Scale }],
                        opacity: ring1Opacity,
                      },
                    ]}
                  />
                </>
              )}

              {/* Glowing Center Microphone Orb */}
              <Animated.View
                style={[
                  styles.glowingOrb,
                  { transform: [{ scale: orbScale }] },
                  !isListening && styles.glowingOrbIdle,
                ]}
              >
                <TouchableOpacity
                  style={styles.orbInnerTouch}
                  onPress={toggleMic}
                  activeOpacity={0.85}
                  accessibilityLabel={isListening ? 'Mute Microphone' : 'Start Listening'}
                >
                  {isListening ? (
                    <Mic size={40} color="#FFFFFF" />
                  ) : (
                    <MicOff size={40} color="#CBD5E1" />
                  )}
                </TouchableOpacity>
              </Animated.View>
            </View>

            {/* Liquid 20-Channel Equalizer Waveform */}
            <View style={styles.equalizerContainer}>
              {waveformBars.map((heightFraction, idx) => (
                <View
                  key={`bar_${idx}`}
                  style={[
                    styles.eqBar,
                    {
                      height: Math.max(6, heightFraction * 44),
                      backgroundColor: isListening
                        ? V4_COLORS.accent
                        : 'rgba(255, 255, 255, 0.2)',
                    },
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Transcript Subtitle Area */}
          <View style={styles.transcriptArea}>
            <Text style={styles.transcriptLabel}>
              {isListening
                ? 'Listening to your voice...'
                : isThinking
                ? 'Processing AI request...'
                : 'Recognized Voice Query'}
            </Text>
            <Text style={styles.transcriptText}>
              &ldquo;{transcript || 'Say something like: Find 2 BHK in Bandra...'}&rdquo;
            </Text>
          </View>

          {/* Actionable AI Response Card */}
          {parsedIntent && (
            <View style={styles.responseCard}>
              <View style={styles.responseHeaderRow}>
                <View style={styles.responseIconBox}>
                  {parsedIntent.intent === 'GET_DIRECTIONS' && (
                    <Navigation size={18} color={V4_COLORS.primary} />
                  )}
                  {parsedIntent.intent === 'SEARCH_PROPERTIES' && (
                    <Search size={18} color={V4_COLORS.primary} />
                  )}
                  {parsedIntent.intent === 'COMPARE_PROPERTIES' && (
                    <GitCompare size={18} color={V4_COLORS.primary} />
                  )}
                  {parsedIntent.intent === 'SCHEDULE_VISIT' && (
                    <Calendar size={18} color={V4_COLORS.primary} />
                  )}
                  {parsedIntent.intent === 'CONTACT_OWNER' && (
                    <PhoneCall size={18} color={V4_COLORS.primary} />
                  )}
                  {(parsedIntent.intent === 'GENERAL_QUERY' ||
                    parsedIntent.intent === 'READ_AGREEMENT' ||
                    parsedIntent.intent === 'FILTER_AMENITIES' ||
                    parsedIntent.intent === 'RENT_ESTIMATE') && (
                    <Sparkles size={18} color={V4_COLORS.primary} />
                  )}
                </View>
                <Text style={styles.intentTag}>{parsedIntent.intent.replace('_', ' ')}</Text>
              </View>

              <Text style={styles.responseText}>{parsedIntent.responseText}</Text>

              {/* Action Trigger Button */}
              {parsedIntent.actionRoute && (
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={handleExecuteAction}
                  accessibilityLabel="Take Action"
                >
                  <Text style={styles.actionBtnText}>
                    {parsedIntent.intent === 'SEARCH_PROPERTIES' && 'View Matched Listings'}
                    {parsedIntent.intent === 'GET_DIRECTIONS' && 'Open Transit Directions'}
                    {parsedIntent.intent === 'COMPARE_PROPERTIES' && 'Open AI Comparison'}
                    {parsedIntent.intent === 'SCHEDULE_VISIT' && 'Confirm Visit Schedule'}
                    {parsedIntent.intent === 'CONTACT_OWNER' && 'Chat with Landlord'}
                    {(parsedIntent.intent === 'GENERAL_QUERY' ||
                      parsedIntent.intent === 'READ_AGREEMENT' ||
                      parsedIntent.intent === 'FILTER_AMENITIES' ||
                      parsedIntent.intent === 'RENT_ESTIMATE') &&
                      'Explore in REHVO AI'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Quick Voice Prompt Suggestions */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionScroll}
          >
            {SAMPLE_QUERIES[language].map((query, i) => (
              <TouchableOpacity
                key={`suggestion_${i}`}
                style={styles.suggestionPill}
                onPress={() => {
                  setTranscript(query);
                  handleProcessQuery(query);
                }}
                hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
              >
                <Text style={styles.suggestionText}>{query}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#040910',
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 48 : 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    justifyContent: 'space-between',
  },
  topBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 118, 110, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(20, 184, 166, 0.4)',
  },
  brandBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: V4_COLORS.primaryLight,
  },
  langSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: 3,
  },
  langChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langChipActive: {
    backgroundColor: V4_COLORS.primary,
  },
  langChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  langChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbCenterSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  orbWrapper: {
    width: 170,
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  haloRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: V4_COLORS.accent,
  },
  glowingOrb: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: V4_COLORS.primary,
    shadowColor: V4_COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 28,
    elevation: 20,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  glowingOrbIdle: {
    backgroundColor: '#334155',
    shadowOpacity: 0.2,
  },
  orbInnerTouch: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  equalizerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    gap: 5,
    marginTop: 24,
  },
  eqBar: {
    width: 4,
    borderRadius: 2,
  },
  transcriptArea: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  transcriptLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: V4_COLORS.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  transcriptText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
  },
  responseCard: {
    marginHorizontal: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(20, 184, 166, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  responseHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  responseIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: V4_COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  intentTag: {
    fontSize: 11,
    fontWeight: '800',
    color: V4_COLORS.primaryLight,
    letterSpacing: 0.5,
  },
  responseText: {
    fontSize: 14,
    color: '#F8FAFC',
    lineHeight: 20,
    marginBottom: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    borderRadius: 12,
    backgroundColor: V4_COLORS.primary,
    paddingHorizontal: 16,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  suggestionScroll: {
    paddingHorizontal: 16,
    gap: 8,
    paddingVertical: 12,
  },
  suggestionPill: {
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  suggestionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94A3B8',
  },
});

export default V4VoiceAssistantModal;

