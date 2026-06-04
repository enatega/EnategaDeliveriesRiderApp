const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY ?? 'DUMMY_GOOGLE_MAPS_API_KEY';

module.exports = {
  expo: {
    name: 'EatMile Rider',
    slug: 'eatmile-rider',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.eatmile.rider',
      googleServicesFile: './GoogleService-Info.plist',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.eatmile.rider',
      googleServicesFile: './google-services.json',
      edgeToEdgeEnabled: true,
      softwareKeyboardLayoutMode: 'resize',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    updates: {
      url: 'https://u.expo.dev/b1e7561a-b1d4-4650-a7fe-47fdb86351d3',
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
    plugins: [
      'expo-notifications',
      'expo-secure-store',
      [
        'expo-image-picker',
        {
          photosPermission: 'Allow $(PRODUCT_NAME) to access your photos to upload documents.',
          cameraPermission: 'Allow $(PRODUCT_NAME) to use your camera to capture documents.',
          microphonePermission: false,
        },
      ],
      [
        'react-native-maps',
        {
          androidGoogleMapsApiKey: googleMapsApiKey,
          iosGoogleMapsApiKey: googleMapsApiKey,
        },
      ],
    ],
    extra: {
      eas: {
        projectId: 'b1e7561a-b1d4-4650-a7fe-47fdb86351d3',
      },
    },
  },
};
