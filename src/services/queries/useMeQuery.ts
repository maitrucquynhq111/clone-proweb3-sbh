import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UserService } from '~app/services/api';

export const ME_KEY = 'me';

export const useMeQuery = () => {
  const { isLoading, error, data, isError, isFetching, isLoadingError } = useQuery<AuthInfo, Error>({
    queryKey: [ME_KEY],
    queryFn: UserService.getUserProfile,
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

export const useCacheMeQuery = (): ExpectedAny => {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData([ME_KEY]);

  return { data };
};
