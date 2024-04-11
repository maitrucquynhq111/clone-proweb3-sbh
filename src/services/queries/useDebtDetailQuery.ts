import { useQuery } from '@tanstack/react-query';
import { ContactService } from '~app/services/api';

const DEBT_DETAIL_KEY = 'debt/detail';

export const useDebtDetailQuery = (id: string) => {
  const queryKey = [DEBT_DETAIL_KEY, id];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery({
    queryKey,
    queryFn: () => ContactService.getDebtDetail(id),
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
