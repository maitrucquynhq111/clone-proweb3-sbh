import { useQuery } from '@tanstack/react-query';
import { AuthService } from '~app/services/api';

export const USER_INFO = 'user_info';

export const useUserInfoQuery = () => {
  const { isLoading, error, data, isError, isFetching, isLoadingError } = useQuery<AuthInfo, Error>({
    queryKey: [USER_INFO],
    queryFn: AuthService.getUserInfo,
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
