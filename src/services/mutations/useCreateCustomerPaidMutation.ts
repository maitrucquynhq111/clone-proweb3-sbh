import { useMutation } from '@tanstack/react-query';
import { OrderService } from '~app/services/api';

export const useCreateCustomerPaidMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<
    CreateCustomPaid,
    Error,
    CreateCustomPaid
  >({
    mutationFn: (data: CreateCustomPaid) => {
      return OrderService.createCustomPaid(data);
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
