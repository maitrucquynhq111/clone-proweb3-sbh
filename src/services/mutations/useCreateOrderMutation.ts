import { useMutation } from '@tanstack/react-query';
import { OrderService } from '~app/services/api';

export const useCreateOrderMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    Order,
    Error,
    PendingOrderForm
  >({
    mutationFn: (variables: PendingOrderForm) => {
      return OrderService.createOrder(variables);
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
