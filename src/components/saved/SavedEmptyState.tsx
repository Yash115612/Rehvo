import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Bookmark, Sparkles, RefreshCw, ArrowRight } from 'lucide-react-native';

interface SavedEmptyStateProps {
  isFiltered?: boolean;
  filterLabel?: string;
  isError?: boolean;
  onExplore: () => void;
  onRetry?: () => void;
}

export const SavedEmptyState: React.FC<SavedEmptyStateProps> = ({
  isFiltered = false,
  filterLabel = 'places',
  isError = false,
  onExplore,
  onRetry,
}) => {
  if (isError) {
    return (
      <View style={styles.container}>
        <View style={[styles.iconCircle, { backgroundColor: '#FFF5F5' }]}>
          <RefreshCw size={28} color="#E5484D" strokeWidth={1.9} />
        </View>
        <Text style={styles.title}>Couldn't load your saved places</Text>
        <Text style={styles.subtitle}>
          Please check your internet connection and try again.
        </Text>
        {onRetry && (
          <Pressable
            style={styles.primaryBtn}
            onPress={onRetry}
            accessibilityRole="button"
            accessibilityLabel="Try again"
          >
            <Text style={styles.primaryBtnText}>Try again</Text>
          </Pressable>
        )}
      </View>
    );
  }

  if (isFiltered) {
    return (
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <Sparkles size={28} color="#6C4DFF" strokeWidth={1.8} />
        </View>
        <Text style={styles.title}>No saved {filterLabel} yet</Text>
        <Text style={styles.subtitle}>
          Try saving a few {filterLabel.toLowerCase()} and they'll appear right here for easy comparison.
        </Text>
        <Pressable
          style={styles.primaryBtn}
          onPress={onExplore}
          accessibilityRole="button"
          accessibilityLabel={`Explore ${filterLabel}`}
        >
          <Text style={styles.primaryBtnText}>Explore {filterLabel}</Text>
          <ArrowRight size={16} color="#FFFFFF" strokeWidth={2.2} />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Bookmark size={28} color="#6C4DFF" strokeWidth={1.8} />
      </View>
      <Text style={styles.title}>Nothing saved yet</Text>
      <Text style={styles.subtitle}>
        Save places you like while exploring and we'll keep them here for you to compare and schedule visits.
      </Text>
      <Pressable
        style={styles.primaryBtn}
        onPress={onExplore}
        accessibilityRole="button"
        accessibilityLabel="Explore places"
      >
        <Text style={styles.primaryBtnText}>Explore places</Text>
        <ArrowRight size={16} color="#FFFFFF" strokeWidth={2.2} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 56,
    paddingHorizontal: 24,
    gap: 12,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0ECFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#171522',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 14,
    color: '#777482',
    textAlign: 'center',
    lineHeight: 21,
    maxWidth: 300,
  },
  primaryBtn: {
    height: 48,
    paddingHorizontal: 24,
    borderRadius: 14,
    backgroundColor: '#6C4DFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  primaryBtnText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
