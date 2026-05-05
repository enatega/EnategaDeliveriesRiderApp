import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Text from './Text';
import Button from './Button';
import { useAppTheme } from '../theme/ThemeProvider';
import { useTranslations } from '../localization/LocalizationProvider';
import { RiderHomeOrder, RiderOrderTab } from '../api/riderHomeTypes';
import { useAssignOrderMutation } from '../hooks/useRiderHomeMutations';
import { MainStackParamList } from '../navigation/types';

type Props = {
  order: RiderHomeOrder;
  tab: RiderOrderTab;
};

function statusColors(label?: string | null) {
  const lower = (label ?? '').toLowerCase();

  if (lower.includes('deliver')) {
    return { bg: '#D1FAE5', text: '#10B981' };
  }

  if (lower.includes('assign')) {
    return { bg: '#FEF3C7', text: '#92400E' };
  }

  return { bg: '#FEE2E2', text: '#991B1B' };
}

function getActionLabel(tab: RiderOrderTab, order: RiderHomeOrder, t: (key: string) => string) {
  if (tab === 'new') return t('order_assign_me');
  if (tab === 'processing') return t('order_pick_order');
  return t('order_delivered');
}

export default function HomeOrderCard({ order, tab }: Props) {
  const { theme } = useAppTheme();
  const { t } = useTranslations('app');
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const assignOrderMutation = useAssignOrderMutation();

  const safeOrderCode = order.orderCode ?? order.orderId ?? '—';
  const safeStatusLabel = order.statusLabel ?? order.status ?? t('status_unknown');
  const safeStoreName = order.storeName ?? '—';
  const safePickupAddress = order.pickupAddress ?? '—';
  const safeDeliveryAddress = order.deliveryAddress ?? '—';
  const safeOrderAmount = Number(order.orderAmount ?? 0);
  const safeDistanceKm = Number(order.distanceKm ?? 0);
  const safePaymentStatus = order.paymentStatus ?? '—';
  const safeComment = order.customerComment ?? '';
  const safeStoreImage = order.storeImage ?? '';
  const safeCreatedAt = order.createdAt ? new Date(order.createdAt) : null;
  const safeTime = safeCreatedAt && !Number.isNaN(safeCreatedAt.getTime())
    ? safeCreatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '—';
  const canAssignMe = Boolean(order.canAssignMe);

  const badge = statusColors(safeStatusLabel);
  const actionLabel = getActionLabel(tab, order, t);
  const showAction = tab === 'new' && canAssignMe;
  const isAssigning = tab === 'new' && assignOrderMutation.isPending;
  const buttonLabel = isAssigning ? t('order_assigning') : actionLabel;
  const hasOrderId = Boolean(order.orderId);

  const handleActionPress = () => {
    if (tab === 'new') {
      if (!order.orderId) return;
      assignOrderMutation.mutate(order.orderId);
      return;
    }
  };

  const handleCardPress = () => {
    if (tab !== 'processing' || !order.orderId) return;
    navigation.navigate('ProcessingOrderDetail', { orderId: order.orderId });
  };

  return (
    <Pressable onPress={handleCardPress} disabled={tab !== 'processing' || !order.orderId}>
    <View style={[styles.card, { borderColor: theme.colors.gray100, backgroundColor: theme.colors.gray50 }]}> 
      <View style={styles.rowBetween}>
        <Text weight="semiBold" color={theme.colors.gray600}>{t('home_status')}</Text>
        <View style={[styles.badge, { backgroundColor: badge.bg }]}>
          <Text variant="caption" weight="medium" color={badge.text}>{safeStatusLabel}</Text>
        </View>
      </View>

      <View style={styles.rowBetween}>
        <Text weight="semiBold" color={theme.colors.gray600}>{t('home_order_id')}</Text>
        <Text weight="bold" color={theme.colors.gray900}>#{safeOrderCode}</Text>
      </View>

      <View style={styles.storeRow}>
        {safeStoreImage ? (
          <Image source={{ uri: safeStoreImage }} style={styles.storeImage} />
        ) : (
          <View style={[styles.storeImage, styles.storeImageFallback]} />
        )}
        <Text variant="subtitle" weight="bold" color={theme.colors.gray900}>{safeStoreName}</Text>
      </View>

      <View style={styles.addressSection}>
        <Text weight="semiBold" color={theme.colors.gray500}>{t('home_pickup')}</Text>
        <Text weight="bold" color={theme.colors.gray900}>{safePickupAddress}</Text>
      </View>

      <View style={styles.addressSection}>
        <Text weight="semiBold" color={theme.colors.gray500}>{t('home_deliver')}</Text>
        <Text weight="bold" color={theme.colors.gray900}>{safeDeliveryAddress}</Text>
      </View>

      <View style={styles.metaRow}>
        <Text color={theme.colors.gray500}>${safeOrderAmount.toFixed(2)}</Text>
        <Text color={theme.colors.gray500}>{safeTime}</Text>
        <Text color={theme.colors.gray500}>{safeDistanceKm.toFixed(1)} Km</Text>
      </View>

      <View style={styles.rowBetween}>
        <Text weight="medium" color={theme.colors.gray600}>{tab === 'delivered' ? t('home_order_amount') : t('home_payment_method')}</Text>
        <Text weight="semiBold" color={theme.colors.gray900}>
          ${safeOrderAmount.toFixed(1)}{' '}
          {tab !== 'delivered' ? (
            <Text color={theme.colors.gray500}>({safePaymentStatus})</Text>
          ) : null}
        </Text>
      </View>

      {!!safeComment ? (
        <>
          <Text weight="medium" color={theme.colors.gray600}>{t('home_comment')}</Text>
          <Text style={styles.italic} color={theme.colors.gray900}>{safeComment}</Text>
        </>
      ) : null}

      {showAction ? (
        <Button
          label={buttonLabel}
          onPress={handleActionPress}
          disabled={isAssigning || (tab === 'new' && !hasOrderId)}
          containerStyle={styles.button}
          textColor={theme.colors.gray900}
        />
      ) : null}
    </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    gap: 14,
    marginBottom: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 2,
  },
  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  storeImage: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  storeImageFallback: {
    backgroundColor: '#E5E7EB',
  },
  addressSection: {
    gap: 2,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 20,
  },
  italic: {
    fontStyle: 'italic',
  },
  button: {
    height: 54,
    borderRadius: 40,
  },
});
