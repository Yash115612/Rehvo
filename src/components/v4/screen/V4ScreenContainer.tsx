import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets, Edge } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AlertCircle } from 'lucide-react-native';
import { V4_COLORS, V4_SPACING } from '../../../theme/v4Theme';
import { V4Skeleton } from '../ui/V4Skeleton';
import { V4EmptyState, V4EmptyStateProps } from '../ui/V4EmptyState';
import { V4Button } from '../ui/V4Button';

export interface V4ScreenContainerProps {
  children?: React.ReactNode;
  scrollable?: boolean;
  edges?: Edge[];
  backgroundColor?: string;
  statusBarStyle?: 'dark' | 'light' | 'auto';
  keyboardAvoiding?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  headerComponent?: React.ReactNode;
  footerComponent?: React.ReactNode;
  loading?: boolean;
  skeletonComponent?: React.ReactNode;
  empty?: boolean;
  emptyProps?: V4EmptyStateProps;
  emptyComponent?: React.ReactNode;
  error?: string | null;
  onRetry?: () => void;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

export const V4ScreenContainer: React.FC<V4ScreenContainerProps> = ({
  children,
  scrollable = true,
  edges = ['top', 'bottom'],
  backgroundColor = V4_COLORS.background,
  statusBarStyle = 'dark',
  keyboardAvoiding = false,
  refreshing = false,
  onRefresh,
  headerComponent,
  footerComponent,
  loading = false,
  skeletonComponent,
  empty = false,
  emptyProps,
  emptyComponent,
  error = null,
  onRetry,
  style,
  contentContainerStyle,
  testID,
}) => {
  const insets = useSafeAreaInsets();

  const applyTop = edges.includes('top') ? insets.top : 0;
  const applyBottom = edges.includes('bottom') ? insets.bottom : 0;
  const applyLeft = edges.includes('left') ? insets.left : 0;
  const applyRight = edges.includes('right') ? insets.right : 0;

  // 1. Error State
  const renderError = () => (
    <View style={styles.centerBox}>
      <V4EmptyState
        icon={<AlertCircle size={32} color={V4_COLORS.danger} strokeWidth={2.4} />}
        title="Something went wrong"
        description={error || 'We could not load the requested information. Please try again.'}
        actionLabel={onRetry ? 'Try Again' : undefined}
        onActionPress={onRetry}
        actionVariant="primary"
      />
    </View>
  );

  // 2. Loading State (Full skeleton shimmer)
  const renderLoading = () => (
    <View style={styles.loadingBox}>
      {skeletonComponent || <V4Skeleton.Feed count={3} />}
    </View>
  );

  // 3. Empty State
  const renderEmpty = () => (
    <View style={styles.centerBox}>
      {emptyComponent || (emptyProps && <V4EmptyState {...emptyProps} />)}
    </View>
  );

  // 4. Main Content Resolver
  const renderContent = () => {
    if (error) return renderError();
    if (loading) return renderLoading();
    if (empty) return renderEmpty();
    return children;
  };

  const body = scrollable ? (
    <ScrollView
      style={styles.flex1}
      contentContainerStyle={[
        styles.scrollContent,
        contentContainerStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={V4_COLORS.primary}
            colors={[V4_COLORS.primary]}
          />
        ) : undefined
      }
    >
      {renderContent()}
    </ScrollView>
  ) : (
    <View style={[styles.flex1, contentContainerStyle]}>{renderContent()}</View>
  );

  const containerContent = (
    <View
      testID={testID}
      style={[
        styles.root,
        {
          backgroundColor,
          paddingTop: applyTop,
          paddingBottom: applyBottom,
          paddingLeft: applyLeft,
          paddingRight: applyRight,
        },
        style,
      ]}
    >
      <StatusBar style={statusBarStyle} />

      {headerComponent && <View style={styles.headerSlot}>{headerComponent}</View>}

      {body}

      {footerComponent && <View style={styles.footerSlot}>{footerComponent}</View>}
    </View>
  );

  if (keyboardAvoiding) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex1}
      >
        {containerContent}
      </KeyboardAvoidingView>
    );
  }

  return containerContent;
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
  },
  flex1: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerSlot: {
    width: '100%',
    zIndex: 10,
  },
  footerSlot: {
    width: '100%',
    zIndex: 10,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: V4_SPACING.xl,
  },
  loadingBox: {
    flex: 1,
    paddingTop: V4_SPACING.md,
  },
});
