import React from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Search, X } from 'lucide-react-native';

interface OwnerPropertySearchBarProps {
  query: string;
  onChangeQuery: (text: string) => void;
  onClear: () => void;
}

export const OwnerPropertySearchBar: React.FC<OwnerPropertySearchBarProps> = ({
  query,
  onChangeQuery,
  onClear,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrap}>
        <Search size={18} color="#777482" strokeWidth={2} />
        <TextInput
          value={query}
          onChangeText={onChangeQuery}
          placeholder="Search your properties..."
          placeholderTextColor="#8C8994"
          style={styles.input}
          returnKeyType="search"
          clearButtonMode="never"
        />
        {query.length > 0 && (
          <Pressable
            onPress={onClear}
            hitSlop={8}
            style={styles.clearBtn}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <X size={14} color="#777482" strokeWidth={2.2} />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    paddingHorizontal: 14,
    height: 44,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#171522',
    padding: 0,
    fontWeight: '500',
  },
  clearBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F0EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
