import { useQuery } from '@tanstack/react-query';
import { EcommerceService } from '~app/services/api';

const TIKTOK_ACCESS_TOKEN_KEY = 'tiktok-access-token';

export const useTiktokAccessTokenQuery = ({ code, state }: { code: string; state: string }) => {
  const queryKey = [TIKTOK_ACCESS_TOKEN_KEY, code, state];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery({
    queryKey,
    queryFn: () => EcommerceService.getTiktokAccessToken(code, state),
    enabled: !!code && !!state,
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
