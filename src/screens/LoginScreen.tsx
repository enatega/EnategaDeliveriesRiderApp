import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from '../components';
import { useTranslations } from '../localization/LocalizationProvider';
import { useAppTheme } from '../theme/ThemeProvider';
import { useLoginMutation } from '../hooks/useAuthMutations';

export default function LoginScreen() {
  const { t } = useTranslations('app');
  const { theme } = useAppTheme();
  const loginMutation = useLoginMutation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validate = (): boolean => {
    let valid = true;

    if (!email.trim()) {
      setEmailError(t('auth_email_required'));
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError(t('auth_email_invalid'));
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError(t('auth_password_required'));
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  };

  const handleLogin = () => {
    if (!validate()) return;
    loginMutation.mutate({
      email: email.trim(),
      password,
      device_push_token: 'fcm-token-optional',
    });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: '#F5F5F5' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Image
            source={require('../assets/images/envelope.png')}
            style={styles.icon}
            resizeMode="contain"
          />
          <Text
            variant="subtitle"
            weight="bold"
            color={theme.colors.gray900}
            style={styles.title}
          >
            {t('auth_title')}
          </Text>
          <Text variant="caption" color={theme.colors.gray500} style={styles.subtitle}>
            {t('auth_subtitle')}
          </Text>

          <View style={styles.form}>
            <TextInput
              placeholder={t('auth_email_placeholder')}
              value={email}
              onChangeText={(v) => {
                setEmail(v);
                if (emailError) setEmailError('');
              }}
              error={emailError}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
            <TextInput
              placeholder={t('auth_password_placeholder')}
              value={password}
              onChangeText={(v) => {
                setPassword(v);
                if (passwordError) setPasswordError('');
              }}
              error={passwordError}
              isPassword
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
            {loginMutation.error?.message ? (
              <Text variant="caption" color="#EF4444">
                {loginMutation.error.message}
              </Text>
            ) : null}
          </View>
        </View>

        <Button
          label={loginMutation.isPending ? t('auth_login_loading') : t('auth_login')}
          onPress={handleLogin}
          disabled={loginMutation.isPending}
          containerStyle={styles.button}
          textColor={theme.colors.gray900}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
    paddingTop: 120,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  card: {
    flex: 1,
  },
  icon: {
    width: 32,
    height: 32,
    marginBottom: 18,
  },
  title: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20,
  },
  form: {
    gap: 14,
  },
  button: {
    height: 54,
    borderRadius: 40,
  },
});
