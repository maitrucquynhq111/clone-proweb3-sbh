import { useQuery } from '@tanstack/react-query';
import { CashbookService, AuthService } from '~app/services/api';

export const CONTACT_TRANSACTION_TOTAL_KEY = 'contact-transaction-total-amount';

export const useGetTransactionTotalAmount = ({ start_time, end_time }: { start_time?: string; end_time?: string }) => {
  const businessId = AuthService.getBusinessId();
  const queryKey = [
    CONTACT_TRANSACTION_TOTAL_KEY,
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
        CashbookService.getTransactionTotalAmount({
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
