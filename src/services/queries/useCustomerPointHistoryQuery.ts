import { useQuery } from '@tanstack/react-query';
import { AuthService, ContactService } from '~app/services/api';

export const CUSTOMER_POINT_HISTORY_KEY = 'customer_point_history';

export const useCustomerPointHistoryQuery = ({ page, page_size, contact_id }: ParamsFetchContact) => {
  const business_id = AuthService.getBusinessId();
  const queryKey = [
    CUSTOMER_POINT_HISTORY_KEY,
    {
      page,
      page_size,
      contact_id,
      business_id,
    },
  ];

  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    { data: CustomerPointHistory[]; meta: ResponseMeta },
    Error
  >({
    queryKey,
    queryFn: () =>
      ContactService.getCustomerPointHistory({
        page,
        page_size,
        contact_id,
      }),
    retry: 0,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    enabled: !!contact_id,
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
