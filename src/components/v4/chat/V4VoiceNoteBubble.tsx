import React, { useState, memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Play, Pause, Mic } from 'lucide-react-native';
import { V4_COLORS } from '../../../theme/v4Theme';
import { triggerHaptic } from '../../../utils/haptics';

interface V4VoiceNoteBubbleProps {
  audioUrl?: string;
  duration?: number | string;
  isMe: boolean;
}

const WAVEFORM_BARS = [35, 60, 40, 85, 55, 95, 70, 45, 80, 50, 65, 30, 75, 40, 90, 60, 45, 70, 50, 30];

const V4VoiceNoteBubbleComponent: React.FC<V4VoiceNoteBubbleProps> = ({
  duration = 14,
  isMe,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);

  const togglePlayback = () => {
    triggerHaptic();
    setIsPlaying((prev) => !prev);
    if (!isPlaying) {
      setPlaybackProgress(0.45);
    }
  };

  const durStr = typeof duration === 'number' ? `0:${duration < 10 ? '0' : ''}${duration}` : duration;

  return (
    <View style={[styles.container, isMe ? styles.containerMe : styles.containerOther]}>
      <Pressable
        style={[styles.playButton, isMe ? styles.playButtonMe : styles.playButtonOther]}
        onPress={togglePlayback}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={isPlaying ? 'Pause voice note' : 'Play voice note'}
      >
        {isPlaying ? (
          <Pause size={18} color={isMe ? '#0F766E' : '#FFFFFF'} fill={isMe ? '#0F766E' : '#FFFFFF'} />
        ) : (
          <Play size={18} color={isMe ? '#0F766E' : '#FFFFFF'} fill={isMe ? '#0F766E' : '#FFFFFF'} style={{ marginLeft: 2 }} />
        )}
      </Pressable>

      <View style={styles.waveformTrack}>
        <View style={styles.barsRow}>
          {WAVEFORM_BARS.map((height, idx) => {
            const isPlayed = idx / WAVEFORM_BARS.length <= playbackProgress;
            return (
              <View
                key={idx}
                style={[
                  styles.bar,
                  { height: Math.max(6, (height / 100) * 26) },
                  isMe
                    ? isPlayed
                      ? styles.barActiveMe
                      : styles.barInactiveMe
                    : isPlayed
                    ? styles.barActiveOther
                    : styles.barInactiveOther,
                ]}
              />
            );
          })}
        </View>
        <View style={styles.metaRow}>
          <Text style={[styles.durationText, isMe ? styles.metaTextMe : styles.metaTextOther]}>
            {durStr}
          </Text>
          <View style={styles.micBadge}>
            <Mic size={10} color={isMe ? 'rgba(255,255,255,0.75)' : '#0F766E'} />
          </View>
        </View>
      </View>
    </View>
  );
};

export const V4VoiceNoteBubble = memo(V4VoiceNoteBubbleComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    minWidth: 220,
    gap: 10,
  },
  containerMe: {
    backgroundColor: '#0F766E',
  },
  containerOther: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonMe: {
    backgroundColor: '#FFFFFF',
  },
  playButtonOther: {
    backgroundColor: '#0F766E',
  },
  waveformTrack: {
    flex: 1,
    justifyContent: 'center',
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2.5,
    height: 28,
  },
  bar: {
    width: 3,
    borderRadius: 2,
  },
  barActiveMe: {
    backgroundColor: '#FFFFFF',
  },
  barInactiveMe: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  barActiveOther: {
    backgroundColor: '#0F766E',
  },
  barInactiveOther: {
    backgroundColor: '#99F6E4',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 3,
  },
  durationText: {
    fontSize: 11,
    fontWeight: '700',
  },
  metaTextMe: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  metaTextOther: {
    color: '#0F766E',
  },
  micBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
