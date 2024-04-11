import { useQuery } from '@tanstack/react-query';
import PaymentService from '~app/services/api/payment';

type Props = { page: number; page_size: number; type?: string; sort?: string };

export const PAYMENT_SOURCE_KEY = 'payment-info/get-list';

export const usePaymentSourcesQuery = ({ page, page_size, type, sort }: Props) => {
  const queryKey = [
    PAYMENT_SOURCE_KEY,
    {
      page,
      page_size,
      type,
      sort,
    },
  ];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    { data: Payment[]; meta: ResponseMeta },
    Error
  >({
    queryKey,
    queryFn: () => PaymentService.getPayments({ type, page, page_size, sort }),
    retry: 0,
    refetchOnMount: false,
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
