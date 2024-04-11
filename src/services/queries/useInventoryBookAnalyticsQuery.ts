import { useQuery } from '@tanstack/react-query';
import { InventoryService } from '~app/services/api';

export const INVENTORY_BOOK_ANALYTICS_KEY = 'inventory-book-analytics';

export const useInventoryBookAnalyticsQuery = ({ start_time, end_time }: ExpectedAny) => {
  const queryKey = [INVENTORY_BOOK_ANALYTICS_KEY, { start_time, end_time }];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    InventoryBookAnalytics,
    Error
  >({
    queryKey,
    queryFn: () => InventoryService.getInventoryBookAnalytics({ start_time, end_time }),
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
