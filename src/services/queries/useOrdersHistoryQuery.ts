import { useQuery } from '@tanstack/react-query';
import { AuthService, ChatService } from '~app/services/api';

export const ORDERS_HISTORY_KEY = 'orders-history';

export const useOrdersHistoryQuery = ({ page, pageSize, search, buyer_id, seller_id }: OrdersHistoryParams) => {
  const businessId = AuthService.getBusinessId();
  const queryKey = [
    ORDERS_HISTORY_KEY,
    {
      page,
      pageSize,
      search,
      businessId,
      buyer_id,
      seller_id,
    },
  ];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    { data: OrderHistory[]; meta: ResponseMeta },
    Error
  >({
    queryKey,
    queryFn: () =>
      ChatService.getOrdersHistory({
        page,
        pageSize,
        search,
        buyer_id,
        seller_id,
      }),
    retry: 0,
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
