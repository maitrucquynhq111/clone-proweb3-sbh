import { useMutation } from '@tanstack/react-query';
import { InventoryService } from '~app/services/api';

export const usePurchaseOrderIngredientMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    ExpectedAny,
    Error,
    PurchaseOrderIngredients
  >({
    mutationFn: (data: PurchaseOrderIngredients) => {
      return InventoryService.purchaseOrderIngredients(data);
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
