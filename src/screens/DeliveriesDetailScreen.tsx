import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import DeliveryItemRow from '../components/DeliveryItemRow';
import Text from '../components/Text';
import { useTranslations } from '../localization/LocalizationProvider';
import { MainStackParamList } from '../navigation/types';
import { lightColors } from '../theme/colors';
import { useAppTheme } from '../theme/ThemeProvider';
import { typography } from '../theme/typography';
import { deliveryItems } from './earnings/mockData';

type Props = NativeStackScreenProps<MainStackParamList, 'DeliveriesDetail'>;

export default function DeliveriesDetailScreen({ navigation }: Props) {
  const { theme } = useAppTheme();
  const { t } = useTranslations('app');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconButton} hitSlop={8} accessibilityRole="button" accessibilityLabel="Go back">
          <ArrowLeft color={theme.colors.gray900} />
        </Pressable>
        <Text variant="body" weight="semiBold" color={lightColors.black} style={styles.headerTitle}>
          {t('earnings_deliveries')}
        </Text>
        <View style={styles.iconButton} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        {deliveryItems.map((item) => (
          <DeliveryItemRow key={item.id} item={item} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function ArrowLeft({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 12H5M12 19L5 12L12 5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
  },
  iconButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md,
    textAlign: 'center',
  },
  listContent: {
    paddingTop: 0,
    paddingBottom: 24,
  },
});
