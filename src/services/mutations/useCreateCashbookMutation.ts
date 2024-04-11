import { useMutation } from '@tanstack/react-query';
import { CashbookService } from '~app/services/api';

export const useCreateCashbookMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    Cashbook,
    Error,
    PendingCashbook
  >({
    mutationFn: (data: PendingCashbook) => {
      return CashbookService.createCashbook(data);
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
