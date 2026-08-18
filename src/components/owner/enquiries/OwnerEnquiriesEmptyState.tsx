import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MessageSquareOff, SearchX, ArrowRight } from 'lucide-react-native';
import { EnquiryFilterTab } from './OwnerEnquiriesFilterTabs';

interface OwnerEnquiriesEmptyStateProps {
  activeTab: EnquiryFilterTab;
  hasQuery: boolean;
  onClearSearch?: () => void;
  onViewProperties: () => void;
}

export const OwnerEnquiriesEmptyState: React.FC<
  OwnerEnquiriesEmptyStateProps
> = ({ activeTab, hasQuery, onClearSearch, onViewProperties }) => {
  if (hasQuery) {
    return (
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <SearchX size={30} color="#777482" strokeWidth={1.8} />
        </View>
        <Text style={styles.title}>No matching enquiries</Text>
        <Text style={styles.subtitle}>
          No enquiries match your current search query. Try searching with a different renter name or locality.
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
      case 'NEW':
        return {
          title: 'No new enquiries',
          sub: "You're all caught up! When renters send new questions, they'll appear here.",
        };
      case 'REPLIED':
        return {
          title: 'No replied enquiries',
          sub: "Enquiries you've responded to will be stored here.",
        };
      case 'VISIT_SCHEDULED':
        return {
          title: 'No visits scheduled',
          sub: 'Enquiries with confirmed physical property visits will appear here.',
        };
      case 'CLOSED':
        return {
          title: 'No closed enquiries',
          sub: 'Enquiries marked as resolved or closed will appear here.',
        };
      case 'ALL':
      default:
        return {
          title: 'No enquiries yet',
          sub: "When renters show interest in your properties, you'll see their questions and visit requests here.",
        };
    }
  };

  const info = getEmptyInfo();

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <MessageSquareOff size={32} color="#6C4DFF" strokeWidth={1.8} />
      </View>
      <Text style={styles.title}>{info.title}</Text>
      <Text style={styles.subtitle}>{info.sub}</Text>

      <Pressable
        style={styles.ctaBtn}
        onPress={onViewProperties}
        accessibilityRole="button"
        accessibilityLabel="View my properties"
      >
        <Text style={styles.ctaText}>View my properties</Text>
        <ArrowRight size={14} color="#FFFFFF" strokeWidth={2.2} />
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
