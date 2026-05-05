import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../components/Text';
import { useTranslations } from '../localization/LocalizationProvider';

export default function WalletScreen() {
  const { t } = useTranslations('app');
  return <View style={styles.container}><Text>{t('nav_wallet')}</Text></View>;
}
const styles = StyleSheet.create({ container: { flex: 1, alignItems: 'center', justifyContent: 'center' } });
