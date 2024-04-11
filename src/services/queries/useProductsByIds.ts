import { useQuery } from '@tanstack/react-query';
import { ProductService } from '~app/services/api';

export const PRODUCTS_IDS_KEY = 'products-ids';

export const useProductsByIds = ({
  page,
  pageSize,
  ids = [],
  refetchOnMount,
}: {
  page: number;
  pageSize: number;
  ids: string[];
  refetchOnMount?: boolean;
}) => {
  const queryKey = [
    PRODUCTS_IDS_KEY,
    {
      page,
      pageSize,
      ids,
    },
  ];

  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    { data: Product[]; meta: ResponseMeta },
    Error
  >({
    queryKey,
    queryFn: () =>
      ProductService.getProductsByIds({
        page,
        pageSize,
        ids,
      }),
    retry: 0,
    enabled: ids.length > 0,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    refetchOnMount,
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
