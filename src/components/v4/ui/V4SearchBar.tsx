import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Search, X, SlidersHorizontal } from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { triggerHaptic } from '../../../utils/haptics';

export interface V4SearchBarProps {
  value?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  onSearchSubmit?: (text: string) => void;
  onFilterPress?: () => void;
  hasActiveFilters?: boolean;
  debounceMs?: number;
  containerStyle?: StyleProp<ViewStyle>;
  autoFocus?: boolean;
  testID?: string;
}

export const V4SearchBarComponent: React.FC<V4SearchBarProps> = ({
  value: controlledValue,
  placeholder = 'Search by locality, project or landmark...',
  onChangeText,
  onSearchSubmit,
  onFilterPress,
  hasActiveFilters = false,
  debounceMs = 300,
  containerStyle,
  autoFocus = false,
  testID,
}) => {
  const [internalValue, setInternalValue] = useState(controlledValue || '');
  const [isFocused, setIsFocused] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (controlledValue !== undefined && controlledValue !== internalValue) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue]);

  const handleChangeText = (text: string) => {
    setInternalValue(text);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (debounceMs > 0) {
      debounceTimer.current = setTimeout(() => {
        onChangeText?.(text);
      }, debounceMs);
    } else {
      onChangeText?.(text);
    }
  };

  const handleClear = () => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    setInternalValue('');
    onChangeText?.('');
    triggerHaptic('light');
  };

  const handleFilterClick = () => {
    triggerHaptic('selection');
    onFilterPress?.();
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <View
        style={[
          styles.container,
          isFocused && styles.containerFocused,
        ]}
      >
        <Search
          size={18}
          color={isFocused ? V4_COLORS.primary : V4_COLORS.textMuted}
          style={styles.searchIcon}
        />

        <TextInput
          testID={testID}
          value={internalValue}
          onChangeText={handleChangeText}
          onSubmitEditing={() => onSearchSubmit?.(internalValue)}
          placeholder={placeholder}
          placeholderTextColor={V4_COLORS.textMuted}
          style={styles.input}
          autoFocus={autoFocus}
          returnKeyType="search"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          accessibilityLabel={placeholder}
          accessibilityRole="search"
        />

        {/* Clear Button */}
        {internalValue.length > 0 && (
          <Pressable
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={handleClear}
            style={styles.iconBtn}
            accessibilityRole="button"
            accessibilityLabel="Clear search input"
          >
            <View style={styles.clearCircle}>
              <X size={13} color="#FFFFFF" strokeWidth={2.5} />
            </View>
          </Pressable>
        )}

        {/* Filter Toggle Button */}
        {onFilterPress && (
          <View style={styles.filterDividerWrap}>
            <View style={styles.verticalDivider} />
            <Pressable
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              onPress={handleFilterClick}
              style={[
                styles.filterBtn,
                hasActiveFilters && styles.filterBtnActive,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Open filters"
            >
              <SlidersHorizontal
                size={17}
                color={hasActiveFilters ? '#FFFFFF' : V4_COLORS.primary}
                strokeWidth={2.2}
              />
              {hasActiveFilters && <View style={styles.activeDot} />}
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
};

export const V4SearchBar = React.memo(V4SearchBarComponent);

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  container: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: V4_COLORS.surface,
    borderRadius: V4_RADIUS.search,
    borderWidth: 1.2,
    borderColor: V4_COLORS.border,
    paddingHorizontal: 14,
    ...V4_SHADOWS.soft,
  },
  containerFocused: {
    borderColor: V4_COLORS.primary,
    backgroundColor: '#FFFFFF',
    shadowColor: V4_COLORS.primary,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    fontWeight: '500',
    color: V4_COLORS.textPrimary,
  },
  iconBtn: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 32,
    minHeight: 32,
  },
  clearCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: V4_COLORS.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterDividerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
  },
  verticalDivider: {
    width: 1,
    height: 20,
    backgroundColor: V4_COLORS.border,
    marginRight: 6,
  },
  filterBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: V4_COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  filterBtnActive: {
    backgroundColor: V4_COLORS.primary,
  },
  activeDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: V4_COLORS.warning,
    borderWidth: 1.2,
    borderColor: '#FFFFFF',
  },
});
