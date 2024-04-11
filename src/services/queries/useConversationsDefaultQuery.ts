import { useQuery } from '@tanstack/react-query';
import { ChatService } from '~app/services/api';

export const CONVERSATIONS_DEFAULT_KEY = 'CONVERSATIONS_DEFAULT';

export const useConversationsDefaultQuery = () => {
  const queryKey = [CONVERSATIONS_DEFAULT_KEY];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<Conversation[], Error>({
    queryKey,
    queryFn: () => ChatService.getConversationsDefault(),
    retry: 0,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  return {
    isLoading,
    isLoadingError,
    isFetching,
    error,
    data: data || [],
    isError,
    queryKey,
    refetch,
  };
};
