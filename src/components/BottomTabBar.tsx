import React from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from './Text';
import HomeIcon from './icons/HomeIcon';
import WalletIcon from './icons/WalletIcon';
import EarningsIcon from './icons/EarningsIcon';
import ProfileIcon from './icons/ProfileIcon';
import { useTranslations } from '../localization/LocalizationProvider';

const TAB_META = {
  HomeTab: { key: 'nav_home', Icon: HomeIcon },
  WalletTab: { key: 'nav_wallet', Icon: WalletIcon },
  EarningsTab: { key: 'nav_earnings', Icon: EarningsIcon },
  ProfileTab: { key: 'nav_profile', Icon: ProfileIcon },
} as const;

export default function BottomTabBar({ state, descriptors, navigation, insets }: BottomTabBarProps) {
  const { t } = useTranslations('app');

  return (
    <View style={[styles.container, { paddingBottom: Math.max(10, insets.bottom) }]}> 
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const meta = TAB_META[route.name as keyof typeof TAB_META];
        const label = t(meta?.key ?? 'nav_home');
        const Icon = meta?.Icon ?? HomeIcon;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable key={route.key} style={styles.tab} onPress={onPress} accessibilityRole="tab" accessibilityState={{ selected: focused }} accessibilityLabel={label}>
            <View style={styles.iconWrap}><Icon active={focused} /></View>
            <Text variant="caption" style={[styles.label, focused ? styles.active : styles.inactive]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1F2937',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  tab: { alignItems: 'center', gap: 7, minWidth: 70 },
  iconWrap: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 12, lineHeight: 16 },
  active: { color: '#90E36D' },
  inactive: { color: '#9CA3AF' },
});
