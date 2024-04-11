import { useQuery } from '@tanstack/react-query';
import { InventoryService, AuthService } from '~app/services/api';

export const INVENTORY_KEY = 'inventory';

export const useInventoryQuery = ({
  page,
  pageSize,
  start_time,
  end_time,
  search,
  type,
  orderBy,
  category_name,
  staff_id,
}: ExpectedAny) => {
  const businessId = AuthService.getBusinessId();
  const queryKey = [
    INVENTORY_KEY,
    {
      page,
      pageSize,
      start_time,
      end_time,
      search,
      sort: orderBy,
      type,
      businessId,
      category_name,
      staff_id,
    },
  ];

  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    { data: Inventory[]; meta: ResponseMeta },
    Error
  >({
    queryKey,
    queryFn: () =>
      InventoryService.getInventory({
        page,
        pageSize,
        start_time,
        end_time,
        search,
        sort: orderBy,
        type,
        category_name,
        staff_id,
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
    data,
    isError,
    queryKey,
    refetch,
  };
};
