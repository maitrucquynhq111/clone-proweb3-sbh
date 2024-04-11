import { useQuery } from '@tanstack/react-query';
import { OrderService } from '~app/services/api';

export const ORDER_DETAIL_KEY = 'orders/detail';

export const useOrderDetailQuery = (id: string, refetchOnMount?: boolean) => {
  const queryKey = [ORDER_DETAIL_KEY, id];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery({
    queryKey,
    queryFn: () => OrderService.getOrder(id),
    enabled: Boolean(id),
    retry: 0,
    refetchOnMount: refetchOnMount,
    refetchOnWindowFocus: false,
    keepPreviousData: false,
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
