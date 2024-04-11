import { useMutation } from '@tanstack/react-query';
import { CashbookService } from '~app/services/api';

export const useDeleteTransactionMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<ExpectedAny, Error>({
    mutationFn: (variables: ExpectedAny) => {
      return CashbookService.deleteCashbook(variables.id);
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
