export enum RiderDeliveryProgressStatus {
  ASSIGNED = 'assigned',
  HEADING_TO_STORE = 'heading_to_store',
  ARRIVED_AT_STORE = 'arrived_at_store',
  WAITING_FOR_ORDER = 'waiting_for_order',
  PICKED_UP = 'picked_up',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  ARRIVED_AT_CUSTOMER = 'arrived_at_customer',
  DELIVERED = 'delivered',
}

export const DELIVERY_PROGRESS_ORDER: RiderDeliveryProgressStatus[] = [
  RiderDeliveryProgressStatus.ASSIGNED,
  RiderDeliveryProgressStatus.HEADING_TO_STORE,
  RiderDeliveryProgressStatus.ARRIVED_AT_STORE,
  RiderDeliveryProgressStatus.WAITING_FOR_ORDER,
  RiderDeliveryProgressStatus.PICKED_UP,
  RiderDeliveryProgressStatus.OUT_FOR_DELIVERY,
  RiderDeliveryProgressStatus.ARRIVED_AT_CUSTOMER,
  RiderDeliveryProgressStatus.DELIVERED,
];

const API_STATUS_TO_PROGRESS: Record<string, RiderDeliveryProgressStatus> = {
  rider_assigned: RiderDeliveryProgressStatus.ASSIGNED,
  heading_to_store: RiderDeliveryProgressStatus.HEADING_TO_STORE,
  arrived_at_store: RiderDeliveryProgressStatus.ARRIVED_AT_STORE,
  waiting_for_order: RiderDeliveryProgressStatus.WAITING_FOR_ORDER,
  picked_up: RiderDeliveryProgressStatus.PICKED_UP,
  out_for_delivery: RiderDeliveryProgressStatus.OUT_FOR_DELIVERY,
  arrived_at_customer: RiderDeliveryProgressStatus.ARRIVED_AT_CUSTOMER,
  delivered: RiderDeliveryProgressStatus.DELIVERED,
};

export function resolveProgressStatus(status?: string | null): RiderDeliveryProgressStatus {
  if (!status) {
    return RiderDeliveryProgressStatus.ASSIGNED;
  }

  return API_STATUS_TO_PROGRESS[status] ?? RiderDeliveryProgressStatus.ASSIGNED;
}
