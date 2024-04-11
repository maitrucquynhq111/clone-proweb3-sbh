import { useQuery } from '@tanstack/react-query';
import { AuthService, ProductService } from '~app/services/api';
import { buildSortByQuery } from '~app/utils/helpers';

export const INGREDIENTS_KEY = 'ingredients';

export const useGetIngredientsQuery = ({ name, page, pageSize, orderBy, enabled, keepPreviousData }: ExpectedAny) => {
  const businessId = AuthService.getBusinessId();
  const sort = buildSortByQuery(orderBy);
  const queryKey = [
    INGREDIENTS_KEY,
    {
      businessId,
      name,
      page,
      pageSize,
      ...sort,
    },
  ];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    { data: Ingredient[]; meta: ResponseMeta },
    Error
  >({
    queryKey,
    queryFn: () =>
      ProductService.getIngredients({
        name,
        page,
        pageSize,
        sort: orderBy ? `${orderBy.id} ${orderBy.direction}` : '',
      }),
    retry: 0,
    refetchOnWindowFocus: false,
    keepPreviousData: keepPreviousData,
    enabled,
  });

  return {
    isLoading,
    isLoadingError,
    isFetching,
    error,
    data,
    isError,
    queryKey,
    refetch,
  };
};
