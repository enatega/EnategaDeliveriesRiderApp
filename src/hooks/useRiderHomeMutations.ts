import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ApiError } from '../api/apiClient';
import { riderHomeService } from '../api/riderHomeService';
import { AssignOrderResponse } from '../api/riderHomeTypes';
import { riderHomeKeys } from '../api/queryKeys';

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
