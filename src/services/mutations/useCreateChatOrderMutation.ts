import { useMutation } from '@tanstack/react-query';
import { OrderService } from '~app/services/api';

export const useCreateChatOrderMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    Order,
    Error,
    PendingChatOrderForm
  >({
    mutationFn: (variables: PendingChatOrderForm) => {
      return OrderService.createChatOrder(variables);
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
