import { useQuery } from '@tanstack/react-query';
import { PermissionService } from '~app/services/api';
import { useCacheMeQuery } from '~app/services/queries';

export const PERMISSIONS_KEY = 'permissions';

export const useGetCurrentPermission = (id: string) => {
  const { data: me } = useCacheMeQuery();
  const { user_info } = me || {};

  const queryKey = [PERMISSIONS_KEY];

  const { isLoading, error, data, isError, isFetching, isLoadingError } = useQuery<ExpectedAny, Error>({
    queryKey,
    queryFn: () =>
      PermissionService.getCurrentPermissions({
        userId: user_info.id || '',
      }),
    retry: 0,
    refetchOnWindowFocus: false,
    enabled: Boolean(id),
    refetchOnReconnect: false,
  });

  return {
    isLoadingError,
    isFetching,
    isLoading,
    error,
    data,
    isError,
  };
};
