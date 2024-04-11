import { useMutation } from '@tanstack/react-query';
import { ProductService } from '~app/services/api';

export const useUpdateSkuMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    PendingSkuInventory,
    Error,
    { id: string; sku: PendingSkuInventory }
  >({
    mutationFn: ({ id, sku }: { id: string; sku: PendingSkuInventory }) => {
      return ProductService.updateSku({ id, sku });
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
