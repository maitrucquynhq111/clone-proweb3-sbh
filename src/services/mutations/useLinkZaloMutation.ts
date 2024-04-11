import { useMutation } from '@tanstack/react-query';
import { ChatService } from '~app/services/api';

export const useLinkZaloMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<ExpectedAny, Error>({
    mutationFn: (variables: ExpectedAny) => {
      return ChatService.linkZalo({
        token: variables.token,
        refreshToken: variables.refreshToken,
        isUpsell: variables?.isUpsell || false,
      });
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
