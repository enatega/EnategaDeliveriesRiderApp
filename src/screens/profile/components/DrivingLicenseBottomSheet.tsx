import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Text from '../../../components/Text';
import Button from '../../../components/Button';
import { useAppTheme } from '../../../theme/ThemeProvider';
import { useTranslations } from '../../../localization/LocalizationProvider';
import ProfileBottomSheetBase from './ProfileBottomSheetBase';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function DrivingLicenseBottomSheet({ visible, onClose }: Props) {
  const { theme } = useAppTheme();
  const { t } = useTranslations('app');

  return (
    <ProfileBottomSheetBase visible={visible} onClose={onClose} title={t('profile_driving_license')}>
      <View style={styles.content}>
        <FieldLabel label={t('profile_license_no')} />
        <ValueInput value={t('profile_license_no_value')} />

        <FieldLabel label={t('profile_license_expiry_date')} />
        <ValueInput value={t('profile_license_expiry_date_value')} />

        <FieldLabel label={t('profile_add_registration_document')} />
        <UploadBox />

        <View style={[styles.footerDivider, { backgroundColor: theme.colors.gray200 }]} />

        <Button
          label={t('profile_save')}
          onPress={onClose}
          textColor={theme.colors.gray900}
          containerStyle={styles.saveButton}
        />
      </View>
    </ProfileBottomSheetBase>
  );
}

function FieldLabel({ label }: { label: string }) {
  const { theme } = useAppTheme();
  return (
    <Text weight="semiBold" style={[styles.label, { color: theme.colors.gray600 }]}>
      {label}
    </Text>
  );
}

function ValueInput({ value }: { value: string }) {
  const { theme } = useAppTheme();
  return (
    <Pressable style={[styles.input, { borderColor: theme.colors.gray300 }]}>
      <Text style={{ color: theme.colors.gray600 }}>{value}</Text>
      <ChevronDownIcon color={theme.colors.gray500} />
    </Pressable>
  );
}

function UploadBox() {
  const { theme } = useAppTheme();
  return (
    <Pressable style={[styles.uploadBox, { borderColor: theme.colors.gray300 }]}>
      <UploadIcon color={theme.colors.gray400} />
    </Pressable>
  );
}

function ChevronDownIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path d="M5 7.5L10 12.5L15 7.5" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
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
  content: {
    gap: 12,
    paddingBottom: 14,
  },
  label: {
    fontSize: 14,
    lineHeight: 18,
  },
  input: {
    height: 42,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  uploadBox: {
    height: 108,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  footerDivider: {
    height: 1,
    marginTop: 2,
    marginBottom: 10,
  },
  saveButton: {
    height: 54,
    borderRadius: 32,
  },
});
