import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Search,
  MapPin,
  X,
  Plus,
  Check,
  ArrowRight,
} from 'lucide-react-native';

const POPULAR_LOCATIONS = [
  'Andheri West',
  'Andheri East',
  'Powai',
  'Bandra West',
  'Goregaon',
  'Thane',
  'Borivali',
  'Lower Parel',
  'Juhu',
  'Worli',
  'Malad',
  'Navi Mumbai',
  'Ghatkopar',
];

interface RenterLocationStepProps {
  selectedLocations: string[];
  onToggleLocation: (location: string) => void;
  onContinue: () => void;
}

export const RenterLocationStep: React.FC<RenterLocationStepProps> = ({
  selectedLocations,
  onToggleLocation,
  onContinue,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLocations = useMemo(() => {
    if (!searchQuery.trim()) return POPULAR_LOCATIONS;
    return POPULAR_LOCATIONS.filter((loc) =>
      loc.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
  }, [searchQuery]);

  const handleAddCustomLocation = () => {
    if (searchQuery.trim() && !selectedLocations.includes(searchQuery.trim())) {
      onToggleLocation(searchQuery.trim());
      setSearchQuery('');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <View style={styles.titleGroup}>
          <Text style={styles.heading}>Where do you want to live?</Text>
          <Text style={styles.subheading}>
            Choose one or more localities across Mumbai you'd love to explore.
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBox}>
          <Search size={18} color="#777482" strokeWidth={2} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search Mumbai, Andheri, Powai..."
            placeholderTextColor="#8C8994"
            style={styles.searchInput}
            onSubmitEditing={handleAddCustomLocation}
            returnKeyType="done"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
              <X size={16} color="#777482" />
            </Pressable>
          )}
        </View>

        {/* Selected Locations Chips */}
        {selectedLocations.length > 0 && (
          <View style={styles.selectedSection}>
            <Text style={styles.selectedLabel}>
              Selected areas ({selectedLocations.length}):
            </Text>
            <View style={styles.selectedChipsWrap}>
              {selectedLocations.map((loc) => (
                <Pressable
                  key={loc}
                  style={styles.selectedChip}
                  onPress={() => onToggleLocation(loc)}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${loc}`}
                >
                  <MapPin size={12} color="#6C4DFF" strokeWidth={2.2} />
                  <Text style={styles.selectedChipText}>{loc}</Text>
                  <X size={12} color="#6C4DFF" strokeWidth={2.5} />
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Popular Locations Grid */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.sectionTitle}>Popular Mumbai Localities</Text>

          <View style={styles.locationGrid}>
            {filteredLocations.map((loc) => {
              const isSelected = selectedLocations.includes(loc);

              return (
                <Pressable
                  key={loc}
                  style={[
                    styles.locPill,
                    isSelected && styles.locPillSelected,
                  ]}
                  onPress={() => onToggleLocation(loc)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isSelected }}
                  accessibilityLabel={loc}
                >
                  <MapPin
                    size={14}
                    color={isSelected ? '#6C4DFF' : '#777482'}
                    strokeWidth={2}
                  />
                  <Text
                    style={[
                      styles.locPillText,
                      isSelected && styles.locPillTextSelected,
                    ]}
                  >
                    {loc}
                  </Text>
                  {isSelected ? (
                    <Check size={14} color="#6C4DFF" strokeWidth={2.5} />
                  ) : (
                    <Plus size={14} color="#C9C5CC" strokeWidth={2} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Pressable
            style={[
              styles.continueBtn,
              selectedLocations.length === 0 && styles.continueBtnDisabled,
            ]}
            onPress={onContinue}
            disabled={selectedLocations.length === 0}
            accessibilityRole="button"
            accessibilityLabel="Continue to budget selection"
          >
            <Text style={styles.continueBtnText}>
              {selectedLocations.length === 0
                ? 'Select at least 1 area'
                : 'Continue'}
            </Text>
            {selectedLocations.length > 0 && (
              <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.2} />
            )}
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  titleGroup: {
    paddingVertical: 12,
    gap: 6,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.4,
  },
  subheading: {
    fontSize: 14,
    color: '#777482',
    lineHeight: 20,
    fontWeight: '500',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#171522',
    padding: 0,
  },
  selectedSection: {
    paddingVertical: 8,
    gap: 6,
  },
  selectedLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6C4DFF',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  selectedChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0ECFF',
    borderWidth: 1,
    borderColor: '#DED6FD',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
  },
  selectedChipText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  scrollContent: {
    paddingVertical: 8,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#777482',
  },
  locationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  locPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 6,
  },
  locPillSelected: {
    borderColor: '#6C4DFF',
    backgroundColor: '#FAF9FF',
  },
  locPillText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#171522',
  },
  locPillTextSelected: {
    color: '#6C4DFF',
    fontWeight: '700',
  },
  footer: {
    paddingVertical: 12,
  },
  continueBtn: {
    height: 54,
    borderRadius: 16,
    backgroundColor: '#6C4DFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#6C4DFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 4,
  },
  continueBtnDisabled: {
    backgroundColor: '#C9C5CC',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
