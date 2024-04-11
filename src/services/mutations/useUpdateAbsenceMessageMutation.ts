import { useMutation } from '@tanstack/react-query';
import { ChatService } from '~app/services/api';

export const useUpdateAbsenceMessageMutation = () => {
  const { data, error, isLoading, isError, isSuccess, mutate, mutateAsync } = useMutation<
    ExpectedAny,
    Error,
    PendingAbsenceMessage
  >({
    mutationFn: (body: PendingAbsenceMessage) => {
      return ChatService.updateAbsenceMessage(body);
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
