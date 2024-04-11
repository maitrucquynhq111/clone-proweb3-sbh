import { useQuery } from '@tanstack/react-query';
import { ProductService, AuthService } from '~app/services/api';
import { buildSortByQuery } from '~app/utils/helpers';

export const POS_PRODUCTS_KEY = 'pos-products';

const convertSort = ({ id, direction }: SorterProps) => {
  if (id === 'normal_price' && direction === 'asc') return 'low_price';
  else if (id === 'normal_price' && direction === 'desc') return 'high_price';
  else if (id === 'name' && direction === 'asc') return 'a-z';
  else if (id === 'name' && direction === 'desc') return 'z-a';
  else if (id === 'can_pick_quantity' && direction === 'asc') return 'can_pick_quantity asc';
  else if (id === 'can_pick_quantity' && direction === 'desc') return 'can_pick_quantity desc';
};

export const usePosProductsQuery = ({
  page,
  pageSize,
  name,
  orderBy,
  category_ids,
  keepPreviousData = false,
}: ExpectedAny) => {
  const businessId = AuthService.getBusinessId();
  const sort = buildSortByQuery(orderBy);
  const queryKey = [
    POS_PRODUCTS_KEY,
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
      ProductService.getPosProducts({
        page,
        pageSize,
        sort: (orderBy && convertSort(orderBy)) || '',
        name,
        category_ids,
      }),
    retry: 0,
    refetchOnWindowFocus: false,
    keepPreviousData: keepPreviousData,
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
