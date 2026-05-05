export type RiderOrderItem = {
  productId: string | null;
  name: string | null;
  image: string | null;
  quantity: number | null;
  unitPrice: number | null;
  totalPrice: number | null;
  selectedOptions: string | null;
};

export type RiderOrderDetail = {
  orderId: string | null;
  orderCode: string | null;
  status: string | null;
  statusLabel: string | null;
  orderType: string | null;
  storeName: string | null;
  storeImage: string | null;
  pickupAddress: string | null;
  deliveryAddress: string | null;
  orderAmount: number | null;
  distanceKm: number | null;
  paymentMethod: string | null;
  paymentStatus: string | null;
  customerComment: string | null;
  customerName: string | null;
  customerPhone: string | null;
  items: RiderOrderItem[];
  createdAt: string | null;
  canAssignMe: boolean | null;
  canUpdateStatus: boolean | null;
  nextAllowedStatuses: string[];
};

export type RiderOrderDetailEnvelope = {
  data?: RiderOrderDetail | RiderOrderDetailEnvelope;
};
