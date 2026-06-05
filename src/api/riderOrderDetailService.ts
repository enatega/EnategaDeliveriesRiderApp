import apiClient from './apiClient';
import { RiderOrderDetail, RiderOrderDetailEnvelope } from './riderOrderDetailTypes';
import {
  UpdateRiderOrderStatusPayload,
  UpdateRiderOrderStatusResponse,
} from './riderHomeTypes';

const RIDER_HOME_BASE = '/apps/deliveries/rider/home';

const EMPTY_ORDER_DETAIL: RiderOrderDetail = {
  orderId: null,
  orderCode: null,
  status: null,
  statusLabel: null,
  riderStatus: null,
  riderStatusLabel: null,
  orderType: null,
  isInstantOrder: null,
  isConfirmPickup: null,
  storeId: null,
  storeUserId: null,
  storeName: null,
  storeImage: null,
  pickupAddress: null,
  deliveryAddress: null,
  orderAmount: null,
  distanceKm: null,
  paymentMethod: null,
  paymentStatus: null,
  customerComment: null,
  customerName: null,
  customerPhone: null,
  customerId: null,
  chatBoxId: null,
  items: [],
  createdAt: null,
  canAssignMe: null,
  canUpdateStatus: null,
  nextAllowedStatuses: [],
};

function normalizeOrderDetail(
  payload: RiderOrderDetail | RiderOrderDetailEnvelope | null | undefined,
): RiderOrderDetail {
  const root = payload ?? {};
  const level1 = (root as RiderOrderDetailEnvelope).data ?? root;
  const level2 = (level1 as RiderOrderDetailEnvelope).data ?? level1;
  const candidate = level2 as Partial<RiderOrderDetail>;

  return {
    ...EMPTY_ORDER_DETAIL,
    ...candidate,
    isInstantOrder:
      typeof candidate.isInstantOrder === 'boolean'
        ? candidate.isInstantOrder
        : typeof (candidate as { is_instant_order?: unknown }).is_instant_order === 'boolean'
          ? Boolean((candidate as { is_instant_order?: unknown }).is_instant_order)
          : EMPTY_ORDER_DETAIL.isInstantOrder,
    isConfirmPickup:
      typeof candidate.isConfirmPickup === 'boolean'
        ? candidate.isConfirmPickup
        : typeof (candidate as { is_confirm_pickup?: unknown }).is_confirm_pickup === 'boolean'
          ? Boolean((candidate as { is_confirm_pickup?: unknown }).is_confirm_pickup)
          : EMPTY_ORDER_DETAIL.isConfirmPickup,
    items: Array.isArray(candidate.items) ? candidate.items : [],
    nextAllowedStatuses: Array.isArray(candidate.nextAllowedStatuses)
      ? candidate.nextAllowedStatuses.filter((status): status is string => typeof status === 'string')
      : [],
  };
}

export const riderOrderDetailService = {
  getOrderDetail: async (orderId: string) => {
    const response = await apiClient.get<RiderOrderDetail | RiderOrderDetailEnvelope>(
      `${RIDER_HOME_BASE}/orders/${orderId}`,
    );

    return normalizeOrderDetail(response);
  },

  updateOrderStatus: async (orderId: string, payload: UpdateRiderOrderStatusPayload) => {
    return apiClient.patch<UpdateRiderOrderStatusResponse>(
      `${RIDER_HOME_BASE}/orders/${orderId}/status`,
      payload,
    );
  },
};
