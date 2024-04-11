import { useQuery } from '@tanstack/react-query';
import { IngredientService } from '~app/services/api';

export const RECIPES_KEY = 'recipes';

export const useRecipesQuery = ({ page = 1, pageSize = 10, search }: ExpectedAny) => {
  const queryKey = [
    RECIPES_KEY,
    {
      page,
      pageSize,
      search,
    },
  ];

  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    { data: Recipe[]; meta: ResponseMeta },
    Error
  >({
    queryKey,
    queryFn: () =>
      IngredientService.getRecipes({
        page,
        pageSize,
        search,
      }),
    retry: 0,
    refetchOnWindowFocus: false,
    keepPreviousData: false,
  });

  return {
    isLoading,
    isLoadingError,
    isFetching,
    error,
    data: { data: data?.data || [], meta: data?.meta },
    isError,
    queryKey,
    refetch,
  };
};
