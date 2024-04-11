import { useQuery } from '@tanstack/react-query';
import { IngredientService } from '~app/services/api';

export const RECIPE_DETAIL_KEY = 'recipe/detail';

export const useRecipeDetailQuery = (id: string) => {
  const queryKey = [RECIPE_DETAIL_KEY, id];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<RecipeDetail>({
    queryKey,
    queryFn: () => IngredientService.getRecipeDetail(id),
    retry: 0,
    refetchOnWindowFocus: false,
    keepPreviousData: false,
  });

  return {
    isLoading,
    isLoadingError,
    isFetching,
    error,
    data: data,
    isError,
    queryKey,
    refetch,
  };
};
