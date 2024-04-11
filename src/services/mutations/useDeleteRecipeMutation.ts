import { useMutation } from '@tanstack/react-query';
import { IngredientService } from '~app/services/api';

export const useDeleteRecipeMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<ExpectedAny, Error, string>({
    mutationFn: (id: string) => {
      return IngredientService.deleteRecipe(id);
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
