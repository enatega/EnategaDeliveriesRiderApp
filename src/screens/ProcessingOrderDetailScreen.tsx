import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import Map from '../components/Map';
import SwipeableBottomSheet from '../components/SwipeableBottomSheet';
import Text from '../components/Text';
import Button from '../components/Button';
import { MainStackParamList } from '../navigation/types';
import { useAppTheme } from '../theme/ThemeProvider';
import { useTranslations } from '../localization/LocalizationProvider';
import { useAuth } from '../auth/AuthProvider';
import { useRiderOrderDetailQuery } from '../hooks/useRiderOrderDetailQuery';
import { useUpdateRiderOrderStatusMutation } from '../hooks/useRiderHomeMutations';
import OrderDetailTopBar from './orderDetail/components/OrderDetailTopBar';
import OrderSummarySection from './orderDetail/components/OrderSummarySection';
import OrderPaymentSection from './orderDetail/components/OrderPaymentSection';
import OrderItemsSection from './orderDetail/components/OrderItemsSection';
import DeliveryProgressSection from './orderDetail/components/DeliveryProgressSection';
import type { RiderOrderUpdatableStatus } from '../api/riderHomeTypes';
import {
  DELIVERY_PROGRESS_ORDER,
  resolveProgressStatusFromOrder,
  RiderDeliveryProgressStatus,
  toApiUpdatableStatus,
} from './orderDetail/progress';

type Props = NativeStackScreenProps<MainStackParamList, 'ProcessingOrderDetail'>;

const FALLBACK_PICKUP = { latitude: 33.6844, longitude: 73.0479 };
const FALLBACK_DELIVERY = { latitude: 33.6952, longitude: 73.0689 };

const STATUS_ACTION_LABELS: Record<RiderOrderUpdatableStatus, string> = {
  heading_to_store: 'Heading to Store',
  arrived_at_store: 'Arrived at Store',
  waiting_for_order: 'Waiting for Order',
  picked_up: 'Picked Up',
  out_for_delivery: 'Out for Delivery',
  arrived: 'Arrived at Customer',
  delivered: 'Delivered',
  failed: 'Mark as Failed',
};

const RIDER_ONLY_STATUSES = new Set<RiderOrderUpdatableStatus>([
  'heading_to_store',
  'arrived_at_store',
  'waiting_for_order',
]);

const STATUS_TITLE_KEY: Record<RiderDeliveryProgressStatus, string> = {
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

export default function ProcessingOrderDetailScreen({ route, navigation }: Props) {
  const { theme } = useAppTheme();
  const { t } = useTranslations('app');
  const { session } = useAuth();
  const insets = useSafeAreaInsets();
  const { orderId } = route.params;
  const detailQuery = useRiderOrderDetailQuery(orderId);
  const updateStatusMutation = useUpdateRiderOrderStatusMutation(orderId);
  const screenHeight = Dimensions.get('window').height;
  const collapsedHeight = 220;
  const defaultHeight = Math.min(screenHeight * 0.62, screenHeight - 250);
  const expandedHeight = Math.min(screenHeight * 0.82, screenHeight - 110);
  const [sheetHeight, setSheetHeight] = useState(defaultHeight);

  const mapRegion = useMemo(
    () => ({
      latitude: (FALLBACK_PICKUP.latitude + FALLBACK_DELIVERY.latitude) / 2,
      longitude: (FALLBACK_PICKUP.longitude + FALLBACK_DELIVERY.longitude) / 2,
      latitudeDelta: 0.03,
      longitudeDelta: 0.03,
    }),
    [],
  );

  const openNavigation = async () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${FALLBACK_PICKUP.latitude},${FALLBACK_PICKUP.longitude}&destination=${FALLBACK_DELIVERY.latitude},${FALLBACK_DELIVERY.longitude}&travelmode=driving`;
    await Linking.openURL(url);
  };

  const [selectedStatus, setSelectedStatus] = useState<RiderDeliveryProgressStatus | null>(null);

  const currentProgressStatus = useMemo(
    () => resolveProgressStatusFromOrder(detailQuery.data?.status, detailQuery.data?.riderStatus),
    [detailQuery.data?.riderStatus, detailQuery.data?.status],
  );
  const currentProgressTitle = t(STATUS_TITLE_KEY[currentProgressStatus]);

  useEffect(() => {
    setSelectedStatus(currentProgressStatus);
  }, [currentProgressStatus, orderId]);

  useEffect(() => {
    const interval = setInterval(() => {
      void detailQuery.refetch();
    }, 3000);

    return () => clearInterval(interval);
  }, [detailQuery.refetch]);

  const nextStatus = (selectedStatus
    ? toApiUpdatableStatus(selectedStatus)
    : null) as RiderOrderUpdatableStatus | null;
  const currentUpdatableStatus = toApiUpdatableStatus(currentProgressStatus);
  const selectedStatusIndex = selectedStatus
    ? DELIVERY_PROGRESS_ORDER.indexOf(selectedStatus)
    : -1;
  const currentStatusIndex = DELIVERY_PROGRESS_ORDER.indexOf(currentProgressStatus);
  const isForwardProgressSelection = selectedStatusIndex > currentStatusIndex;
  const allowedStatuses = detailQuery.data?.nextAllowedStatuses ?? [];
  const isNextStatusAllowed = Boolean(nextStatus && allowedStatuses.includes(nextStatus));
  const canApplyRiderOnlyStatus = Boolean(
    nextStatus
    && RIDER_ONLY_STATUSES.has(nextStatus)
    && isForwardProgressSelection
    && (detailQuery.data?.status === 'rider_assigned' || detailQuery.data?.status === 'ready'),
  );
  const canUpdateStatus = Boolean(
    nextStatus
    && nextStatus !== currentUpdatableStatus
    && (isNextStatusAllowed || canApplyRiderOnlyStatus)
  );
  const updateStatusLabel = nextStatus ? STATUS_ACTION_LABELS[nextStatus] : null;

  const handleUpdateStatus = () => {
    const riderId = session.user?.id;
    if (!nextStatus || !riderId) return;
    updateStatusMutation.mutate({ status: nextStatus, riderId });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.white }]} edges={['top']}>
      <View style={styles.mapWrap}>
        <Map
          style={{ bottom: sheetHeight }}
          initialRegion={mapRegion}
          region={mapRegion}
          markers={[
            { id: 'pickup', coordinate: FALLBACK_PICKUP },
            { id: 'delivery', coordinate: FALLBACK_DELIVERY },
          ]}
          polylines={[
            {
              id: 'route',
              coordinates: [FALLBACK_PICKUP, FALLBACK_DELIVERY],
              strokeColor: '#4F9D2F',
              strokeWidth: 3,
              lineDashPattern: [6, 6],
            },
          ]}
        />
        <OrderDetailTopBar
          title={
            currentProgressTitle
            ?? detailQuery.data?.statusLabel
            ?? t('order_assigned_title')
          }
          onBack={() => navigation.goBack()}
        />
      </View>

      <SwipeableBottomSheet
        expandedHeight={expandedHeight}
        defaultHeight={defaultHeight}
        collapsedHeight={collapsedHeight}
        initialState="default"
        style={[styles.bottomSheet, { backgroundColor: theme.colors.white, borderColor: '#D1D5DB' }]}
        handle={<View style={[styles.handle, { backgroundColor: '#D1D5DB' }]} />}
        floatingAccessory={
          <Pressable style={styles.navigateChip} onPress={openNavigation}>
            <NavigationIcon color="#FFFFFF" />
            <Text weight="medium" color="#FFFFFF">{t('order_navigate')}</Text>
          </Pressable>
        }
        floatingAccessoryStyle={styles.floatingAccessory}
        onHeightChange={setSheetHeight}
      >
        {detailQuery.isLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={theme.colors.primary} />
          </View>
        ) : detailQuery.isError || !detailQuery.data ? (
          <View style={styles.loadingWrap}>
            <Text color={theme.colors.gray600}>{detailQuery.error?.message ?? t('orders_empty')}</Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.sheetContent, { paddingBottom: insets.bottom + 16 }]}
          >
            <OrderSummarySection order={detailQuery.data} />
            <OrderPaymentSection order={detailQuery.data} />
            <OrderItemsSection order={detailQuery.data} />
            <DeliveryProgressSection
              status={detailQuery.data.status}
              riderStatus={detailQuery.data.riderStatus}
              selectedStatus={selectedStatus}
              onSelectStatus={setSelectedStatus}
            />
            {canUpdateStatus && updateStatusLabel ? (
              <Button
                label={
                  updateStatusMutation.isPending
                    ? t('order_status_updating')
                    : `${t('order_status_update_to')} ${updateStatusLabel}`
                }
                onPress={handleUpdateStatus}
                disabled={updateStatusMutation.isPending}
                containerStyle={styles.primaryButton}
                textColor={theme.colors.gray900}
              />
            ) : null}
            <Button
              label={t('order_start_navigation')}
              onPress={openNavigation}
              containerStyle={styles.primaryButton}
              textColor={theme.colors.gray900}
            />
          </ScrollView>
        )}
      </SwipeableBottomSheet>
    </SafeAreaView>
  );
}

function NavigationIcon({ color }: { color: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Path
        d="M14.667 1.333L7.333 8.667"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14.667 1.333L10 14.667L7.333 8.667L1.333 6L14.667 1.333Z"
        stroke={color}
        strokeWidth={1.5}
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
  mapWrap: {
    flex: 1,
  },
  floatingAccessory: {
    left: 16,
    top: -46,
  },
  navigateChip: {
    backgroundColor: '#27272A',
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bottomSheet: {
    borderTopWidth: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  handle: {
    width: 48,
    height: 4,
    borderRadius: 999,
    marginTop: 8,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  sheetContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 20,
  },
  primaryButton: {
    height: 54,
    borderRadius: 40,
    marginTop: 4,
  },
});
