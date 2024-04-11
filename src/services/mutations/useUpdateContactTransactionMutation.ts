import { useMutation } from '@tanstack/react-query';
import { ContactService } from '~app/services/api';

export const useUpdateContactTransactionMutation = () => {
  const { data, error, isLoading, isError, isSuccess, mutate, mutateAsync } = useMutation<
    ContactTransaction,
    Error,
    PendingContactTransaction & { id: string }
  >({
    mutationFn: (variable: PendingContactTransaction & { id: string }) => {
      const { id, ...rest } = variable;
      return ContactService.updateContactTransaction(id, rest);
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
