import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../components/Text';
import { useAppTheme } from '../../../theme/ThemeProvider';
import { useTranslations } from '../../../localization/LocalizationProvider';
import {
  DELIVERY_PROGRESS_ORDER,
  resolveProgressStatusFromOrder,
  RiderDeliveryProgressStatus,
} from '../progress';

type Props = {
  status?: string | null;
  riderStatus?: string | null;
  selectedStatus?: RiderDeliveryProgressStatus | null;
  onSelectStatus?: (status: RiderDeliveryProgressStatus) => void;
};

const STATUS_LABEL_KEY: Record<RiderDeliveryProgressStatus, string> = {
  [RiderDeliveryProgressStatus.ASSIGNED]: 'order_status_assigned',
  [RiderDeliveryProgressStatus.HEADING_TO_STORE]: 'order_status_heading_to_store',
  [RiderDeliveryProgressStatus.ARRIVED_AT_STORE]: 'order_status_arrived_at_store',
  [RiderDeliveryProgressStatus.WAITING_FOR_ORDER]: 'order_status_waiting_for_order',
  [RiderDeliveryProgressStatus.PICKED_UP]: 'order_status_picked_up',
  [RiderDeliveryProgressStatus.OUT_FOR_DELIVERY]: 'order_status_out_for_delivery',
  [RiderDeliveryProgressStatus.ARRIVED_AT_CUSTOMER]: 'order_status_arrived_at_customer',
  [RiderDeliveryProgressStatus.DELIVERED]: 'order_status_delivered',
  [RiderDeliveryProgressStatus.FAILED]: 'order_status_failed',
};

export default function DeliveryProgressSection({
  status,
  riderStatus,
  selectedStatus,
  onSelectStatus,
}: Props) {
  const { theme } = useAppTheme();
  const { t } = useTranslations('app');
  const currentStatus = resolveProgressStatusFromOrder(status, riderStatus);
  const currentIndex = DELIVERY_PROGRESS_ORDER.indexOf(currentStatus);

  return (
    <View style={[styles.wrapper, { borderTopColor: theme.colors.gray200 }]}>
      <Text weight="medium" color={theme.colors.gray600}>{t('order_delivery_progress')}</Text>

      <View style={styles.listWrap}>
        {DELIVERY_PROGRESS_ORDER.map((item, index) => {
          const active = index <= currentIndex;
          const isSelected = selectedStatus === item;
          return (
            <Pressable
              key={item}
              style={styles.row}
              onPress={() => {
                if (!onSelectStatus) return;
                onSelectStatus(item);
              }}
              disabled={!onSelectStatus}
            >
              <View
                style={[
                  styles.dot,
                  {
                    borderColor: isSelected || active ? theme.colors.emerald500 : theme.colors.gray300,
                    backgroundColor: isSelected || active ? theme.colors.emerald500 : theme.colors.white,
                  },
                ]}
              >
                {isSelected || active ? <View style={[styles.dotInner, { backgroundColor: theme.colors.white }]} /> : null}
              </View>
              <Text
                weight={isSelected || active ? 'medium' : 'regular'}
                color={isSelected || active ? theme.colors.gray900 : theme.colors.gray600}
              >
                {t(STATUS_LABEL_KEY[item])}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: 1,
    paddingTop: 16,
    gap: 16,
  },
  listWrap: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotInner: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
});
