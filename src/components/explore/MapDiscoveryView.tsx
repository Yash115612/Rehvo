import React, { useState } from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { Property } from '../../types';

interface MapDiscoveryViewProps {
  properties: Property[];
  savedPropertyIds: string[];
  onToggleSave: (id: string) => void;
  onSelectProperty: (property: Property) => void;
}

export const MapDiscoveryView: React.FC<MapDiscoveryViewProps> = ({
  properties,
  savedPropertyIds,
  onSelectProperty,
}) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    properties[0] || null
  );

  return (
    <View style={styles.container}>
      {/* Map Graphic Background Placeholder */}
      <View style={styles.mapBg}>
        <Text style={[styles.mapLabel, { top: 20, left: 20 }]}>ARABIAN SEA</Text>
        <Text style={[styles.mapLabel, { top: 60, left: 140 }]}>BANDRA WEST</Text>
        <Text style={[styles.mapLabel, { top: 120, left: 200 }]}>ANDHERI WEST</Text>
        <Text style={[styles.mapLabel, { top: 220, left: 160 }]}>POWAI LAKE</Text>
      </View>

      {/* Top Controls Overlay */}
      <View style={styles.topControls}>
        <View style={styles.pillBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.pillText}>Mumbai Interactive Map</Text>
        </View>

        <View style={styles.countBadge}>
          <Text style={styles.countText}>{properties.length} Places Pinpoint</Text>
        </View>
      </View>

      {/* Pins Layer */}
      <View style={styles.pinsContainer}>
        {properties.map((prop, idx) => {
          const isSelected = selectedProperty?.id === prop.id;
          const isSaved = savedPropertyIds.includes(prop.id);

          return (
            <React.Fragment key={prop.id}>
              <Pressable
                onPress={() => setSelectedProperty(prop)}
                style={[
                  styles.markerBubble,
                  isSelected ? styles.markerSelected : styles.markerNormal,
                ]}
              >
                <Text style={[styles.markerText, isSelected && styles.markerTextSelected]}>
                  ₹{(prop.rent / 1000).toFixed(0)}K {isSaved ? '♥' : ''}
                </Text>
              </Pressable>
            </React.Fragment>
          );
        })}
      </View>

      {/* Floating Property Preview Card at Bottom */}
      {selectedProperty && (
        <View style={styles.floatingCardContainer}>
          <Pressable
            onPress={() => onSelectProperty(selectedProperty)}
            style={styles.previewCard}
          >
            {/* Thumbnail */}
            <View style={styles.thumbWrapper}>
              <Image
                source={{ uri: selectedProperty.images[0]?.url }}
                style={styles.thumbImage}
              />
              <View style={styles.bhkBadge}>
                <Text style={styles.bhkText}>{selectedProperty.bhk}</Text>
              </View>
            </View>

            {/* Details */}
            <View style={styles.detailsInfo}>
              <View style={styles.badgeRow}>
                {selectedProperty.verification_status === 'VERIFIED' && (
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedText}>✓ Verified</Text>
                  </View>
                )}
                <View style={styles.typeBadge}>
                  <Text style={styles.typeText}>
                    {selectedProperty.property_type.replace('_', ' ')}
                  </Text>
                </View>
              </View>

              <Text style={styles.cardTitle} numberOfLines={1}>
                {selectedProperty.title}
              </Text>

              <Text style={styles.cardLocality} numberOfLines={1}>
                {selectedProperty.locality}, Mumbai
              </Text>

              <Text style={styles.cardRent}>
                ₹{selectedProperty.rent.toLocaleString('en-IN')}
                <Text style={styles.rentPeriod}>/mo</Text>
              </Text>
            </View>

            {/* Arrow Button */}
            <View style={styles.arrowBtn}>
              <Text style={styles.arrowText}>→</Text>
            </View>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    backgroundColor: '#E6E4DE',
    position: 'relative',
  },
  mapBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#E3E0D8',
  },
  mapLabel: {
    position: 'absolute',
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(23, 21, 31, 0.25)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  topControls: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    zIndex: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pillBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E4E2DD',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#32B768',
  },
  pillText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#17151F',
  },
  countBadge: {
    backgroundColor: '#6C4DFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  pinsContainer: {
    flex: 1,
    padding: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  markerBubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    elevation: 3,
  },
  markerNormal: {
    backgroundColor: '#17151F',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  markerSelected: {
    backgroundColor: '#6C4DFF',
    borderColor: '#6C4DFF',
  },
  markerText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  markerTextSelected: {
    color: '#FFFFFF',
  },
  floatingCardContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    zIndex: 30,
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E4E2DD',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  thumbWrapper: {
    width: 64,
    height: 64,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  bhkBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: '#6C4DFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bhkText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  detailsInfo: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  verifiedBadge: {
    backgroundColor: '#EAF8F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedText: {
    color: '#32B768',
    fontSize: 9,
    fontWeight: '800',
  },
  typeBadge: {
    backgroundColor: '#EEE9FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeText: {
    color: '#6C4DFF',
    fontSize: 9,
    fontWeight: '800',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#17151F',
    marginTop: 2,
  },
  cardLocality: {
    fontSize: 11,
    color: '#86828F',
    fontWeight: '600',
  },
  cardRent: {
    fontSize: 13,
    fontWeight: '900',
    color: '#17151F',
    marginTop: 2,
  },
  rentPeriod: {
    fontSize: 10,
    color: '#86828F',
    fontWeight: '600',
  },
  arrowBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEE9FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 16,
    color: '#6C4DFF',
    fontWeight: '900',
  },
});

