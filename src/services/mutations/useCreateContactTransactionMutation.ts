import { useMutation } from '@tanstack/react-query';
import { ContactService } from '~app/services/api';

export const useCreateContactTransactionMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    ContactTransaction,
    Error,
    PendingContactTransaction
  >({
    mutationFn: (data: PendingContactTransaction) => {
      return ContactService.createContactTransaction(data);
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
