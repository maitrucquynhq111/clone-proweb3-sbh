import { useQuery } from '@tanstack/react-query';
import { InventoryService } from '~app/services/api';

export const INVENTORY_DETAILS_KEY = 'inventory-details';

export const useInventoryDetailsQuery = ({ po_code, id }: { po_code: string; id: string }) => {
  const queryKey = [INVENTORY_DETAILS_KEY];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<InventoryDetail, Error>({
    queryKey,
    queryFn: () => InventoryService.getInventoryDetail({ po_code, id }),
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
