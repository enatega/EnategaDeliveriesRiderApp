import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Button from '../components/Button';
import Sidebar from '../components/Sidebar';
import Text from '../components/Text';
import { useSidebar } from '../hooks/useSidebar';
import { useTranslations } from '../localization/LocalizationProvider';
import { MainStackParamList } from '../navigation/types';
import { useAppTheme } from '../theme/ThemeProvider';

export default function BankManagementScreen() {
  const { theme } = useAppTheme();
  const { t } = useTranslations('app');
  const sidebar = useSidebar();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'bottom']}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Pressable onPress={sidebar.openSidebar} style={styles.menuButton}>
          <HamburgerIcon color={theme.colors.gray900} />
        </Pressable>
        <Text
          weight="semiBold"
          style={{ color: theme.colors.gray900, fontSize: theme.typography.size.md, lineHeight: theme.typography.lineHeight.md }}
        >
          {t('menu_bank_management')}
        </Text>
        <View style={styles.menuButton} />
      </View>

      <View style={styles.content}>
        <FormField label={t('bank_currency_label')}>
          <View
            style={[
              styles.input,
              {
                borderColor: theme.colors.gray300,
                backgroundColor: theme.colors.surface,
                shadowColor: theme.colors.black,
              },
            ]}
          >
            <View style={styles.currencyValueWrap}>
              <View style={[styles.flagPlaceholder, { backgroundColor: theme.colors.blue500 }]} />
              <Text style={{ color: theme.colors.gray800, fontSize: theme.typography.size.sm, lineHeight: 20 }}>
                {t('bank_currency_value')}
              </Text>
            </View>
            <ChevronDownIcon color={theme.colors.gray500} />
          </View>
        </FormField>

        <FormField label={t('bank_holder_name_label')}>
          <View
            style={[
              styles.input,
              {
                borderColor: theme.colors.gray300,
                backgroundColor: theme.colors.surface,
                shadowColor: theme.colors.black,
              },
            ]}
          >
            <Text style={{ color: theme.colors.gray800, fontSize: theme.typography.size.sm, lineHeight: 20 }}>
              {t('bank_holder_name_value')}
            </Text>
          </View>
        </FormField>

        <FormField label={t('bank_iban_label')}>
          <View
            style={[
              styles.input,
              {
                borderColor: theme.colors.gray300,
                backgroundColor: theme.colors.surface,
                shadowColor: theme.colors.black,
              },
            ]}
          >
            <Text style={{ color: theme.colors.gray800, fontSize: theme.typography.size.sm, lineHeight: 20 }}>
              {t('bank_iban_value')}
            </Text>
          </View>
        </FormField>

        <FormField label={t('bank_account_number_label')}>
          <View
            style={[
              styles.input,
              {
                borderColor: theme.colors.gray300,
                backgroundColor: theme.colors.surface,
                shadowColor: theme.colors.black,
              },
            ]}
          >
            <Text style={{ color: theme.colors.gray800, fontSize: theme.typography.size.sm, lineHeight: 20 }}>
              {t('bank_account_number_value')}
            </Text>
          </View>
        </FormField>
      </View>

      <View style={styles.footer}>
        <Button
          label={t('bank_confirm_button')}
          onPress={() => navigation.goBack()}
          textColor={theme.colors.gray900}
          containerStyle={styles.confirmButton}
        />
      </View>

      <Sidebar
        visible={sidebar.sidebarOpen}
        availability={sidebar.availability}
        onAvailabilityChange={sidebar.setAvailability}
        onClose={sidebar.closeSidebar}
        onNavigate={(screen) => navigation.navigate(screen)}
        onSwitchTab={() => navigation.navigate('Home', { screen: 'ProfileTab' })}
      />
    </SafeAreaView>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  const { theme } = useAppTheme();
  return (
    <View style={styles.field}>
      <Text
        weight="medium"
        style={{ color: theme.colors.gray600, fontSize: theme.typography.size.sm, lineHeight: 20 }}
      >
        {label}
      </Text>
      {children}
    </View>
  );
}

function HamburgerIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M4.5 7.5H19.5M4.5 12H19.5M4.5 16.5H19.5" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ChevronDownIcon({ color }: { color: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Path d="M4 6L8 10L12 6" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    minHeight: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuButton: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  content: {
    marginTop: 40,
    paddingHorizontal: 16,
    gap: 16,
  },
  field: {
    gap: 8,
    paddingBottom: 16,
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
  currencyValueWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flagPlaceholder: {
    width: 30,
    height: 18,
    borderRadius: 2,
  },
  footer: {
    marginTop: 'auto',
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 12,
  },
  confirmButton: {
    height: 54,
    borderRadius: 40,
  },
});
