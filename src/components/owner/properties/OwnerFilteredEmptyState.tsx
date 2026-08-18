import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Building2, Plus, SearchX } from 'lucide-react-native';
import { PropertyStatusTab } from './OwnerStatusFilterTabs';

interface OwnerFilteredEmptyStateProps {
  activeTab: PropertyStatusTab;
  hasQuery: boolean;
  onClearSearch?: () => void;
  onListProperty: () => void;
}

export const OwnerFilteredEmptyState: React.FC<
  OwnerFilteredEmptyStateProps
> = ({ activeTab, hasQuery, onClearSearch, onListProperty }) => {
  if (hasQuery) {
    return (
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <SearchX size={32} color="#777482" strokeWidth={1.8} />
        </View>
        <Text style={styles.title}>No matching properties</Text>
        <Text style={styles.subtitle}>
          No properties match your current search term. Try a different title or locality.
        </Text>
        {onClearSearch && (
          <Pressable style={styles.clearBtn} onPress={onClearSearch}>
            <Text style={styles.clearBtnText}>Clear Search</Text>
          </Pressable>
        )}
      </View>
    );
  }

  const getEmptyInfo = () => {
    switch (activeTab) {
      case 'RENTED':
        return {
          title: 'No rented properties',
          sub: 'Properties you mark as rented will appear here for your records.',
        };
      case 'DRAFT':
        return {
          title: 'No draft listings',
          sub: 'Incomplete property listings will be saved here so you can continue anytime.',
        };
      case 'PAUSED':
        return {
          title: 'No paused properties',
          sub: 'Properties you temporarily pause from search will appear here.',
        };
      case 'ACTIVE':
        return {
          title: 'No active properties',
          sub: 'Publish your listings to make them visible to verified renters across Mumbai.',
        };
      case 'ALL':
      default:
        return {
          title: 'No properties yet',
          sub: 'List your first flat, room or PG and start receiving tenant enquiries.',
        };
    }
  };

  const info = getEmptyInfo();

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Building2 size={34} color="#6C4DFF" strokeWidth={1.8} />
      </View>
      <Text style={styles.title}>{info.title}</Text>
      <Text style={styles.subtitle}>{info.sub}</Text>

      <Pressable
        style={styles.ctaBtn}
        onPress={onListProperty}
        accessibilityRole="button"
        accessibilityLabel="List a property"
      >
        <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
        <Text style={styles.ctaText}>List a property</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 24,
    marginHorizontal: 16,
    marginTop: 12,
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0ECFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#171522',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#777482',
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '500',
    maxWidth: 280,
  },
  clearBtn: {
    marginTop: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F3F0EA',
  },
  clearBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#171522',
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#6C4DFF',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 6,
  },
  ctaText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
