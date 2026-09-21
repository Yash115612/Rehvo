/**
 * REHVO AI Tour™ — Video Walkthrough Recording Guide Modal
 * Comprehensive onboarding before recording with animated cards and readiness checklist.
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  FlatList,
  Dimensions,
  Animated,
} from 'react-native';
import {
  Video,
  CheckCircle2,
  X,
  Compass,
  Sparkles,
  Smartphone,
  Eye,
  DoorOpen,
  Sun,
  ShieldCheck,
  RotateCcw,
  Maximize2,
  Camera,
  CheckSquare,
  Square,
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 64;

export interface RecordingGuideModalProps {
  visible: boolean;
  onClose: () => void;
  onProceedToRecord: () => void;
  onProceedToGallery?: () => void;
}

interface GuideCard {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  badge: string;
  icon: any;
}

const GUIDE_CARDS: GuideCard[] = [
  {
    id: '1',
    title: 'Landscape Only (16:9)',
    subtitle: 'Wider Field of View',
    desc: 'Hold your phone horizontally. Landscape mode captures 2.4x wider optical angles required for monocular depth estimation.',
    badge: 'CRITICAL',
    icon: Smartphone,
  },
  {
    id: '2',
    title: 'Walk Slowly & Steadily',
    subtitle: 'Smooth Optical Flow',
    desc: 'Take slow, measured steps. Avoid sudden pivots or rapid movements to ensure pristine spatial frame alignment.',
    badge: 'ACCURACY',
    icon: Compass,
  },
  {
    id: '3',
    title: 'Capture Every Room',
    subtitle: 'Complete Property Coverage',
    desc: 'Pan smoothly across the living room, bedrooms, kitchen, and bathrooms without cutting the video.',
    badge: 'COVERAGE',
    icon: Maximize2,
  },
  {
    id: '4',
    title: 'Open Balcony Door',
    subtitle: 'Indoor-Outdoor Transition',
    desc: 'Keep the balcony door open before recording so the AI can map the terrace depth and outdoor sunlight exposure.',
    badge: 'SUNLIGHT',
    icon: DoorOpen,
  },
  {
    id: '5',
    title: 'Show Kitchen & Cabinets',
    subtitle: 'Modular Layout Detection',
    desc: 'Walk past kitchen countertops, sink fixtures, and appliance recesses for AI furniture segmentation.',
    badge: 'FIXTURES',
    icon: Eye,
  },
  {
    id: '6',
    title: 'Show Bathroom & Vanity',
    subtitle: 'Plumbing & Tile Depth',
    desc: 'Briefly sweep the bathroom tiles, shower partition, and vanity mirror to capture plumbing fixtures.',
    badge: 'INTERIORS',
    icon: ShieldCheck,
  },
  {
    id: '7',
    title: 'Avoid Shaking & Blurs',
    subtitle: 'Two-Handed Grip',
    desc: 'Hold phone firmly at chest height with both hands or use a gimbal. Sharp frames generate ultra-crisp 3D meshes.',
    badge: 'STABILITY',
    icon: RotateCcw,
  },
  {
    id: '8',
    title: '30–120 Seconds Duration',
    subtitle: 'Optimal Video Length',
    desc: 'A continuous 45–90 second take is ideal. Videos under 30s lack depth data; over 120s slow down processing.',
    badge: 'DURATION',
    icon: Sun,
  },
];

const CHECKLIST_ITEMS = [
  'Phone held horizontally (landscape)',
  'All room lights and lamps turned on',
  'All interior & balcony doors opened wide',
  'No people, pets, or moving objects in frame',
  'Ready for a 45–90s smooth continuous walk',
];

export const RecordingGuideModal: React.FC<RecordingGuideModalProps> = ({
  visible,
  onClose,
  onProceedToRecord,
  onProceedToGallery,
}) => {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>({
    0: true,
    1: true,
    2: true,
  });

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / CARD_WIDTH);
    setActiveCardIndex(Math.min(Math.max(0, index), GUIDE_CARDS.length - 1));
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleWrap}>
              <View style={styles.badgeRow}>
                <View style={styles.orangeBadge}>
                  <Sparkles size={11} color="#FF6B35" />
                  <Text style={styles.orangeBadgeText}>REHVO AI TOUR™ GUIDE</Text>
                </View>
                <Text style={styles.stepIndicator}>
                  {activeCardIndex + 1} of {GUIDE_CARDS.length}
                </Text>
              </View>
              <Text style={styles.title}>How to Record for Best 3D Results</Text>
              <Text style={styles.subtitle}>
                Follow these 8 AI recording guidelines for photorealistic 3D virtual tours.
              </Text>
            </View>

            <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={10}>
              <X size={20} color="#1A1A2E" />
            </Pressable>
          </View>

          {/* Animated Horizontal Cards Carousel */}
          <View style={styles.carouselSection}>
            <FlatList
              data={GUIDE_CARDS}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              snapToInterval={CARD_WIDTH + 12}
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselContainer}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              renderItem={({ item, index }) => {
                const Icon = item.icon;
                const isActive = index === activeCardIndex;
                return (
                  <View style={[styles.card, isActive && styles.activeCard]}>
                    <View style={styles.cardHeader}>
                      <View style={styles.cardIconCircle}>
                        <Icon size={20} color="#FF6B35" strokeWidth={2.4} />
                      </View>
                      <View style={styles.cardBadge}>
                        <Text style={styles.cardBadgeText}>{item.badge}</Text>
                      </View>
                    </View>

                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                    <Text style={styles.cardDesc}>{item.desc}</Text>
                  </View>
                );
              }}
            />

            {/* Carousel Dots */}
            <View style={styles.dotsRow}>
              {GUIDE_CARDS.map((_, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.dot,
                    activeCardIndex === idx ? styles.activeDot : styles.inactiveDot,
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Pre-recording Progress Checklist */}
          <View style={styles.checklistSection}>
            <View style={styles.checklistTitleRow}>
              <Text style={styles.checklistTitle}>PRE-RECORDING CHECKLIST</Text>
              <Text style={styles.checklistCount}>
                {Object.values(checkedItems).filter(Boolean).length}/{CHECKLIST_ITEMS.length} Ready
              </Text>
            </View>

            <ScrollView style={styles.checklistScroll} showsVerticalScrollIndicator={false}>
              {CHECKLIST_ITEMS.map((item, idx) => {
                const isChecked = !!checkedItems[idx];
                return (
                  <Pressable
                    key={idx}
                    style={styles.checkRow}
                    onPress={() => toggleCheck(idx)}
                    hitSlop={4}
                  >
                    {isChecked ? (
                      <CheckCircle2 size={16} color="#0E8F73" strokeWidth={2.4} />
                    ) : (
                      <View style={styles.uncheckedCircle} />
                    )}
                    <Text style={[styles.checkText, isChecked && styles.checkTextActive]}>
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <Pressable style={styles.primaryRecordBtn} onPress={onProceedToRecord}>
              <Camera size={18} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.primaryBtnText}>Record Walkthrough Video</Text>
            </Pressable>

            {onProceedToGallery && (
              <Pressable style={styles.secondaryGalleryBtn} onPress={onProceedToGallery}>
                <Video size={16} color="#1A1A2E" strokeWidth={2.2} />
                <Text style={styles.secondaryBtnText}>Choose from Gallery</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 46, 0.78)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    gap: 16,
    maxHeight: '92%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerTitleWrap: {
    flex: 1,
    paddingRight: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  orangeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 107, 53, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  orangeBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#FF6B35',
    letterSpacing: 0.5,
  },
  stepIndicator: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1A1A2E',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 3,
    lineHeight: 16,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselSection: {
    gap: 10,
  },
  carouselContainer: {
    gap: 12,
    paddingHorizontal: 2,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#EEF2F6',
    gap: 6,
  },
  activeCard: {
    borderColor: '#FF6B35',
    backgroundColor: '#FFFBF9',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 107, 53, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBadge: {
    backgroundColor: '#1A1A2E',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  cardBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1A1A2E',
  },
  cardSubtitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FF6B35',
  },
  cardDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 2,
  },
  dot: {
    height: 5,
    borderRadius: 2.5,
  },
  activeDot: {
    width: 20,
    backgroundColor: '#FF6B35',
  },
  inactiveDot: {
    width: 6,
    backgroundColor: '#CBD5E1',
  },
  checklistSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    gap: 8,
  },
  checklistTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checklistTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#475569',
    letterSpacing: 0.6,
  },
  checklistCount: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0E8F73',
  },
  checklistScroll: {
    maxHeight: 105,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingVertical: 5,
  },
  uncheckedCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.8,
    borderColor: '#94A3B8',
  },
  checkText: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '500',
    flex: 1,
  },
  checkTextActive: {
    color: '#1A1A2E',
    fontWeight: '700',
  },
  actionsContainer: {
    gap: 8,
  },
  primaryRecordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FF6B35',
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  secondaryGalleryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 16,
  },
  secondaryBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A1A2E',
  },
});
