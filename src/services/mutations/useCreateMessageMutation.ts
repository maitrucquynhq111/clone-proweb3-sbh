import { useMutation } from '@tanstack/react-query';
import { ChatService } from '~app/services/api';

export const useCreateMessageMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    MessageResponse,
    Error,
    PendingMessages
  >({
    mutationFn: (variables: PendingMessages) => {
      return ChatService.sendMessage(variables);
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
