import { useMutation } from '@tanstack/react-query';
import { ChatService } from '~app/services/api';

export const useUpdateMessageMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    MessageResponse,
    Error,
    { id: string; message: string }
  >({
    mutationFn: ({ id, message }: { id: string; message: string }) => {
      return ChatService.updateMessage(id, message);
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
