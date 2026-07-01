const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = function withDebugVariant(config) {
  return withAppBuildGradle(config, config => {
    if (config.modResults.language === 'groovy') {
      const buildGradle = config.modResults.contents;
      
      const searchString = /buildTypes\s*{\s*debug\s*{/;
      const replacementString = `buildTypes {\n        debug {\n            applicationIdSuffix "debug"\n            resValue "string", "app_name", "${config.name} (Debug)"`;
      
      if (buildGradle.match(searchString)) {
        config.modResults.contents = buildGradle.replace(searchString, replacementString);
      }
    }
    return config;
  });
};
