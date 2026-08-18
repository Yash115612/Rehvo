import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  LayoutChangeEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {
  Building2,
  BedDouble,
  DoorClosed,
  Users,
  Sparkles,
  Home,
} from 'lucide-react-native';

export type PropertyCategory =
  | 'rent'
  | 'pg'
  | 'rooms'
  | 'flatmates'
  | 'studios';

export interface CategoryOption {
  id: PropertyCategory;
  label: string;
  shortLabel?: string;
  icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
  propertyTypeFilter?: string;
}

export const PROPERTY_CATEGORIES: CategoryOption[] = [
  {
    id: 'rent',
    label: 'Rent',
    icon: Building2,
    propertyTypeFilter: 'FLAT',
  },
  {
    id: 'pg',
    label: 'PG / Co-living',
    icon: BedDouble,
    propertyTypeFilter: 'PG',
  },
  {
    id: 'rooms',
    label: 'Rooms',
    icon: DoorClosed,
    propertyTypeFilter: 'PRIVATE_ROOM',
  },
  {
    id: 'flatmates',
    label: 'Flatmates',
    icon: Users,
    propertyTypeFilter: 'FLAT',
  },
  {
    id: 'studios',
    label: 'Studios',
    icon: Sparkles,
    propertyTypeFilter: 'FLAT',
  },
];

interface TabLayoutInfo {
  x: number;
  width: number;
}

interface PropertyCategorySwitcherProps {
  selectedCategory: PropertyCategory;
  onCategoryChange: (category: PropertyCategory) => void;
}

interface CategoryTabItemProps {
  option: CategoryOption;
  isSelected: boolean;
  onPress: () => void;
  onLayout: (event: LayoutChangeEvent) => void;
}

const CategoryTabItem: React.FC<CategoryTabItemProps> = ({
  option,
  isSelected,
  onPress,
  onLayout,
}) => {
  const scale = useSharedValue(1);
  const Icon = option.icon;

  const handlePressIn = () => {
    scale.value = withTiming(0.97, { duration: 80 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 120 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View style={animatedStyle} onLayout={onLayout}>
      <Pressable
        style={[
          styles.tabItem,
          isSelected ? styles.tabItemActive : styles.tabItemInactive,
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        accessibilityRole="tab"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={`Category ${option.label}`}
      >
        <Icon
          size={18}
          color={isSelected ? '#6C4DFF' : '#777482'}
          strokeWidth={isSelected ? 2.3 : 1.9}
        />
        <Text
          style={[
            styles.tabText,
            isSelected ? styles.tabTextActive : styles.tabTextInactive,
          ]}
          numberOfLines={1}
        >
          {option.label}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

export const PropertyCategorySwitcher: React.FC<
  PropertyCategorySwitcherProps
> = ({ selectedCategory, onCategoryChange }) => {
  const scrollRef = useRef<ScrollView>(null);
  const [layouts, setLayouts] = useState<Record<string, TabLayoutInfo>>({});

  const scrollToSelected = useCallback(
    (category: PropertyCategory) => {
      const layout = layouts[category];
      if (layout && scrollRef.current) {
        const scrollTarget = Math.max(0, layout.x - 32);
        scrollRef.current.scrollTo({ x: scrollTarget, animated: true });
      }
    },
    [layouts]
  );

  useEffect(() => {
    scrollToSelected(selectedCategory);
  }, [selectedCategory, layouts, scrollToSelected]);

  const handleTabLayout = (category: PropertyCategory, e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    setLayouts((prev) => {
      if (prev[category]?.x === x && prev[category]?.width === width) {
        return prev;
      }
      return {
        ...prev,
        [category]: { x, width },
      };
    });
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {PROPERTY_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <CategoryTabItem
              key={cat.id}
              option={cat}
              isSelected={isSelected}
              onPress={() => onCategoryChange(cat.id)}
              onLayout={(e) => handleTabLayout(cat.id, e)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#F8F7F4',
    marginTop: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 9,
    alignItems: 'center',
    flexDirection: 'row',
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    gap: 8,
    borderWidth: 1.5,
    flexShrink: 0,
  },
  tabItemInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E8E5EC',
  },
  tabItemActive: {
    backgroundColor: '#F0ECFF',
    borderColor: '#6C4DFF',
    shadowColor: '#6C4DFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    letterSpacing: -0.2,
    flexShrink: 0,
  },
  tabTextActive: {
    fontWeight: '800',
    color: '#6C4DFF',
  },
  tabTextInactive: {
    fontWeight: '600',
    color: '#777482',
  },
});
