import { useQuery } from '@tanstack/react-query';
import { OrderService, AuthService } from '~app/services/api';
import { OrderStatusType } from '~app/utils/constants';

export const ORDERS_KEY = 'orders';

export const useOrdersQuery = ({
  page,
  pageSize,
  search,
  state,
  start_time,
  end_time,
  orderBy,
  staff_creator_ids,
  payment_status,
  create_method,
  payment_method,
  contact_id,
  enabled,
}: ExpectedAny) => {
  const businessId = AuthService.getBusinessId();
  if (state === OrderStatusType.COMPLETE || state === OrderStatusType.CANCEL) {
    orderBy = 'updated_order_at desc';
  }

  const queryKey = [
    ORDERS_KEY,
    {
      page,
      pageSize,
      state,
      search,
      sort: orderBy,
      start_time,
      end_time,
      businessId,
      staff_creator_ids,
      payment_status,
      create_method,
      payment_method,
      contact_id,
    },
  ];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    { data: Order[]; meta: ResponseMeta },
    Error
  >({
    queryKey,
    queryFn: () =>
      OrderService.getOrders({
        page,
        pageSize,
        state,
        start_time,
        end_time,
        sort: orderBy,
        search,
        staff_creator_ids,
        payment_status,
        create_method,
        payment_method,
        contact_id,
      }),
    retry: 0,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    enabled,
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
