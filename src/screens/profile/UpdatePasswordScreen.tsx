import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Text from '../../components/Text';
import Button from '../../components/Button';
import { useAppTheme } from '../../theme/ThemeProvider';
import { useTranslations } from '../../localization/LocalizationProvider';
import { MainStackParamList } from '../../navigation/types';

type Navigation = NativeStackNavigationProp<MainStackParamList>;

export default function UpdatePasswordScreen() {
  const { theme } = useAppTheme();
  const { t } = useTranslations('app');
  const navigation = useNavigation<Navigation>();
  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home', { screen: 'ProfileTab' });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={[styles.backButton, { backgroundColor: theme.colors.gray100 }]}>
          <BackIcon color={theme.colors.gray900} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text weight="bold" style={[styles.title, { color: theme.colors.gray900 }]}>
          {t('profile_update_password_title')}
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.gray500 }]}>
          {t('profile_update_password_subtitle')}
        </Text>

        <PasswordField placeholder={t('profile_old_password_placeholder')} />
        <PasswordField placeholder={t('profile_new_password_placeholder')} />
      </View>

      <View style={styles.footer}>
        <Button
          label={t('profile_update_password_button')}
          onPress={handleBack}
          textColor={theme.colors.gray900}
          containerStyle={styles.updateButton}
        />
      </View>
    </SafeAreaView>
  );
}

function PasswordField({ placeholder }: { placeholder: string }) {
  const { theme } = useAppTheme();
  return (
    <View
      style={[
        styles.input,
        {
          borderColor: theme.colors.gray300,
          backgroundColor: theme.colors.white,
          shadowColor: theme.colors.black,
        },
      ]}
    >
      <Text style={{ color: theme.colors.gray500 }}>{placeholder}</Text>
      <EyeIcon color={theme.colors.gray900} />
    </View>
  );
}

function BackIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M15 18L9 12L15 6" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function EyeIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path d="M1.67 10s3-5 8.33-5 8.33 5 8.33 5-3 5-8.33 5-8.33-5-8.33-5z" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={10} cy={10} r={2.5} stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 64,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 16,
    gap: 16,
  },
  title: {
    fontSize: 24,
    lineHeight: 38,
    marginTop: 2,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 0,
  },
  input: {
    height: 42,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  footer: {
    marginTop: 'auto',
    paddingHorizontal: 16,
    paddingBottom: 34,
    paddingTop: 12,
  },
  updateButton: {
    height: 54,
    borderRadius: 40,
  },
});
