import { useMutation } from '@tanstack/react-query';
import { ChatService } from '~app/services/api';

export const useUpdateAutoMessageMutation = () => {
  const { data, error, isLoading, isError, isSuccess, mutate, mutateAsync } = useMutation<
    ExpectedAny,
    Error,
    PendingAutoMessage
  >({
    mutationFn: (body: PendingAutoMessage) => {
      return ChatService.updateAutoMessage(body);
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
