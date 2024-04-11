import { useQuery } from '@tanstack/react-query';
import { ChatService } from '~app/services/api';

export const QUICK_MESSAGES_KEY = 'quick_messages';

export const useQuickMessagesQuery = () => {
  const { isLoading, error, data, isError, isFetching, isLoadingError } = useQuery<
    {
      data: Array<QuickMessageResponse>;
    },
    Error
  >({
    queryKey: [QUICK_MESSAGES_KEY],
    queryFn: ChatService.getQuickMessages,
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
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
