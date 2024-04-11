import { useMutation } from '@tanstack/react-query';
import { ChatService } from '~app/services/api';

export const useLogoutMetaMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<ExpectedAny, Error>({
    mutationFn: () => {
      return ChatService.unlinkMeta();
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
