import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Clock, MapPin, TrendingUp, ChevronRight } from 'lucide-react-native';
import { SEARCH_COLORS } from './searchConstants';

interface SearchSuggestionsProps {
  recentSearches: string[];
  popularLocations: string[];
  onSelect: (text: string) => void;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  recentSearches,
  popularLocations,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={13} color={SEARCH_COLORS.muted} strokeWidth={2} />
            <Text style={styles.sectionTitle}>Recent searches</Text>
          </View>
          {recentSearches.map((item) => (
            <Pressable
              key={item}
              style={styles.row}
              onPress={() => onSelect(item)}
              accessibilityRole="button"
              accessibilityLabel={`Search for ${item}`}
            >
              <View style={styles.rowLeft}>
                <Clock size={16} color={SEARCH_COLORS.muted} strokeWidth={1.8} />
                <View>
                  <Text style={styles.rowText}>{item}</Text>
                  <Text style={styles.subText}>Recent search</Text>
                </View>
              </View>
              <ChevronRight size={15} color="#A5A2AD" />
            </Pressable>
          ))}
        </View>
      )}

      {/* Popular Locations & Landmarks */}
      {popularLocations.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={13} color={SEARCH_COLORS.muted} strokeWidth={2} />
            <Text style={styles.sectionTitle}>Popular locations & landmarks</Text>
          </View>
          {popularLocations.map((item) => (
            <Pressable
              key={item}
              style={styles.row}
              onPress={() => onSelect(item)}
              accessibilityRole="button"
              accessibilityLabel={`Search location ${item}`}
            >
              <View style={styles.rowLeft}>
                <MapPin size={16} color="#6C4DFF" strokeWidth={1.8} />
                <View>
                  <Text style={styles.rowText}>{item}</Text>
                  <Text style={styles.subText}>
                    {item.includes('Metro') ? 'Transit & commute hotspot' : 'Popular neighbourhood · Mumbai'}
                  </Text>
                </View>
              </View>
              <ChevronRight size={15} color="#A5A2AD" />
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
    gap: 20,
    backgroundColor: '#F8F7F4',
  },
  section: {
    gap: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#777482',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E5EC',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#171522',
  },
  subText: {
    fontSize: 11.5,
    color: '#777482',
    fontWeight: '500',
    marginTop: 1,
  },
});
