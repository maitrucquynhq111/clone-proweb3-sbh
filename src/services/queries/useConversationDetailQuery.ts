import { useQuery } from '@tanstack/react-query';
import { ChatService } from '~app/services/api';

export const CONVERSATION_DETAIL_KEY = 'conversation_detail';

export const useConversationDetailQuery = (id: string) => {
  const queryKey = [
    CONVERSATION_DETAIL_KEY,
    {
      id,
    },
  ];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<Conversation, Error>({
    queryKey,
    queryFn: () => ChatService.getConversationDetail(id),
    enabled: Boolean(id),
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
