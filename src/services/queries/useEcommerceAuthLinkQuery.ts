import { useQuery } from '@tanstack/react-query';
import { EcommerceService } from '~app/services/api';

const ECOMMERCE_AUTH_LINK_KEY = 'ecommerce-auth-link';

export const useEcommerceAuthLinkQuery = (platform_key: string) => {
  const queryKey = [ECOMMERCE_AUTH_LINK_KEY, platform_key];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery({
    queryKey,
    queryFn: () => EcommerceService.getAuthLink(platform_key),
    enabled: Boolean(platform_key),
    retry: 0,
    refetchOnWindowFocus: false,
    keepPreviousData: false,
  });
  return {
    isLoading,
    isLoadingError,
    isFetching,
    error,
    data: data?.auth_link || '',
    isError,
    queryKey,
    refetch,
  };
};
