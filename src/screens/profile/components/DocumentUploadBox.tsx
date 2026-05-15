import React from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useAppTheme } from '../../../theme/ThemeProvider';

type Props = {
  imageUri: string | null;
  onPress: () => void;
};

export default function DocumentUploadBox({ imageUri, onPress }: Props) {
  const { theme } = useAppTheme();

  return (
    <Pressable
      style={[styles.uploadBox, { borderColor: theme.colors.gray300 }]}
      onPress={onPress}
    >
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.uploadPreview} resizeMode="cover" />
      ) : (
        <UploadIcon color={theme.colors.gray400} />
      )}
    </Pressable>
  );
}

function UploadIcon({ color }: { color: string }) {
  return (
    <Svg width={42} height={30} viewBox="0 0 42 30" fill="none">
      <Path
        d="M28.875 24.75H32.375C36.5171 24.75 39.875 21.3921 39.875 17.25C39.875 13.1079 36.5171 9.75 32.375 9.75C31.8456 9.75 31.329 9.805 30.8302 9.9097C29.2605 4.9702 24.6413 1.375 19.125 1.375C12.6387 1.375 7.375 6.63866 7.375 13.125C7.375 13.4536 7.38849 13.779 7.41491 14.1007C4.44507 14.9029 2.25 17.6158 2.25 20.75C2.25 24.5159 5.29206 27.558 9.05795 27.558H14.375"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M21 12V28M21 12L15 18M21 12L27 18" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  uploadBox: {
    height: 108,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    overflow: 'hidden',
  },
  uploadPreview: {
    width: '100%',
    height: '100%',
  },
});
