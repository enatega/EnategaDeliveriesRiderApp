import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from './Text';
import { useAppTheme } from '../theme/ThemeProvider';

export type DeliveryItemRowData = {
  id: string;
  status: 'Completed';
  payment: number;
};

type Props = {
  item: DeliveryItemRowData;
};

export default function DeliveryItemRow({ item }: Props) {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.row, { borderBottomColor: theme.colors.gray300 }]}>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text variant="body" weight="medium" color={theme.colors.gray800} style={styles.orderId} numberOfLines={1}>
            Order ID  {item.id}
          </Text>
          <View style={[styles.badge, { backgroundColor: theme.colors.emerald100 }]}>
            <Text variant="caption" weight="medium" color={theme.colors.emerald900} style={styles.badgeText}>
              {item.status}
            </Text>
          </View>
        </View>
        <View style={styles.paymentRow}>
          <Text variant="body" weight="medium" color={theme.colors.gray800} style={styles.paymentLabel}>
            Payment
          </Text>
          <Text variant="body" weight="semiBold" color={theme.colors.gray800} style={styles.paymentAmount}>
            ${item.payment}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 84,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  orderId: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 14,
    lineHeight: 20,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentLabel: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  paymentAmount: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'right',
  },
});
