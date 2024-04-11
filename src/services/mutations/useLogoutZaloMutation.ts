import { useMutation } from '@tanstack/react-query';
import { ChatService } from '~app/services/api';

export const useLogoutZaloMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<ExpectedAny, Error>({
    mutationFn: () => {
      return ChatService.unlinkZalo();
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
