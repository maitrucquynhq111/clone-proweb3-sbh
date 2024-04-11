import { useQuery } from '@tanstack/react-query';
import { CashbookService, AuthService } from '~app/services/api';

export const CASHBOOK_KEY = 'cashbook';

export const useCashBookQuery = ({
  page,
  pageSize,
  start_time,
  end_time,
  search,
  transaction_type,
  status,
  orderBy,
}: ExpectedAny) => {
  const businessId = AuthService.getBusinessId();
  const queryKey = [
    CASHBOOK_KEY,
    {
      page,
      pageSize,
      start_time,
      end_time,
      search,
      transaction_type,
      status,
      sort: orderBy,
      businessId,
    },
  ];

  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    { data: Cashbook[]; meta: ResponseMeta },
    Error
  >({
    queryKey,
    queryFn: () =>
      CashbookService.getCashbooks({
        page,
        pageSize,
        start_time,
        end_time,
        search,
        transaction_type,
        status,
        sort: orderBy,
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
