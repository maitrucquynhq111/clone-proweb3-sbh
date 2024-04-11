import { useQuery } from '@tanstack/react-query';
import { ProductService } from '~app/services/api';

const LINKED_PRODUCTS_ADDON = 'linked-product/get-list';

export const useLinkedProductAddonQuery = ({
  id,
  page,
  page_size,
}: {
  id: string;
  page: number;
  page_size: number;
}) => {
  const queryKey = [LINKED_PRODUCTS_ADDON, id];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery({
    queryKey,
    queryFn: () =>
      ProductService.getLinkedProductsAddOnGroup({
        id,
        search: '',
        page,
        pageSize: page_size,
      }),
    enabled: Boolean(id),
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
