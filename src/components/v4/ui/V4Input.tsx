import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  TextInputProps,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { Eye, EyeOff, XCircle } from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SPACING } from '../../../theme/v4Theme';

export interface V4InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  helperText?: string;
  errorText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  allowClear?: boolean;
  isPassword?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  onClear?: () => void;
  required?: boolean;
}

export const V4InputComponent: React.FC<V4InputProps> = ({
  label,
  helperText,
  errorText,
  leftIcon,
  rightIcon,
  allowClear = false,
  isPassword = false,
  containerStyle,
  inputStyle,
  value,
  onChangeText,
  onClear,
  required = false,
  placeholder,
  editable = true,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hasError = Boolean(errorText);
  const hasValue = Boolean(value && value.length > 0);

  const handleClear = () => {
    onChangeText?.('');
    onClear?.();
  };

  return (
    <View style={[styles.root, containerStyle]}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.requiredStar}> *</Text>}
          </Text>
        </View>
      )}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          hasError && styles.inputError,
          !editable && styles.inputDisabled,
        ]}
      >
        {leftIcon && <View style={styles.leftIconBox}>{leftIcon}</View>}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={V4_COLORS.textMuted}
          editable={editable}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[styles.input, inputStyle]}
          accessibilityLabel={label || placeholder || 'Input field'}
          {...rest}
        />

        {/* Clear Button */}
        {allowClear && hasValue && editable && (
          <Pressable
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={handleClear}
            style={styles.actionBtn}
            accessibilityRole="button"
            accessibilityLabel="Clear input"
          >
            <XCircle size={17} color={V4_COLORS.textMuted} />
          </Pressable>
        )}

        {/* Password Eye Toggle */}
        {isPassword && (
          <Pressable
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={() => setShowPassword((prev) => !prev)}
            style={styles.actionBtn}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff size={18} color={V4_COLORS.textSecondary} />
            ) : (
              <Eye size={18} color={V4_COLORS.textSecondary} />
            )}
          </Pressable>
        )}

        {/* Custom Trailing Icon */}
        {!isPassword && rightIcon && <View style={styles.rightIconBox}>{rightIcon}</View>}
      </View>

      {/* Error or Helper text */}
      {hasError ? (
        <Text style={styles.errorText}>{errorText}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

export const V4Input = React.memo(V4InputComponent);

const styles = StyleSheet.create({
  root: {
    width: '100%',
    marginBottom: V4_SPACING.md,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  requiredStar: {
    color: V4_COLORS.danger,
    fontWeight: '700',
  },
  inputContainer: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: V4_COLORS.surface,
    borderWidth: 1.4,
    borderColor: V4_COLORS.border,
    borderRadius: V4_RADIUS.md,
    paddingHorizontal: 14,
  },
  inputFocused: {
    borderColor: V4_COLORS.primary,
    backgroundColor: '#FFFFFF',
    shadowColor: V4_COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  inputError: {
    borderColor: V4_COLORS.danger,
  },
  inputDisabled: {
    backgroundColor: V4_COLORS.surfaceSubtle,
    borderColor: V4_COLORS.borderLight,
    opacity: 0.65,
  },
  leftIconBox: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightIconBox: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtn: {
    padding: 4,
    marginLeft: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '500',
    color: V4_COLORS.textPrimary,
    paddingVertical: 10,
    minHeight: 44,
  },
  helperText: {
    fontSize: 11.5,
    fontWeight: '500',
    color: V4_COLORS.textSecondary,
    marginTop: 4,
    marginLeft: 4,
  },
  errorText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: V4_COLORS.danger,
    marginTop: 4,
    marginLeft: 4,
  },
});
