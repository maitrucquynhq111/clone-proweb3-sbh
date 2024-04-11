import { useQuery } from '@tanstack/react-query';
import { PaymentService } from '~app/services/api';

export const E_PAYMENT_METHOD_KEY = 'e_payment_method';

export const useEPaymentMethodsQuery = (payment_type?: string) => {
  const queryKey = [E_PAYMENT_METHOD_KEY, payment_type];

  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    Array<EPaymentMethod>,
    Error
  >({
    queryKey,
    queryFn: () => PaymentService.getEPaymentMethods(payment_type),
    retry: 0,
    staleTime: 5 * 1000 * 60,
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
