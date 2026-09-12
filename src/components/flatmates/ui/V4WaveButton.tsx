import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Hand, Check, Sparkles } from 'lucide-react-native';

interface V4WaveButtonProps {
  isWaved: boolean;
  isLoading?: boolean;
  isMatched?: boolean;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const V4WaveButton: React.FC<V4WaveButtonProps> = ({
  isWaved,
  isLoading = false,
  isMatched = false,
  onPress,
  size = 'medium',
  style,
  textStyle,
}) => {
  const getDimensions = () => {
    switch (size) {
      case 'small':
        return { height: 36, paddingHorizontal: 12, fontSize: 12, iconSize: 14 };
      case 'large':
        return { height: 50, paddingHorizontal: 20, fontSize: 14, iconSize: 18 };
      default:
        return { height: 44, paddingHorizontal: 16, fontSize: 13, iconSize: 16 };
    }
  };

  const dim = getDimensions();

  if (isMatched) {
    return (
      <Pressable
        style={[styles.matchedBtn, { height: dim.height, paddingHorizontal: dim.paddingHorizontal }, style]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Matched with flatmate"
      >
        <Sparkles size={dim.iconSize} color="#059669" strokeWidth={2.4} />
        <Text style={[styles.matchedText, { fontSize: dim.fontSize }, textStyle]}>Matched 🎉</Text>
      </Pressable>
    );
  }

  if (isWaved) {
    return (
      <Pressable
        style={[styles.wavedBtn, { height: dim.height, paddingHorizontal: dim.paddingHorizontal }, style]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Wave sent"
      >
        <Check size={dim.iconSize} color="#059669" strokeWidth={2.6} />
        <Text style={[styles.wavedText, { fontSize: dim.fontSize }, textStyle]}>Waved</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={[styles.idleBtn, { height: dim.height, paddingHorizontal: dim.paddingHorizontal }, style]}
      onPress={onPress}
      disabled={isLoading}
      accessibilityRole="button"
      accessibilityLabel="Send wave"
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#059669" />
      ) : (
        <>
          <Hand size={dim.iconSize} color="#059669" strokeWidth={2.4} />
          <Text style={[styles.idleText, { fontSize: dim.fontSize }, textStyle]}>Wave 👋</Text>
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  idleBtn: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  idleText: {
    fontWeight: '800',
    color: '#059669',
  },
  wavedBtn: {
    backgroundColor: '#CCFBF1',
    borderWidth: 1.5,
    borderColor: '#99F6E4',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  wavedText: {
    fontWeight: '800',
    color: '#0F766E',
  },
  matchedBtn: {
    backgroundColor: '#D1FAE5',
    borderWidth: 1.5,
    borderColor: '#6EE7B7',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  matchedText: {
    fontWeight: '900',
    color: '#065F46',
  },
});
