// ==============================================================================
// REHVO Dynamic App Configuration
// Manages conditional plugins and native capabilities dynamically based on
// build environment (Development vs Production/TestFlight/EAS).
// ==============================================================================

module.exports = ({ config }) => {
  const enableIosPush = process.env.EXPO_PUBLIC_ENABLE_IOS_PUSH === "true";

  // Filter out any static expo-notifications or withConditionalPush references
  const plugins = (config.plugins || []).filter((plugin) => {
    const pluginName = Array.isArray(plugin) ? plugin[0] : plugin;
    return pluginName !== "expo-notifications" && pluginName !== "./plugins/withConditionalPush";
  });

  // Only include expo-notifications plugin for production builds
  if (enableIosPush) {
    plugins.push("expo-notifications");
  }

  // Always apply conditional entitlements plugin to enforce correct aps-environment state
  plugins.push("./plugins/withConditionalPush");

  return {
    ...config,
    plugins,
    extra: {
      ...config.extra,
      enableIosPush,
    },
  };
};
