import React from 'react';
import {
  View,
  Pressable,
  TextInput,
  StyleSheet,
  Platform,
  TextInputProps,
} from 'react-native';
import { Search, SlidersHorizontal, X as CloseIcon, LucideIcon } from 'lucide-react-native';
import { SEARCH_COLORS } from './searchConstants';

export interface REHVOSearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onClear?: () => void;
  onPress?: () => void;
  onFilterPress?: () => void;
  showFilter?: boolean;
  filterActive?: boolean;
  editable?: boolean;
  autoFocus?: boolean;
  onFocus?: TextInputProps['onFocus'];
  onBlur?: TextInputProps['onBlur'];
  isFocused?: boolean;
  paddingHorizontal?: number;
  paddingVertical?: number;
  inputRef?: React.RefObject<TextInput | null>;
  returnKeyType?: TextInputProps['returnKeyType'];
  onSubmitEditing?: TextInputProps['onSubmitEditing'];
}

const SEARCH_HEIGHT = 56;
const FILTER_SIZE = 40;
const RADIUS = 28;

const SearchIcon: LucideIcon = Search;
const TuneIcon: LucideIcon = SlidersHorizontal;

export const REHVOSearchBar: React.FC<REHVOSearchBarProps> = ({
  placeholder = 'Where do you want to live?',
  value = '',
  onChangeText,
  onClear,
  onPress,
  onFilterPress,
  showFilter = true,
  filterActive = false,
  editable = true,
  autoFocus = false,
  onFocus,
  onBlur,
  isFocused = false,
  paddingHorizontal = 16,
  paddingVertical = 0,
  inputRef,
  returnKeyType = 'search',
  onSubmitEditing,
}) => {
  const isClickablePill = Boolean(onPress && !editable);

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChangeText) {
      onChangeText('');
    }
  };

  const renderContent = () => (
    <View style={[styles.shell, isFocused && styles.shellFocused]}>
      <View style={styles.searchIconWrap}>
        <SearchIcon size={21} strokeWidth={1.9} color={SEARCH_COLORS.darkText} />
      </View>

      <TextInput
        ref={inputRef as any}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={SEARCH_COLORS.muted}
        style={styles.input}
        editable={editable}
        autoFocus={autoFocus}
        onFocus={onFocus}
        onBlur={onBlur}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        pointerEvents={editable ? 'auto' : 'none'}
      />

      {Boolean(value && value.length > 0 && editable) && (
        <Pressable
          onPress={handleClear}
          hitSlop={8}
          style={styles.clearBtn}
          accessibilityRole="button"
          accessibilityLabel="Clear search text"
        >
          <CloseIcon size={16} color="#777482" strokeWidth={2.2} />
        </Pressable>
      )}

      {showFilter && (
        <Pressable
          onPress={onFilterPress}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel="Filter properties"
          style={({ pressed }) => [
            styles.filterBtnOuter,
            pressed && styles.filterBtnPressed,
          ]}
        >
          <View
            style={[
              styles.filterBtn,
              filterActive ? styles.filterBtnActive : styles.filterBtnInactive,
            ]}
          >
            <TuneIcon
              size={19}
              strokeWidth={2.0}
              color={filterActive ? '#FFFFFF' : SEARCH_COLORS.darkText}
            />
          </View>
        </Pressable>
      )}
    </View>
  );

  if (isClickablePill) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.container,
          { paddingHorizontal, paddingVertical },
          pressed && styles.containerPressed,
        ]}
        accessibilityRole="search"
        accessibilityLabel={placeholder}
      >
        {renderContent()}
      </Pressable>
    );
  }

  return (
    <View style={[styles.container, { paddingHorizontal, paddingVertical }]}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  containerPressed: {
    opacity: 0.94,
  },
  shell: {
    width: '100%',
    height: SEARCH_HEIGHT,
    borderRadius: RADIUS,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    ...Platform.select({
      ios: {
        shadowColor: '#171522',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
      default: {
        shadowColor: '#171522',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
    }),
  },
  shellFocused: {
    borderColor: SEARCH_COLORS.primary,
    borderWidth: 1.5,
  },
  searchIconWrap: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
    marginRight: 4,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: SEARCH_COLORS.darkText,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 6,
    marginRight: 2,
  },
  filterBtnOuter: {
    marginLeft: 6,
  },
  filterBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.95 }],
  },
  filterBtn: {
    width: FILTER_SIZE,
    height: FILTER_SIZE,
    borderRadius: FILTER_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
  },
  filterBtnActive: {
    backgroundColor: SEARCH_COLORS.primary,
    borderWidth: 1,
    borderColor: SEARCH_COLORS.primary,
    ...Platform.select({
      ios: {
        shadowColor: SEARCH_COLORS.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
});
