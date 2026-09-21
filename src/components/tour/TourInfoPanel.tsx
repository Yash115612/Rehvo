/**
 * REHVO AI Tour™ — Property Information & Media Gallery Panel
 * Glassmorphism sliding sheet displaying property specs and media tabs.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import {
  Building,
  Compass,
  Sofa,
  Car,
  CheckCircle2,
  X,
  Share2,
  Bookmark,
  Calendar,
  Layers,
  FileText,
  Image as ImageIcon,
  Video,
} from 'lucide-react-native';
import { TourMeta, PropertyTour3D } from '../../types/tour';

export interface TourInfoPanelProps {
  visible: boolean;
  tour: PropertyTour3D;
  onClose: () => void;
  onShare: () => void;
  onBookTour: () => void;
}

export const TourInfoPanel: React.FC<TourInfoPanelProps> = ({
  visible,
  tour,
  onClose,
  onShare,
  onBookTour,
}) => {
  const [activeMediaTab, setActiveMediaTab] = useState<'3d' | 'photos' | 'videos' | 'floorplan' | 'docs'>('3d');
  const meta = tour.meta;

  const mediaTabs = [
    { id: '3d', label: '3D Tour', icon: Layers },
    { id: 'photos', label: 'Photos', icon: ImageIcon },
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'floorplan', label: 'Floorplan', icon: Compass },
    { id: 'docs', label: 'Documents', icon: FileText },
  ] as const;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.panelCard} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.verifiedRow}>
                <CheckCircle2 size={13} color="#0E8F73" strokeWidth={2.6} />
                <Text style={styles.verifiedText}>REHVO 100% VERIFIED LIVING</Text>
              </View>
              <Text style={styles.propertyTitle}>{tour.title}</Text>
              <Text style={styles.locationText}>{meta.locality}</Text>
            </View>

            <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
              <X size={18} color="#64748B" />
            </Pressable>
          </View>

          {/* Media Gallery Tab Bar */}
          <View style={styles.tabBar}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
              {mediaTabs.map((tab) => {
                const isActive = activeMediaTab === tab.id;
                const Icon = tab.icon;
                return (
                  <Pressable
                    key={tab.id}
                    style={[styles.tabItem, isActive && styles.tabItemActive]}
                    onPress={() => setActiveMediaTab(tab.id)}
                  >
                    <Icon size={12} color={isActive ? '#FFFFFF' : '#64748B'} strokeWidth={2.2} />
                    <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab.label}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Key Specs Grid */}
          <View style={styles.specsGrid}>
            <View style={styles.specCard}>
              <Building size={14} color="#0E8F73" />
              <Text style={styles.specLabel}>Configuration</Text>
              <Text style={styles.specValue}>{meta.property_size_bhk}</Text>
            </View>

            <View style={styles.specCard}>
              <Layers size={14} color="#2563EB" />
              <Text style={styles.specLabel}>Floor</Text>
              <Text style={styles.specValue}>{meta.floor}</Text>
            </View>

            <View style={styles.specCard}>
              <Compass size={14} color="#D97706" />
              <Text style={styles.specLabel}>Orientation</Text>
              <Text style={styles.specValue}>{meta.facing}</Text>
            </View>

            <View style={styles.specCard}>
              <Sofa size={14} color="#7C3AED" />
              <Text style={styles.specLabel}>Furnishing</Text>
              <Text style={styles.specValue}>{meta.furnished_status}</Text>
            </View>

            <View style={styles.specCard}>
              <Car size={14} color="#16A34A" />
              <Text style={styles.specLabel}>Parking</Text>
              <Text style={styles.specValue}>{meta.parking}</Text>
            </View>

            <View style={styles.specCard}>
              <Building size={14} color="#031B2A" />
              <Text style={styles.specLabel}>Building Age</Text>
              <Text style={styles.specValue}>{meta.age_of_building_years} Years Old</Text>
            </View>
          </View>

          {/* Action Row */}
          <View style={styles.bottomButtons}>
            <Pressable style={styles.shareBtn} onPress={onShare}>
              <Share2 size={16} color="#031B2A" />
              <Text style={styles.shareBtnText}>Share 3D Tour</Text>
            </Pressable>

            <Pressable style={styles.bookBtn} onPress={onBookTour}>
              <Calendar size={16} color="#FFFFFF" />
              <Text style={styles.bookBtnText}>Schedule Visit</Text>
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
  panelCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 20,
    gap: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#0E8F73',
    letterSpacing: 0.5,
  },
  propertyTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#031B2A',
  },
  locationText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  tabBar: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 3,
  },
  tabScroll: {
    gap: 6,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tabItemActive: {
    backgroundColor: '#0E8F73',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specCard: {
    width: '31%',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#EEF2F6',
    borderRadius: 12,
    padding: 10,
    gap: 3,
  },
  specLabel: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  specValue: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#031B2A',
  },
  bottomButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  shareBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 14,
  },
  shareBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#031B2A',
  },
  bookBtn: {
    flex: 1.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0E8F73',
    paddingVertical: 12,
    borderRadius: 14,
  },
  bookBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
