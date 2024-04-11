import { useQuery } from '@tanstack/react-query';
import { EcommerceService } from '~app/services/api';

const SHOPEE_ACCESS_TOKEN_KEY = 'shopee-access-token';

export const useShopeeAccessTokenQuery = ({ code, shop_id }: { code: string; shop_id: string }) => {
  const queryKey = [SHOPEE_ACCESS_TOKEN_KEY, code, shop_id];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery({
    queryKey,
    queryFn: () => EcommerceService.getShopeeAccessToken(code, shop_id),
    enabled: !!code && !!shop_id,
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
