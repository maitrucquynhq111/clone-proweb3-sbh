import { useQuery } from '@tanstack/react-query';
import { CashbookService } from '~app/services/api';

const CASHBOOK_DETAIL_KEY = 'products/detail';

export const useCashbookDetailQuery = (id: string) => {
  const queryKey = [CASHBOOK_DETAIL_KEY, id];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery({
    queryKey,
    queryFn: () => CashbookService.getCashbook(id),
    enabled: Boolean(id),
    retry: 0,
    refetchOnWindowFocus: false,
    keepPreviousData: false,
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
