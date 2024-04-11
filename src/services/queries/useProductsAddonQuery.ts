import { useQuery } from '@tanstack/react-query';
import { ProductService, AuthService } from '~app/services/api';

export const PRODUCTS_ADDON_KEY = 'products-addon';

export const useProductsAddonQuery = ({ page, pageSize, search, orderBy }: ExpectedAny) => {
  const businessId = AuthService.getBusinessId();
  const queryKey = [
    PRODUCTS_ADDON_KEY,
    {
      page,
      pageSize,
      search,
      sort: orderBy,
      businessId,
    },
  ];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    { data: AddOnGroup[]; meta: ResponseMeta },
    Error
  >({
    queryKey,
    queryFn: () =>
      ProductService.getAddOnGroups({
        page,
        pageSize,
        sort: orderBy,
        search,
      }),
    retry: 0,
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
