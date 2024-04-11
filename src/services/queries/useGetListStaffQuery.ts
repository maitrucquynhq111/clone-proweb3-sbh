import { useQuery } from '@tanstack/react-query';
import { OrderService, AuthService } from '~app/services/api';

export const LIST_STAFF = 'list-staff';

export const useGetListStaffQuery = () => {
  const businessId = AuthService.getBusinessId() || '';
  const queryKey = [
    LIST_STAFF,
    {
      businessId,
    },
  ];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<{ data: Staff[] }>({
    queryKey,
    queryFn: () => OrderService.getListStaffs(),
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
