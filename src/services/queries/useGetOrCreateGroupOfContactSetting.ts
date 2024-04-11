import { useQuery } from '@tanstack/react-query';
import { ContactService } from '~app/services/api';

export const GROUP_CONTACT_SETTING_KEY = 'group-contact-setting';

export const useGetOrCreateGroupOfContactSetting = (group_contact_id?: string) => {
  const queryKey = [
    GROUP_CONTACT_SETTING_KEY,
    {
      group_contact_id,
    },
  ];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<ContactGroupSetting, Error>(
    {
      queryKey,
      queryFn: () => ContactService.getOrCreateGroupOfContactSetting(group_contact_id || ''),
      enabled: Boolean(group_contact_id),
      staleTime: 2 * 60 * 1000,
      retry: 0,
      refetchOnWindowFocus: false,
      keepPreviousData: false,
    },
  );

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
