const { withAndroidManifest } = require('@expo/config-plugins');

const withDisableTablets = (config) => {
  return withAndroidManifest(config, async config => {
    const androidManifest = config.modResults;
    const manifest = androidManifest.manifest;
    
    // Injects the <supports-screens> tag into AndroidManifest.xml
    manifest['supports-screens'] = [{
      $: {
        'android:smallScreens': 'true',
        'android:normalScreens': 'true',
        'android:largeScreens': 'false',
        'android:xlargeScreens': 'false',
      }
    }];
    
    return config;
  });
};

module.exports = withDisableTablets;