import { useQuery } from '@tanstack/react-query';
import { InventoryService } from '~app/services/api';

export const INVENTORY_CATEGORY = 'inventory-category';

export const useInventoryCategory = ({ type }: { type: string }) => {
  const queryKey = [INVENTORY_CATEGORY, { type }];

  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    { data: PoCategory[]; meta: ResponseMeta },
    Error
  >({
    queryKey,
    queryFn: () => InventoryService.getInventoryCategory({ type }),
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
