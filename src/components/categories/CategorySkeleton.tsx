import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export const CategorySkeleton: React.FC = () => {
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.8,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacityAnim]);

  return (
    <View style={styles.container}>
      {[1, 2, 3].map((key) => (
        <Animated.View key={key} style={[styles.card, { opacity: opacityAnim }]}>
          <View style={styles.imagePlaceholder} />
          <View style={styles.contentPlaceholder}>
            <View style={styles.lineTitle} />
            <View style={styles.lineSub} />
            <View style={styles.chipsRow}>
              <View style={styles.chipPlaceholder} />
              <View style={styles.chipPlaceholder} />
              <View style={styles.chipPlaceholder} />
            </View>
          </View>
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    overflow: 'hidden',
  },
  imagePlaceholder: {
    width: '100%',
    height: 175,
    backgroundColor: '#E8E5EC',
  },
  contentPlaceholder: {
    padding: 14,
    gap: 10,
  },
  lineTitle: {
    width: '75%',
    height: 18,
    borderRadius: 6,
    backgroundColor: '#E8E5EC',
  },
  lineSub: {
    width: '45%',
    height: 14,
    borderRadius: 5,
    backgroundColor: '#E8E5EC',
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  chipPlaceholder: {
    width: 80,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#E8E5EC',
  },
});
