import React, { useState } from 'react';
import { View, Text, Pressable, TextInput as RNTextInput, Modal, ScrollView, Image, StyleSheet } from 'react-native';
import { Property } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (q: string) => void;
  properties: Property[];
  onSelectLocality: (locality: string) => void;
  onSelectProperty: (property: Property) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  query,
  onQueryChange,
  properties,
  onSelectLocality,
  onSelectProperty,
}) => {
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Andheri West 2 BHK',
    'Powai Studio Flat',
    'Bandra Sea View',
    'No Brokerage PG',
  ]);

  const popularLocations = [
    { name: 'Andheri West', count: '45+ places', icon: '🏙️' },
    { name: 'Powai', count: '32+ places', icon: '🌊' },
    { name: 'Bandra West', count: '28+ places', icon: '🏖️' },
    { name: 'Ghatkopar West', count: '18+ places', icon: '🚆' },
    { name: 'Lower Parel', count: '22+ places', icon: '🏢' },
    { name: 'Thane West', count: '35+ places', icon: '🌳' },
    { name: 'Navi Mumbai', count: '40+ places', icon: '🚇' },
  ];

  const suggestedQueries = [
    '1 BHK under ₹20,000 in Powai',
    'Zero brokerage PG in Bandra',
    'Furnished flats near Metro',
    'Pet friendly apartments in Andheri',
  ];

  const matchingProperties = query.trim()
    ? properties.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.locality.toLowerCase().includes(query.toLowerCase()) ||
          p.address.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleExecuteSearch = (searchTerm: string) => {
    onQueryChange(searchTerm);
    if (searchTerm && !recentSearches.includes(searchTerm)) {
      setRecentSearches([searchTerm, ...recentSearches.slice(0, 4)]);
    }
    onClose();
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
  };

  return (
    <Modal
      visible={isOpen}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Search Header Bar */}
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </Pressable>

          {/* Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.searchIcon}>🔍</Text>
            <RNTextInput
              value={query}
              onChangeText={onQueryChange}
              onSubmitEditing={() => handleExecuteSearch(query)}
              placeholder="Search locality, landmark, or listing..."
              placeholderTextColor="#86828F"
              style={styles.input}
              autoFocus
            />
            {query.length > 0 && (
              <Pressable onPress={() => onQueryChange('')} style={styles.clearBtn}>
                <Text style={styles.clearText}>✕</Text>
              </Pressable>
            )}
          </View>

          {/* Action Button */}
          <Pressable onPress={() => handleExecuteSearch(query)} style={styles.searchBtn}>
            <Text style={styles.searchBtnText}>Search</Text>
          </Pressable>
        </View>

        {/* Main Content Area */}
        <ScrollView style={styles.content}>
          {/* Real-time Autocomplete Matching */}
          {query.trim().length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Matching Listings ({matchingProperties.length})
              </Text>

              {matchingProperties.length === 0 ? (
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyTitle}>No exact matches found for "{query}"</Text>
                  <Text style={styles.emptySub}>
                    Try searching broader terms like "Andheri", "Powai", or "1 BHK"
                  </Text>
                </View>
              ) : (
                matchingProperties.slice(0, 5).map((prop) => (
                  <React.Fragment key={prop.id}>
                    <Pressable
                      onPress={() => {
                        onSelectProperty(prop);
                        onClose();
                      }}
                      style={({ pressed }) => [styles.matchCard, pressed && styles.pressed]}
                    >
                      <Image source={{ uri: prop.images[0]?.url }} style={styles.matchThumb} />
                      <View style={styles.matchInfo}>
                        <Text style={styles.matchTitle} numberOfLines={1}>{prop.title}</Text>
                        <Text style={styles.matchSub}>
                          {prop.locality}, Mumbai • ₹{prop.rent.toLocaleString('en-IN')}/mo
                        </Text>
                      </View>
                      <Text style={styles.matchArrow}>↗</Text>
                    </Pressable>
                  </React.Fragment>
                ))
              )}
            </View>
          )}

          {/* Recent Searches Section */}
          {query.trim().length === 0 && recentSearches.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>🕒 Recent Searches</Text>
                <Pressable onPress={handleClearRecent}>
                  <Text style={styles.clearAllText}>Clear All</Text>
                </Pressable>
              </View>

              <View style={styles.chipRow}>
                {recentSearches.map((term) => (
                  <React.Fragment key={term}>
                    <Pressable
                      onPress={() => handleExecuteSearch(term)}
                      style={styles.recentChip}
                    >
                      <Text style={styles.recentChipText}>{term}</Text>
                      <Text style={styles.recentChipArrow}>→</Text>
                    </Pressable>
                  </React.Fragment>
                ))}
              </View>
            </View>
          )}

          {/* Suggested Smart Queries */}
          {query.trim().length === 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>✨ Suggested Searches</Text>
              <View style={styles.suggestedList}>
                {suggestedQueries.map((q) => (
                  <React.Fragment key={q}>
                    <Pressable
                      onPress={() => handleExecuteSearch(q)}
                      style={styles.suggestedCard}
                    >
                      <Text style={styles.suggestedText}>{q}</Text>
                      <Text style={styles.plusIcon}>+</Text>
                    </Pressable>
                  </React.Fragment>
                ))}
              </View>
            </View>
          )}

          {/* Popular Neighborhoods */}
          {query.trim().length === 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🧭 Popular Neighborhoods</Text>
              <View style={styles.grid2}>
                {popularLocations.map((loc) => (
                  <React.Fragment key={loc.name}>
                    <Pressable
                      onPress={() => {
                        onSelectLocality(loc.name);
                        onClose();
                      }}
                      style={styles.locationCard}
                    >
                      <Text style={styles.locationIcon}>{loc.icon}</Text>
                      <View style={styles.locationInfo}>
                        <Text style={styles.locationName} numberOfLines={1}>{loc.name}</Text>
                        <Text style={styles.locationCount}>{loc.count}</Text>
                      </View>
                    </Pressable>
                  </React.Fragment>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5F0',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E2DD',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F7F5F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 18,
    color: '#17151F',
    fontWeight: '700',
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#F7F5F0',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#17151F',
  },
  clearBtn: {
    padding: 4,
  },
  clearText: {
    fontSize: 12,
    color: '#86828F',
  },
  searchBtn: {
    backgroundColor: '#6C4DFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  searchBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    gap: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#86828F',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  clearAllText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FF6B4A',
  },
  emptyBox: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E4E2DD',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#17151F',
  },
  emptySub: {
    fontSize: 11,
    color: '#86828F',
    marginTop: 4,
    textAlign: 'center',
  },
  matchCard: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E4E2DD',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  pressed: {
    opacity: 0.8,
  },
  matchThumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
  matchInfo: {
    flex: 1,
  },
  matchTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#17151F',
  },
  matchSub: {
    fontSize: 10,
    color: '#86828F',
    marginTop: 2,
  },
  matchArrow: {
    fontSize: 16,
    color: '#6C4DFF',
    fontWeight: '900',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recentChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E4E2DD',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recentChipText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#17151F',
  },
  recentChipArrow: {
    fontSize: 12,
    color: '#86828F',
  },
  suggestedList: {
    gap: 8,
  },
  suggestedCard: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E4E2DD',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  suggestedText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#17151F',
  },
  plusIcon: {
    fontSize: 16,
    color: '#6C4DFF',
    fontWeight: '900',
  },
  grid2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  locationCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E4E2DD',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  locationIcon: {
    fontSize: 18,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#17151F',
  },
  locationCount: {
    fontSize: 10,
    color: '#86828F',
    fontWeight: '600',
  },
});

