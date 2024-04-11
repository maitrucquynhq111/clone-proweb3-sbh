import { useQuery } from '@tanstack/react-query';
import { ContactService } from '~app/services/api';

export const CONTACT_IN_CHAT_KEY = 'contact_in_chat';

export const useGetContactInChatQuery = (sender_id: string, sender_type: string) => {
  const { isLoading, error, data, isError, isFetching, isLoadingError } = useQuery<Contact, Error>({
    queryKey: [
      CONTACT_IN_CHAT_KEY,
      {
        sender_id,
        sender_type,
      },
    ],
    queryFn: () => ContactService.getContactInChat(sender_id, sender_type),
    retry: 0,
    enabled: Boolean(sender_id && sender_id),
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
