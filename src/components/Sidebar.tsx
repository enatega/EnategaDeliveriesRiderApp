import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Image, Pressable, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from './Text';
import ToggleSwitch from './ToggleSwitch';
import { useAppTheme } from '../theme/ThemeProvider';
import { lightColors } from '../theme/colors';
import { useAuth } from '../auth/AuthProvider';
import { useLogoutMutation } from '../hooks/useAuthMutations';
import { useTranslations } from '../localization/LocalizationProvider';

type Props = {
  visible: boolean;
  onClose: () => void;
  availability: boolean;
  onAvailabilityChange: (v: boolean) => void;
  onNavigate: (screen: 'Language' | 'VehicleType' | 'BankManagement' | 'WorkSchedule') => void;
  onSwitchTab?: () => void;
};

type MenuItemBase = { key: string; label: string; icon: React.ReactNode };
type MenuItemNav = MenuItemBase & { type: 'nav'; onPress: () => void };
type MenuItemToggle = MenuItemBase & { type: 'toggle'; value: boolean; onToggle: (v: boolean) => void; subLabel?: string };
type MenuItem = MenuItemNav | MenuItemToggle;

const DRAWER_WIDTH = 300;
const ANIMATION_DURATION = 280;
const SIDEBAR_ICONS = {
  availability: require('../assets/images/availability.png'),
  language: require('../assets/images/language.png'),
  vehicleType: require('../assets/images/vehicle-type.png'),
  bankManagement: require('../assets/images/bank-managment.png'),
  workSchedule: require('../assets/images/work-schedule.png'),
  profile: require('../assets/images/profile.png'),
  aboutUs: require('../assets/images/about-us.png'),
  help: require('../assets/images/help.png'),
  logout: require('../assets/images/logout.png'),
} as const;

function IconBox({ children }: { children: React.ReactNode }) { return <View style={styles.iconBox}>{children}</View>; }
function ChevronRight({ color }: { color: string }) { return <View style={[styles.chevron, { borderColor: color }]} />; }

export default function Sidebar({ visible, onClose, availability, onAvailabilityChange, onNavigate, onSwitchTab }: Props) {
  const { theme } = useAppTheme();
  const { t } = useTranslations('app');
  const { session } = useAuth();
  const logoutMutation = useLogoutMutation();
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(visible);
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const animateOpen = useCallback(() => {
    translateX.setValue(-DRAWER_WIDTH);
    backdropOpacity.setValue(0);
    setMounted(true);
    Animated.parallel([
      Animated.timing(translateX, { toValue: 0, duration: ANIMATION_DURATION, useNativeDriver: true }),
      Animated.timing(backdropOpacity, { toValue: 1, duration: ANIMATION_DURATION, useNativeDriver: true }),
    ]).start();
  }, [translateX, backdropOpacity]);

  const animateClose = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateX, { toValue: -DRAWER_WIDTH, duration: ANIMATION_DURATION, useNativeDriver: true }),
      Animated.timing(backdropOpacity, { toValue: 0, duration: ANIMATION_DURATION, useNativeDriver: true }),
    ]).start(() => setMounted(false));
  }, [translateX, backdropOpacity]);

  useEffect(() => { if (visible) animateOpen(); else animateClose(); }, [visible, animateOpen, animateClose]);
  if (!mounted) return null;

  const user = session.user;
  const initials = user?.name ? user.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase() : 'JS';

  const items: MenuItem[] = [
    {
      key: 'availability',
      type: 'toggle',
      label: t('menu_availability'),
      icon: <Image source={SIDEBAR_ICONS.availability} style={styles.iconImage} resizeMode="contain" />,
      value: availability,
      onToggle: onAvailabilityChange,
      subLabel: availability ? t('menu_available') : t('menu_unavailable'),
    },
    {
      key: 'language',
      type: 'nav',
      label: t('menu_language'),
      icon: <Image source={SIDEBAR_ICONS.language} style={styles.iconImage} resizeMode="contain" />,
      onPress: () => {
        onClose();
        onNavigate('Language');
      },
    },
    {
      key: 'vehicle',
      type: 'nav',
      label: t('menu_vehicle_type'),
      icon: <Image source={SIDEBAR_ICONS.vehicleType} style={styles.iconImage} resizeMode="contain" />,
      onPress: () => {
        onClose();
        onNavigate('VehicleType');
      },
    },
    {
      key: 'bank',
      type: 'nav',
      label: t('menu_bank_management'),
      icon: <Image source={SIDEBAR_ICONS.bankManagement} style={styles.iconImage} resizeMode="contain" />,
      onPress: () => {
        onClose();
        onNavigate('BankManagement');
      },
    },
    {
      key: 'schedule',
      type: 'nav',
      label: t('menu_work_schedule'),
      icon: <Image source={SIDEBAR_ICONS.workSchedule} style={styles.iconImage} resizeMode="contain" />,
      onPress: () => {
        onClose();
        onNavigate('WorkSchedule');
      },
    },
    {
      key: 'profile',
      type: 'nav',
      label: t('menu_profile'),
      icon: <Image source={SIDEBAR_ICONS.profile} style={styles.iconImage} resizeMode="contain" />,
      onPress: () => {
        onClose();
        onSwitchTab?.();
      },
    },
    {
      key: 'privacy',
      type: 'nav',
      label: t('menu_privacy_policy'),
      icon: <Image source={SIDEBAR_ICONS.vehicleType} style={styles.iconImage} resizeMode="contain" />,
      onPress: onClose,
    },
    {
      key: 'about',
      type: 'nav',
      label: t('menu_about_us'),
      icon: <Image source={SIDEBAR_ICONS.aboutUs} style={styles.iconImage} resizeMode="contain" />,
      onPress: onClose,
    },
    {
      key: 'help',
      type: 'nav',
      label: t('menu_help'),
      icon: <Image source={SIDEBAR_ICONS.help} style={styles.iconImage} resizeMode="contain" />,
      onPress: onClose,
    },
    {
      key: 'logout',
      type: 'nav',
      label: t('menu_logout'),
      icon: <Image source={SIDEBAR_ICONS.logout} style={styles.iconImage} resizeMode="contain" />,
      onPress: () => logoutMutation.mutate(),
    },
  ];

  return (
    <View style={[StyleSheet.absoluteFill, styles.container]} pointerEvents="box-none">
      <TouchableWithoutFeedback onPress={onClose}><Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} /></TouchableWithoutFeedback>
      <Animated.View style={[styles.drawer, { backgroundColor: theme.colors.background, transform: [{ translateX }] }]}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <View style={styles.avatarCircle}><Text variant="body" weight="semiBold" color={theme.colors.primary}>{initials}</Text></View>
          <Text variant="subtitle" weight="bold" color={theme.colors.text} style={styles.userName}>{user?.name ?? 'John Smith'}</Text>
          <Text variant="caption" color={theme.colors.gray600}>ID-7853</Text>
        </View>

        <ScrollView style={styles.menuScroll} showsVerticalScrollIndicator={false} contentContainerStyle={[styles.menuContent, { paddingBottom: insets.bottom + 24 }]}> 
          {items.map((item, idx) => (
            <View key={item.key} style={[styles.row, { borderBottomColor: theme.colors.gray300, borderBottomWidth: idx < items.length - 1 ? 1 : 0 }]}>
              <IconBox>{item.icon}</IconBox>
              <Text variant="body" weight="semiBold" color={theme.colors.text} style={styles.rowLabel}>{item.label}</Text>
              {item.type === 'toggle' ? (
                <View style={styles.toggleWrapper}>
                  <ToggleSwitch value={item.value} onValueChange={item.onToggle} />
                  {item.subLabel ? <Text variant="caption" color={theme.colors.mutedText}>{item.subLabel}</Text> : null}
                </View>
              ) : (
                <Pressable onPress={item.onPress} style={StyleSheet.absoluteFill} accessibilityRole="button" accessibilityLabel={item.label} />
              )}
              {item.type === 'nav' && <ChevronRight color={theme.colors.text} />}
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { zIndex: 20 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: lightColors.black, opacity: 0.24 },
  drawer: { width: DRAWER_WIDTH, height: '100%', overflow: 'hidden', elevation: 10, shadowColor: lightColors.black, shadowOffset: { width: 2, height: 0 }, shadowOpacity: 0.18, shadowRadius: 8 },
  header: { backgroundColor: lightColors.primary, paddingHorizontal: 16, paddingBottom: 16 },
  avatarCircle: { width: 54, height: 54, borderRadius: 27, backgroundColor: lightColors.white, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  userName: { marginBottom: 2 },
  menuScroll: { flex: 1 },
  menuContent: { paddingTop: 0 },
  row: { minHeight: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowLabel: { flex: 1, fontSize: 14, lineHeight: 20 },
  iconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: lightColors.gray200, alignItems: 'center', justifyContent: 'center' },
  iconImage: { width: 18, height: 18 },
  toggleWrapper: { alignItems: 'center', justifyContent: 'center', gap: 2, marginRight: 8 },
  chevron: { width: 10, height: 10, borderTopWidth: 1.5, borderRightWidth: 1.5, transform: [{ rotate: '45deg' }] },
});
