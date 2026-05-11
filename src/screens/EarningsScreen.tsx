import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import EarningsActivityRow from '../components/EarningsActivityRow';
import EarningsChart from '../components/EarningsChart';
import Text from '../components/Text';
import { useTranslations } from '../localization/LocalizationProvider';
import { MainStackParamList } from '../navigation/types';
import { lightColors } from '../theme/colors';
import { typography } from '../theme/typography';
import { earningsActivities, earningsChartData } from './earnings/mockData';

export default function EarningsScreen() {
  const { t } = useTranslations('app');
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const recentActivities = earningsActivities.slice(0, 7);

  const handleSeeMore = () => navigation.navigate('EarningsDetail');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: lightColors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: lightColors.background }]}>
        <Text variant="body" weight="semiBold" color={lightColors.black} style={styles.headerTitle}>
          {t('nav_earnings')}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <EarningsChart data={earningsChartData} />

        <View style={styles.activitySection}>
          <View style={styles.sectionHeader}>
            <Text variant="subtitle" weight="semiBold" color={lightColors.gray900} style={styles.sectionTitle}>
              {t('earnings_recent_activity')}
            </Text>
            <Pressable onPress={handleSeeMore} accessibilityRole="button" hitSlop={8}>
              <Text variant="caption" weight="semiBold" color={lightColors.blue500} style={styles.seeMore}>
                {t('earnings_see_more')}
              </Text>
            </Pressable>
          </View>

          <View>
            {recentActivities.map((item) => (
              <EarningsActivityRow key={item.id} item={item} onPress={handleSeeMore} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md,
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  activitySection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 8,
  },
  sectionHeader: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    gap: 6,
  },
  sectionTitle: {
    flex: 1,
    fontSize: typography.size.lg,
    lineHeight: typography.lineHeight.lg,
    fontWeight: 'bold',
  },
  seeMore: {
    width: 62,
    fontSize: typography.size.xs,
    lineHeight: typography.lineHeight.xs,
    textAlign: 'right',
  },
});
