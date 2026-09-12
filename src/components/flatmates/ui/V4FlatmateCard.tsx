import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
} from 'react-native';
import {
  Heart,
  MapPin,
  Briefcase,
  IndianRupee,
  Calendar,
  Sparkles,
  ShieldCheck,
  X,
  ChevronRight,
  BedDouble,
} from 'lucide-react-native';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Rect,
} from 'react-native-svg';
import { FlatmateProfile } from '../../../types';
import { V4CompatibilityRing } from './V4CompatibilityRing';
import { V4WaveButton } from './V4WaveButton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface V4FlatmateCardProps {
  profile: FlatmateProfile;
  isSaved?: boolean;
  isWaved?: boolean;
  isMatched?: boolean;
  isWaving?: boolean;
  onSelect: () => void;
  onToggleSave: () => void;
  onWave: () => void;
  onPass?: () => void;
  showPassBtn?: boolean;
}

export const V4FlatmateCard: React.FC<V4FlatmateCardProps> = ({
  profile,
  isSaved = false,
  isWaved = false,
  isMatched = false,
  isWaving = false,
  onSelect,
  onToggleSave,
  onWave,
  onPass,
  showPassBtn = true,
}) => {
  const photo =
    (profile.photos && profile.photos[0]) ||
    profile.avatar ||
    profile.avatar_url ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80';

  const compatibilityScore = profile.match_score || profile.compatibility?.overall || 96;

  const lifestyleTags =
    (profile.lifestyle_tags && profile.lifestyle_tags.length > 0)
      ? profile.lifestyle_tags
      : (profile.lifestyle_preferences && profile.lifestyle_preferences.length > 0)
      ? profile.lifestyle_preferences
      : ['🚭 Non-Smoker', '🥗 Veg Friendly', '💻 Hybrid WFH', '🐶 Pet Friendly'];

  return (
    <View style={styles.card}>
      {/* 1. Main Photo Container */}
      <Pressable
        style={styles.photoContainer}
        onPress={onSelect}
        accessibilityRole="button"
        accessibilityLabel={`View ${profile.name}'s profile`}
      >
        <Image source={{ uri: photo }} style={styles.photo} resizeMode="cover" />

        {/* Top Smooth Gradient */}
        <View pointerEvents="none" style={styles.topGradientWrap}>
          <Svg width="100%" height="100%">
            <Defs>
              <SvgLinearGradient id={`cardTopGrad_${profile.id}`} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#031B2A" stopOpacity="0.65" />
                <Stop offset="50%" stopColor="#031B2A" stopOpacity="0.2" />
                <Stop offset="100%" stopColor="#031B2A" stopOpacity="0" />
              </SvgLinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill={`url(#cardTopGrad_${profile.id})`} />
          </Svg>
        </View>

        {/* Bottom Smooth Gradient */}
        <View pointerEvents="none" style={styles.bottomGradientWrap}>
          <Svg width="100%" height="100%">
            <Defs>
              <SvgLinearGradient id={`cardBottomGrad_${profile.id}`} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#031B2A" stopOpacity="0" />
                <Stop offset="30%" stopColor="#031B2A" stopOpacity="0.2" />
                <Stop offset="70%" stopColor="#031B2A" stopOpacity="0.75" />
                <Stop offset="100%" stopColor="#031B2A" stopOpacity="0.95" />
              </SvgLinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill={`url(#cardBottomGrad_${profile.id})`} />
          </Svg>
        </View>

        {/* Top Badges Row */}
        <View style={styles.topOverlays}>
          {profile.is_kyc_verified ? (
            <View style={styles.verifiedGlassPill}>
              <ShieldCheck size={12} color="#10B981" strokeWidth={3} />
              <Text style={styles.verifiedGlassText}>KYC VERIFIED</Text>
            </View>
          ) : (
            <View style={styles.genderGlassPill}>
              <Text style={styles.genderGlassText}>
                {(profile.gender || 'Verified').toUpperCase()}
              </Text>
            </View>
          )}

          {/* Top Right Save Heart */}
          <Pressable
            style={[styles.glassCircleBtn, isSaved && styles.glassCircleBtnActive]}
            onPress={onToggleSave}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={isSaved ? 'Unsave' : 'Save'}
          >
            <Heart
              size={18}
              color={isSaved ? '#EF4444' : '#FFFFFF'}
              fill={isSaved ? '#EF4444' : 'transparent'}
              strokeWidth={2.4}
            />
          </Pressable>
        </View>

        {/* Bottom Info on Photo */}
        <View style={styles.photoBottomInfo}>
          {/* Compatibility score floating pill */}
          <View style={styles.synergyBadge}>
            <Sparkles size={12} color="#042F2E" />
            <Text style={styles.synergyText}>{compatibilityScore}% SYNERGY</Text>
          </View>

          <View style={styles.nameRow}>
            <Text style={styles.nameText} numberOfLines={1}>
              {profile.name}
              {profile.age ? <Text style={styles.ageText}>, {profile.age}</Text> : null}
            </Text>
          </View>

          <View style={styles.occupationRow}>
            <Briefcase size={13} color="#E2ECEF" strokeWidth={2.2} />
            <Text style={styles.occupationText} numberOfLines={1}>
              {profile.occupation || profile.profession || 'Working Professional'}
              {profile.company_or_college ? ` · ${profile.company_or_college}` : ''}
            </Text>
          </View>

          <View style={styles.locationRow}>
            <MapPin size={13} color="#99F6E4" strokeWidth={2.4} />
            <Text style={styles.locationText} numberOfLines={1}>
              {profile.locality || (profile.preferred_locations && profile.preferred_locations[0]) || 'Mumbai'}, {profile.city || 'Mumbai'}
            </Text>
          </View>
        </View>
      </Pressable>

      {/* 2. Specs & Criteria Row */}
      <View style={styles.specsRow}>
        <View style={styles.specTile}>
          <Text style={styles.specLabel}>BUDGET</Text>
          <Text style={styles.specVal}>
            ₹{((profile.budget_min || 15000) / 1000).toFixed(0)}k–₹{((profile.budget_max || 30000) / 1000).toFixed(0)}k
          </Text>
        </View>

        <View style={styles.specDivider} />

        <View style={styles.specTile}>
          <Text style={styles.specLabel}>ROOM TYPE</Text>
          <Text style={styles.specVal} numberOfLines={1}>
            {profile.room_preference || profile.room_type_preference || 'Private Room'}
          </Text>
        </View>

        <View style={styles.specDivider} />

        <View style={styles.specTile}>
          <Text style={styles.specLabel}>MOVE-IN</Text>
          <Text style={styles.specVal} numberOfLines={1}>
            {profile.move_in_timing || profile.move_in_date || 'Immediate'}
          </Text>
        </View>
      </View>

      {/* 3. Lifestyle Tags Horizontal Rail */}
      <View style={styles.lifestyleRail}>
        {lifestyleTags.slice(0, 4).map((tag, idx) => (
          <View key={idx} style={styles.lifestylePill}>
            <Text style={styles.lifestylePillText}>{tag}</Text>
          </View>
        ))}
      </View>

      {/* 4. Action Dock Bar */}
      <View style={styles.actionDock}>
        {showPassBtn && onPass && (
          <Pressable
            style={styles.passBtn}
            onPress={onPass}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Pass profile"
          >
            <X size={18} color="#94A3B8" strokeWidth={2.6} />
          </Pressable>
        )}

        <View style={{ flex: 1 }}>
          <V4WaveButton
            isWaved={isWaved}
            isMatched={isMatched}
            isLoading={isWaving}
            onPress={onWave}
            size="large"
          />
        </View>

        <Pressable
          style={styles.viewProfileBtn}
          onPress={onSelect}
          accessibilityRole="button"
          accessibilityLabel="View full profile"
        >
          <Text style={styles.viewProfileBtnText}>View</Text>
          <ChevronRight size={15} color="#0F766E" strokeWidth={2.4} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 3,
    marginBottom: 16,
  },
  photoContainer: {
    width: '100%',
    height: 380,
    position: 'relative',
    backgroundColor: '#031B2A',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  topGradientWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 90,
  },
  bottomGradientWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 180,
  },
  topOverlays: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  verifiedGlassPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(15, 118, 110, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(204, 251, 241, 0.3)',
  },
  verifiedGlassText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  genderGlassPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  genderGlassText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  glassCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(3, 27, 42, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassCircleBtnActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
    borderColor: '#EF4444',
  },
  photoBottomInfo: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    right: 16,
    gap: 4,
  },
  synergyBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#99F6E4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 2,
  },
  synergyText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#042F2E',
    letterSpacing: 0.4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  nameText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  ageText: {
    fontSize: 19,
    fontWeight: '600',
    color: '#E2ECEF',
  },
  occupationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  occupationText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#E2ECEF',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  locationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#CCFBF1',
  },
  specsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
  },
  specTile: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  specLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  specVal: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  specDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  lifestyleRail: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  lifestylePill: {
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  lifestylePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F766E',
  },
  actionDock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  passBtn: {
    width: 48,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewProfileBtn: {
    height: 50,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#F0FDFA',
    borderWidth: 1.2,
    borderColor: '#CCFBF1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  viewProfileBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F766E',
  },
});
