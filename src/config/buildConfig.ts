// ==============================================================================
// REHVO Build & Environment Configuration
// Dynamically detects development vs production environments and controls
// optional native capabilities such as iOS Push Notifications.
// ==============================================================================

export const IS_DEV_BUILD = __DEV__;

/**
 * iOS Push Notifications are disabled by default for local development builds
 * so they can be installed on personal iPhones using a free Personal Apple ID
 * without provisioning profile / aps-environment entitlement errors.
 *
 * For Production, TestFlight, or EAS builds, set EXPO_PUBLIC_ENABLE_IOS_PUSH='true'.
 */
export const ENABLE_IOS_PUSH =
  process.env.EXPO_PUBLIC_ENABLE_IOS_PUSH === 'true';
