import { useMutation } from '@tanstack/react-query';
import { InventoryService } from '~app/services/api';

export const useCreateStockTaking = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    ExpectedAny,
    Error,
    StockTakingBody
  >({
    mutationFn: (body: StockTakingBody) => {
      return InventoryService.createStockTaking(body);
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
