import { useMutation } from '@tanstack/react-query';
import { AuthService } from '~app/services/api';

export const useSwitchBussinessMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<ExpectedAny, Error>({
    mutationFn: (variables: ExpectedAny) => {
      return AuthService.switchBusiness(variables.business_id);
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
