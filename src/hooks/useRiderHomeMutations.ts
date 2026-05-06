import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ApiError } from '../api/apiClient';
import { riderHomeService } from '../api/riderHomeService';
import {
  AssignOrderResponse,
  UpdateRiderOrderStatusPayload,
  UpdateRiderOrderStatusResponse,
} from '../api/riderHomeTypes';
import { riderHomeKeys } from '../api/queryKeys';
import { riderOrderDetailService } from '../api/riderOrderDetailService';

export function useAssignOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation<AssignOrderResponse, ApiError, string>({
    mutationFn: riderHomeService.assignOrderToCurrentRider,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: riderHomeKeys.summary() }),
        queryClient.invalidateQueries({ queryKey: riderHomeKeys.ordersAll() }),
      ]);
    },
  });
}

export function useUpdateRiderOrderStatusMutation(orderId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateRiderOrderStatusResponse,
    ApiError,
    UpdateRiderOrderStatusPayload
  >({
    mutationFn: (payload) => riderOrderDetailService.updateOrderStatus(orderId, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: riderHomeKeys.summary() }),
        queryClient.invalidateQueries({ queryKey: riderHomeKeys.ordersAll() }),
        queryClient.invalidateQueries({ queryKey: riderHomeKeys.orderDetail(orderId) }),
      ]);
    },
  });
}
