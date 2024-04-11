import { useQuery } from '@tanstack/react-query';
import { ContactService } from '~app/services/api';

export const LIST_CONTACT_DELIVERING_KEY = 'list_contact_delivering';

export const useGetListContactDeliveringAddress = (contact_id: string) => {
  const { isLoading, error, data, isError, isFetching, isLoadingError } = useQuery<ContactDeliveringAddress[], Error>({
    queryKey: [
      LIST_CONTACT_DELIVERING_KEY,
      {
        contact_id,
      },
    ],
    queryFn: () => ContactService.getListContactDeliveringAddress(contact_id),
    retry: 0,
    enabled: Boolean(contact_id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    meta: {
      ignoreError: true,
    },
  });

  return {
    isLoadingError,
    isFetching,
    isLoading,
    isError,
    error,
    data,
  };
};
