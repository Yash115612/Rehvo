import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Image,
  ImageProps,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ImageStyle,
  Animated,
  Platform,
} from 'react-native';
import { ImageOff } from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS } from '../../../theme/v4Theme';
import { V4Skeleton } from './V4Skeleton';

// Fast In-Memory Image Cache
const resolvedUriCache = new Set<string>();
const failedUriCache = new Set<string>();

export interface V4ImageProps extends Omit<ImageProps, 'style'> {
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  fallbackIconSize?: number;
  borderRadius?: number;
  thumbnailUri?: string;
  enableFade?: boolean;
}

export const V4ImageComponent: React.FC<V4ImageProps> = ({
  source,
  style,
  containerStyle,
  fallbackIconSize = 24,
  borderRadius = V4_RADIUS.md,
  thumbnailUri,
  enableFade = true,
  ...rest
}) => {
  const uri =
    typeof source === 'object' && source !== null && 'uri' in source && typeof source.uri === 'string'
      ? source.uri
      : null;

  const isPrecached = uri ? resolvedUriCache.has(uri) : false;
  const isPreFailed = uri ? failedUriCache.has(uri) : false;

  const [isLoading, setIsLoading] = useState(!isPrecached);
  const [hasError, setHasError] = useState(isPreFailed);
  const fadeAnim = useRef(new Animated.Value(isPrecached ? 1 : 0)).current;

  useEffect(() => {
    if (!uri) return;

    if (resolvedUriCache.has(uri)) {
      if (isLoading) setIsLoading(false);
      if (hasError) setHasError(false);
      fadeAnim.setValue(1);
    } else if (failedUriCache.has(uri)) {
      if (isLoading) setIsLoading(false);
      if (!hasError) setHasError(true);
    } else {
      setIsLoading(true);
      setHasError(false);
      fadeAnim.setValue(0);
    }
  }, [uri]);

  const handleLoadSuccess = () => {
    if (uri) resolvedUriCache.add(uri);
    setIsLoading(false);
    if (enableFade && !isPrecached) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 160,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    } else {
      fadeAnim.setValue(1);
    }
  };

  const handleLoadError = () => {
    if (uri) failedUriCache.add(uri);
    setIsLoading(false);
    setHasError(true);
  };

  const isUriEmpty = !source || (uri !== null && uri.trim() === '');

  if (isUriEmpty || hasError) {
    return (
      <View
        style={[
          styles.fallbackContainer,
          { borderRadius },
          containerStyle,
          style as any,
        ]}
      >
        <ImageOff size={fallbackIconSize} color={V4_COLORS.textMuted} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { borderRadius }, containerStyle]}>
      {/* Optional progressive thumbnail */}
      {thumbnailUri && isLoading && (
        <Image
          source={{ uri: thumbnailUri }}
          style={[styles.image, { borderRadius }, style]}
          resizeMode="cover"
          blurRadius={2}
        />
      )}

      <Animated.Image
        source={source}
        style={[
          styles.image,
          { borderRadius, opacity: fadeAnim },
          style,
        ]}
        onLoad={handleLoadSuccess}
        onError={handleLoadError}
        {...(rest as any)}
      />

      {isLoading && !thumbnailUri && (
        <View style={[StyleSheet.absoluteFill, { borderRadius, overflow: 'hidden' }]}>
          <V4Skeleton shape="rect" width="100%" height="100%" borderRadius={borderRadius} />
        </View>
      )}
    </View>
  );
};

export const V4Image = Object.assign(React.memo(V4ImageComponent), {
  prefetch: (uris: (string | undefined | null)[]) => {
    uris.forEach((u) => {
      if (u && typeof u === 'string' && u.startsWith('http') && !resolvedUriCache.has(u)) {
        Image.prefetch(u)
          .then(() => resolvedUriCache.add(u))
          .catch(() => failedUriCache.add(u));
      }
    });
  },
  isCached: (uri: string) => resolvedUriCache.has(uri),
});

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: V4_COLORS.surfaceSubtle,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallbackContainer: {
    backgroundColor: V4_COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: V4_COLORS.borderLight,
  },
});
