import { useMutation } from '@tanstack/react-query';
import { ChatService } from '~app/services/api';

export const useCreateQuickMessageMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    QuickMessageResponse,
    Error,
    QuickMessageRequest
  >({
    mutationFn: (data: QuickMessageRequest) => {
      return ChatService.createQuickMessage(data);
    },
  });

  return {
    isLoading,
    isSuccess,
    isError,
    error,
    data,
    mutate,
    mutateAsync,
  };
};
