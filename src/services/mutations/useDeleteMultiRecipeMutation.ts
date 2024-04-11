import { useMutation } from '@tanstack/react-query';
import { IngredientService } from '~app/services/api';

export const useDeleteMultiRecipeMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<ExpectedAny, Error, string[]>(
    {
      mutationFn: (product_ids: string[]) => {
        return IngredientService.deleteMultiRecipe(product_ids);
      },
    },
  );

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
