import { useMutation } from '@tanstack/react-query';
import { OrderService } from '~app/services/api';

export const useUpdateOrderRefundMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    Order,
    Error,
    { id: string; body: UpdateOrderRefundBody }
  >({
    mutationFn: (variable: { id: string; body: UpdateOrderRefundBody }) => {
      return OrderService.updateOrderRefund({ id: variable.id, body: variable.body });
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
