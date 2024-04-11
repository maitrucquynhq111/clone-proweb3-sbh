import { useMutation } from '@tanstack/react-query';
import { AuthService } from '~app/services/api';
import { ZALO_APP_ID } from '~app/configs';

export const useGetZaloTokenMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<ExpectedAny, Error>({
    mutationFn: (variables: ExpectedAny) => {
      return AuthService.getZaloToken({
        app_id: ZALO_APP_ID,
        code: variables.code,
        code_verifier: variables.verifier,
        grant_type: 'authorization_code',
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
