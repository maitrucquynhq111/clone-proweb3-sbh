import { useQuery } from '@tanstack/react-query';
import { PaymentService } from '~app/services/api';

export const LINKED_BANKS = 'linked_banks';

export const useLinkedBanksQuery = () => {
  const queryKey = [LINKED_BANKS];

  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<Array<LinkedBank>, Error>({
    queryKey,
    queryFn: PaymentService.getLinkedBanks,
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
