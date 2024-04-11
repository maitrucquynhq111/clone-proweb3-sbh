import { useQuery } from '@tanstack/react-query';
import { CashbookService, AuthService } from '~app/services/api';

export const CASH_TOTAL_KEY = 'cash-total-amount';

export const useGetCashbookTotalAmount = ({ start_time, end_time }: { start_time: string; end_time: string }) => {
  const businessId = AuthService.getBusinessId();
  const queryKey = [
    CASH_TOTAL_KEY,
    {
      start_time,
      end_time,
      businessId,
    },
  ];

  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<CashbookTotalAmount, Error>(
    {
      queryKey,
      queryFn: () =>
        CashbookService.getCashbookTotalAmount({
          start_time,
          end_time,
        }),
      retry: 0,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    },
  );

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
