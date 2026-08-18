import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { SEARCH_COLORS } from './searchConstants';

interface SearchBarProps {
  query: string;
  onChange: (text: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onFilterPress: () => void;
  isFocused: boolean;
}

export function SearchBar({
  query,
  onChange,
  onFocus,
  onBlur,
  onFilterPress,
  isFocused,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.box, isFocused && styles.boxFocused]}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          value={query}
          onChangeText={onChange}
          placeholder="Search Mumbai, Andheri, Powai..."
          placeholderTextColor={SEARCH_COLORS.muted}
          style={styles.input}
          onFocus={onFocus}
          onBlur={onBlur}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <Pressable onPress={() => onChange('')} hitSlop={8}>
            <Text style={styles.clearBtn}>✕</Text>
          </Pressable>
        )}
        <Pressable style={styles.tuneBtn} onPress={onFilterPress}>
          <Text style={styles.tuneIcon}>⚙</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SEARCH_COLORS.white,
    borderWidth: 1,
    borderColor: SEARCH_COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 54,
    gap: 10,
  },
  boxFocused: {
    borderColor: SEARCH_COLORS.primary,
    borderWidth: 1.5,
  },
  searchIcon: {
    fontSize: 16,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: SEARCH_COLORS.darkText,
    fontWeight: '400',
  },
  clearBtn: {
    fontSize: 14,
    color: SEARCH_COLORS.muted,
    padding: 4,
  },
  tuneBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: SEARCH_COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tuneIcon: {
    fontSize: 16,
    color: SEARCH_COLORS.darkText,
  },
});
