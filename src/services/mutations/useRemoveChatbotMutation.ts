import { useMutation } from '@tanstack/react-query';
import { ChatService } from '~app/services/api';

export const useRemoveChatbotMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<ExpectedAny, Error, string>({
    mutationFn: (id: string) => {
      return ChatService.removeChatbot(id);
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
