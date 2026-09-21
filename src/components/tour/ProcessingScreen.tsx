/**
 * REHVO AI Tour™ — 12-Step AI Processing Screen Component
 * Displays real-time animated AI pipeline progress across 12 explicit stages:
 * 1. Uploading
 * 2. Frame Extraction
 * 3. Room Detection
 * 4. Depth Estimation
 * 5. Wall Detection
 * 6. Ceiling Detection
 * 7. Mesh Generation
 * 8. Texture Mapping
 * 9. Compression
 * 10. Floorplan Generation
 * 11. Optimization
 * 12. Completed
 * Features circular progress ring, time remaining countdown (ETA), and stage checklists.
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import {
  Sparkles,
  CheckCircle2,
  Box,
  Layers,
  Clock,
  Cpu,
  Compass,
  Maximize2,
  Image as ImageIcon,
} from 'lucide-react-native';

export interface ProcessingScreenProps {
  progressPercent: number; // 0 to 100
  stepIndex?: number;
  stepName?: string;
  estimatedSecondsLeft?: number;
}

export const PIPELINE_12_STEPS = [
  { step: 1, name: 'Uploading', desc: 'Secure asset upload to storage', percent: 8 },
  { step: 2, name: 'Frame Extraction', desc: '4K keyframe extraction & de-blurring', percent: 16 },
  { step: 3, name: 'Room Detection', desc: 'AI room boundary & doorway tagging', percent: 25 },
  { step: 4, name: 'Depth Estimation', desc: 'Monocular MiDaS depth inference', percent: 34 },
  { step: 5, name: 'Wall Detection', desc: 'Planar surface normal extraction', percent: 42 },
  { step: 6, name: 'Ceiling Detection', desc: 'Height calibration & ceiling plane map', percent: 50 },
  { step: 7, name: 'Mesh Generation', desc: '3D polygonal geometry construction', percent: 58 },
  { step: 8, name: 'Texture Mapping', desc: '360° seamless equirectangular uv map', percent: 68 },
  { step: 9, name: 'Compression', desc: 'Draco GPU mesh & geometry reduction', percent: 76 },
  { step: 10, name: 'Floorplan Generation', desc: '2D architectural blueprint synthesis', percent: 85 },
  { step: 11, name: 'Optimization', desc: '60 FPS mobile WebGL / Three.js prep', percent: 94 },
  { step: 12, name: 'Completed', desc: 'Ready for interactive virtual tour', percent: 100 },
];

export const ProcessingScreen: React.FC<ProcessingScreenProps> = ({
  progressPercent,
  stepIndex,
  stepName,
  estimatedSecondsLeft = 120,
}) => {
  const currentStep =
    PIPELINE_12_STEPS.find((s) => progressPercent <= s.percent) ||
    PIPELINE_12_STEPS[PIPELINE_12_STEPS.length - 1];

  const activeIndex = stepIndex || currentStep.step;
  const activeTitle = stepName || currentStep.name;

  const minutes = Math.floor(estimatedSecondsLeft / 60);
  const seconds = estimatedSecondsLeft % 60;
  const etaFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <View style={styles.container}>
      {/* Central Circular Progress Ring */}
      <View style={styles.ringWrapper}>
        <View style={styles.outerGlowRing} />
        <View style={styles.innerOrb}>
          <Box size={34} color="#FF6B35" strokeWidth={2.4} />
          <Text style={styles.ringPercentText}>{Math.round(progressPercent)}%</Text>
        </View>
      </View>

      {/* Main Status Header */}
      <View style={styles.headerInfo}>
        <View style={styles.stepBadge}>
          <Sparkles size={12} color="#FF6B35" />
          <Text style={styles.stepBadgeText}>
            STEP {activeIndex} OF 12: {activeTitle.toUpperCase()}
          </Text>
        </View>

        <Text style={styles.mainTitle}>{activeTitle}</Text>
        <Text style={styles.subDesc}>{currentStep.desc}</Text>

        <View style={styles.etaRow}>
          <Clock size={13} color="#94A3B8" />
          <Text style={styles.etaText}>
            Estimated time remaining: <Text style={styles.etaHighlight}>{etaFormatted} mins</Text>
          </Text>
        </View>
      </View>

      {/* Linear Track Bar */}
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.max(3, progressPercent)}%` }]} />
      </View>

      {/* 12-Step Live Progress List */}
      <View style={styles.stepsCard}>
        <Text style={styles.cardHeaderTitle}>AI RECONSTRUCTION PIPELINE</Text>
        <ScrollView style={styles.stepsScroll} showsVerticalScrollIndicator={false}>
          {PIPELINE_12_STEPS.map((s) => {
            const isDone = progressPercent >= s.percent;
            const isCurrent = activeIndex === s.step;

            return (
              <View
                key={s.step}
                style={[
                  styles.stepRow,
                  isCurrent && styles.stepRowCurrent,
                ]}
              >
                <View style={styles.stepNumCol}>
                  {isDone ? (
                    <CheckCircle2 size={16} color="#0E8F73" strokeWidth={2.6} />
                  ) : isCurrent ? (
                    <ActivityIndicator size="small" color="#FF6B35" />
                  ) : (
                    <View style={styles.idleBullet}>
                      <Text style={styles.idleBulletText}>{s.step}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.stepNameCol}>
                  <Text
                    style={[
                      styles.stepNameText,
                      isDone && styles.stepNameDone,
                      isCurrent && styles.stepNameCurrent,
                    ]}
                  >
                    {s.step}. {s.name}
                  </Text>
                  <Text style={styles.stepDescText}>{s.desc}</Text>
                </View>

                {isDone && (
                  <View style={styles.doneTag}>
                    <Text style={styles.doneTagText}>DONE</Text>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  ringWrapper: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: 10,
  },
  outerGlowRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 53, 0.35)',
  },
  innerOrb: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(3, 27, 42, 0.95)',
    borderWidth: 2.5,
    borderColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 8,
  },
  ringPercentText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  headerInfo: {
    alignItems: 'center',
    gap: 6,
  },
  stepBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stepBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FF6B35',
    letterSpacing: 0.5,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  subDesc: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  etaText: {
    fontSize: 11.5,
    color: '#94A3B8',
  },
  etaHighlight: {
    color: '#FFFFFF',
    fontWeight: '800',
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
  stepsCard: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 16,
    gap: 12,
  },
  cardHeaderTitle: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#94A3B8',
    letterSpacing: 0.6,
  },
  stepsScroll: {
    flex: 1,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    gap: 10,
  },
  stepRowCurrent: {
    backgroundColor: 'rgba(255, 107, 53, 0.08)',
    borderRadius: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 0,
  },
  stepNumCol: {
    width: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  idleBullet: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  idleBulletText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#64748B',
  },
  stepNameCol: {
    flex: 1,
    gap: 1,
  },
  stepNameText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748B',
  },
  stepNameDone: {
    color: '#E2E8F0',
    fontWeight: '700',
  },
  stepNameCurrent: {
    color: '#FF6B35',
    fontWeight: '900',
  },
  stepDescText: {
    fontSize: 10.5,
    color: '#64748B',
  },
  doneTag: {
    backgroundColor: 'rgba(14, 143, 115, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  doneTagText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#0E8F73',
  },
});
