import { useMutation } from '@tanstack/react-query';
import { OrderService } from '~app/services/api';

export const useUpdateOrderDetailMutation = () => {
  const { data, error, isLoading, isError, isSuccess, mutate, mutateAsync } = useMutation<
    Order,
    Error,
    { id: string; body: CreateOrderInput }
  >({
    mutationFn: ({ id, body }: { id: string; body: CreateOrderInput }) => {
      return OrderService.updateOrderDetail({ id, body });
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
