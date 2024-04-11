import { useMutation } from '@tanstack/react-query';
import { ChatService } from '~app/services/api';

export const useUpdateQuickMessageMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    QuickMessageResponse,
    Error,
    { id: string; body: QuickMessageRequest }
  >({
    mutationFn: ({ id, body }: { id: string; body: QuickMessageRequest }) => {
      return ChatService.updateQuickMessage(body, id);
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
