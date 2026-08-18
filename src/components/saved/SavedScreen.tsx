import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Property } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { SavedCard } from './SavedCard';
import { SavedEmptyState } from './SavedEmptyState';

interface SavedScreenProps {
  onSelectProperty: (property: Property) => void;
}

export const SavedScreen: React.FC<SavedScreenProps> = ({ onSelectProperty }) => {
  const { properties, savedPropertyIds, toggleSaveProperty } = useAppStore();

  const savedListings = useMemo(() => {
    return savedPropertyIds
      .map((id) => properties.find((p) => p.id === id))
      .filter((p): p is Property => Boolean(p));
  }, [savedPropertyIds, properties]);

  const handleRemove = (id: string) => {
    toggleSaveProperty(id);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={savedListings}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => (
          <SavedCard
            property={item}
            onPress={onSelectProperty}
            onRemove={handleRemove}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <SavedEmptyState onExplore={() => {}} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7F4',
  },
  list: {
    padding: 16,
  },
});
