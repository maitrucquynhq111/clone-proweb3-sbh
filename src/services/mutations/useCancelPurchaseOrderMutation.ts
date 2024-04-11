import { useMutation } from '@tanstack/react-query';
import { InventoryService } from '~app/services/api';

export const useCancelPurchaseOrderMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    Order,
    Error,
    { id: string; body: PendingCancelPurchaseOrder }
  >({
    mutationFn: ({ id, body }: { id: string; body: PendingCancelPurchaseOrder }) => {
      return InventoryService.cancelPurchaseOrder(id, body);
    },
  });

  return {
    isLoading,
    isSuccess,
    error,
    data,
    isError,
    mutate,
    mutateAsync,
  };
};
