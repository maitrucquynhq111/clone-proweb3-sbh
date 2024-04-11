import { useQuery } from '@tanstack/react-query';
import { IngredientService } from '~app/services/api';

export const PRODUCTS_RECIPE_KEY = 'products_recipe';

export const useProductRecipeQuery = ({ page = 1, pageSize = 10, search }: ExpectedAny) => {
  const queryKey = [
    PRODUCTS_RECIPE_KEY,
    {
      page,
      pageSize,
      search,
    },
  ];

  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    { data: ProductRecipe[]; meta: ResponseMeta },
    Error
  >({
    queryKey,
    queryFn: () =>
      IngredientService.getProductsRecipe({
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
