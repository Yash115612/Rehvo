import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { AlertTriangle, RefreshCw, MessageSquare } from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class V4ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('V4ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    const win = (globalThis as any).window;
    if (win && win.location) {
      win.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.iconBox}>
              <AlertTriangle size={36} color={V4_COLORS.danger} />
            </View>

            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.subtitle}>
              REHVO encountered an unexpected render issue. Your personal data and saved homes remain completely safe.
            </Text>

            {process.env.NODE_ENV !== 'production' && this.state.error?.message ? (
              <View style={styles.devErrorBox}>
                <Text style={styles.devErrorText}>
                  {this.state.error.name}: {this.state.error.message}
                </Text>
              </View>
            ) : null}

            <View style={styles.actionRow}>
              <Pressable
                style={styles.retryBtn}
                onPress={this.handleReset}
                accessibilityRole="button"
              >
                <RefreshCw size={16} color={V4_COLORS.textWhite} />
                <Text style={styles.retryBtnText}>Retry & Reload</Text>
              </Pressable>
            </View>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: V4_COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    backgroundColor: V4_COLORS.surface,
    borderRadius: V4_RADIUS.xl,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    ...V4_SHADOWS.md,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: V4_COLORS.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: V4_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  actionRow: {
    width: '100%',
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    backgroundColor: V4_COLORS.primary,
    borderRadius: V4_RADIUS.md,
    gap: 8,
  },
  retryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: V4_COLORS.textWhite,
  },
  devErrorBox: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    width: '100%',
  },
  devErrorText: {
    color: '#991B1B',
    fontSize: 12,
    fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
  },
});


export default V4ErrorBoundary;
