import { useQuery } from '@tanstack/react-query';
import { EcommerceService } from '~app/services/api';

const LAZADA_ACCESS_TOKEN_KEY = 'lazada-access-token';

export const useLazadaAccessTokenQuery = ({ code, enabled }: { code: string; enabled: boolean }) => {
  const queryKey = [LAZADA_ACCESS_TOKEN_KEY, code];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery({
    queryKey,
    queryFn: () => EcommerceService.getLazadaAccessToken(code),
    enabled: !!code && enabled,
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
