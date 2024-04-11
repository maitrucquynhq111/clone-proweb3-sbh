import { useQuery } from '@tanstack/react-query';
import { InventoryService, AuthService } from '~app/services/api';

export const INVENTORY_IMPORT_EXPORT_BOOK_KEY = 'inventory-import-export-book';

export const useInventoryImportBookQuery = ({
  page,
  pageSize,
  start_time,
  end_time,
  search,
  orderBy,
  is_staff = true,
  po_type = [],
  option = [],
  contact_id = [],
  object_type = [],
  payment_state = [],
  type,
  status = [],
}: ExpectedAny) => {
  const businessId = AuthService.getBusinessId();
  const queryKey = [
    INVENTORY_IMPORT_EXPORT_BOOK_KEY,
    {
      page,
      pageSize,
      start_time,
      end_time,
      search,
      sort: orderBy,
      businessId,
      is_staff,
      po_type,
      option,
      contact_id,
      object_type,
      payment_state,
      type,
      status,
    },
  ];

  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    { data: InventoryImportBook[]; meta: ResponseMeta },
    Error
  >({
    queryKey,
    queryFn: () =>
      InventoryService.getInventoryImportBook({
        page,
        pageSize,
        start_time,
        end_time,
        search,
        sort: orderBy,
        is_staff,
        po_type,
        option,
        contact_id,
        object_type,
        payment_state,
        type,
        status,
      }),
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
