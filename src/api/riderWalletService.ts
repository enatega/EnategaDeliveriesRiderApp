import apiClient from './apiClient';
import {
  RiderWalletBalanceResponse,
  RiderWalletHistoryQueryParams,
  RiderWalletHistoryResponse,
  RiderWalletWithdrawPayload,
  RiderWalletWithdrawResponse,
} from './riderWalletTypes';

const BASE_PATH = '/api/v1/apps/deliveries/rider/wallet';

export const riderWalletService = {
  getBalance: () => apiClient.get<RiderWalletBalanceResponse>(`${BASE_PATH}/balance`),

  getHistory: (params: RiderWalletHistoryQueryParams) =>
    apiClient.get<RiderWalletHistoryResponse>(`${BASE_PATH}/history`, params),

  createWithdrawRequest: (payload: RiderWalletWithdrawPayload) =>
    apiClient.post<RiderWalletWithdrawResponse>(`${BASE_PATH}/withdraw`, payload),
};
