import { useQuery } from '@tanstack/react-query';
import { ContactService } from '~app/services/api';

export const CONTACT_DETAIL = 'contacts/detail';

export const useContactDetailQuery = (id: string, field?: string) => {
  const queryKey = [CONTACT_DETAIL, id, field];

  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery({
    queryKey,
    queryFn: () => ContactService.getContact(id, field),
    enabled: Boolean(id),
    retry: 0,
    refetchOnWindowFocus: false,
    keepPreviousData: false,
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
