/**
 * REHVO AI Tour™ — Video Walkthrough Recording Guide Overlay
 * Animated pre-recording instructions guiding owners to capture optimal spatial data.
 */

import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
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
} from 'lucide-react-native';

export interface RecordingGuideModalProps {
  visible: boolean;
  onClose: () => void;
  onProceedToRecord: () => void;
}

export const RecordingGuideModal: React.FC<RecordingGuideModalProps> = ({
  visible,
  onClose,
  onProceedToRecord,
}) => {
  const instructions = [
    {
      icon: Smartphone,
      title: 'Hold Phone Horizontally',
      desc: 'Landscape 16:9 orientation captures 2.4x wider room field of view.',
    },
    {
      icon: Compass,
      title: 'Walk Slowly & Smoothly',
      desc: 'Take slow steps without swinging your arms. Smooth video enables high optical depth.',
    },
    {
      icon: DoorOpen,
      title: 'Open All Interior Doors',
      desc: 'Ensure doors to kitchen, master bedroom, and balcony are wide open before recording.',
    },
    {
      icon: Sun,
      title: 'Turn On All Lights',
      desc: 'Switch on ceiling fixtures and open window curtains for optimal texture sharpness.',
    },
    {
      icon: Eye,
      title: 'Continuous Single Take',
      desc: 'Do not pause or cut. Walk steadily through every room in 45–90 seconds.',
    },
  ];

  const targetRooms = ['Living Room', 'Modular Kitchen', 'Master Bedroom', 'Bathrooms', 'Balcony'];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <View>
              <View style={styles.badge}>
                <Sparkles size={11} color="#FF6B35" />
                <Text style={styles.badgeText}>RECORDING GUIDE</Text>
              </View>
              <Text style={styles.title}>How to Record for AI 3D Tour</Text>
              <Text style={styles.sub}>
                A quick 60-second video walkthrough will be automatically converted to 3D.
              </Text>
            </View>

            <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
              <X size={18} color="#64748B" />
            </Pressable>
          </View>

          {/* Rooms to Cover Checklist */}
          <View style={styles.checklistBanner}>
            <Text style={styles.checkHeader}>REQUIRED ROOM COVERAGE:</Text>
            <View style={styles.roomChipsRow}>
              {targetRooms.map((room) => (
                <View key={room} style={styles.roomChip}>
                  <CheckCircle2 size={11} color="#0E8F73" strokeWidth={2.6} />
                  <Text style={styles.roomChipText}>{room}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Core Tips */}
          <ScrollView style={styles.scrollList} showsVerticalScrollIndicator={false}>
            {instructions.map((item, idx) => {
              const Icon = item.icon;
              return (
                <View key={idx} style={styles.instructionItem}>
                  <View style={styles.iconCircle}>
                    <Icon size={16} color="#FF6B35" strokeWidth={2.4} />
                  </View>
                  <View style={styles.instructionText}>
                    <Text style={styles.instructionTitle}>{item.title}</Text>
                    <Text style={styles.instructionDesc}>{item.desc}</Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Action Button */}
          <Pressable style={styles.startBtn} onPress={onProceedToRecord}>
            <Video size={16} color="#FFFFFF" strokeWidth={2.4} />
            <Text style={styles.startBtnText}>Ready to Select / Record Video</Text>
          </Pressable>
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
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 20,
    gap: 14,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#FF6B35',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 17,
    fontWeight: '900',
    color: '#031B2A',
  },
  sub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  closeBtn: {
    padding: 6,
  },
  checklistBanner: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    gap: 8,
  },
  checkHeader: {
    fontSize: 10,
    fontWeight: '900',
    color: '#475569',
    letterSpacing: 0.5,
  },
  roomChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  roomChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roomChipText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0E8F73',
  },
  scrollList: {
    maxHeight: 250,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  instructionText: {
    flex: 1,
    gap: 2,
  },
  instructionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#031B2A',
  },
  instructionDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FF6B35',
    paddingVertical: 13,
    borderRadius: 14,
    marginTop: 4,
  },
  startBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
