const { withEntitlementsPlist, createRunOncePlugin } = require("expo/config-plugins");

/**
 * REHVO Conditional Push Notification Plugin
 * Strips aps-environment from iOS entitlements for local development builds
 * so apps can be signed with personal Apple IDs without error 65.
 * Restores aps-environment for production/TestFlight/EAS builds.
 */
const withConditionalPush = (config) => {
  const enableIosPush = process.env.EXPO_PUBLIC_ENABLE_IOS_PUSH === "true";

  return withEntitlementsPlist(config, (mod) => {
    if (!enableIosPush) {
      if (mod.modResults && mod.modResults["aps-environment"]) {
        delete mod.modResults["aps-environment"];
      }
    } else {
      if (!mod.modResults) mod.modResults = {};
      mod.modResults["aps-environment"] = "development";
    }
    return mod;
  });
};

module.exports = createRunOncePlugin(withConditionalPush, "withConditionalPush", "1.0.0");
