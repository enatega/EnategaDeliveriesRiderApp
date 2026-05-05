import React, { useMemo, useState } from 'react';
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
import Svg, { Path } from 'react-native-svg';
import Map from '../components/Map';
import SwipeableBottomSheet from '../components/SwipeableBottomSheet';
import Text from '../components/Text';
import Button from '../components/Button';
import { MainStackParamList } from '../navigation/types';
import { useAppTheme } from '../theme/ThemeProvider';
import { useTranslations } from '../localization/LocalizationProvider';
import { useRiderOrderDetailQuery } from '../hooks/useRiderOrderDetailQuery';
import OrderDetailTopBar from './orderDetail/components/OrderDetailTopBar';
import OrderSummarySection from './orderDetail/components/OrderSummarySection';
import OrderPaymentSection from './orderDetail/components/OrderPaymentSection';
import OrderItemsSection from './orderDetail/components/OrderItemsSection';
import DeliveryProgressSection from './orderDetail/components/DeliveryProgressSection';

type Props = NativeStackScreenProps<MainStackParamList, 'ProcessingOrderDetail'>;

const FALLBACK_PICKUP = { latitude: 33.6844, longitude: 73.0479 };
const FALLBACK_DELIVERY = { latitude: 33.6952, longitude: 73.0689 };

export default function ProcessingOrderDetailScreen({ route, navigation }: Props) {
  const { theme } = useAppTheme();
  const { t } = useTranslations('app');
  const { orderId } = route.params;
  const detailQuery = useRiderOrderDetailQuery(orderId);
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
          title={detailQuery.data?.statusLabel ?? t('order_assigned_title')}
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
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetContent}>
            <OrderSummarySection order={detailQuery.data} />
            <OrderPaymentSection order={detailQuery.data} />
            <OrderItemsSection order={detailQuery.data} />
            <DeliveryProgressSection status={detailQuery.data.status} />
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
