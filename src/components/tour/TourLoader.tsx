/**
 * REHVO AI Tour™ — 12-Step AI Processing Pipeline Loader
 * Displays live step-by-step 3D reconstruction progress, ETA, and pipeline stage metrics.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Sparkles, CheckCircle2, Box, Layers, Image as ImageIcon } from 'lucide-react-native';

export interface TourLoaderProps {
  progressPercent: number; // 0 to 100
  stepName?: string;
  stepIndex?: number;
  estimatedSecondsLeft?: number;
}

export const AI_PIPELINE_STEPS = [
  { index: 1, name: 'Extracting High-Fidelity Frames', percent: 12 },
  { index: 2, name: 'Detecting Spatial Walls', percent: 20 },
  { index: 3, name: 'Detecting Floor Boundaries', percent: 28 },
  { index: 4, name: 'Detecting Ceiling Planes', percent: 36 },
  { index: 5, name: 'Monocular Depth Estimation', percent: 44 },
  { index: 6, name: 'Room Spatial Segmentation', percent: 52 },
  { index: 7, name: 'AI Furniture & Fixture Detection', percent: 60 },
  { index: 8, name: 'Generating 3D Room Mesh', percent: 68 },
  { index: 9, name: 'Equirectangular Texture Mapping', percent: 78 },
  { index: 10, name: 'Draco GPU Mesh Compression', percent: 86 },
  { index: 11, name: 'Generating 2D Floorplan & Thumbnails', percent: 95 },
  { index: 12, name: 'Publishing AI 3D Tour', percent: 100 },
];

export const TourLoader: React.FC<TourLoaderProps> = ({
  progressPercent,
  stepName,
  stepIndex,
  estimatedSecondsLeft = 140,
}) => {
  const currentStep =
    AI_PIPELINE_STEPS.find((s) => progressPercent <= s.percent) ||
    AI_PIPELINE_STEPS[AI_PIPELINE_STEPS.length - 1];

  const activeStepTitle = stepName || currentStep.name;
  const activeStepIdx = stepIndex || currentStep.index;

  const minutes = Math.floor(estimatedSecondsLeft / 60);
  const seconds = estimatedSecondsLeft % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <View style={styles.container}>
      {/* Central Progress Visual */}
      <View style={styles.centerBadge}>
        <View style={styles.glowRing} />
        <View style={styles.centerOrb}>
          <Box size={36} color="#FF6B35" strokeWidth={2.2} />
          <Text style={styles.percentText}>{progressPercent}%</Text>
        </View>
      </View>

      {/* Progress Meta */}
      <View style={styles.metaContainer}>
        <View style={styles.pillBadge}>
          <Sparkles size={12} color="#0E8F73" />
          <Text style={styles.pillBadgeText}>
            STEP {activeStepIdx} OF 12
          </Text>
        </View>

        <Text style={styles.stepTitle}>{activeStepTitle}</Text>

        <Text style={styles.etaText}>
          Estimated processing time remaining: <Text style={styles.etaHighlight}>{timeFormatted} mins</Text>
        </Text>
      </View>

      {/* Pipeline Track Bar */}
      <View style={styles.progressBarWrapper}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progressPercent}%` }]} />
        </View>
      </View>

      {/* Step Checklist Preview */}
      <View style={styles.checklist}>
        {AI_PIPELINE_STEPS.slice(0, 4).map((s) => {
          const isDone = progressPercent >= s.percent;
          return (
            <View key={s.index} style={styles.checkItem}>
              <CheckCircle2
                size={14}
                color={isDone ? '#0E8F73' : '#64748B'}
                strokeWidth={2.4}
              />
              <Text style={[styles.checkText, isDone && styles.checkTextDone]}>
                {s.name}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#031B2A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 20,
  },
  centerBadge: {
    width: 130,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glowRing: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 53, 0.4)',
  },
  centerOrb: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderWidth: 2,
    borderColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 10,
  },
  percentText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  metaContainer: {
    alignItems: 'center',
    gap: 8,
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pillBadgeText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#0E8F73',
    letterSpacing: 0.5,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  etaText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
  etaHighlight: {
    color: '#F8FAFC',
    fontWeight: '800',
  },
  progressBarWrapper: {
    width: '100%',
    paddingHorizontal: 10,
  },
  track: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#FF6B35',
  },
  checklist: {
    width: '100%',
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 14,
    gap: 8,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  checkTextDone: {
    color: '#F8FAFC',
    fontWeight: '700',
  },
});
