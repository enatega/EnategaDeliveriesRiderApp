import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import Text from '../components/Text';
import TopSegmentedTabs from '../components/TopSegmentedTabs';
import Sidebar from '../components/Sidebar';
import { useAppTheme } from '../theme/ThemeProvider';
import { useTranslations } from '../localization/LocalizationProvider';
import { useSidebar } from '../hooks/useSidebar';
import { MainStackParamList } from '../navigation/types';
import { useRiderHomeSummaryQuery } from '../hooks/useRiderHomeQueries';
import RiderOrdersList from './home/RiderOrdersList';
import { RiderOrderTab } from '../api/riderHomeTypes';

type HomeFilter = RiderOrderTab;

export default function HomeScreen() {
  const { theme } = useAppTheme();
  const { t } = useTranslations('app');
  const sidebar = useSidebar();
  const [homeFilter, setHomeFilter] = useState<HomeFilter>('new');
  const stackNav = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const summaryQuery = useRiderHomeSummaryQuery();

  const filterTabs: HomeFilter[] = ['new', 'processing', 'delivered'];
  const summary = summaryQuery.data;
  const filterLabelMap: Record<HomeFilter, string> = {
    new: `${t('orders_new')} (${summary?.newOrders ?? 0})`,
    processing: `${t('orders_processing')} (${summary?.processingOrders ?? 0})`,
    delivered: `${t('orders_delivered')} (${summary?.deliveredOrders ?? 0})`,
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={sidebar.openSidebar} style={styles.menuButton}>
          <HamburgerIcon color={theme.colors.gray900} />
        </Pressable>
        <Text variant="body" weight="semiBold" style={styles.headerTitle}>{t('home_header_title')}</Text>
        <View style={styles.menuButton} />
      </View>

      <TopSegmentedTabs tabs={filterTabs} activeTab={homeFilter} onChange={setHomeFilter} labelMap={filterLabelMap} />

      <RiderOrdersList tab={homeFilter} />

      <Sidebar
        visible={sidebar.sidebarOpen}
        availability={sidebar.availability}
        onAvailabilityChange={sidebar.setAvailability}
        onClose={sidebar.closeSidebar}
        onNavigate={(screen) => stackNav.navigate(screen)}
        onSwitchTab={() => stackNav.navigate('Home', { screen: 'ProfileTab' })}
      />
    </SafeAreaView>
  );
}

function HamburgerIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4.5 7.5H19.5M4.5 12H19.5M4.5 16.5H19.5"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    minHeight: 44,
  },
  menuButton: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, lineHeight: 24 },
});
