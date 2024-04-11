import { useMutation } from '@tanstack/react-query';
import { ProductService } from '~app/services/api';

export const useUpdateIngredientMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    Ingredient,
    Error,
    PendingIngredient
  >({
    mutationFn: (data: PendingIngredient) => {
      return ProductService.updateIngredient(data);
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
