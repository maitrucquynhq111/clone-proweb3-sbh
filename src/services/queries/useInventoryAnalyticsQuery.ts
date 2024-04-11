import { useQuery } from '@tanstack/react-query';
import { InventoryService } from '~app/services/api';

export const INVENTORY_ANALYTICS_KEY = 'inventory-analytics';

export const useInventoryAnalyticsQuery = () => {
  const queryKey = [INVENTORY_ANALYTICS_KEY];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<InventoryAnalytics, Error>({
    queryKey,
    queryFn: () => InventoryService.getInventoryAnalytics(),
    retry: 0,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  return {
    isLoading,
    isLoadingError,
    isFetching,
    error,
    data: data,
    isError,
    queryKey,
    refetch,
  };
};
