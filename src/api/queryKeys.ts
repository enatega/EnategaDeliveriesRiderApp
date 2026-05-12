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

export const riderWalletKeys = {
  all: ['riderWallet'] as const,
  balance: () => [...riderWalletKeys.all, 'balance'] as const,
  historyAll: () => [...riderWalletKeys.all, 'history'] as const,
  history: (transactionType: 'deposit' | 'withdrawal' | 'all') =>
    [...riderWalletKeys.historyAll(), transactionType] as const,
};
