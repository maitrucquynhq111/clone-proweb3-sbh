import { useQuery } from '@tanstack/react-query';
import { ProductService } from '~app/services/api';

const ADDON_GROUP_DETAIL = 'addon-group/detail';

export const useAddonGroupDetailQuery = (id: string) => {
  const queryKey = [ADDON_GROUP_DETAIL, id];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery({
    queryKey,
    queryFn: () => ProductService.getAddOnGroupDetail(id),
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
