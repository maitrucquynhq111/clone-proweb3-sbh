import { useQuery } from '@tanstack/react-query';
import { ChatService } from '~app/services/api';

export const CHAT_BOTS_KEY = 'chat-bots';

export const useChatbotsQuery = () => {
  const { isLoading, error, data, isError, isFetching, isLoadingError } = useQuery<Chatbot[], Error>({
    queryKey: [CHAT_BOTS_KEY],
    queryFn: () => ChatService.getListChatbot(),
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
