/**
 * REHVO AI Tour™ — Master 3D Spatial Virtual Tour Engine
 * Native 60 FPS GPU-accelerated 360° tour viewer with depth raycasting,
 * interactive hotspots, AR measure tool, sunlight simulation, and AI voice guide.
 */

import React, { useState, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  PanResponder,
  Pressable,
  Share,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Ruler,
  Sun,
  Palette,
  Eye,
  Sparkles,
  Info,
  Share2,
  Mic,
  Maximize2,
  Layers,
  CheckCircle2,
  Tv,
  Bed,
  Box,
  Volume2,
} from 'lucide-react-native';
import {
  PropertyTour3D,
  Room3D,
  SunlightTime,
  StoredMeasurement,
  VoiceCommandResult,
} from '../../types/tour';
import { project3DToViewport } from '../../lib/ai-tour/meshBuilder';
import { getSunlightSettings } from '../../lib/ai-tour/sunlight';
import { logTourEvent, saveTourMeasurement } from '../../lib/ai-tour/supabase';
import { Hotspot } from './Hotspot';
import { RoomNavigator } from './RoomNavigator';
import { MiniMap } from './MiniMap';
import { MeasureTool } from './MeasureTool';
import { SunlightControl } from './SunlightControl';
import { WallColorPicker } from './WallColorPicker';
import { VoiceGuideModal } from './VoiceGuideModal';
import { TourInfoPanel } from './TourInfoPanel';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface TourViewerProps {
  tour: PropertyTour3D;
  onExit?: () => void;
}

export const TourViewer: React.FC<TourViewerProps> = ({ tour, onExit }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Active Room State
  const [activeRoomId, setActiveRoomId] = useState<string>(tour.initial_room_id || tour.rooms[0]?.id || '');
  const activeRoom = useMemo(() => {
    return tour.rooms.find((r) => r.id === activeRoomId) || tour.rooms[0];
  }, [tour.rooms, activeRoomId]);

  // Camera Spatial Orientation (in degrees)
  const [yaw, setYaw] = useState<number>(0);
  const [pitch, setPitch] = useState<number>(0);
  const [zoomFov, setZoomFov] = useState<number>(75);

  // Feature Toggles & Modals
  const [sunlightMode, setSunlightMode] = useState<SunlightTime>('afternoon');
  const [showSunlightBar, setShowSunlightBar] = useState<boolean>(false);
  const [activeWallColor, setActiveWallColor] = useState<string>(activeRoom?.wall_color || '#FAF7F2');
  const [showWallColorPicker, setShowWallColorPicker] = useState<boolean>(false);
  const [isUnfurnishedMode, setIsUnfurnishedMode] = useState<boolean>(false);
  const [isMeasureToolActive, setIsMeasureToolActive] = useState<boolean>(false);
  const [showVoiceGuide, setShowVoiceGuide] = useState<boolean>(false);
  const [showInfoPanel, setShowInfoPanel] = useState<boolean>(false);
  const [showObjectLabels, setShowObjectLabels] = useState<boolean>(true);

  // Gesture Tracker for 360 rotation
  const lastPanRef = useRef({ x: 0, y: 0 });
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !isMeasureToolActive,
        onMoveShouldSetPanResponder: (_, gestureState) =>
          !isMeasureToolActive && (Math.abs(gestureState.dx) > 3 || Math.abs(gestureState.dy) > 3),
        onPanResponderGrant: () => {
          lastPanRef.current = { x: 0, y: 0 };
        },
        onPanResponderMove: (_, gestureState) => {
          if (isMeasureToolActive) return;

          const deltaX = gestureState.dx - lastPanRef.current.x;
          const deltaY = gestureState.dy - lastPanRef.current.y;
          lastPanRef.current = { x: gestureState.dx, y: gestureState.dy };

          // Sensitivity
          const sensitivity = 0.28;

          setYaw((prevYaw) => {
            let nextYaw = prevYaw + deltaX * sensitivity;
            if (nextYaw > 360) nextYaw -= 360;
            if (nextYaw < 0) nextYaw += 360;
            return nextYaw;
          });

          setPitch((prevPitch) => {
            const nextPitch = prevPitch - deltaY * sensitivity;
            return Math.max(-60, Math.min(60, nextPitch));
          });
        },
      }),
    [isMeasureToolActive]
  );

  // Room Teleportation Handler
  const handleTeleportRoom = useCallback(
    (targetRoomId: string) => {
      setActiveRoomId(targetRoomId);
      setPitch(0); // reset camera pitch for smooth arrival
      logTourEvent(tour.id, 'room_change');
    },
    [tour.id]
  );

  // Share Tour Link
  const handleShare = async () => {
    logTourEvent(tour.id, 'share');
    try {
      await Share.share({
        title: `REHVO AI 3D Tour — ${tour.title}`,
        message: `Take an interactive 3D virtual tour of "${tour.title}" in ${tour.meta.locality} before visiting! Zero Commission on REHVO:\nhttps://rehvo.in/tour/${tour.id}`,
      });
    } catch {}
  };

  // Voice command execution
  const handleExecuteVoiceCommand = (result: VoiceCommandResult) => {
    if (result.action === 'teleport' && result.target_room_id) {
      handleTeleportRoom(result.target_room_id);
    } else if (result.action === 'sunlight' && result.sunlight_mode) {
      setSunlightMode(result.sunlight_mode);
    } else if (result.action === 'furniture_toggle') {
      setIsUnfurnishedMode((prev) => !prev);
    } else if (result.action === 'measure') {
      setIsMeasureToolActive(true);
    }
  };

  // Save measurement
  const handleSaveMeasurement = async (meas: StoredMeasurement) => {
    await saveTourMeasurement(meas);
    logTourEvent(tour.id, 'measure');
    Alert.alert('Measurement Saved', `${meas.distance_ft} ft added to your saved room records.`);
  };

  // Calculate Sunlight Visual Shading
  const sunlightSettings = getSunlightSettings(sunlightMode);

  // Dynamic Texture (support furnished vs unfurnished AI mode)
  const currentPanoramaUrl =
    isUnfurnishedMode && activeRoom?.unfurnished_panorama_url
      ? activeRoom.unfurnished_panorama_url
      : activeRoom?.panorama_url;

  // Horizontal pan offset of equirectangular panorama based on Yaw (0-360 deg)
  const panoWidth = SCREEN_WIDTH * 3.5;
  const panoOffset = -((yaw / 360) * (panoWidth - SCREEN_WIDTH));
  const panoOffsetY = (pitch / 60) * 120;

  return (
    <View style={styles.root}>
      {/* ── 3D SPATIAL VIEWPORT & GESTURE LAYER ─────────────────────────────────── */}
      <View style={styles.viewport} {...panResponder.panHandlers}>
        {/* Equirectangular Panorama Layer */}
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
          <Image
            source={{ uri: currentPanoramaUrl }}
            style={[
              styles.panoramaImage,
              {
                width: panoWidth,
                height: SCREEN_HEIGHT * 1.3,
                transform: [{ translateX: panoOffset }, { translateY: panoOffsetY }],
              },
            ]}
            resizeMode="cover"
          />
        </View>

        {/* Dynamic Sunlight & Time-of-Day Shading Filter */}
        <View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: sunlightSettings.ambientTintHex,
              opacity: sunlightSettings.overlayOpacity,
            },
          ]}
          pointerEvents="none"
        />

        {/* Wall Paint Preview Tinting Filter */}
        {activeWallColor && (
          <View
            style={[
              StyleSheet.absoluteFillObject,
              {
                backgroundColor: activeWallColor,
                opacity: 0.12,
              },
            ]}
            pointerEvents="none"
          />
        )}

        {/* ── 3D PROJECTED HOTSPOTS ────────────────────────────────────────────── */}
        {activeRoom?.hotspots.map((hs) => {
          const proj = project3DToViewport(
            hs.position_3d,
            yaw,
            pitch,
            SCREEN_WIDTH,
            SCREEN_HEIGHT,
            zoomFov
          );

          if (!proj.isVisible) return null;

          return (
            <Hotspot
              key={hs.id}
              hotspot={hs}
              screenX={proj.x}
              screenY={proj.y}
              onPress={handleTeleportRoom}
            />
          );
        })}

        {/* ── 3D PROJECTED DETECTED OBJECTS ────────────────────────────────────── */}
        {showObjectLabels &&
          !isUnfurnishedMode &&
          activeRoom?.detected_objects.map((obj) => {
            const proj = project3DToViewport(
              obj.position_3d,
              yaw,
              pitch,
              SCREEN_WIDTH,
              SCREEN_HEIGHT,
              zoomFov
            );

            if (!proj.isVisible) return null;

            return (
              <View
                key={obj.id}
                style={[
                  styles.detectedObjectTag,
                  {
                    left: proj.x - 45,
                    top: proj.y - 15,
                  },
                ]}
                pointerEvents="none"
              >
                <View style={styles.objectIconDot} />
                <Text style={styles.objectTagText}>{obj.name}</Text>
              </View>
            );
          })}

        {/* ── AR MEASURE TOOL OVERLAY ──────────────────────────────────────────── */}
        <MeasureTool
          active={isMeasureToolActive}
          roomId={activeRoomId}
          viewportWidth={SCREEN_WIDTH}
          viewportHeight={SCREEN_HEIGHT}
          onSaveMeasurement={handleSaveMeasurement}
          onClose={() => setIsMeasureToolActive(false)}
        />
      </View>

      {/* ── TOP HUD NAVIGATION BAR ────────────────────────────────────────────── */}
      <View
        style={[
          styles.topHudBar,
          { paddingTop: Math.max(insets.top, 12) },
        ]}
      >
        {/* Left: Exit button & Room Title */}
        <View style={styles.hudLeft}>
          <Pressable
            style={styles.hudCircleBtn}
            onPress={onExit || (() => router.back())}
            hitSlop={8}
          >
            <ArrowLeft size={18} color="#FFFFFF" strokeWidth={2.4} />
          </Pressable>

          <View style={styles.roomBadgeWrapper}>
            <View style={styles.titleLiveRow}>
              <View style={styles.liveOrangeDot} />
              <Text style={styles.hudRoomName} numberOfLines={1}>
                {activeRoom?.name}
              </Text>
            </View>
            <Text style={styles.hudDimensionsSub}>
              {activeRoom?.dimensions.length_ft}×{activeRoom?.dimensions.width_ft} ft • {activeRoom?.dimensions.carpet_area_sqft} sq.ft
            </Text>
          </View>
        </View>

        {/* Right: Interactive Feature Action Buttons */}
        <View style={styles.hudRight}>
          {/* Smart Voice AI Assistant */}
          <Pressable
            style={[styles.hudActionBtn, { backgroundColor: '#FF6B35' }]}
            onPress={() => setShowVoiceGuide(true)}
            hitSlop={6}
          >
            <Mic size={15} color="#FFFFFF" strokeWidth={2.5} />
          </Pressable>

          {/* Measure Tool Toggle */}
          <Pressable
            style={[styles.hudActionBtn, isMeasureToolActive && styles.hudActionBtnActive]}
            onPress={() => setIsMeasureToolActive((prev) => !prev)}
            hitSlop={6}
          >
            <Ruler size={15} color="#FFFFFF" strokeWidth={2.2} />
          </Pressable>

          {/* Sunlight Simulation Toggle */}
          <Pressable
            style={[styles.hudActionBtn, showSunlightBar && styles.hudActionBtnActive]}
            onPress={() => setShowSunlightBar((prev) => !prev)}
            hitSlop={6}
          >
            <Sun size={15} color="#FFFFFF" strokeWidth={2.2} />
          </Pressable>

          {/* Wall Color Picker Toggle */}
          <Pressable
            style={[styles.hudActionBtn, showWallColorPicker && styles.hudActionBtnActive]}
            onPress={() => setShowWallColorPicker((prev) => !prev)}
            hitSlop={6}
          >
            <Palette size={15} color="#FFFFFF" strokeWidth={2.2} />
          </Pressable>

          {/* Unfurnished AI Mode Toggle */}
          <Pressable
            style={[styles.hudActionBtn, isUnfurnishedMode && styles.hudActionBtnActive]}
            onPress={() => setIsUnfurnishedMode((prev) => !prev)}
            hitSlop={6}
          >
            <Eye size={15} color={isUnfurnishedMode ? '#FF6B35' : '#FFFFFF'} strokeWidth={2.2} />
          </Pressable>

          {/* Property Info / Specs */}
          <Pressable
            style={styles.hudActionBtn}
            onPress={() => setShowInfoPanel(true)}
            hitSlop={6}
          >
            <Info size={15} color="#FFFFFF" strokeWidth={2.2} />
          </Pressable>
        </View>
      </View>

      {/* ── FLOATING SUNLIGHT CONTROLLER BAR ─────────────────────────────────── */}
      {showSunlightBar && (
        <View style={[styles.floatingSunlightWrapper, { top: insets.top + 64 }]}>
          <SunlightControl
            currentMode={sunlightMode}
            onChangeMode={(mode) => {
              setSunlightMode(mode);
              logTourEvent(tour.id, 'sunlight_change');
            }}
          />
        </View>
      )}

      {/* ── FLOATING WALL COLOR PICKER ───────────────────────────────────────── */}
      {showWallColorPicker && activeRoom?.available_wall_colors && (
        <View style={[styles.floatingColorPickerWrapper, { top: insets.top + 64 }]}>
          <WallColorPicker
            colors={activeRoom.available_wall_colors}
            selectedColorHex={activeWallColor}
            onSelectColor={setActiveWallColor}
            onClose={() => setShowWallColorPicker(false)}
          />
        </View>
      )}

      {/* ── UNFURNISHED AI MODE BANNER NOTIFICATION ──────────────────────────── */}
      {isUnfurnishedMode && (
        <View style={[styles.unfurnishedBanner, { top: insets.top + 64 }]}>
          <Sparkles size={13} color="#0E8F73" />
          <Text style={styles.unfurnishedBannerText}>AI Unfurnished Preview Active</Text>
          <Pressable onPress={() => setIsUnfurnishedMode(false)}>
            <Text style={styles.unfurnishedBannerAction}>Restore</Text>
          </Pressable>
        </View>
      )}

      {/* ── BOTTOM HUD: MINIMAP & ROOM CAROUSEL ──────────────────────────────── */}
      <View
        style={[
          styles.bottomHudContainer,
          { paddingBottom: Math.max(insets.bottom, 12) + 8 },
        ]}
      >
        <View style={styles.bottomTopRow}>
          {/* Mini-Map */}
          <MiniMap
            floorplan={tour.floorplan}
            activeRoomId={activeRoomId}
            cameraYawDeg={yaw}
            rooms={tour.rooms}
            onSelectRoom={handleTeleportRoom}
          />

          {/* Compass Yaw Angle Indicator */}
          <View style={styles.compassPill}>
            <Text style={styles.compassText}>{Math.round(yaw)}°</Text>
            <Text style={styles.compassLabel}>
              {yaw >= 315 || yaw < 45
                ? 'N'
                : yaw >= 45 && yaw < 135
                ? 'E'
                : yaw >= 135 && yaw < 225
                ? 'S'
                : 'W'}
            </Text>
          </View>
        </View>

        {/* Room Navigator Carousel */}
        <RoomNavigator
          rooms={tour.rooms}
          activeRoomId={activeRoomId}
          onSelectRoom={handleTeleportRoom}
        />
      </View>

      {/* ── MODALS: VOICE GUIDE & TOUR INFO ──────────────────────────────────── */}
      <VoiceGuideModal
        visible={showVoiceGuide}
        rooms={tour.rooms}
        onClose={() => setShowVoiceGuide(false)}
        onExecuteCommand={handleExecuteVoiceCommand}
      />

      <TourInfoPanel
        visible={showInfoPanel}
        tour={tour}
        onClose={() => setShowInfoPanel(false)}
        onShare={handleShare}
        onBookTour={() => {
          setShowInfoPanel(false);
          router.push(`/(renter)/booking/${tour.property_id}` as any);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#031B2A',
  },
  viewport: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  panoramaImage: {
    position: 'absolute',
    top: -SCREEN_HEIGHT * 0.15,
  },
  detectedObjectTag: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(3, 27, 42, 0.82)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
    zIndex: 90,
  },
  objectIconDot: {
    width: 4.5,
    height: 4.5,
    borderRadius: 2.5,
    backgroundColor: '#38BDF8',
  },
  objectTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  topHudBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    zIndex: 150,
  },
  hudLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  hudCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(3, 27, 42, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  roomBadgeWrapper: {
    flex: 1,
    gap: 1,
  },
  titleLiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  liveOrangeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF6B35',
  },
  hudRoomName: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  hudDimensionsSub: {
    fontSize: 10.5,
    color: '#CBD5E1',
    fontWeight: '600',
  },
  hudRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hudActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(3, 27, 42, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hudActionBtnActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  floatingSunlightWrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 140,
    alignItems: 'center',
  },
  floatingColorPickerWrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 140,
  },
  unfurnishedBanner: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 140,
  },
  unfurnishedBannerText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065F46',
  },
  unfurnishedBannerAction: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0E8F73',
    textDecorationLine: 'underline',
  },
  bottomHudContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 150,
    gap: 6,
  },
  bottomTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  compassPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(3, 27, 42, 0.85)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  compassText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  compassLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FF6B35',
  },
});
