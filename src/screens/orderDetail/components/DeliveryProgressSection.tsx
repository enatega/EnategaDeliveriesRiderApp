import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
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

const STATUS_DESC_KEY: Record<RiderDeliveryProgressStatus, string> = {
  [RiderDeliveryProgressStatus.ASSIGNED]: 'order_status_desc_assigned',
  [RiderDeliveryProgressStatus.HEADING_TO_STORE]: 'order_status_desc_heading_to_store',
  [RiderDeliveryProgressStatus.ARRIVED_AT_STORE]: 'order_status_desc_arrived_at_store',
  [RiderDeliveryProgressStatus.WAITING_FOR_ORDER]: 'order_status_desc_waiting_for_order',
  [RiderDeliveryProgressStatus.PICKED_UP]: 'order_status_desc_picked_up',
  [RiderDeliveryProgressStatus.OUT_FOR_DELIVERY]: 'order_status_desc_out_for_delivery',
  [RiderDeliveryProgressStatus.ARRIVED_AT_CUSTOMER]: 'order_status_desc_arrived_at_customer',
  [RiderDeliveryProgressStatus.DELIVERED]: 'order_status_desc_delivered',
  [RiderDeliveryProgressStatus.FAILED]: 'order_status_desc_failed',
};

const ACTIVE_GREEN = '#52B260';

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
          const isCurrent = index === currentIndex;
          const isCompleted = index < currentIndex;
          const isSelected = selectedStatus === item;
          const isActive = isSelected || isCurrent;
          const dotBorderColor = isActive
            ? ACTIVE_GREEN
            : isCompleted
              ? theme.colors.emerald900
              : theme.colors.gray300;
          const dotBackgroundColor = isCompleted ? theme.colors.emerald900 : theme.colors.white;
          const textColor = isActive
            ? ACTIVE_GREEN
            : isCompleted
              ? theme.colors.gray700
              : theme.colors.gray600;
          const textWeight = isActive ? 'semiBold' : 'regular';
          const descriptionColor = theme.colors.gray500;
          const showConnector = index < DELIVERY_PROGRESS_ORDER.length - 1;
          const connectorColor = isCompleted || isActive ? theme.colors.emerald100 : theme.colors.gray300;

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
              <View style={styles.indicatorColumn}>
                <View
                  style={[
                    styles.dot,
                    {
                      borderColor: dotBorderColor,
                      backgroundColor: dotBackgroundColor,
                    },
                  ]}
                >
                  {isCompleted ? <CheckIcon color={theme.colors.white} /> : null}
                  {isActive && !isCompleted ? <View style={styles.activeInnerDot} /> : null}
                </View>
                {showConnector ? <View style={[styles.connector, { backgroundColor: connectorColor }]} /> : null}
              </View>
              <View style={styles.textWrap}>
                <Text
                  weight={textWeight}
                  color={textColor}
                  style={isActive ? styles.activeHeading : null}
                >
                  {t(STATUS_LABEL_KEY[item])}
                </Text>
                <Text variant="caption" color={descriptionColor}>
                  {t(STATUS_DESC_KEY[item])}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function CheckIcon({ color }: { color: string }) {
  return (
    <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
      <Path
        d="M2.5 6.3L4.9 8.7L9.5 3.9"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: 1,
    paddingTop: 16,
    gap: 16,
  },
  listWrap: {
    gap: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  indicatorColumn: {
    width: 24,
    alignItems: 'center',
  },
  connector: {
    width: 2,
    height: 40,
    marginTop: 0
  },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeInnerDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: ACTIVE_GREEN,
  },
  textWrap: {
    flex: 1,
    gap: 2,
    paddingTop: 0,
    marginTop: -2,
  },
  activeHeading: {
    fontWeight: '600',
  },
});
