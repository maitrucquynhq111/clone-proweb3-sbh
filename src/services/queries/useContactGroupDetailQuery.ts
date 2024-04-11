import { useQuery } from '@tanstack/react-query';
import { ContactService } from '~app/services/api';

export const CONTACT_GROUP_DETAIL_KEY = 'contact-group/detail';

export const useContactGroupDetailQuery = (id: string) => {
  const queryKey = [CONTACT_GROUP_DETAIL_KEY, id];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery({
    queryKey,
    queryFn: () => ContactService.getContactGroupDetail(id),
    enabled: Boolean(id),
    retry: 0,
    refetchOnWindowFocus: false,
    keepPreviousData: false,
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
