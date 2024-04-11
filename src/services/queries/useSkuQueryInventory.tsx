import { useQuery } from '@tanstack/react-query';
import { ProductService, AuthService } from '~app/services/api';

export const SKUS_INVENTORY_KEY = 'skus-inventory';

const formatDataTable = (data: SkuInventory[], isTable: boolean) => {
  if (!isTable) return data;
  return data.map((item) => {
    if (item.sku_type === 'non_stock') return { ...item, total_quantity: null, inventory_value: null, action: null };
    return { ...item, inventory_value: item.total_quantity * item.historical_cost, action: true };
  });
};

export const useSkuQueryInventory = ({
  page,
  pageSize,
  search,
  orderBy,
  category_ids,
  isTable = false,
}: ExpectedAny) => {
  const businessId = AuthService.getBusinessId();
  const queryKey = [
    SKUS_INVENTORY_KEY,
    {
      page,
      page_size: pageSize,
      search,
      category_ids,
      sort: orderBy,
      businessId,
    },
  ];

  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    { data: SkuInventory[]; meta: ResponseMeta },
    Error
  >({
    queryKey,
    queryFn: () =>
      ProductService.getSkusInventory({
        page,
        pageSize,
        sort: orderBy,
        search,
        category_ids,
      }),
    retry: 0,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  return {
    isLoading,
    isLoadingError,
    isFetching,
    error,
    data: { data: formatDataTable(data?.data || [], isTable), meta: data?.meta },
    isError,
    queryKey,
    refetch,
  };
};
