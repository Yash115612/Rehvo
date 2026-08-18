import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

interface PropertyAboutSectionProps {
  description: string;
}

export const PropertyAboutSection: React.FC<PropertyAboutSectionProps> = ({
  description,
}) => {
  const [expanded, setExpanded] = useState(false);

  const fallbackDesc =
    'This beautiful, well-maintained home is situated in a highly desirable neighborhood in Mumbai. It offers excellent natural light, cross-ventilation, modern interior finishes, and round-the-clock water and power backup. Close to local transport, grocery markets, reputable schools, and business hubs.';

  const descText = description?.trim() || fallbackDesc;
  const isLong = descText.length > 180;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>About this place</Text>
      <Text
        style={styles.bodyText}
        numberOfLines={expanded ? undefined : 4}
      >
        {descText}
      </Text>

      {isLong && (
        <Pressable
          onPress={() => setExpanded(!expanded)}
          hitSlop={8}
          style={styles.toggleBtn}
        >
          <Text style={styles.toggleText}>
            {expanded ? 'Show less' : 'Read more'}
          </Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 8,
  },
  heading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.3,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4B4855',
    fontWeight: '500',
  },
  toggleBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  toggleText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#6C4DFF',
  },
});
