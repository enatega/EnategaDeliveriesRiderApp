const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY ?? 'DUMMY_GOOGLE_MAPS_API_KEY';

module.exports = {
  expo: {
    name: 'Cylia Rider',
    slug: 'cylia-rider',
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
      bundleIdentifier: 'com.cyliaplatform.rider',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.cyliaplatform.rider',
      googleServicesFile: './google-services.json',
      edgeToEdgeEnabled: true,
      softwareKeyboardLayoutMode: 'resize',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    updates: {
      url: 'https://u.expo.dev/55e36cb0-125a-4fa5-ab30-bd821d08c104',
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
        projectId: '55e36cb0-125a-4fa5-ab30-bd821d08c104',
      },
    },
  },
};
