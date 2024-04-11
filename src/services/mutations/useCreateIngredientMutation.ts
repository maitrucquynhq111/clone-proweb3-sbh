import { useMutation } from '@tanstack/react-query';
import { ProductService } from '~app/services/api';

export const useCreateIngredientMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    Ingredient,
    Error,
    PendingIngredient
  >({
    mutationFn: (data: PendingIngredient) => {
      return ProductService.createIngredient(data);
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
