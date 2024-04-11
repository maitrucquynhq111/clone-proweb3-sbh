import { useQuery } from '@tanstack/react-query';
import { InventoryService } from '~app/services/api';

export const CONTACTS_PURCHASE_ORDER_KEY = 'contacts-purchase-order';

export const useContactsPurchaseOrder = () => {
  const queryKey = [CONTACTS_PURCHASE_ORDER_KEY];

  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    { data: InventoryContactInfo[]; meta: ResponseMeta },
    Error
  >({
    queryKey,
    queryFn: () => InventoryService.getContactsPurchaseOrder(),
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
