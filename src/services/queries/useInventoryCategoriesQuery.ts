import { useQuery } from '@tanstack/react-query';
import { AuthService, InventoryService } from '~app/services/api';

const INVENTORY_CATEGORIES_KEY = 'inventory-categories';

export const useInventoryCategoriesQuery = () => {
  const business_id = AuthService.getBusinessId();
  const queryKey = [
    INVENTORY_CATEGORIES_KEY,
    {
      business_id,
    },
  ];

  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    { data: InventoryCategory[]; meta: ResponseMeta },
    Error
  >({
    queryKey,
    queryFn: () => InventoryService.getInventoryCategories(),
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
