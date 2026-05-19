import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path } from 'react-native-svg';
import Text from './Text';
import Button from './Button';
import { useAppTheme } from '../theme/ThemeProvider';
import type { ThemeColors } from '../theme/colors';
import { useTranslations } from '../localization/LocalizationProvider';
import { RiderHomeOrder, RiderOrderTab } from '../api/riderHomeTypes';
import { useAssignOrderMutation } from '../hooks/useRiderHomeMutations';
import { MainStackParamList } from '../navigation/types';

type Props = {
  order: RiderHomeOrder;
  tab: RiderOrderTab;
};

function statusColors(colors: ThemeColors, label?: string | null) {
  const lower = (label ?? '').toLowerCase();

  if (lower.includes('deliver')) {
    return { bg: colors.emerald100, text: colors.emerald500 };
  }

  if (lower.includes('assign')) {
    return { bg: colors.amber100, text: colors.amber800 };
  }

  return { bg: colors.red100, text: colors.red800 };
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
  const safeStatusLabel =
    (tab === 'processing' ? order.riderStatusLabel ?? order.riderStatus : null)
    ?? order.statusLabel
    ?? order.status
    ?? t('status_unknown');
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

  const badge = statusColors(theme.colors, safeStatusLabel);
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
          <View style={[styles.storeImage, { backgroundColor: theme.colors.gray200 }]} />
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

      <View style={styles.contactRow}>
        <View style={[styles.contactIconWrap, { backgroundColor: theme.colors.primary }]}>
          <CallIcon color={theme.colors.white} />
        </View>
        <View style={[styles.contactIconWrap, { backgroundColor: theme.colors.primary }]}>
          <ChatIcon color={theme.colors.white} />
        </View>
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

function CallIcon({ color }: { color: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6.62 10.79a15.06 15.06 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.31 11.31 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.3 21 3 13.7 3 4a1 1 0 0 1 1-1h3.49a1 1 0 0 1 1 1 11.31 11.31 0 0 0 .57 3.57 1 1 0 0 1-.24 1.02l-2.2 2.2Z"
        fill={color}
      />
    </Svg>
  );
}

function ChatIcon({ color }: { color: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H9l-4.5 4v-4H7a3 3 0 0 1-3-3V5Z"
        fill={color}
      />
    </Svg>
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
  addressSection: {
    gap: 2,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 20,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  contactIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  italic: {
    fontStyle: 'italic',
  },
  button: {
    height: 54,
    borderRadius: 40,
  },
});
