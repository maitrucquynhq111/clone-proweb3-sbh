import { useMutation } from '@tanstack/react-query';
import { ChatService } from '~app/services/api';

export const useUpdateFrequentlyQuestionMutation = () => {
  const { data, error, isLoading, isError, isSuccess, mutate, mutateAsync } = useMutation<
    FrequentlyQuestion,
    Error,
    FrequentlyQuestionParams
  >({
    mutationFn: ({ business_has_page_id, data, suggest_message_enable }: FrequentlyQuestionParams) => {
      return ChatService.createOrUpdateFrequentlyQuestion({ business_has_page_id, data, suggest_message_enable });
    },
  });

  return {
    isLoading,
    isSuccess,
    error,
    data,
    isError,
    mutate,
    mutateAsync,
  };
};
