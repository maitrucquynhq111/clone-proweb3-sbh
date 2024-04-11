import { useMutation } from '@tanstack/react-query';
import { CashbookService } from '~app/services/api';

export const useDeleteMultipleTransactionMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<ExpectedAny, Error>({
    mutationFn: (variables: ExpectedAny) => {
      return CashbookService.deleteMultiTransaction({
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
