import { useQuery } from '@tanstack/react-query';
import { PaymentService } from '~app/services/api';

export const CHECK_TURN_ON_NEOX = 'check_turn_on_neox';

export const useCheckTurnOnNeoXQuery = () => {
  const queryKey = [CHECK_TURN_ON_NEOX];

  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<ExpectedAny, Error>({
    queryKey,
    queryFn: () => PaymentService.checkTurnOnNeoX(),
    retry: 0,
    staleTime: 5 * 1000 * 60,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  let result = false;
  if (data?.length === 0) result = true;
  if (data?.[0]?.json_value?.[0]?.active === true) result = true;

  return {
    isLoading,
    isLoadingError,
    isFetching,
    error,
    data: result,
    isError,
    queryKey,
    refetch,
  };
};
