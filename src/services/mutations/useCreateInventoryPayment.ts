import { useMutation } from '@tanstack/react-query';
import { InventoryService } from '~app/services/api';

export const useCreateInventoryPayment = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    ExpectedAny,
    Error,
    PendingCreateInventoryPayment
  >({
    mutationFn: (body: PendingCreateInventoryPayment) => {
      return InventoryService.createInventoryPayment(body);
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
