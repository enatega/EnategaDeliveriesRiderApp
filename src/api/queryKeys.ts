export const authKeys = {
  all: ['auth'] as const,
  session: () => [...authKeys.all, 'session'] as const,
  me: () => [...authKeys.all, 'me'] as const,
};

export const riderHomeKeys = {
  all: ['riderHome'] as const,
  summary: () => [...riderHomeKeys.all, 'summary'] as const,
  ordersAll: () => [...riderHomeKeys.all, 'orders'] as const,
  orderDetail: (orderId: string) => [...riderHomeKeys.all, 'orderDetail', orderId] as const,
  orders: (tab: 'new' | 'processing' | 'delivered', search: string) =>
    [...riderHomeKeys.all, 'orders', tab, search] as const,
};

export const earningsKeys = {
  all: ['earnings'] as const,
  summary: (groupBy: 'day' | 'week' | 'month', recentLimit: number) =>
    [...earningsKeys.all, 'summary', groupBy, recentLimit] as const,
  activities: (page: number, limit: number) =>
    [...earningsKeys.all, 'activities', page, limit] as const,
  activityDeliveries: (activityDate: string) =>
    [...earningsKeys.all, 'activityDeliveries', activityDate] as const,
};
