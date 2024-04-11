import { useMutation } from '@tanstack/react-query';
import { ChatService } from '~app/services/api';

export const useDeleteLabelMessageMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<ExpectedAny, Error>({
    mutationFn: (id: ExpectedAny) => {
      return ChatService.deleteLabel(id);
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
