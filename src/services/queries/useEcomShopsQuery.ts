import { useQuery } from '@tanstack/react-query';
import { AuthService, EcommerceService } from '~app/services/api';

export const ECOM_SHOPS_KEY = 'ecom-shops';

export const useEcomShopsQuery = ({ page, pageSize, platform_key }: ExpectedAny) => {
  const businessId = AuthService.getBusinessId();
  const queryKey = [
    ECOM_SHOPS_KEY,
    {
      page,
      pageSize,
      platform_key,
      businessId,
    },
  ];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    { data: EcomShop[]; meta: ResponseMeta },
    Error
  >({
    queryKey,
    queryFn: () =>
      EcommerceService.getEcomShops({
        page,
        pageSize,
        platform_key,
      }),
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
