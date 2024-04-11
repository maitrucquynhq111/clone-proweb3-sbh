import { useQuery } from '@tanstack/react-query';
import { InventoryService } from '~app/services/api';

export const PO_STAFFS = 'po_staffs';

export const useGetPoStaffs = ({ type }: { type: string }) => {
  const queryKey = [PO_STAFFS];

  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    InventoryStaffInfo[],
    Error
  >({
    queryKey,
    queryFn: () => InventoryService.getPoStaffs(type),
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
