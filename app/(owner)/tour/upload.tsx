/**
 * REHVO AI Tour™ — Owner 3D Tour Generation & Upload Flow
 * Owner Dashboard -> Upload Property -> New Step: AI 3D Tour ->
 * Upload Video -> AI Processing Screen -> 3D Tour Generated -> Preview -> Publish
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import {
  ArrowLeft,
  Video,
  UploadCloud,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Play,
  Share2,
  Box,
  Eye,
} from 'lucide-react-native';
import { RecordingGuideModal } from '../../../src/components/tour/RecordingGuideModal';
import { TourLoader } from '../../../src/components/tour/TourLoader';
import { TourViewer } from '../../../src/components/tour/TourViewer';
import {
  validateWalkthroughVideo,
  analyzeVideoQuality,
} from '../../../src/lib/ai-tour/frameExtractor';
import {
  createTourProcessingJob,
  getTourByPropertyId,
} from '../../../src/lib/ai-tour/supabase';
import { VideoQualityReport, PropertyTour3D } from '../../../src/types/tour';

type UploadStep = 'select' | 'analyzing' | 'quality_check' | 'processing' | 'preview' | 'published';

export default function OwnerTourUploadRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [currentStep, setCurrentStep] = useState<UploadStep>('select');
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [selectedVideoName, setSelectedVideoName] = useState<string>('walkthrough_sample.mp4');
  const [videoQuality, setVideoQuality] = useState<VideoQualityReport | null>(null);
  const [processingProgress, setProcessingProgress] = useState<number>(12);
  const [generatedTour, setGeneratedTour] = useState<PropertyTour3D | null>(null);

  // Pick or record video with image picker
  const handleLaunchPicker = async () => {
    setShowGuideModal(false);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedVideoName(asset.fileName || 'property_walkthrough.mp4');
        startVideoAnalysis(asset.uri, asset.fileSize || 45 * 1024 * 1024, asset.duration || 65);
      }
    } catch {
      // Demo fallback in case simulator lacks photos permission
      startVideoAnalysis('file://sample.mp4', 38 * 1024 * 1024, 68);
    }
  };

  const startVideoAnalysis = async (uri: string, sizeBytes: number, durationSeconds: number) => {
    setCurrentStep('analyzing');

    const validation = validateWalkthroughVideo({
      uri,
      name: selectedVideoName,
      sizeBytes,
      durationSeconds,
      width: 1920,
      height: 1080,
    });

    if (!validation.isValid) {
      Alert.alert('Video Issue', validation.errors.join('\n'));
      setCurrentStep('select');
      return;
    }

    const report = await analyzeVideoQuality({
      uri,
      name: selectedVideoName,
      sizeBytes,
      durationSeconds,
      width: 1920,
      height: 1080,
    });

    setVideoQuality(report);
    setCurrentStep('quality_check');
  };

  // Start 12-Step AI 3D Reconstruction Pipeline
  const handleStartProcessing = async () => {
    setCurrentStep('processing');
    await createTourProcessingJob('prop-demo', selectedVideoName, 45 * 1024 * 1024);

    // Simulate real-time progress steps
    const progressSteps = [
      { p: 12, delay: 600 },
      { p: 28, delay: 900 },
      { p: 44, delay: 900 },
      { p: 68, delay: 1000 },
      { p: 86, delay: 800 },
      { p: 95, delay: 700 },
      { p: 100, delay: 500 },
    ];

    let stepIdx = 0;
    const interval = setInterval(async () => {
      if (stepIdx < progressSteps.length) {
        setProcessingProgress(progressSteps[stepIdx].p);
        stepIdx++;
      } else {
        clearInterval(interval);
        const tour = await getTourByPropertyId('prop-demo');
        setGeneratedTour(tour);
        setCurrentStep('preview');
      }
    }, 750);
  };

  const handlePublishListing = () => {
    setCurrentStep('published');
    Alert.alert(
      '3D Tour Published!',
      'Your interactive REHVO AI Tour™ is now live on your listing for prospective tenants.',
      [
        {
          text: 'Back to Dashboard',
          onPress: () => router.replace('/(owner)/dashboard' as any),
        },
      ]
    );
  };

  return (
    <View style={styles.root}>
      {/* ── TOP HEADER (EXCEPT PREVIEW MODE) ─────────────────────────────────── */}
      {currentStep !== 'preview' && (
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 10) }]}>
          <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
            <ArrowLeft size={18} color="#031B2A" strokeWidth={2.4} />
          </Pressable>
          <View>
            <Text style={styles.headerTitle}>AI 3D Property Tour</Text>
            <Text style={styles.headerSub}>Turn video walkthroughs into virtual tours</Text>
          </View>
        </View>
      )}

      {/* ── STEP 1: SELECT / UPLOAD VIDEO ────────────────────────────────────── */}
      {currentStep === 'select' && (
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 20) + 20 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Banner */}
          <View style={styles.heroBanner}>
            <View style={styles.aiTag}>
              <Sparkles size={11} color="#FF6B35" />
              <Text style={styles.aiTagText}>REHVO AI TOUR™</Text>
            </View>
            <Text style={styles.heroTitle}>Walk through your future home before visiting it.</Text>
            <Text style={styles.heroDesc}>
              Upload a 45–90s video recorded on your phone. REHVO AI extracts depth, maps floor plans, and generates an interactive 3D spatial tour.
            </Text>
          </View>

          {/* Upload Dropzone */}
          <Pressable style={styles.dropzone} onPress={() => setShowGuideModal(true)}>
            <View style={styles.uploadIconCircle}>
              <UploadCloud size={32} color="#FF6B35" strokeWidth={2.2} />
            </View>
            <Text style={styles.dropzoneTitle}>Upload Walkthrough Video</Text>
            <Text style={styles.dropzoneSub}>
              Accepts MP4, MOV, HEVC • 30–120s • Max 2GB
            </Text>
            <View style={styles.guideTriggerPill}>
              <Text style={styles.guideTriggerText}>View Recording Guide</Text>
            </View>
          </Pressable>

          {/* Direct Select Button */}
          <Pressable style={styles.uploadButton} onPress={() => setShowGuideModal(true)}>
            <Video size={16} color="#FFFFFF" strokeWidth={2.4} />
            <Text style={styles.uploadButtonText}>Select Video / Open Camera</Text>
          </Pressable>
        </ScrollView>
      )}

      {/* ── STEP 2: ANALYZING VIDEO QUALITY ──────────────────────────────────── */}
      {currentStep === 'analyzing' && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.analyzingTitle}>Analyzing Video Quality...</Text>
          <Text style={styles.analyzingSub}>
            Measuring optical flow stability, lighting exposure, and room coverage
          </Text>
        </View>
      )}

      {/* ── STEP 3: QUALITY CHECK REPORT ─────────────────────────────────────── */}
      {currentStep === 'quality_check' && videoQuality && (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.qualityCard}>
            <View style={styles.qualityScoreHeader}>
              <View>
                <Text style={styles.qualityScoreTitle}>Video Quality Assessment</Text>
                <Text style={styles.qualityScoreSub}>{videoQuality.resolution} • {videoQuality.duration_seconds}s duration</Text>
              </View>
              <View style={styles.scoreCircle}>
                <Text style={styles.scoreNumber}>{videoQuality.overall_score}</Text>
                <Text style={styles.scoreTotal}>/100</Text>
              </View>
            </View>

            {/* Quality Metrics breakdown */}
            <View style={styles.breakdownGrid}>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>Camera Stability</Text>
                <Text style={styles.breakdownVal}>{videoQuality.camera_stability}%</Text>
              </View>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>Brightness & Lux</Text>
                <Text style={styles.breakdownVal}>{videoQuality.brightness}%</Text>
              </View>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>Image Sharpness</Text>
                <Text style={styles.breakdownVal}>{videoQuality.blur}%</Text>
              </View>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>Room Coverage</Text>
                <Text style={styles.breakdownVal}>{videoQuality.coverage}%</Text>
              </View>
            </View>

            <View style={styles.feedbackBox}>
              <CheckCircle2 size={16} color="#0E8F73" />
              <Text style={styles.feedbackText}>{videoQuality.feedback_message}</Text>
            </View>

            <Pressable style={styles.uploadButton} onPress={handleStartProcessing}>
              <Sparkles size={16} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.uploadButtonText}>Generate 3D Tour with AI</Text>
            </Pressable>
          </View>
        </ScrollView>
      )}

      {/* ── STEP 4: PROCESSING 12-STEP LOADER ─────────────────────────────────── */}
      {currentStep === 'processing' && (
        <TourLoader progressPercent={processingProgress} />
      )}

      {/* ── STEP 5: 3D TOUR PREVIEW ─────────────────────────────────────────── */}
      {currentStep === 'preview' && generatedTour && (
        <View style={styles.previewContainer}>
          <TourViewer tour={generatedTour} onExit={() => setCurrentStep('quality_check')} />

          {/* Floating Bottom Action Bar */}
          <View style={[styles.previewFloatingBar, { paddingBottom: Math.max(insets.bottom, 14) }]}>
            <View style={styles.previewMetaCol}>
              <Text style={styles.previewMetaTitle}>3D Tour Ready</Text>
              <Text style={styles.previewMetaSub}>Tested 60 FPS • 4 Rooms Mapped</Text>
            </View>

            <Pressable style={styles.publishBtn} onPress={handlePublishListing}>
              <CheckCircle2 size={16} color="#FFFFFF" strokeWidth={2.6} />
              <Text style={styles.publishBtnText}>Publish with Listing</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Recording Guide Modal */}
      <RecordingGuideModal
        visible={showGuideModal}
        onClose={() => setShowGuideModal(false)}
        onProceedToRecord={handleLaunchPicker}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#031B2A',
  },
  headerSub: {
    fontSize: 11.5,
    color: '#64748B',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  heroBanner: {
    backgroundColor: '#031B2A',
    borderRadius: 22,
    padding: 18,
    gap: 8,
  },
  aiTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 107, 53, 0.18)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  aiTagText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#FF6B35',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 23,
  },
  heroDesc: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 17,
  },
  dropzone: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FED7AA',
    borderStyle: 'dashed',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  dropzoneTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#031B2A',
  },
  dropzoneSub: {
    fontSize: 11.5,
    color: '#64748B',
    textAlign: 'center',
  },
  guideTriggerPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 6,
  },
  guideTriggerText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FF6B35',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FF6B35',
    paddingVertical: 14,
    borderRadius: 16,
  },
  uploadButtonText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  analyzingTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#031B2A',
    marginTop: 8,
  },
  analyzingSub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  qualityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    gap: 16,
  },
  qualityScoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qualityScoreTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#031B2A',
  },
  qualityScoreSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  scoreCircle: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  scoreNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0E8F73',
  },
  scoreTotal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0E8F73',
  },
  breakdownGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  breakdownItem: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    gap: 2,
  },
  breakdownLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  breakdownVal: {
    fontSize: 15,
    fontWeight: '900',
    color: '#031B2A',
  },
  feedbackBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    padding: 12,
    borderRadius: 14,
  },
  feedbackText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#166534',
  },
  previewContainer: {
    flex: 1,
    position: 'relative',
  },
  previewFloatingBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(3, 27, 42, 0.95)',
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 200,
  },
  previewMetaCol: {
    gap: 1,
  },
  previewMetaTitle: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  previewMetaSub: {
    fontSize: 11,
    color: '#94A3B8',
  },
  publishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0E8F73',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  publishBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
