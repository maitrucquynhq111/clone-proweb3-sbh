import { useQuery } from '@tanstack/react-query';
import { ProductService } from '~app/services/api';

export const PRODUCT_DETAIL_KEY = 'products/detail';

export const useProductDetailQuery = (id: string, refetchOnMount?: boolean) => {
  const queryKey = [PRODUCT_DETAIL_KEY, id];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery({
    queryKey,
    queryFn: () => ProductService.getProduct(id),
    enabled: Boolean(id),
    retry: 0,
    refetchOnMount: refetchOnMount,
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
