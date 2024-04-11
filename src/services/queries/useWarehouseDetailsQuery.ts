import { useQuery } from '@tanstack/react-query';
import { InventoryService } from '~app/services/api';

export const WAREHOUSE_DETAILS_KEY = 'warehouse-details';

export const useWarehouseDetailsQuery = (id: string) => {
  const queryKey = [WAREHOUSE_DETAILS_KEY];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<WarehouseDetail, Error>({
    queryKey,
    queryFn: () => InventoryService.getWarehouseDetail(id),
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
