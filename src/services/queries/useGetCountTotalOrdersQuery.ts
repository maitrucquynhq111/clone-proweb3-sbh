import { useQuery } from '@tanstack/react-query';
import { ChatService } from '~app/services/api';

export const COUNT_TOTAL_ORDERS_KEY = 'count-total-orders';

export const useGetCountTotalOrdersQuery = ({
  buyer_id,
  seller_id,
  enabled = true,
}: CountTotalOrdersParams & { enabled?: boolean }) => {
  const queryKey = [COUNT_TOTAL_ORDERS_KEY, { buyer_id, seller_id }];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<CountTotalOrders, Error>({
    queryKey,
    queryFn: () => ChatService.getCountTotalOrders({ buyer_id, seller_id }),
    retry: 0,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    enabled: enabled && !!buyer_id && !!seller_id,
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
