const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY ?? 'DUMMY_GOOGLE_MAPS_API_KEY';

module.exports = {
  expo: {
    name: 'Shaaneiol Driver',
    slug: 'shaaneiol-rider',
    version: '1.0.5',
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
      bundleIdentifier: 'com.shaaneiol.rider',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.shaaneiol.rider',
      edgeToEdgeEnabled: true,
      softwareKeyboardLayoutMode: 'resize',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    updates: {
      url: 'https://u.expo.dev/dd251847-b122-424b-b7dd-60bd8ddbbe90',
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
    plugins: [
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
        projectId: "240e4a10-4d4b-43cc-96c7-989e35396a4b"
      },
    },
  },
};
