import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ArrowLeft, X } from 'lucide-react-native';

interface ListingHeaderProps {
  currentStep: number;
  totalSteps?: number;
  onBack: () => void;
  onClose: () => void;
  showSaveDraft?: boolean;
}

export const ListingHeader: React.FC<ListingHeaderProps> = ({
  currentStep,
  totalSteps = 10,
  onBack,
  onClose,
  showSaveDraft = true,
}) => {
  const progressPercent = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        {currentStep === 1 ? (
          <Pressable
            onPress={onClose}
            style={styles.navBtn}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Close listing"
          >
            <X size={20} color="#171522" strokeWidth={2.2} />
          </Pressable>
        ) : (
          <Pressable
            onPress={onBack}
            style={styles.navBtn}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={20} color="#171522" strokeWidth={2.2} />
          </Pressable>
        )}

        <View style={styles.stepBadge}>
          <Text style={styles.stepText}>
            Step {currentStep} of {totalSteps}
          </Text>
        </View>

        {showSaveDraft ? (
          <Pressable
            onPress={onClose}
            style={styles.saveDraftBtn}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Save draft and exit"
          >
            <Text style={styles.saveDraftText}>Draft</Text>
            <X size={16} color="#777482" strokeWidth={2} />
          </Pressable>
        ) : (
          <View style={{ width: 38 }} />
        )}
      </View>

      {/* Thin Progress Bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#F8F7F4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  navBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
  },
  stepText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#171522',
  },
  saveDraftBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
  },
  saveDraftText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#777482',
  },
  progressTrack: {
    height: 3,
    backgroundColor: '#E8E5EC',
    width: '100%',
  },
  progressBar: {
    height: 3,
    backgroundColor: '#6C4DFF',
  },
});
