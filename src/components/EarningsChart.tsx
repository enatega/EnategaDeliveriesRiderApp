import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from './Text';
import { lightColors } from '../theme/colors';
import { typography } from '../theme/typography';

export type EarningsChartDataPoint = {
  label: string;
  amount: number;
  barHeight?: number;
};

type Props = {
  data: EarningsChartDataPoint[];
};

export default function EarningsChart({ data }: Props) {
  const maxAmount = Math.max(...data.map((item) => item.amount), 1);

  return (
    <View style={styles.container}>
      {data.map((item) => {
        const barHeight = item.barHeight ?? Math.max((item.amount / maxAmount) * 167, 16);

        return (
          <View key={`${item.label}-${item.amount}`} style={styles.column}>
            <Text variant="caption" color={lightColors.gray600} style={styles.amount}>
              ${item.amount}
            </Text>
            <View
              style={[
                styles.bar,
                {
                  height: barHeight,
                  backgroundColor: lightColors.primary,
                  borderColor: lightColors.gray100,
                },
              ]}
            />
            <Text variant="caption" color={lightColors.gray600} style={styles.label}>
              {item.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    minHeight: 253,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  amount: {
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
    textAlign: 'center',
  },
  bar: {
    width: '100%',
    borderWidth: 1,
  },
  label: {
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
    textAlign: 'center',
  },
});
