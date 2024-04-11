import { useQuery } from '@tanstack/react-query';
import { AuthService } from '~app/services/api';

export const BUSSINESS_BY_ID = 'bussiness-by-id';

export const useGetBusinessById = () => {
  const businessId = AuthService.getBusinessId();

  const queryKey = [
    BUSSINESS_BY_ID,
    {
      businessId,
    },
  ];

  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<Business, Error>({
    queryKey,
    queryFn: () => AuthService.getBusinessById(businessId || ''),
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
