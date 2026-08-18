import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';

export interface CategoryItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  categoryFilter: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'flats',
    title: 'Flats',
    subtitle: 'Entire homes',
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
    categoryFilter: 'Flats',
  },
  {
    id: 'pg',
    title: 'PG / Co-living',
    subtitle: 'Move-in ready',
    image:
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=80',
    categoryFilter: 'PG / Co-living',
  },
  {
    id: 'rooms',
    title: 'Rooms',
    subtitle: 'Private & shared',
    image:
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=80',
    categoryFilter: 'Rooms',
  },
  {
    id: 'flatmates',
    title: 'Flatmates',
    subtitle: 'Find your match',
    image:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80',
    categoryFilter: 'Flatmates',
  },
  {
    id: 'studio',
    title: 'Studio',
    subtitle: 'Compact living',
    image:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80',
    categoryFilter: 'Flats',
  },
];

interface HomeCategoryCarouselProps {
  onSelectCategory: (item: CategoryItem) => void;
}

export const HomeCategoryCarousel: React.FC<HomeCategoryCarouselProps> = ({
  onSelectCategory,
}) => {
  return (
    <View style={styles.section}>
      <View style={styles.headerWrap}>
        <Text style={styles.title}>What are you looking for?</Text>
        <Text style={styles.subtitle}>
          Explore homes that fit your lifestyle.
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((cat) => (
          <Pressable
            key={cat.id}
            style={styles.card}
            onPress={() => onSelectCategory(cat)}
            accessibilityRole="button"
            accessibilityLabel={`${cat.title}, ${cat.subtitle}`}
          >
            <Image
              source={{ uri: cat.image }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.overlay} />
            <View style={styles.textWrap}>
              <Text style={styles.cardTitle}>{cat.title}</Text>
              <Text style={styles.cardSub}>{cat.subtitle}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  headerWrap: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: '#777482',
    fontWeight: '500',
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: 140,
    height: 160,
    borderRadius: 18,
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
    backgroundColor: 'rgba(23, 21, 34, 0.38)',
  },
  textWrap: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  cardSub: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#F0ECFF',
    marginTop: 2,
  },
});
