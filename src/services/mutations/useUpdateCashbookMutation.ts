import { useMutation } from '@tanstack/react-query';
import { CashbookService } from '~app/services/api';

export const useUpdateCashbookMutation = () => {
  const { data, error, isLoading, isError, isSuccess, mutate, mutateAsync } = useMutation<
    JSONRecord<Cashbook>,
    Error,
    PendingCashbook
  >({
    mutationFn: (variable: PendingCashbook) => {
      return CashbookService.updateCashbook(variable.id || '', variable);
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
