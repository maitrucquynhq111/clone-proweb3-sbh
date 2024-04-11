import { useQuery } from '@tanstack/react-query';
import { OrderService, AuthService } from '~app/services/api';

export const ORDERS_ANALYTICS_KEY = 'orders-analytics';

export const useOrdersAnalyticsQuery = ({
  start_time,
  end_time,
  staff_creator_ids,
  payment_status,
  create_method,
  payment_method,
  search,
}: {
  start_time: string;
  end_time: string;
  staff_creator_ids: string[];
  payment_status: string[];
  create_method: string[];
  payment_method: string[];
  search: string;
}) => {
  const businessId = AuthService.getBusinessId() || '';
  const queryKey = [
    ORDERS_ANALYTICS_KEY,
    {
      businessId,
      start_time,
      end_time,
      staff_creator_ids,
      payment_status,
      create_method,
      payment_method,
      search,
    },
  ];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<OrderStateAnalytics>({
    queryKey,
    queryFn: () =>
      OrderService.getOrderAnalysis({
        business_id: businessId,
        start_time,
        end_time,
        search,
        staff_creator_ids,
        payment_status,
        create_method,
        payment_method,
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
