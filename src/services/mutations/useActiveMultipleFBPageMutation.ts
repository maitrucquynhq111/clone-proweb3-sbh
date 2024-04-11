import { useMutation } from '@tanstack/react-query';
import { ChatService } from '~app/services/api';

export const useActiveMultipleFBPageMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<ExpectedAny, Error>({
    mutationFn: (variables: ExpectedAny) => {
      return ChatService.activeListLinkSocial(variables);
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
