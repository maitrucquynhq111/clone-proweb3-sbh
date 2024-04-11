import { useQuery } from '@tanstack/react-query';
import { InventoryService } from '~app/services/api';

export const LIST_STOCK_TAKE_KEY = 'stock_take';

export const useGetListStockTakeQuery = ({
  page,
  pageSize,
  search,
  startTime,
  endTime,
  objectType,
  status,
  staffIds,
}: ExpectedAny) => {
  const queryKey = [LIST_STOCK_TAKE_KEY, { page, pageSize, search, startTime, endTime, objectType, status, staffIds }];

  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    {
      data: InventoryStockTaking[];
      meta: ResponseMeta & InventoryStockTakingAnalytic;
    },
    Error
  >({
    queryKey,
    queryFn: () =>
      InventoryService.getListStockTaking({
        page,
        pageSize,
        search,
        startTime,
        endTime,
        objectType,
        status,
        staffIds,
      }),
    retry: 0,
    staleTime: 2000,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    meta: {
      ignoreError: true,
    },
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
