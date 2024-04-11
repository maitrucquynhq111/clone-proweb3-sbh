import { useQuery } from '@tanstack/react-query';
import { ChatService } from '~app/services/api';

export const USING_CHATBOT_KEY = 'using_chatbot';

export const useGetUsingChatbotQuery = (business_has_page_id: string, ignoreError?: boolean) => {
  const queryKey = [
    USING_CHATBOT_KEY,
    {
      business_has_page_id,
    },
  ];
  const { isLoading, error, data, isError, isFetching, isLoadingError, refetch } = useQuery<
    ApplyChatbotResponse,
    Error
  >({
    queryKey,
    queryFn: () => ChatService.getUsingChatbot(business_has_page_id),
    retry: 0,
    enabled: Boolean(business_has_page_id),
    refetchOnWindowFocus: false,
    keepPreviousData: false,
    meta: {
      ignoreError: ignoreError,
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
