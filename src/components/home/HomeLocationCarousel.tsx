import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { ChevronRight, ArrowRight } from 'lucide-react-native';

export interface LocationItem {
  id: string;
  name: string;
  count: string;
  image: string;
}

const LOCATIONS: LocationItem[] = [
  {
    id: 'andheri_west',
    name: 'Andheri West',
    count: '120+ homes',
    image:
      'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'powai',
    name: 'Powai',
    count: '85+ homes',
    image:
      'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'bandra_west',
    name: 'Bandra West',
    count: '90+ homes',
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'goregaon',
    name: 'Goregaon',
    count: '65+ homes',
    image:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'thane',
    name: 'Thane',
    count: '110+ homes',
    image:
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'borivali',
    name: 'Borivali',
    count: '75+ homes',
    image:
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&auto=format&fit=crop&q=80',
  },
];

interface HomeLocationCarouselProps {
  onSelectLocation: (loc: LocationItem) => void;
  onViewAll: () => void;
}

export const HomeLocationCarousel: React.FC<HomeLocationCarouselProps> = ({
  onSelectLocation,
  onViewAll,
}) => {
  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Popular around Mumbai</Text>
        <Pressable
          style={styles.viewAllBtn}
          onPress={onViewAll}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="View all Mumbai locations"
        >
          <Text style={styles.viewAllText}>View all</Text>
          <ArrowRight size={14} color="#6C4DFF" strokeWidth={2.2} />
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {LOCATIONS.map((loc) => (
          <Pressable
            key={loc.id}
            style={styles.card}
            onPress={() => onSelectLocation(loc)}
            accessibilityRole="button"
            accessibilityLabel={`${loc.name}, ${loc.count}`}
          >
            <Image
              source={{ uri: loc.image }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.overlay} />
            <View style={styles.contentWrap}>
              <View style={{ flex: 1 }}>
                <Text style={styles.locName}>{loc.name}</Text>
                <Text style={styles.locCount}>{loc.count}</Text>
              </View>
              <View style={styles.chevronWrap}>
                <ChevronRight size={14} color="#FFFFFF" strokeWidth={2.5} />
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 30,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.3,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: 150,
    height: 95,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#E8E5EC',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(23, 21, 34, 0.42)',
  },
  contentWrap: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    right: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  locName: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  locCount: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F0ECFF',
    marginTop: 2,
  },
  chevronWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
