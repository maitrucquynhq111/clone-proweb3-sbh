import { useQuery } from '@tanstack/react-query';
import { OrderService } from '~app/services/api';

export const ORDER_TRACKING_KEY = 'order-tracking';

export const useOrderTrackingQuery = (id: string) => {
  const queryKey = [ORDER_TRACKING_KEY, id];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery({
    queryKey,
    queryFn: () => OrderService.getOrderTracking(id),
    enabled: Boolean(id),
    retry: 0,
    refetchOnWindowFocus: false,
    keepPreviousData: false,
  });
  return {
    isLoading,
    isLoadingError,
    isFetching,
    error,
    data: data || [],
    isError,
    queryKey,
    refetch,
  };
};
