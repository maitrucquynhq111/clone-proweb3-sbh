import { useQuery } from '@tanstack/react-query';
import { PaymentService } from '~app/services/api';

export const PAYMENT_INFO_KEY = 'payment_info';

export const usePaymentsInfo = () => {
  const { isLoading, error, data, isError, isFetching, isLoadingError } = useQuery<PaymentInfo[], Error>({
    queryKey: [PAYMENT_INFO_KEY],
    queryFn: PaymentService.getPaymentsInfo,
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    isLoadingError,
    isFetching,
    isLoading,
    error,
    data,
    isError,
  };
};
