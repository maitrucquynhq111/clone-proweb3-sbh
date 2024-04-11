import { useMutation } from '@tanstack/react-query';
import { OrderService } from '~app/services/api';

export const useCancelCompleteOrderMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    Order,
    Error,
    { id: string; body: CancelCompleteOrderBody }
  >({
    mutationFn: (variable: { id: string; body: CancelCompleteOrderBody }) => {
      return OrderService.cancelCompleteOrder(variable.id, variable.body);
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
