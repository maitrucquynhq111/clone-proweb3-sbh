import { useQuery } from '@tanstack/react-query';
import { ProductService, AuthService } from '~app/services/api';
import { buildSortByQuery } from '~app/utils/helpers';

export const PRODUCTS_KEY = 'products';

const convertSort = ({ id, direction }: SorterProps) => {
  if (id === 'normal_price' && direction === 'asc') return 'low_price';
  else if (id === 'normal_price' && direction === 'desc') return 'high_price';
  else if (id === 'name' && direction === 'asc') return 'a-z';
  else if (id === 'name' && direction === 'desc') return 'z-a';
  else if (id === 'can_pick_quantity' && direction === 'asc') return 'can_pick_quantity asc';
  else if (id === 'can_pick_quantity' && direction === 'desc') return 'can_pick_quantity desc';
  else if (id === 'created_at' && direction === 'desc') return 'created_at desc';
  else return '';
};

export const useProductsQuery = ({
  page,
  pageSize,
  name,
  orderBy,
  category_ids,
  enabled,
  refetchOnMount,
}: ExpectedAny) => {
  const businessId = AuthService.getBusinessId();
  const sort = buildSortByQuery(orderBy);
  const queryKey = [
    PRODUCTS_KEY,
    {
      page,
      pageSize,
      name,
      category_ids,
      ...sort,
      businessId,
    },
  ];

  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    { data: Product[]; meta: ResponseMeta },
    Error
  >({
    queryKey,
    queryFn: () =>
      ProductService.getProducts({
        page,
        pageSize,
        sort: (orderBy && convertSort(orderBy)) || '',
        name,
        category_ids,
      }),
    retry: 0,
    refetchOnWindowFocus: false,
    keepPreviousData: false,
    refetchOnMount,
    enabled,
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
