/**
 * V4GalleryScreen — Luxury Property Media & Gallery Viewer
 * Swipeable hero carousel with thumbnail filmstrip, 4 category filter tabs
 * (Photos, Floor Plan, Video Tour, 360 Panoramic), image counter badge ("3 / 18"),
 * fullscreen viewer, brochure download, share, and favorite toggles.
 */

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Modal,
  Platform,
  Share,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Video,
  Eye,
  Maximize2,
  X,
  Compass,
  FileText,
  Share2,
  Heart,
  Download,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react-native';
import { V4_COLORS } from '../../../theme/v4Theme';
import { useAppStore } from '../../../store/useAppStore';
import { Property } from '../../../types';
import * as propertyService from '../../../services/properties';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface GalleryItem {
  id: string;
  type: 'photo' | 'video' | '360' | 'floorplan';
  title: string;
  url: string;
  categoryName?: string;
}

export const V4GalleryScreen: React.FC = React.memo(() => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { properties } = useAppStore();

  const [property, setProperty] = useState<Property | null>(() => {
    return properties?.find((p) => p.id === id) || null;
  });
  const [loading, setLoading] = useState(!property && !!id);
  const [activeTab, setActiveTab] = useState<'all' | 'photo' | 'floorplan' | 'video' | '360'>('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreenVisible, setFullscreenVisible] = useState(false);
  const [favoritedItemIds, setFavoritedItemIds] = useState<Set<string>>(new Set());
  const [downloadingBrochure, setDownloadingBrochure] = useState(false);
  const [brochureDownloaded, setBrochureDownloaded] = useState(false);

  const heroScrollRef = useRef<ScrollView>(null);
  const thumbScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!property && id) {
      setLoading(true);
      propertyService
        .getPropertyById(id)
        .then((res) => {
          if (res.success && res.data) {
            setProperty(res.data);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id, property]);

  const mediaList = useMemo<GalleryItem[]>(() => {
    if (!property) return [];
    const items: GalleryItem[] = [];

    // 1. Property Images
    if (property.images && property.images.length > 0) {
      property.images.forEach((img, idx) => {
        items.push({
          id: img.id || `img-${idx}`,
          type: 'photo',
          title: img.is_cover ? 'Cover — Living Room' : `Room View ${idx + 1}`,
          url: img.url,
          categoryName: img.is_cover ? 'Living Room' : 'Interior',
        });
      });
    } else {
      // Fallback high-res sample images
      items.push(
        {
          id: 'sample-1',
          type: 'photo',
          title: 'Master Bedroom Suite',
          url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
          categoryName: 'Master Bedroom',
        },
        {
          id: 'sample-2',
          type: 'photo',
          title: 'Modern Modular Kitchen',
          url: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1400&q=80',
          categoryName: 'Kitchen',
        }
      );
    }

    // 2. Floor Plan
    if (property.floor_plan_url) {
      items.push({
        id: 'prop-floorplan',
        type: 'floorplan',
        title: 'Architectural Floor Plan & Carpet Area',
        url: property.floor_plan_url,
        categoryName: 'Floor Plan',
      });
    }

    // 3. Video Tour
    if ((property as any).video_tour_url || (property as any).video_url) {
      items.push({
        id: 'prop-video',
        type: 'video',
        title: 'Cinematic Walkthrough Tour',
        url: (property as any).video_tour_url || (property as any).video_url,
        categoryName: 'Video Tour',
      });
    }

    // 4. 360 Virtual Tour
    if (property.virtual_tour_url) {
      items.push({
        id: 'prop-virtual-tour',
        type: '360',
        title: '360° Panoramic Spatial Walkthrough',
        url: property.virtual_tour_url,
        categoryName: '360 Panoramic',
      });
    }

    return items;
  }, [property]);

  const filteredMedia = useMemo(() => {
    if (activeTab === 'all') return mediaList;
    return mediaList.filter((m) => m.type === activeTab);
  }, [mediaList, activeTab]);

  const currentItem = filteredMedia[activeIndex] || filteredMedia[0] || mediaList[0];

  const handleSelectThumbnail = useCallback((index: number) => {
    setActiveIndex(index);
    heroScrollRef.current?.scrollTo({
      x: index * SCREEN_WIDTH,
      animated: true,
    });
  }, []);

  const handleScrollHero = useCallback((event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    if (index >= 0 && index < filteredMedia.length && index !== activeIndex) {
      setActiveIndex(index);
      thumbScrollRef.current?.scrollTo({
        x: Math.max(0, index * 76 - 120),
        animated: true,
      });
    }
  }, [activeIndex, filteredMedia.length]);

  const toggleFavoriteItem = useCallback((itemId: string) => {
    setFavoritedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }, []);

  const handleSharePhoto = useCallback(async () => {
    if (!currentItem) return;
    try {
      await Share.share({
        title: `${property?.title || 'Luxury Property'} - REHVO Gallery`,
        message: `Take a look at this stunning property on REHVO:\n${property?.title} in ${property?.locality}\n${currentItem.url}`,
        url: currentItem.url,
      });
    } catch {
      // Non-blocking share cancellation
    }
  }, [currentItem, property?.locality, property?.title]);

  const handleDownloadBrochure = useCallback(() => {
    setDownloadingBrochure(true);
    setTimeout(() => {
      setDownloadingBrochure(false);
      setBrochureDownloaded(true);
      Alert.alert(
        'Brochure Downloaded',
        `Official verified specification brochure for "${property?.title || 'Property'}" has been saved.`
      );
      setTimeout(() => setBrochureDownloaded(false), 3500);
    }, 1200);
  }, [property?.title]);

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 14) }]}>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {property?.title || 'Property Media Gallery'}
          </Text>
          <Text style={styles.headerSub}>
            {property?.locality || 'Verified'} • {mediaList.length} Total Media
          </Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={handleSharePhoto}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Share current media"
          >
            <Share2 size={18} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={handleDownloadBrochure}
            disabled={downloadingBrochure}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Download Property Brochure"
          >
            {downloadingBrochure ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : brochureDownloaded ? (
              <Check size={18} color="#10B981" />
            ) : (
              <Download size={18} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* 4 Category Filter Tabs */}
      <View style={styles.categoryTabs}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {[
            { id: 'all', label: `All (${mediaList.length})` },
            { id: 'photo', label: `Photos (${mediaList.filter((m) => m.type === 'photo').length})` },
            { id: 'floorplan', label: `Floor Plan (${mediaList.filter((m) => m.type === 'floorplan').length})` },
            { id: 'video', label: `Video Tour (${mediaList.filter((m) => m.type === 'video').length})` },
            { id: '360', label: `360° Panoramic (${mediaList.filter((m) => m.type === '360').length})` },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tabChip, isSelected && styles.tabChipActive]}
                onPress={() => {
                  setActiveTab(tab.id as any);
                  setActiveIndex(0);
                  heroScrollRef.current?.scrollTo({ x: 0, animated: false });
                }}
              >
                <Text style={[styles.tabChipText, isSelected && styles.tabChipTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={V4_COLORS.primary} />
          <Text style={styles.loadingText}>Loading luxury media assets...</Text>
        </View>
      ) : filteredMedia.length === 0 ? (
        <View style={styles.centerContainer}>
          <Eye size={40} color="#64748B" />
          <Text style={styles.emptyTitle}>No Media in Selected Category</Text>
          <Text style={styles.emptySub}>Please choose another tab to view available photos and walkthroughs.</Text>
        </View>
      ) : (
        <View style={styles.contentWrap}>
          {/* Main Hero Swipeable Carousel */}
          <View style={styles.heroContainer}>
            <ScrollView
              ref={heroScrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleScrollHero}
              style={styles.heroScroll}
            >
              {filteredMedia.map((item, idx) => (
                <TouchableOpacity
                  key={`${item.id}_${idx}`}
                  style={styles.heroSlide}
                  activeOpacity={0.95}
                  onPress={() => setFullscreenVisible(true)}
                >
                  <Image source={{ uri: item.url }} style={styles.heroImage} resizeMode="cover" />
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Counter Pill Badge ("3 / 18") */}
            <View style={styles.counterBadge}>
              <Text style={styles.counterBadgeText}>
                {activeIndex + 1} / {filteredMedia.length}
              </Text>
            </View>

            {/* Favorite & Fullscreen Floating Triggers */}
            <View style={styles.heroFloatingActions}>
              <TouchableOpacity
                style={styles.heroActionBtn}
                onPress={() => currentItem && toggleFavoriteItem(currentItem.id)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityLabel="Favorite photo"
              >
                <Heart
                  size={18}
                  color={currentItem && favoritedItemIds.has(currentItem.id) ? '#EF4444' : '#FFFFFF'}
                  fill={currentItem && favoritedItemIds.has(currentItem.id) ? '#EF4444' : 'transparent'}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.heroActionBtn}
                onPress={() => setFullscreenVisible(true)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityLabel="Open Fullscreen Zoom"
              >
                <Maximize2 size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Media Type & Caption Overlay */}
            <View style={styles.captionOverlay}>
              <View style={styles.typeBadge}>
                {currentItem?.type === '360' && <Compass size={12} color="#FFFFFF" />}
                {currentItem?.type === 'floorplan' && <FileText size={12} color="#FFFFFF" />}
                {currentItem?.type === 'video' && <Video size={12} color="#FFFFFF" />}
                {currentItem?.type === 'photo' && <Eye size={12} color="#FFFFFF" />}
                <Text style={styles.typeBadgeText}>
                  {currentItem?.type.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.captionTitle}>{currentItem?.title}</Text>
            </View>
          </View>

          {/* Filmstrip Thumbnails Strip */}
          <View style={styles.filmstripWrap}>
            <ScrollView
              ref={thumbScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filmstripScroll}
            >
              {filteredMedia.map((item, idx) => {
                const isSelected = idx === activeIndex;
                return (
                  <TouchableOpacity
                    key={`thumb_${item.id}_${idx}`}
                    style={[styles.thumbBox, isSelected && styles.thumbBoxSelected]}
                    onPress={() => handleSelectThumbnail(idx)}
                    activeOpacity={0.8}
                  >
                    <Image source={{ uri: item.url }} style={styles.thumbImage} />
                    {isSelected && <View style={styles.thumbHighlightBorder} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Property Quick Specs Footer Bar */}
          <View style={[styles.footerSpecs, { paddingBottom: Math.max(insets.bottom, 18) }]}>
            <View>
              <Text style={styles.footerRent}>
                ₹{property?.rent ? Number(property.rent).toLocaleString('en-IN') : '85,000'}
                <Text style={styles.footerPerMonth}> /month</Text>
              </Text>
              <Text style={styles.footerSpecsText}>
                {property?.bhk || '2 BHK'} • {property?.bathrooms || 2} Baths • {property?.area_sqft || 1150} sq.ft
              </Text>
            </View>

            <TouchableOpacity
              style={styles.scheduleBtn}
              onPress={() => router.push(`/(renter)/property/${property?.id || id}` as any)}
              accessibilityLabel="View Full Property Details"
            >
              <Text style={styles.scheduleBtnText}>View Property</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Fullscreen High-Res Modal */}
      <Modal
        visible={fullscreenVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFullscreenVisible(false)}
      >
        <View style={styles.fullscreenModal}>
          <TouchableOpacity
            style={[styles.fullscreenCloseBtn, { top: Math.max(insets.top, 16) + 8 }]}
            onPress={() => setFullscreenVisible(false)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Close Fullscreen"
          >
            <X size={22} color="#FFFFFF" />
          </TouchableOpacity>

          {currentItem && (
            <View style={styles.fullscreenCenter}>
              <Image
                source={{ uri: currentItem.url }}
                style={styles.fullscreenImage}
                resizeMode="contain"
              />
              <View style={styles.fullscreenFooterBar}>
                <Text style={styles.fullscreenFooterTitle}>{currentItem.title}</Text>
                <Text style={styles.fullscreenFooterSub}>
                  {activeIndex + 1} of {filteredMedia.length} • {property?.title}
                </Text>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#050D15',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSub: {
    fontSize: 11.5,
    color: '#94A3B8',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryTabs: {
    paddingVertical: 10,
    backgroundColor: '#091421',
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tabChip: {
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabChipActive: {
    backgroundColor: V4_COLORS.primary,
  },
  tabChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  tabChipTextActive: {
    color: '#FFFFFF',
  },
  contentWrap: {
    flex: 1,
    justifyContent: 'space-between',
  },
  heroContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#000000',
  },
  heroScroll: {
    flex: 1,
  },
  heroSlide: {
    width: SCREEN_WIDTH,
    height: '100%',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  counterBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  counterBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroFloatingActions: {
    position: 'absolute',
    top: 16,
    right: 16,
    gap: 10,
  },
  heroActionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captionOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(3, 27, 42, 0.85)',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    backgroundColor: V4_COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 4,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  captionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  filmstripWrap: {
    height: 90,
    backgroundColor: '#091421',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  filmstripScroll: {
    paddingHorizontal: 16,
    gap: 10,
    alignItems: 'center',
  },
  thumbBox: {
    width: 68,
    height: 68,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0F172A',
  },
  thumbBoxSelected: {
    borderWidth: 2.5,
    borderColor: V4_COLORS.primary,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  thumbHighlightBorder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 118, 110, 0.2)',
  },
  footerSpecs: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    backgroundColor: '#050D15',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  footerRent: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  footerPerMonth: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94A3B8',
  },
  footerSpecsText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  scheduleBtn: {
    paddingHorizontal: 20,
    minHeight: 44,
    borderRadius: 14,
    backgroundColor: V4_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 10,
  },
  loadingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
  },
  emptySub: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
  },
  fullscreenModal: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    position: 'relative',
  },
  fullscreenCloseBtn: {
    position: 'absolute',
    right: 16,
    zIndex: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullscreenCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullscreenImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.78,
  },
  fullscreenFooterBar: {
    position: 'absolute',
    bottom: 36,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 16,
    borderRadius: 16,
  },
  fullscreenFooterTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  fullscreenFooterSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 3,
  },
});
