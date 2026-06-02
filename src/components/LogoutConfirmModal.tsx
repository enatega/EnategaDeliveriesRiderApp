import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import Button from './Button';
import Text from './Text';
import { useTranslations } from '../localization/LocalizationProvider';
import { useAppTheme } from '../theme/ThemeProvider';

type Props = {
  visible: boolean;
  isLoading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function LogoutConfirmModal({
  visible,
  isLoading = false,
  onCancel,
  onConfirm,
}: Props) {
  const { theme } = useAppTheme();
  const { t } = useTranslations('app');

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <View style={[styles.backdrop, { backgroundColor: theme.colors.modalBackdrop }]}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.gray200,
            },
          ]}
        >
          <Text weight="semiBold" style={[styles.title, { color: theme.colors.gray900 }]}>
            {t('logout_confirm_title')}
          </Text>
          <Text style={[styles.message, { color: theme.colors.gray600 }]}>
            {t('logout_confirm_message')}
          </Text>
          <View style={styles.actions}>
            <Button
              label={t('logout_confirm_cancel')}
              onPress={onCancel}
              variant="secondary"
              disabled={isLoading}
              textColor={theme.colors.gray900}
              containerStyle={styles.actionButton}
            />
            <Button
              label={isLoading ? t('auth_logout_loading') : t('auth_logout')}
              onPress={onConfirm}
              disabled={isLoading}
              textColor={theme.colors.white}
              containerStyle={[styles.actionButton, { backgroundColor: theme.colors.red500 }]}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 20,
    gap: 12,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 26,
  },
  message: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  actionButton: {
    flex: 1,
    height: 48,
  },
});
