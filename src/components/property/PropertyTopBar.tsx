import React from 'react';
import { View, StyleSheet, Pressable, Share, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Share2, Heart, MoreHorizontal } from 'lucide-react-native';
import { Property } from '../../types';

interface PropertyTopBarProps {
  property: Property;
  isSaved?: boolean;
  isOwner?: boolean;
  onBack: () => void;
  onToggleSave: (id: string) => void;
  onOpenOwnerActions?: () => void;
}

export const PropertyTopBar: React.FC<PropertyTopBarProps> = ({
  property,
  isSaved = false,
  isOwner = false,
  onBack,
  onToggleSave,
  onOpenOwnerActions,
}) => {
  const insets = useSafeAreaInsets();

  const handleShare = async () => {
    try {
      const shareUrl = `https://rehvo.com/property/${property.id}`;
      const message = `Check out this rental on REHVO: ${property.title} in ${property.locality}, ${property.city} (Rent: ₹${property.rent.toLocaleString('en-IN')}/mo) ${shareUrl}`;
      await Share.share({
        message,
        url: shareUrl,
        title: property.title,
      });
    } catch (e) {
      console.log('Error sharing:', e);
    }
  };

  return (
    <View
      style={[
        styles.topBar,
        { paddingTop: Math.max(insets.top, Platform.OS === 'ios' ? 12 : 16) },
      ]}
      pointerEvents="box-none"
    >
      {/* Back Button */}
      <Pressable
        style={styles.circleBtn}
        onPress={onBack}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <ArrowLeft size={20} color="#171522" strokeWidth={2.2} />
      </Pressable>

      {/* Right Action Stack */}
      <View style={styles.rightGroup}>
        {/* Owner Manage Overflow Button */}
        {isOwner && onOpenOwnerActions && (
          <Pressable
            style={styles.circleBtn}
            onPress={onOpenOwnerActions}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Manage listing options"
          >
            <MoreHorizontal size={20} color="#171522" strokeWidth={2.2} />
          </Pressable>
        )}

        <Pressable
          style={styles.circleBtn}
          onPress={handleShare}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Share property"
        >
          <Share2 size={18} color="#171522" strokeWidth={2.2} />
        </Pressable>

        <Pressable
          style={styles.circleBtn}
          onPress={() => onToggleSave(property.id)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={isSaved ? 'Remove from saved' : 'Save property'}
        >
          <Heart
            size={19}
            color={isSaved ? '#6C4DFF' : '#171522'}
            fill={isSaved ? '#6C4DFF' : 'transparent'}
            strokeWidth={2.2}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 20,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#171522',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});
