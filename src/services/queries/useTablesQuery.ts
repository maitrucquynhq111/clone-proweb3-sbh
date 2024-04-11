import { useQuery } from '@tanstack/react-query';
import { TableService } from '~app/services/api';

export const TABLE_KEY = 'table';

export const useTablesQuery = ({ sector_id, search }: { sector_id?: string; search: string }) => {
  const queryKey = [TABLE_KEY, { sector_id, search }];

  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    { data: Table[]; meta: ResponseMetaTable },
    Error
  >({
    queryKey,
    queryFn: () => TableService.getTables({ sector_id, search }),
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
