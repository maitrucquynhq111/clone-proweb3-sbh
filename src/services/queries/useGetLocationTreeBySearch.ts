import { useQuery } from '@tanstack/react-query';
import { ContactService } from '~app/services/api';

export const LOCATION_TREE_BY_SEARCH = 'location-tree-by-search';

export const useGetLocationTreeBySearch = ({ page, pageSize, name }: CommonParams) => {
  const queryKey = [
    LOCATION_TREE_BY_SEARCH,
    {
      name,
      page,
      pageSize,
    },
  ];

  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    { data: AddressLocation[]; meta: ResponseMeta },
    Error
  >({
    queryKey,
    queryFn: () =>
      ContactService.getLocationTreeBySearch({
        name,
        page,
        pageSize,
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
