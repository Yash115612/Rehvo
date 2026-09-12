import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import {
  MapPin,
  Building2,
  Train,
  GraduationCap,
  Briefcase,
  Compass,
  ArrowUpRight,
} from 'lucide-react-native';
import { SearchSuggestionItem, SearchSuggestionCategory } from '../../../types';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';

export interface V4SearchSuggestionsProps {
  suggestions: SearchSuggestionItem[];
  onSelectSuggestion: (item: SearchSuggestionItem) => void;
}

const renderCategoryIcon = (category: SearchSuggestionCategory) => {
  const size = 15;
  switch (category) {
    case 'locality':
      return <MapPin size={size} color="#0F766E" strokeWidth={2.4} />;
    case 'society':
      return <Building2 size={size} color="#8B5CF6" strokeWidth={2.4} />;
    case 'metro':
      return <Train size={size} color="#0284C7" strokeWidth={2.4} />;
    case 'college':
      return <GraduationCap size={size} color="#EA580C" strokeWidth={2.4} />;
    case 'tech_park':
      return <Briefcase size={size} color="#0D9488" strokeWidth={2.4} />;
    case 'landmark':
    default:
      return <Compass size={size} color="#D97706" strokeWidth={2.4} />;
  }
};

const getCategoryBadgeLabel = (category: SearchSuggestionCategory) => {
  switch (category) {
    case 'locality':
      return 'LOCALITY';
    case 'society':
      return 'SOCIETY';
    case 'metro':
      return 'METRO';
    case 'college':
      return 'CAMPUS';
    case 'tech_park':
      return 'TECH PARK';
    case 'landmark':
      return 'LANDMARK';
  }
};

export const V4SearchSuggestions: React.FC<V4SearchSuggestionsProps> = ({
  suggestions,
  onSelectSuggestion,
}) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>SEARCH SUGGESTIONS</Text>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {suggestions.map((item) => (
          <Pressable
            key={item.id}
            style={({ pressed }) => [
              styles.itemRow,
              pressed && styles.itemRowPressed,
            ]}
            onPress={() => onSelectSuggestion(item)}
          >
            <View style={styles.iconCircle}>
              {renderCategoryIcon(item.category)}
            </View>

            <View style={styles.textContainer}>
              <View style={styles.titleRow}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>
                    {getCategoryBadgeLabel(item.category)}
                  </Text>
                </View>
              </View>
              <Text style={styles.itemSubtitle} numberOfLines={1}>
                {item.subtitle}
              </Text>
            </View>

            <ArrowUpRight size={14} color="#94A3B8" strokeWidth={2.2} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginTop: 6,
    ...V4_SHADOWS.card,
  },
  headerTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: V4_COLORS.textMuted,
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  listContent: {
    paddingBottom: 6,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  itemRowPressed: {
    backgroundColor: '#F1F5F9',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  itemTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  categoryBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
  },
  itemSubtitle: {
    fontSize: 11.5,
    color: V4_COLORS.textSecondary,
    marginTop: 1,
  },
});
