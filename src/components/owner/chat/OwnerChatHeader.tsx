import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Building2, MoreVertical } from 'lucide-react-native';
import { Property } from '../../../types';

interface OwnerChatHeaderProps {
  renterName: string;
  renterAvatar?: string;
  property: Property | null;
  onBack: () => void;
  onOpenProperty: () => void;
  onOpenMore: () => void;
}

export const OwnerChatHeader: React.FC<OwnerChatHeaderProps> = ({
  renterName,
  renterAvatar,
  property,
  onBack,
  onOpenProperty,
  onOpenMore,
}) => {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, Platform.OS === 'ios' ? 44 : 24);

  const avatarUri =
    renterAvatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';

  const propertyContext = property
    ? `${property.locality} · ₹${property.rent.toLocaleString('en-IN')}/mo`
    : 'Property Enquiry';

  return (
    <View style={[styles.headerContainer, { paddingTop: topInset }]}>
      <View style={styles.headerRow}>
        {/* Back Button */}
        <Pressable
          style={styles.backBtn}
          onPress={onBack}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Back to previous screen"
        >
          <ArrowLeft size={21} color="#171522" strokeWidth={2.2} />
        </Pressable>

        {/* Center: Renter & Property Info */}
        <Pressable
          style={styles.centerInfo}
          onPress={onOpenProperty}
          accessibilityRole="button"
          accessibilityLabel={`Chatting with ${renterName}`}
        >
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
          <View style={styles.textCol}>
            <Text style={styles.renterName} numberOfLines={1}>
              {renterName}
            </Text>
            <Text style={styles.propContext} numberOfLines={1}>
              {propertyContext}
            </Text>
          </View>
        </Pressable>

        {/* Action Buttons */}
        <View style={styles.rightActions}>
          {property && (
            <Pressable
              style={styles.actionBtn}
              onPress={onOpenProperty}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="View property details"
            >
              <Building2 size={19} color="#6C4DFF" strokeWidth={2} />
            </Pressable>
          )}

          <Pressable
            style={styles.actionBtn}
            onPress={onOpenMore}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="More options"
          >
            <MoreVertical size={19} color="#171522" strokeWidth={2} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E5EC',
  },
  headerRow: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F7F5F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E8E5EC',
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  renterName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#171522',
  },
  propContext: {
    fontSize: 12.5,
    color: '#6C4DFF',
    fontWeight: '600',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F7F5F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
