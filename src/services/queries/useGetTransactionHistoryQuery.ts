import { useQuery } from '@tanstack/react-query';
import { CashbookService, AuthService } from '~app/services/api';

export const TRANSACTION_HISTORY = 'transaction-history';

export const useGetTransactionHistoryQuery = ({ pageSize, start_time, page, end_time, search }: ExpectedAny) => {
  const businessId = AuthService.getBusinessId();
  const queryKey = [
    TRANSACTION_HISTORY,
    {
      pageSize,
      page,
      start_time,
      end_time,
      search,
      businessId,
    },
  ];

  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    { data: Cashbook[]; meta: ResponseMeta },
    Error
  >({
    queryKey,
    queryFn: () =>
      CashbookService.getTransactions({
        pageSize,
        start_time,
        end_time,
        search,
        page,
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
