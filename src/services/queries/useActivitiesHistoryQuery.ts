import { useQuery } from '@tanstack/react-query';
import { ContactService, AuthService } from '~app/services/api';

export const ACTIVITIES_HISTORY_KEY = 'activities-history';

export const useActivitiesHistoryQuery = ({ page, pageSize, contact_id }: ExpectedAny) => {
  const businessId = AuthService.getBusinessId();
  const queryKey = [
    ACTIVITIES_HISTORY_KEY,
    {
      page,
      pageSize,
      contact_id,
      businessId,
    },
  ];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    { data: ActivityHistory[]; meta: ResponseMeta },
    Error
  >({
    queryKey,
    queryFn: () =>
      ContactService.getActivitiesHistory({
        page,
        pageSize,
        contact_id,
      }),
    retry: 0,
    refetchOnWindowFocus: false,
    keepPreviousData: false,
    enabled: !!contact_id,
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
