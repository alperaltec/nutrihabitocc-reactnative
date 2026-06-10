const { withProjectBuildGradle } = require('@expo/config-plugins');

module.exports = function withNotifeeRepository(config) {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      const repoBlock = 'maven { url "$rootDir/../node_modules/@notifee/react-native/android/libs" }';

      if (!config.modResults.contents.includes(repoBlock)) {
        config.modResults.contents = config.modResults.contents.replace(
          /allprojects\s*\{\s*repositories\s*\{/,
          `allprojects {
    repositories {
        ${repoBlock}`
        );
      }
    }
    return config;
  });
};