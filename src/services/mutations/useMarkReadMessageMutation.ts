import { useMutation } from '@tanstack/react-query';
import { ChatService } from '~app/services/api';

export const useMarkReadMessageMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    { success: boolean },
    Error,
    MarkReadMessageParams
  >({
    mutationFn: (body: MarkReadMessageParams) => {
      return ChatService.markReadMessage(body);
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
