import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Text from '../../components/Text';
import { useTranslations } from '../../localization/LocalizationProvider';
import { useAppTheme } from '../../theme/ThemeProvider';
import Sidebar from '../../components/Sidebar';
import { useSidebar } from '../../hooks/useSidebar';
import { MainStackParamList } from '../../navigation/types';
import DrivingLicenseBottomSheet from './components/DrivingLicenseBottomSheet';
import VehiclePlateBottomSheet from './components/VehiclePlateBottomSheet';

export default function ProfileScreen() {
  const { t } = useTranslations('app');
  const { theme } = useAppTheme();
  const sidebar = useSidebar();
  const stackNav = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [isDrivingLicenseSheetVisible, setDrivingLicenseSheetVisible] = useState(false);
  const [isVehiclePlateSheetVisible, setVehiclePlateSheetVisible] = useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Pressable onPress={sidebar.openSidebar} style={styles.menuButton}>
          <HamburgerIcon color={theme.colors.gray900} />
        </Pressable>
        <Text weight="semiBold" style={styles.headerTitle}>{t('nav_profile')}</Text>
        <View style={styles.menuButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
            <Text weight="semiBold" color={theme.colors.white}>JS</Text>
          </View>
          <View style={styles.profileMeta}>
            <Text weight="semiBold" style={styles.name}>{t('profile_name')}</Text>
            <Text weight="medium" style={{ color: theme.colors.gray600 }}>{t('profile_id')}</Text>
          </View>
        </View>

        <ProfileStatusRow
          title={t('profile_driving_license')}
          action={t('profile_add')}
          onPressAction={() => setDrivingLicenseSheetVisible(true)}
        />
        <ProfileStatusRow
          title={t('profile_vehicle_plate')}
          action={t('profile_add')}
          onPressAction={() => setVehiclePlateSheetVisible(true)}
        />

        <Text weight="semiBold" style={[styles.sectionTitle, { color: theme.colors.gray900 }]}>
          {t('profile_other_information')}
        </Text>

        <InfoCard label={t('profile_email')} value={t('profile_email_value')} />
        <InfoCard
          label={t('profile_password')}
          value={t('profile_password_value')}
          action={t('profile_change')}
          onPressAction={() => stackNav.navigate('UpdatePassword')}
        />
        <InfoCard label={t('profile_mobile_number')} value={t('profile_mobile_number_value')} />
      </ScrollView>

      <Sidebar
        visible={sidebar.sidebarOpen}
        availability={sidebar.availability}
        onAvailabilityChange={sidebar.setAvailability}
        onClose={sidebar.closeSidebar}
        onNavigate={(screen) => stackNav.navigate(screen)}
        onSwitchTab={() => stackNav.navigate('Home', { screen: 'ProfileTab' })}
      />

      <DrivingLicenseBottomSheet
        visible={isDrivingLicenseSheetVisible}
        onClose={() => setDrivingLicenseSheetVisible(false)}
      />
      <VehiclePlateBottomSheet
        visible={isVehiclePlateSheetVisible}
        onClose={() => setVehiclePlateSheetVisible(false)}
      />
    </SafeAreaView>
  );
}

function ProfileStatusRow({
  title,
  action,
  onPressAction,
}: {
  title: string;
  action: string;
  onPressAction: () => void;
}) {
  const { theme } = useAppTheme();
  const { t } = useTranslations('app');

  return (
    <View style={[styles.rowBlock, { borderBottomColor: theme.colors.gray300 }]}>
      <View style={styles.rowHeader}>
        <Text weight="semiBold">{title}</Text>
        <Pressable onPress={onPressAction}>
          <Text weight="medium" style={{ color: theme.colors.blue400 }}>{action}</Text>
        </Pressable>
      </View>
      <View style={[styles.badge, { backgroundColor: theme.colors.red100 }]}>
        <Text weight="medium" style={{ color: theme.colors.red800 }}>{t('profile_missing_data')}</Text>
      </View>
    </View>
  );
}

function InfoCard({
  label,
  value,
  action,
  onPressAction,
}: {
  label: string;
  value: string;
  action?: string;
  onPressAction?: () => void;
}) {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.infoCard, { backgroundColor: theme.colors.gray100, borderColor: theme.colors.gray200 }]}>
      <View style={styles.infoHeader}>
        <Text>{label}</Text>
        {action ? (
          <Pressable onPress={onPressAction}>
            <Text weight="medium" style={{ color: theme.colors.blue400 }}>{action}</Text>
          </Pressable>
        ) : null}
      </View>
      <Text weight="bold">{value}</Text>
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
  headerTitle: { fontSize: 16, lineHeight: 24 },
  content: { padding: 16, paddingTop: 16, paddingBottom: 24, gap: 16 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingBottom: 8 },
  avatar: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
  profileMeta: { gap: 4 },
  name: { fontSize: 16, lineHeight: 24 },
  rowBlock: { borderBottomWidth: 1, paddingVertical: 8, gap: 16 },
  rowHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  badge: { paddingHorizontal: 12, paddingVertical: 2, borderRadius: 12, alignSelf: 'flex-start' },
  sectionTitle: { marginTop: 8, fontSize: 18, lineHeight: 28 },
  infoCard: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 17, paddingVertical: 9, gap: 6 },
  infoHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
