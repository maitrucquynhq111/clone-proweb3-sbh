import { useMutation } from '@tanstack/react-query';
import { InventoryService } from '~app/services/api';

export const useUpdateStockTaking = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    ExpectedAny,
    Error,
    { id: string; body: StockTakingBody }
  >({
    mutationFn: ({ id, body }: { id: string; body: StockTakingBody }) => {
      return InventoryService.updateStockTaking(id, body);
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
