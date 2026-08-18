import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  Search,
  MapPin,
  Clock,
  TrendingUp,
  X,
  Check,
} from 'lucide-react-native';

interface StepLocationProps {
  locations: string[];
  onChange: (locations: string[]) => void;
}

const POPULAR_AREAS = [
  'Andheri West',
  'Andheri East',
  'Powai',
  'Bandra West',
  'Goregaon',
  'Thane',
  'Borivali',
  'Worli',
  'Juhu',
  'Malad West',
];

const RECENT_AREAS = ['Andheri West', 'Powai', 'Bandra West'];

export const StepLocation: React.FC<StepLocationProps> = ({
  locations,
  onChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const toggleLocation = (loc: string) => {
    if (locations.includes(loc)) {
      onChange(locations.filter((l) => l !== loc));
    } else {
      onChange([...locations, loc]);
    }
  };

  const removeLocation = (loc: string) => {
    onChange(locations.filter((l) => l !== loc));
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim() && !locations.includes(searchQuery.trim())) {
      onChange([...locations, searchQuery.trim()]);
      setSearchQuery('');
    }
  };

  const filteredPopular = POPULAR_AREAS.filter((loc) =>
    loc.toLowerCase().includes(searchQuery.toLowerCase().trim()),
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Where do you want to live?</Text>
        <Text style={styles.subtitle}>
          Search neighbourhoods, metro stations, or popular areas.
        </Text>
      </View>

      {/* Location Search Input */}
      <View style={styles.searchBar}>
        <Search size={18} color="#777482" strokeWidth={2} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search Mumbai, Andheri, Powai..."
          placeholderTextColor="#777482"
          style={styles.input}
          returnKeyType="done"
          onSubmitEditing={handleSearchSubmit}
        />
        {Boolean(searchQuery.length > 0) && (
          <Pressable
            onPress={() => setSearchQuery('')}
            hitSlop={8}
            style={styles.clearBtn}
          >
            <X size={15} color="#777482" strokeWidth={2} />
          </Pressable>
        )}
      </View>

      {/* Selected Location Chips */}
      {locations.length > 0 && (
        <View style={styles.selectedWrapper}>
          <Text style={styles.selectedLabel}>Selected Preferred Areas</Text>
          <View style={styles.chipRow}>
            {locations.map((loc) => (
              <Pressable
                key={loc}
                style={styles.activeChip}
                onPress={() => removeLocation(loc)}
                accessibilityRole="button"
                accessibilityLabel={`Remove location ${loc}`}
              >
                <MapPin size={13} color="#6C4DFF" strokeWidth={2.2} />
                <Text style={styles.activeChipText}>{loc}</Text>
                <X size={13} color="#6C4DFF" strokeWidth={2.2} />
              </Pressable>
            ))}
          </View>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {/* Recent Locations */}
        {RECENT_AREAS.length > 0 && searchQuery.length === 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock size={13} color="#777482" strokeWidth={2} />
              <Text style={styles.sectionTitle}>Recent Searches</Text>
            </View>
            <View style={styles.popularGrid}>
              {RECENT_AREAS.map((loc) => {
                const isSelected = locations.includes(loc);
                return (
                  <Pressable
                    key={`recent-${loc}`}
                    style={[styles.locPill, isSelected && styles.locPillSelected]}
                    onPress={() => toggleLocation(loc)}
                  >
                    {isSelected ? (
                      <Check size={13} color="#FFFFFF" strokeWidth={2.5} />
                    ) : (
                      <Clock size={13} color="#777482" strokeWidth={2} />
                    )}
                    <Text
                      style={[
                        styles.locPillText,
                        isSelected && styles.locPillTextSelected,
                      ]}
                    >
                      {loc}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* Popular Areas */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={13} color="#777482" strokeWidth={2} />
            <Text style={styles.sectionTitle}>Popular Areas in Mumbai</Text>
          </View>
          <View style={styles.popularGrid}>
            {filteredPopular.map((loc) => {
              const isSelected = locations.includes(loc);
              return (
                <Pressable
                  key={loc}
                  style={[styles.locPill, isSelected && styles.locPillSelected]}
                  onPress={() => toggleLocation(loc)}
                >
                  {isSelected ? (
                    <Check size={13} color="#FFFFFF" strokeWidth={2.5} />
                  ) : (
                    <MapPin size={13} color="#777482" strokeWidth={2} />
                  )}
                  <Text
                    style={[
                      styles.locPillText,
                      isSelected && styles.locPillTextSelected,
                    ]}
                  >
                    {loc}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 8,
    paddingBottom: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 14,
    color: '#777482',
    fontWeight: '500',
    marginTop: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    paddingHorizontal: 14,
    gap: 10,
    marginBottom: 14,
  },
  input: {
    flex: 1,
    fontSize: 14.5,
    color: '#171522',
    fontWeight: '500',
  },
  clearBtn: {
    padding: 4,
  },
  selectedWrapper: {
    marginBottom: 16,
    gap: 8,
  },
  selectedLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#777482',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  activeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0ECFF',
    borderWidth: 1,
    borderColor: '#D8CCFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
  },
  activeChipText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  scrollList: {
    gap: 20,
    paddingBottom: 24,
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#777482',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  popularGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  locPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
  },
  locPillSelected: {
    backgroundColor: '#6C4DFF',
    borderColor: '#6C4DFF',
  },
  locPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#171522',
  },
  locPillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
