import { useMutation } from '@tanstack/react-query';
import { OrderService } from '~app/services/api';

export const useUpdateOrderMutation = () => {
  const { data, error, isLoading, isError, isSuccess, mutate, mutateAsync } = useMutation<
    Order,
    Error,
    { id: string; body: UpdateOrderInput }
  >({
    mutationFn: ({ id, body }: { id: string; body: UpdateOrderInput }) => {
      return OrderService.updateOrder(id, body);
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
