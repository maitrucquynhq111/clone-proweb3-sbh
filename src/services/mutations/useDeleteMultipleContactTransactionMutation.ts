import { useMutation } from '@tanstack/react-query';
import { ContactService } from '~app/services/api';

export const useDeleteMultipleContactTransactionMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<ExpectedAny, Error>({
    mutationFn: (variables: ExpectedAny) => {
      return ContactService.deleteMultiContactTransaction({
        ids: variables.ids,
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
