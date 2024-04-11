import { useQuery } from '@tanstack/react-query';
import { TableService } from '~app/services/api';

export const TABLE_ZONE_KEY = 'table-zone';

export const useTableZoneQuery = ({ title, page, pageSize, sort }: CommonParams & { title?: string }) => {
  const queryKey = [TABLE_ZONE_KEY, { title, page, pageSize, sort }];

  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    { data: TableZone[]; meta: ResponseMeta },
    Error
  >({
    queryKey,
    queryFn: () => TableService.getTableZone({ title, page, pageSize, sort }),
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
