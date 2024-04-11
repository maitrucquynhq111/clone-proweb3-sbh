import { useMutation } from '@tanstack/react-query';
import { IngredientService } from '~app/services/api';

export const useCreateRecipe = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    ExpectedAny,
    Error,
    BodyRecipe
  >({
    mutationFn: (data: BodyRecipe) => {
      return IngredientService.createRecipe(data);
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
