import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronDown, List, Map } from 'lucide-react-native';

interface ResultsHeaderProps {
  count: number;
  location: string;
  sortLabel: string;
  viewMode: 'list' | 'map';
  paddingHorizontal?: number;
  onSortPress: () => void;
  onViewChange: (mode: 'list' | 'map') => void;
}

export const ResultsHeader: React.FC<ResultsHeaderProps> = ({
  count,
  location,
  sortLabel,
  viewMode,
  paddingHorizontal,
  onSortPress,
  onViewChange,
}) => {
  return (
    <View
      style={[
        styles.container,
        paddingHorizontal !== undefined && { paddingHorizontal },
      ]}
    >
      {/* Left: Dynamic Count & Update info */}
      <View style={styles.left}>
        <Text style={styles.countText} numberOfLines={1}>
          {count > 0 ? `${count}+ places in ${location}` : `0 places in ${location}`}
        </Text>
        <View style={styles.updatedRow}>
          <View style={styles.liveDot} />
          <Text style={styles.updatedText}>Updated recently</Text>
        </View>
      </View>

      {/* Right: Sort Button & List/Map Toggle */}
      <View style={styles.right}>
        <Pressable
          style={styles.sortBtn}
          onPress={onSortPress}
          accessibilityRole="button"
          accessibilityLabel="Sort search results"
        >
          <Text style={styles.sortBtnText}>{sortLabel}</Text>
          <ChevronDown size={13} color="#171522" strokeWidth={2.2} />
        </Pressable>

        <View style={styles.segmentedToggle}>
          <Pressable
            style={[
              styles.segmentBtn,
              viewMode === 'list' && styles.segmentBtnActive,
            ]}
            onPress={() => onViewChange('list')}
            accessibilityRole="tab"
            accessibilityState={{ selected: viewMode === 'list' }}
          >
            <List
              size={13}
              color={viewMode === 'list' ? '#6C4DFF' : '#777482'}
              strokeWidth={2.2}
            />
            <Text
              style={[
                styles.segmentText,
                viewMode === 'list' && styles.segmentTextActive,
              ]}
            >
              List
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.segmentBtn,
              viewMode === 'map' && styles.segmentBtnActive,
            ]}
            onPress={() => onViewChange('map')}
            accessibilityRole="tab"
            accessibilityState={{ selected: viewMode === 'map' }}
          >
            <Map
              size={13}
              color={viewMode === 'map' ? '#6C4DFF' : '#777482'}
              strokeWidth={2.2}
            />
            <Text
              style={[
                styles.segmentText,
                viewMode === 'map' && styles.segmentTextActive,
              ]}
            >
              Map
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
  },
  left: {
    flex: 1,
    marginRight: 8,
  },
  countText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.3,
  },
  updatedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#32B768',
  },
  updatedText: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#777482',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
  },
  sortBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#171522',
  },
  segmentedToggle: {
    flexDirection: 'row',
    backgroundColor: '#EAE7E1',
    borderRadius: 10,
    padding: 2,
    gap: 2,
  },
  segmentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 28,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  segmentText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#777482',
  },
  segmentTextActive: {
    color: '#6C4DFF',
    fontWeight: '800',
  },
});
