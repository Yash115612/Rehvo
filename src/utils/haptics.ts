import { Platform, Vibration } from 'react-native';

export type HapticType = 'light' | 'medium' | 'heavy' | 'selection';

/**
 * Safe, cross-platform haptic feedback utility.
 * Triggers light tactile vibration on native devices without external native dependencies.
 */
export const triggerTabHaptic = () => {
  triggerHaptic('light');
};

export const triggerHaptic = (type: HapticType = 'light') => {
  try {
    if (Platform.OS !== 'web') {
      switch (type) {
        case 'light':
        case 'selection':
          Vibration.vibrate(10);
          break;
        case 'medium':
          Vibration.vibrate(20);
          break;
        case 'heavy':
          Vibration.vibrate(35);
          break;
        default:
          Vibration.vibrate(10);
      }
    }
  } catch {
    // Graceful no-op
  }
};

export const triggerHapticFeedback = (type: any = 'light') => {
  const mappedType: HapticType =
    type === 'impactHeavy' || type === 'heavy' || type === 'notificationError'
      ? 'heavy'
      : type === 'impactMedium' || type === 'medium'
      ? 'medium'
      : 'light';
  triggerHaptic(mappedType);
};

