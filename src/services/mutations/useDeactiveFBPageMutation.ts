import { useMutation } from '@tanstack/react-query';
import { ChatService } from '~app/services/api';

export const useDeactiveFBPageMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<ExpectedAny, Error>({
    mutationFn: (variables: ExpectedAny) => {
      return ChatService.linkOrUnlinkSocial(variables);
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
