import { useMutation } from '@tanstack/react-query';
import { ChatService } from '~app/services/api';

export const useApplyChatbotMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    ApplyChatbotResponse,
    Error,
    ApplyChatbotBody
  >({
    mutationFn: (variables: ApplyChatbotBody) => {
      return ChatService.applyChatbot(variables);
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
