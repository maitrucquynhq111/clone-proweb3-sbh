import { useMutation } from '@tanstack/react-query';
import { ChatService } from '~app/services/api';

export const useCreateLabelMessageMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<Label, Error, PendingLabel>({
    mutationFn: (data: PendingLabel) => {
      return ChatService.createLabel(data);
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
